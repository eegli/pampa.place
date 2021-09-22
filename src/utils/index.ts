/* export function getRandomCoords(data: MapBounds): MapLatLng {
  const lat = randomize(data.latMin, data.latMax);
  const lng = randomize(data.lngMin, data.lngMax);
  return { lat, lng };
}

function randomize(min: number, max: number) {
  const rand = Math.random() * (max - min) + min;
  return parseFloat(rand.toFixed(4));
}

//Returns the area of a polygon in square kilometers
export function calculateArea(edges: MapEdges) {
  const NW = new google.maps.LatLng(edges.NW);
  const NE = new google.maps.LatLng(edges.NE);
  const SE = new google.maps.LatLng(edges.SE);
  const SW = new google.maps.LatLng(edges.SW);
  const area = google.maps.geometry.spherical.computeArea([NW, NE, SE, SW]);

  return area * 1e-6;
}

// Returns the distance between two points in meters
export function calculateDistance(loc1: MapLatLng, loc2: MapLatLng) {
  const from = new google.maps.LatLng(loc1);
  const to = new google.maps.LatLng(loc2);
  const dist = google.maps.geometry.spherical.computeDistanceBetween(from, to);
  return dist;
} */

// Area in square kilometers, distance in meters
// https://www.desmos.com/calculator/xlzbhq4xm0
export function calculateScore(a: number, d: number) {
  if (d < 0) return 0;
  const c = a * Math.sqrt(d) + Math.log(d ** 2 + 1);
  const score = 5000 * Math.E ** -(d / c);

  return Math.round(score);
}

export function formatDist(meters: number, toFixed = 1) {
  if (meters < 0) return '-';
  if (meters < 1000) {
    return meters.toFixed(toFixed) + ' m';
  }
  return (meters / 1000).toFixed(toFixed) + ' km';
}

export function max(num: number, limit: number) {
  return num >= limit ? limit : num;
}

export function id(): string {
  const array = new Uint32Array(8);
  window.crypto.getRandomValues(array);
  let str = '';
  for (let i = 0; i < array.length; i++) {
    str += (i < 2 || i > 5 ? '' : '-') + array[i].toString(16).slice(-4);
  }
  return str;
}
