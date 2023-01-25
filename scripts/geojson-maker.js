const {
  promises: {readdir, readFile, writeFile},
} = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const {
  MAPS_INPUT_DIR,
  MAPS_OUTPUT_DIR,
  GEOJSON_REQUIRED_PROP,
} = require('./constants');

(async () => {
  console.log(
    `
    Every map used in the game needs at least a GeoJSON property with the name "${GEOJSON_REQUIRED_PROP}".
    You'll be taken through each input file to decide what
    current property you want to use for "${GEOJSON_REQUIRED_PROP}".
    `
  );
  const fileNames = await readdir(MAPS_INPUT_DIR);
  console.log(`Reading files from dir "./${MAPS_INPUT_DIR}"...`);

  for (const fileName of fileNames) {
    const raw = await readFile(path.join(MAPS_INPUT_DIR, fileName), 'utf8');
    /** @type {import('@turf/helpers').FeatureCollection} */
    const geojson = JSON.parse(raw);

    if (!geojson.features.length) {
      return;
    }
    const {shouldConvertFile} = await inquirer.prompt([
      {
        name: 'shouldConvertFile',
        message: `Do you want to convert ${fileName}?`,
        type: 'confirm',
      },
    ]);

    if (!shouldConvertFile) {
      continue;
    }

    const properties = Object.keys(geojson.features[0].properties);

    console.log(`${fileName}: Available properties`);
    console.table(geojson.features[0].properties);

    const {
      propToRename,
      shouldDeleteOtherProps,
      shouldFilter,
      propToExclude,
      propToExcludeValue,
      shouldSplit,
      newFileName,
    } = await inquirer.prompt([
      {
        name: 'propToRename',
        message: `${fileName}: Select property to use as "${GEOJSON_REQUIRED_PROP}":`,
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
        name: 'shouldSplit',
        message: `${fileName}: Do you want to to save each feature as a separate file?`,
        type: 'confirm',
      },
      {
        name: 'newFileName',
        message: `${fileName}: (Optional) Enter new file name without extension (hit enter to skip):`,
        type: 'input',
        default: path.parse(fileName).name + '_new.json',
        when: answers => !answers.shouldSplit,
      },
    ]);

    const newFeatures = geojson.features.reduce((acc, curr) => {
      const re = new RegExp(propToExcludeValue, 'ig');
      // Skip feature if filter is active
      if (shouldFilter && !curr.properties[propToExclude].match(re)) {
        return acc;
      }

      // Create GEOJSON_REQUIRED_PROP property
      curr.properties[GEOJSON_REQUIRED_PROP] = curr.properties[propToRename];

      if (shouldDeleteOtherProps) {
        // Delete other properties
        Object.keys(curr.properties).forEach(prop => {
          if (prop !== GEOJSON_REQUIRED_PROP) {
            delete curr.properties[prop];
          }
        });
      }

      acc.push(curr);
      return acc;
    }, []);

    geojson.features = newFeatures;

    if (shouldSplit) {
      for (const feature of geojson.features) {
        await writeFile(
          path.join(
            MAPS_OUTPUT_DIR,
            feature.properties[GEOJSON_REQUIRED_PROP] + '.json'
          ),
          JSON.stringify(feature),
          'utf8'
        );
      }
    } else {
      await writeFile(
        path.join(MAPS_OUTPUT_DIR, newFileName + '.json'),
        JSON.stringify(geojson),
        'utf8'
      );
    }
  }
})();
