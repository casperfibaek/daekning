/* global L config dawa opacityControl layerControl */
/* eslint-env browser, es6 */
/* eslint-disable */

const map = L.map('map', {
  zoomControl: false,
  doubleClickZoom: false,
  maxZoom: 16,
  minZoom: 7,
})
.setView([56.23, 11.25], 7);

// First we add the basemaps.
L.control.layers({
  Baggroundskort: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 16,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }),
  'Baggroundskort sort/hvid': L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
    maxZoom: 16,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map),
  Flyfoto: L.tileLayer.wms('https://kortforsyningen.kms.dk/service?servicename=orto_foraar&client=QGIS&request=GetCapabilities&service=WMS&version=1.1.1&LOGIN=qgisdk&PASSWORD=qgisdk', {
    maxZoom: 16,
    layers: 'orto_foraar',
  }),
  'Flyfoto sort/hvid': L.tileLayer.wms('http://services.nirasmap.niras.dk/kortinfo/services/Wms.ashx?Site=NirasInternKort&Page=KI-Basis&Service=WMS&Version=1.1.1&service=WMS&layers=B346&format=image/png&srs=EPSG:3857&Request=getmap', {
    maxZoom: 16,
  }),
}, {}, { collapsed: true, position: 'topleft' }).addTo(map);

// L.control.zoom({
//   position: 'bottomright',
// }).addTo(map);

L.control.scale({
  position: 'bottomleft',
  imperial: false,
  metric: true,
}).addTo(map);

L.Control.UpdateMsg = L.Control.extend({
  onAdd() {
    const msg = L.DomUtil.create('div');
    L.DomEvent.disableClickPropagation(msg);

    msg.innerHTML = `Sidst opdateret: ${config.opdateret}`;
    msg.classList.add('updateMessage');

    return msg;
  },
});

new L.Control.UpdateMsg({
  position: 'bottomleft',
}).addTo(map);

map
  .on('click', (e) => {
    niras.getFeatureInfo(e, function(err, table) {
      if (err) { throw Error(err); }
      L.popup()
      .setLatLng(e.latlng)
      .setContent(table)
      .openOn(map);
    }, config)
  });

niras.getTicket((err, ticket) => {
  if (err) { throw Error(err); }
  if (config.layerGroups.length !== 0) {
    const layerGroup = L.layerGroup().addTo(map);
    dawa(map, 'searchBar', 200);
    layerControl(map, layerGroup, config, ticket, niras.getTiles);
    opacityControl(map, layerGroup);

    layerGroup.setZIndex(201);
    layerGroup.eachLayer((layer) => { layer.setOpacity(0.5); });
  }
}, config);
