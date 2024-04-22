var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// Inicializa a posição e tamanho da reta
var startX = 50;
var startY = 50;
var endX = 200;
var endY = 200;
var lineLength = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));

// Calcula o ponto médio inicial da reta
var midX = (startX + endX) / 2;
var midY = (startY + endY) / 2;

// Função para desenhar a reta e o marcador do meio
function drawLine() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Calcula o ponto médio atualizado da reta
    midX = (startX + endX) / 2;
    midY = (startY + endY) / 2;

    // Desenha o marcador do meio
    ctx.beginPath();
    ctx.arc(midX, midY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
}

drawLine(); // Desenha a reta inicialmente

var dragging = false; // Flag para indicar se o mouse está sendo arrastado
var dragStartX, dragStartY; // Variáveis para armazenar a posição inicial de arrasto

// Evento de clique no canvas
canvas.addEventListener('mousedown', function(e) {
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;

    // Verifica se o clique foi em um dos cantos da reta
    if (mouseX > startX - 5 && mouseX < startX + 5 && mouseY > startY - 5 && mouseY < startY + 5) {
        dragging = 'start'; // Define que o canto de início está sendo arrastado
        dragStartX = mouseX;
        dragStartY = mouseY;
    } else if (mouseX > endX - 5 && mouseX < endX + 5 && mouseY > endY - 5 && mouseY < endY + 5) {
        dragging = 'end'; // Define que o canto de fim está sendo arrastado
        dragStartX = mouseX;
        dragStartY = mouseY;
    } else if (mouseX > midX - 5 && mouseX < midX + 5 && mouseY > midY - 5 && mouseY < midY + 5) {
        dragging = 'line'; // Define que o marcador do meio está sendo arrastado
        dragStartX = mouseX;
        dragStartY = mouseY;
    }
});

// Evento de soltar o clique do mouse
canvas.addEventListener('mouseup', function(e) {
    dragging = false; // Reseta a flag de arrastar
});

// Evento de movimento do mouse
canvas.addEventListener('mousemove', function(e) {
    if (dragging === 'start') {
        startX = e.pageX - this.offsetLeft;
        startY = e.pageY - this.offsetTop;
    } else if (dragging === 'end') {
        endX = e.pageX - this.offsetLeft;
        endY = e.pageY - this.offsetTop;
    } else if (dragging === 'line') {
        var offsetX = e.pageX - this.offsetLeft - dragStartX;
        var offsetY = e.pageY - this.offsetTop - dragStartY;
        startX += offsetX;
        startY += offsetY;
        endX += offsetX;
        endY += offsetY;
        dragStartX = e.pageX - this.offsetLeft;
        dragStartY = e.pageY - this.offsetTop;
    }

    drawLine(); // Redesenha a reta após o movimento
});
