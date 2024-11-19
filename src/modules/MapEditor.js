import { ContentEditor } from './ContentEditor';
import { marker } from 'leaflet';

export class MapEditor extends ContentEditor {
  editContent($tabContent, $taskElement) {
    const $mapContainer = $tabContent;
    const $mapElement = $mapContainer.querySelector('map-element');

    $mapElement.map.invalidateSize();
    $mapElement.map.setView($taskElement.location, 15);

    addMarkerToMap($mapElement, $taskElement);
  }
}

export var markers = {};

export function addMarkerToMap($mapElement, $taskElement) {
  const id = $taskElement.getAttribute('id');

  if (!markers[id]) {
    marker($taskElement.location).addTo($mapElement.map);
    markers[`${id}`] = true;
  }
}
