/*
  COMPUTACAO GRAFICA- TAREFA 2

  NOME: FELIPE SCHREIBER FERNANDES
 
  DRE: 116206990
*/

var intersections = [];
var shapes = [];
var points = [];
var randomColor;
var rays = [];
var t = 0;
var dx = 0;
var dy = 0;
var i=0;
var message;
var source; 
var resizer = 0;//resposavel por colocar o ponto final do raio(segmento de reta) no "infinito"(fora da janela)
var operationMode = 'r';
var notSelected = true;//variavel de controle que checa se algum ponto já foi selecionado
var cosAlpha = 0;
var angle = 0; 
var id = -1;//variavel que identifica qual raio está sendo movido
var polygonId = -1;//variavel que identifica qual poligono está sendo modificado
var vertexId = -1;//variavel que identifica qual vertice está sendo movido
var cosTheta = 0;
var v;
var u;
var trianglePointsArray = [];//variavel que armazena os pontos da "seta" dos raios
var initArray = [];
var minDistanceToRay;
var cor;

class shape{
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

class ray
{ 
 constructor(arr,source)
 {
  this.trianglePoints = arr;//o 3° ponto eh usado para direcionar o triangulo
  this.origin = source;//sistema de referencia transladado
 }
 get tri()
 {
  return this.trianglePoints;
 }
 get reference()
 {
  return this.origin;
 }
 originSelected(x,y)
 {
  var distance = Math.sqrt(Math.pow(x - this.origin.xAtt,2) + Math.pow(y - this.origin.yAtt,2));
  if(distance <= 20)
  {
   ellipse(x,y,15,15);
   return abs(distance);
  }
  else 
   return Math.pow(height,2) + Math.pow(width,2);
 }
 headSelected(x,y)//x,y sao as coordenadas do mouse
 {
  //var distanceToHead = Math.sqrt(Math.pow(x - this.trianglePoints[2].xAtt,2) + Math.pow(y - this.trianglePoints[2].yAtt,2));
  v = createVector(this.trianglePoints[2].xAtt - this.origin.xAtt, this.trianglePoints[2].yAtt - this.origin.yAtt);//vetor da reta  
  u = createVector(x - this.origin.xAtt, y - this.origin.yAtt);//vetor da origem até o mouse
  let t = createVector(1,-v.x/v.y);//vetor perpendicular a reta
  var distanceToLine = u.dot(t)/t.mag(); 
  if( ( (distanceToLine <= 20) && u.angleBetween(v) <= 1.55) )//vê se o angulo entre u e v é menor que 90 graus
  {
   ellipse(x,y,20,20);
   return abs(distanceToLine);
  }
  else 
   return Math.pow(height,2) + Math.pow(width,2);
 }
 set translateOrigin(a)
 {
  this.origin.translateXY = a;
  /*console.log("New ORIGIN:",this.origin.xAtt,this.origin.yAtt);
  let distance = Math.sqrt(Math.pow(this.origin.xAtt - this.trianglePoints[2].xAtt,2) + Math.pow(this.origin.yAtt - this.trianglePoints[2].yAtt,2));
  console.log("Distancia entre head e orig:",distance);*/
 }
 set translateTrianglePoints(a)
 {
  //console.log("Old HEAD:",this.trianglePoints[2].xAtt,this.trianglePoints[2].yAtt);
  this.trianglePoints[0].translateXY = a;
  this.trianglePoints[1].translateXY = a;
  this.trianglePoints[2].translateXY = a;
  //console.log("New HEAD:",this.trianglePoints[2].xAtt,this.trianglePoints[2].yAtt);
  //console.log("VALOR DE DX PASSADO:",a.x,a.y/*arr[2].xAtt,arr[2].yAtt*/);
 }
 set rotateTrianglePoints(alpha)
 {
  //console.log("Alpha passado:",alpha);
  var backToOrigin = createVector((-1)*this.origin.xAtt,(-1)*this.origin.yAtt);
  this.trianglePoints[0].translateXY = backToOrigin;
  this.trianglePoints[1].translateXY = backToOrigin;
  this.trianglePoints[2].translateXY = backToOrigin;//translada todos os pontos de volta, dessa forma só sobram os vetores em relacao 0,0
  
  this.trianglePoints[0].rotateXY = alpha;
  this.trianglePoints[1].rotateXY = alpha;
  this.trianglePoints[2].rotateXY = alpha;//rotaciona todos os pontos em torno da origem
 
  this.trianglePoints[0].translateXY = this.origin;
  this.trianglePoints[1].translateXY = this.origin;
  this.trianglePoints[2].translateXY = this.origin;//translada de volta
 }
}

class dot
{
 constructor(x,y)
 {
 this.x = x;
 this.y = y;
 }
 get xAtt() 
 {
  return this.x;  
 }  
 get yAtt() 
 {
  return this.y;  
 }
 set translateXY(a)//recebe um vetor e translada o ponto de acordo com o mesmo
 {
  //console.log("Vetor passado: ",a.x,",",a.y);
  //console.log("Ponto transladado de: ",this.x,",",this.y);
  this.x += a.x;
  this.y += a.y;
  //console.log("Para: ",this.x,",",this.y);
 }  
 set rotateXY(alpha)//rotaciona o ponto segundo a origem dos eixos
 {
  var r = this.x;
  var s = this.y;
  cosAlpha = cos(alpha);
  var sinAlpha = sin(alpha);
  this.x = r*cosAlpha - s*sinAlpha;
  this.y = r*sinAlpha + s*cosAlpha;
 }
 vertexSelected(x,y)
 { 
  let distance = Math.sqrt(Math.pow(x - this.x,2) + Math.pow(y - this.y,2));
  if(distance <= 15)
   return 1;
  else 
   return 0;
 }
}

class intersection
{
 constructor(pointA,pointB)
 { 
  this.coord = pointA;
  this.dist = Math.sqrt(Math.pow(pointA.xAtt - pointB.xAtt,2) + Math.pow(pointA.yAtt - pointB.yAtt,2));
 }
 get location()
 {
  return this.coord;
 }
 get distance()
 {
  return this.dist;
 }
}

function mousePressed() 
{
 if(operationMode === 'r')
 {
  p = new dot(mouseX,mouseY);
  console.log("Novo Raio!");
  console.log(p.xAtt,p.yAtt);
  console.log("OPERATION MODE: INSERT RAY");
 }
 else if(operationMode === "m")
 {
  console.log("OPERATION MODE: MOVE RAY");
 }
 else if(operationMode === 'p')
 {
  p = new dot(mouseX,mouseY);
  console.log("Novo ponto!");
  console.log(p.xAtt,p.yAtt);
  points.push(p);
  console.log("OPERATION MODE: DRAW POLYGON");
 }
 else if(operationMode === "l")
 {
  console.log("OPERATION MODE: MOVE POLYGON");
  p = new dot(mouseX,mouseY);
 }
 else if(operationMode === "k")
 {
  console.log("OPERATION MODE: MOVE POLYGON POINTS");
 }
}

function saveRay()
{
  v = createVector(mouseX - p.xAtt,mouseY - p.yAtt);
  v.normalize();
  if(v.y === 0)
  {
   var u = createVector(0,1);//cria vetor normal a v
   if(v.x === 0)
   {
    v.x = 1.0;//caso o vetor v seja o vetor nulo, entao atribui-se arbitrariamente esse valor a ele
   }
  }
  else
  {
   u = createVector(1,-v.x/v.y);/*caso v.y nao for zero, podemos calcular o vetor normal a v fazendo-se u.x = 1 e u.y = -v.x/v.y
 note que assim o produto escalar entre u e v será 1*v.x +(-v.x/v.y)*v.y = 0 */
  }
  u.normalize();
  p3 = new dot(p.xAtt+45*v.x,p.yAtt+45*v.y);/*p3 eh o ponto que junto com o ponto "p" fornece a direcao do triangulo.P3 eh obtido a partir da soma entre o ponto p e o vetor v*/
  p1 = new dot(p.xAtt+5*u.x+21*v.x,p.yAtt+5*u.y+21*v.y);
  p2 = new dot(p.xAtt-5*u.x+21*v.x,p.yAtt-5*u.y+21*v.y);
  initArray.push(p1);
  initArray.push(p2);
  initArray.push(p3);
  var r = new ray(initArray,p);
  rays.push(r);
  initArray = rays[rays.length -1].tri;
  console.log("u: ",u.x,",",u.y," v: ",v.x,",",v.y);
  console.log("P1: ",initArray[0].xAtt,",",initArray[0].yAtt,"P2: ",initArray[1].xAtt,",",initArray[1].yAtt,"P3: ",initArray[2].xAtt,",",initArray[2].yAtt);
  initArray = [];
}

function mouseReleased()
{
 if(operationMode === 'r')
 {
  saveRay(); 
 }//fim operation mode === 'r'
 else if(operationMode === 'k')
 {
  polygonId = -1;
  vertexId = -1;
  notSelected = true; 
 }
 else if(operationMode === 'm')
 {
  console.log("Id before m: ",id);
  id = -1;
  notSelected = true; 
  minDistanceToRay = Math.pow(height,2) + Math.pow(width,2);
  console.log("Id: ",id);
 }
 else if(operationMode === 't')
 {
  console.log("Id before t: ",id);
  id = -1;
  notSelected = true; 
  minDistanceToRay = Math.pow(height,2) + Math.pow(width,2);
  console.log("Id: ",id);
 }
 else if(operationMode === 'l')
 {
  polygonId = -1;
  notSelected = true; 
 }
}

function createRay()
{
  var readout =  " MouseX: "+mouseX+ " mouseY: "+mouseY;
  text(readout, 5, 15);
  dx = mouseX - p.xAtt;
  dy = mouseY - p.yAtt;
  var mouseRelative = createVector(dx,dy);
  v = p5.Vector.fromAngle(0, 100);
  var vx = resizer*v.x;
  var vy = resizer*v.y;//o ponto onde o segmento de reta termina se encontra fora do canvas
  cosTheta = mouseRelative.dot(v)/(mouseRelative.mag()*v.mag());
  angle = acos(cosTheta);
  if(dy <= 0)
  {
   angle = angle*(-1);//corrige o quadrante
  }
  push();
  translate(p.xAtt,p.yAtt);
  rotate(angle);
  line(0, 0, vx, vy);
  var u = createVector(0,1);//vetor normal a v
  u.normalize();
  v.normalize();
  fill('red');
  triangle(5*u.x+21*v.x,5*u.y+21*v.y,45*v.x, 45*v.y, -5*u.x+21*v.x, -5*u.y+21*v.y);
  pop();
}

function keyPressed() {
  if (keyCode === 77) {
    operationMode = 'm';
  }
  else if(keyCode === 82){
    operationMode = 'r';
  }
  else if(keyCode === 80){
    operationMode = 'p';
  }   
  else if(keyCode === 76)
  {
    operationMode = 'l';
  }
  else if(keyCode === 75)
  {
    operationMode = 'k';
  }
  else if(keyCode === 84)
  {
    operationMode = 't';
  }
}

function doubleClicked(){
 if(operationMode === 'p')
 {
  randomColor = color(random(255),random(255),random(255),100); 
  points.splice(points.length - 1,1);
  let a = new shape(points,randomColor);
  shapes.push(a);
  points = [];
 }
}

function translateRay(i,x,y)
{
 //console.log("MOUSE:",mouse.xAtt,mouse.yAtt);
 var oldOrigin = rays[i].reference;
 dx = x - oldOrigin.xAtt;
 dy = y - oldOrigin.yAtt;
 //console.log("dx:",dx," dy:",dy);
 var w = createVector(dx,dy);/*esse eh o vetor diferenca indo da antiga origem para a nova. Todos os pontos do triangulo serão transladados (somados) por esse vetor*/
 rays[i].translateTrianglePoints = w;
 rays[i].translateOrigin = w;
}

function rotateRay(i,x,y)
{
 var wx = x - rays[i].origin.xAtt;
 var wy = y - rays[i].origin.yAtt;
 if(wx !== 0 || wy !== 0)
 {
  var w = createVector(wx,wy,0);/*esse eh o vetor indo da origem(ponto onde comeca o raio) para a onde está apontando o mouse.*/
  var oldHead = rays[i].tri[2];
  var qx = oldHead.xAtt - rays[i].origin.xAtt;
  var qy = oldHead.yAtt - rays[i].origin.yAtt;
  var q = createVector(qx,qy,0);/*esse eh o vetor indo da origem(ponto onde comeca o raio) para a onde era a antiga cabeca(ponto que junto com a origem fornece a direcao do raio)*/
  cosAlpha = w.dot(q)/(q.mag()*w.mag());
  cosAlpha *= 1000000000;//nessario pois havia casos em que o resultado era 1,0000000002 (o que seria impossivel)
  angle = acos((round(cosAlpha)/1000000000));
  let crossProduct = p5.Vector.cross(q,w);
  if(crossProduct.z <= 0)
  {
   angle = angle*(-1);//correcao do quadrante
  }
  /*console.log("Q:",q.x,",",q.y,",",q.z);
  console.log("W:",w.x,",",w.y,",",w.z);
  console.log("angle:",angle);
  console.log("cosAlpha",cosAlpha);*/
  rays[i].rotateTrianglePoints = angle;
 }
}

function checkRaysR()
{
 if(notSelected)
 {
  console.log("dist before: ",minDistanceToRay);
  for(i = 0; i<rays.length; i++)
  {
   if(rays[i].headSelected(mouseX,mouseY) < minDistanceToRay && (rays[i].headSelected(mouseX,mouseY) <= 20) )
   {
    minDistanceToRay = rays[i].headSelected(mouseX,mouseY);
    notSelected = false;   
    id = i;
   }
  }//fim da iteracao no vetor de raios 
  console.log("RayR new selected: ",id," dist ",minDistanceToRay);
 }
 else if(!notSelected)//caso em que numa execucao anterior da funcao draw algum raio ja havia sido selecionado && !polygonSelected  && !orig
 {
  console.log("RayR selected: ",id);
  if(rays[id].headSelected(mouseX,mouseY))
  {
   rotateRay(id,mouseX,mouseY);     
  }
 }
}

function checkRaysT() //funcao que checa se alguma alteracao nos raios será necessaria e em caso afiramativo chama a funcao correspondente
{
 if(notSelected)
 {
  for(i = 0; i<rays.length; i++)
  {
   if(rays[i].originSelected(mouseX,mouseY) < minDistanceToRay && (rays[i].headSelected(mouseX,mouseY) <= 20))
   {  
    minDistanceToRay = rays[i].originSelected(mouseX,mouseY);
    id = i;
    notSelected = false;
   }
  }//fim da iteracao no vetor de raios 
  console.log("RayT new selected: ",id);
 }
 else if(!notSelected)//caso em que numa execucao anterior da funcao draw algum raio ja havia sido selecionado && !polygonSelected  && !head
 {
  console.log("RayT selected: ",id);
  if(rays[id].originSelected(mouseX,mouseY))
  {  
   translateRay(id,mouseX,mouseY);
  }
 }
}

function checkPolygonPoints()
{
 for(let j = 0; (j<shapes.length && notSelected); j++)
 {
  for(let i = 0; (i<shapes[j].arrAtt.length && notSelected); i++)
  {
   if(shapes[j].arrAtt[i].vertexSelected(mouseX,mouseY)) 
   {
    //console.log("Mouse: ", mouseX,",",mouseY);
    v = createVector(mouseX - shapes[j].arrAtt[i].xAtt,mouseY - shapes[j].arrAtt[i].yAtt);
    shapes[j].arrAtt[i].translateXY = v;
    //console.log("Ponto movido para: ",shapes[j].arrAtt[i].xAtt,",",shapes[j].arrAtt[i].yAtt);
    polygonId = j;
    vertexId = i;
    notSelected = false;
   }
  }
 }
 if(!notSelected)//caso em que numa execucao anterior da funcao draw um vertice de algum poligono ja havia sido selecionado  && polygonSelected
 {
  ellipse(mouseX,mouseY,15,15);
  v = createVector(mouseX - shapes[polygonId].arrAtt[vertexId].xAtt,mouseY - shapes[polygonId].arrAtt[vertexId].yAtt);
  shapes[polygonId].arrAtt[vertexId].translateXY = v;
 }
}

function drawRays()
{
 for(i = 0; i<rays.length; i++)
 {
  trianglePointsArray = rays[i].tri;
  source = rays[i].reference;
  if(trianglePointsArray.length !== 0)
  {
   fill("black");
   ellipse(source.xAtt,source.yAtt, 3, 3);
   noFill();
   fill("red");
   line(source.xAtt,source.yAtt,source.xAtt + resizer*(trianglePointsArray[2].xAtt - source.xAtt),source.yAtt + resizer*(trianglePointsArray[2].yAtt - source.yAtt));
   triangle(trianglePointsArray[0].xAtt,trianglePointsArray[0].yAtt,trianglePointsArray[1].xAtt,trianglePointsArray[1].yAtt,trianglePointsArray[2].xAtt,trianglePointsArray[2].yAtt);
   fill("black");
   ellipse(trianglePointsArray[2].xAtt,trianglePointsArray[2].yAtt,3,3);
   noFill();
  }
  else
  {
   message = "Triangle points is empty";
   console.log(message);
  }
 }
}

function drawPolygons()
{
 for(let j = 0; j<shapes.length; j++)
 {
  fill(shapes[j].corAtt);
  //console.log("Pontos do poligono ",j);
  beginShape();  
  for(let i = 0; i<shapes[j].arrAtt.length; i++)
  {
   //console.log(shapes[j].arrAtt[i].xAtt,",",shapes[j].arrAtt[i].yAtt);
   vertex(shapes[j].arrAtt[i].xAtt, shapes[j].arrAtt[i].yAtt);
  }
  endShape(CLOSE);
  for(let i = 0; i<shapes[j].arrAtt.length; i++)
  {
   fill("black");
   ellipse(shapes[j].arrAtt[i].xAtt, shapes[j].arrAtt[i].yAtt,2,2);
   noFill();
  }
 }
}

function setup() {
 var p = new dot(0,0);
 createCanvas(windowWidth, windowHeight);
 resizer = Math.SQRT2*Math.max(width,height);//serve para multiplicar o vetor do raio de forma a colocar o ponto no infinito
 minDistanceToRay = Math.pow(height,2) + Math.pow(width,2);
}

function computeSolution(q,w,a,b)/*dado os vetores q e w, bem como os pontos a e b, queremos achar a solucao do sistema 
[-w.x  q.x] t] =[a.x - b.x]
[-w.y  q.y] s]  [a.y - b.y]   */
{
 var s = 0;
 var t = 0;
 var solution = [];
 if(w.x != 0)
 {
  s = ( ( (a.xAtt - b.xAtt)*(-1)*w.y/w.x )  +  (a.yAtt - b.yAtt) );
  s /= (q.y -1*(q.x*w.y)/w.x); 
  t = (a.xAtt - b.xAtt - s*q.x)/( (-1)*w.x );
 }
 else
 {
  s = a.xAtt - b.xAtt;
  s /= q.x;
  t = (a.yAtt - b.yAtt - s*q.y)/( (-1)*w.y );
 }
 solution.push(t);
 solution.push(s);
 return solution;
}

function detectIntersections()
{
 for(i = 0; i<rays.length; i++)
 {
  P0 = rays[i].reference;
  v = createVector(rays[i].tri[2].xAtt - P0.xAtt,rays[i].tri[2].yAtt - P0.yAtt);
  for(j = 0; j<shapes.length; j++)
  {
   P1 = shapes[j].arrAtt[0];
   for(k = 1; k<=shapes[j].arrAtt.length; k++)
   {
    if(k === shapes[j].arrAtt.length)
    { 
     P2 = shapes[j].arrAtt[0];
    }
    else
    {
     P2 = shapes[j].arrAtt[k];
    }
    u = createVector(P2.xAtt - P1.xAtt, P2.yAtt - P1.yAtt);
    if( (u.x/v.x) != (u.y/v.y) )//checa se os vetores nao sao paralelos
    {
     var answer = computeSolution(u,v,P0,P1);
     if( (answer[0] >= 0) && (answer[1]>=0) && (answer[1]<=1))
     {
      var p = new dot(P1.xAtt + answer[1]*u.x,P1.yAtt + answer[1]*u.y);
      var g = new intersection(p,P0);
      intersections.push(g);
      //ellipse(P1.xAtt + answer[1]*u.x,P1.yAtt + answer[1]*u.y,4,4);   
     }
    }
    P1 = P2;
   }//fim do for(k = 1; k<=shapes[j].arrAtt.length; k++) 
   intersections.sort((a, b) => a.distance - b.distance);
   cor = 1;
   for(k = 0; k<intersections.length;k++)
   {
    if(cor%2 === 0)
    {
     fill("red");
    }
    else
    {
     fill("blue");
    }
    ellipse(intersections[k].location.xAtt,intersections[k].location.yAtt,4,4); 
    noFill();
    cor++;
   }//fim do for(k = 0; k<intersections.length;k++)
   intersections = [];
  }
 }
}

function checkIfIsInside(x,y,polygon)
{
 v = createVector(1,0);
 var count = 0;
 P0 = new dot(x,y);
 P1 = polygon[0];
 for(k = 1; k<=polygon.length; k++)
 {
  if(k === polygon.length)
  { 
   P2 = shapes[j].arrAtt[0];
  }
  else
  {
   P2 = shapes[j].arrAtt[k];
  }
  u = createVector(P2.xAtt - P1.xAtt, P2.yAtt - P1.yAtt);
  if( (u.x/v.x) != (u.y/v.y) )//checa se os vetores nao sao paralelos
  {
   var answer = computeSolution(u,v,P0,P1);
   if( (answer[0] >= 0) && (answer[1]>=0) && (answer[1]<=1))
    count++;   
  }
  P1 = P2;
 }
 return count%2; 
}


function movePolygon(vec,polygon)
{
 for(k = 0; k<polygon.length; k++)
 {
  polygon[k].translateXY = vec;
 }
} 

function draw() 
{
 background(255);
 fill("red"); 
 message = "Select mode pressing key:";
 text(message,5,70);
 noFill();
 fill("Green");
 message = "T: ROTATE RAYS";
 text(message,5,60);
 message = "M: TRANSLATE RAYS";
 text(message,5,50);
 message = "K: MOVE POLYGON POINTS";
 text(message,5,40);
 message = "P: INSERT POLYGON";
 text(message,5,30);
 message = "R: INSERT RAY";
 text(message,5,20);
 message = "L: MOVE POLYGON";
 text(message,5,10);
 noFill();
 strokeWeight(1);
 if(mouseIsPressed)
 {
  if(operationMode === 'm')
  {
   checkRaysT();
  }//fim do modo de operaca 'm'
  else if(operationMode === 't')
  {
   checkRaysR();
  }
  else if((operationMode === 'r')&& (p.xAtt !== undefined) && (p.yAtt !== undefined))
  {
   createRay();
  }
  else if(operationMode === 'k')
  {
   checkPolygonPoints();
  }
  else if(operationMode === 'l')
  {
   if(notSelected)
   {
    for(j = 0; j<shapes.length; j++)
    {
     if(checkIfIsInside(mouseX,mouseY,shapes[j].arrAtt))
     {
      var diferencePositions = createVector(mouseX - p.xAtt,mouseY - p.yAtt);
      movePolygon(diferencePositions,shapes[j].arrAtt);
      p.translateXY = diferencePositions; 
      notSelected = false;
      //polygonSelected = true;
      polygonId = j;
      console.log("IS INSIDE POLYGON");
     }
     else
     {
      console.log("IS OUTSIDE");
     }
    }//fim do for
   }//fim do if notSelected
   else
   {
    var diferencePositions = createVector(mouseX - p.xAtt,mouseY - p.yAtt);
    movePolygon(diferencePositions,shapes[polygonId].arrAtt);
    p.translateXY = diferencePositions; 
   }
  }//fim do modo de operacao === 'l'
 }//fim do evento mouseIsPressed
 drawRays(); 
 drawPolygons();
 detectIntersections();
}







