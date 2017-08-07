/* eslint-env browser, es6 */
/* global L */
/* eslint-disable no-console */

const dawa = (function dawa() { // eslint-disable-line
  // This is the dawa autocomplete request
  // possible themes: postnumre, vejnavne, adgangsadresser, kommuner, supplerendebynavne

  const _config = {
    themes: ['postnumre', 'adgangsadresser', 'kommuner', 'supplerendebynavne'],
    replies: 3,
  };

  function getHits(theme, searchString, callback, replies = 3) {
    const url = `http://dawa.aws.dk/${theme}/autocomplete?q=${searchString}` +
        `&noformat&per_side=${replies}`;

    const xhr = new XMLHttpRequest();
    xhr.open('GET', url); xhr.send(null);
    xhr.onerror = function onerror(err) { callback(err); };
      // If the search input is manipulated, fire xhr.abort();
    xhr.onreadystatechange = function onreadystatechange() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            const reply = JSON.parse(xhr.responseText);
            console.log(theme, reply);
            if (reply.length === 0) {
              callback(false, false);
            } else {
              console.log('send: ', reply);
              callback(false, reply);
            }
          } catch (err) {
            console.log(err);
            callback('Error parsing DAWA JSON!', err);
          }
        } else {
          callback(`During the autocomplete routine the URL: ${url} replied: ${xhr.status}`);
        }
      }
    };
  }

  // TODO: Move resultList to other funtion. return instead.
  function search(searchTerm, themes, resultList, onClick, replies = 3) {
    for (let i = 0; i < themes.length; i += 1) {
      getHits(themes[i], searchTerm, (err, reply) => {
        if (err) { throw Error(err); }
        if (reply) {
          for (let j = 0; j < reply.length; j += 1) {
            const resultText = document.createElement('p');
            resultText.className = 'resultText';
            const result = document.createElement('li');
            result.className = 'result';
            result.setAttribute('type', themes[i]);

            if (themes[i] === 'postnumre') {
              result.setAttribute('externalID', reply[j].postnummer.nr);
              resultText.innerHTML = `${reply[j].postnummer.navn} (${reply[j].postnummer.nr})`;
            } else if (themes[i] === 'adgangsadresser') {
              console.log(reply[j]);
              resultText.innerHTML = reply[j].tekst;
              result.setAttribute('externalID', reply[j].adgangsadresse.href);
            } else if (themes[i] === 'kommuner') {
              resultText.innerHTML = reply[j].kommune.navn;
              result.setAttribute('externalID', reply[j].kommune.kode);
            } else if (themes[i] === 'supplerendebynavne') {
              result.setAttribute('externalID', reply[j].supplerendebynavn.href);
              resultText.innerHTML = reply[j].supplerendebynavn.navn;
            }

            const resultIcon = document.createElement('p');
            resultIcon.className = 'resultIcon';
            resultIcon.innerHTML = `(${themes[i]})`;

            result.appendChild(resultText);
            result.appendChild(resultIcon);
            result.addEventListener('click', onClick);
            resultList.appendChild(result);
          }
        }
      }, replies);
    }
  }

  function getGeom(typeName, propertyName, property, callback) {
    const url = 'https://services.kortforsyningen.dk/service?' +
    'servicename=dagi_gml2&' +
    'request=GetFeature&' +
    'service=WFS&' +
    `typeNames=kms:${typeName}&` +
    'version=1.1.1&' +
    'login=NirasINMA&' +
    'password=75utag55&' +
    'srsName=4326&' +
    "filter=<Filter xmlns='http://www.opengis.net/ogc'>" +
      '<And>' +
        '<PropertyIsEqualTo>' +
          `<PropertyName>${propertyName}</PropertyName>` +
          `<Literal>${property}</Literal>` +
        '</PropertyIsEqualTo>' +
      '</And>' +
    '</Filter>';

    const xhr = new XMLHttpRequest();
    xhr.open('GET', url); xhr.send(null);
    xhr.onerror = function onerror() { throw new Error('Error getting geometry.'); };

    xhr.onreadystatechange = function onreadystatechange() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xhr.responseText, 'text/xml');
          const polygons = xmlDoc.getElementsByTagName('geometri');
          const polygonsGeo = [];

          for (let j = 0; j < polygons.length; j += 1) {
            const thisHolder = [];
            const thisPolygon = polygons[j].getElementsByTagName('coordinates')[0].innerHTML.split(' ');
            for (let i = 0; i < thisPolygon.length; i += 1) {
              const coords = thisPolygon[i].split(',').splice(0, 2).reverse();
              thisHolder.push([Number(coords[0]), Number(coords[1])]);
            }
            polygonsGeo.push(thisHolder);
          }

          const geojson = {
            type: 'FeatureCollection',
            features: [],
          };

          for (let w = 0; w < polygonsGeo.length; w += 1) {
            geojson.features.push({
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [polygonsGeo[w]],
              },
            },
          );
          }

          callback(false, geojson);
        } else {
          callback(true, `Error getting featureInfo (status: ${xhr.status})`);
        }
      }
    };
  }

  function leafletAdd(map, geom) {
    if (L && L.geoJSON) {
      const _geom = L.geoJSON(geom, {
        style: {
          fillOpacity: 0,
          dashArray: '10, 5',
        },
      }).addTo(map);
      map.flyToBounds(_geom.getBounds(), { maxZoom: 15 });
    } else {
      throw Error('No leaflet installation found.');
    }
  }

  function leafletAddCoords(map, geom) {
    const coords = geom.adgangspunkt.koordinater.reverse();
    map.flyToBounds(L.latLng(coords).toBounds(100), { maxZoom: 15 });
  }

  function clearChildren(div) {
    while (div.firstChild) { div.removeChild(div.firstChild); }
  }

  function clearMap(map) {
    map.eachLayer((layer) => {
      if (layer instanceof L.Path) { map.removeLayer(layer); }
    });
  }

  function addGeom(type, externalID, resultList, map) {
    if (type === 'kommuner') {
      getGeom('KOMMUNE2000', 'CPR_noegle', externalID, (err, reply) => {
        if (err) { throw Error(err); }
        leafletAdd(map, reply);
        clearChildren(resultList);
      });
    } else if (type === 'postnumre') {
      getGeom('POSTDISTRIKT2000', 'PostCodeToID', externalID, (err, reply) => {
        if (err) { throw Error(err); }
        leafletAdd(map, reply);
        clearChildren(resultList);
      });
    } else if (type === 'adgangsadresser') {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', externalID); xhr.send(null);
      xhr.onerror = function onerror() { throw new Error('Error getting address information.'); };
      xhr.onreadystatechange = function onreadystatechange() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            try {
              const reply = JSON.parse(xhr.responseText);
              leafletAddCoords(map, reply);
              clearChildren(resultList);
            } catch (err) { throw Error('Error parsing DAWA JSON.'); }
          } else {
            throw Error(`${externalID} replied: ${xhr.status}`);
          }
        }
      };
    } else if (type === 'supplerendebynavne') {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', externalID); xhr.send(null);
      xhr.onerror = function onerror() { throw new Error('Error getting city name information.'); };
      xhr.onreadystatechange = function onreadystatechange() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            try {
              const reply = JSON.parse(xhr.responseText);
              const postCode = reply.postnumre[0].nr;
              getGeom('POSTDISTRIKT2000', 'PostCodeToID', postCode, (err, secondReply) => {
                if (err) { throw Error(err); }
                leafletAdd(map, secondReply);
                clearChildren(resultList);
              });
            } catch (err) { throw Error('Error parsing DAWA JSON.'); }
          } else {
            throw Error(`${externalID} replied: ${xhr.status}`);
          }
        }
      };
    } else {
      throw Error('Could not understand request.');
    }
  }

  function init(div, map, config = _config) {
    if (map && L) {
      const searchContainer = document.getElementById(div);
      const resultList = document.createElement('ul');
      resultList.id = 'resultsHolder';
      const searchInput = document.createElement('input');
      searchInput.type = 'text';
      searchInput.className = 'search-input';
      searchInput.placeholder = 'Søg efter adresser, kommuner mm.';
      let searchTimeout;
      searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        clearChildren(resultList);
        clearMap(map);
        if (searchInput.value.length > 2) {
          searchTimeout = setTimeout(() => {
            search(searchInput.value, config.themes, resultList, (e) => {
              const target = e.target.attributes;
              addGeom(target.type.value, target.externalID.value, resultList, map);
            }, config.replies);
          }, 500);
        }
      });
      searchContainer.appendChild(searchInput);
      searchContainer.appendChild(resultList);
    } else {
      throw Error('Leaflet not defined.');
    }
  }

  return init;
}());
