var originalImg = null;
var grayImg = null; //Filter
var redImg = null; //Filter
var frameImg = null; //Filter
var barsImg = null; //Filter
var canvas = null;
var red;
var green;
var blue;

function loadImage() {
  var imginput = document.getElementById("upload");
  canvas = document.getElementById("lienzo");
  originalImg = new SimpleImage(imginput);
  grayImg = new SimpleImage(imginput);
  redImg = new SimpleImage(imginput);
  frameImg = new SimpleImage(imginput);
  barsImg = new SimpleImage(imginput);
  blurImg = new SimpleImage(imginput);
  originalImg.drawTo(canvas);  
}

function grayScale() {
  if(isLoaded(grayImg)){
    for(var px of grayImg.values()){
      var greypx = (px.getRed()+px.getGreen()+px.getBlue())/3;
      px.setRed(greypx);
      px.setGreen(greypx);
      px.setBlue(greypx);
    }
    grayImg.drawTo(canvas);
  }
}

function randomNum(){ //Obtener un rango de -10 a 10
  var range = 20;
  var rdmPos;
  var rdmNeg;
  rdmPos = Math.round(Math.random()*range); // rango de 0 a 10
  rdmNeg = Math.round(Math.random()*-range); // rango de -10 a 0
  return rdmPos+rdmNeg; // sumamos para obtener un número de -10 a 10
}

function validPx(pixelXY, max){ //devuelve un px dentro del rango del tamaño de imágen
    if(pixelXY<0){
      return 0;
    } else if(pixelXY>max){
      return max;
    } else {
      return pixelXY;
    }
}

function doBlur(){
  if(isLoaded(blurImg)){
    var blank = new SimpleImage(originalImg.getWidth(), originalImg.getHeight());
    var w = originalImg.getWidth();
    var h = originalImg.getHeight();
    for(var px of blurImg.values()){
      var x = px.getX();
      var y = px.getY();
      var rx = px.getX()+randomNum();
      var ry = px.getY()+randomNum();
      if(rx>=0 && rx<=w-1 && ry>=0 && ry<=h-1){
        blank.setPixel(x, y, originalImg.getPixel(rx, ry));
      } else {
        blank.setPixel(x, y, originalImg.getPixel(validPx(rx, w-1), validPx(ry, h-1)));
      }
    }
    blank.drawTo(canvas); 
  }
}

function redFilter() {
  if(isLoaded(redImg)){
    for(var px of redImg.values()){
      var avg = (px.getRed()+px.getGreen()+px.getBlue())/3;
      
      if(avg<128){
          px.setRed(avg*2);
          px.setGreen(0);
          px.setBlue(0);
      } else {
          px.setRed(255);
          px.setGreen((avg*2)-255);
          px.setBlue((avg*2)-255);
      }
    }
    redImg.drawTo(canvas);
  }
}

function romboFilter() {
  if(isLoaded(frameImg)){
    var flagY = 0;
    var mediaIzq = frameImg.getWidth()/2;
    var mediaDer = frameImg.getWidth()/2;

    for(var px of frameImg.values()){
      var x = px.getX();
      var y = px.getY();
      if (y<Math.ceil((frameImg.getHeight()/2))){
          if(flagY==y){
              if(x<mediaIzq-1 || x>mediaDer){
                  px.setRed(0);
                  px.setGreen(0);
                  px.setBlue(0);
              }
          } else {
              flagY = flagY+1;
              mediaIzq = mediaIzq-1;
              mediaDer = mediaDer+1;
          }
      } else if (y>=Math.ceil((frameImg.getHeight()/2))){
          if(flagY==y){
              if(x<mediaIzq-1 || x>mediaDer){
                  px.setRed(0);
                  px.setGreen(0);
                  px.setBlue(0);
              }
          } else {
              flagY = flagY+1;
              mediaIzq = mediaIzq+1;
              mediaDer = mediaDer-1;
          }
      }
    }
    frameImg.drawTo(canvas);
  }
}

function colorBar(num, avg){
  var color = num;
  if(avg<128){
    switch(color) {
      case 0: //Color red
        red = 2*avg;
        green = 0;
        blue = 0;
        break;
      case 1: //Color orange
        red = 2*avg;
        green = 0.8*avg;
        blue = 0;
        break;
      case 2: //Color yellow
        red = 2*avg;
        green = 2*avg;
        blue = 0;
        break;
      case 3: //Color green
        red = 0;
        green = 2*avg;
        blue = 0;
        break;
      case 4: //Color blue
        red = 0;
        green = 0;
        blue = 2*avg;
        break;
      case 5: //Color indigo
        red = 0.8*avg;
        green = 0;
        blue = 2*avg;
        break;
      case 6: //Color violet
        red = 1.6*avg;
        green = 0;
        blue = 1.6*avg;
        break;
    }
  } else if(avg>=128){
    switch(color) {
      case 0: //Color red
        red = 255;
        green = 2*avg-255;
        blue = 2*avg-255;
        break;
      case 1: //Color orange
        red = 255;
        green = 1.5*avg-51;
        blue = 2*avg-255;
        break;
      case 2: //Color yellow
        red = 255;
        green = 255;
        blue = 2*avg-255;
        break;
      case 3: //Color green
        red = 2*avg-255;
        green = 255;
        blue = 2*avg-255;
        break;
      case 4: //Color blue
        red = 2*avg-255;
        green = 2*avg-255;
        blue = 255;
        break;
      case 5: //Color indigo
        red = 1.2*avg-51;
        green = 2*avg-255;
        blue = 255;
        break;
      case 6: //Color violet
        red = 0.4*avg+153;
        green = 2*avg-255;
        blue = 0.4*avg+153;
        break;  
    }
  }
}

function doBars(){
  if(isLoaded(barsImg)){
    var n = 7;
    var height = barsImg.getHeight();
    var flagBars = 0;
    for(var px of barsImg.values()){
      var avg = (px.getRed()+px.getGreen()+px.getBlue())/3;
      var y = px.getY();
      if(y>=flagBars*(height/n) && y<(flagBars+1)*(height/n)){
        colorBar(flagBars, avg);
        px.setRed(Math.round(red));
        px.setGreen(Math.round(green));
        px.setBlue(Math.round(blue));
      } else {
        flagBars += 1;
      }
    }
    barsImg.drawTo(canvas);
  }
}

function combineFilters() {
  if(isLoaded(originalImg)){
    originalImg.drawTo(canvas);
    grayImg = originalImg;
    redImg = originalImg;
    frameImg = originalImg;
    barsImg = originalImg;
  }
}

function isLoaded(img){
  if(img==null || !img.complete()){
    alert("Imagen sin cargar");
  } else{
    return true;
  }
}
