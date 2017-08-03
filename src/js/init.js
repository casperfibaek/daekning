/* global L map _config */
/* eslint-env browser, es6 */
/* eslint-disable no-console, no-underscore-dangle */

const init = function init() {
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

    const nirasTiles = function nirasTiles(layername, addLayerToMap, addToGroup) {
      const tiles = L.tileLayer('http://81.236.57.77/Telnetmap_TileService/GetTile.ashx?' +
        `Ticket=${ticket.replace(/"/g, '')}&` +
        `LayerName=${layername}&` +
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
      if (addLayerToMap === true) { tiles.addTo(map); }

      addToGroup.addLayer(tiles);
      return tiles;
    };

    for (let i = 0; i < _config.layers.length; i += 1) {
      const img = (_config.layers[i].image !== null) ?
      `<img src="${_config.layers[i].image}"/>` : '';

      outdoorSpeedControl.addBaseLayer(
        nirasTiles(_config.layers[i].name, _config.layers[i].default, outdoorSpeedGroup), `${img}  ${_config.layers[i].text}`);
    }

    outdoorSpeedGroup.setZIndex(201);
    outdoorSpeedGroup.eachLayer((layer) => {
      layer.setOpacity(0.5);
    });
  });
};

init();
