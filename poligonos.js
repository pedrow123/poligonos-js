class Linha {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.pontoMeiox = (this.x1 + this.x2) / 2;
        this.pontoMeioy = (this.y1 + this.y2) / 2;
        this.linhaDir = null;
        this.linhaEsq = null;
    }

    desenha() {
        ctx.lineWidth = 5;
        ctx.strokeStyle = "red";

        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.x1, this.y1, 7, 0, 2 * Math.PI);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.x2, this.y2, 7, 0, 2 * Math.PI);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.pontoMeiox, this.pontoMeioy, 7, 0, 2 * Math.PI);
        ctx.fillStyle = "#f2f2f2";
        ctx.fill();
        ctx.stroke();
    }

    setPontoMeio() {
        this.pontoMeiox = (this.x1 + this.x2) / 2;
        this.pontoMeioy = (this.y1 + this.y2) / 2;
    }
}

var canvas = document.getElementById("myCanvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var ctx = canvas.getContext("2d");

let listaLinhas = [];
let ultimaX = 0;
let ultimaY = 0;
let emMovimento = false;
let linhaSelecionada = 0;
let pontoSelecionado = 0;
let qtdLinhas = 0;

canvas.addEventListener("mousedown", cliqueMouse);
canvas.addEventListener("mousemove", movimentoMouse);
canvas.addEventListener("mouseup", soltaMouse);
canvas.addEventListener("contextmenu", cliqueBotaoDireito);

function atualizaCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < listaLinhas.length; i++) {
        listaLinhas[i].desenha();
    }
}

