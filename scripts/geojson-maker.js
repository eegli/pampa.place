const {readFileSync, readdirSync, writeFileSync} = require('fs');
const path = require('path');
const inquirer = require('inquirer');

const INPUT_DIR = 'data';
const OUT_DIR = 'maps';
const REQUIRED_PROP = 'name';

(async () => {
  console.log(
    `
    Every map used in the game needs at least a GeoJSON property with the name "${REQUIRED_PROP}".
    You'll be taken through each file in ./${INPUT_DIR} to decide what
    current property you want to use for "${REQUIRED_PROP}".
    `
  );
  for await (const fileName of readdirSync(INPUT_DIR)) {
    console.log(`Reading files from dir "./${INPUT_DIR}"...`);
    /** @type {import('@turf/helpers').FeatureCollection} */
    const geojson = JSON.parse(
      readFileSync(path.join(INPUT_DIR, fileName), 'utf8')
    );

    if (!geojson.features.length) {
      continue;
    }

    const properties = Object.keys(geojson.features[0].properties);

    console.log(`${fileName}: Available properties`);
    console.table(geojson.features[0].properties);

    await inquirer
      .prompt([
        {
          name: 'propToRename',
          message: `${fileName}: Select property to use as "${REQUIRED_PROP}":`,
          type: 'list',
          choices: properties,
          pageSize: properties.length,
        },
        {
          name: 'shouldDeleteOtherProps',
          message: `${fileName}: Do you want to delete other properties?`,
          type: 'confirm',
        },
        {
          name: 'shouldFilter',
          message: `${fileName}: Do you want to filter maps by a specific property (e.g. country code)?`,
          type: 'confirm',
        },
        {
          name: 'propToExclude',
          message: `${fileName}: Select property to filter by. Maps that don't match this property will be skipped:`,
          type: 'list',
          choices: properties,
          pageSize: properties.length,
          when: answers => answers.shouldFilter,
        },
        {
          name: 'propToExcludeValue',
          message: `${fileName}: Enter value for filter property:`,
          type: 'input',
          when: answers => answers.shouldFilter,
        },
        {
          name: 'shouldDeduplicate',
          message: `${fileName}: Do you want to deduplicate the maps based on ${REQUIRED_PROP}?`,
          type: 'confirm',
          default: false,
        },
        {
          name: 'newFileName',
          message: `${fileName}: (Optional) Enter new file name without extension (hit enter to skip):`,
          type: 'input',
          default: path.parse(fileName).name + '_new.json',
        },
      ])
      .then(
        ({
          propToRename,
          shouldDeleteOtherProps,
          shouldFilter,
          propToExclude,
          propToExcludeValue,
          shouldDeduplicate,
          newFileName,
        }) => {
          const newFeatures = geojson.features.reduce((acc, curr) => {
            const re = new RegExp(propToExcludeValue, 'ig');
            // Skip feature if filter is active
            if (shouldFilter && !curr.properties[propToExclude].match(re)) {
              return acc;
            }

            // Create REQUIRED_PROP property
            curr.properties[REQUIRED_PROP] = curr.properties[propToRename];

            // Don't add duplicate features
            if (
              shouldDeduplicate &&
              acc.find(
                f =>
                  f.properties[REQUIRED_PROP] === curr.properties[REQUIRED_PROP]
              )
            ) {
              return acc;
            }

            if (shouldDeleteOtherProps) {
              // Delete other properties
              Object.keys(curr.properties).forEach(prop => {
                if (prop !== REQUIRED_PROP) {
                  delete curr.properties[prop];
                }
              });
            }

            acc.push(curr);
            return acc;
          }, []);

          return {newFileName, newFeatures};
        }
      )
      .then(({newFileName, newFeatures}) => {
        geojson.features = newFeatures;

        writeFileSync(
          path.join(OUT_DIR, newFileName + '.json'),
          JSON.stringify(geojson),
          'utf8'
        );
      });
  }
})();
