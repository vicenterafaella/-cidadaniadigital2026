window.addEventListener('DOMContentLoaded', () => {
    // Elementos gerais do DOM
    const btnTema = document.getElementById('btn-tema');
    const formDenuncia = document.getElementById('form-denuncia');
    const feedbackForm = document.getElementById('feedback-form');
    const canvas = document.getElementById('jogoCanvas');
    const ctx = canvas.getContext('2d');

    const pontosVal = document.getElementById('pontos-val');
    const errosVal = document.getElementById('erros-val');
    const telaGameOver = document.getElementById('tela-game-over');
    const btnReiniciar = document.getElementById('btn-reiniciar');
    const contadorFake = document.getElementById('contador-fake');
    const feedbackQuiz = document.getElementById('feedback-quiz');

    // Elementos do Laboratório de Áudio
    const textoLab = document.getElementById('texto-lab');
    const btnSincrono = document.getElementById('btn-tocar-sincrono');
    const btnAssincrono = document.getElementById('btn-tocar-assincrono');

    // 1. Controle do Modo Escuro
    btnTema.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        btnTema.textContent = document.body.classList.contains('dark-mode') ? 'Modo Claro' : 'Modo Escuro';
    });

    // 2. Simulador Estatístico Dinâmico
    let totalFakeMídias = 0;
    setInterval(() => {
        totalFakeMídias += Math.floor(Math.random() * 4) + 2;
        contadorFake.textContent = totalFakeMídias.toLocaleString('pt-BR');
    }, 1000);

    // 3. SISTEMA DE VOZ DO NAVEGADOR CORRIGIDO
    // Pré-carrega o sistema de vozes para evitar falhas em segundo plano
    if ('speechSynthesis' in window) {
        window.speechSynthesis.getVoices();
    }

    function executarVozHumana() {
        if ('speechSynthesis' in window) {
            // Cancela qualquer som preso para não acumular cliques
            window.speechSynthesis.cancel();

            // Mensagem curta e de rápido processamento pelo navegador
            const mensagem = new SpeechSynthesisUtterance("Atenção: isto é um teste.");
            mensagem.lang = 'pt-BR';
            mensagem.rate = 1.1; // Velocidade levemente rápida para dinâmica natural
            mensagem.pitch = 1.0;

            window.speechSynthesis.speak(mensagem);
        } else {
            alert("Seu navegador não suporta reprodução de voz nativa.");
        }
    }

    // Ação Síncrona: Ativa animação visual e fala EXATAMENTE juntos
    btnSincrono.addEventListener('click', () => {
        textoLab.classList.add('pulsa-fala');
        executarVozHumana(); // Dispara na hora do clique (Permissão concedida)
        
        setTimeout(() => {
            textoLab.classList.remove('pulsa-fala');
        }, 1500);
    });

    // Ação Assíncrona (Modo Deepfake): Pisca a tela IMEDIATAMENTE e atrasa a voz
    btnAssincrono.addEventListener('click', () => {
        // O estímulo visual acontece no milissegundo do clique
        textoLab.classList.add('pulsa-fala');
        
        setTimeout(() => {
            textoLab.classList.remove('pulsa-fala');
        }, 1500);

        // Aplica o atraso artificial de 1.2 segundos (1200 milissegundos) para simular o delay
        setTimeout(() => {
            executarVozHumana();
        }, 1200); 
    });

    // 4. Validador Logístico do Quiz Anti-Desinformação
    const botoesQuiz = document.querySelectorAll('.btn-quiz');
    botoesQuiz.forEach(botao => {
        botao.addEventListener('click', (e) => {
            const respostaEscolhida = e.target.getAttribute('data-resposta');
            feedbackQuiz.classList.remove('escondido');
            
            if (respostaEscolhida === 'verdadeiro') {
                feedbackQuiz.textContent = "Correto! As tecnologias atuais geram mídias hiper-realistas, exigindo checagem técnica rigorosa.";
                feedbackQuiz.className = "sucesso";
            } else {
                feedbackQuiz.textContent = "Incorreto. Softwares modernos conseguem enganar facilmente a percepção humana desatenta.";
                feedbackQuiz.className = "erro";
            }
        });
    });

    // 5. Processador de Formulário de Denúncia
    formDenuncia.addEventListener('submit', (e) => {
        e.preventDefault();
        const anomalia = document.getElementById('tipo-anomalia').value;
        feedbackForm.classList.remove('escondido');
        feedbackForm.textContent = `Registro Concluído: O relatório focado em "${anomalia}" foi indexado para processamento comunitário.`;
        feedbackForm.className = "sucesso";
        formDenuncia.reset();
    });

    // 6. Motor do Arcade Space Shooter
    let pontuacao = 0;
    let erros = 0;
    let jogoAtivo = true;

    const nave = { x: 275, y: 350, largura: 50, altura: 25, velocidade: 9 };
    let tiros = [];
    let inimigos = [];

    const teclas = { Left: false, Right: false };
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') teclas.Left = true;
        if (e.key === 'ArrowRight') teclas.Right = true;
        if (e.key === ' ' && jogoAtivo) {
            tiros.push({ x: nave.x + nave.largura / 2 - 2, y: nave.y, largura: 4, velocidade: 8 });
        }
    });
    window.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft') teclas.Left = false;
        if (e.key === 'ArrowRight') teclas.Right = false;
    });

    function gerarAmeacas() {
        if (!jogoAtivo) return;
        const classesAmeaca = ['DEEPFAKE', 'BOT_FAKE', 'FATO_REAL'];
        inimigos.push({
            x: Math.random() * (canvas.width - 90),
            y: 0,
            largura: 85,
            altura: 22,
            tipo: classesAmeaca[Math.floor(Math.random() * classesAmeaca.length)],
            velocidade: 2.2
        });
        setTimeout(gerarAmeacas, 1600);
    }

    function atualizarMecanicas() {
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

    function desenharElementos() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Desenhar Defensor Digital (Nave)
        ctx.fillStyle = '#8257e5';
        ctx.fillRect(nave.x, nave.y, nave.largura, nave.altura);

        // Desenhar Pulsos de Dados (Tiros)
        ctx.fillStyle = '#00b4d8';
        tiros.forEach(tiro => ctx.fillRect(tiro.x, tiro.y, 4, 10));

        // Desenhar Objetos Orbitais (Inimigos/Fatos)
        inimigos.forEach(inimigo => {
            ctx.fillStyle = inimigo.tipo === 'FATO_REAL' ? '#2ec4b6' : '#e94560';
            ctx.fillRect(inimigo.x, inimigo.y, inimigo.largura, inimigo.altura);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 10px monospace';
            ctx.fillText(inimigo.tipo, inimigo.x + 6, inimigo.y + 15);
        });
    }

    btnReiniciar.addEventListener('click', () => {
        pontuacao = 0; erros = 0; tiros = []; inimigos = []; jogoAtivo = true;
        pontosVal.textContent = "0"; errosVal.textContent = "0";
        telaGameOver.classList.add('escondido');
    });

    function loopJogo() {
        atualizarMecanicas();
        desenharElementos();
        requestAnimationFrame(loopJogo);
    }

    gerarAmeacas();
    loopJogo();
});
