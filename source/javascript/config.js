/* eslint-disable */
export default {
	opdateret: 'August 2017',
  connections: {
    ticket: 'http://daekning.tdc.dk/tdcnetmap_ext_tile/Default/GenerateTicket',
    tiles: 'http://192.66.38.54/TileService/GetTile.ashx?',
    feature: 'http://daekning.tdc.dk/tdcnetmap_ext_tile/Default/GetWmsFeatureInfo?wmsUrl=',
    featureOptions:  'http://localhost/tdcnetmap_ext_services/kortinfo/services/WMS.ashx?page=TeleWMS&Site=TDCMOBIL&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&WIDTH=1&HEIGHT=1&INFO_FORMAT=text/xml&X=0&Y=0&srs=EPSG:4326&QUERY_LAYERS=99&BBOX=',
  }, // 99
  layerGroups: [
    {
      layername: 'Datahastighed - Udendørs',
      defaultOpen: true,
      layers: [{
          name: '3G4G_speed_outdoor_all_MapTiler',
          text: 'Udenfor alle',
          default: true,
          color: 'rgba(255, 255, 255, 0)',
        },{
          name: '3G4G_speed_outdoor_500Mbit_MapTiler',
          text: 'Udenfor 200+ mbits/s',
          color: 'rgba(181, 130, 132, 1)',
        },{
          name: '3G4G_speed_outdoor_200Mbit_MapTiler',
          text: 'Udenfor 100-200 mbits/s',
          color: 'rgba(198, 132, 132, 1)',
        },{
          name: '3G4G_speed_outdoor_100Mbit_MapTiler',
          text: 'Udenfor 50-100 mbits/s',
          color: 'rgba(217, 132, 128, 1)',
        },{
          name: '3G4G_speed_outdoor_50mbit_Maptiler',
          text: 'Udenfor 30-50 mbits/s',
          color: 'rgba(224, 151, 151, 1)',
        },{
          name: '3G4G_speed_outdoor_30mbit_MapTiler',
          text: 'Udenfor 20-30 mbits/s',
          color: 'rgba(239, 170, 148, 1)',
        },{
          name: '3G4G_speed_outdoor_20mbit_MapTiler',
          text: 'Udenfor 10-20 mbits/s',
          color: 'rgba(246, 204, 155, 1)',
        },{
          name: '3G4G_speed_outdoor_10mbit_MapTiler',
          text: 'Udenfor 5-10 mbits/s',
          color: 'rgba(255, 228, 153, 1)',
        },{
          name: '3G4G_speed_outdoor_5mbit_MapTiler',
          text: 'Udenfor 2-5 mbits/s',
          color: 'rgba(253, 236, 182, 1)',
        },
      ],
    },
    {
      layername: 'Datahastighed - Indendørs',
      layers: [{
          name: '3G4G_speed_indoor_all_MapTiler',
          text: 'Indenfor alle',
          color: 'rgba(255, 255, 255, 0)',
        },{
          name: '3G4G_speed_indoor_500Mbit_MapTiler',
          text: 'Indenfor 200+ mbits/s',
          color: 'rgba(181, 130, 132, 1)',
        },{
          name: '3G4G_speed_indoor_200Mbit_MapTiler',
          text: 'Indenfor 100-200 mbits/s',
          color: 'rgba(198, 132, 132, 1)',
        },{
          name: '3G4G_speed_indoor_100Mbit_MapTiler',
          text: 'Indenfor 50-100 mbits/s',
          color: 'rgba(217, 132, 128, 1)',
        },{
          name: '3G4G_speed_indoor_50mbit_Maptiler',
          text: 'Indenfor 30-50 mbits/s',
          color: 'rgba(224, 151, 151, 1)',
        },{
          name: '3G4G_speed_indoor_30mbit_MapTiler',
          text: 'Indenfor 20-30 mbits/s',
          color: 'rgba(239, 170, 148, 1)',
        },{
          name: '3G4G_speed_indoor_20mbit_MapTiler',
          text: 'Indenfor 10-20 mbits/s',
          color: 'rgba(246, 204, 155, 1)',
        },{
          name: '3G4G_speed_indoor_10mbit_MapTiler',
          text: 'Indenfor 5-10 mbits/s',
          color: 'rgba(255, 228, 153, 1)',
        },{
          name: '3G4G_speed_indoor_5mbit_MapTiler',
          text: 'Indenfor 2-5 mbits/s',
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
        },{
          name: '4G_outdoor_Maptiler',
          text: '4G Udenfor',
          color: 'rgba(181, 130, 132, 1)',
        },{
          name: '3G_outdoor_Maptiler',
          text: '3G Udenfor',
          color: 'rgba(224, 151, 151, 1)',
        },{
          name: '2G_outdoor_Maptiler',
          text: '2G Udenfor',
          color: 'rgba(253, 236, 182, 1)',
        },
      ],
    },
    {
      layername: 'Teknologi - Indendørs',
      layers: [{
          name: 'All_indoor_MapTiler',
          text: 'Indenfor alle',
          image: false,
        },{
          name: '4G_outdoor_Maptiler',
          text: '4G Indenfor',
          color: 'rgba(181, 130, 132, 1)',
        },{
          name: '3G_outdoor_Maptiler',
          text: '3G Indenfor',
          color: 'rgba(224, 151, 151, 1)',
        },{
          name: '2G_outdoor_Maptiler',
          text: '2G Indenfor',
          color: 'rgba(253, 236, 182, 1)',
        },
      ],
    },
    {
      layername: 'Tale',
      layers: [{
          name: 'tele_outdoor_tale',
          text: 'Telefon udenfor',
          color: 'rgba(224, 151, 151, 1)',
        },{
          name: 'tele_indoor_tale',
          text: 'Telefon indenfor',
          color: 'rgba(224, 151, 151, 1)',
        },
      ],
    },
    {
      layername: 'Drift',
      layers: [{
          name: 'affected_open',
          text: 'Aktuelle fejl',
          color: 'rgba(181, 130, 132, 1)',
        },{
          name: 'affected_closed',
          text: 'Løste fejl',
          color: 'rgba(126, 201, 185, 1)',
        },
      ],
    },
  ],
};
