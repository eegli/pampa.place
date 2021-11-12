const {readFileSync, readdirSync, writeFileSync} = require('fs');
const path = require('path');
const inquirer = require('inquirer');

const inputDir = 'data';
const outDir = 'maps';
const required = 'name';

(async () => {
  for await (const fileName of readdirSync(inputDir)) {
    console.log(`Reading files from dir "./${inputDir}"...`);
    /** @type {import('@turf/helpers').FeatureCollection} */
    const geojson = JSON.parse(
      readFileSync(path.join(inputDir, fileName), 'utf8')
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
          message: `${fileName}: Select property to use as "${required}":`,
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
          name: 'shouldFilterBy',
          message: `${fileName}: Do you want to filter by a property (e.g. country)?`,
          type: 'confirm',
        },
        {
          name: 'filterByProp',
          message: `${fileName}: Select property to filter by:`,
          type: 'list',
          choices: properties,
          pageSize: properties.length,
          when: answers => answers.shouldFilterBy,
        },
        {
          name: 'filterByPropValue',
          message: `${fileName}: Enter value for filter property:`,
          type: 'input',
          when: answers => answers.shouldFilterBy,
        },
        {
          name: 'newFileName',
          message: `${fileName}: (Optional) Enter new file name without extension:`,
          type: 'input',
          default: path.parse(fileName).name + '_new.json',
        },
      ])

      .then(
        ({
          propToRename,
          shouldDeleteOtherProps,
          shouldFilterBy,
          filterByProp,
          filterByPropValue,
          newFileName,
        }) => {
          const newFeatures = geojson.features.reduce((acc, curr) => {
            const re = new RegExp(filterByPropValue, 'ig');
            // Skip feature if filter is active
            if (shouldFilterBy && !curr.properties[filterByProp].match(re)) {
              return acc;
            }

            // Create required property
            curr.properties[required] = curr.properties[propToRename];
            delete curr.properties[propToRename];

            if (shouldDeleteOtherProps) {
              // Delete other properties
              Object.keys(curr.properties).forEach(prop => {
                if (prop !== required) {
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
          path.join(outDir, newFileName + '.json'),
          JSON.stringify(geojson),
          'utf8'
        );
      });
  }
})();
