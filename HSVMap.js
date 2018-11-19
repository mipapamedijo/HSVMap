/*
#COLOR_DATA_VIZ

HSV MAP: @Mipapamedijo - NoBudgetAnimation - 2018-2019

ESPAÑOL: Visualización de mapa de puntos del espacio de color
HSV / HSB (Hue, Saturation, Value/Brightness) en 3D.
ENGLISH: 3D HSV (Hue, Saturation, Value/Brightness) color space plotting
visualization.

ESPAÑOL: EL ARCHIVO CSV DEBE CONTENER N FILAS CON VALORES NUMÉRICOS
(int, float, long) DISTRIBUIDOS EN 3 COLUMNAS EN EL ORDEN
column 0 = HUE , column 1 = SATURATION, column 2 = VALUE o BRIGTHNESS.
				HUE 				(NUMERO: 0 a 360)
				SATURATION 	(NUMERO: 0 a 100)
				VALUE				(NUMERO: 0 a 100)

ENGLISH: THE CSV FILE MUST CONTAIN N ROWS WITH ANY GIVEN NUMBER VALUE
(int, float, long) ARRANGED BY 3 COLUMNS IN THIS ORDER:
column 0 = HUE , column 1 = SATURATION, column 2 = VALUE or BRIGTHNESS.
				HUE 				(NUMBER: 0 to 360)
				SATURATION 	(NUMBER: 0 to 100)
				VALUE				(NUMBER: 0 to 100)
*/

//DEFINITION OF GLOBAL VARIABLES

var angleSlider;
let dropZone;
var data;
var csvData;
var dSize;
var cols;
var rows;
var array;

var top;
var bottom;
var tall;
var divs;
var sqR;
var posX;
var posY;
var posZ;
var h;
var s;
var v;
var boxS;
let boxSelected;
var zoom;
var inc;
var rotInc;
var rotation;
var screenState;

let fileName;
var path;
var infoPAlpha;
let frameP;


let tH;
let tS;
let tV;


var framesMap = function (p){
	p.canvasColors;
	p.colors = [];
	p.imgIndex;
	p.newImage;
	p.d;

	p.setup = function(){
	  p.canvasColors = p.createCanvas(500,100);
	  p.canvasColors.parent('palette_map');
	  p.colorMode(p.HSB, 360, 100, 100, 100);
	  colorArray();
	  p.d = p.createDiv();
	  p.d.parent('img_div');

		frameP = p.createP("FRAMES INDEX:");
		frameP.parent('index');

	}

	p.draw = function(){
	  p.clear();
		lookOver();
	  drawImages(p.imgIndex);
	}
}

