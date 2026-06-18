// ==========================================
// 1. MAPEAMENTO DE ELEMENTOS (DOM)
// ==========================================
// Aqui você seleciona os elementos do HTML que deseja controlar
const botaoInteragir = document.querySelector('#meuBotao');
const formulario = document.querySelector('#meuFormulario');
const caixaTexto = document.querySelector('#campoTexto');
const containerResultado = document.querySelector('#resultado');

// ==========================================
// 2. FUNÇÕES DE LÓGICA E COMPORTAMENTO
// ==========================================

/**
 * Função para criar uma animação simples ou alterar o estilo
 */
function aplicarAnimacao(elemento) {
    elemento.style.transition = "transform 0.3s ease";
    elemento.style.transform = "scale(1.05)";
    
    setTimeout(() => {
        elemento.style.transform = "scale(1)";
    }, 3000);
}

/**
 * Função para validar o formulário e dar feedback ao usuário
 */
function validarFormulario(event) {
    // Evita que a página recarregue ao enviar o formulário
    event.preventDefault(); 
    
    const valorInput = caixaTexto.value.trim();

    if (valorInput === "") {
        exibirMensagem("Por favor, preencha o campo antes de enviar!", "erro");
    } else {
        exibirMensagem(`Sucesso! Você digitou: ${valorInput}`, "sucesso");
        formulario.reset(); // Limpa o formulário
    }
}

/**
 * Função utilitária para exibir mensagens na tela
 */
function exibirMensagem(texto, tipo) {
    containerResultado.textContent = texto;
    containerResultado.className = `mensagem-${tipo}`; // Permite estilizar com CSS (ex: verde para sucesso, vermelho para erro)
    
    // Aplica o efeito visual na mensagem
    aplicarAnimacao(containerResultado);
}

// ==========================================
// 3. ESCUTADORES DE EVENTOS (EVENT LISTENERS)
// ==========================================
// Aqui você conecta as ações do usuário às funções criadas

// Responde ao clique do botão
botaoInteragir.addEventListener('click', () => {
    exibirMensagem("O botão foi clicado! A página ganhou vida. 🚀", "sucesso");
});

// Responde ao envio (submit) do formulário
formulario.addEventListener('submit', validarFormulario);
