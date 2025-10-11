let contas = JSON.parse(localStorage.getItem('contas')) || [];

function adicionarConta(dadosCadastro) {
    const contaExistente = contas.find(conta => conta.email === dadosCadastro.email);
    if (contaExistente) {
        return { success: false, reason: 'email_exists' };
    }
    contas.push(dadosCadastro);
    localStorage.setItem('contas', JSON.stringify(contas));
    return { success: true };
}

function validarLogin(email, senha) {
    const conta = contas.find(c => c.email === email && c.senha === senha);
    return !!conta;
}

function trocarSenha(email, novaSenha) {
    const conta = contas.find(c => c.email === email);
    if (conta) {
        conta.senha = novaSenha;
        localStorage.setItem('contas', JSON.stringify(contas));
        return true;
    }
    return false;
}

function getContaPorEmail(email) {
    return contas.find(conta => conta.email === email);
}

function validarEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validarSenha(senha) {
    if (senha.length < 6) return false;
    if (!/[0-9]/.test(senha)) return false;
    if (!/[A-Z]/.test(senha)) return false;
    const caracteresPermitidos = /[@#$%&*!?/\\|_+.=-]/;
    if (!caracteresPermitidos.test(senha)) return false;
    const caracteresNaoPermitidos = /[};<>]/;
    if (caracteresNaoPermitidos.test(senha)) return false;
    return true;
}

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if ((resto == 10) || (resto == 11)) resto = 0;
    if (resto != parseInt(cpf.substring(9, 10))) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if ((resto == 10) || (resto == 11)) resto = 0;
    return resto == parseInt(cpf.substring(10, 11));
}

function calcularIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    return idade;
}

function validarTelefone(telefone) {
    const re = /^\(?[1-9]{2}\)? ?(?:[2-8]|9\d)\d{3}\-?\d{4}$/;
    return re.test(telefone);
}

function setLoggedInUser(email) {
    localStorage.setItem('loggedInUser', email);
}

function getLoggedInUser() {
    return localStorage.getItem('loggedInUser');
}

function logoutUser() {
    localStorage.removeItem('loggedInUser');
}