var hsv_3d = function (q){

	q.dirX;
	q.dirY;
	q.infoP;

	q.setup = function() {

		top = 0;
		bottom = 100;
		tall = 100;
		divs = 12;
		boxS = 5;
		zoom = 2;
		inc = 0.05;
		rotInc = 185;
		rotation = q.PI / rotInc;
		screenState = 0;

		cols = 3;
		rows = q.int(dSize / cols);
		array = [];

		//document.getElementById("index").innerHTML = "IMAGE INDEX : "+imgIndex;

		angleSlider = q.createSlider(-q.PI, q.PI, -q.PI, 0.05);
		angleSlider.class('slider');

		q.canvas = q.createCanvas(500, 500, q.WEBGL);
		q.canvas.parent('hsv_map');

		q.colorMode(q.HSB, 360, 100, 100);
		q.rectMode(q.CENTER);
		tH = q.createGraphics(100, 100);
		tS = q.createGraphics(100, 100);
		tV = q.createGraphics(100, 100);

		dropZone = q.select('#drag_drop');
		dropZone.dragOver(dragIn);
		dropZone.dragLeave(dragOut);
		dropZone.drop(loadFile, dragIn);

		/*q.infoP = q.createDiv();
		q.infoP.id('infoP');
		q.infoP.parent('infoP-div');*/

	}

	q.draw = function() {

		//SET CANVAS BACKGROUND
		q.clear();

		//SET LIGHTS AMBIENT
		q.dirX = (q.mouseX / q.width - 0.5) * 2;
		q.dirY = (q.mouseY / q.height - 0.5) * 2;
		q.directionalLight(0, 0, 100, -q.dirX, -q.dirY, -0.5);
		q.ambientLight(0, 0, 50, 50);

		// --------------------------------> DRAG ELEMENT  <--------------------------

		dropZone = q.select('#drag_drop');
		dropZone.dragOver(dragIn);
		dropZone.dragLeave(dragOut);

		// -----------------------------> END OF DRAG ELEMENT <-----------------------

		// SET PERSPECTIVE
		q.ortho(-q.width / 2, q.width / 2, -q.height / 2, q.height / 2);

		// SET CAMERA INTERACTION WITH MOUSE X AND MOUSE Y TIMES A GIVEN ZOOM
		q.camera((q.width / 2) * zoom, (q.height / 2) * zoom,
					((q.height / 3.0) / q.tan(q.PI * 50.0 / 180.0)) * zoom,
					q.width / 2 * zoom, q.height / 2 * zoom, 0, 0, 1, 0);

		//INIT DRAWING
		q.push();
		angleSlider.parent('sliderX');
		//t.text("X ROTATION", angleSlider.x * 2 + angleSlider.width, angleSlider.y);
		q.scale(zoom);
		q.translate(q.width / 2, q.height - (q.height / 2.5), zoom);
		q.rotateX(angleSlider.value());
		q.rotateY(q.frameCount * rotation);

		// DRAW A REFERENCE CONE CALLING THE FUNCTION function drawCone(var topRadius,
		// var bottomRadius, var tall, var sides):
		drawCone(top, bottom, tall, divs);

		// DRAW HSV POINTS ADJUSTED TO THE REFERENCE CONE TALLNESS, CALLING THE
		//FUNCTION function drawHSVPoints(Table data, var tall):
		q.push();
		q.translate(0, tall, 0);
		q.rotateZ(q.PI);
		q.rotateY(-q.PI / 2);
		drawHSVPoints(data, tall);
		q.pop();

		//DRAW THE AXIS LABELS CALLING THE FUNCTION function drawAxis():
		q.translate(0, 0);
		drawAxis();

		q.pop();

	}

	q.mouseClicked = function() {

	}

	q.keyPressed = function() {

		if (q.key == 'w') {
			zoom = zoom + inc;
			q.print("ZOOM:" + zoom);
		}
		if (q.key == 's') {
			zoom = zoom - inc;
			if (zoom < 0) {
				zoom = 0.05;
			}
			q.print("ZOOM:" + zoom);
		}
		if (q.key == 'd') {
			rotation = q.PI / (rotInc++);
			q.print("ROTATION:" + rotation);
		}
		if (q.key == 'a') {
			rotation = q.PI / (rotInc--);
			q.print("ROTATION:" + rotation);
		}
		if (q.keyCode == q.ESCAPE) {
			q.frameRate(0);
			q.print("ROTATION:" + rotation);
		}
		if (q.keyCode == q.ENTER) {
			q.frameRate(8);
			q.print("ROTATION:" + rotation);
		}
		if (q.keyCode == q.TAB){
			if (screenState == 0) {
				screenState = 1;
			} else {
				screenState = 0;
			}
		}

	}

}

function drawCone(topRadius, bottomRadius, tall, sides) {

	var angle = 0;
	var angleIncrement = p5_a.TWO_PI / sides;

	if (screenState == 1) {
		// IF MOUSE PRESSED, AVOID DRAWING ANY CONE AT ALL.
	} else {
		p5_a.push();
		p5_a.beginShape(p5_a.LINES);
		p5_a.fill(0);
		for (i = 0; i < sides + 1; ++i) {

			p5_a.push();
			p5_a.strokeWeight(1.5);
			p5_a.stroke(i * (360 / sides), 50, 100, 10);
			p5_a.line(topRadius * p5_a.cos(angle), 0, topRadius * p5_a.sin(angle),
					 bottomRadius * p5_a.cos(angle), tall, bottomRadius * p5_a.sin(angle));
			p5_a.pop();
			angle += angleIncrement;
		}
		p5_a.endShape();
		p5_a.pop();

	}

}

