/* eslint-env browser, es6 */
/* global L */

export default (function layerControl(map, layerGroup, config, ticket, tileFunction) { // eslint-disable-line
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
    } else {
      groupContainer.style.maxHeight = `${28}px`;
    }

    groupContainer.appendChild(heading);

    for (let j = 0; j < curr.layers.length; j += 1) {
      const legendElement = document.createElement('div');
      const legendColor = document.createElement('div');
      const legendText = document.createElement('p');
      const layer = tileFunction(ticket, curr.layers[j].name, config);

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

      // legendElement.appendChild(legendImage);
      legendElement.appendChild(legendColor);
      legendElement.appendChild(legendText);
      groupContainer.appendChild(legendElement);
    }

    container.appendChild(groupContainer);

    if (curr.defaultOpen) {
      groupContainer.style.maxHeight = `${groupContainer.offsetHeight}px`;
    }

    heading.addEventListener('click', () => {
      if (groupContainer.classList.contains('open')) {
        const headingStyle = window.getComputedStyle(heading);
        const headingMargin = Number(headingStyle.marginTop.substring(0,
          headingStyle.marginTop.length - 2));
        groupContainer.style.maxHeight = `${18 + headingMargin}px`;
        heading.classList.remove('open');
        groupContainer.classList.remove('open');
      } else {
        groupContainer.style.maxHeight = `${groupContainer.scrollHeight}px`;
        groupContainer.classList.add('open');
        heading.classList.add('open');
      }
    });
  }
});
