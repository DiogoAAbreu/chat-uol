const url = 'https://mock-api.driven.com.br/api/v3/uol/'

function entrarNaSala() {
    const name = document.querySelector('.nome').value;
    const entrar = axios.post(`${url}participants`, { name });
    entrar.then(esconderInicial)
    entrar.catch(error => {
        if (!name) {
            const erro = document.querySelector('.erro')
            erro.classList.remove('escondido')
        }
    })

}

function esconderInicial() {
    const entrada = document.querySelector('.entrada');
    entrada.classList.add('escondido');
}


