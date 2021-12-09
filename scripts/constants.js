const path = require('path');

module.exports = {
  MAPS_INPUT_DIR: path.join(__dirname, '../', 'geojson'),
  MAPS_OUTPUT_DIR: path.join(__dirname, '../', 'maps'),
  GEOJSON_REQUIRED_PROP: 'name',
};
