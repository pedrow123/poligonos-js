class Linha {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.pontoMeiox = (this.x1 + this.x2) / 2;
        this.pontoMeioy = (this.y1 + this.y2) / 2;
        this.linhaDireita = null;
        this.linhaEsquerda = null;
    }

    desenha() {
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#000000";

        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.x1, this.y1, 7, 0, 2 * Math.PI);
        ctx.fillStyle = "#000000";
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.x2, this.y2, 7, 0, 2 * Math.PI);
        ctx.fillStyle = "#000000";
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.pontoMeiox, this.pontoMeioy, 7, 0, 2 * Math.PI);
        ctx.fillStyle = "#00BFFF";
        ctx.fill();
        ctx.stroke();
    }

    setPontoMeio() {
        this.pontoMeiox = (this.x1 + this.x2) / 2;
        this.pontoMeioy = (this.y1 + this.y2) / 2;
    }

    divideLinha(x, y) {
        listaPontos.push(new Linha(this.x1, this.y1, x, y));
        this.x1 = x;
        this.y1 = y;
        this.setPontoMeio();

        qtdLinhas++;

        if (this.linhaEsquerda != null) {
            listaPontos[qtdLinhas].linhaEsquerda = this.linhaEsquerda;
            this.linhaEsquerda.linhaDireita = listaPontos[qtdLinhas];
        }

        this.linhaEsquerda = listaPontos[qtdLinhas];
        listaPontos[qtdLinhas].linhaDireita = this;
    }

    moveLinha(offsetX, offsetY) {
        this.x1 += offsetX;
        this.y1 += offsetY;
        this.x2 += offsetX;
        this.y2 += offsetY;
        this.setPontoMeio();

        if (this.linhaDireita != null) {
            this.linhaDireita.x1 += offsetX;
            this.linhaDireita.y1 += offsetY;
            this.linhaDireita.setPontoMeio();
        }

        if (this.linhaEsquerda != null) {
            this.linhaEsquerda.x2 += offsetX;
            this.linhaEsquerda.y2 += offsetY;
            this.linhaEsquerda.setPontoMeio();
        }
    }

    verificaClique(x, y) {
        if (this.distanciaPontos(x, this.x1, y, this.y1) <= 7) {
            return 'start';
        } else if (this.distanciaPontos(x, this.x2, y, this.y2) <= 7) {
            return 'end';
        } else if (this.distanciaPontos(x, this.pontoMeiox, y, this.pontoMeioy) <= 7) {
            return 'line';
        } else {
            return 'none';
        }
    }

    distanciaPontos(x1, x2, y1, y2) {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }
}

var c = document.getElementById("myCanvas");

c.width = window.innerWidth;
c.height = window.innerHeight;

var ctx = c.getContext("2d");

let listaPontos = [];
let qtdLinhas = 0;
let dragging = false;
let linha = null;
let dragStartX = 0;
let dragStartY = 0;

function update() {
    ctx.clearRect(0, 0, c.width, c.height);
    for (let i = 0; i < listaPontos.length; i++) {
        listaPontos[i].desenha();
    }
}

function botaoDirMouse(event) {
    event.preventDefault();

    let aux = c.getBoundingClientRect();

    let x = event.clientX - aux.left;
    let y = event.clientY - aux.top;

    for (let i = 0; i < listaPontos.length; i++) {
        if (listaPontos[i].verificaClique(x, y) !== 'none') {
            listaPontos[i].divideLinha(x, y);
            break;
        }
    }

    update();
}

function movMouse(event) {
    if (dragging) {
        let mouseX = event.pageX - this.offsetLeft;
        let mouseY = event.pageY - this.offsetTop;
        let varX = mouseX - dragStartX;
        let varY = mouseY - dragStartY;

        listaPontos[linha].moveLinha(varX, varY);

        dragStartX = mouseX;
        dragStartY = mouseY;

        update();
    }
}

c.addEventListener("mousedown", function(e) {
    let mouseX = e.pageX - this.offsetLeft;
    let mouseY = e.pageY - this.offsetTop;

    for (let i = 0; i < listaPontos.length; i++) {
        if (listaPontos[i].verificaClique(mouseX, mouseY) !== 'none') {
            dragging = true;
            linha = i;
            dragStartX = mouseX;
            dragStartY = mouseY;
            break;
        }
    }
});

c.addEventListener("mouseup", function() {
    dragging = false;
});

c.addEventListener("mousemove", movMouse);

function geraLinha() {
    listaPontos.push(new Linha(c.width / 2 - 250, c.height / 2, c.width / 2 + 250, c.height / 2));

    update();
}

geraLinha();
c.addEventListener("contextmenu", botaoDirMouse);
