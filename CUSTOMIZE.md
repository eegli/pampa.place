# Adding custom maps

## Data sources

`Pampa.place` comes preloaded with two GeoJSON datasets for both the US (states, 20m resolution) and EU (NUTS regions, 3m resolution). The datasets are also available here:

- [US GeoJSON data (2010)](https://eric.clst.org/tech/usgeojson/)
- [EU GeoJSON data (2021)](https://gisco-services.ec.europa.eu/distribution/v2/nuts/nuts-2021-files.html)

Of course, you can also provide your own GeoJSON source.

## Projections and EPGS standards⚠️

In general, there are two things to keep in mind:

1. All the data you add to your custom game will be included in the client bundle. If you include super detailed maps that are 10Mb in size, whoever visits your game will need to download that 10Mb and more.
2. Google Maps uses the [WGS 84 / Pseudo-Mercator projection](https://en.wikipedia.org/wiki/Web_Mercator_projection). Custom GeoJSON FeatureCollections need to be in **EPGS 4326** projection. This is also what Google seems to [use internally for it's Earth engine.](https://developers.google.com/earth-engine/guides/projections)

## Drawing maps

If you want quick and easy maps, you can draw a polygon here [https://geojson.io](https://geojson.io) and save the JSON output as a file.

Make sure that for each polygon or multipolygon you draw, you add a `name` entry to the `property` object. Every map needs this property! Eventually, this is the display name for your map in the game.

```json
"properties": {
    "name": "France"
   },
```

## Preparing maps

Once you have your custom GeoJSON files, place them in the `geojson` folder in the root directory. Then, run

```bash
yarn scripts:make-maps
```

You'll be taken through the steps to prepare your maps. You can also clean up other properties and filter larger datasets, e.g. if you only want to include a specific country or region.

Your shiny new maps will automatically be put into the `maps` folder in the root directory. From there on, the final step is to include them in the source code.

## Adding maps to the game

Go to `src/config/maps.ts`. New maps can be imported as already shown:

```ts
/* Example map configuration */

// Optional: A property transformer
const swissMapsTransformer: PropertyTransformer = p => {
  if (p.name.includes('/')) {
    p.name = p.name.split('/')[0];
  }
};

export const MAPS: MapDataCollection = computeMapData(
  {
    map: require('../../maps/switzerland.json'),
    category: 'switzerland',
    transformer: swissMapsTransformer,
  },
  // Add your map here...
  {...}
);
```

Each map may specify a custom transformer for its feature properties. For example, there is a map in the Swiss dataset that includes some forward slashes in its `name` property. In such a scenario, the transformer can fix that.

Additionally, a category needs to be provided. Since all maps are stored in one large object, the category is used to provide a more unique key. This way, you can have maps with the same name but in different categories.

Categories are also used for some API endpoints that provide (meta) data for your maps. See: https://beta.pampa.place/api/maps/v1 (TODO docs)
