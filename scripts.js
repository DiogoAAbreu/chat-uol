const url = 'https://mock-api.driven.com.br/api/v3/uol/'
let mensagens;
let usuario;

function entrarNaSala() {
    usuario = '';
    const name = document.querySelector('.nome').value;
    const entrar = axios.post(`${url}participants`, { name });
    entrar.then(esconderInicial)
    entrar.catch(error => {
        if (!name) {
            const erro = document.querySelector('.erro')
            erro.classList.remove('escondido')
        }
    })
    usuario = name;

}

function esconderInicial() {
    const entrada = document.querySelector('.entrada');
    entrada.classList.add('escondido');
}

function lerMensagens() {
    axios.get(`${url}messages`).then(response => {
        mensagens = response.data;
        renderizarMessages()
    }).catch(error => {
        console.error("Falha ao carregar mensagens:", error.response.status);
    });
}

function renderizarMessages() {
    const chat = document.querySelector('.messages')
    chat.innerHTML = ''

    mensagens.map(message => {
        const { from, text, time, to, type } = message;
        const elemento = `<li class="message ${type}">
                <p>
                    <span class="hora">(${time}) </span>
                    <span class="remetente">${from}</span>
                    <span class="visibilidade">para</span>
                    <span class="destinatario">${to}:</span>
                    <span class="texto">${text}</span>
                </p>
            </li>`
        chat.innerHTML += elemento;

        const objDiv = document.querySelector('.messages');
        objDiv.scrollTop = objDiv.scrollHeight;
    })
}

function enviarMensagem() {
    const text = document.querySelector('.enviar-message input').value;
    const msg = {
        from: usuario,
        to: "Todos",
        text: text,
        type: "message",
    }
    axios.post(`${url}messages`, msg)
    console.log(msg)
}

function atualizarMensagem() {
    setInterval(lerMensagens, 10000)
}

atualizarMensagem()
lerMensagens();