function drawHSVPoints(data, tall) {

	var cols = 3;
	var rows = p5_a.int(dSize / cols);
	sqR = p5_a.int(Math.floor(p5_a.sqrt(rows)));
	//(sqR);

	//HSV POINTS DEFINITION IN SPACE (X,Y,Z):

	for (i = 0; i < rows; ++i) {
		posX = 0;
		posY = 0;
		posZ = 0;

		h = data[0][i];
		s = data[1][i];
		v = data[2][i];

		//("H: "+h+" ; S: "+s+" ; V: "+v);

		p5_a.push();
		p5_a.fill(h, s, v);
		p5_a.noStroke();

		if (screenState == 1) {
			p5_a.translate(0, tall / 2, 0);
			p5_a.push();
			posY = ((sqR / 2) * boxS) - (i % sqR) * boxS;
			posX = ((sqR / 2) * boxS) - (i / sqR) * boxS;
			posZ = 0;
			//posY=i*boxS; –> ARRAY-VIZ ONE DIMENSION ONLY - dismiss this!
			p5_a.translate(posX, posY, posZ);
			p5_a.box(boxS);
			p5_a.pop();
			/*("MOUSE CLICKED: i= "+i+" | HSV: "+h+", "+s+", "+v +" |DIBUJANDO EN:
			"+posX+", "+posY+", "+posZ);*/

		} else {
			var d;
			d = s - (100 - v);
			if (d < 0) {
				if (s == 0) {
					d = 0;
				} else {
					d = v % s;
				}
			}

			posX = d * p5_a.sin((h * p5_a.PI) / 180);
			posY = tall - v;
			posZ = d * p5_a.cos((h * p5_a.PI) / 180);
			/*("i= "+i+" | HSV: "+h+", "+s+", "+v +" | DIBUJANDO EN:
			"+posX+", "+posY+", "+posZ);*/
			p5_a.translate(posX, posY, posZ);
			p5_a.rotateZ(p5_a.frameCount * rotation);
			p5_a.specularMaterial(h, s, v);
			p5_a.box(boxS);
		}
		p5_a.pop();
	}

}

function drawAxis() {

	var axisX0 = 0;
	var axisY0 = 0;
	var axisZ0 = 0;
	var axisX1 = -100;
	var axisY1 = -100;
	var axisZ1 = -100;
	var vAxis = 80;

	if (screenState == 1) {} else {

		p5_a.rotateX(-p5_a.PI);
		p5_a.push();
		p5_a.strokeWeight(1);
		p5_a.stroke(0, 0, vAxis);
		p5_a.line(axisX0, axisX1, axisY0, axisY0, axisZ0, axisZ0);
		p5_a.line(axisX0, axisX0, axisY0, axisY1, axisZ0, axisZ0);
		p5_a.line(axisX0, axisX0, axisY0, axisY0, axisZ0, axisZ1);

		//-------- H
		p5_a.push();
		p5_a.translate(axisX1, 0, 0);
		tH.fill(125);
		tH.textSize(25);
		tH.text("H", 50, 25);
		p5_a.beginShape();
		p5_a.texture(tH);
		p5_a.plane(25, 25);
		p5_a.endShape();
		p5_a.pop();
		//-------- S
		p5_a.push();
		p5_a.translate(0, 0, axisZ1);
		tS.fill(125);
		tS.textSize(25);
		tS.text("S", 50, 25);
		p5_a.beginShape();
		p5_a.texture(tS);
		p5_a.plane(25, 25);
		p5_a.endShape();
		p5_a.pop();
		//-------- V
		p5_a.push();
		p5_a.translate(0, axisY1, 0);
		tV.fill(125);
		tV.textSize(25);
		tV.text("V", 50, 25);
		p5_a.beginShape();
		p5_a.texture(tV);
		p5_a.plane(25, 25);
		p5_a.endShape();
		p5_a.pop();

		p5_a.pop();
	}
}

function dragIn() {
	dropZone.style('background-color', '#d6f8f9');
	dropZone.style('color', '#00f7ff');
}

function dragOut() {
	dropZone.style('background-color', '#e2e2e2');
	dropZone.style('color', '#595959');
}

