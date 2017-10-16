/* eslint-env browser */
/* global L */
import ajax from './xhrWrap';

const config = window.config;

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
    const tiles = L.tileLayer(
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

  getFeatureInfo: async function getFeatureInfo(event, queryLayer) {
    const lat = event.latlng.lat;
    const lng = event.latlng.lng;
    const url =
      `${config.connections.feature
      }${encodeURIComponent(config.connections.featureOptions(queryLayer))}${lng},${lat},${lng},${lat}&layerType=MapTiles&systems=LTE%2CUMTS&usages=OD`;

    try {
      const info = await ajax(url);
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
