/* eslint-env browser */
window.config = {
	opdateret: 'Oktober 2017',
  connections: {
    ticket: 'http://daekning.tdc.dk/tdcnetmap_ext_tile/Default/GenerateTicket',
    tiles: 'http://192.66.38.54/TileService/GetTile.ashx?',
    feature: 'http://daekning.tdc.dk/tdcnetmap_ext_tile/Default/GetWmsFeatureInfo?wmsUrl=',
    featureOptions: queryLayer => `http://localhost/tdcnetmap_ext_services/kortinfo/services/WMS.ashx?page=TeleWMS&Site=TDCMOBIL&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&WIDTH=1&HEIGHT=1&INFO_FORMAT=text/xml&X=0&Y=0&srs=EPSG:4326&QUERY_LAYERS=${queryLayer}&BBOX=`,
  }, // 99
  layerGroups: [
    {
      layername: 'Datahastighed - Udendørs',
      defaultOpen: true,
      layers: [{
          name: '3G4G_speed_outdoor_all_MapTiler',
          text: 'Udenfor alle',
          default: true,
          query: 99,
          color: 'rgba(255, 255, 255, 0)',
        },{
          name: '3G4G_speed_outdoor_500Mbit_MapTiler',
          text: 'Udenfor 200+ mbits/s',
          query: 121,
          color: 'rgba(181, 130, 132, 1)',
        },{
          name: '3G4G_speed_outdoor_200Mbit_MapTiler',
          text: 'Udenfor 100-200 mbits/s',
          query: 117,
          color: 'rgba(198, 132, 132, 1)',
        },{
          name: '3G4G_speed_outdoor_100Mbit_MapTiler',
          text: 'Udenfor 50-100 mbits/s',
          query: 111,
          color: 'rgba(217, 132, 128, 1)',
        },{
          name: '3G4G_speed_outdoor_50mbit_Maptiler',
          text: 'Udenfor 30-50 mbits/s',
          query: 109,
          color: 'rgba(224, 151, 151, 1)',
        },{
          name: '3G4G_speed_outdoor_30mbit_MapTiler',
          text: 'Udenfor 20-30 mbits/s',
          query: 108,
          color: 'rgba(239, 170, 148, 1)',
        },{
          name: '3G4G_speed_outdoor_20mbit_MapTiler',
          text: 'Udenfor 10-20 mbits/s',
          query: 107,
          color: 'rgba(246, 204, 155, 1)',
        },{
          name: '3G4G_speed_outdoor_10mbit_MapTiler',
          text: 'Udenfor 5-10 mbits/s',
          query: 106,
          color: 'rgba(255, 228, 153, 1)',
        },{
          name: '3G4G_speed_outdoor_5mbit_MapTiler',
          text: 'Udenfor 2-5 mbits/s',
          query: 110,
          color: 'rgba(253, 236, 182, 1)',
        },
      ],
    },
    {
      layername: 'Datahastighed - Indendørs',
      layers: [{
          name: '3G4G_speed_indoor_all_MapTiler',
          text: 'Indenfor alle',
          query: 98,
          color: 'rgba(255, 255, 255, 0)',
        },{
          name: '3G4G_speed_indoor_500Mbit_MapTiler',
          text: 'Indenfor 200+ mbits/s',
          query: 120,
          color: 'rgba(181, 130, 132, 1)',
        },{
          name: '3G4G_speed_indoor_200Mbit_MapTiler',
          text: 'Indenfor 100-200 mbits/s',
          query: 119,
          color: 'rgba(198, 132, 132, 1)',
        },{
          name: '3G4G_speed_indoor_100Mbit_MapTiler',
          text: 'Indenfor 50-100 mbits/s',
          query: 100,
          color: 'rgba(217, 132, 128, 1)',
        },{
          name: '3G4G_speed_indoor_50mbit_Maptiler',
          text: 'Indenfor 30-50 mbits/s',
          query: 104,
          color: 'rgba(224, 151, 151, 1)',
        },{
          name: '3G4G_speed_indoor_30mbit_MapTiler',
          text: 'Indenfor 20-30 mbits/s',
          query: 103,
          color: 'rgba(239, 170, 148, 1)',
        },{
          name: '3G4G_speed_indoor_20mbit_MapTiler',
          text: 'Indenfor 10-20 mbits/s',
          query: 102,
          color: 'rgba(246, 204, 155, 1)',
        },{
          name: '3G4G_speed_indoor_10mbit_MapTiler',
          text: 'Indenfor 5-10 mbits/s',
          query: 101,
          color: 'rgba(255, 228, 153, 1)',
        },{
          name: '3G4G_speed_indoor_5mbit_MapTiler',
          text: 'Indenfor 2-5 mbits/s',
          query: 105,
          color: 'rgba(253, 236, 182, 1)',
        },
      ],
    },
    {
      layername: 'Teknologi - Udendørs',
      layers: [{
          name: 'All_outdoor_MapTiler',
          text: 'Udenfor alle',
          image: false,
          query: 95,
        },{
          name: '4G_outdoor_Maptiler',
          text: '4G Udenfor',
          query: 93,
          color: 'rgba(12, 66, 151, 0.5)',
        },{
          name: '3G_outdoor_Maptiler',
          text: '3G Udenfor',
          query: 91,
          color: 'rgba(102, 173, 211, 0.5)',
        },{
          name: '2G_outdoor_Maptiler',
          text: '2G Udenfor',
          query: 89,
          color: 'rgba(161, 219, 247, 0.5)',
        },
      ],
    },
    {
      layername: 'Teknologi - Indendørs',
      layers: [{
          name: 'All_indoor_MapTiler',
          text: 'Indenfor alle',
          image: false,
          query: 94,
        },{
          name: '4G_outdoor_Maptiler',
          text: '4G Indenfor',
          query: 92,
          color: 'rgba(12, 66, 151, 0.5)',
        },{
          name: '3G_outdoor_Maptiler',
          text: '3G Indenfor',
          query: 90,
          color: 'rgba(102, 173, 211, 0.5)',
        },{
          name: '2G_outdoor_Maptiler',
          text: '2G Indenfor',
          query: 88,
          color: 'rgba(161, 219, 247, 0.5)',
        },
      ],
    },
    {
      layername: 'Tale',
      layers: [{
          name: 'tele_outdoor_tale',
          text: 'Telefon udenfor',
          query: 97,
          color: 'rgba(126, 167, 68, 0.5)',
        },{
          name: 'tele_indoor_tale',
          text: 'Telefon indenfor',
          query: 96,
          color: 'rgba(126, 167, 68, 0.5)',
        },
      ],
    },
    {
      layername: 'Drift',
      layers: [{
          name: 'affected_open',
          text: 'Aktuelle fejl',
          color: 'rgba(251, 207, 62, 0.5)',
        },{
          name: 'affected_closed',
          text: 'Løste fejl',
          color: 'rgba(126, 201, 185, 1)',
        },
      ],
    },
  ],
};
