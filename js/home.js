// Carregar JSON //
async function carregarFilmes() {
  try {
    const res = await fetch("../data/catalogo_salas.json");
    const cinema = await res.json();

    const filmes = cinema[0].Filmes[0];
    renderizarCards(filmes);

  } catch (erro) {
    console.error("Erro ao carregar JSON:", erro);
  }
}

function renderizarCards(filmes) {
  const container = document.getElementById("lista-filmes");
  container.innerHTML = "";

  for (let nome in filmes) {
    const filme = filmes[nome];
    const classificacao = filme.Classificação[0];

    container.innerHTML += `
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <div class="card movie-card h-100 shadow">

          <img src="${filme.Poster}" class="card-img-top" alt="${nome}">

          <div class="card-body d-flex flex-column">
            <h5 class="card-title fw-semibold">${nome}</h5>

            <p class="text-secondary small mb-1">
              ${filme.Gênero.join(" • ")}
            </p>

            <p class="text-secondary small mb-1">
              <i class="bi bi-stopwatch-fill"></i> ${filme.Duração}
            </p>

            <span class="badge ${classificacao.cor} align-self-start mb-3">
              ${classificacao.Idade}
            </span>

            <a href="detalhes.html?id=${filme.id}" 
               class="btn btn-outline-info mt-auto">
              Comprar ingresso
            </a>
          </div>

        </div>
      </div>
    `;
  }
}

carregarFilmes();



