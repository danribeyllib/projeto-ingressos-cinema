// URL
const params = new URLSearchParams(window.location.search);
const idFilme = Number(params.get("id"));

async function carregarDetalhes() {
  try {
    const resposta = await fetch("../data/catalogo_salas.json");
    const cinema = await resposta.json();

    let salaEncontrada = null;
    let filmeEncontrado = null;
    let nomeFilme = "";

    for (let sala of cinema) {
      const filmesObj = sala.Filmes[0];

      for (let nome in filmesObj) {
      
        if (filmesObj[nome].id === idFilme) {
          salaEncontrada = sala;
          filmeEncontrado = filmesObj[nome];
          nomeFilme = nome;
        }
      }
    }

    if (!filmeEncontrado) return;

    renderizarDetalhes(nomeFilme, filmeEncontrado, salaEncontrada);

  } catch (erro) {
    console.error("Erro ao carregar dados:", erro);
  }
}

carregarDetalhes();

function renderizarDetalhes(nome, filme, sala) {
  const container = document.getElementById("detalhes-filme");

  container.innerHTML = `
    <div class="col-lg-4 mb-4 text-center">
      <div class="p-2">
        <img src="${filme.Poster}" class="img-fluid poster-filme" alt="${nome}">
      </div>
    </div>

    <div class="resumo col-lg-8">
      <div class="d-flex align-items-center gap-2 mb-2">
        <span class="tag ${filme.Classificação[0].cor} shadow-sm">
          ${filme.Classificação[0].Idade}
        </span>
        <span class="badge rounded-pill bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3">
          ${filme.Duração}
        </span>
      </div>

      <p class="mt-4 text-secondary small">Sala: <span class="text-white fw-semibold">${sala.Sala}</span> • Título Original: ${filme["Título Original"]}</p>
      <h1 class="titulo-filme display-4 fw-semibold mb-3" style="letter-spacing: -1px;">${nome}</h1>
    
      <div class="card-info-filme p-4 mb-5 shadow-sm">
        <div class="row g-5">
          <div class="col-md-3">
            <label class="d-block text-secondary small fw-bold text-uppercase">Direção</label>
            <span class="text-white fw-medium">${filme.Direção}</span>
          </div>
          <div class="col-md-3">
            <label class="d-block text-secondary small fw-bold text-uppercase">Gênero</label>
            <span class="text-white fw-medium">${filme.Gênero.join(", ")}</span>
          </div>
          <div class="col-md-3">
            <label class="d-block text-secondary small fw-bold text-uppercase">Ingresso</label>
            <span class="text-info fs-5 fw-bold">
              R$ ${filme.Ingresso.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div class="col-md-3">
            <label class="d-block text-secondary small fw-bold text-uppercase">Meia Entrada</label>
            <span class="text-info fs-5 fw-bold">
              R$ ${(filme.Ingresso / 2).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      <p class="descricao mb-4">${filme.Sinópse}</p>

      <div class="horarios bg-opacity-25 p-4 rounded-4 border border-secondary border-opacity-10">
        <h5 class="fw-bold text-white mb-4 d-flex align-items-center">
          <span class="me-2" style="width: 10px; height: 24px; background: var(--accent-color); display: inline-block; border-radius: 4px;"></span>
          HORÁRIOS DISPONÍVEIS
        </h5>

        ${Object.entries(filme.Idiomas).map(([idioma, horas]) => `
          <div class="mb-4">
            <h6 class="titulo-sessao fw-bold mb-3">${idioma.toUpperCase()}</h6>
            <div class="d-flex flex-wrap gap-3">
              ${horas.map(h => `
                <a href="assentos.html?id=${filme.id}&hora=${h}&sala=${sala.id}" 
                   class="btn btn-sessao shadow-sm">
                  ${h}
                </a>
              `).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

