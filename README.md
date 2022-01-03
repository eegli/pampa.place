![pampa.place](https://pampa.place/logo.png)

![GitHub top language](https://img.shields.io/github/languages/top/eegli/pampa.place?logo=ts) ![GitHub repo size](https://img.shields.io/github/repo-size/eegli/pampa.place) [![codecov](https://codecov.io/gh/eegli/pampa.place/branch/main/graph/badge.svg?token=8RPSUCWXEZ)](https://codecov.io/gh/eegli/pampa.place)

### A multiplayer geography game with custom map input. Select a map and find yourself stranded somewhere in that place. Figure out where in the pampa you are 🌍

## Overview

`pampa.place` is simple: Select a place and find yourself in a random Google Street View. Figure out where you are by placing the marker on the map.

`pampa.place` can be played 100% for free. It only requires a Google Maps API key for the maps and street view data. As of now, **every Google accounts gets 200$ per month\*** to spend on the Google Maps Platform. The game's API consumption is optimized and allows you to play hundreds of games per month with the free tier (depending on how good you are).

_\*For up-to-date pricing, [check here.](https://developers.google.com/maps/documentation/javascript/usage-and-billing)_

`pampa.place` has three modes: _Friends and family_, _My key myself and I_ and _Dev_.

- Friends and family: You provide the API key and they only need a password to play.
- My key myself and I: Check out other people's places and bring your own key.
- Dev: Google Maps loads without key. This is good for development and testing and will not eat any quota.

## Host your own

You need an API key for Google's `Maps JavaScript API`. It is highly recommended to restrict the key to specific domains. For local testing and development, you should get a separate key restricted to `localhost:3000/*`. The other key will be public and should be restricted to the domain under which your are hosting.

The easiest way to deploy a custom `pampa.place` is with Vercel.

1. [Get a Google Maps API key](https://developers.google.com/maps/documentation/javascript/get-api-key)
2. (Fork and) clone this repository
3. [Deploy to Vercel](https://nextjs.org/docs/deployment)
4. Add these two env variables to your Vercel project:

`MAPS_API_KEY` with the value for your production api key

`APP_ACCESS_PW` with the value for your password for friends and family

## Local testing and development

It makes sense to quickly test and preview your version of the game.
Create an `.env.local` file in the root directory and add these two:

```
MAPS_API_KEY=<your local API key>
APP_ACCESS_PW=<your local password>
```

## Adding custom maps

`pampa.place` comes preloaded with two GeoJSON datasets for both the US (states, 20m resolution) and EU (NUTS regions, 3m resolution).

- `geojson/raw/cb_2018_us_state_20m.json` (source: [US Census Bureau](https://www.census.gov/geographies/mapping-files/time-series/geo/carto-boundary-file.html))

- `geojson/raw/NUTS_RG_03M_2021_4326.json` (source: [Eurostat](https://ec.europa.eu/eurostat/web/gisco/geodata/reference-data/administrative-units-statistical-units/nuts))

You can also provide your own GeoJSON files. If you have Shapefile maps (e.g. from the US Census Bureau), you can convert them to GeoJSON here:

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

You may add as many `features` to the `FeatureCollection` in your custom GeoJSON as you want. Just be sure to give them individual names! Maps that you drew yourself can be directly put into the `geojson` folder in the root directory. You can skip the next step as they are already cleaned up and good to go.

### Preparing maps

If you want to **use an existing GeoJSON file** that you did not create yourself, you may want to run it through the cleanup utility first.

Place your files in the `geojson` folder in the root directory. Then, run

```bash
yarn scripts:make-maps
```

You'll be taken through the steps to prepare your maps. GeoJSON files from other sources may not have the `name` property but it can easily be derived from another existing property. The utility will let you pick a property to use as `name`, clean up other unused properties and filter larger datasets, e.g. if you only want to include a specific country or region.

Your shiny new maps will automatically be put into the `geojson` folder in the root directory. This folder is meant for processed files that are ready to be used in the game (the `raw` folder contains datasets from which other maps can be created). From there on, the final step is to include them in the source code.

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
    map: require('geojson/switzerland.json'),
    category: 'switzerland',
    transformer: swissMapsTransformer,
  },
  {map: require('geojson/alps.json'), category: 'alps'},
    // Add your map here...
  {...}
);
```

Each map may specify a custom transformer for its feature properties. For example, there is a map in the Swiss dataset that includes some forward slashes in its `name` property. In such a scenario, the transformer can fix that.

Additionally, a category needs to be provided. Since all maps are stored in one large object, the category is used to provide a more unique key. This way, multiple maps can have the same name as long as their category is the same. Maps belonging to the same category that share the same name will overwrite each other.

Categories are also used for some API endpoints that provide (meta) data for your maps. See: https://beta.pampa.place/api/maps/v1. Docs will follow.

## Contributing and technical notes

Read [the contribution guidelines](contributing.md).

## Credits

- [Fancy retro title by Yoav Kadosh on Codepen](https://codepen.io/ykadosh/pen/zYNxVKr?__cf_chl_jschl_tk__)
