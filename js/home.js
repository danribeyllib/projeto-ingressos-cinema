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

        renderizarCardsUnicos(todosFilmes, "lista-filmes-id");

    } catch (erro) {
        console.error("Erro ao carregar JSON:", erro);
    }
}

// Cards sem Repetir 
function renderizarCardsUnicos(filmes, containerId) {
    const container = document.getElementById(containerId);       //////////      ok      /////////
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

                        <p class="text-white small mb-1">
                            ${filme.Gênero.join(" • ")}
                        </p>

                        <p class="text-white small mb-1">
                             ${filme.Duração}
                        </p>

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

// Bagde Carrinho
function badgeCarrinho() {
    const badge = document.getElementById("bagde-carrinho");
    if (!badge) return;

    const carrinho = JSON.parse(localStorage.getItem("carrinho_cinema")) || [];
    const totalIngressos = carrinho.reduce((acc, item) => acc + item.assentos.length, 0);

    badge.innerText = totalIngressos;
    badge.style.display = totalIngressos === 0 ? "none" : "block";
}

badgeCarrinho();
carregarFilmes();