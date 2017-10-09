/* eslint-env browser */
export default async function xhrGet(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', url);
    xhr.send(null);
    xhr.onreadystatechange = function onreadystatechange() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.responseText);
        } else {
          reject(`XHR failed with statuscode: ${xhr.status}`);
        }
      }
    };

    xhr.onerror = (err) => { reject(err); };
  });
}
