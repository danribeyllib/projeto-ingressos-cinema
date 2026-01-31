let indexParaExcluir = null;

// Data dia/mes/ano //
function formatarDataBR(dataString) {
    if (!dataString) return "";
    const data = new Date(dataString.replace(/-/g, '\/'));
    return data.toLocaleDateString('pt-BR');
}

// Carrinho //
function renderizarCarrinho() {
    const listaHtml = document.getElementById("lista-carrinho");
    if (!listaHtml) return;

    const carrinho = JSON.parse(localStorage.getItem("carrinho_cinema")) || [];

    const letraSalas = {
        1: "A",
        2: "B",
        3: "C",
        4: "D"
    };

    if (carrinho.length === 0) {
        listaHtml.innerHTML = `<p class="text-white fs-5">Nenhum ingresso no carrinho.</p>`;

        document.getElementById("resumo-inteira").innerText = "0";
        document.getElementById("resumo-subtotal-inteira").innerText = "R$ 0,00";
        document.getElementById("resumo-meia").innerText = "0";
        document.getElementById("resumo-subtotal-meia").innerText = "R$ 0,00";
        document.getElementById("resumo-total").innerText = "R$ 0,00";

        const btnConcluir = document.getElementById("btn-concluir-compra");
        if (btnConcluir) btnConcluir.disabled = true;
        return;
    }

    // Renderizar
    listaHtml.innerHTML = carrinho.map((item, index) => {
        const salaLetra = letraSalas[item.salaId] || item.salaId;

        return `
            <div class="card card-itens-carrinho text-white mb-3 shadow-sm">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h5 class="card-title text-info fw-bold mb-1">${item.filme}</h5>
                            <p class="card-text mb-1">
                                Assentos: <span class="text-warning fw-bold">${item.assentos.join(", ")}</span>
                            </p>
                            <p class="small text-white mb-0">
                                ${formatarDataBR(item.data)} - ${item.hora} - Sala ${salaLetra}
                            </p>
                        </div>
                        <div class="text-end d-flex align-items-center">
                            <div class="me-4">
                                <span class="badge bagde-carrinho text-info d-block mb-1">${item.qtdInteira} Inteira</span>
                                <span class="badge bagde-carrinho text-warning d-block">${item.qtdMeia} Meia</span>
                            </div>
                            <button class="btn btn-sm btn-outline-danger" onclick="modalExcluir(${index})">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join("");

    // Cálculo total
    let qtdIntGeral = 0;
    let qtdMeiaGeral = 0;
    let valorTotalInteiras = 0;
    let valorTotalMeias = 0;

    carrinho.forEach(item => {
        const precoIngUnitario = item.total / (item.qtdInteira + (item.qtdMeia * 0.5));
        qtdIntGeral += item.qtdInteira;
        qtdMeiaGeral += item.qtdMeia;
        valorTotalInteiras += item.qtdInteira * precoIngUnitario;
        valorTotalMeias += item.qtdMeia * (precoIngUnitario * 0.5);
    });

    const totalGeral = valorTotalInteiras + valorTotalMeias;

    document.getElementById("resumo-inteira").innerText = `${qtdIntGeral}`;
    document.getElementById("resumo-subtotal-inteira").innerText = `R$ ${valorTotalInteiras.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    document.getElementById("resumo-meia").innerText = `${qtdMeiaGeral}`;
    document.getElementById("resumo-subtotal-meia").innerText = `R$ ${valorTotalMeias.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    document.getElementById("resumo-total").innerText = `R$ ${totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

    const btnConcluir = document.getElementById("btn-concluir-compra");
    if (btnConcluir) btnConcluir.disabled = false;
}

// Modais //
function modalExcluir(index) { 
    indexParaExcluir = index;
    
    const modal = new bootstrap.Modal(document.getElementById('modalEcluir'));
    modal.show();
}

// Excluir item carrinho //
function ecluirItemCarrinho() {
    if (indexParaExcluir !== null) {

        let carrinho = JSON.parse(localStorage.getItem("carrinho_cinema")) || [];
        carrinho.splice(indexParaExcluir, 1);

        localStorage.setItem("carrinho_cinema", JSON.stringify(carrinho));
        indexParaExcluir = null;

        badgeCarrinho();
        renderizarCarrinho();

        // Modal
        const modalElement = document.getElementById('modalEcluir');
        const instance = bootstrap.Modal.getInstance(modalElement);
        if (instance) instance.hide();
    }
}

// Modal Limpar Carrinho //
function modalLimparCarrinho() {
    const modal = new bootstrap.Modal(document.getElementById('modalLimpar'));
    modal.show();
}

// Limpar carrinho
function limparCarrinhoCompleto() {
    localStorage.removeItem("carrinho_cinema");
    badgeCarrinho();
    renderizarCarrinho();

    const modalElement = document.getElementById('modalLimpar');
    const instance = bootstrap.Modal.getInstance(modalElement);
    if (instance) instance.hide();
}

// Retornar //
function retornar() {
    const modalEcluirElement = document.getElementById('modalEcluir');
    const modalLimparElement = document.getElementById('modalLimpar');

    const modalEcluir = bootstrap.Modal.getInstance(modalEcluirElement);
    const modalLimpar = bootstrap.Modal.getInstance(modalLimparElement);

    if (modalEcluir) modalEcluir.hide();
    if (modalLimpar) modalLimpar.hide();
}

// Badge Carrinho
function badgeCarrinho() {
    const badge = document.getElementById("bagde-carrinho");
    if (!badge) return;

    const carrinho = JSON.parse(localStorage.getItem("carrinho_cinema")) || [];
    const totalIngressos = carrinho.reduce((acc, item) => acc + item.assentos.length, 0);

    badge.innerText = totalIngressos;
    badge.style.display = totalIngressos === 0 ? "none" : "block";
}

// Inicialização //
document.addEventListener("DOMContentLoaded", () => {
    badgeCarrinho();
    renderizarCarrinho();

    const btnAvancar = document.getElementById("btn-concluir-compra");
    if (btnAvancar) {
        btnAvancar.onclick = () => {
            window.location.href = "pagamento.html";
        };
    }
});