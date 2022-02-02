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
