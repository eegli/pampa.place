const { readFileSync, readdirSync } = require('fs');
const path = require('path');
const inquirer = require('inquirer');

const mapDir = 'maps';
const required = 'name';

(async () => {
  for await (const fileName of readdirSync(mapDir)) {
    /** @type {import('@turf/helpers').FeatureCollection} */
    const geojson = JSON.parse(
      readFileSync(path.join(mapDir, fileName), 'utf8')
    );

    if (!geojson.features.length) {
      continue;
    }

    if (geojson.features[0].properties[required]) {
      console.log(
        `Skipping file "${fileName}"": Already has property ${required}`
      );
      continue;
    }

    const choices = Object.entries(geojson.features[0].properties).map(
      ([key, value]) => `${key} - (Example: ${value})`
    );

    await inquirer.prompt([
      {
        name: 'name',
        message: `${fileName}: What property do you want to select?`,
        type: 'list',
        choices,
      },
    ]);
  }
})();
