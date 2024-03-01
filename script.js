const canvasEl = document.querySelector("canvas"),
  canvasCtx = canvasEl.getContext("2d");

const lineWidth = 15;

const gapX = 10

const mouse = {
  x: 0,
  y: 0,
};

const field = {
  w: window.innerWidth,
  h: window.innerHeight,
  draw: function () {
    //desenha o fundo do jogo
    canvasCtx.fillStyle = "#286047";
    canvasCtx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  },
};

const line = {
  x: field.w / 2 - lineWidth / 2,
  y: 0,
  //desenha a linha central
  draw: function () {
    canvasCtx.fillStyle = "#ffffff";
    canvasCtx.fillRect(this.x, this.y, lineWidth, field.h);
  },
};

const scoreBoard = {
  human: 0,
  computer: 0,
  increaseHuman: function(){
    this.human ++
  },
  increaseComputer: function(){
    this.computer ++
  },
  //desenha o placar
  draw: function () {
    canvasCtx.font = "bold 72px Arial";
    canvasCtx.textAlign = "center";
    canvasCtx.textBaseline = "top";
    canvasCtx.fillStyle = "#01341D";
    canvasCtx.fillText(this.human, field.w / 4, 50);
    canvasCtx.fillText(this.computer, (field.w / 4) * 3, 50);
  },
};

const leftRacket = {
  racketHeight: 200,
  racketWidth: lineWidth,
  x: 10,
  y: 0,
  _move: function () {
    this.y = mouse.y - this.racketHeight / 2;
  },
  //desenha a raquete esquerda
  draw: function () {
    canvasCtx.fillRect(this.x, this.y, this.racketWidth, this.racketHeight);

    this._move();
  },
};

const rightRacket = {
  racketHeight: 200,
  racketWidth: lineWidth,
  x: field.w - lineWidth - 10,
  y: 400,
  speed:5,
  _move: function () {
    //ajusta a raquete do computador
    if(this.y + this.h / 2 < ball.y + ball.r ){
      this.y += this.speed
    }else{
      this.y -= this.speed
    }


    this.y = ball.y;
  },
  _speedUp: function(){
    this.speed += 2
  },
  //desenha a raquete esquerda
  draw: function () {
    canvasCtx.fillRect(this.x, this.y, this.racketWidth, this.racketHeight);

    this._move();
  },
};

const ball = {
  x: 0,
  y: 0,
  r: 20,
  speed: 3,
  directionX: 1,
  directionY: 1,
  _calcPosition: function () {
    //verifica se o jogador 1 fez ponto
    if(this.x > field.w - this.r - rightRacket.racketWidth - gapX){
        //verifica se a raquete direita está na posição y da bola
        if(this.y + this.r > rightRacket.y &&
            this.y - this.r < rightRacket.y + rightRacket.racketHeight)
            {
              //raquete rebate a bola invertendo o sinal de X
              this._reverseX()
            }else{
              //pontua jogador 1
              scoreBoard.increaseHuman()
              this._pointUp()
            }
    }

    //verifica se o jogador 2 fez um ponto
    if(this.x <  this.r + leftRacket.racketWidth + gapX){
      //verifica se a raquete esquerda está na posição y da bola
      if(this.y + this.r > leftRacket.y &&
         this.y - this.r < leftRacket.y + leftRacket.racketHeight)
         {
          this._reverseX()
         }else{
          //pontua jogador 2
          scoreBoard.increaseComputer()
          this._pointUp()
         }
    }

    //verifica as posições do eixo y
    if (
      (this.y - this.r < 0 && this.directionY < 0) ||
      (this.y > field.h - this.r && this.directionY > 0)
    ) {
      //rebate a bola invertendo o sinal do eixo y
      this._reverseY();
    }
  },
  _reverseY: function () {
    // 1 * -1 = -1
    //-1 * -1 = 1
    this.directionY *= -1;
  },
  _reverseX: function () {
    this.directionX *= -1;
  },
  _speedUp: function(){
    this.speed += 2
  },
  _pointUp: function(){
    //centraliza a bola
    this.y = field.h / 2
    this.x = field.w / 2

    //aumenta a velocidade da raquete
    rightRacket._speedUp()

    //aumenta a velocidade da bola
    this._speedUp()
  },
  _move: function () {
    this.x += this.directionX * this.speed;
    this.y += this.directionY * this.speed;
  },
  //desenha o circulo
  draw: function () {
    canvasCtx.beginPath();
    canvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
    canvasCtx.fill();

    //calcula a posição para inverter
    this._calcPosition();

    //animação da bolinha
    this._move();
  },
};

function setup() {
  canvasEl.width = canvasCtx.width = field.w;
  canvasEl.height = canvasCtx.height = field.h;
}

function draw() {
  //desenha o fundo do jogo
  field.draw();

  //desenha a linha central
  line.draw();

  //desenha as raquetes
  rightRacket.draw();
  leftRacket.draw();

  //desenha o circulo
  ball.draw();

  //desenha o placar
  scoreBoard.draw();
}

window.animateFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      return window.setTimeout(callback, 1000 / 60);
    }
  );
})();

function main() {
  animateFrame(main);
  draw();
}

setup();
main();

canvasEl.addEventListener("mousemove", function (e) {
  mouse.x = e.pageX;
  mouse.y = e.pageY;
});
