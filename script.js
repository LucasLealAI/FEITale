const caixaBatalha = document.getElementById('caixaBatalha');
const alma = document.getElementById('alma');
const caixaTexto = document.getElementById('caixaTexto');
const vidasDiv = document.getElementById('vidasDiv');
const spriteInimigo = document.getElementById("spriteInimigo");

let posX = 190, posY = 220;
const velocidade = 4;

const balas = [];
const velocidadeBala = 6;

let vidas = 3;
let invulneravel = false;
let jogoAcabou = false;

let turno = "menu"; 

const inimigo = {
    nome: "Zero",
    vida: 10,
    agressividade: 1,
    pacificado: false
};

function renderizarVidas() {
    vidasDiv.innerHTML = '';
    for (let i = 0; i < vidas; i++) {
        const coracao = document.createElement('div');
        coracao.classList.add('heart');
        vidasDiv.appendChild(coracao);
    }
}
renderizarVidas();

// movimentar torto
const teclasPressionadas = {};

document.addEventListener('keydown', (e) => {
    teclasPressionadas[e.key] = true;

    if (turno === "menu") {
        if (e.key === "1") atacarJogador();
        if (e.key === "2") agirJogador();
        return;
    }
});

document.addEventListener('keyup', (e) => {
    teclasPressionadas[e.key] = false;
});

// atualiza movimento
function moverAlma() {
    if (jogoAcabou || turno !== "inimigo") return;

    if (teclasPressionadas["ArrowLeft"])  posX -= velocidade;
    if (teclasPressionadas["ArrowRight"]) posX += velocidade;
    if (teclasPressionadas["ArrowUp"])    posY -= velocidade;
    if (teclasPressionadas["ArrowDown"])  posY += velocidade;

    // limites
    posX = Math.max(0, Math.min(posX, 384));
    posY = Math.max(0, Math.min(posY, 234));

    alma.style.left = posX + 'px';
    alma.style.top = posY + 'px';
}

function trocarSprite(estado) {
    if (estado === "idle")  spriteInimigo.src = "sprites/zero_idle.png";
    if (estado === "ataque") spriteInimigo.src = "sprites/zero_attack.gif";
    if (estado === "dano") {
        spriteInimigo.src = "sprites/zero_hit.gif";
        setTimeout(() => trocarSprite("idle"), 400);
    }
}

function mostrarMenu() {
    turno = "menu";
    caixaTexto.innerHTML =
        `> O que você fará?<br><br>` +
        `1 - FIGHT<br>` +
        `2 - ACT`;
}
mostrarMenu();

function atacarJogador() {
    trocarSprite("dano");

    inimigo.vida -= 4;
    caixaTexto.textContent = `Você atacou! ${inimigo.nome} perdeu 4 HP.`;

    if (inimigo.vida <= 0) {
        vitoria();
        return;
    }

    inimigo.agressividade++;
    setTimeout(ataqueInimigo, 1200);
}

function agirJogador() {
    if (inimigo.agressividade > 1) inimigo.agressividade--;

    caixaTexto.textContent =
        `Você tenta conversar com ${inimigo.nome}...` +
        `\nEle parece um pouco menos agressivo.`;

    if (inimigo.agressividade === 0) {
        inimigo.pacificado = true;
        vitoria();
        return;
    }

    setTimeout(ataqueInimigo, 1200);
}

function ataqueInimigo() {
    trocarSprite("ataque");

    turno = "inimigo";
    caixaTexto.textContent = `${inimigo.nome} está atacando!`;

    let intervaloTiro = setInterval(spawnBala, 300);

    let duracaoAtaque = 2600 + inimigo.agressividade * 600;

    setTimeout(() => {
        clearInterval(intervaloTiro);
        trocarSprite("idle");

        caixaTexto.textContent = `O ataque acabou.`;
        turno = "menu";

        setTimeout(mostrarMenu, 1000);
    }, duracaoAtaque);
}

function spawnBala() {
    if (jogoAcabou || turno !== "inimigo") return;

    const bala = document.createElement('div');
    bala.classList.add('bullet');

    bala.style.left = Math.random() * 390 + 'px';
    bala.style.top = '0px';

    caixaBatalha.appendChild(bala);
    balas.push({ el: bala, x: parseFloat(bala.style.left), y: 0 });
}

function atualizarBalas() {
    balas.forEach((b) => {
        b.y += velocidadeBala;
        b.el.style.top = b.y + 'px';

        // Colisão
        const dx = (posX + 8) - (b.x + 5);
        const dy = (posY + 8) - (b.y + 5);

        if (Math.sqrt(dx * dx + dy * dy) < 12 && !invulneravel && !jogoAcabou && turno === "inimigo") {
            levarDano();
        }

        if (b.y > 260) b.el.remove();
    });
}

function levarDano() {
    vidas--;
    renderizarVidas();
    invulneravel = true;

    alma.style.backgroundColor = 'gray';
    caixaTexto.textContent = `Você foi atingido! Vidas: ${vidas}`;

    setTimeout(() => {
        alma.style.backgroundColor = 'red';
        invulneravel = false;
    }, 800);

    if (vidas <= 0) fimDeJogo();
}

function fimDeJogo() {
    jogoAcabou = true;
    caixaTexto.textContent = 'GAME OVER';
    alma.style.backgroundColor = 'black';
}

function vitoria() {
    jogoAcabou = true;

    if (inimigo.pacificado) {
        caixaTexto.textContent = `Você acalmou ${inimigo.nome}. Vitória pacífica!`;
    } else {
        caixaTexto.textContent = `${inimigo.nome} foi derrotado!`;
    }

    alma.style.backgroundColor = 'yellow';
}

function loopJogo() {
    moverAlma();
    atualizarBalas();
    requestAnimationFrame(loopJogo);
}
loopJogo();
