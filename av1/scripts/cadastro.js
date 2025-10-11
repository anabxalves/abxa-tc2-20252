document.getElementById('cadastroForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const mensagemLabel = document.getElementById('mensagem-validacao');
    mensagemLabel.textContent = '';
    mensagemLabel.style.color = 'red';

    const email = document.getElementById('cadastroEmail').value;
    const senha = document.getElementById('cadastroSenha').value;
    const confirmaSenha = document.getElementById('confirmaSenha').value;
    const nome = document.getElementById('cadastroNome').value;
    const cpf = document.getElementById('cadastroCpf').value;
    const dataNascimento = document.getElementById('dataNascimento').value;
    const telefone = document.getElementById('telefone').value;
    const estadoCivil = document.querySelector('input[name="estadoCivil"]:checked').value;
    const escolaridade = document.getElementById('escolaridade').value;

    const esqueceuSenhaLink = document.getElementById('esqueceuSenhaLink');
    if (esqueceuSenhaLink) {
        esqueceuSenhaLink.remove();
    }

    if (!email.trim() || !validarEmail(email)) {
        mensagemLabel.textContent = "Erro: O e-mail deve ser válido.";
        return;
    }

    if (!senha.trim() || !confirmaSenha.trim()) {
        mensagemLabel.textContent = "Erro: A senha e a confirmação de senha devem ser preenchidas.";
        return;
    }
    if (senha !== confirmaSenha) {
        mensagemLabel.textContent = "Erro: A senha e a confirmação de senha não correspondem.";
        return;
    }
    if (!validarSenha(senha)) {
        mensagemLabel.textContent = "Erro: A senha não atende aos requisitos de composição.";
        return;
    }

    const palavrasNome = nome.trim().split(/\s+/);
    if (!nome.trim()) {
        mensagemLabel.textContent = "Erro: O nome deve ser preenchido.";
        return;
    }
    if (palavrasNome.length < 2 || palavrasNome[0].length < 2) {
        mensagemLabel.textContent = "Erro: O nome deve ter pelo menos duas palavras e a primeira deve ter no mínimo 2 caracteres.";
        return;
    }
    const caracteresNaoPermitidosNome = /[^a-zA-Z\s]/;
    if (caracteresNaoPermitidosNome.test(nome)) {
        mensagemLabel.textContent = "Erro: O nome não pode conter caracteres especiais.";
        return;
    }

    if (!cpf.trim()) {
        mensagemLabel.textContent = "Erro: O CPF deve ser preenchido.";
        return;
    }
    if (!validarCPF(cpf)) {
        mensagemLabel.textContent = "Erro: O CPF é inválido.";
        return;
    }

    if (!dataNascimento) {
        mensagemLabel.textContent = "Erro: A data de nascimento deve ser preenchida.";
        return;
    }
    if (calcularIdade(dataNascimento) < 18) {
        mensagemLabel.textContent = "Erro: O cliente deve ser maior de 18 anos.";
        return;
    }

    if (telefone.trim() && !validarTelefone(telefone)) {
        mensagemLabel.textContent = "Erro: O formato do telefone é inválido.";
        return;
    }

    const dadosCadastro = {
        email: email,
        senha: senha,
        nome: nome,
        cpf: cpf,
        dataNascimento: dataNascimento,
        telefone: telefone,
        estadoCivil: estadoCivil,
        escolaridade: escolaridade
    };

    const resultadoAdicao = adicionarConta(dadosCadastro);

    if (resultadoAdicao.success) {
        mensagemLabel.style.color = 'green';
        mensagemLabel.textContent = "Validação realizada com sucesso. Cadastro efetuado!";
    } else if (resultadoAdicao.reason === 'email_exists') {
        mensagemLabel.textContent = "Erro: Este e-mail já está cadastrado.";

        const linkDiv = document.createElement('div');
        linkDiv.id = 'esqueceuSenhaLink';
        linkDiv.innerHTML = `<button onclick="window.location.href='troca-senha.html'">Esqueceu sua senha?</button>`;
        document.getElementById('cadastroForm').insertAdjacentElement('afterend', linkDiv);
    }
});

document.getElementById('btn-limpar').addEventListener('click', function() {
    const form = document.getElementById('cadastroForm');
    form.reset();
    document.getElementById('cadastroEmail').focus();
    document.getElementById('escolaridade').value = '2o grau completo';
    document.getElementById('mensagem-validacao').textContent = "";

    const esqueceuSenhaLink = document.getElementById('esqueceuSenhaLink');
    if (esqueceuSenhaLink) {
        esqueceuSenhaLink.remove();
    }
});

document.getElementById('btn-voltar').addEventListener('click', function() {
    window.history.back();
});

function aplicarMascaraCPF(campo) {
    let cpf = campo.value.replace(/\D/g, "");
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    campo.value = cpf;
}