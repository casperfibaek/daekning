/* eslint-env browser */
/* eslint-disable no-var, prefer-template */

window.config = {
  opdateret: 'Oktober 2017',
  clearSearchOnSelect: true,
  connections: {
    ticket: 'http://daekning.tdc.dk/tdcnetmap_ext_tile/Default/GenerateTicket',
    tiles: 'http://192.66.38.54/TileService/GetTile.ashx?',

    // Drift lagene
    drift: 'http://87.116.40.60/TdcNetMap_int_tst_services/kortinfo/services/Wms.ashx?Site=TDCMOBIL&Page=TeleWMS&Service=WMS&Version=1.3.0&Srs=EPSG:4326&Request=getfeatureinfo&query_Layers=668&Width=1&Height=1&x=0&y=0&info_format=text/xml&BBox=',

    // Alle andre lag
    feature: 'http://daekning.tdc.dk/tdcnetmap_ext_tile/Default/GetWmsFeatureInfo?wmsUrl=',
    featureOptions: function featureOptions(queryLayer) {
      var start = 'http://localhost/tdcnetmap_ext_services/kortinfo/services/WMS.ashx?page=TeleWMS&Site=TDCMOBIL&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&WIDTH=1&HEIGHT=1&INFO_FORMAT=text/xml&X=0&Y=0&srs=EPSG:4326&QUERY_LAYERS=';
      var end = '&BBOX=';
      return start + queryLayer + end;
    },
  },
  layerGroups: [
    {
      layername: 'Datahastighed - Udendørs',
      defaultOpen: true,
      layers: [
        {
          name: '3G4G_speed_outdoor_all_MapTiler',
          text: 'Udenfor alle',
          default: true,
          query: 99,
          usage: 'OD',
          color: 'rgba(255, 255, 255, 0)',
        }, {
          name: '3G4G_speed_outdoor_500Mbit_MapTiler',
          text: 'Udenfor 200+ mbits/s',
          query: 121,
          usage: 'OD',
          color: 'rgba(181, 130, 132, 1)',
        }, {
          name: '3G4G_speed_outdoor_200Mbit_MapTiler',
          text: 'Udenfor 100-200 mbits/s',
          query: 117,
          usage: 'OD',
          color: 'rgba(198, 132, 132, 1)',
        }, {
          name: '3G4G_speed_outdoor_100Mbit_MapTiler',
          text: 'Udenfor 50-100 mbits/s',
          query: 111,
          usage: 'OD',
          color: 'rgba(217, 132, 128, 1)',
        }, {
          name: '3G4G_speed_outdoor_50mbit_Maptiler',
          text: 'Udenfor 30-50 mbits/s',
          query: 109,
          usage: 'OD',
          color: 'rgba(224, 151, 151, 1)',
        }, {
          name: '3G4G_speed_outdoor_30mbit_MapTiler',
          text: 'Udenfor 20-30 mbits/s',
          query: 108,
          usage: 'OD',
          color: 'rgba(239, 170, 148, 1)',
        }, {
          name: '3G4G_speed_outdoor_20mbit_MapTiler',
          text: 'Udenfor 10-20 mbits/s',
          query: 107,
          usage: 'OD',
          color: 'rgba(246, 204, 155, 1)',
        }, {
          name: '3G4G_speed_outdoor_10mbit_MapTiler',
          text: 'Udenfor 5-10 mbits/s',
          query: 106,
          usage: 'OD',
          color: 'rgba(255, 228, 153, 1)',
        }, {
          name: '3G4G_speed_outdoor_5mbit_MapTiler',
          text: 'Udenfor 2-5 mbits/s',
          query: 110,
          usage: 'OD',
          color: 'rgba(253, 236, 182, 1)',
        },
      ],
    },
    {
      layername: 'Datahastighed - Indendørs',
      layers: [
        {
          name: '3G4G_speed_indoor_all_MapTiler',
          text: 'Indenfor alle',
          query: 98,
          usage: 'ID',
          color: 'rgba(255, 255, 255, 0)',
        }, {
          name: '3G4G_speed_indoor_500Mbit_MapTiler',
          text: 'Indenfor 200+ mbits/s',
          query: 120,
          usage: 'ID',
          color: 'rgba(181, 130, 132, 1)',
        }, {
          name: '3G4G_speed_indoor_200Mbit_MapTiler',
          text: 'Indenfor 100-200 mbits/s',
          query: 119,
          usage: 'ID',
          color: 'rgba(198, 132, 132, 1)',
        }, {
          name: '3G4G_speed_indoor_100Mbit_MapTiler',
          text: 'Indenfor 50-100 mbits/s',
          query: 100,
          usage: 'ID',
          color: 'rgba(217, 132, 128, 1)',
        }, {
          name: '3G4G_speed_indoor_50mbit_Maptiler',
          text: 'Indenfor 30-50 mbits/s',
          query: 104,
          usage: 'ID',
          color: 'rgba(224, 151, 151, 1)',
        }, {
          name: '3G4G_speed_indoor_30mbit_MapTiler',
          text: 'Indenfor 20-30 mbits/s',
          query: 103,
          usage: 'ID',
          color: 'rgba(239, 170, 148, 1)',
        }, {
          name: '3G4G_speed_indoor_20mbit_MapTiler',
          text: 'Indenfor 10-20 mbits/s',
          query: 102,
          usage: 'ID',
          color: 'rgba(246, 204, 155, 1)',
        }, {
          name: '3G4G_speed_indoor_10mbit_MapTiler',
          text: 'Indenfor 5-10 mbits/s',
          query: 101,
          usage: 'ID',
          color: 'rgba(255, 228, 153, 1)',
        }, {
          name: '3G4G_speed_indoor_5mbit_MapTiler',
          text: 'Indenfor 2-5 mbits/s',
          query: 105,
          usage: 'ID',
          color: 'rgba(253, 236, 182, 1)',
        },
      ],
    },
    {
      layername: 'Teknologi - Udendørs',
      layers: [
        {
          name: 'All_outdoor_MapTiler',
          text: 'Udenfor alle',
          query: 95,
          usage: 'OD',
        }, {
          name: '4G_outdoor_Maptiler',
          text: '4G Udenfor',
          query: 93,
          usage: 'OD',
          color: 'rgba(12, 66, 151, 0.5)',
        }, {
          name: '3G_outdoor_Maptiler',
          text: '3G Udenfor',
          query: 91,
          usage: 'OD',
          color: 'rgba(102, 173, 211, 0.5)',
        }, {
          name: '2G_outdoor_Maptiler',
          text: '2G Udenfor',
          query: 89,
          usage: 'OD',
          color: 'rgba(161, 219, 247, 0.5)',
        },
      ],
    },
    {
      layername: 'Teknologi - Indendørs',
      layers: [
        {
          name: 'All_indoor_MapTiler',
          text: 'Indenfor alle',
          query: 94,
          usage: 'ID',
        }, {
          name: '4G_outdoor_Maptiler',
          text: '4G Indenfor',
          query: 92,
          usage: 'ID',
          color: 'rgba(12, 66, 151, 0.5)',
        }, {
          name: '3G_outdoor_Maptiler',
          text: '3G Indenfor',
          query: 90,
          usage: 'ID',
          color: 'rgba(102, 173, 211, 0.5)',
        }, {
          name: '2G_outdoor_Maptiler',
          text: '2G Indenfor',
          query: 88,
          usage: 'ID',
          color: 'rgba(161, 219, 247, 0.5)',
        },
      ],
    },
    {
      layername: 'Tale',
      layers: [
        {
          name: 'tele_outdoor_tale',
          text: 'Telefon udenfor',
          query: 97,
          usage: 'OD',
          color: 'rgba(126, 167, 68, 0.5)',
        }, {
          name: 'tele_indoor_tale',
          text: 'Telefon indenfor',
          query: 96,
          usage: 'ID',
          color: 'rgba(126, 167, 68, 0.5)',
        },
      ],
    },
    {
      layername: 'Drift',
      layers: [
        {
          name: 'affected_open',
          text: 'Aktuelle fejl',
          usage: 'OD',
          query: 668,
          color: 'rgba(251, 207, 62, 0.5)',
        }, {
          name: 'affected_closed',
          text: 'Løste fejl',
          usage: 'OD',
          // query: 668,
          color: 'rgba(126, 201, 185, 1)',
        },
      ],
    },
  ],
};
