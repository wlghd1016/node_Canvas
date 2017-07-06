/*
https://codepen.io/techslides/pen/zowLd
*/
var canvas,ctx,lastX,lastY,dragStart,dragged,svg,pt,xform,p1,p2,scaleFactor,img,dataURL,tempimage;

var pos = {
    drawble: false,
    x: -1,
    y: -1,

}

window.onload = function(){
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    lastx = canvas.width/2, lastY=canvas.height/2;
    svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
    pt  = svg.createSVGPoint();
    xform = svg.createSVGMatrix();
    ctx.getTransform = function(){ return xform; };
    ctx.transformedPoint = function(x,y){
          pt.x=x; pt.y=y;
          return pt.matrixTransform(xform.inverse());
      }
    scaleFactor = 1.1;
    p1 = ctx.transformedPoint(0,0);
    p2 = ctx.transformedPoint(canvas.width,canvas.height);
    ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);

    ctx.save();
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.restore();
    canvas.addEventListener("mousedown", listener);
    canvas.addEventListener("mousemove", listener);
    canvas.addEventListener("mouseup", listener);
    canvas.addEventListener("mouseout", listener);
    canvas.addEventListener('DOMMouseScroll',handleScroll,false);
    canvas.addEventListener('mousewheel',handleScroll,false);



    console.log(document.getElementById('download'));

    // document.getElementById('download').onclick = function(){
    //   downloadCanvas(this, 'myCanvas', 'myeonguni.png');
    // };

    // 저장하기
    document.getElementById('download').onclick = function(){
            download();
        };

    document.getElementById('save').onclick = function(){
            save();
        };

    function saveImg()
           {
              //  var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
               var imgData = ctx.getImageData(0, 0, 400, 400);
               var strData = '';
               for (var i=0; i<imgData.length; i+=4) {
                   strData += imgData[i]+'|'+imgData[i+1]+'|'+imgData[i+2]+'|';
               }
               localStorage.setItem('imgData', strData);
               var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
               // document.getElementById("data").innerHTML = image;
               window.location.href=strData;
           }

    // 불러오기
    document.getElementById('load').onclick = function(){
            load();
        };

    document.getElementById("loadImg").addEventListener("change", loadImg, false);



}

function load(){
var request = new XMLHttpRequest();
request.open('GET', 'http://www.html5canvastutorials.com/demos/assets/dataURL.txt', true);
request.onreadystatechange = function() {
  // Makes sure the document is ready to parse.
  if(request.readyState == 4) {
    // Makes sure it's found the file.
    if(request.status == 200) {
      loadCanvas(request.responseText);
    }
  }
};
request.send(null);
}

function loadCanvas(dataURL) {
        var canvas = document.getElementById('myCanvas');
        var context = canvas.getContext('2d');

        // load image from data url
        var imageObj = new Image();
        imageObj.onload = function() {
          context.drawImage(this, 0, 0);
        };

        imageObj.src = dataURL;
      }


function listener(event){
    switch(event.type){
        case "mousedown":
            initDraw(event);
            break;

        case "mousemove":
            if(pos.drawable)
                draw(event);
            lastX = event.offsetX || (event.pageX - canvas.offsetLeft);
            lastY = event.offsetY || (event.pageY - canvas.offsetTop);
            break;

        case "mouseout":
        case "mouseup":
            finishDraw();
            break;
    }
}

function initDraw(event){
    ctx.beginPath();
    pos.drawable = true;
    var coors = getPosition(event);
    pos.X = coors.X;
    pos.Y = coors.Y;
    ctx.moveTo(pos.X, pos.Y);
}

function draw(event){
    var coors = getPosition(event);
    ctx.lineTo(coors.X, coors.Y);
    pos.X = coors.X;
    pos.Y = coors.Y;
    ctx.stroke();
}

function finishDraw(){
    pos.drawable = false;
    pos.X = -1;
    pos.Y = -1;
}

function getPosition(event){
    var x = event.pageX - canvas.offsetLeft;
    var y = event.pageY - canvas.offsetTop;
    return {X: x, Y: y};
}

function clearCanvas()
{
    // canvas
    // canvas = document.getElementById('myCanvas');
    // // context
    // ctx = canvas.getContext('2d');

    // 픽셀 정리
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 컨텍스트 리셋
    ctx.beginPath();
}

function trackTransforms(ctx){
      var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
      var xform = svg.createSVGMatrix();
      ctx.getTransform = function(){ return xform; };

      var savedTransforms = [];
      var save = ctx.save;
      ctx.save = function(){
          savedTransforms.push(xform.translate(0,0));
          return save.call(ctx);
      };
}

function handleScroll(evt){
          var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
          if (delta) zoom(delta);
          return evt.preventDefault() && false;
      };

function zoom(clicks){
                dataURL = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                var pt = ctx.transformedPoint(lastX,lastY);
                ctx.translate(pt.x,pt.y);
                var factor = Math.pow(scaleFactor,clicks);
                ctx.scale(factor,factor);
                ctx.translate(-pt.x,-pt.y);
                redraw();
            }

function redraw(){

          // Clear the entire canvas
          var p1 = ctx.transformedPoint(0,0);
          var p2 = ctx.transformedPoint(canvas.width,canvas.height);
          ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);

          ctx.save();
          ctx.setTransform(1,0,0,1,0,0);
          ctx.clearRect(0,0,canvas.width,canvas.height);
          ctx.restore();

          img = new Image();
          img.onload= function(){
              ctx.drawImage(img,0,0);
          }

          img.src = dataURL;
          console.log(img.src);
          // imageObj.onload = function() {
          //   context.drawImage(this, 0, 0);
          // };
          //
          // imageObj.src = dataURL;
        }



// input file 로 읽어온 이미지를 canvas 에 배경으로 출력
function loadImg(e){

 var file = e.target.files[0];

 var fileReader = new FileReader();

 fileReader.readAsDataURL(file);

 fileReader.onload = function() {
  var output = new Image();
  output.src = fileReader.result;
  console.log("test");
  ctx.drawImage(output, 0,0,250,250);
  ctx.drawImage(output, 250,0,250,250);
  ctx.drawImage(output, 0,250,250,250);
  ctx.drawImage(output, 250,250,250,250);
  ctx.stroke();
 };
}

// canvas에 그려진 그림을 파일로 저장
function download(){
 var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
 // document.getElementById("data").innerHTML = image;
 window.location.href=image;
}

function save(){
 tempimage = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
 console.log("save");
 // document.getElementById("data").innerHTML = image;
}
function load(e){
  console.log("load");
  var restore = new Image();
  restore.onload = function(){
    ctx.drawImage(restore,0,0);
    console.log("onload");
  }
  restore.src = tempimage;

}


function downloadCanvas(link, canvasId, filename) {
  console.log("download");
  link.href = document.getElementById(canvasId).toDataURL();
  link.download = filename;
}
