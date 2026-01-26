// Carregar Filmes
async function carregarFilmes() {
    try {
        const resposta = await fetch("../data/catalogo_salas.json");
        const cinema = await resposta.json();

        let todosFilmes = [];
        let nomesRep = new Set();

        // Listar sem repetir
        cinema.forEach(sala => {
            if (sala.Filmes && sala.Filmes[0]) {
                const filmesDaSala = sala.Filmes[0];

                for (let nome in filmesDaSala) {
                    const filme = filmesDaSala[nome];

                    if (!nomesRep.has(nome)) {
                        nomesRep.add(nome);
                        todosFilmes.push({ nome, ...filme });
                    }
                }
            }
        });

        // Cards
        renderizarCardsUnicos(todosFilmes, "lista-filmes-id");
        
        // Carrossel
        renderizarCarrossel(todosFilmes);

    } catch (erro) {
        console.error("Erro ao carregar JSON:", erro);
    }
}

// Cards sem Repetir 
function renderizarCardsUnicos(filmes, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    filmes.forEach(filme => {
        const classificacao = filme.Classificação[0];

        container.innerHTML += `
            <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                <div class="card filme-card h-100 shadow">
                    <a href="detalhes.html?filme=${encodeURIComponent(filme.nome)}">
                        <img src="${filme.Poster}" class="card-img-top" alt="${filme.nome}">
                    </a>
                    <div class="card-body d-flex flex-column">
                        <a href="detalhes.html?filme=${encodeURIComponent(filme.nome)}">
                            <h5 class="card-title fw-semibold">${filme.nome}</h5>
                        </a>
                        <p class="text-white small mb-1">${filme.Gênero.join(" • ")}</p>
                        <p class="text-white small mb-1">${filme.Duração}</p>
                        <span class="badge ${classificacao.cor} align-self-start mb-3">
                            ${classificacao.Idade}
                        </span>
                        <a href="detalhes.html?filme=${encodeURIComponent(filme.nome)}" 
                           class="btn btn-secondary mt-auto">
                            Comprar ingresso
                        </a>
                    </div>
                </div>
            </div>
        `;
    });
}

// Carrossel 
function renderizarCarrossel(filmes) {
    const carouselInner = document.getElementById("carousel-inner");
    const carouselIndicators = document.getElementById("carousel-indicators");
    
    if (!carouselInner || !carouselIndicators) return;

    let htmlItens = "";
    let htmlIndicadores = "";
    let ativo = true;
    let contador = 0;

    filmes.forEach(filme => {

        if (filme.Destaque === true) {
            htmlItens += `
                <div class="carousel-item ${ativo ? 'active' : ''}">
                    <a href="detalhes.html?filme=${encodeURIComponent(filme.nome)}">
                        <img src="${filme["Img Destaque"]}" class="d-block w-100" alt="${filme.nome}">
                    </a>
                    <div class="carousel-caption d-none d-md-block">
                        <h5 class="mx-0 mb-4 text-info fw-bold">${filme.nome}</h5>
                    </div>
                </div>
            `;

            htmlIndicadores += `
                <button type="button" data-bs-target="#carouselExampleCaptions" 
                    data-bs-slide-to="${contador}" 
                    class="${ativo ? 'active' : ''}" 
                    aria-current="${ativo ? 'true' : 'false'}" 
                    aria-label="Slide ${contador + 1}">
                </button>
            `;

            ativo = false; 
            contador++;
        }
    });

    carouselInner.innerHTML = htmlItens;
    carouselIndicators.innerHTML = htmlIndicadores;
}

badgeCarrinho();
carregarFilmes();

// Bagde Carrinho
function badgeCarrinho() {
    const badge = document.getElementById("bagde-carrinho");
    if (!badge) return;

    const carrinho = JSON.parse(localStorage.getItem("carrinho_cinema")) || [];
    const totalIngressos = carrinho.reduce((acc, item) => acc + item.assentos.length, 0);

    badge.innerText = totalIngressos;
    badge.style.display = totalIngressos === 0 ? "none" : "block";
}