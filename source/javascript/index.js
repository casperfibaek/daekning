/* eslint-env browser */
/* eslint-disable no-console */
import '../stylesheets/dawa.css';
import '../stylesheets/custom.css';
import niras from './niras';
import dawa from './dawa';
import layerControl from './layerControl';
import opacityControl from './opacityControl';

const config = window.config;
const leaflet = window.L;

const map = leaflet.map('map', {
  zoomControl: false,
  doubleClickZoom: false,
  maxZoom: 16,
  minZoom: 7,
})
  .setView([56.23, 11.25], 7);

window.map = map;

leaflet.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
  subdomains: 'abcd',
  maxZoom: 19,
}).addTo(map).setZIndex(150);

leaflet.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
  subdomains: 'abcd',
  maxZoom: 19,
}).addTo(map).setZIndex(400);

leaflet.control.scale({
  position: 'bottomleft',
  imperial: false,
  metric: true,
}).addTo(map);

leaflet.Control.UpdateMsg = leaflet.Control.extend({
  onAdd() {
    const msg = leaflet.DomUtil.create('div');
    leaflet.DomEvent.disableClickPropagation(msg);

    msg.innerHTML = `Sidst opdateret: ${config.opdateret}`;
    msg.classList.add('updateMessage');

    return msg;
  },
});

new leaflet.Control.UpdateMsg({ position: 'bottomleft' }).addTo(map);

const menu = document.getElementById('menu');
menu.addEventListener('click', () => {
  const opacity = document.querySelector('.leaflet-control.opacityControl');
  const legend = document.querySelector('.leaflet-control.legend');
  if (opacity.classList.contains('display-none') || legend.classList.contains('display-none')) {
    opacity.classList.remove('display-none'); legend.classList.remove('display-none');
  } else {
    opacity.classList.add('display-none'); legend.classList.add('display-none');
  }
});

(async () => {
  try {
    const layerGroup = leaflet.layerGroup().addTo(map);
    dawa(map, 'searchBar', 200);
    const ticket = await niras.getTicket();

    layerControl(map, layerGroup, ticket);
    opacityControl(map, layerGroup);
    map.on('click', async (event) => {
      let queryLayer;
      let usage;
      layerGroup.eachLayer((layer) => {
        const url = layer._url;
        const layerName = url.split('LayerName=')[1].split('&')[0];

        for (let w = 0; w < config.layerGroups.length; w += 1) {
          let found = false;
          for (let i = 0; i < config.layerGroups[w].layers.length; i += 1) {
            if (config.layerGroups[w].layers[i].name === layerName) {
              queryLayer = config.layerGroups[w].layers[i].query;
              usage = config.layerGroups[w].layers[i].usage;
              found = true;
              break;
            }
            if (found) { break; }
          }
        }
      });

      const info = await niras.getFeatureInfo(event, queryLayer, usage);
      if (info.length > 0) {
        leaflet.popup()
          .setLatLng(event.latlng)
          .setContent(info)
          .openOn(map);
      }
    });
  } catch (err) {
    console.error(err);
  }
})();
