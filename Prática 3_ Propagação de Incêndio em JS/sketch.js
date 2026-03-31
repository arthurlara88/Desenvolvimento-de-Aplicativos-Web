let grid, nextGrid;
let res = 10; // Tamanho do quadrado
let cols, rows;

const estado = {
  vazio: 0,
  mata: 1,
  fogo: 2,
  cinza: 3
};

function setup() {
  createCanvas(600, 600);
  //canvas.elt.oncontextmenu = () => false; //esconde o menu do navegador
  
  cols = floor(width / res);
  rows = floor(height / res);
  
  grid = inicializarGrid();
  nextGrid = inicializarGrid();
  
}

function draw() {
  background(220);
  
  desenharGrid();
  
  
  for(let i = 0; i < cols; i++){
    for(let j = 0; j < rows; j++){
      let atual = grid[i][j];
      
      if(atual === estado.fogo){
        nextGrid[i][j] = estado.cinza;
      }
      else if (atual === estado.mata){
        
        if(temFogoPerto(i, j)){
          nextGrid[i][j] = estado.fogo;
          
        }
        else {
          nextGrid[i][j] = estado.mata;
        }
      }
      else if (atual === estado.cinza){
        // 0.2% de chance das cinzas virarem mata novamente
        if(random(1) < 0.002) {
          nextGrid[i][j] = estado.mata;
        } 
        else {
          nextGrid[i][j] = estado.cinza; // Continua cinza
        }
     }  
      else {
        // Estado Vazio apenas continua vazio
        nextGrid[i][j] = atual;
      }
      }
    }
  
  let temp = grid;
  grid = nextGrid;
  nextGrid = temp;
}


function inicializarGrid(){
  let novoGrid = new Array(cols);
  
  for (let i = 0; i < cols; i++){
    novoGrid[i] = new Array(rows);
    
    for(let j = 0; j < rows; j++){
    //15% de chance de ser vazio
    novoGrid[i][j] = random(1) < 0.15 ? estado.vazio : estado.mata;
    }
  }
  
  return novoGrid;
}

function desenharGrid(){
  for(let i = 0; i < cols; i++){
    for(let j = 0; j < rows; j++){
      let x = i * res;
      let y = j * res;
      
      if(grid[i][j] === estado.vazio){
        fill("#FFFFFF");
      }
      else if (grid[i][j] === estado.mata){
        fill("#007f5f");
      }
      else if(grid[i][j] === estado.fogo){
        fill("#f77f00");
      }
      else{
        fill("#454545");
      }
      noStroke(); //sem borda
      rect(x, y, res, res);
    }
  }
}

//cria rastro de fogo
function mouseDragged() {
  mousePressed();
}

function mousePressed(){
  
  let i = floor(mouseX / res);
  let j = floor(mouseY / res);
  
  //verifica se o click foi dentro da tela do trem
  if(i >= 0 && i < cols && j >= 0 && j < rows){
    
    if(mouseButton == LEFT){
      queimar(i, j);
    }
    else if(mouseButton == RIGHT){
      grid[i][j] = estado.vazio;
    }
  }
}

function temFogoPerto(x, y) {
  let vizinhoComFogo = false;

  //verificamos os 8 vizinhos pegando fogo
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue; //pula propria celula
      let vx = x + i;
      let vy = y + j;

      if (vx >= 0 && vx < cols && vy >= 0 && vy < rows) {
        if (grid[vx][vy] === estado.fogo) {
          vizinhoComFogo = true;
          break;
        }
      }
    }
    if (vizinhoComFogo) break;
  }

  //chance de 25%
  if (vizinhoComFogo) {
    return random(1) < 0.25; 
  }

  return false;
}

function queimar(i, j) {
  //limites da tela
  if (i >= 0 && i < cols && j >= 0 && j < rows) {
    
    if (grid[i][j] === estado.mata) {
      grid[i][j] = estado.fogo;
    }
    
  }
}
