'use strict';

(function () {
  var MAX_DELAY_TIME = 100;
  var MIN_DELAY_TIME = 5;
  var DELAY_STEP = 5;

  var MAX_DATA_SIZE = 100;
  var MIN_DATA_SIZE = 5;
  var DATA_STEP = 5;

  var decreaseDelayButton = document.querySelector('.setting--delay .button--left');
  var increaseDelayButton = document.querySelector('.setting--delay .button--right');
  var delayInput = document.querySelector('.setting__value--delay');

  var decreaseDataSizeButton = document.querySelector('.setting--datasize .button--left');
  var increaseDataSizeButton = document.querySelector('.setting--datasize .button--right');
  var dataSizeInput = document.querySelector('.setting__value--datasize');

  var decrease = function (input, min, step) {
    var value = parseInt(input.value, 10);
    return value > min ? (value - step) : value;
  };

  var increase = function (input, max, step) {
    var value = parseInt(input.value, 10);
    return value < max ? (value + step) : value;
  };

  decreaseDelayButton.addEventListener('click', function () {
    var value = decrease(delayInput, MIN_DELAY_TIME, DELAY_STEP);
    delayInput.value = value;
    window.sort.setDelayTime(value);
  });

  decreaseDataSizeButton.addEventListener('click', function () {
    if (window.sort.isBusy()) {
      return;
    }
    var value = decrease(dataSizeInput, MIN_DATA_SIZE, DATA_STEP);
    dataSizeInput.value = value;
    window.sort.setDataSize(value);
    window.sort.reset();
  });

  increaseDelayButton.addEventListener('click', function () {
    var value = increase(delayInput, MAX_DELAY_TIME, DELAY_STEP);
    delayInput.value = value;
    window.sort.setDelayTime(value);
  });

  increaseDataSizeButton.addEventListener('click', function () {
    if (window.sort.isBusy()) {
      return;
    }
    var value = increase(dataSizeInput, MAX_DATA_SIZE, DATA_STEP);
    dataSizeInput.value = value;
    window.sort.setDataSize(value);
    window.sort.reset();
  });
})();