function loadFile(file) {

	fileName = file.name.slice(0,-4);
	//p5_a.print("FILE IS: "+fileName);
	var infoP;
	infoP = p5_a.createP("LOADING: " + file.name + ". . ." + " | TYPE :" + file.type + " & SUBTYPE: " + file.subtype + " | SIZE :" + file.size / 1000 + " KB");
	infoP.parent('infoP');
	infoP.style('color', 'blue');
	if (file.type == "text" && file.subtype == "csv") {
	infoP = p5_a.createP("LOADED: " + file.name + " !" + " | SUBTYPE :" + file.subtype + " | SIZE :" + file.size / 1000 + " KB");
	infoP.parent('infoP');
	infoP.style('color', 'green');
		let v = p5_a.float(p5_a.split(p5_a.split(file.data, "\n") + '', ","));
		dSize = v.length;
		p5_a.print(v);
		p5_a.print("V SIZE = " + dSize);
		initArray2D(v);
		colorArray();

	} else {
	infoP=p5_a.createP("ERROR! THE FILE UPLOADED IS NOT A CSV");
	infoP.parent('infoP');
	infoP.style('color', 'red');
	}
	dragOut();
	//updateP();
}

function initArray2D(d) {

	var init = [];
	cols = 3;
	rows = p5_a.int(dSize / cols);

	if (d) {
		for (var i = 0; i < cols; i++) {
			init[i] = [];
			for (var j = 0; j < rows; j++) {
				init[i][j] = null;
			}
		}
		p5_b.print(init);
		setData(init, d);
	} else {
		array[0] = 1;
		array[0][0] = 1;
		array[1][0] = 1;
		array[2][0] = 1;
		data=array;
	}

}

function setData(t, d) {
	var index = 0;
	var increment = cols;
	var i0;
	var i1;
	var i2;
	p5_b.print(rows);

	for (var k=0; k<rows; k++){
			t[0][k]=i0;
			t[1][k]=i1;
			t[2][k]=i2;
		for (var l=0; l<dSize;l++){
			i0 = d[index];
			i1 = d[index+1];
			i2 = d[index+2];
			l=l+increment;
		}
		index=index+increment;
		//print("DATA IN : "+l+" | "+t[0][l]+" , "+t[1][l]+" , "+t[2][l]);
	}

	data = t;
}

function colorArray(){

	  var total = dSize/3;
	  var sqSize = p5_b.width/total;
		p5_b.print("ONE DIMENSION ARRAY OF : "+total+" COLORS");

			for (let i=0; i<total; i++){

		    let c1 = data[0][i];
		    let c2 = data[1][i];
		    let c3 = data[2][i];
				let x0 = i*sqSize;
		    let y0 = 0;
		    let sqW = sqSize;
		    let sqH = p5_b.height;
				//p5_b.print("H: "+c1+"S: "+c2+"V: "+c3);
		    let c = new Color(c1,c2,c3,sqW,sqH,x0,y0);

		    p5_b.colors.push(c);
		  }
	}

function lookOver(){

	let frameSpacing = 3;

	  for (let i = 0; i < p5_b.colors.length; i++) {
	    if (p5_b.colors[i].over(p5_b.mouseX,p5_b.mouseY)) {
	      p5_b.colors[i].changeColor(100);
				p5_b.print("OVER AT: "+i*frameSpacing);
	      p5_b.imgIndex = i*frameSpacing;
				boxSelected = 10;

				var valueString = "FRAME # "+p5_b.imgIndex;
				frameP.html(valueString);

	    } else {
				p5_b.colors[i].changeColor(80);
	    }
			p5_b.colors[i].show();
	  }
	}

function drawImages(index){

		var imgPath;

	  imgPath = "/Users/mipapamedijo/PROYECTOS/PROGRAMAS/AnimationMetrics/02_ImageFrames/"+fileName+"/frame_"+index+".jpg";

	  p5_b.d.id('img_area');
	  p5_b.d.style("background-image","url("+imgPath+")");

	}

class Color {

	  constructor(h2,s2,v2,w,t,x,y){
	    this.h = h2;
	    this.s = s2;
	    this.v = v2;
	    this.w = w;
	    this.t = t;
	    this.x = x;
	    this.y = y;
			this.a = 0;
	  }

		changeColor(m) {
				this.a=m;
	  }

		over(px,py) {
	    if (px >= this.x && px <= this.x+this.w &&
	      py >= this.y && py <= this.y+p5_b.height){
	      return true;
	    } else {
	      return false;
	    }
	  }

	  show() {
	    p5_b.noStroke();
			p5_b.translate(0,this.dist);
	    p5_b.fill(this.h,this.s,this.v, this.a);
	    p5_b.rect(this.x, this.y, this.w, this.t);

	  }

	}

var p5_a = new p5(hsv_3d);
var p5_b = new p5(framesMap);
