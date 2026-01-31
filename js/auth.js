// Autenticação //
document.addEventListener("DOMContentLoaded", function () {
    // Session storage
    const usuario = sessionStorage.getItem("usuarioLogado");
    const paginaAtual = window.location.pathname;

    console.log("Usuário logado: ", usuario);

    if (!usuario && !paginaAtual.includes("login.html")) {
        setTimeout(() => {
            if (!sessionStorage.getItem("usuarioLogado")) {
                window.location.href = "login.html";
            }
        }, 500);
    }
});

// Persistir entre abas //
const authChannel = new BroadcastChannel('session_sync');

    const sincronizarLoginAbas = () => {
    const usuario = sessionStorage.getItem("usuarioLogado");

    if (!usuario) {
        authChannel.postMessage({ tipo: 'SOLICITAR_SESSAO' });
    }

    authChannel.onmessage = (event) => {

        const { tipo, dadosSessao } = event.data;

        if (tipo === 'SOLICITAR_SESSAO' && sessionStorage.getItem("usuarioLogado")) {

            authChannel.postMessage({
                tipo: 'FORNECER_SESSAO',
                dadosSessao: sessionStorage.getItem("usuarioLogado")
            });
        } else if (tipo === 'FORNECER_SESSAO' && !sessionStorage.getItem("usuarioLogado")) {

            sessionStorage.setItem("usuarioLogado", dadosSessao);
            window.location.reload();
        }
    };
};

sincronizarLoginAbas();

// Msg boas vindas //
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

// Modal //
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

// Sair //
window.sair = function () {
    sessionStorage.removeItem("usuarioLogado");

    authChannel.postMessage({ tipo: 'EVENTO_LOGOUT' });
    window.location.href = "login.html";
};

// Logout em todas as abas //
authChannel.addEventListener('message', (event) => {

    if (event.data.tipo === 'EVENTO_LOGOUT') {
        sessionStorage.removeItem("usuarioLogado");
        window.location.href = "login.html";
    }
});

document.addEventListener("DOMContentLoaded", gerenciarNavbar);