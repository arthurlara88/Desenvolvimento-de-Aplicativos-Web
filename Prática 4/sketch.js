// Variaveis de controle
let sistema;
let proximoID = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  sistema = new Map();
}

class Entidade {
  #vida; // Atributo privado

  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-2, 2), random(-2, 2)); //velocidade aleatoria
    this.#vida = 255;
  }


  get deveMorrer() {
    let foraTela = (
      this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height
    );
    
    let semVida = this.#vida <= 0;
    
    return foraTela || semVida;
    
  }

  atualizar() {
    this.pos.add(this.vel); //atualiza com base na velocidade
    this.#vida -= 2; //perde "vida"
  }

  desenhar() {
    noStroke();
    fill(255, this.#vida); // transparencia com relacao a vida
    circle(this.pos.x, this.pos.y, 0);
  }
}

class Projetil extends Entidade {
  constructor(x, y) {
    super(x, y);
    this.gravidade = createVector(0, 0.1);
    this.cor = color(random(100, 255), 50, random(100, 255)); // roxo e rosa
  }
  
  atualizar(){
    this.vel.add(this.gravidade);
    super.atualizar();
  }
  
  desenhar(){
    noStroke();
    fill(this.cor)
    rectMode(CENTER);
    square(this.pos.x, this.pos.y, 12); //projetil quadrado roxo
  }

}

function draw() {
  background(20, 50); // Alpha para rastro visual

  for(let [id, obj] of sistema){
    obj.atualizar();
    obj.desenhar();
    
    if (obj.deveMorrer){
      sistema.delete(id);
    }
  }
  exibirDebug();
}

function mouseDragged() {
  let qtd = floor(random(3, 6)) // cria 3 a 5 particulas
  
  for(let i = 0; i < qtd; i++){
    let novaParticula;
    if(random() > 0.5){
      novaParticula = new Entidade(mouseX, mouseY);
    }
    else {
      novaParticula = new Projetil (mouseX, mouseY);
    }
    
    let idUnico = "p_" + proximoID;
    sistema.set(idUnico, novaParticula);
    
    proximoID++;
  }
}

function exibirDebug() {
  fill(255);
  noStroke();
  text(`Entidades ativas: ${sistema ? sistema.size : 0}`, 20, 30);
}
