function entrarNaSala() {
    const nome = document.querySelector('.nome').value;
    console.log(nome)
    const entrar = axios.post('https://mock-api.driven.com.br/api/v3/uol/participants', { name: nome });
    entrar.then(console.log('Entrou na sala'))
    entrar.catch(error => {
        console.log(error.response.status)
    })


    const entrada = document.querySelector('.entrada').classList.add('escondido')
}
