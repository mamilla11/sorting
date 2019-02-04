'use strict';

var Arr = [];
var len = Arr.length;
var colors = ['#ad9baa', '#88a0a8', '#b4ceb3', '#dbd3c9', '#fad4d8'];
var time = 100;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

var rangeTime = document.getElementById("rangeTime");
var rangeArr = document.getElementById("rangeArr");	

var showTime = document.getElementById("showTime");//use in range
var showLength = document.getElementById("showLength");//use in range

createArr(35);
randomArr();
drawArr(Arr);

function createArr(number){
  Arr = [];
  for(var i=1; i<=number; i++){
    Arr.push({
      value: i,
      color: colors[parseInt(Math.random() * colors.length)]
    });
  }
  len = Arr.length;
  console.log(Arr);
  return Arr;
}
function randomArr(){
  var index = len, random;
  while(0!==index){
    random = Math.floor(Math.random() * index);
    index -= 1;
    swapIndex(Arr,index,random);
    }
  drawArr(Arr);
  return Arr;
}
function swapIndex(arr,i,j){
  var temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
  return arr;
}
function drawArr(arr){
  var x = 0;
  var wid = canvas.width/len;
  var cornerRadius = 6;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < len; i++) {
    ctx.beginPath();
    ctx.fillStyle = arr[i].color;
    ctx.strokeStyle = arr[i].color;
    ctx.lineJoin = "round";
    ctx.lineWidth = cornerRadius;
    var y = (canvas.height)-arr[i].value*(wid/2);
    ctx.strokeRect(x+(cornerRadius/2), y+(cornerRadius/2), wid-cornerRadius, canvas.height-cornerRadius)
    ctx.fillRect(x+(cornerRadius/2), y+(cornerRadius/2), wid-cornerRadius, canvas.height-cornerRadius);
    ctx.closePath();
    x += wid;
  }
}
function sleep(ms){
  return new Promise(resolve => setTimeout(resolve,ms));	
}

// using of "async" to use "await"
async function bubbelSort(Arr) {
  for (var i = len-1; i>=0; i--) {
    for(var j = 1; j<=i; j++) {
      if(Arr[j-1].value > Arr[j].value) {
        swapIndex(Arr,j,j-1);// Animation Performs when swaping is done in array;
        await drawArr(Arr);	//drawArr() animate the array
        await sleep(time);		//await sleep() pause the function (act as a dealy time)
      }
    }
  }
}

async function cocktailSort(arr){
  var i, left=0, right = len-1, temp;
  while(left<right){
    for(i=left; i<right; i++){
      if(arr[i].value > arr[i+1].value){
        await swapIndex(arr,i,i+1);
        await drawArr(arr);
        await sleep(time)
      }
    }
    right--;
    for(i=right; i>left; i--){
      if(arr[i-1].value > arr[i].value){
        await swapIndex(arr,i-1,i);	
        await drawArr(arr);
        await sleep(time);
      }
    }
    left++;
  }
}

rangeTime.oninput = function(){
  time = rangeTime.value;
  showTime.innerHTML = time;
}

rangeArr.oninput = function(){
  createArr(rangeArr.value);
  showLength.innerHTML = rangeArr.value;
  randomArr();
  drawArr(Arr);
}

