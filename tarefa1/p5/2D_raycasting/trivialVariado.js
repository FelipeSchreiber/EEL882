let shapes = [];
var randomColor;

class list{
  constructor(x,cor)
 {
 this.arr = x;
 this.cor = cor;
 }
 get arrAtt()
 {
  return this.arr;      
 }
 get corAtt()
 {
  return this.cor;
 }
}
let points = [];

class dot{
constructor(x,y){
 this.x = x;
 this.y = y;
 }
 get xAtt() {
        return this.x;  
    }  
 get yAtt() {
        return this.y;  
    }  
};

function setup() {
 createCanvas(800,600,WEBGL); 
}
function mousePressed() {
  let p = new dot(mouseX,mouseY);
  console.log("Novo ponto!");
  console.log(p.xAtt,p.yAtt);
  points.push(p);
}

function doubleClicked(){
 randomColor = color(random(255),random(255),random(255)); 
 let a = new list(points,randomColor);
 shapes.push(a);
 points = [];
}

function draw() {
background(0,0,0);
for(let j = 0; j<shapes.length; j++)
{
 fill(shapes[j].corAtt);
 beginShape();  
 for(let i = 0; i<shapes[j].arrAtt.length; i++)
 {
  //console.log("OK",points[i].xAtt);
  vertex(shapes[j].arrAtt[i].xAtt, shapes[j].arrAtt[i].yAtt);
 }
 endShape(CLOSE);
 rotateX(frameCount* 0.01);
 rotateY(frameCount * 0.01);
 rotateZ(frameCount * 0.005);
}
  strokeWeight(3);
  ellipse(50, 50, 80, 80);
 //fill(color(random(50),random(125) ,random(125) , 102));
}
