// auth
document.addEventListener("DOMContentLoaded", function () {
   // Session storage
    const usuario = sessionStorage.getItem("usuarioLogado");
    const paginaAtual = window.location.pathname;

    console.log("Usuário logado: ", usuario);

    if (!usuario && !paginaAtual.includes("login.html")) {
        window.location.href = "login.html"; 
    }
});

// Msg boas vindas
function gerenciarNavbar() {
    // Session storage
    const dadosSessao = sessionStorage.getItem("usuarioLogado");
    const msgBoasVindas = document.getElementById("boas-vindas-usuario");

    if (dadosSessao && msgBoasVindas) {
        try {
            const usuario = JSON.parse(dadosSessao);
            const nomeExibir = usuario.email.split('@')[0];
            const nomeFormatadoTeste = nomeExibir.charAt(0).toUpperCase() + nomeExibir.slice(1);

            console.log("Nome Formatado: ", nomeFormatadoTeste);

            msgBoasVindas.innerText = `Bem-vindo, ${nomeFormatadoTeste}`;
        } catch (e) {
            msgBoasVindas.innerText = `Bem-vindo!`;
        }
    }
};

// Modal
function abrirModalConfirmacao() {
    let modalConf = document.getElementById("modalSair");

    let modalBootstrap = new bootstrap.Modal(modalConf);

    modalBootstrap.show();
}

function fecharModal() {
    let modalConf = document.getElementById("modalSair");

    let modalBootstrap = bootstrap.Modal.getInstance(modalConf);

    if (modalBootstrap != null) {
        modalBootstrap.hide();
    }
}

// Sair
window.sair = function() {
    sessionStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";
};

document.addEventListener("DOMContentLoaded", gerenciarNavbar);