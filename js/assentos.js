// Montar URL
const urlParams = new URLSearchParams(window.location.search);
const salaId = urlParams.get("sala");

const filmeNome = urlParams.get("nome");
const horaSessao = urlParams.get("hora");
const dataSessao = urlParams.get("data");
const precoIngresso = parseFloat(urlParams.get("preco")) || 0;

let assentosSelecionados = [];

// Mapa da sala
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

// Data dia/mes/ano
function formatarDataBR(dataString) {
    if (!dataString) return "";
    
    const data = new Date(dataString.replace(/-/g, '\/'));
    
    return data.toLocaleDateString('pt-BR');
}

// Dados da sessão (topo)
function renderizarCabecalho(nomeSala) {
    // Data BR
    const dataFormatada = formatarDataBR(dataSessao);

    document.getElementById("nome-filme-assento").innerText = filmeNome;
    document.getElementById("info-sessao").innerText = `Sala ${nomeSala} | ${dataFormatada} às ${horaSessao}`;
    document.getElementById("resumo-filme").innerText = filmeNome;
    document.getElementById("resumo-data-hora").innerText = `${dataFormatada} - ${horaSessao}`;
}

// Layout dos Assentos
function gerarMapa(layout) {
    const container = document.getElementById("mapa-sala");
    container.innerHTML = "";

    Object.keys(layout).forEach(fileiraNome => {
        const fileiraDiv = document.createElement("div");
       
        fileiraDiv.className = "fileira-container mb-2";

        // Label (Letra lateral)
        const label = document.createElement("div");
      
        label.className = "label-fileira"; 
        label.innerText = fileiraNome.replace("Fileira ", "");
    
        fileiraDiv.appendChild(label);

        const cadeiras = layout[fileiraNome][0].Cadeira;

        cadeiras.forEach((num) => {
            const assento = document.createElement("div");
            
            if (num === "") {
                // Espaço vazio (corredor)
                assento.className = "assento-vazio";
            } else {
                // Assento real
                const idAssento = `${fileiraNome.replace("Fileira ", "")}${num}`;
                assento.className = "assento-cinema"; 
                assento.innerText = num;
                assento.dataset.id = idAssento;

                // Simulação de assento ocupado
                if (Math.random() < 0.15) {
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

// Seleção dos Assentos
// Seleção dos Assentos
function selecionarAssento(elemento, id) {
    if (assentosSelecionados.includes(id)) {
        assentosSelecionados = assentosSelecionados.filter(a => a !== id);
        elemento.classList.remove("selecionado");
    } else {
        assentosSelecionados.push(id);
        elemento.classList.add("selecionado");
    }

    // Ao selecionar/deselecionar, resetamos os seletores para o padrão (tudo inteira)
    document.getElementById("qtd-inteira").value = assentosSelecionados.length;
    document.getElementById("qtd-meia").value = 0;

    atualizarResumo();
}

// Ouvintes de evento para os seletores de tipo de ingresso
document.getElementById("qtd-inteira").addEventListener("input", function() {
    ajustarQuantidades("inteira");
});

document.getElementById("qtd-meia").addEventListener("input", function() {
    ajustarQuantidades("meia");
});

function ajustarQuantidades(tipoAlterado) {
    const totalAssentos = assentosSelecionados.length;
    let qtdInteira = parseInt(document.getElementById("qtd-inteira").value) || 0;
    let qtdMeia = parseInt(document.getElementById("qtd-meia").value) || 0;

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

// Resumo da compra 
// Seleção dos Assentos
function selecionarAssento(elemento, id) {
    if (assentosSelecionados.includes(id)) {
        assentosSelecionados = assentosSelecionados.filter(a => a !== id);
        elemento.classList.remove("selecionado");
    } else {
        assentosSelecionados.push(id);
        elemento.classList.add("selecionado");
    }

    document.getElementById("qtd-inteira").value = assentosSelecionados.length;
    document.getElementById("qtd-meia").value = 0;

    atualizarResumo();
}

document.getElementById("qtd-inteira").addEventListener("input", function() {
    ajustarQuantidades("inteira");
});

document.getElementById("qtd-meia").addEventListener("input", function() {
    ajustarQuantidades("meia");
});

function ajustarQuantidades(tipoAlterado) {
    const totalAssentos = assentosSelecionados.length;
 
    let qtdInteira = parseInt(document.getElementById("qtd-inteira").value) || 0;
    let qtdMeia = parseInt(document.getElementById("qtd-meia").value) || 0;

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

// Resumo da compra 
function atualizarResumo() {
    const txtAssentos = document.getElementById("resumo-assentos");
    const txtTotal = document.getElementById("resumo-total");
    const btnConfirmar = document.getElementById("btn-confirmar");
    
    const qtdInteira = parseInt(document.getElementById("qtd-inteira").value) || 0;
    const qtdMeia = parseInt(document.getElementById("qtd-meia").value) || 0;

    txtAssentos.innerText = assentosSelecionados.length > 0 ? assentosSelecionados.join(", ") : "-";
    
    // Cálculo
    const valorTotal = (qtdInteira * precoIngresso) + (qtdMeia * (precoIngresso / 2));
    
    txtTotal.innerText = `R$ ${valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

    document.getElementById("qtd-inteira").disabled = assentosSelecionados.length === 0;
    document.getElementById("qtd-meia").disabled = assentosSelecionados.length === 0;
    
    btnConfirmar.disabled = assentosSelecionados.length === 0;
}

// Btn + e -                                                      ////////////////////////   OK    ///
function alterarQtd(tipo, valor) {
    const input = document.getElementById(`qtd-${tipo}`);
    if (!input || input.disabled) return;

    let atual = parseInt(input.value) || 0;
    let novo = atual + valor;

    if (novo >= 0) {
        input.value = novo;
        ajustarQuantidades(tipo);
    }
}

carregarMapaSala();