document.getElementById('btn-limpar').addEventListener('click', function() {
    document.getElementById('loginForm').reset();
    document.getElementById('loginEmail').focus();
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const emailInput = document.getElementById('loginEmail');
    const senhaInput = document.getElementById('loginSenha');
    const mensagemLabel = document.getElementById('mensagem-validacao');

    mensagemLabel.textContent = '';

    if (!emailInput.value.trim() || !validarEmail(emailInput.value)) {
        mensagemLabel.textContent = "Erro: O login deve ser um e-mail válido.";
        mensagemLabel.style.color = 'red';
        return;
    }

    if (!senhaInput.value.trim()) {
        mensagemLabel.textContent = "Erro: A senha deve ser preenchida.";
        mensagemLabel.style.color = 'red';
        return;
    }

    if (validarLogin(emailInput.value, senhaInput.value)) {
        mensagemLabel.style.color = 'green';
        mensagemLabel.textContent = "Validação realizada com sucesso.";

        setLoggedInUser(emailInput.value);

        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1500);
    } else {
        mensagemLabel.style.color = 'red';
        mensagemLabel.textContent = "Erro: Login ou senha incorretos.";
    }
});