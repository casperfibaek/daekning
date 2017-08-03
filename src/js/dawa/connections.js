/* eslint-disable no-console, no-unused-vars */
/* eslint-env browser, es6 */

// const input = document.getElementById('adresse');

/*
TODO:
  1) Merge and order the autocomplete request to all 4 providers.
  2) Start work on the geometry fetch feature.
  3) Add event listener to cancel outcomplete if input is manipulated
*/

// These are our DAWA endpoints.
// postnumre, vejnavne, adgangsadresser, kommuner, supplerendebynavne
const dawa = {
  autocomplete(theme, str, callback, replies = 3) {
    const url = `http://dawa.aws.dk/${theme}/autocomplete?q=${str}` +
      `&noformat&per_side=${replies}`;

    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send(null);
    xhr.onerror = function onerror(err) { callback(err); };
    // If the search input is manipulated, fire xhr.abort();
    xhr.onreadystatechange = function onreadystatechange() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            const reply = JSON.parse(xhr.responseText);
            callback(false, reply);
          } catch (err) { callback('Error parsing DAWA JSON.'); }
        } else {
          callback(`During the autocomplete routine the URL: ${url} replied: ${xhr.status}`);
        }
      }
    };
  },
  geom: {
    _base(typeName, property, str) {
      return 'https://services.kortforsyningen.dk/service?' +
      'servicename=dagi_gml2&' +
      'request=GetFeature&' +
      'service=WFS&' +
      `typeNames=kms:${typeName}&` +
      'version=1.1.1&' +
      'login=NirasINMA&' +
      'password=75utag55&' +
      'srsName=4326&' +
      "filter=<Filterxmlns='http://www.opengis.net/ogc'>" +
        '<And>' +
          '<PropertyIsEqualTo>' +
            `<PropertyName>${property}</PropertyName>` +
            `<Literal>${str}</Literal>` +
          '</PropertyIsEqualTo>' +
        '</And>' +
      '</Filter>';
    },
    postnummer(str) {
      return this._base('POSTDISTRIKT2000', 'PostCodeToID', str);
    },
    kommuner(str) {
      return this._base('KOMMUNE2000', 'CPR_noegle', str);
    },
  },
};
