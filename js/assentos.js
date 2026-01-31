// Session Storage //
const dadosSessaoSession = JSON.parse(sessionStorage.getItem("sessao_selecionada"));

if (!dadosSessaoSession) {
    window.location.href = "index.html";
}

const salaId = dadosSessaoSession.sala;
const filmeNome = dadosSessaoSession.nome;
const horaSessao = dadosSessaoSession.hora;
const dataSessao = dadosSessaoSession.data;
const precoIngresso = parseFloat(dadosSessaoSession.preco) || 0;

let assentosSelecionados = [];

// Mapa da sala //
async function carregarMapaSala() {
    try {
        const resposta = await fetch("../data/catalogo_salas.json");
        const cinema = await resposta.json();

        const salaData = cinema.find(s => s.id == salaId);

        if (!salaData) {
            console.error("Sala não encontrada");
            return;
        }

        renderizarCabecalho(salaData.Sala);
        gerarMapa(salaData.Assentos[0]);

    } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
    }
}

// Data dia/mes/ano //
function formatoDataBR(dataString) {
    if (!dataString) return "";

    const data = new Date(dataString.replace(/-/g, '\/'));

    return data.toLocaleDateString('pt-BR');
}

// Dados da sessão (topo) //
function renderizarCabecalho(nomeSala) {
    // Data BR
    const dataFormatada = formatoDataBR(dataSessao);

    const itNome = document.getElementById("nome-filme-assento");
    const itInfo = document.getElementById("info-sessao");
    const itResumoFilme = document.getElementById("resumo-filme");
    const itResumoData = document.getElementById("resumo-data-hora");

    if (itNome) itNome.innerText = filmeNome;
    if (itInfo) itInfo.innerText = `Sala: ${nomeSala} • Data: ${dataFormatada} • Hora: ${horaSessao}`;
    if (itResumoFilme) itResumoFilme.innerText = filmeNome;
    if (itResumoData) itResumoData.innerText = `${dataFormatada} - ${horaSessao}`;
}

