/**
 * Configurações inicias do canvas e elementos
 */
let canvas = document.getElementById('game');
let ctx = canvas.getContext('2d');

let ballRadius = 9;
let x = canvas.width / (Math.floor(Math.random() * Math.random() * 10) + 3);
let y = canvas.height - 40;
let dx = 2;
let dy = -2;
let paddleHeight = 15;
let paddleWidth = 72;


/**
 * Desenho da barra
 */
function drawPaddle() {
    ctx.beginPath();
    ctx.roundRect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight, 30);
    ctx.fillStyle = '#333';
    ctx.fill();
    ctx.closePath();
}

let paddleX = (canvas.width - paddleWidth) / 2;

/**
 * Movimentação da barra
 */
document.addEventListener('mousemove', mouseMoveHandler, false);

function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft; // Obtém posição relativa do mouse

    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2; // Movimenta de acordo com a posição do mouse
    }
}

/**
 * Configuração dos blocos
 */
let rowCount = 5;
let columnCount = 9;
let brickWidth = 54;
let brickHeight = 18;
let brickPadding = 12;
let topOffset = 40;
let leftOffset = 33;
let score = 0;

let bricks = [];

for (let i = 0; i < columnCount; i++) {

    bricks[i] = [];

    for (let j = 0; j < rowCount; j++) {

        bricks[i][j] = { x: 0, y: 0, status: 1 }; // Inicializa com a propriedade 'status'

    }
}

/**
 * Desenha os blocos
 */
function drawBricks() {
    for (let i = 0; i < columnCount; i++) {
        for (let j = 0; j < rowCount; j++) {

            if (bricks[i][j].status === 1) { // Blocos ativos
                let brickX = (i * (brickWidth + brickPadding)) + leftOffset;
                let brickY = (j * (brickHeight + brickPadding)) + topOffset;

                // Coordenadas
                bricks[i][j].x = brickX;
                bricks[i][j].y = brickY;

                ctx.beginPath();
                ctx.roundRect(brickX, brickY, brickWidth, brickHeight, 30);
                ctx.fillStyle = '#333';
                ctx.fill();
                ctx.closePath();

            }

        }
    }
}

/**
 * Desenha a bola
 */
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#333';
    ctx.fill();
    ctx.closePath();
}

function hitDetector() {
    for (let i = 0; i < columnCount; i++) {
        for (let j = 0; j < rowCount; j++) {
    
            let b = bricks[i][j];
            if (b.status === 1) { // Valida se bloco está ativo
                if (
                    x > b.x && x < b.x + brickWidth && 
                    y > b.y && y < b.y + brickHeight
                ) {
                    dy = -dy; // Inverte a direção vertical da bola
                    b.status = 0; // Elimina bloco
                    score++;

                    if (score === rowCount * columnCount) {
                        alert('You win!');
                        document.location.reload();
                    }
                }
            }
    
        }
    }
}

/**
 * Exibir placar
 */
function scoreboard() {
    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#333';
    ctx.fillText('Score: ' + score, 8, 24);
}


/**
 * Pausar jogo
 */
let isPaused = false;

document.addEventListener('keydown', pause);

function pause(e) {
    if (e.code === 'Space') {
        isPaused = !isPaused;
    }
}

/**
 * Reiniciar
 */
const restartBtn = document.getElementById('btn-restart');
restartBtn.addEventListener('click', restart);

function restart() {
    location.reload();
}

/**
 * Função principal
 */
function init() {

    if (isPaused) {
        ctx.save();
        ctx.font = 'bold 24px sans-serif';
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
        ctx.restore();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle();
    drawBricks();
    drawBall();
    hitDetector();
    scoreboard();

    // Colisão com as laterais
    if (
        x + dx > canvas.width - ballRadius ||
        x + dx < ballRadius
    ) {
        dx = -dx;
    }

    // Colisão com o topo
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            alert('Game Over!');
            document.location.reload();
        }
    }

    // Colisão com a barra
    if (
        y + dy > canvas.height - ballRadius || 
        y + dy < ballRadius
    ) {
        dy = -dy;
    }

    // Movimentação da bola
    x += dx;
    y += dy;
}

setInterval(init, 10);