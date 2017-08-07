/* global L _config */
/* eslint-env browser, es6 */
/* eslint-disable no-console, no-underscore-dangle */

const map = L.map('map', {
  zoomControl: false,
  doubleClickZoom: false,
  maxZoom: 19,
  minZoom: 7,
})
.setView([56.17919, 10.53588], 7);

L.control.layers(
  /* --- Baselayers --- */
  {
    OpenStreetMap: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      edgeBufferTiles: 2,
      updateWhenIdle: false,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }),
    'OpenStreetMap BW': L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
      maxZoom: 19,
      edgeBufferTiles: 2,
      updateWhenIdle: false,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map),
    Flyfoto: L.tileLayer.wms('http://kortforsyningen.kms.dk/service?servicename=orto_foraar&client=QGIS&request=GetCapabilities&service=WMS&version=1.1.1&LOGIN=qgisdk&PASSWORD=qgisdk', {
      maxZoom: 19,
      edgeBufferTiles: 2,
      updateWhenIdle: false,
      layers: 'orto_foraar',
    }),
  },
  /* --- Overlays --- */
  {
    // ...
  },
  /* --- options --- */
  {
    collapsed: false,
    position: 'topleft',
  }).addTo(map);

L.control.zoom({
  position: 'bottomright',
}).addTo(map);

L.control.scale({
  position: 'bottomleft',
  imperial: false,
  metric: true,
}).addTo(map);

L.Control.UpdateMsg = L.Control.extend({
  onAdd() {
    const msg = L.DomUtil.create('div');

    msg.innerHTML = `Sidst opdateret: ${_config.opdateret}`;
    msg.classList.add('updateMessage');

    return msg;
  },
});

L.control.UpdateMsg = function UpdateMsg(opts) {
  return new L.Control.UpdateMsg(opts);
};

L.control.UpdateMsg({ position: 'bottomleft' }).addTo(map);

map
  .on('zoomanim', (e) => {
    if (e.zoom > e.target._zoom) {
      document.getElementsByClassName('leaflet-control-zoom-in')[0].style.background = '#555';
    } else {
      document.getElementsByClassName('leaflet-control-zoom-out')[0].style.background = '#555';
    }
  })
  .on('zoomend', () => {
    document.getElementsByClassName('leaflet-control-zoom-in')[0].style.background = '#333';
    document.getElementsByClassName('leaflet-control-zoom-out')[0].style.background = '#333';
  })
  .on('click', (e) => {
    // const infoButton = document.getElementsByClassName('controlButton info')[0];
    // if (infoButton.getAttribute('enabled') === 'true') {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    const url = `http://daekning.telia.dk/TelNetMap_Main_Tile/Default/GetWmsFeatureInfo?wmsUrl=${
        encodeURIComponent('http://81.236.57.77/telnetmap_ext_services/kortinfo/Services/WMS.ashx?page=TeleWMS&Site=TS_DK&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&WIDTH=1&HEIGHT=1&INFO_FORMAT=text/xml&X=0&Y=0&srs=EPSG:4326&QUERY_LAYERS=16549&BBOX=')
        }${lng},${lat},${lng},${lat}&layerType=MapTiles&systems=LTE%2CUMTS&usages=OD`;

    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send(null);

    xhr.onreadystatechange = function onreadystatechange() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);

          let table = '<table>';

          for (let i = 0; i < response.length; i += 1) {
            table += '<tr>';
            table += `<td class="table-title">${response[i].split(':')[0]}</td>`;
            table += `<td>${response[i].split(':')[1]}</td>`;
            table += '</tr>';
          }

          table += '</table>';

          if (response.length > 0) {
            L.popup()
                .setLatLng(e.latlng)
                .setContent(table)
                .openOn(map);
          }
        } else {
          console.log(`Error getting featureInfo (status: ${xhr.status})`);
        }
      }
    };
    // }
  });
  
  dawa('searchContainer', map);
  
  const getTicket = function getTicket(callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://daekning.telia.dk/TelNetMap_Main_Tile/Default/GenerateTicket');
    xhr.send(null);

    xhr.onreadystatechange = function onreadystatechange() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const response = xhr.responseText;
          callback(response);
        } else {
          console.log(`Error getting ticket (status: ${xhr.status})`);
        }
      }
    };
  };

  getTicket((ticket) => {
    const outdoorSpeedControl = L.control.layers({}, {}, {
      collapsed: false,
      position: 'topright',
    }).addTo(map);
    const outdoorSpeedGroup = L.layerGroup();

    const nirasTiles = function nirasTiles(config, addToGroup) {
      const tiles = L.tileLayer('http://81.236.57.77/Telnetmap_TileService/GetTile.ashx?' +
        `Ticket=${ticket.replace(/"/g, '')}&` +
        `LayerName=${config.name}&` +
        'Level={z}&' +
        'X={x}&' +
        'Y={y}',
        {
          edgeBufferTiles: 2,
          updateWhenIdle: false,
          maxZoom: 19,
          maxNativeZoom: 14,
          minZoom: 7,
        });
      if (config.default && config.default === true) { tiles.addTo(map); }

      addToGroup.addLayer(tiles);
      return tiles;
    };

    for (let i = 0; i < _config.layers.length; i += 1) {
      const img = (_config.layers[i].image !== null) ?
      `<img src="${_config.layers[i].image}"/>` : '';

      outdoorSpeedControl.addBaseLayer(
        nirasTiles(_config.layers[i], outdoorSpeedGroup), `${img}  ${_config.layers[i].text}`);
    }

    outdoorSpeedGroup.setZIndex(201);
    outdoorSpeedGroup.eachLayer((layer) => {
      layer.setOpacity(0.5);
    });
  });
