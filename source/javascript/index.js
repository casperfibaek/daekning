/* eslint-env browser */
/* eslint-disable import/no-unresolved */
import '../stylesheets/leaflet.css';
import '../stylesheets/dawa.css';
import '../stylesheets/custom.css';
/* eslint-enable import/no-unresolved */

import leaflet from './leaflet.min';
import config from './config';
import niras from './niras';
import dawa from './dawa';
import layerControl from './layerControl';
import opacityControl from './opacityControl';

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

new leaflet.Control.UpdateMsg({
  position: 'bottomleft',
})
  .addTo(map);

map
  .on('click', (e) => {
    niras.getFeatureInfo(e, (err, table) => {
      if (err) { throw Error(err); }
      if (table) {
        leaflet.popup()
          .setLatLng(e.latlng)
          .setContent(table)
          .openOn(map);
      }
    }, config);
  });

niras.getTicket((err, ticket) => {
  if (err) { throw Error(err); }
  if (config.layerGroups.length !== 0) {
    const layerGroup = leaflet.layerGroup().addTo(map);
    dawa(map, 'searchBar', 200);
    layerControl(map, layerGroup, config, ticket, niras.getTiles);
    opacityControl(map, layerGroup);

    layerGroup.setZIndex(201); // leaflet fix
  }
}, config);
