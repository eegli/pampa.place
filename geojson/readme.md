# This folder right here, officer

The original idea was to have the map/GeoJSON data live in a separate repository and include it in this repository as a submodule (the `maps` folder). This works nicely, however, when deploying to Vercel, it has problems fetching the submodule.

For now, the maps that I need for the game are just copied over and imported from this folder.
