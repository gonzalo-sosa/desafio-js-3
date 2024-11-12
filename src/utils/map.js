import * as L from "leaflet";

export function createMap(
  container,
  latitude = -34.61315,
  longitude = -58.67723
) {
  const map = L.map(container, {}).setView([latitude, longitude], 13, {
    animate: true,
  });

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    minZoom: 10,
    maxZoom: 20,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  return map;
}

export function editContentToMap($taskElement) {
  editViewToMap($taskElement);
  addMarkerToMap($taskElement);
}

export function editViewToMap($taskElement) {
  window.LMap.setView($taskElement.location, 15);
}

export var markers = {};

export function addMarkerToMap($taskElement) {
  const id = $taskElement.getAttribute("id");

  if (!markers[id]) {
    L.marker($taskElement.location).addTo(window.LMap);
    markers[`${id}`] = true;
  }
}
