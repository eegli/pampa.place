# pampa.place

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

## Host your own pampa.place

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

If you want to **use an existing GeoJSON file** that you did not create yourself, you may want to run it through the cleanup utility first. This also applies to the

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

## Contributing

You can fork and clone this repo and do whatever you want.

Contributions (bug fixes or new ideas) to this repo via PR are very welcome. Please [open a new issue](https://github.com/eegli/pampa.place/issues/new/choose) first.

In case of bug fixes, make sure to update tests. For new features, include tests.

### Testing

The following parts of the app can be treated as implementation details and/or non-essential logic and don't have to be tested explicitly

- Redux (`src/redux`)
- Service objects (`src/services`)
- App config (`src/config`)

## Technical notes - Map handling

Curious source code inspectors may have noticed that the handling of Google Map instances (and Street View) is different from what tutorials about Google Maps and React usually suggest.

### The problem - Memory leaks

Turns out, creating a new Google Map and attaching it to a `ref` object is a technique very prone to memory leaks. [It's a know issue in the Maps API v3.](https://stackoverflow.com/a/21192357)

### The solution - Global map references

`pampa.place` only needs a single map instance at a time. Thus, there is a **"service" object in the form of class with static methods** that is responsible for creating and holding a reference to the actual Google Map instance. All access to Google Map or Google Street View instances happens through the respective service objects.

Creating a new Google Map or Street View instance requires a HTML element to be passed to the constructur. Google will attach the instances to that element.

For each global instance, two divs are available somewhere in the root of the DOM tree (see `src/pages/_app.tsx`).

- A "container" div that wraps the inner "reference" div
- A "reference" div that the map is attached to when created

```html
<!-- Google Map - outer container and inner reference div -->
<div id="__GMAP__CONTAINER__" data-testid="__GMAP__CONTAINER__">
  <div id="__GMAP__" data-testid="__GMAP__" style="height:100%">
    <!-- Google puts the map here -->
  </div>
</div>

<!-- Same thing for Street View -->
<div id="__GSTV__CONTAINER__" data-testid="__GSTV__CONTAINER__">
  <div id="__GSTV__" data-testid="__GSTV__" style="height:100%"></div>
</div>
```

At some point, a new map or street view is instantiated using the "reference" divs:

```ts
// Simplified service objects for demo

const MapService = {
  map: new google.maps.Map(document.getElementById('__GMAP__')),
};

const StreetViewService = {
  sv: new google.maps.StreetViewPanorama(document.getElementById('__GSTV__')),
};
```

Let's look at the lifecycle of a React component that renders the map. Each component that renders the map makes use of the `useRef` hook but will attach the actual map via the service object:

1. The service object checks if a map already exists (access via getter)
2. If not, create it and attach it to reference div
3. If yes, return the map reference div that itself holds the map instance
4. The reference div is attached to the `ref.current` property of that very render
5. On unmount, the reference div is not destroyed but rather appended back to its container div

This way, only a single map (and street view) instance is created throughout the lifetime of the app.

### Lower cost, better development experience

- A significant benefit of this method is that, in `dev` mode, the warning only needs to be dismissed once.
- Also, **you'll only be charged once** for the initial instance creation. Subsequent map and street view interactions are free of charge (as of now). In essence, one map is instantiated and then just passed from one node in the tree to another when needed.
- Lastly, this method plays nicely together in test scenarios when we want to inspect what is happening to the map/street-view instance on one of the service objects.

This approach can be used for multiple map instances as well since usually, it is known how many maps need to be created (e.g. for dashboards).

## Technical notes - Map overlays

Similarly, each map overlay (e.g. polylines, markers, etc.) is created via the `MapOverlayService` object.
There are a few quirks when it comes to correctly destroying overlays, e.g. when a component unmounts. The overlay service objects provide a layer of abstraction that simplifies this. Also, they provide a nice way to inspect overlay instantiation and cleanup in unit testing.

## Credits

- [Fancy retro title by Yoav Kadosh on Codepen](https://codepen.io/ykadosh/pen/zYNxVKr?__cf_chl_jschl_tk__)
