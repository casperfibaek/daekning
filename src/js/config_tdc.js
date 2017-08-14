/* eslint-disable */
const config = {
	opdateret: 'August 2017',
  connections: {
    ticket: 'http://daekning.tdc.dk/tdcnetmap_ext_tile/Default/GenerateTicket',
    tiles: 'http://192.66.38.54/TileService/GetTile.ashx?',
    feature: 'http://daekning.tdc.dk/tdcnetmap_ext_tile/Default/GetWmsFeatureInfo?wmsUrl=',
    featureOptions: 'http://localhost/tdcnetmap_ext_services/kortinfo/services/WMS.ashx?page=TeleWMS&Site=TDCMOBIL&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&WIDTH=1&HEIGHT=1&INFO_FORMAT=text/xml&X=0&Y=0&srs=EPSG:4326&QUERY_LAYERS=99&BBOX=',
  },
  layerGroups: [
    {
      layername: 'Datahastighed - Udendørs',
      defaultOpen: true,
      layers: [{
          name: '3G4G_speed_outdoor_all_MapTiler',
          text: 'Udenfor alle',
          image: false,
          default: true,
        },{
          name: '3G4G_speed_outdoor_500Mbit_MapTiler',
          text: 'Udenfor 200+ mbits/s',
          image: 'css/images/tdc/Speed_200_500Mbit.png',
        },{
          name: '3G4G_speed_outdoor_200Mbit_MapTiler',
          text: 'Udenfor 100-200 mbits/s',
          image: 'css/images/tdc/Speed_100_200Mbit.png',
        },{
          name: '3G4G_speed_outdoor_100Mbit_MapTiler',
          text: 'Udenfor 50-100 mbits/s',
          image: 'css/images/tdc/Speed_50_100Mbit.png',
        },{
          name: '3G4G_speed_outdoor_50mbit_Maptiler',
          text: 'Udenfor 30-50 mbits/s',
          image: 'css/images/tdc/Speed_30_50Mbit.png',
        },{
          name: '3G4G_speed_outdoor_30mbit_MapTiler',
          text: 'Udenfor 20-30 mbits/s',
          image: 'css/images/tdc/Speed_20_30Mbit.png',
        },{
          name: '3G4G_speed_outdoor_20mbit_MapTiler',
          text: 'Udenfor 10-20 mbits/s',
          image: 'css/images/tdc/Speed_10_20Mbit.png',
        },{
          name: '3G4G_speed_outdoor_10mbit_MapTiler',
          text: 'Udenfor 5-10 mbits/s',
          image: 'css/images/tdc/Speed_5_10Mbit.png',
        },{
          name: '3G4G_speed_outdoor_5mbit_MapTiler',
          text: 'Udenfor 2-5 mbits/s',
          image: 'css/images/tdc/Speed_2_5Mbit.png',
        },
      ],
    },
    {
      layername: 'Datahastighed - Indendørs',
      layers: [{
          name: '3G4G_speed_indoor_all_MapTiler',
          text: 'Indenfor alle',
          image: false,
        },{
          name: '3G4G_speed_indoor_500Mbit_MapTiler',
          text: 'Indenfor 200+ mbits/s',
          image: 'css/images/tdc/Speed_200_500Mbit.png',
        },{
          name: '3G4G_speed_indoor_200Mbit_MapTiler',
          text: 'Indenfor 100-200 mbits/s',
          image: 'css/images/tdc/Speed_100_200Mbit.png',
        },{
          name: '3G4G_speed_indoor_100Mbit_MapTiler',
          text: 'Indenfor 50-100 mbits/s',
          image: 'css/images/tdc/Speed_50_100Mbit.png',
        },{
          name: '3G4G_speed_indoor_50mbit_Maptiler',
          text: 'Indenfor 30-50 mbits/s',
          image: 'css/images/tdc/Speed_30_50Mbit.png',
        },{
          name: '3G4G_speed_indoor_30mbit_MapTiler',
          text: 'Indenfor 20-30 mbits/s',
          image: 'css/images/tdc/Speed_20_30Mbit.png',
        },{
          name: '3G4G_speed_indoor_20mbit_MapTiler',
          text: 'Indenfor 10-20 mbits/s',
          image: 'css/images/tdc/Speed_10_20Mbit.png',
        },{
          name: '3G4G_speed_indoor_10mbit_MapTiler',
          text: 'Indenfor 5-10 mbits/s',
          image: 'css/images/tdc/Speed_5_10Mbit.png',
        },{
          name: '3G4G_speed_indoor_5mbit_MapTiler',
          text: 'Indenfor 2-5 mbits/s',
          image: 'css/images/tdc/Speed_2_5Mbit.png',
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
          image: 'css/images/tdc/Speed_200_500Mbit.png',
        },{
          name: '3G_outdoor_Maptiler',
          text: '3G Udenfor',
          image: 'css/images/tdc/Speed_30_50Mbit.png',
        },{
          name: '2G_outdoor_Maptiler',
          text: '2G Udenfor',
          image: 'css/images/tdc/Speed_2_5Mbit.png',
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
          image: 'css/images/tdc/Speed_200_500Mbit.png',
        },{
          name: '3G_outdoor_Maptiler',
          text: '3G Indenfor',
          image: 'css/images/tdc/Speed_30_50Mbit.png',
        },{
          name: '2G_outdoor_Maptiler',
          text: '2G Indenfor',
          image: 'css/images/tdc/Speed_2_5Mbit.png',
        },
      ],
    },
    {
      layername: 'Tale',
      layers: [{
          name: 'tele_outdoor_tale',
          text: 'Telefon udenfor',
          image: 'css/images/tdc/Speed_30_50Mbit.png',
        },{
          name: 'tele_indoor_tale',
          text: 'Telefon indenfor',
          image: 'css/images/tdc/Speed_30_50Mbit.png',
        },
      ],
    }
  ],
};