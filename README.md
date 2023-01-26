![pampa.place](https://pampa.place/logo.png)

![GitHub top language](https://img.shields.io/github/languages/top/eegli/pampa.place?logo=ts) ![GitHub repo size](https://img.shields.io/github/repo-size/eegli/pampa.place) [![codecov](https://codecov.io/gh/eegli/pampa.place/branch/main/graph/badge.svg?token=8RPSUCWXEZ)](https://codecov.io/gh/eegli/pampa.place)

### A customizable multiplayer geography game. Figure out where in the pampa you are 🌍

# Overview

`pampa.place` is simple: Select a place - a country, a continent or just your hometown - and the game will abandon you somewhere in that place. Use Google Street View to figure out where you are.

The game can be played 100% for free. It only requires a Google Maps API key for the maps and street view data. As of now, **every Google accounts gets 200$ per month\*** to spend on the Google Maps Platform. The game's API consumption is optimized and allows you to play hundreds of games per month with the free tier (depending on how good you are).

_\*For up-to-date pricing, [check here.](https://developers.google.com/maps/documentation/javascript/usage-and-billing)_

There are three modes: _Friends and family_, _My key myself and I_ and _Dev_.

- Friends and family: You provide the API key and they only need a password to play.
- My key myself and I: Check out other people's places and bring your own key.
- Dev: Google Maps loads without key. This is good for development and testing and will not eat any quota.

The game comes preloaded with three GeoJSON datasets for the US states (20m resolution), the entire US (unknown res) and EU NUTS regions (3m resolution). The demo features US and Swiss regions.

- `geojson/raw/cb_2018_us_state_20m.json` (source: [US Census Bureau](https://www.census.gov/geographies/mapping-files/time-series/geo/carto-boundary-file.html))

- `geojson/raw/US-geojson-maps.ash.ms.json` (source: [geojson-maps.ash.ms](https://geojson-maps.ash.ms/))

- `geojson/raw/NUTS_RG_03M_2021_4326.json` (source: [Eurostat](https://ec.europa.eu/eurostat/web/gisco/geodata/reference-data/administrative-units-statistical-units/nuts))

# Custom maps

👉 [I just want to play and add new maps dynamically](https://pampa.place/about#how-to-customize)

👉 I want to self-host a game and add custom maps. Read below

# Host your own

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

# Custom maps

The game's map handling is based on the GeoJSON format. If you're completely new to GeoJSON, this is a very great guide to get started:

- [More than you ever wanted to know about GeoJSON](https://macwright.com/2015/03/23/geojson-second-bite.html)

You can get GeoJSON datasets from anywhere and include them as shown below as long as they are compatible.

In general, there are a few things to keep in mind when you bring your custom GeoJSON files:

1. All the data you add to your game will be included in the client bundle. If you include super detailed maps that are 10Mb in size, whoever visits your game will need to download those 10Mb and more.
2. All GeoJSON `Features` must be of type `Polygon` or `MultiPolygon`.
3. Google Maps uses the [WGS 84 / Pseudo-Mercator projection](https://en.wikipedia.org/wiki/Web_Mercator_projection). Custom GeoJSON FeatureCollections need to be in **EPGS 4326** projection.

## Map sources

For starters, this website is a great source for countries and entire continents. Kudos to [@AshKyd](https://github.com/AshKyd) for making this possible ❤️

- [geojson-maps.ash.ms](https://geojson-maps.ash.ms/)

If you have Shapefile maps (e.g. from the US Census Bureau), you can convert them to GeoJSON here:

- [https://ogre.adc4gis.com/](https://ogre.adc4gis.com/)

If you import GeoJSON from an external source, make sure to read the section about preparing maps below.

## Drawing maps

If you want super custom maps, you can **draw a polygon** here [https://geojson.io](https://geojson.io).

Make sure that for each polygon you draw, you add a `name` entry to the `property` object. This is a required property and is eventually used as display name for the map in the game.

```json
"properties": {
    "name": "My map"
}
```

On geojson.io, you may add as many `features` (maps) to the generated `FeatureCollection` as you want. Just be sure to give them individual names! Maps that you drew yourself can be directly put into the `geojson` folder in the root directory. You can skip the next step as they are already cleaned up and good to go.

## Preparing maps

If you want to **use an existing GeoJSON file** that you did not create yourself, you may want to run it through the cleanup utility first. Note that all maps in the `maps` folder have been processed already. If you want to include one of these maps, head to the section _adding maps to the game_.

Place your files in the `maps` in the root of this project. Then, run

```bash
yarn map <glob-pattern>
```

Where `<glob-pattern>` is a pattern that should match the files you want to process. See the [pattern matching lib](https://github.com/isaacs/node-glob) for more info.

You'll be taken through the steps to prepare your maps. GeoJSON files from other sources may not have the `name` property but it can easily be derived from another existing property. The utility will let you pick a property to use as `name`, clean up other unused properties and filter larger datasets, e.g. if you only want to include a specific country or region.

Your shiny new maps will automatically be available in the `maps/output` folder. The final step is to include them in the source code.

## Adding maps to the game

Go to `src/maps/index.ts`. New maps can be imported as follows:

```ts
import {generateMapData} from './helpers/generator';

export const MAPS = generateMapData(
  {
    // Path relative to project root
    collection: require('maps/regional/che-cantons.json'),
    category: 'Switzerland',
  },
  {
    collection: require('maps/regional/usa-states.json'),
    category: 'USA',
  }
);
```

Each map collection must provide a category. Since all maps are stored in one large object, the category is used to provide a more unique key and group it in the map selection dropdown. This way, multiple maps can have the same name as long as their categories are different. Maps belonging to the same category that share the same name will overwrite each other.

Categories are also used for some API endpoints that provide (meta) data for your maps. See: https://beta.pampa.place/api/maps/v1. Docs will follow.

# Varia

## Score calculation

The score is calculated based on [this exponential decay function](https://www.desmos.com/calculator/xlzbhq4xm0).

Max 5000 points can be achieved. How close one needs to get to the actual location depends on the map size. You can play with the `area` slider in Desmos to get a feeling for the relationship between distance and map size.

Note that, unfortunately, some user-submitted street view panoramas don't have precise coordinates. Even if you know the place very well and think you're spot on, it might happen you're not getting a perfect score.

I'm open to suggestions for a better formula as it's really just an approximation for what other geo games use, but it's okay for most cases.

# Contributing and technical notes

Read [the contribution guidelines](CONTRIBUTING.md).

# Credits

- [Fancy retro title by Yoav Kadosh on Codepen](https://codepen.io/ykadosh/pen/zYNxVKr?__cf_chl_jschl_tk__)
