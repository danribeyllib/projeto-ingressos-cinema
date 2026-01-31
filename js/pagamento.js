// Inicialização //
document.addEventListener("DOMContentLoaded", () => {
    resumoPagamento();
    configurarMascaras();
    
    const form = document.getElementById('form-pagamento');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity()) {
            processarPagamento();
        }

        form.classList.add('was-validated');
    }, false);
});

// Validações //
function configurarMascaras() {
    const numCartao = document.getElementById('card-numero');
    const validade = document.getElementById('card-validade');
    const cvv = document.getElementById('card-cvv');

    numCartao.addEventListener('input', e => {
        e.target.value = e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
    });

    validade.addEventListener('input', e => {
        let val = e.target.value.replace(/\D/g, '');
        
        if (val.length >= 2) {
            e.target.value = val.substring(0, 2) + '/' + val.substring(2, 4);
        } else {
            e.target.value = val;
        }
    });

    cvv.addEventListener('input', e => {
        e.target.value = e.target.value.replace(/\D/g, '');
    });
}

// Resumo //
function resumoPagamento() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho_cinema")) || [];
    const resumoTotal = document.getElementById("checkout-total-geral");
    const resumoQtd = document.getElementById("checkout-qtd-itens");

    if (carrinho.length === 0) {
        window.location.href = "index.html";
        return;
    }

    let totalGeral = 0;
    let totalItens = 0;

    carrinho.forEach(item => {
        const precoUnitario = item.total / (item.qtdInteira + (item.qtdMeia * 0.5));
        totalGeral += (item.qtdInteira * precoUnitario) + (item.qtdMeia * (precoUnitario * 0.5));
        
        // Soma quantidade de assentos (itens)
        totalItens += item.assentos.length;
    });

    if (resumoTotal) {
        resumoTotal.innerText = `R$ ${totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    }

    if (resumoQtd) {
        resumoQtd.innerText = totalItens;
    }
}

// Simulação do Pagamento //
function processarPagamento() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho_cinema")) || [];
    
    if (carrinho.length === 0) return;

    let comprasAnteriores = JSON.parse(localStorage.getItem("itens_comprados")) || [];

    const carrinhoComCodigos = carrinho.map(item => ({
        ...item,
        codigoReserva: gerarCodigoUnico()        
    }));

    const novoHistorico = [...comprasAnteriores, ...carrinhoComCodigos];

    localStorage.setItem("itens_comprados", JSON.stringify(novoHistorico));

    // Cálculo de estoque e ocupação
    carrinho.forEach(item => {
        const chaveOcupacao = `ocupados_${item.salaId}_${item.data}_${item.hora}`;
        let ocupadosNoSistema = JSON.parse(localStorage.getItem(chaveOcupacao)) || [];
        
        const novosOcupados = [...ocupadosNoSistema, ...item.assentos];
        localStorage.setItem(chaveOcupacao, JSON.stringify(novosOcupados));
    });

    // Limpar o carrinho
    localStorage.removeItem("carrinho_cinema");

    // Modal sucesso
    const modalSucesso = new bootstrap.Modal(document.getElementById('modalCompraConf'));
    modalSucesso.show();
};

// Bagde Carrinho //
function badgeCarrinho() {
    const badge = document.getElementById("bagde-carrinho");
    if (!badge) return;

    const carrinho = JSON.parse(localStorage.getItem("carrinho_cinema")) || [];
    const totalIngressos = carrinho.reduce((acc, item) => acc + item.assentos.length, 0);

    badge.innerText = totalIngressos;
    badge.style.display = totalIngressos === 0 ? "none" : "block";
};

// Cód Barras //
function gerarCodigoUnico() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = '';
    for (let i = 0; i < 8; i++) {
        codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return codigo;
}

badgeCarrinho();