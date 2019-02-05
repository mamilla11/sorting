'use strict';

(function () {
  var canvas = document.querySelector('#canvas');
  var ctx = canvas.getContext("2d");

  var bubbleButton = document.querySelector('.button--bubble');
  var cocktailButton = document.querySelector('.button--cocktail');
  var mergeButton = document.querySelector('.button--merge');
  var selectionButton = document.querySelector('.button--selection');
  var insertionButton = document.querySelector('.button--insertion');
  var quickButton = document.querySelector('.button--quick');
  var resetButton = document.querySelector('.button--reset');

  var colors = ['#ad9baa', '#88a0a8', '#b4ceb3', '#dbd3c9', '#fad4d8'];
  var data = [];
  var inProcess = false;
  var delayTime = 50;
  var dataSize = 50;

  var isBusy = function () {
    return inProcess;
  };

  var reset = function () {
    generate();
    randomize();
    render();
  };

  var setDataSize = function (value) {
    dataSize = value;
  };

  var setDelayTime = function (value) {
    delayTime = value;
  };

  var generate = function () {
    data = [];

    for (var i = 1; i <= dataSize; i++) {
      data.push({
        value: i,
        color: colors[parseInt(Math.random() * colors.length)]
      });
    }
  };

  var randomize = function () {
    var index =dataSize;

    while (index !== 0) {
      var random = Math.floor(Math.random() * index);
      index -= 1;
      swapIndex(index, random);
    }
  };

  var swapIndex = function (index1, index2) {
    var temp = data[index1];
    data[index1] = data[index2];
    data[index2] = temp;
  };

  var render = function () {
    var x = 0;
    var wid = canvas.width / dataSize;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < dataSize; i++) {
      ctx.beginPath();
      ctx.fillStyle = data[i].color;
      ctx.fillRect(
        x,
        canvas.height - data[i].value * (wid / 2),
        wid,
        canvas.height
      );
      ctx.closePath();
      x += wid;
    }
  };

  var sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  var bubbleSort = async function () {
    inProcess = true;
    for (var i = dataSize - 1; i >= 0; i--) {
      for (var j = 1; j <= i; j++) {
        if (data[j - 1].value > data[j].value) {
          swapIndex(j, j - 1);
          await render();
          await sleep(delayTime);
        }
      }
    }
    inProcess = false;
  };

  var cocktailSort = async function () {
    inProcess = true;
    var i = 0;
    var left = 0;
    var right = dataSize - 1;

    while (left < right) {
      for (i = left; i < right; i++) {
        if(data[i].value > data[i + 1].value) {
          await swapIndex(i, i + 1);
          await render();
          await sleep(delayTime);
        }
      }
      right--;
      for (i = right; i > left; i--) {
        if(data[i - 1].value > data[i].value) {
          await swapIndex(i - 1, i);
          await render();
          await sleep(delayTime);
        }
      }
      left++;
    }
    inProcess = false;
  };

  var selectionSort = async function () {
    inProcess = true;
    var minIdx;

    for (var i = 0; i < dataSize; i++) {
      minIdx = i;
      for (var j = i + 1; j < dataSize; j++) {
        if(data[j].value < data[minIdx].value) {
          minIdx = j;
        }
      }
      await swapIndex(i, minIdx);
      await render();
      await sleep(delayTime)
    }

    inProcess = false;
  };

  var insertionSort = async function () {
    inProcess = true;
    var i, el, j;

    for (i = 1; i < dataSize; i++) {
      el = data[i].value;
      j = i;

      while (j > 0 && data[j-1].value > el) {
        data[j].value = data[j-1].value;
        await render();
        await sleep(delayTime);
        j--;
      }

      data[j].value = el;
      await render();
      await sleep(delayTime);
    }
    inProcess = false;
  };

  var quickSort = async function () {
    inProcess = true;
    await QS(0, dataSize - 1);

    async function partition(pivot, left, right) {
      const pivotValue = data[pivot].value;
      var	partitionIndex = left;
      var i = left;

      for (var i = left; i < right; i++) {
        if (data[i].value < pivotValue) {
          await swapIndex(i, partitionIndex);
          await render();
          await sleep(delayTime);
          partitionIndex++;
        }
      }
      await swapIndex(right, partitionIndex);
      await render();
      await sleep(delayTime);

      return Promise.resolve(partitionIndex);
    };

    async function QS(left, right) {
      if (left < right) {
        const pivot = right;
        const partitionIndex =  await partition(pivot, left, right);
        await QS(left, partitionIndex - 1);
        await QS(partitionIndex + 1, right);
      }
      return Promise.resolve();
    };

    inProcess = false;
  };

  var mergeSort = function () {
    inPlaceSort(data, 0, dataSize - 1);

    async function inPlaceSort(x, first, last) {
      var left, mid, right, temp;

      if (first >= last) {
        return Promise.resolve();
      }

      mid = Math.floor((first + last) / 2);

      await inPlaceSort(x, first, mid);
      await inPlaceSort(x, mid + 1, last);

      left = first;
      right = mid + 1;

      if (x[mid].value <= x[right].value) {
        return;
      }

      while (left <= mid && right <= last) {
        if (x[left].value <= x[right].value) {
          left++;
        }
        else {
          temp = x[right].value;
          await moveArr(x, left, right);
          x[left].value = temp;
          await render();
          await sleep(delayTime);
          left++; right++; mid++;
        }
      }

      return Promise.resolve();
    };

    var moveArr = function (x, left, right) {
      var tempArr = [];
      for (var i = 0, j = left; i < (right - left); i++, j++) {
        tempArr[i] = x[j].value;
      }

      for (var i = 0, j = left + 1; i < (right - left); i++, j++){
        x[j].value = tempArr[i];
      }
      return Promise.resolve(x);
    };
  };

  resetButton.addEventListener('click', function () {
    if (isBusy()) {
      return;
    }

    randomize();
    render();
  });

  bubbleButton.addEventListener('click', function () {
    if (isBusy()) {
      return;
    }

    bubbleSort();
  });

  cocktailButton.addEventListener('click', function () {
    if (isBusy()) {
      return;
    }

    cocktailSort();
  });

  selectionButton.addEventListener('click', function () {
    if (isBusy()) {
      return;
    }

    selectionSort();
  });

  insertionButton.addEventListener('click', function () {
    if (isBusy()) {
      return;
    }

    insertionSort();
  });

  quickButton.addEventListener('click', function () {
    if (isBusy()) {
      return;
    }

    quickSort();
  });

  mergeButton.addEventListener('click', function () {
    if (isBusy()) {
      return;
    }

    mergeSort();
  });

  window.sort = {
    reset: reset,
    isBusy: isBusy,
    setDataSize: setDataSize,
    setDelayTime: setDelayTime,
  };
})();
