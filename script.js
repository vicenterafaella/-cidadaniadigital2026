window.addEventListener('DOMContentLoaded', () => {
    const btnTema = document.getElementById('btn-tema');
    const formDenuncia = document.getElementById('form-denuncia');
    const feedbackForm = document.getElementById('feedback-form');
    const canvas = document.getElementById('jogoCanvas');
    const ctx = canvas.getContext('2d');

    const pontosVal = document.getElementById('pontos-val');
    const errosVal = document.getElementById('erros-val');
    const telaGameOver = document.getElementById('tela-game-over');
    const btnReiniciar = document.getElementById('btn-reiniciar');

    // Controle de Tema Escuro
    btnTema.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        btnTema.textContent = document.body.classList.contains('dark-mode') ? 'Modo Claro' : 'Modo Escuro';
    });

    // Envio do Formulário
    formDenuncia.addEventListener('submit', (e) => {
        e.preventDefault();
        const anomalia = document.getElementById('tipo-anomalia').value;
        feedbackForm.textContent = `Análise concluída. Padrão de "${anomalia}" enviado ao banco de dados anti-desinformação.`;
        feedbackForm.className = "sucesso";
        formDenuncia.reset();
    });

    // Lógica Básica do Jogo Space Shooter
    let pontuacao = 0;
    let erros = 0;
    let jogoAtivo = true;

    const nave = { x: 275, y: 350, largura: 50, altura: 25, velocidade: 8 };
    let tiros = [];
    let inimigos = [];

    const teclas = { Left: false, Right: false };
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') teclas.Left = true;
        if (e.key === 'ArrowRight') teclas.Right = true;
        if (e.key === ' ' && jogoAtivo) {
            tiros.push({ x: nave.x + nave.largura / 2 - 2, y: nave.y, largura: 4, height: 10, velocidade: 7 });
        }
    });
    window.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft') teclas.Left = false;
        if (e.key === 'ArrowRight') teclas.Right = false;
    });

    function gerarInimigos() {
        if (!jogoAtivo) return;
        const tipos = ['DEEPFAKE', 'BOT_FAKE', 'FATO_REAL'];
        inimigos.push({
            x: Math.random() * (canvas.width - 80),
            y: 0,
            largura: 80,
            altura: 20,
            tipo: tipos[Math.floor(Math.random() * tipos.length)],
            velocidade: 2
        });
        setTimeout(gerarInimigos, 1800);
    }

    function atualizar() {
        if (!jogoAtivo) return;

        if (teclas.Left && nave.x > 0) nave.x -= nave.velocidade;
        if (teclas.Right && nave.x < canvas.width - nave.largura) nave.x += nave.velocidade;

        tiros.forEach((tiro, tIdx) => {
            tiro.y -= tiro.velocidade;
            if (tiro.y < 0) tiros.splice(tIdx, 1);
        });

        inimigos.forEach((inimigo, iIdx) => {
            inimigo.y += inimigo.velocidade;
            if (inimigo.y > canvas.height) inimigos.splice(iIdx, 1);

            tiros.forEach((tiro, tIdx) => {
                if (tiro.x < inimigo.x + inimigo.largura &&
                    tiro.x + 4 > inimigo.x &&
                    tiro.y < inimigo.y + inimigo.altura &&
                    tiro.y + 10 > inimigo.y) {
                    
                    if (inimigo.tipo === 'FATO_REAL') {
                        erros++;
                    } else {
                        pontuacao += 10;
                    }
                    inimigos.splice(iIdx, 1);
                    tiros.splice(tIdx, 1);
                    pontosVal.textContent = pontuacao;
                    errosVal.textContent = erros;
                }
            });
        });

        if (erros >= 3) {
            jogoAtivo = false;
            telaGameOver.classList.remove('escondido');
        }
    }

    function desenhar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Desenhar nave
        ctx.fillStyle = '#8257e5';
        ctx.fillRect(nave.x, nave.y, nave.largura, nave.altura);

        // Desenhar tiros
        ctx.fillStyle = '#00b4d8';
        tiros.forEach(tiro => ctx.fillRect(tiro.x, tiro.y, 4, 10));

        // Desenhar inimigos
        inimigos.forEach(inimigo => {
            ctx.fillStyle = inimigo.tipo === 'FATO_REAL' ? '#2ec4b6' : '#e94560';
            ctx.fillRect(inimigo.x, inimigo.y, inimigo.largura, inimigo.altura);
            ctx.fillStyle = '#ffffff';
            ctx.font = '10px Arial';
            ctx.fillText(inimigo.tipo, inimigo.x + 5, inimigo.y + 14);
        });
    }

    btnReiniciar.addEventListener('click', () => {
        pontuacao = 0; erros = 0; tiros = []; inimigos = []; jogoAtivo = true;
        pontosVal.textContent = "0"; errosVal.textContent = "0";
        telaGameOver.classList.add('escondido');
    });

    function loop() {
        atualizar();
        desenhar();
        requestAnimationFrame(loop);
    }

    gerarInimigos();
    loop();
});
