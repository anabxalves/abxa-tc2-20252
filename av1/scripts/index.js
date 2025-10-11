document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = getLoggedInUser();
    const linkLogin = document.getElementById('link-login');
    const linkSolicitacao = document.getElementById('link-solicitacao');
    const btnLogout = document.getElementById('btn-logout');

    if (loggedInUser) {
        linkSolicitacao.style.display = 'inline';
        btnLogout.style.display = 'inline';
        linkLogin.style.display = 'none';
    } else {
        linkSolicitacao.style.display = 'none';
        btnLogout.style.display = 'none';
        linkLogin.style.display = 'inline';
    }

    btnLogout.addEventListener('click', function() {
        logoutUser();
        window.location.href = 'index.html';
    });
});