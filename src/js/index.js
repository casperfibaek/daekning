/* global L _config */
/* eslint-env browser, es6 */
/* eslint-disable no-console, no-underscore-dangle */

const map = L.map('map', {
  zoomControl: false,
  doubleClickZoom: false,
  maxZoom: 16,
  minZoom: 7,
})
.setView([56.17919, 10.53588], 7);

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
},
  /* --- Overlays --- */
  {
    // ...
  },
  /* --- options --- */
  {
    collapsed: true,
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
    L.DomEvent.disableClickPropagation(msg);

    msg.innerHTML = `Sidst opdateret: ${_config.opdateret}`;
    msg.classList.add('updateMessage');

    return msg;
  },
});

new L.Control.UpdateMsg({
  position: 'bottomleft',
}).addTo(map);

map
  .on('zoomanim', (e) => {
    if (e.zoom > e.target._zoom) {
      document.getElementsByClassName('leaflet-control-zoom-in')[0].style.background = '#3b3d41';
    } else {
      document.getElementsByClassName('leaflet-control-zoom-out')[0].style.background = '#3b3d41';
    }
  })
  .on('zoomend', () => {
    document.getElementsByClassName('leaflet-control-zoom-in')[0].style.background = '#1e2028';
    document.getElementsByClassName('leaflet-control-zoom-out')[0].style.background = '#1e2028';
  })
  .on('click', (e) => {
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
  });

const getTicket = function getTicket(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://daekning.telia.dk/TelNetMap_Main_Tile/Default/GenerateTicket');
  xhr.send(null);

  xhr.onreadystatechange = function onreadystatechange() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(false, xhr.responseText.replace(/"/g, ''));
      } else {
        callback(`Error getting ticket (status: ${xhr.status})`);
      }
    }
  };
};

const nirasTiles = function nirasTiles(ticket, layerName) {
  const tiles = L.tileLayer('http://81.236.57.77/Telnetmap_TileService/GetTile.ashx?' +
      `Ticket=${ticket}&` +
      `LayerName=${layerName}&` +
      'Level={z}&' +
      'X={x}&' +
      'Y={y}',
    {
      maxZoom: 19,
      maxNativeZoom: 14,
      minZoom: 7,
    },
  );

  return tiles;
};

getTicket((err, reply) => {
  if (err) { throw Error(err); }
  if (_config.layerGroups.length !== 0) {
    const layerGroup = L.layerGroup().addTo(map);

    L.Control.CustomControl = L.Control.extend({
      onAdd() {
        const control = L.DomUtil.create('div');

        return control;
      },
    });

    const customControl = new L.Control.CustomControl({
      position: 'topright',
    }).addTo(map);

    const container = customControl.getContainer();
    L.DomEvent.disableClickPropagation(container);
    container.classList.add('legend');

    for (let i = 0; i < _config.layerGroups.length; i += 1) {
      const groupContainer = document.createElement('div');
      groupContainer.classList.add('legendGroupContainer');
      const curr = _config.layerGroups[i];
      if (curr.defaultOpen) {
        groupContainer.classList.add('open');
      } else {
        groupContainer.style.maxHeight = `${28}px`;
      }
      const heading = document.createElement('h4');
      heading.innerHTML = curr.layername;
      heading.classList.add('legendHeading');
      groupContainer.appendChild(heading);

      for (let j = 0; j < curr.layers.length; j += 1) {
        const legendElement = document.createElement('div');
        const legendImage = document.createElement('IMG');
        const legendText = document.createElement('p');
        const layer = nirasTiles(reply, curr.layers[j].name);

        if (curr.layers[j].default) {
          layerGroup.addLayer(layer);
          legendElement.classList.add('selected');
        }

        legendElement.classList.add('legendElement');
        legendElement.addEventListener('click', () => {
          if (!legendElement.classList.contains('selected')) {
            const selected = document.querySelectorAll('.selected,.legendElement');
            for (let w = 0; w < selected.length; w += 1) {
              selected[w].classList.remove('selected');
            }
            legendElement.classList.add('selected');
            layerGroup.eachLayer((oldLayer) => {
              layerGroup.removeLayer(oldLayer);
            });
            layerGroup.addLayer(layer);
            layerGroup.setZIndex(201);
            layer.setOpacity(0.5);
          }
        });
        legendImage.src = (curr.layers[j].image) ? curr.layers[j].image : 'css/images/Transparent.png';
        legendImage.alt = curr.layers[j].text;
        legendImage.classList.add('legendImage');
        legendText.classList.add('legendText');
        legendText.innerHTML = curr.layers[j].text;

        legendElement.appendChild(legendImage);
        legendElement.appendChild(legendText);
        groupContainer.appendChild(legendElement);
      }

      container.appendChild(groupContainer);

      if (curr.defaultOpen) {
        groupContainer.style.maxHeight = `${groupContainer.offsetHeight}px`;
      }

      heading.addEventListener('click', () => {
        if (groupContainer.classList.contains('open')) {
          const headingStyle = window.getComputedStyle(heading);
          const headingMargin = Number(headingStyle.marginTop.substring(0,
            headingStyle.marginTop.length - 2));
          groupContainer.style.maxHeight = `${18 + headingMargin}px`;
          groupContainer.classList.remove('open');
        } else {
          groupContainer.style.maxHeight = `${groupContainer.scrollHeight}px`;
          groupContainer.classList.add('open');
        }
      });
    }

    L.Control.OpacityControl = L.Control.extend({
      onAdd() {
        const control = L.DomUtil.create('div');
        return control;
      },
    });

    const opacityControl = new L.Control.OpacityControl({
      position: 'topright',
    }).addTo(map);

    const opacityContainer = opacityControl.getContainer();
    L.DomEvent.disableClickPropagation(opacityContainer);
    opacityContainer.classList.add('opacityControl');
    const circleSelector = document.createElement('div');
    circleSelector.classList.add('circleSelector');
    opacityContainer.appendChild(circleSelector);

    let initalOffset = parseFloat(window.getComputedStyle(circleSelector).left);
    let startClientX = circleSelector.getBoundingClientRect().left - initalOffset;

    function windowResized() {
      initalOffset = parseFloat(window.getComputedStyle(circleSelector).left);
      startClientX = circleSelector.getBoundingClientRect().left - initalOffset;
    }

    let timeoutCounter;
    window.onresize = function onresize() {
      clearTimeout(timeoutCounter);
      timeoutCounter = setTimeout(windowResized, 200);
    };

    function log(e) {
      event.preventDefault();
      event.stopPropagation();
      const newPosition = e.clientX;
      const difference = newPosition - startClientX;
      let move = difference;
      if (move > 200) { move = 200; } else if (move < 0) { move = 0; }
      circleSelector.style.left = `${move}px`;
      layerGroup.eachLayer((layer) => {
        layer.setOpacity(move / 200);
      });
    }
    function rem() {
      document.removeEventListener('mousemove', log);
      document.removeEventListener('mouseup', rem);
    }
    circleSelector.addEventListener('mousedown', () => {
      document.addEventListener('mousemove', log);
      document.addEventListener('mouseup', rem);
    });

    layerGroup.setZIndex(201);
    layerGroup.eachLayer((layer) => { layer.setOpacity(0.5); });
  }
});
