class Linha {
    constructor(x1, y1, x2, y2) {
        this.inicioX = x1;
        this.inicioY = y1;
        this.fimX = x2;
        this.fimY = y2;
        this.pontoMediox = (this.inicioX + this.fimX) / 2;
        this.pontoMedioy = (this.inicioY + this.fimY) / 2;
        this.linhaAnterior = null;
        this.linhaPosterior = null;
    }

    desenha() {
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#000000";

        ctx.beginPath();
        ctx.moveTo(this.inicioX, this.inicioY);
        ctx.lineTo(this.fimX, this.fimY);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.inicioX, this.inicioY, 7, 0, 2 * Math.PI);
        ctx.fillStyle = "#FF0000";
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.fimX, this.fimY, 7, 0, 2 * Math.PI);
        ctx.fillStyle = "#00FF00";
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.pontoMediox, this.pontoMedioy, 7, 0, 2 * Math.PI);
        ctx.fillStyle = "#0000FF";
        ctx.fill();
        ctx.stroke();
    }

    setPontoMedio() {
        this.pontoMediox = (this.inicioX + this.fimX) / 2;
        this.pontoMedioy = (this.inicioY + this.fimY) / 2;
    }
}

var canvas = document.getElementById("myCanvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var ctx = canvas.getContext("2d");

let linhas = [];
let ultimoX = 0;
let ultimoY = 0;
let movendo = false;
let linhaSelecionada = 0;
let pontoSelecionado = 0;
let quantidadeLinhas = 0;

canvas.addEventListener("mousedown", cliqueMouse);
canvas.addEventListener("mousemove", movimentoMouse);
canvas.addEventListener("mouseup", soltarMouse);
canvas.addEventListener("contextmenu", cliqueBotaoDireito);

function atualizarCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < linhas.length; i++) {
        linhas[i].desenha();
    }
}

