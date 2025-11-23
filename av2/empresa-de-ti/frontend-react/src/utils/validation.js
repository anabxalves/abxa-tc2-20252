export const validarEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

export const validarSenha = (senha) => {
    if (senha.length < 6) return false;
    if (!/[0-9]/.test(senha)) return false;
    if (!/[A-Z]/.test(senha)) return false;

    const caracteresPermitidos = /[@#$%&*!?/\\|_+.=\-]/;
    if (!caracteresPermitidos.test(senha)) return false;

    const caracteresNaoPermitidos = /[};<>]/;
    if (caracteresNaoPermitidos.test(senha)) return false;

    return true;
};

export const validarCPF = (cpf) => {
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
};

export const calcularIdade = (dataNascimento) => {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    return idade;
};

export const validarTelefone = (telefone) => {
    if (!telefone) return true;
    const re = /^\(?[1-9]{2}\)? ?(?:[2-8]|9\d)\d{3}\-?\d{4}$/;
    return re.test(telefone);
};