const url = 'https://mock-api.driven.com.br/api/v3/uol/'
let mensagens;
let usuario;
let destinatario = 'Todos';
let tipo = 'message';

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

    setInterval(lerMensagens, 3000);
    setInterval(manterConexao, 5000)
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

        if (type === 'status') {
            const elemento = `<li class="message status">
            <p>
                <span class="hora">(${time}) </span>
                <span class="remetente">${from}</span>
                <span class="visibilidade"></span>
                <span class="destinatario"></span>
                <span class="texto">${text}</span>
            </p>
        </li>`
            chat.innerHTML += elemento;
        } else if (type === 'private_message') {
            const elemento = `<li class="message private_message">
            <p>
                <span class="hora">(${time}) </span>
                <span class="remetente">${from}</span>
                <span class="visibilidade">Reservadamente para </span>
                <span class="destinatario">${to}:</span>
                <span class="texto">${text}</span>
            </p>
        </li>`
            chat.innerHTML += elemento;
        } else {

            const elemento = `<li class="message">
                <p>
                    <span class="hora">(${time}) </span>
                    <span class="remetente">${from}</span>
                    <span class="visibilidade">para</span>
                    <span class="destinatario">${to}:</span>
                    <span class="texto">${text}</span>
                </p>
            </li>`
            chat.innerHTML += elemento;
        }
    })
}

function enviarMensagem() {
    const text = document.querySelector('.enviar-message input');
    const msg = {
        from: usuario,
        to: destinatario,
        text: text.value,
        type: tipo,
    }
    axios.post(`${url}messages`, msg).then(lerMensagens).catch(error => {
        window.location.reload()
        console.log(`Erro ao enviar mensagem, erro: ${error.response.status}`
        )
    })

    text.value = '';
}

function manterConexao() {
    console.log(usuario)
    axios.post(`${url}status`, { name: usuario }).then().catch(error => {
        console.log(`Impossível manter a conexão, erro: ${error.response.status}`)
    })
}

function selecionarDestinatario(elemento) {
    destinatario = 'Todos';

    const check = document.querySelector('.contato .selecionado')

    if (check !== null) {
        check.classList.remove('selecionado')
    }
    elemento.querySelector('ion-icon[name="checkmark"]').classList.add('selecionado')

    destinatario = elemento.querySelector('div span').innerHTML

}


function abreFechaOverlay() {
    const overlay = document.querySelector('.overlay')
    overlay.classList.toggle('escondido')
    usuariosAtivos();
}

function usuariosAtivos() {
    const contatos = document.querySelector('.lista-contatos');
    contatos.innerHTML = `<li class="contato">
                    <div>
                        <ion-icon name="people"></ion-icon>
                        <span>Todos</span>
                    </div>
                    <ion-icon name="checkmark"></ion-icon>
                </li>`

    axios.get(`${url}participants`).then(response => {
        response.data.map(user => {
            contatos.innerHTML += `<li class="contato" onclick="selecionarDestinatario(this)">
                    <div>
                        <ion-icon name="person-circle"></ion-icon>
                        <span>${user.name}</span>
                    </div>
                    <ion-icon name="checkmark"></ion-icon>
                </li>`
        })
    }).catch(error => {
        console.log(`Impossível fazer conexão com a API: ${error.response.status}`)
    })
}


function selecionarVisibilidade(elemento) {

    tipo = 'message';

    const check = document.querySelector('.visibilidade .selecionado')

    if (check !== null) {
        check.classList.remove('selecionado')
    }
    elemento.querySelector('ion-icon[name="checkmark"]').classList.add('selecionado')

    const visibilidade = elemento.querySelector('div span').innerHTML

    if (visibilidade === 'Reservadamente') {
        tipo = 'private_message'
    }

    console.log(tipo)
}

lerMensagens();