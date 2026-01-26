function formatarDataBR(dataString) {
    if (!dataString) return "";

    const data = new Date(dataString.replace(/-/g, '\/'));
    return data.toLocaleDateString('pt-BR');
};

function geraringressos() {
    const containeringressos = document.getElementById("container-ingressos"); 
    if (!containeringressos) return;

    const comprados = JSON.parse(localStorage.getItem("itens_comprados")) || [];
    
    const nomesSalas = {
        1: "A",
        2: "B",
        3: "C",
        4: "D"
    };

    if (comprados.length === 0) {
        containeringressos.innerHTML = `<p class="text-white">Nenhum ingresso encontrado.</p>`;
        return;
    }

    containeringressos.innerHTML = comprados.map(item => {
        const salaLetra = nomesSalas[item.salaId] || item.salaId;
        
        const codigoExibicao = item.codigoReserva || `${salaLetra}${item.hora.replace(':', '')}`;

        return `
            <div class="ingresso mb-4">
                <div class="ingresso-info">
                    <div>
                        <div class="ingressos-label text-info">Filme</div>
                        <h2 class="fw-bold text-warning text-uppercase">${item.filme}</h2>
                    </div>
                    <div class="row-info">
                        <div>
                            <div class="ingressos-label text-info">Data</div>
                            <div class="ingressos-info text-white">${formatarDataBR(item.data)}</div>
                        </div>
                        <div>
                            <div class="ingressos-label text-info">Horário</div>
                            <div class="ingressos-info text-white">${item.hora}</div>
                        </div>
                        <div>
                            <div class="ingressos-label text-info">Sala</div>
                            <div class="ingressos-info text-white">${salaLetra}</div>
                        </div>
                    </div>
                </div>
                <div class="ingresso-stub">
                    <div class="ingressos-label text-info">Assentos</div>
                    <div class="assento-info ingressos-info text-warning">${item.assentos.join(", ")}</div>
                    <div class="ingressos-label text-secondary">${item.assentos.length} Ingressos</div>
                    
                    <div class="text-warning fw-semibold codigo-ingresso">
                        <div class="ingressos-label text-info">Código:</div>
                        ${codigoExibicao}
                    </div>
                </div>
            </div>
        `;
    }).join("");
}

// Bagde Carrinho
function badgeCarrinho() {
    const badge = document.getElementById("bagde-carrinho");
    if (!badge) return;

    const carrinho = JSON.parse(localStorage.getItem("carrinho_cinema")) || [];
    const totalIngressos = carrinho.reduce((acc, item) => acc + item.assentos.length, 0);

    badge.innerText = totalIngressos;
    badge.style.display = totalIngressos === 0 ? "none" : "block";
};

badgeCarrinho()

document.addEventListener("DOMContentLoaded", geraringressos);