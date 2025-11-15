const battleBox = document.getElementById('battle-box');
const soul = document.getElementById('soul');
const textBox = document.getElementById('text-box');
const livesDiv = document.getElementById('lives');
let x = 190, y = 220;
const speed = 4;

const bullets = [];
const bulletSpeed = 2;
let lives = 3;
let invulnerable = false;
let gameOver = false;

// Mostrar vidas na tela
function renderLives() {
    livesDiv.innerHTML = '';
    for (let i = 0; i < lives; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        livesDiv.appendChild(heart);
    }
}
renderLives();

// Movimento do SOUL
document.addEventListener('keydown', (e) => {
    if (gameOver) return;
    if (e.key === 'ArrowLeft') x -= speed;
    if (e.key === 'ArrowRight') x += speed;
    if (e.key === 'ArrowUp') y -= speed;
    if (e.key === 'ArrowDown') y += speed;

    // Limites
    x = Math.max(0, Math.min(x, 384));
    y = Math.max(0, Math.min(y, 234));

    soul.style.left = x + 'px';
    soul.style.top = y + 'px';
});

// Criar projéteis
function spawnBullet() {
    if (gameOver) return;
    const bullet = document.createElement('div');
    bullet.classList.add('bullet');
    bullet.style.left = Math.random() * 390 + 'px';
    bullet.style.top = '0px';
    battleBox.appendChild(bullet);
    bullets.push({ el: bullet, x: parseFloat(bullet.style.left), y: 0 });
}

// Atualizar projéteis
function updateBullets() {
    bullets.forEach((b) => {
        b.y += bulletSpeed;
        b.el.style.top = b.y + 'px';

        // Colisão
        const dx = (x + 8) - (b.x + 5);
        const dy = (y + 8) - (b.y + 5);
        if (Math.sqrt(dx * dx + dy * dy) < 12 && !invulnerable && !gameOver) {
            takeDamage();
        }

        if (b.y > 260) b.el.remove();
    });
}

// Dano
function takeDamage() {
    lives--;
    renderLives();
    invulnerable = true;
    soul.style.backgroundColor = 'gray';
    textBox.textContent = `Você foi atingido! Vidas restantes: ${lives}`;
    setTimeout(() => {
        soul.style.backgroundColor = 'red';
        invulnerable = false;
        if (!gameOver) textBox.textContent = 'Desvie dos ataques!';
    }, 1200);

    if (lives <= 0) {
        gameOver = true;
        textBox.textContent = '💀 GAME OVER 💀';
        soul.style.backgroundColor = 'black';
    }
}

// Loop principal
function gameLoop() {
    if (!gameOver) updateBullets();
    requestAnimationFrame(gameLoop);
}

setInterval(spawnBullet, 600);
gameLoop();