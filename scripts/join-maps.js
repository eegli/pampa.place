const {readFileSync, readdirSync, writeFileSync, writeFile} = require('fs');
const path = require('path');

const {MAPS_OUTPUT_DIR} = require('./constants');

const DIR = 'maps';
const OUTFILE = path.join(MAPS_OUTPUT_DIR, 'index.json');

const inputGeoJSON = readdirSync(MAPS_OUTPUT_DIR).filter(
  f => f !== 'index.json'
);
const combinedMaps = inputGeoJSON.reduce(
  (acc, file) => {
    /** @type {import('@turf/helpers').FeatureCollection} */
    const raw = readFileSync(path.join(DIR, file), 'utf8');
    const geojson = JSON.parse(raw);

    acc.features.push(...geojson.features);
    return acc;
  },
  {type: 'FeatureCollection', features: []}
);

writeFile(OUTFILE, JSON.stringify(combinedMaps), 'utf8', () => {
  console.log(
    `Successfully combined \n${JSON.stringify(
      inputGeoJSON,
      null,
      2
    )}\ninto ${OUTFILE}`
  );
});