function distanciaPontos(x1, x2, y1, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function geraNumeroAleatorio(min, max, op) {
    let num = Math.floor(Math.random() * (max - min + 1)) + min;
    let aux = canvas.getBoundingClientRect();

    if (op == 0) {
        while (num > canvas.width + aux.left || num < aux.left) {
            num = Math.floor(Math.random() * (max - min + 1)) + min;
        }
    } else if (op == 1) {
        while (num > canvas.height + aux.top || num < aux.top) {
            num = Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }

    return num;
}

function distanciaPontoEReta(x, y, x1, y1, x2, y2) {
    let a = y2 - y1;
    let b = x1 - x2;
    let c = x2 * y1 - x1 * y2;

    let d = Math.abs(a * x + b * y + c) / Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

    return d;
}

function cliqueMouse(event) {
    let aux = canvas.getBoundingClientRect();

    let x = event.clientX - aux.left;
    let y = event.clientY - aux.top;

    for (let i = 0; i < listaLinhas.length; i++) {
        if (distanciaPontos(x, listaLinhas[i].x1, y, listaLinhas[i].y1) <= 7) {
            ultimaX = listaLinhas[i].x1;
            ultimaY = listaLinhas[i].y1;
            emMovimento = true;
            linhaSelecionada = i;
            pontoSelecionado = 0;
            break;
        } else if (distanciaPontos(x, listaLinhas[i].pontoMeiox, y, listaLinhas[i].pontoMeioy) <= 7) {
            ultimaX = listaLinhas[i].pontoMeiox;
            ultimaY = listaLinhas[i].pontoMeioy;
            emMovimento = true;
            linhaSelecionada = i;
            pontoSelecionado = 1;
            break;
        } else if (distanciaPontos(x, listaLinhas[i].x2, y, listaLinhas[i].y2) <= 7) {
            ultimaX = listaLinhas[i].x2;
            ultimaY = listaLinhas[i].y2;
            emMovimento = true;
            linhaSelecionada = i;
            pontoSelecionado = 2;
            break;
        }
    }
}

function movimentoMouse(event) {
    if (emMovimento) {
        let aux = canvas.getBoundingClientRect();

        let x = event.clientX - aux.left;
        let y = event.clientY - aux.top;
        let varX = x - ultimaX;
        let varY = y - ultimaY;

        if (pontoSelecionado == 0) {
            listaLinhas[linhaSelecionada].x1 += varX;
            listaLinhas[linhaSelecionada].y1 += varY;
            listaLinhas[linhaSelecionada].setPontoMeio();

            if (listaLinhas[linhaSelecionada].linhaEsq != null) {
                listaLinhas[linhaSelecionada].linhaEsq.x2 += varX;
                listaLinhas[linhaSelecionada].linhaEsq.y2 += varY;
                listaLinhas[linhaSelecionada].linhaEsq.setPontoMeio();
            }

            ultimaX = x;
            ultimaY = y;
        } else if (pontoSelecionado == 1) {

            listaLinhas[linhaSelecionada].x1 += varX;
            listaLinhas[linhaSelecionada].y1 += varY;
            listaLinhas[linhaSelecionada].x2 += varX;
            listaLinhas[linhaSelecionada].y2 += varY;
            listaLinhas[linhaSelecionada].pontoMeiox += varX;
            listaLinhas[linhaSelecionada].pontoMeioy += varY;

            if (listaLinhas[linhaSelecionada].linhaEsq != null) {
                listaLinhas[linhaSelecionada].linhaEsq.x2 += varX;
                listaLinhas[linhaSelecionada].linhaEsq.y2 += varY;
                listaLinhas[linhaSelecionada].linhaEsq.setPontoMeio();
            }

            if (listaLinhas[linhaSelecionada].linhaDir != null) {
                listaLinhas[linhaSelecionada].linhaDir.x1 += varX;
                listaLinhas[linhaSelecionada].linhaDir.y1 += varY;
                listaLinhas[linhaSelecionada].linhaDir.setPontoMeio();
            }

            ultimaX = x;
            ultimaY = y;

        } else if (pontoSelecionado == 2) {
            listaLinhas[linhaSelecionada].x2 += varX;
            listaLinhas[linhaSelecionada].y2 += varY;
            listaLinhas[linhaSelecionada].setPontoMeio();

            if (listaLinhas[linhaSelecionada].linhaDir != null) {
                listaLinhas[linhaSelecionada].linhaDir.x1 += varX;
                listaLinhas[linhaSelecionada].linhaDir.y1 += varY;
                listaLinhas[linhaSelecionada].linhaDir.setPontoMeio();
            }

            ultimaX = x;
            ultimaY = y;
        }
    }

    atualizaCanvas();
}

function cliqueBotaoDireito(event) {
    event.preventDefault();

    let aux = canvas.getBoundingClientRect();

    let x = event.clientX - aux.left;
    let y = event.clientY - aux.top;

    for (let i = 0; i < listaLinhas.length; i++) {
        if (distanciaPontoEReta(x, y, listaLinhas[i].x1, listaLinhas[i].y1, listaLinhas[i].x2, listaLinhas[i].y2) <= 7) {
            listaLinhas.push(new Linha(listaLinhas[i].x1, listaLinhas[i].y1, x, y));
            listaLinhas[i].x1 = x;
            listaLinhas[i].y1 = y;
            listaLinhas[i].setPontoMeio();

            qtdLinhas++;

            if (listaLinhas[i].linhaEsq != null) {
                listaLinhas[qtdLinhas].linhaEsq = listaLinhas[i].linhaEsq;
                listaLinhas[i].linhaEsq.linhaDir = listaLinhas[qtdLinhas];
            }

            listaLinhas[i].linhaEsq = listaLinhas[qtdLinhas];
            listaLinhas[qtdLinhas].linhaDir = listaLinhas[i];

            break;
        }
    }

    atualizaCanvas();
}

function geraPoligono(num) {

    listaLinhas = [];
    qtdLinhas = 0;

    for (let i = 0; i < num; i++) {
        if (i == 0) {
            listaLinhas.push(new Linha(geraNumeroAleatorio(0, canvas.width, 0), geraNumeroAleatorio(0, canvas.height, 1), geraNumeroAleatorio(0, canvas.width, 0), geraNumeroAleatorio(0, canvas.height, 1)));
            qtdLinhas++;
        } else if (i == num - 1) {
            listaLinhas.push(new Linha(listaLinhas[i - 1].x2, listaLinhas[i - 1].y2, listaLinhas[0].x1, listaLinhas[0].y1));
        } else {
            listaLinhas.push(new Linha(listaLinhas[i - 1].x2, listaLinhas[i - 1].y2, geraNumeroAleatorio(0, canvas.width, 0), geraNumeroAleatorio(0, canvas.height, 1)));
            qtdLinhas++;
        }
    }

    for (let i = 0; i < listaLinhas.length; i++) {
        if (i == 0) {
            listaLinhas[i].linhaEsq = listaLinhas[listaLinhas.length - 1];
            listaLinhas[i].linhaDir = listaLinhas[i + 1];
        } else if (i == listaLinhas.length - 1) {
            listaLinhas[i].linhaEsq = listaLinhas[i - 1];
            listaLinhas[i].linhaDir = listaLinhas[0];
        } else {
            listaLinhas[i].linhaEsq = listaLinhas[i - 1];
            listaLinhas[i].linhaDir = listaLinhas[i + 1];
        }
    }

    atualizaCanvas();
}

function geraLinha() {
    listaLinhas = [];

    listaLinhas.push(new Linha(canvas.width / 2 - 250, canvas.height / 2, canvas.width / 2 + 250, canvas.height / 2));

    atualizaCanvas();
}

function modoLinha() {
    let elem = document.getElementById("linha");

    elem.addEventListener("click", function() {
        geraLinha();
    });
}

function numLadosPoligono() {
    let elem = document.getElementById("submit");

    elem.addEventListener("click", function() {
        let num = document.getElementById("numLados").value;
        if (num >= 3 && num <= 8) {
            geraPoligono(num);
        } else {
            alert("Digite um número entre 3 e 8!");
        }
    });
}

function soltaMouse(event) {
    if (emMovimento) {
        emMovimento = false;
    }
}

geraLinha();
modoLinha();
numLadosPoligono();