// Layout dos Assentos //
function gerarMapa(layout) {
    const container = document.getElementById("mapa-sala");
    if (!container) return;
    container.innerHTML = "";

    // Dia da semana
    const dataObjeto = new Date(dataSessao.replace(/-/g, '\/'));

    const ocupacoesExemplo = {
        //////////////////////////////////// SALA A
        "1_0_12:00": ["E2", "E3", "D5", "D6", "C7", "C8", "B2", "B3", "B4"],
        "1_0_17:00": ["D2", "D3", "D4", "E7", "E8", "E9", "E10", "B2", "B3", "C7", "C8", "C4", "C5"],
        "1_0_14:00": ["C4", "C5", "E1", "E2", "D9", "D10", "B7"],
        "1_0_20:30": ["E5", "E6", "D2", "D3", "D4", "C8", "B1", "B2", "A5", "A6", "E9"],
        "1_0_19:15": ["D5", "D6", "E3", "E4", "C1", "C2", "B8", "A4"],
        "1_0_22:30": ["E7", "E8", "D4", "C3", "C4", "B5", "A2", "D1"],
        "1_0_16:15": ["B4", "B5", "C2", "E6", "E7", "D1", "D2"],
        "1_0_22:00": ["E1", "E2", "D8", "D9", "C5", "C6", "B3", "A7", "A8"],

        ////////////////////////////////////// SALA B
        "2_0_12:15": ["D3", "D4", "E8", "C1"],
        "2_0_17:30": ["B5", "B6", "C7", "C8", "D1", "D2", "E4", "E5"],
        "2_0_22:30": ["E9", "E10", "D5", "C2", "C3", "B1", "A8", "E1", "E2"],
        "2_0_14:45": ["A4", "A5", "B2", "C6", "D8", "E3"],
        "2_0_20:00": ["E4", "E5", "E6", "D8", "D9", "C1", "C2", "B4", "B5", "A3", "E1"],
        "2_0_14:30": ["C7", "C8", "D1", "D2", "D3", "E4", "E5", "E6", "E7", "B1", "B2", "B3"],
        "2_0_19:30": ["D4", "D5", "E1", "E2", "C1", "C2", "B7", "B8", "D8", "D9", "D10"],
        "2_0_16:30": ["B3", "B4", "A2", "D6", "D7", "E8", "C5"],
        "2_0_21:00": ["E2", "E3", "D4", "D5", "C6", "C7", "B8", "A1", "A2", "E7"],

        /////////////////////////////////////// SALA C
        "3_0_12:00": ["A2", "A3", "A4", "B2", "B3", "B4", "B5", "C5", "C6", "E5", "E6", "E7", "E8"],
        "3_0_15:30": ["E1", "E2", "D8", "D9", "D10", "B2", "B3", "B4"],
        "3_0_19:15": ["D2", "D3", "E5", "E6", "E7", "C1", "C2", "B4", "A8", "D10"],
        "3_0_13:45": ["B1", "B2", "C8", "D4", "E9"],
        "3_0_17:15": ["E3", "E4", "D1", "D2", "C5", "B7", "A4", "A5"],
        "3_0_22:30": ["E8", "E9", "D7", "C3", "B2", "B3", "A1", "E1", "D1"],
        "3_0_21:00": ["C4", "C5", "D9", "D10", "E1", "E2", "B6", "B7", "A3"],

        ///////////////////////////////////////// SALA D
        "4_0_14:30": ["D1", "D2", "D3", "E9", "E10"],
        "4_0_18:45": ["B4", "B5", "C1", "D3", "D4", "E6", "E7", "A8"],
        "4_0_22:30": ["E4", "E5", "D1", "D2", "C7", "C8", "B1", "B2", "A5", "E10"],
        "4_0_12:15": ["C3", "C4", "B5", "D1"],
        "4_0_16:30": ["E1", "E2", "D5", "C8", "B4"],
        "4_0_20:45": ["D7", "D8", "E2", "E3", "C5", "C6", "B1", "A4", "D1", "E10"]
    };

    //  7 dias
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const limiteSeteDias = new Date();
    limiteSeteDias.setDate(hoje.getDate() + 7);
    limiteSeteDias.setHours(23, 59, 59, 999);

    let ocupadosEx = [];

    if (dataObjeto >= hoje && dataObjeto <= limiteSeteDias) {

        
        const chaveExemplo = `${salaId}_0_${horaSessao}`;
        ocupadosEx = ocupacoesExemplo[chaveExemplo] || [];
        
       // console.log("Sala e horário: ", chaveExemplo);
       // console.log("Ocupados Ex: ", ocupadosEx);
    }

    // Assentos LocalStorage (compra)
    const chaveOcupacaoStorage = `ocupados_${salaId}_${dataSessao}_${horaSessao}`;
    const ocupadosCompra = JSON.parse(localStorage.getItem(chaveOcupacaoStorage)) || [];

  //  console.log("Chave Ocupação LS: ", chaveOcupacaoStorage);
    console.log("Ocupados Compra: ", ocupadosCompra);

    // Assentos LocalStorage (carrinho)
    const carrinhoAtual = JSON.parse(localStorage.getItem("carrinho_cinema")) || [];
    const assentosNoCarrinho = carrinhoAtual
        .filter(item => item.salaId === salaId && item.data === dataSessao && item.hora === horaSessao)
        .flatMap(item => item.assentos);

        console.log("Assentos no Carrinho:", assentosNoCarrinho);

    Object.keys(layout).forEach(fileiraNome => {
        const fileiraDiv = document.createElement("div");
        fileiraDiv.className = "fileira-container d-flex justify-content-center mb-2";

        const label = document.createElement("div");

        label.className = "label-fileira me-2 text-white";
        label.innerText = fileiraNome.replace("Fileira ", "");

        fileiraDiv.appendChild(label);

        const cadeiras = layout[fileiraNome][0].Cadeira;
        cadeiras.forEach((num) => {
            const assento = document.createElement("div");

            if (num === "") {
                assento.className = "assento-vazio mx-1"; 
            } else {
                const idAssento = `${fileiraNome.replace("Fileira ", "")}${num}`;

                assento.className = "assento-cinema mx-1";
                assento.innerText = num;
                assento.dataset.id = idAssento;

                // Verificação de ocupação
                if (ocupadosEx.includes(idAssento) ||
                    ocupadosCompra.includes(idAssento) ||
                    assentosNoCarrinho.includes(idAssento)) {
                    assento.classList.add("ocupado");
                } else {
                    assento.onclick = () => selecionarAssento(assento, idAssento);
                }
            }
         
            fileiraDiv.appendChild(assento);
        });
     
        container.appendChild(fileiraDiv);
    });
}

