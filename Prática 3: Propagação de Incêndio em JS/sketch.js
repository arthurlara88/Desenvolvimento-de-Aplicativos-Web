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
  //canvas.elt.oncontextmenu = () => false;
  
  cols = floor(width / res);
  rows = floor(height / res);
  
  grid = inicializarGrid();
  nextGrid = inicializarGrid();
  
}

function draw() {
  background(220);
  
  desenharGrid();
  
}

function inicializarGrid(){
  let novoGrid = new Array(cols);
  
  for (let i = 0; i < cols; i++){
    novoGrid[i] = new Array(rows);
    
    for(let j = 0; j < rows; j++){
    novoGrid[i][j] = random(1) < 0.1 ? estado.vazio : estado.mata;
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


function mousePressed(){
  
  let i = floor(mouseX / res);
  let j = floor(mouseY / res);
  
  //verifica se o click foi dentro da tela do trem
  if(i >= 0 && i < cols && j >= 0 && j < rows){
    
    if(mouseButton == LEFT){
      grid[i][j] = estado.fogo;
    }
    else if(mouseButton == RIGHT){
      grid[i][j] = estado.vazio;
    }
  }
}