// --- CONFIGURAÇÃO GLOBAL E DOM ---
const btnTema = document.getElementById('btn-tema');
const formDenuncia = document.getElementById('form-denuncia');
const feedbackForm = document.getElementById('feedback-form');
const canvas = document.getElementById('jogoCanvas');
const ctx = canvas.getContext('2d');

const pontosVal = document.getElementById('pontos-val');
const errosVal = document.getElementById('erros-val');
const telaGameOver = document.getElementById('tela-game-over');
const btnReiniciar = document.getElementById('btn-reiniciar');

// --- ATIVIDADE 1: ACESSIBILIDADE (MODO ESCURO) ---
btnTema.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const estaEscuro = document.body.classList.contains('dark-mode');
    btnTema.textContent = estaEscuro ? 'Modo Claro' : 'Modo Escuro';
});

// --- ATIVIDADE 2: FORMULÁRIO DINÂMICO ---
formDenuncia.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = document.getElementById('url-midia').value;
    const anomalia = document.getElementById('tipo-anomalia').value;

    // Processamento das variáveis antes de exibir na tela
    let mensagemAlerta = `Análise concluída para o link enviado. Com base no padrão de "${anomalia}", o sistema detectou 87% de probabilidade de manipulação por Inteligência Artificial. Encaminhado para verificação humana.`;

    feedbackForm.textContent = mensagemAlerta;
    feedbackForm.className = "sucesso"; // Altera classe dinamicamente
    formDenuncia.reset();
});

// --- ATIVIDADE 3: MOTOR DO JOGO SPACE SHOOTER ANTI-DESINFORMAÇÃO ---
let pontuacao = 0;
let erros = 0;
let jogoAtivo = true;

// Objetos do Jogo
const nave = { x: 275, y: 350, largura: 50, altura: 30, velocidade: 7 };
let tiros = [];
let inimigos = [];

// Gerenciamento de Teclas
const teclas = { Left: false, Right: false };
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') teclas.Left = true;
    if (e.key === 'ArrowRight') teclas.Right = true;
    if (e.key === ' ' && jogoAtivo) dispararTiro();
});
window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') teclas.Left = false;
    if (e.key === 'ArrowRight') teclas.Right = false;
});

function dispararTiro() {
    tiros.push({ x: nave.x + nave.largura / 2 - 2, y: nave.y, largura: 4, altura: 10, velocidade: 6 });
}

function gerarInimigo() {
    if (!jogoAtivo) return;
    const tipos = ['DEEPFAKE', 'BOT_FAKE', 'FATO_REAL'];
    const tipoAleatorio = tipos[Math.floor(Math.random() * tipos.length)];
    
    inimigos.push({
        x: Math.random() * (canvas.width - 80),
        y: 0,
        largura: 75,
        altura: 20,
        tipo: tipoAleatorio,
        velocidade: 1.5 + Math.random() * 2
    });
    
    // Agenda o próximo inimigo a cada 1.5 segundos
    setTimeout(gerarInimigo, 1500);
}

function atualizarMecanicas() {
    if (!jogoAtivo) return;

    // Mover Nave
    if (teclas.Left && nave.x > 0) nave.x -= nave.velocidade;
    if (teclas.Right && nave.x < canvas.width - nave.largura) nave.x += nave.velocidade;

    // Mover Tiros
    tiros.forEach((tiro, tIdx) => {
        tiro.y -= tiro.velocidade;
        if (tiro.y < 0) tiros.splice(tIdx, 1);
    });

    // Mover Inimigos e Tratar Colisões
    inimigos.forEach((inimigo, iIdx) => {
        inimigo.y += inimigo.velocidade;

        // Se passar da borda inferior
        if (inimigo.y > canvas.height) {
            inimigos.splice(iIdx, 1);
        }

        // Checar colisão com tiros
        tiros.forEach((tiro, tIdx) => {
            if (tiro.x < inimigo.x + inimigo.largura &&
                tiro.x + tiro.largura > inimigo.x &&
                tiro.y < inimigo.y + inimigo.altura &&
                tiro.y + tiro.altura > inimigo.y) {
                
                // Trata lógica de pontuação baseada no tipo de dados atingido
                if (inimigo.tipo === 'FATO_REAL') {
                    erros++;
                } else {
                    pontuacao += 10;
                }

                inimigos.splice(iIdx, 1);
                tiros.splice(tIdx, 1);
                atualizarPlacar();
            }
        });
    });

    if (erros >= 3) finalizarJogo();
}

function renderizarElementos() {
    // Limpar Tela
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar Nave (Nave de Defesa Digital)
    ctx.fillStyle = '#8257e5';
    ctx.fillRect(nave.x, nave.y, nave.largura, nave.altura);

    // Desenhar Tiros (Pulsos de Verdade)
    ctx.fillStyle = '#00b4d8';
    tiros.forEach(tiro => ctx.fillRect(tiro.x, tiro.y, tiro.largura, tiro.altura));

    // Desenhar Ameaças / Elementos
    inimigos.forEach(inimigo => {
        if (inimigo.tipo === 'FATO_REAL') {
            ctx.fillStyle = '#2ec4b6'; // Verde para Fatos
        } else {
            ctx.fillStyle = '#e94560'; // Vermelho para Mentiras/Deepfakes
        }
        ctx.fillRect(inimigo.x, inimigo.y, inimigo.largura, inimigo.altura);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px sans-serif';
        ctx.fillText(inimigo.tipo, inimigo.x + 5, inimigo.y + 14);
    });
}

function atualizarPlacar() {
    pontosVal.textContent = pontuacao;
    errosVal.textContent = erros;
}

function finalizarJogo() {
    jogoAtivo = false;
    telaGameOver.classList.remove('escondido');
}

function reiniciarJogo() {
    pontuacao = 0;
    erros = 0;
    tiros = [];
    inimigos = [];
    jogoAtivo = true;
    atualizarPlacar();
    telaGameOver.classList.add('escondido');
}

btnReiniciar.addEventListener('click', reiniciarJogo);

// Loop principal do Jogo
function loopJogo() {
    atualizarMecanicas();
    renderizarElementos();
    requestAnimationFrame(loopJogo);
}

// Inicializadores
gerarInimigo();
loopJogo();
