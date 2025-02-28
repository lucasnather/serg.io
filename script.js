// Variáveis do jogo
const bird = document.getElementById('bird');
const gameContainer = document.getElementById('game-container');
const motivation = document.getElementById('motivation');
let birdY = 300;
let velocity = 0;
let gravity = 0.8; // Gravidade aumentada
let score = 0;
let gameLoop;
let pipeCreationLoop;

// Função de pulo
function jump() {
    velocity = -12; // Força do pulo ajustada
}

// Atualiza a posição do pássaro
function updateBird() {
    velocity += gravity;
    birdY += velocity;
    bird.style.top = `${birdY}px`;

    // Verifica colisão com chão/teto
    if (birdY < 0 || birdY > gameContainer.offsetHeight - bird.offsetHeight) {
        endGame();
    }
}

// Cria um par de canos
function createPipe() {
    const gap = 250; // Aumentei a separação entre os canos
    const pipeHeight = Math.random() * (gameContainer.offsetHeight - gap - 100) + 50;

    // Cano de cima
    const topPipe = document.createElement('div');
    topPipe.className = 'pipe';
    topPipe.style.height = `${pipeHeight}px`;
    topPipe.style.top = '0';
    topPipe.style.left = '400px';

    // Cano de baixo
    const bottomPipe = document.createElement('div');
    bottomPipe.className = 'pipe';
    bottomPipe.style.height = `${gameContainer.offsetHeight - pipeHeight - gap}px`;
    bottomPipe.style.bottom = '0';
    bottomPipe.style.left = '400px';

    gameContainer.appendChild(topPipe);
    gameContainer.appendChild(bottomPipe);

    // Movimento dos canos
    let pipeX = 400;
    const pipeMoveInterval = setInterval(() => {
        pipeX -= 2;
        topPipe.style.left = `${pipeX}px`;
        bottomPipe.style.left = `${pipeX}px`;

        // Verifica colisão
        if (checkCollision(topPipe, bottomPipe)) {
            endGame();
        }

        // Atualiza pontuação
        if (pipeX === 50) {
            score += 1;
            document.getElementById('score').textContent = score;

            // Mostra a mensagem a cada 10 pontos
            if (score % 1 === 0 && score <= 200) {
                motivation.style.display = 'block';
                setTimeout(() => {
                    motivation.style.display = 'none';
                }, 2000); // Esconde a mensagem após 2 segundos
            }

            // Fim do jogo ao atingir 200 pontos
            if (score === 200) {
                endGame();
                alert("Parabéns! Você venceu!");
            }
        }

        // Remove canos fora da tela
        if (pipeX < -60) {
            clearInterval(pipeMoveInterval);
            gameContainer.removeChild(topPipe);
            gameContainer.removeChild(bottomPipe);
        }
    }, 20);
}

// Verifica colisão
function checkCollision(topPipe, bottomPipe) {
    const birdRect = bird.getBoundingClientRect();
    const topPipeRect = topPipe.getBoundingClientRect();
    const bottomPipeRect = bottomPipe.getBoundingClientRect();

    return (
        birdRect.right > topPipeRect.left &&
        birdRect.left < topPipeRect.right &&
        (birdRect.top < topPipeRect.bottom || birdRect.bottom > bottomPipeRect.top)
    );
}

// Finaliza o jogo
function endGame() {
    clearInterval(gameLoop);
    clearInterval(pipeCreationLoop);
    alert(`Game Over! Pontuação: ${score}`);
    window.location.reload();
}

// Event listeners
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') jump();
});
document.addEventListener('click', jump);

// Inicia o jogo
gameLoop = setInterval(updateBird, 20);
pipeCreationLoop = setInterval(createPipe, 1500);