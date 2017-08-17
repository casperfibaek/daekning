/* eslint-env browser, es6 */
/* global L */
const niras = { // eslint-disable-line
  getTicket(callback, config) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', config.connections.ticket);
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
  },
  getTiles(ticket, layerName, config) {
    const tiles = L.tileLayer(`${config.connections.tiles
        }Ticket=${ticket}&` +
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
  },
  getFeatureInfo(e, callback, config) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    const url =
      `${config.connections.feature
      }${encodeURIComponent(config.connections.featureOptions)}${lng},${lat},${lng},${lat}&layerType=MapTiles&systems=LTE%2CUMTS&usages=OD`;
    console.log(url);

    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send(null);

    xhr.onreadystatechange = function onreadystatechange() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (response.length > 1) {
              let table = '<table>';

              for (let i = 0; i < response.length; i += 1) {
                table += '<tr>';
                table += `<td class="table-title">${response[i].split(':')[0]}</td>`;
                table += `<td>${response[i].split(':')[1]}</td>`;
                table += '</tr>';
              }

              table += '</table>';
              callback(false, table);
            } else {
              callback(false, false); // no info.
            }
          } catch (err) {
            callback(Error(`Error parsing JSON data, ${err}`));
          }
        }
      }
    };
  },
};
