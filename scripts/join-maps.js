const {readFileSync, readdirSync, writeFileSync} = require('fs');
const path = require('path');

const DIR = 'maps';
const OUTFILE = path.join(DIR, 'index.json');

const inputGeoJSON = readdirSync(DIR).filter(f => f !== 'index.json');
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

writeFileSync(OUTFILE, JSON.stringify(combinedMaps), 'utf8');
