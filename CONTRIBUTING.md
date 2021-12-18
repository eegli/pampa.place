# Contributing

PRs are generally welcome with bug fixes or new ideas. Please [open a new issue](https://github.com/eegli/pampa.place/issues/new/choose) first.

If you fix a bug, make sure to update tests. For new features, include tests.

## Testing

The following parts of the app can be treated as implementation details and/or non-essential logic and don't have to be tested explicitly

- Redux (`src/redux`)
- Service objects (`src/services`)
- App config (`src/config`)

## Technical notes - Map handling

Curious source code inspectors may have noticed that the handling of Google Map instances (and Street View) is different from what tutorials about Google Maps and React usually suggest.

### The problem - Memory leaks

Turns out, creating a new Google Map and attaching it to a `ref` object is a technique very prone to memory leaks. [It's a know issue in the Maps API v3.](https://stackoverflow.com/a/21192357)

### The solution - Global map references

`pampa.place` only needs a single map instance at a time. Thus, there is a **service object in the form of class with static methods** that is responsible to create and hold a reference to the actual Google Map instance.

In simplified, non-class form, it looks like this:

```ts
const MapService = {
    map: new google.maps.Map(...)
}
```

These reference service objects both need two things in order to function:

- A "container" div
- A "reference" div that the map is attached to when created

These divs are always available in the DOM tree (see `src/pages/_app.tsx`). The very first time a map instance is requested, these service objects create the actual instance in the "reference" div. When the component renders, the reference div is attached to the div `ref` of that very render.

On unmount, the reference div is not destroyed but rather appended to its container div. The next time the map instance needs to be rendered, the existing the reference is attached to the `ref` created by the component.

This way, only a single map (and street view) instance is created in the lifecycle of the app.

### Lower cost, better development experience

A significant benefit of this method is that, in `dev` mode, the warning only needs to be dismissed once.

Also, **you'll only be charged once** for the initial instance creation. Subsequent map and street view interactions are free of charge (as of now). In essence, one map is instantiated and then just passed from one node in the tree to another when needed.

Lastly, this method plays nicely together in test scenarios when we want to inspect what is happening to the map/street-view instance on one of the service objects.
