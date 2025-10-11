document.getElementById('btn-limpar').addEventListener('click', function() {
    document.getElementById('trocaSenhaForm').reset();
    document.getElementById('trocaSenhaLogin').focus();
});

document.getElementById('trocaSenhaForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const loginInput = document.getElementById('trocaSenhaLogin');
    const novaSenhaInput = document.getElementById('novaSenha');
    const confirmaSenhaInput = document.getElementById('confirmaSenha');
    const mensagemLabel = document.getElementById('mensagem-validacao');

    mensagemLabel.textContent = '';
    mensagemLabel.style.color = 'red';

    if (!loginInput.value.trim() || !validarEmail(loginInput.value)) {
        mensagemLabel.textContent = "Erro: O login deve ser um e-mail válido.";
        return;
    }

    if (!novaSenhaInput.value.trim()) {
        mensagemLabel.textContent = "Erro: A nova senha deve ser preenchida.";
        return;
    }

    if (!confirmaSenhaInput.value.trim()) {
        mensagemLabel.textContent = "Erro: A confirmação de senha deve ser preenchida.";
        return;
    }

    if (novaSenhaInput.value !== confirmaSenhaInput.value) {
        mensagemLabel.textContent = "Erro: A nova senha e a confirmação de senha não correspondem.";
        return;
    }

    if (!validarSenha(novaSenhaInput.value)) {
        mensagemLabel.textContent = "Erro: A senha não atende aos requisitos de composição.";
        return;
    }

    if (trocarSenha(loginInput.value, novaSenhaInput.value)) {
        mensagemLabel.style.color = 'green';
        mensagemLabel.textContent = "Validação realizada com sucesso. Senha alterada!";

        setTimeout(() => {
            window.location.href = '../pages/login.html';
        }, 1500);
    } else {
        mensagemLabel.style.color = 'red';
        mensagemLabel.textContent = "Erro: E-mail não encontrado.";
    }
});