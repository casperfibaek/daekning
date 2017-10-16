/* eslint-env browser */
/* eslint-disable no-console */
import '../stylesheets/leaflet.css';
import '../stylesheets/dawa.css';
import '../stylesheets/custom.css';
import leaflet from './leaflet';
import niras from './niras';
import dawa from './dawa';
import layerControl from './layerControl';
import opacityControl from './opacityControl';

const config = window.config;

const map = leaflet.map('map', {
  zoomControl: false,
  doubleClickZoom: false,
  maxZoom: 16,
  minZoom: 7,
})
  .setView([56.23, 11.25], 7);

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

(async () => {
  try {
    const ticket = await niras.getTicket();
    const layerGroup = leaflet.layerGroup().addTo(map);
    dawa(map, 'searchBar', 200);
    layerControl(map, layerGroup, ticket);
    opacityControl(map, layerGroup);
    map.on('click', async (event) => {
      let query;
      layerGroup.eachLayer((layer) => {
        const url = layer._url;
        const layerName = url.split('LayerName=')[1].split('&')[0];

        config.layerGroups.forEach((group) => {
          group.layers.forEach((_layer) => {
            if (_layer.name === layerName) { query = _layer.query; }
          });
        });
      });

      const info = await niras.getFeatureInfo(event, query);
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
