/* eslint-env browser, es6 */
/* global dawa, L, map */

// postnumre, vejnavne, adgangsadresser, kommuner, supplerendebynavne
function searchAll(searchTerm, resultList, onClick) {
  dawa.autocomplete('postnumre', searchTerm, (err, reply) => {
    if (err) { throw new Error(err); }
    for (let i = 0; i < reply.length; i += 1) {
      const result = document.createElement('li');
      result.className = 'result';
      result.setAttribute('type', 'postnummer');
      result.setAttribute('externalID', reply[i].postnummer.nr);

      const resultText = document.createElement('p');
      resultText.className = 'resultText';
      resultText.innerHTML = `${reply[i].postnummer.navn} (${reply[i].postnummer.nr})`;

      const resultIcon = document.createElement('p');
      resultIcon.className = 'resultIcon';
      resultIcon.innerHTML = '(Postnummer)';

      result.appendChild(resultText);
      result.appendChild(resultIcon);
      result.addEventListener('click', onClick);
      resultList.appendChild(result);
    }
  });
  dawa.autocomplete('adgangsadresser', searchTerm, (err, reply) => {
    if (err) { throw new Error(err); }
    for (let i = 0; i < reply.length; i += 1) {
      const result = document.createElement('li');
      result.className = 'result';
      result.setAttribute('type', 'adgangsadresser');
      result.setAttribute('externalID', reply[i].adgangsadresse.href);

      const resultText = document.createElement('p');
      resultText.className = 'resultText';
      resultText.innerHTML = reply[i].tekst;

      const resultIcon = document.createElement('p');
      resultIcon.className = 'resultIcon';
      resultIcon.innerHTML = 'Adresse';

      result.appendChild(resultText);
      result.appendChild(resultIcon);
      result.addEventListener('click', onClick);
      resultList.appendChild(result);
    }
  });
  dawa.autocomplete('kommuner', searchTerm, (err, reply) => {
    if (err) { throw new Error(err); }
    for (let i = 0; i < reply.length; i += 1) {
      const result = document.createElement('li');
      result.className = 'result';
      result.setAttribute('type', 'kommuner');
      result.setAttribute('externalID', reply[i].kommune.kode);

      const resultText = document.createElement('p');
      resultText.className = 'resultText';
      resultText.innerHTML = reply[i].kommune.navn;

      const resultIcon = document.createElement('p');
      resultIcon.className = 'resultIcon';
      resultIcon.innerHTML = '(Kommune)';

      result.appendChild(resultText);
      result.appendChild(resultIcon);
      result.addEventListener('click', onClick);
      resultList.appendChild(result);
    }
  });
  dawa.autocomplete('supplerendebynavne', searchTerm, (err, reply) => {
    if (err) { throw new Error(err); }
    for (let i = 0; i < reply.length; i += 1) {
      const result = document.createElement('li');
      result.className = 'result';
      result.setAttribute('type', 'supplerendebynavne');
      result.setAttribute('externalID', reply[i].supplerendebynavn.href);

      const resultText = document.createElement('p');
      resultText.className = 'resultText';
      resultText.innerHTML = reply[i].supplerendebynavn.navn;

      const resultIcon = document.createElement('p');
      resultIcon.className = 'resultIcon';
      resultIcon.innerHTML = '(Sup. Bynavn)';

      result.appendChild(resultText);
      result.appendChild(resultIcon);
      result.addEventListener('click', onClick);
      resultList.appendChild(result);
    }
  });
}

function kmsGeom(typeName, propertyName, property, callback) {
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
  xhr.open('GET', url);
  xhr.send(null);

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

function getGeom(type, externalID, resultList) {
  if (type === 'kommuner') {
    kmsGeom('KOMMUNE2000', 'CPR_noegle', externalID, (err, reply) => {
      if (err) { throw new Error(err); }
      const geom = L.geoJSON(reply, {
        style: {
          fillOpacity: 0,
          dashArray: '10, 5',
        },
      }).addTo(map);
      map.flyToBounds(geom.getBounds(), { maxZoom: 15 });
      while (resultList.firstChild) { resultList.removeChild(resultList.firstChild); }
    });
  } else if (type === 'postnummer') {
    kmsGeom('POSTDISTRIKT2000', 'PostCodeToID', externalID, (err, reply) => {
      if (err) { throw new Error(err); }
      const geom = L.geoJSON(reply, {
        style: {
          fillOpacity: 0,
          dashArray: '10, 5',
        },
      }).addTo(map);
      map.flyToBounds(geom.getBounds(), { maxZoom: 15 });
      while (resultList.firstChild) { resultList.removeChild(resultList.firstChild); }
    });
  } else if (type === 'adgangsadresser') {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', externalID);
    xhr.send(null);
    xhr.onerror = function onerror() { throw new Error('Error getting address information.'); };
    xhr.onreadystatechange = function onreadystatechange() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            const reply = JSON.parse(xhr.responseText);
            const coords = reply.adgangspunkt.koordinater.reverse();
            map.flyToBounds(L.latLng(coords).toBounds(100), { maxZoom: 15 });
            while (resultList.firstChild) { resultList.removeChild(resultList.firstChild); }
          } catch (err) { throw new Error('Error parsing DAWA JSON.'); }
        } else {
          throw new Error(`${externalID} replied: ${xhr.status}`);
        }
      }
    };
  } else if (type === 'supplerendebynavne') {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', externalID);
    xhr.send(null);
    xhr.onerror = function onerror() { throw new Error('Error getting city name information.'); };
    xhr.onreadystatechange = function onreadystatechange() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            const reply = JSON.parse(xhr.responseText);
            const postCode = reply.postnumre[0].nr;
            kmsGeom('POSTDISTRIKT2000', 'PostCodeToID', postCode, (err, secondReply) => {
              if (err) { throw new Error(err); }
              const geom = L.geoJSON(secondReply, {
                style: {
                  fillOpacity: 0,
                  dashArray: '10, 5',
                },
              });
              map.flyToBounds(geom.getBounds(), { maxZoom: 15 });
              while (resultList.firstChild) { resultList.removeChild(resultList.firstChild); }
            });
          } catch (err) { throw new Error('Error parsing DAWA JSON.'); }
        } else {
          throw new Error(`${externalID} replied: ${xhr.status}`);
        }
      }
    };
  } else {
    throw new Error('Could not understand request.');
  }
}

const searchContainer = document.getElementById('searchContainer');
const resultList = document.createElement('ul');
resultList.id = 'resultsHolder';
const searchInput = document.createElement('input');
searchInput.type = 'text';
searchInput.className = 'search-input';
searchInput.placeholder = 'Søg efter adresser, kommuner mm.';
let searchTimeout;
searchInput.addEventListener('input', () => {
  clearTimeout(searchTimeout);
  while (resultList.firstChild) { resultList.removeChild(resultList.firstChild); }
  if (searchInput.value.length > 2) {
    searchTimeout = setTimeout(() => {
      map.eachLayer((layer) => {
        if (layer instanceof L.Path) {
          map.removeLayer(layer);
        }
      });
      searchAll(
        searchInput.value,
        resultList,
        (e) => {
          const target = e.target.attributes;
          getGeom(target.type.value, target.externalID.value, resultList);
        });
    }, 500);
  }
});
searchContainer.appendChild(searchInput);
searchContainer.appendChild(resultList);
