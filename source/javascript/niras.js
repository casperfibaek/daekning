/* eslint-env browser */
/* eslint-disable prefer-destructuring, no-console */
import ajax from './xhrWrap';

const config = window.config;
const leaflet = window.L;

export default { // eslint-disable-line
  getTicket: async function getTicket() {
    try {
      const ticket = await ajax(config.connections.ticket);
      return ticket.replace(/"/g, '');
    } catch (err) {
      return Error(err);
    }
  },

  getTiles(ticket, layerName) {
    const tiles = leaflet.tileLayer(
      `${config.connections.tiles}Ticket=${ticket}&` +
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

  getFeatureInfo: async function getFeatureInfo(event, queryLayer, usage) {
    const lat = event.latlng.lat;
    const lng = event.latlng.lng;

    let url;
    if (queryLayer === 114) {
      url = `${config.connections.drift}${lng},${lat},${lng},${lat}`;
    } else {
      url =
        `${config.connections.feature
        }${encodeURIComponent(config.connections.featureOptions(queryLayer))}${lng},${lat},${lng},${lat}&layerType=MapTiles&systems=GSM,UMTS,LTE&usages=${usage}`;
    }

    try {
      const info = await ajax(url);
      console.log(info);
      const infoArray = JSON.parse(info);

      let table = '';

      if (infoArray.length > 0) {
        table += '<table>';

        infoArray.forEach((row) => {
          table += '<tr>';
          table += `<td class="table-title">${row.split(':')[0]}</td>`;
          table += `<td>${row.split(':')[1]}</td>`;
          table += '</tr>';
        });

        table += '</table>';
      }

      return table;
    } catch (err) {
      return err;
    }
  },
};