function distanciaPontos(x1, x2, y1, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function gerarNumeroAleatorio(min, max, op) {
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

    for (let i = 0; i < linhas.length; i++) {
        if (distanciaPontos(x, linhas[i].inicioX, y, linhas[i].inicioY) <= 7) {
            ultimoX = linhas[i].inicioX;
            ultimoY = linhas[i].inicioY;
            movendo = true;
            linhaSelecionada = i;
            pontoSelecionado = 0;
            break;
        } else if (distanciaPontos(x, linhas[i].pontoMediox, y, linhas[i].pontoMedioy) <= 7) {
            ultimoX = linhas[i].pontoMediox;
            ultimoY = linhas[i].pontoMedioy;
            movendo = true;
            linhaSelecionada = i;
            pontoSelecionado = 1;
            break;
        } else if (distanciaPontos(x, linhas[i].fimX, y, linhas[i].fimY) <= 7) {
            ultimoX = linhas[i].fimX;
            ultimoY = linhas[i].fimY;
            movendo = true;
            linhaSelecionada = i;
            pontoSelecionado = 2;
            break;
        }
    }
}

function movimentoMouse(event) {
    if (movendo) {
        let aux = canvas.getBoundingClientRect();

        let x = event.clientX - aux.left;
        let y = event.clientY - aux.top;
        let varX = x - ultimoX;
        let varY = y - ultimoY;

        if (pontoSelecionado == 0) {
            linhas[linhaSelecionada].inicioX += varX;
            linhas[linhaSelecionada].inicioY += varY;
            linhas[linhaSelecionada].setPontoMedio();

            if (linhas[linhaSelecionada].linhaAnterior != null) {
                linhas[linhaSelecionada].linhaAnterior.fimX += varX;
                linhas[linhaSelecionada].linhaAnterior.fimY += varY;
                linhas[linhaSelecionada].linhaAnterior.setPontoMedio();
            }

            ultimoX = x;
            ultimoY = y;
        } else if (pontoSelecionado == 1) {

            linhas[linhaSelecionada].inicioX += varX;
            linhas[linhaSelecionada].inicioY += varY;
            linhas[linhaSelecionada].fimX += varX;
            linhas[linhaSelecionada].fimY += varY;
            linhas[linhaSelecionada].pontoMediox += varX;
            linhas[linhaSelecionada].pontoMedioy += varY;

            if (linhas[linhaSelecionada].linhaAnterior != null) {
                linhas[linhaSelecionada].linhaAnterior.fimX += varX;
                linhas[linhaSelecionada].linhaAnterior.fimY += varY;
                linhas[linhaSelecionada].linhaAnterior.setPontoMedio();
            }

            if (linhas[linhaSelecionada].linhaPosterior != null) {
                linhas[linhaSelecionada].linhaPosterior.inicioX += varX;
                linhas[linhaSelecionada].linhaPosterior.inicioY += varY;
                linhas[linhaSelecionada].linhaPosterior.setPontoMedio();
            }

            ultimoX = x;
            ultimoY = y;

        } else if (pontoSelecionado == 2) {
            linhas[linhaSelecionada].fimX += varX;
            linhas[linhaSelecionada].fimY += varY;
            linhas[linhaSelecionada].setPontoMedio();

            if (linhas[linhaSelecionada].linhaPosterior != null) {
                linhas[linhaSelecionada].linhaPosterior.inicioX += varX;
                linhas[linhaSelecionada].linhaPosterior.inicioY += varY;
                linhas[linhaSelecionada].linhaPosterior.setPontoMedio();
            }

            ultimoX = x;
            ultimoY = y;
        }
    }

    atualizarCanvas();
}

function cliqueBotaoDireito(event) {
    event.preventDefault();

    let aux = canvas.getBoundingClientRect();

    let x = event.clientX - aux.left;
    let y = event.clientY - aux.top;

    for (let i = 0; i < linhas.length; i++) {
        if (distanciaPontoEReta(x, y, linhas[i].inicioX, linhas[i].inicioY, linhas[i].fimX, linhas[i].fimY) <= 7) {
            linhas.push(new Linha(linhas[i].inicioX, linhas[i].inicioY, x, y));
            linhas[i].inicioX = x;
            linhas[i].inicioY = y;
            linhas[i].setPontoMedio();

            quantidadeLinhas++;

            if (linhas[i].linhaAnterior != null) {
                linhas[quantidadeLinhas].linhaAnterior = linhas[i].linhaAnterior;
                linhas[i].linhaAnterior.linhaPosterior = linhas[quantidadeLinhas];
            }

            linhas[i].linhaAnterior = linhas[quantidadeLinhas];
            linhas[quantidadeLinhas].linhaPosterior = linhas[i];

            break;
        }
    }

    atualizarCanvas();
}

function gerarPoligono(num) {

    linhas = [];
    quantidadeLinhas = 0;

    for (let i = 0; i < num; i++) {
        if (i == 0) {
            linhas.push(new Linha(gerarNumeroAleatorio(0, canvas.width, 0), gerarNumeroAleatorio(0, canvas.height, 1), gerarNumeroAleatorio(0, canvas.width, 0), gerarNumeroAleatorio(0, canvas.height, 1)));
            quantidadeLinhas++;
        } else if (i == num - 1) {
            linhas.push(new Linha(linhas[i - 1].fimX, linhas[i - 1].fimY, linhas[0].inicioX, linhas[0].inicioY));
        } else {
            linhas.push(new Linha(linhas[i - 1].fimX, linhas[i - 1].fimY, gerarNumeroAleatorio(0, canvas.width, 0), gerarNumeroAleatorio(0, canvas.height, 1)));
            quantidadeLinhas++;
        }
    }

    for (let i = 0; i < linhas.length; i++) {
        if (i == 0) {
            linhas[i].linhaAnterior = linhas[linhas.length - 1];
            linhas[i].linhaPosterior = linhas[i + 1];
        } else if (i == linhas.length - 1) {
            linhas[i].linhaAnterior = linhas[i - 1];
            linhas[i].linhaPosterior = linhas[0];
        } else {
            linhas[i].linhaAnterior = linhas[i - 1];
            linhas[i].linhaPosterior = linhas[i + 1];
        }
    }

    atualizarCanvas();
}

function geraLinha() {
    linhas = [];

    linhas.push(new Linha(canvas.width / 2 - 250, canvas.height / 2, canvas.width / 2 + 250, canvas.height / 2));

    atualizarCanvas();
}

function modoLinha() {
    let elem = document.getElementById("linha");

    elem.addEventListener("click", function() {
        geraLinha();
    });
}

function numeroLadosPoligono() {
    let elem = document.getElementById("submit");

    elem.addEventListener("click", function() {
        let num = document.getElementById("numLados").value;
        if (num >= 3 && num <= 8) {
            gerarPoligono(num);
        } else {
            alert("Digite um número entre 3 e 8!");
        }
    });
}

function soltarMouse(event) {
    if (movendo) {
        movendo = false;
    }
}
geraLinha()
modoLinha()
gerarPoligono(1); 
numeroLadosPoligono();
