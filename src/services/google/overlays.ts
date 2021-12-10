type AllowedOverlays = google.maps.Marker | google.maps.Polyline;

class MapOverlayService<T extends AllowedOverlays> {
  items: T[] = [];
  add(item: T) {
    this.items.push(item);
    return item;
  }
  clearAllItems() {
    this.items.forEach(item => item.setMap(null));
    this.items.length = 0;
  }
}

export const MarkerService = new MapOverlayService<google.maps.Marker>();
export const PolyLineService = new MapOverlayService<google.maps.Polyline>();