// Seleção dos Assentos //
function selecionarAssento(elemento, id) {
    if (assentosSelecionados.includes(id)) {
      
        assentosSelecionados = assentosSelecionados.filter(a => a !== id);
        elemento.classList.remove("selecionado");
    } else {
        assentosSelecionados.push(id);
        elemento.classList.add("selecionado");
    }

    const inputInt = document.getElementById("qtd-inteira");
    const inputMeia = document.getElementById("qtd-meia");

    if (inputInt) inputInt.value = assentosSelecionados.length;
    if (inputMeia) inputMeia.value = 0;

    atualizarResumo();
}

function eventosInputs() {
    const inputInt = document.getElementById("qtd-inteira");
    const inputMeia = document.getElementById("qtd-meia");

    if (inputInt) {
        inputInt.addEventListener("input", function () {
            ajustarQtdMeiaInt("inteira");
        });
    }

    if (inputMeia) {
        inputMeia.addEventListener("input", function () {
            ajustarQtdMeiaInt("meia");
        });
    }
}

function ajustarQtdMeiaInt(tipoAlterado) {
    const totalAssentos = assentosSelecionados.length;
    let qtdInteira = parseInt(document.getElementById("qtd-inteira").value) || 0;
    let qtdMeia = parseInt(document.getElementById("qtd-meia").value) || 0;

    if (totalAssentos === 0) return;

    if (tipoAlterado === "inteira") {
        if (qtdInteira > totalAssentos) qtdInteira = totalAssentos;
        qtdMeia = totalAssentos - qtdInteira;
    } else {
        if (qtdMeia > totalAssentos) qtdMeia = totalAssentos;
        qtdInteira = totalAssentos - qtdMeia;
    }

    document.getElementById("qtd-inteira").value = qtdInteira;
    document.getElementById("qtd-meia").value = qtdMeia;

    atualizarResumo();
}

