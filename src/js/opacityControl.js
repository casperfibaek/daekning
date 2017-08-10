/* eslint-env browser, es6 */
/* global L */

const opacityControl = (function opacity(map, layerGroup, size = 200) { // eslint-disable-line
  L.Control.OpacityControl = L.Control.extend({
    onAdd() {
      const control = L.DomUtil.create('div');
      return control;
    },
  });

  const opacityControlElement = new L.Control.OpacityControl({
    position: 'topright',
  }).addTo(map);

  const opacityContainer = opacityControlElement.getContainer();
  L.DomEvent.disableClickPropagation(opacityContainer);
  opacityContainer.classList.add('opacityControl');
  const circleSelector = document.createElement('div');
  circleSelector.classList.add('circleSelector');
  opacityContainer.appendChild(circleSelector);

  let initalOffset = parseFloat(window.getComputedStyle(circleSelector).left);
  let startClientX = circleSelector.getBoundingClientRect().left - initalOffset;

  function windowResized() {
    initalOffset = parseFloat(window.getComputedStyle(circleSelector).left);
    startClientX = circleSelector.getBoundingClientRect().left - initalOffset;
  }

  let timeoutCounter;
  window.onresize = function onresize() {
    clearTimeout(timeoutCounter);
    timeoutCounter = setTimeout(windowResized, size);
  };

  function changePosition(e, clicked) {
    e.preventDefault();
    const newPosition = (e.clientX) ? e.clientX : e.touches[0].clientX;
    let move;
    if (clicked) {
      move = newPosition -
          opacityContainer.getBoundingClientRect().left;
    } else {
      move = newPosition - startClientX;
    }
    if (move > size) { move = size; } else if (move < 0) { move = 0; }
    circleSelector.style.left = `${move}px`;
    layerGroup.eachLayer((layer) => {
      layer.setOpacity(move / size);
    });
  }

  function removeMouse() {
    document.removeEventListener('mousemove', changePosition);
    document.removeEventListener('mouseup', removeMouse);
  }

  function removeTouch() {
    document.removeEventListener('touchmove', changePosition);
    document.removeEventListener('touchend', removeTouch);
  }

  function clickchangePosition(e) {
    changePosition(e, 'clicked');
    document.addEventListener('mousemove', changePosition);
    document.addEventListener('touchmove', changePosition);
    document.addEventListener('touchend', removeTouch);
    document.addEventListener('mouseup', removeMouse);
  }

  opacityContainer.addEventListener('mousedown', clickchangePosition);
  opacityContainer.addEventListener('touchstart', clickchangePosition);

  circleSelector.addEventListener('mousedown', () => {
    document.addEventListener('mousemove', changePosition);
    document.addEventListener('mouseup', removeMouse);
  });

  circleSelector.addEventListener('touchstart', () => {
    document.addEventListener('touchmove', changePosition);
    document.addEventListener('touchend', removeTouch);
  });

  return opacityControl;
});
