// Botão mostrar senha
let inputSenha = document.getElementById("senhaUsuario");
let mostrarSenha = document.getElementById("mostrarSenha");
let iconeSenha = document.getElementById("iconeSenha");

if (mostrarSenha) {
    mostrarSenha.addEventListener("change", () => {
        if (mostrarSenha.checked) {
            inputSenha.type = "text";
           
            if (iconeSenha) iconeSenha.classList.replace("bi-eye-slash-fill", "bi-eye-fill");
        } else {
            inputSenha.type = "password";
           
            if (iconeSenha) iconeSenha.classList.replace("bi-eye-fill", "bi-eye-slash-fill");
        }
    });
}

// Logar e validar
function fazerLogin() {
    const form = document.querySelector(".needs-validation");

    if (form && !form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }

    let emailElement = document.getElementById('emailUsuario');
    let senhaElement = document.getElementById('senhaUsuario');

    if (!emailElement || !senhaElement) return;

    let emailUsuario = emailElement.value.trim();
    let senhaUsuario = senhaElement.value.trim();

    const usuarioTeste = "teste@cinema.com";
    const senhaTeste = "cinema1234";

    if (emailUsuario === usuarioTeste && senhaUsuario === senhaTeste) {
        // dados
        const dadosUsuario = {
            email: emailUsuario,
            logado: true,
            timestamp: new Date().getTime()
        };

        // Session Storage
        sessionStorage.setItem("usuarioLogado", JSON.stringify(dadosUsuario));
        
        window.location.href = "../index.html";
    } else {
        const modalErro = document.querySelector(".modalErro");
     
        if (modalErro) {
            const mostrarModal = new bootstrap.Modal(modalErro);
            mostrarModal.show();
        }
        
        console.log("Login Incorreto");
    }
}

window.fazerLogin = fazerLogin;

function retornar() {
    const modalErro = document.querySelector(".modalErro");
    if (modalErro) {
        const mostrarModal = bootstrap.Modal.getInstance(modalErro);
        if (mostrarModal) {
            mostrarModal.hide();
        }
    }
}

window.retornar = retornar;

// Logar com tecla enter
document.addEventListener('keydown', function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        fazerLogin();
    }
});


/////////  LOGIN OK /////////////