const API = "https://api.rss2json.com/v1/api.json?rss_url=https://g1.globo.com/dynamo/brasil/rss2.xml";

const PLAYER_STATE = {
  PLAYING: "playing",
  PAUSED: "paused"
};

const DATA_STATE = {
  LOADING: "loading",
  READY: "ready",
  ERROR: "error"
};

let estadoPlayer = PLAYER_STATE.PLAYING;
let estadoDados = DATA_STATE.LOADING;

let noticias = [];
let indiceAtual = 0;

//Tempo
let ultimaTroca = 0;
let ultimaConsulta = 0;
let tempoRestante = 10000; //10 segundos = 10000ms

let linkNoticia;

function setup() {
  createCanvas(800, 500);
  
  //cria o botão de link uma unica vez e o oculta até ter dados
  linkNoticia = createA("#", "Abrir notícia", "_blank");
  linkNoticia.style("background-color", "#8a0500ff");
  linkNoticia.style("color", "white");
  linkNoticia.style("padding", "10px 20px");
  linkNoticia.style("text-decoration", "none"); //tira a barrinha de link
  linkNoticia.style("border-radius", "5px");
  linkNoticia.style("font-family", "Arial");
  linkNoticia.style("font-weight", "bold"); //negrito
  linkNoticia.position(width / 2 - 60, height / 2 + 80);
  linkNoticia.hide();

  //primeira chamada da API
  pegarNoticias();
}

function draw() {
  background(230); //cinza
  
  atualizarLogica();
  desenharInterface();
}

// LOGICA DE DADOS E ESTADOS

async function pegarNoticias() {
  estadoDados = DATA_STATE.LOADING;
  linkNoticia.hide();
  
  try {
    const resposta = await fetch(API);
    if (!resposta.ok) throw new Error("Erro HTTP");
    
    const dados = await resposta.json();
    noticias = dados.items;
    indiceAtual = 0;
    
    //reseta os temporizadores
    ultimaConsulta = millis();
    ultimaTroca = millis();
    tempoRestante = 10000;
    
    estadoDados = DATA_STATE.READY;
    atualizarLink(); //atualiza o href do elemento DOM
    
  } catch (erro) {
    console.error("Erro ao buscar dados:", erro);
    estadoDados = DATA_STATE.ERROR;
  }
}

function atualizarLogica() {
  //controle de atualização da API (60 segundos)
  if (millis() - ultimaConsulta > 60000) {
    pegarNoticias();
  }
  
  //controle do carrossel (10 segundos)
  if (estadoDados === DATA_STATE.READY && estadoPlayer === PLAYER_STATE.PLAYING) {
    if (millis() - ultimaTroca > 10000) {
      avancarNoticia();
    }
  }
}

function avancarNoticia() {
  indiceAtual++;
  //carrossel circular
  if (indiceAtual >= noticias.length) {
    indiceAtual = 0;
  }
  
  //reinicia o tempo para a nova noticia
  ultimaTroca = millis();
  tempoRestante = 10000;
  atualizarLink();
}

function atualizarLink() {
  if (noticias.length > 0) {
    linkNoticia.attribute("href", noticias[indiceAtual].link);
    linkNoticia.show();
  }
}

// DESENHO DA INTERFACE

function desenharInterface() {
  if (estadoDados === DATA_STATE.LOADING) {
    fill(50);
    textAlign(CENTER, CENTER);
    textSize(24);
    text("Carregando notícias", width / 2, height / 2);
    
  } else if (estadoDados === DATA_STATE.ERROR) {
    fill(200, 0, 0);
    textAlign(CENTER, CENTER);
    textSize(24);
    text("Erro ao carregar notícias. Tentando novamente", width / 2, height / 2);
    
  } else if (estadoDados === DATA_STATE.READY) {
    desenharNoticia(noticias[indiceAtual]);
    desenharIndicadorTempo();
    desenharBotaoPlayer();
  }
}

function desenharNoticia(noticia) {
  //card branco central
  rectMode(CENTER);
  fill(255);
  noStroke();
  rect(width / 2, height / 2 - 20, 700, 300, 15);
  
  //texto
  fill(30);
  textAlign(CENTER, TOP);
  
  //titulo da noticia
  textSize(22);
  textStyle(BOLD);
  let titulo = resumir(noticia.title, 90);
  text(titulo, width / 2, height / 2 - 100, 600, 100);
  
  //descricao da Noticia
  textSize(16);
  textStyle(NORMAL);
  fill(80);
  let descLimpa = limparHTML(noticia.description);
  let descResumida = resumir(descLimpa, 200);
  text(descResumida, width / 2, height / 2 - 30, 600, 150);
}

function desenharIndicadorTempo() {
  //calcula dinamicamente o tempo que falta
  let tempoCalculado;
  if (estadoPlayer === PLAYER_STATE.PLAYING) {
    tempoCalculado = 10000 - (millis() - ultimaTroca);
  }
  else {
    tempoCalculado = tempoRestante; //se pausado, congela no tempo restante
  }
  
  //nao exibe valores negativos por atrasos de frame
  if (tempoCalculado < 0) tempoCalculado = 0;
  
  //barra de fundo
  let larguraMax = 700;
  rectMode(CORNER);
  fill(220);
  rect(width / 2 - 350, height / 2 + 150, larguraMax, 6, 3);
  
  //barra de progresso
  let larguraProgresso = map(tempoCalculado, 10000, 0, 0, larguraMax);
  fill(196, 23, 12);
  rect(width / 2 - 350, height / 2 + 150, larguraProgresso, 6, 3);
}

function desenharBotaoPlayer() {
  let btnX = width / 2;
  let btnY = height - 40;
  let raio = 25;
  
  //cor do botao (Muda se o mouse passar por cima - hover)
  if (dist(mouseX, mouseY, btnX, btnY) < raio) {
    fill(70); 
  }
  else {
    fill(40);
  }
  circle(btnX, btnY, raio * 2);
  
  //Play ou Pause
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(18);
  
  if (estadoPlayer === PLAYER_STATE.PLAYING) {
    text("❚❚", btnX, btnY);
  } else {
    //desenha o triangulo de Play
    //ajustado para centralizar
    triangle(btnX - 4, btnY - 8, btnX - 4, btnY + 8, btnX + 8, btnY);
  }
}

// INTERACAO E OUTROS

function mousePressed() {
  let btnX = width / 2;
  let btnY = height - 40;
  let raio = 25;
  
  //verifica se clicou em cima do botao Play/Pause
  if (dist(mouseX, mouseY, btnX, btnY) < raio && estadoDados === DATA_STATE.READY) {
    
    if (estadoPlayer === PLAYER_STATE.PLAYING) {
      estadoPlayer = PLAYER_STATE.PAUSED;
      
      //salva o tempo exato que restava
      tempoRestante = 10000 - (millis() - ultimaTroca);
      
    } else {
      estadoPlayer = PLAYER_STATE.PLAYING;
      
      //engana o millis(), empurrando a ultimaTroca
      //parece que o tempo nao passou enquanto esteve pausado
      ultimaTroca = millis() - (10000 - tempoRestante);
    }
  }
}

function resumir(texto, limite) {
  if (texto.length <= limite) return texto;
  let corte = texto.substring(0, limite);
  let ultimoEspaco = corte.lastIndexOf(" ");
  return corte.substring(0, ultimoEspaco) + "...";
}

function limparHTML(html) {
  let div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}