/* eslint-disable no-console */
/* eslint-env browser, es6 */
/* globals L */

import ajax from './xhrWrap';

export default (function dawa() { // eslint-disable-line
  // This is the dawa autocomplete request
  // possible themes: postnumre, vejnavne
  // adgangsadresser, kommuner, supplerendebynavne
  // add ranking of results.

  const options = {
    themes: ['postnumre', 'adgangsadresser', 'kommuner', 'supplerendebynavne'],
    replies: 3,
    style: {
      fillOpacity: 0,
      dashArray: '10, 5',
      color: '#f2932f',
    },
  };

  function parseGML(gml, tag = 'gml:coordinates') {
    const geojson = {
      type: 'FeatureCollection',
      features: [],
    };

    const split = gml.split(tag);

    for (let i = 1; i < split.length; i += 2) {
      const coords = [];

      const sliced = split[i].slice(1, -2);
      sliced.split(' ').forEach((xyz) => {
        const xy = xyz.split(',').slice(0, -1);
        coords.push([Number(xy[1]), Number(xy[0])]);
      });

      geojson.features.push({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [coords],
        },
      });
    }

    return geojson;
  }

  async function getHits(theme, searchTerm, maxReplies = 3) {
    const url = `http://dawa.aws.dk/${theme}/autocomplete?q=${searchTerm}&noformat&per_side=${maxReplies}`;
    try {
      const hits = await ajax(url);
      return JSON.parse(hits);
    } catch (err) {
      throw new Error(err);
    }
  }

  async function search(searchTerm, themes, resultList, onClick, replies = 3) {
    themes.forEach((theme) => {
      getHits(theme, searchTerm, replies)
        .then((hits) => {
          hits.forEach((hit) => {
            const resultText = document.createElement('p');
            const resultIcon = document.createElement('p');
            const result = document.createElement('li');
            result.className = 'result';
            result.setAttribute('type', theme);
            resultText.className = 'resultText';
            resultIcon.className = 'resultIcon';

            switch (theme) {
              case 'postnumre':
                result.setAttribute('externalID', hit.postnummer.nr);
                resultText.innerHTML = `${hit.postnummer.navn}, ${hit.postnummer.nr}`;
                resultIcon.innerHTML = '..Postnummer';
                break;
              case 'adgangsadresser':
                result.setAttribute('externalID', hit.adgangsadresse.href);
                resultText.innerHTML = hit.tekst;
                resultIcon.innerHTML = '..Adresse';
                break;
              case 'kommuner':
                result.setAttribute('externalID', hit.kommune.kode);
                resultText.innerHTML = hit.kommune.navn;
                resultIcon.innerHTML = '..Kommune';
                break;
              case 'supplerendebynavne':
                result.setAttribute('externalID', hit.supplerendebynavn.href);
                resultText.innerHTML = hit.supplerendebynavn.navn;
                resultIcon.innerHTML = '..Bynavn';
                break;
              default:
                console.error('Reply did not match predefined themes');
            }

            result.appendChild(resultText);
            result.appendChild(resultIcon);
            result.addEventListener('click', onClick);
            resultList.appendChild(result);
          });
        })
        .catch(err => console.error(err));
    });
  }

  async function getGeom(typeName, propertyName, property) {
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

    try {
      const geomGML = await ajax(url);
      return parseGML(geomGML);
    } catch (err) {
      return err;
    }
  }

  function leafletAdd(map, geom, style) {
    const _geom = L.geoJSON(geom, {
      style,
    });
    map.once('moveend', () => { _geom.addTo(map); });
    map.flyToBounds(_geom.getBounds(), {
      maxZoom: 15,
    });
  }

  function leafletAddCoords(map, geom, style) {
    const coords = geom.adgangspunkt.koordinater.reverse();
    const _geom = L.circle(coords, {
      radius: 40,
      fillOpacity: style.fillOpacity,
      color: style.color,
    });
    map.once('moveend', () => { _geom.addTo(map); });
    map.flyToBounds(L.latLng(coords).toBounds(40), { maxZoom: 15 });
  }

  function clearChildren(div) {
    while (div.firstChild) { div.removeChild(div.firstChild); }
  }

  function clearMap(map) {
    map.eachLayer((layer) => {
      if (layer instanceof L.Path) { map.removeLayer(layer); }
    });
  }

  async function addGeom(type, externalID, resultList, map, style) {
    try {
      switch (type) {
        case 'kommuner': {
          const geom = await getGeom('KOMMUNE2000', 'CPR_noegle', externalID);
          leafletAdd(map, geom, style);
          clearChildren(resultList);
          break;
        }
        case 'postnumre': {
          const geom = await getGeom('POSTDISTRIKT2000', 'PostCodeToID', externalID);
          leafletAdd(map, geom, style);
          clearChildren(resultList);
          break;
        }
        case 'adgangsadresser': {
          const geom = await ajax(externalID);
          leafletAddCoords(map, JSON.parse(geom), style);
          clearChildren(resultList);
          break;
        }
        case 'supplerendebynavne': {
          const navn = await ajax(externalID);
          const postCode = navn.postnumre[0].nr;
          const geom = await getGeom('POSTDISTRIKT2000', 'PostCodeToID', postCode);
          leafletAdd(map, JSON.parse(geom), style);
          clearChildren(resultList);
          break;
        }
        default:
          break;
      }
    } catch (err) {
      console.error(err);
    }
  }

  function init(map, div) {
    if (map && L) {
      const searchContainer = document.getElementById(div);
      const resultList = document.createElement('ul');
      const searchInput = document.createElement('input');
      resultList.id = 'resultsHolder';
      searchInput.type = 'search';
      searchInput.className = 'search-input';
      searchInput.setAttribute('aria-label', 'search');
      searchInput.placeholder = 'Søg efter adresser, kommuner mm.';
      let searchTimeout;
      searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        clearChildren(resultList);
        clearMap(map);
        if (searchInput.value.length > 2) {
          searchTimeout = setTimeout(() => {
            search(searchInput.value, options.themes, resultList, (e) => {
              const target = e.target;
              const attributes = target.attributes;
              searchInput.value = target.firstChild.innerHTML;
              addGeom(
                attributes.type.value,
                attributes.externalID.value,
                resultList,
                map,
                options.style,
              );
            }, options.replies);
          }, 500);
        }
      });
      searchInput.addEventListener('focus', (event) => { console.log(event); });
      searchContainer.appendChild(searchInput);
      searchContainer.appendChild(resultList);

      window.onkeydown = function keyListen(e) {
        if (searchInput === document.activeElement) {
          const code = e.keyCode ? e.keyCode : e.which;
          if (code === 27) {
            searchInput.value = '';
            clearChildren(resultList);
          }
          if (resultList.children.length !== 0) {
            if (code === 40 || code === 38) {
              const selected = document.getElementsByClassName('result selected');
              if (selected.length === 0) {
                resultList.firstChild.classList.add('selected');
              } else {
                let counter;
                for (let i = 0; i < resultList.children.length; i += 1) {
                  if (resultList.children[i].classList.contains('selected')) {
                    counter = i;
                    break;
                  }
                }

                const listLength = document.getElementsByClassName('result').length;

                if (code === 40) {
                  if (counter !== listLength - 1) {
                    selected[0].classList.remove('selected');
                    resultList.children[counter + 1].classList.add('selected');
                  }
                } else if (counter !== 0) {
                  selected[0].classList.remove('selected');
                  resultList.children[counter - 1].classList.add('selected');
                }
              }
            } else if (code === 13) {
              const selected = document.getElementsByClassName('result selected');
              if (selected.length !== 0) {
                searchInput.value = selected[0].firstChild.innerHTML;
                selected[0].click();
                clearChildren(resultList);
              }
            }
          }
        }
      };
    } else {
      throw Error('Leaflet not defined.');
    }
  }

  return init;
}());
