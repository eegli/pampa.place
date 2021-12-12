# pampa.place

![GitHub top language](https://img.shields.io/github/languages/top/eegli/pampa.place?logo=ts) [![codecov](https://codecov.io/gh/eegli/pampa.place/branch/main/graph/badge.svg?token=8RPSUCWXEZ)](https://codecov.io/gh/eegli/pampa.place) ![GitHub repo size](https://img.shields.io/github/repo-size/eegli/pampa.place)

Customizable multiplayer geography game 🌍

## Host your own pampa.place

TODO

## Adding custom maps

`pampa.place` comes preloaded with two GeoJSON datasets for both the US (states, 20m resolution) and EU (NUTS regions, 3m resolution).

- `geojson/cb_2018_us_state_20m.json` (source: [US Census Bureau](https://www.census.gov/geographies/mapping-files/time-series/geo/carto-boundary-file.html))

- `geojson/NUTS_RG_03M_2021_4326.json` (source: [Eurostat](https://ec.europa.eu/eurostat/web/gisco/geodata/reference-data/administrative-units-statistical-units/nuts))

You can of course also provide your own GeoJSON source. The links above point to many more interesting geo data sets. If you have Shapefile maps (e.g. from the US Census Bureau), you can convert them to GeoJSON here:

- [https://ogre.adc4gis.com/](https://ogre.adc4gis.com/)

If you're completely new to the GeoJSON format, this is a very great guide to get started:

- [More than you ever wanted to know about GeoJSON](https://macwright.com/2015/03/23/geojson-second-bite.html)

### Projections and EPGS standards⚠️

In general, there are two things to keep in mind:

1. All the data you add to your custom game will be included in the client bundle. If you include super detailed maps that are 10Mb in size, whoever visits your game will need to download those 10Mb and more.
2. Google Maps uses the [WGS 84 / Pseudo-Mercator projection](https://en.wikipedia.org/wiki/Web_Mercator_projection). Custom GeoJSON FeatureCollections need to be in **EPGS 4326** projection.

### Drawing maps

If you want quick and easy maps, you can **draw a polygon** here [https://geojson.io](https://geojson.io).

Make sure that for each polygon you draw, you add a `name` entry to the `property` object. This is a required property and is eventually used as display name for the map in the game.

```json
"properties": {
    "name": "My map"
}
```

You may add as many `features` to the `FeatureCollection` in your custom GeoJSON as you want. Just be sure to give them individual names! Maps that you drew yourself can be directly put into the `maps` folder in the root directory. You can skip the next step as they are already cleaned up and good to go.

### Preparing maps

If you want to **use an existing GeoJSON file** that you did not create yourself, you may want to run it through the cleanup utility first.

Place your files in the `geojson` folder in the root directory. Then, run

```bash
yarn scripts:make-maps
```

You'll be taken through the steps to prepare your maps. GeoJSON files from other sources may not have the `name` property yet but it can easily be derived from another existing property. The utility will let you pick a property to use as `name`, clean up other unused properties and filter larger datasets, e.g. if you only want to include a specific country or region.

Your shiny new maps will automatically be put into the `maps` folder in the root directory. From there on, the final step is to include them in the source code.

### Adding maps to the game

Go to `src/config/maps.ts`. New maps can be imported as follows:

```ts
/* Example map configuration */

import {computeMapData, computeMapIds} from './helpers/creator';
import {MapDataCollection, MapIdCollection, PropertyTransformer} from './types';

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

Additionally, a category needs to be provided. Since all maps are stored in one large object, the category is used to provide a more unique key. This way, multiple maps can have the same name as long as their category is the same. Maps belonging to the same category that share the same name will overwrite each other.

Categories are also used for some API endpoints that provide (meta) data for your maps. See: https://beta.pampa.place/api/maps/v1 (TODO docs)

## Contributing

Read [CONTRIBUTING.md](https://github.com/eegli/pampa.place/blob/main/CONTRIBUTING.md).

## Further reading

- [NUTS Classification](https://ec.europa.eu/eurostat/web/nuts/background)

## Credits

- [Fancy retro title by Yoav Kadosh on Codepen](https://codepen.io/ykadosh/pen/zYNxVKr?__cf_chl_jschl_tk__)

## Vercel and NextJS

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
