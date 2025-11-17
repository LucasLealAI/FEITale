const battleBox = document.getElementById('battle-box');
const soul = document.getElementById('soul');
const textBox = document.getElementById('text-box');
const livesDiv = document.getElementById('lives');

let x = 190, y = 220;
const speed = 10;

const bullets = [];
const bulletSpeed = 2;

let lives = 3;
let invulnerable = false;
let gameOver = false;

let turn = "menu"; 

const enemy = {
    name: "Zero",
    hp: 10,
    anger: 1, // aumenta dificuldade
    pacified: false
};

const enemySprite = document.getElementById("enemy-sprite");

function setEnemySprite(state) {
    if (state === "idle") {
        enemySprite.src = "sprites/zero_idle.png";
    }
    if (state === "attack") {
        enemySprite.src = "sprites/zero_attack.gif";
    }
    if (state === "hurt") {
        enemySprite.src = "sprites/zero_hit.gif";
        setTimeout(() => setEnemySprite("idle"), 400);
    }
}

function renderLives() {
    livesDiv.innerHTML = '';
    for (let i = 0; i < lives; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        livesDiv.appendChild(heart);
    }
}
renderLives();

document.addEventListener('keydown', (e) => {
    if (gameOver) return;

    if (turn === "menu") {
        if (e.key === "1") playerFight();
        if (e.key === "2") playerAct();
        return;
    }

    // Durante ataque inimigo
    if (turn === "enemy") {
        if (e.key === 'ArrowLeft') x -= speed;
        if (e.key === 'ArrowRight') x += speed;
        if (e.key === 'ArrowUp') y -= speed;
        if (e.key === 'ArrowDown') y += speed;

        // Limites
        x = Math.max(0, Math.min(x, 384));
        y = Math.max(0, Math.min(y, 234));

        soul.style.left = x + 'px';
        soul.style.top = y + 'px';
    }
});

function showMenu() {
    turn = "menu";
    textBox.innerHTML = 
        `O que você fará?<br><br>` +
        `1 - FIGHT<br>` +
        `2 - ACT`;
}
showMenu();

function playerFight() {
    setEnemySprite("hurt")

    enemy.hp -= 4;
    textBox.textContent = `Você atacou! ${enemy.name} perdeu 4 HP.`;

    if (enemy.hp <= 0) {
        victory();
        return;
    }

    enemy.anger++;
    setTimeout(enemyAttack, 1200);
}

function playerAct() {
    if (enemy.anger > 1) enemy.anger--;

    textBox.textContent =
        `Você fala gentilmente com ${enemy.name}...` +
        `\nEle parece menos agressivo.`

    if (enemy.anger === 0) {
        enemy.pacified = true;
        victory();
        return;
    }

    setTimeout(enemyAttack, 1200);
}

function enemyAttack() {
    setEnemySprite("attack")

    textBox.textContent = `${enemy.name} está atacando!`;
    turn = "enemy";

    let pattern = enemy.anger + 1;

    let shootInterval = setInterval(() => spawnBullet(), 400);
    let time = 0;

    let attackDuration = 1800 + enemy.anger * 500;

    setTimeout(() => {
        clearInterval(shootInterval);
        setEnemySprite("idle");
        textBox.textContent = `O ataque acabou.`;
        turn = "menu";
        setTimeout(showMenu, 1000);
    }, attackDuration);

}

function spawnBullet() {
    if (gameOver || turn !== "enemy") return;

    const bullet = document.createElement('div');
    bullet.classList.add('bullet');

    bullet.style.left = Math.random() * 390 + 'px';
    bullet.style.top = '0px';

    battleBox.appendChild(bullet);
    bullets.push({ el: bullet, x: parseFloat(bullet.style.left), y: 0 });
}

function updateBullets() {
    bullets.forEach((b) => {
        b.y += bulletSpeed;
        b.el.style.top = b.y + 'px';

        // Colisão
        const dx = (x + 8) - (b.x + 5);
        const dy = (y + 8) - (b.y + 5);

        if (Math.sqrt(dx * dx + dy * dy) < 12 && !invulnerable && !gameOver && turn === "enemy") {
            takeDamage();
        }

        if (b.y > 260) b.el.remove();
    });
}

function takeDamage() {
    lives--;
    renderLives();
    invulnerable = true;

    soul.style.filter = 'grayscale(100%)';
    textBox.textContent = `Você foi atingido! Vidas: ${lives}`;

    setTimeout(() => {
        soul.style.filter = 'none';
        invulnerable = false;
    }, 800);

    if (lives <= 0) {
        deathScreen();
    }
}

function deathScreen() {
    gameOver = true;
    textBox.textContent = '💀 GAME OVER 💀';
    soul.style.backgroundColor = 'black';
}

function victory() {
    gameOver = true;

    if (enemy.pacified) {
        textBox.textContent = `Você acalmou ${enemy.name}. Vitória pacífica!`;
    } else {
        textBox.textContent = `${enemy.name} foi derrotado.`;
    }

    soul.style.backgroundColor = 'yellow';
}

// Loop
function gameLoop() {
    if (!gameOver) updateBullets();
    requestAnimationFrame(gameLoop);
}
gameLoop();