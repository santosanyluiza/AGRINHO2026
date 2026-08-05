/* ==========================================================================
   AGRINHO 2026 — JAVASCRIPT COMPLETO
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ====================================================================
       1. MENU MOBILE
       ==================================================================== */
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');

    if (mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Fecha o menu ao clicar em um link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    /* ====================================================================
       2. CONTADOR ANIMADO DAS MÉTRICAS (Intersection Observer)
       ==================================================================== */
    const counters = document.querySelectorAll('.metric-number');

    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 1800;
        const step = target / (duration / 16);
        let current = 0;

        const update = () => {
            current += step;
            if (current < target) {
                el.textContent = Math.floor(current);
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        };
        update();
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    counters.forEach(c => observer.observe(c));

    /* ====================================================================
       3. CALCULADORA DE IMPACTO SUSTENTÁVEL
       Fórmulas baseadas em estudos da Embrapa (valores aproximados)
       ==================================================================== */
    const calcForm = document.getElementById('calcForm');
    const calcResult = document.getElementById('calcResultado');

    // Coeficientes por prática (por hectare/ano)
    const coeficientes = {
        plantio_direto: { co2: 1.5, agua: 0.08, economia: 380 },
        ilpf:           { co2: 3.2, agua: 0.12, economia: 650 },
        bioinsumos:     { co2: 0.8, agua: 0.05, economia: 420 },
        energia_solar:  { co2: 2.1, agua: 0.15, economia: 900 }
    };

    if (calcForm) {
        calcForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const hectares = parseFloat(document.getElementById('hectares').value) || 0;
            const pratica = document.getElementById('pratica').value;

            if (!pratica || hectares <= 0) {
                alert('Preencha hectares e selecione uma prática válida.');
                return;
            }

            const c = coeficientes[pratica];
            const co2 = (hectares * c.co2).toFixed(1);
            const agua = (hectares * c.agua).toFixed(2);
            const economia = Math.round(hectares * c.economia);

            document.getElementById('co2Evitado').textContent = co2;
            document.getElementById('aguaEconomizada').textContent = agua;
            document.getElementById('economiaEstimada').textContent =
                'R$ ' + economia.toLocaleString('pt-BR');

            calcResult.classList.remove('hidden');
            calcResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    /* ====================================================================
       4. QUIZ AGRINHO — 5 PERGUNTAS
       ==================================================================== */
    const quizQuestions = [
        {
            q: "Qual técnica mantém a palha da colheita anterior sobre o solo, reduzindo erosão e sequestrando carbono?",
            options: ["Irrigação por aspersão", "Plantio Direto", "Queimada controlada", "Monocultivo intensivo"],
            correct: 1
        },
        {
            q: "O que significa a sigla ILPF, considerada uma das práticas mais sustentáveis da agricultura brasileira?",
            options: [
                "Instituto de Licenciamento de Produtos Fitossanitários",
                "Integração Lavoura-Pecuária-Floresta",
                "Indicador de Lucratividade Produtiva Financeira",
                "Inspeção Legal de Propriedades Familiares"
            ],
            correct: 1
        },
        {
            q: "Qual tecnologia permite a aplicação de defensivos apenas nas áreas realmente afetadas por pragas, reduzindo desperdícios?",
            options: ["Trator a diesel", "Drones com sensores multiespectrais", "Arado manual", "Adubo químico em excesso"],
            correct: 1
        },
        {
            q: "O que são bioinsumos na agricultura sustentável?",
            options: [
                "Produtos químicos sintéticos importados",
                "Organismos vivos (bactérias, fungos, insetos benéficos) usados no manejo",
                "Máquinas pesadas para plantio",
                "Sementes geneticamente modificadas patenteadas"
            ],
            correct: 1
        },
        {
            q: "Qual a porcentagem aproximada do território brasileiro mantido com vegetação nativa, em grande parte por produtores rurais?",
            options: ["Aproximadamente 20%", "Aproximadamente 40%", "Aproximadamente 66%", "Aproximadamente 90%"],
            correct: 2
        }
    ];

    const quizContainer = document.getElementById('quizContainer');
    const quizResult = document.getElementById('quizResult');
    const quizQuestionEl = document.getElementById('quizQuestion');
    const quizOptionsEl = document.getElementById('quizOptions');
    const quizStepEl = document.getElementById('quizStep');
    const btnNext = document.getElementById('btnNextQuiz');
    const btnRestart = document.getElementById('btnRestartQuiz');
    const quizScoreText = document.getElementById('quizScoreText');
    const quizFeedback = document.getElementById('quizFeedback');

    let currentIndex = 0;
    let score = 0;

    function showQuestion() {
        const q = quizQuestions[currentIndex];
        quizStepEl.textContent = `Pergunta ${currentIndex + 1} de ${quizQuestions.length}`;
        quizQuestionEl.textContent = q.q;
        quizOptionsEl.innerHTML = '';
        btnNext.classList.add('hidden');

        q.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option';
            btn.textContent = opt;
            btn.addEventListener('click', () => handleAnswer(i, btn));
            quizOptionsEl.appendChild(btn);
        });
    }

    function handleAnswer(selected, btnEl) {
        const q = quizQuestions[currentIndex];
        const allButtons = quizOptionsEl.querySelectorAll('.quiz-option');

        allButtons.forEach((b, i) => {
            b.disabled = true;
            if (i === q.correct) b.classList.add('correct');
            if (i === selected && i !== q.correct) b.classList.add('incorrect');
        });

        if (selected === q.correct) score++;
        btnNext.classList.remove('hidden');
    }

    btnNext?.addEventListener('click', () => {
        currentIndex++;
        if (currentIndex < quizQuestions.length) {
            showQuestion();
        } else {
            finishQuiz();
        }
    });

    function finishQuiz() {
        quizContainer.classList.add('hidden');
        quizResult.classList.remove('hidden');
        quizScoreText.textContent = `Você acertou ${score} de ${quizQuestions.length}!`;

        const pct = (score / quizQuestions.length) * 100;
        if (pct === 100) {
            quizFeedback.textContent = "🏆 Excelente! Você é um expert em agricultura sustentável!";
        } else if (pct >= 60) {
            quizFeedback.textContent = "👍 Muito bom! Você tem ótimos conhecimentos sobre o agro moderno.";
        } else {
            quizFeedback.textContent = "📚 Continue estudando! Navegue pelas seções para aprender mais.";
        }
    }

    btnRestart?.addEventListener('click', () => {
        currentIndex = 0;
        score = 0;
        quizResult.classList.add('hidden');
        quizContainer.classList.remove('hidden');
        showQuestion();
    });

    if (quizContainer) showQuestion();

    /* ====================================================================
       5. FORMULÁRIO DE CONTATO — VALIDAÇÃO ROBUSTA
       ==================================================================== */
    const form = document.getElementById('meuFormulario');
    const feedback = document.getElementById('resultado');

    function mostrarFeedback(texto, tipo) {
        feedback.textContent = texto;
        feedback.className = `feedback-message show mensagem-${tipo}`;
        setTimeout(() => {
            feedback.classList.remove('show');
        }, 6000);
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const perfil = document.getElementById('perfil').value;
            const assunto = document.getElementById('campoTexto').value.trim();
            const mensagem = document.getElementById('mensagem').value.trim();

            // Validações
            if (nome.length < 3) {
                mostrarFeedback('⚠️ Informe um nome válido (mínimo 3 caracteres).', 'erro');
                return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                mostrarFeedback('⚠️ Informe um e-mail válido.', 'erro');
                return;
            }
            if (!perfil) {
                mostrarFeedback('⚠️ Selecione seu perfil.', 'erro');
                return;
            }
            if (assunto.length < 3) {
                mostrarFeedback('⚠️ Informe o assunto da mensagem.', 'erro');
                return;
            }
            if (mensagem.length < 10) {
                mostrarFeedback('⚠️ A mensagem deve ter ao menos 10 caracteres.', 'erro');
                return;
            }

            // Sucesso simulado (em produção enviaria via fetch para backend)
            mostrarFeedback(
                `✅ Obrigado, ${nome.split(' ')[0]}! Sua mensagem foi recebida. Retornaremos em breve.`,
                'sucesso'
            );
            form.reset();
        });
    }

    /* ====================================================================
       6. SCROLL SUAVE (fallback extra para navegadores antigos)
       ==================================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId.length > 1) {
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

});