This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Todos

- Use react-use

The maps and related data conform to the [GeoJSON standard](https://en.wikipedia.org/wiki/GeoJSON). In terms of geometry, points are specified as [lng,lat]. This is different from Google Maps, which usually defines points as [lat,lng].

## Links

- EPSG:4326 (WGS84, coordinates in decimal degrees)
- [Cantons Data](https://gisco-services.ec.europa.eu/distribution/v2/nuts/geojson/NUTS_RG_03M_2021_4326.geojson)
- [NUTS Regions 2021](https://gisco-services.ec.europa.eu/distribution/v2/nuts/nuts-2021-units.html)
- [NUTS Classification](https://ec.europa.eu/eurostat/web/nuts/background)
- [More map data](https://hub.arcgis.com/datasets/252471276c9941729543be8789e06e12_0/explore?location=6.177935%2C-7.522465%2C4.59)
- [GeoJSON stuff](https://macwright.com/2015/03/23/geojson-second-bite.html#features)
- [https://geojson.io/](https://geojson.io/)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
