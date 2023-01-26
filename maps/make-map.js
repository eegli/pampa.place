const {
  promises: {readFile, writeFile, mkdir},
  existsSync,
} = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const glob = require('glob').sync;

const pattern = process.argv[2] || '';
const MAPS_INPUT_DIR = __dirname;
const MAPS_OUTPUT_DIR = path.join(__dirname, 'output');
const GEOJSON_REQUIRED_PROP = 'name';

(async () => {
  if (!existsSync(MAPS_OUTPUT_DIR)) await mkdir(MAPS_OUTPUT_DIR);

  console.log(
    `
    Every map used in the game needs at least a GeoJSON property with the name "${GEOJSON_REQUIRED_PROP}".
    You'll be taken through each input file to decide what current property you want to use for "${GEOJSON_REQUIRED_PROP}"
    Other than that, this script lets you filter available GeoJSON features in each collection and sort the resulting data.
    `
  );
  const fileNames = glob(pattern, {cwd: MAPS_INPUT_DIR}).filter(file =>
    file.endsWith('json')
  );

  console.log(`Reading files from dir "${MAPS_INPUT_DIR}"`);
  console.log(fileNames);

  for (const fileName of fileNames) {
    const raw = await readFile(path.join(MAPS_INPUT_DIR, fileName), 'utf8');
    /**  @typedef {import('@turf/helpers').FeatureCollection} FeatCol */
    /**  @typedef {import('@turf/helpers').Feature} Feat */
    /** @type {FeatCol | Feat} */
    let geojson = JSON.parse(raw);

    // Treat every input as a FeatureCollection
    if (geojson.type === 'Feature') {
      geojson = {
        type: 'FeatureCollection',
        features: [geojson],
      };
    }

    if (!geojson.features?.length) {
      return;
    }

    const properties = Object.keys(geojson.features[0].properties);

    console.log(`${fileName}: Available properties`);
    console.table(geojson.features[0].properties);

    let {
      propToRename,
      shouldDeleteOtherProps,
      shouldFilter,
      propToExclude,
      propToExcludeValue,
      shouldSplit,
      propForNewFileName,
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
        pageSize: 15,
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
        name: 'propForNewFileName',
        message: `${fileName}: What property should be used as the new file name?`,
        type: 'list',
        choices: properties,
        pageSize: 15,
        when: answers => answers.shouldSplit,
      },
      {
        name: 'newFileName',
        message: `${fileName}: (Optional) Enter new file name without extension (hit enter to skip):`,
        type: 'input',
        default: path.parse(fileName).name,
        when: answers => !answers.shouldSplit,
      },
    ]);

    /**  @type {import('@turf/helpers').Feature[]} */
    const newFeatures = geojson.features
      .reduce((acc, curr) => {
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
            if (prop !== GEOJSON_REQUIRED_PROP && prop !== propForNewFileName) {
              delete curr.properties[prop];
            }
          });
        }

        acc.push(curr);
        return acc;
      }, [])
      .sort((a, b) =>
        a.properties[GEOJSON_REQUIRED_PROP].localeCompare(
          b.properties[GEOJSON_REQUIRED_PROP]
        )
      );

    geojson.features = newFeatures;
    const safePathRegex = /[/\\?%*:|"<> ]/gi;

    if (shouldSplit) {
      for (const feature of geojson.features) {
        const mapName = feature.properties[propForNewFileName];
        const fileName = mapName.replace(safePathRegex, '-').toLowerCase();
        // Save each feature as a FeatureCollection
        await writeFile(
          path.join(MAPS_OUTPUT_DIR, fileName + '.json'),
          JSON.stringify({
            type: 'FeatureCollection',
            features: [feature],
          }),
          'utf8'
        );
      }
    } else {
      const fileName = newFileName.replace(safePathRegex, '-').toLowerCase();
      await writeFile(
        path.join(MAPS_OUTPUT_DIR, fileName + '.json'),
        JSON.stringify(geojson),
        'utf8'
      );
    }
  }
})();