// Resumo da compra //
function atualizarResumo() {
    const textoAssentos = document.getElementById("resumo-assentos");
    const textoTotal = document.getElementById("resumo-total");
    const btnConfirmar = document.getElementById("btn-confirmar");

    const qtdInteira = parseInt(document.getElementById("qtd-inteira").value) || 0;
    const qtdMeia = parseInt(document.getElementById("qtd-meia").value) || 0;

    if (textoAssentos) textoAssentos.innerText = assentosSelecionados.length > 0 ? assentosSelecionados.join(", ") : "-";

    // Cálculo
    const valorTotal = (qtdInteira * precoIngresso) + (qtdMeia * (precoIngresso / 2));

    if (textoTotal) textoTotal.innerText = `R$ ${valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

    const intInput = document.getElementById("qtd-inteira");
    const meiaInput = document.getElementById("qtd-meia");

    if (intInput) intInput.disabled = assentosSelecionados.length === 0;
    if (meiaInput) meiaInput.disabled = assentosSelecionados.length === 0;

    if (btnConfirmar) btnConfirmar.disabled = assentosSelecionados.length === 0;
}

// Btn + e - //
function alterarQtd(tipo, valor) {
    const input = document.getElementById(`qtd-${tipo}`);
   
    if (!input || input.disabled) return;

    let atual = parseInt(input.value) || 0;
    let novo = atual + valor;

    if (novo >= 0) {
        input.value = novo;
        ajustarQtdMeiaInt(tipo);
    }
}

// Carrinho //
function salvarNoCarrinho() {
    if (assentosSelecionados.length === 0) return;

    const qtdInteira = parseInt(document.getElementById("qtd-inteira").value) || 0;
    const qtdMeia = parseInt(document.getElementById("qtd-meia").value) || 0;
    const valorTotal = (qtdInteira * precoIngresso) + (qtdMeia * (precoIngresso / 2));

    // Item p carrinho
    const itemCarrinho = {
        salaId, filme: filmeNome, data: dataSessao, hora: horaSessao,
        assentos: assentosSelecionados, qtdInteira, qtdMeia, total: valorTotal
    };

    let carrinho = JSON.parse(localStorage.getItem("carrinho_cinema")) || [];
    carrinho.push(itemCarrinho);

    localStorage.setItem("carrinho_cinema", JSON.stringify(carrinho));

    // modal
    const modalSucesso = new bootstrap.Modal(document.getElementById('modalSucessoCarrinho'));
    modalSucesso.show();

    assentosSelecionados = [];
    atualizarResumo();
}

// Modal Bootstrap //
function retornar() {
    const modalElement = document.getElementById('modalSucessoCarrinho');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
   
    if (modalInstance) modalInstance.hide();

    carregarMapaSala();
    renderizarResumo();
    badgeCarrinho();
}

// Renderizar Resumo //
function renderizarResumo() {
    const listaHtml = document.getElementById("lista-carrinho");
 
    if (!listaHtml) return;

    const carrinho = JSON.parse(localStorage.getItem("carrinho_cinema")) || [];

    if (carrinho.length === 0) {
        listaHtml.innerHTML = `<p class="text-white">Seu carrinho está vazio.</p>`;
        return;
    }

    listaHtml.innerHTML = carrinho.map(item => `
        <div class="card text-white mb-3 border-secondary">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                     <div>
                        <h5 class="card-title text-info">${item.filme}</h5>
                        <p class="card-text mb-1 small">Assentos: <strong class="text-warning">${item.assentos.join(", ")}</strong></p>
                        <p class="small text-muted mb-0">${formatoDataBR(item.data)} | ${item.hora}</p>
                    </div>
                    <div class="text-end">
                        <span class="badge bg-primary d-block mb-1">${item.qtdInteira} Inteira</span>
                        <span class="badge bg-info text-dark d-block">${item.qtdMeia} Meia</span>
                    </div>
                </div>
            </div>
        </div>
    `).join("");

    const totalGeral = carrinho.reduce((acc, item) => acc + item.total, 0);
    const qtdIntGeral = carrinho.reduce((acc, item) => acc + item.qtdInteira, 0);
    const qtdMeiaGeral = carrinho.reduce((acc, item) => acc + item.qtdMeia, 0);

    const resInt = document.getElementById("resumo-inteira");
    const resMeia = document.getElementById("resumo-meia");
    const resSubtotal = document.getElementById("resumo-subtotal");
    const resTotal = document.getElementById("resumo-total");

    if (resInt) resInt.innerText = `${qtdIntGeral}`;
    if (resMeia) resMeia.innerText = `${qtdMeiaGeral}`;
    if (resSubtotal) resSubtotal.innerText = `R$ ${totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    if (resTotal) resTotal.innerText = `R$ ${totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

function limparCarrinhoCompleto() {
    localStorage.removeItem("carrinho_cinema");
    renderizarResumo();
    location.reload();
}

// Badge Carrinho //
function badgeCarrinho() {
    const badge = document.getElementById("bagde-carrinho");
    if (!badge) return;

    const carrinho = JSON.parse(localStorage.getItem("carrinho_cinema")) || [];
    const totalIngressos = carrinho.reduce((acc, item) => acc + item.assentos.length, 0);

    badge.innerText = totalIngressos;
    badge.style.display = totalIngressos === 0 ? "none" : "block";
}

badgeCarrinho();

// Inicialização //
document.addEventListener("DOMContentLoaded", () => {
    carregarMapaSala();
    renderizarResumo();
    eventosInputs();

    const btnConf = document.getElementById("btn-confirmar");
    if (btnConf) btnConf.onclick = salvarNoCarrinho;
});