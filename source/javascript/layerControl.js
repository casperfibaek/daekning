/* eslint-env browser, es6 */
/* global L */
import niras from './niras';
import config from './config';

export default (function layerControl(map, layerGroup, ticket) { // eslint-disable-line
  L.Control.CustomControl = L.Control.extend({
    onAdd() {
      const control = L.DomUtil.create('div');

      return control;
    },
  });

  const customControl = new L.Control.CustomControl({
    position: 'topright',
  }).addTo(map);

  const container = customControl.getContainer();
  L.DomEvent.disableClickPropagation(container);
  container.classList.add('legend');

  for (let i = 0; i < config.layerGroups.length; i += 1) {
    const groupContainer = document.createElement('div');
    groupContainer.classList.add('legendGroupContainer');
    const curr = config.layerGroups[i];
    const heading = document.createElement('h4');
    heading.innerHTML = curr.layername;
    heading.classList.add('legendHeading');

    if (curr.defaultOpen) {
      groupContainer.classList.add('open');
      heading.classList.add('open');
    }

    groupContainer.appendChild(heading);

    for (let j = 0; j < curr.layers.length; j += 1) {
      const legendElement = document.createElement('div');
      const legendColor = document.createElement('div');
      const legendText = document.createElement('p');
      const layer = niras.getTiles(ticket, curr.layers[j].name);

      layerGroup.setZIndex(201);
      if (curr.layers[j].default) {
        layerGroup.addLayer(layer);
        legendElement.classList.add('selected');
      }

      legendElement.classList.add('legendElement');
      legendElement.addEventListener('click', () => {
        if (!legendElement.classList.contains('selected')) {
          const selected = document.querySelectorAll('.selected,.legendElement');
          for (let w = 0; w < selected.length; w += 1) {
            selected[w].classList.remove('selected');
          }
          legendElement.classList.add('selected');
          layerGroup.eachLayer((oldLayer) => {
            layerGroup.removeLayer(oldLayer);
          });

          layerGroup.addLayer(layer);
          layerGroup.setZIndex(201);
        }
      });
      legendColor.style.background = curr.layers[j].color;
      legendColor.classList.add('legendColor');
      legendText.classList.add('legendText');
      legendText.innerHTML = curr.layers[j].text;

      legendElement.appendChild(legendColor);
      legendElement.appendChild(legendText);
      groupContainer.appendChild(legendElement);
    }

    container.appendChild(groupContainer);

    heading.addEventListener('click', () => {
      if (groupContainer.classList.contains('open')) {
        heading.classList.remove('open');
        groupContainer.classList.remove('open');
      } else {
        document.querySelectorAll('.open').forEach((el) => {
          el.classList.remove('open');
        });
        groupContainer.classList.add('open');
        heading.classList.add('open');
      }
    });
  }
});
