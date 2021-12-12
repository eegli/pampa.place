const path = require('path');

module.exports = {
  MAPS_INPUT_DIR: path.join(__dirname, '../', 'geojson', 'raw'),
  MAPS_OUTPUT_DIR: path.join(__dirname, '../', 'geojson'),
  GEOJSON_REQUIRED_PROP: 'name',
};
