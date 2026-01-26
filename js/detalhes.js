// URL
const params = new URLSearchParams(window.location.search);

// Globais
let dataSelecionada = "";
let salasGlobais = [];
let precoGlobal = 0;

// Dados
async function carregarDetalhesFilme() {
  const nomeFilmeUrl = params.get("filme");

  if (!nomeFilmeUrl) return;

  try {
    const resposta = await fetch("../data/catalogo_salas.json");
    const cinema = await resposta.json();

    let filmeEncontrado = null;
    salasGlobais = [];

    cinema.forEach(sala => {
      if (sala.Filmes && sala.Filmes[0]) {
        const filmesDaSala = sala.Filmes[0];

        if (filmesDaSala[nomeFilmeUrl]) {
          filmeEncontrado = filmesDaSala[nomeFilmeUrl];
          precoGlobal = filmeEncontrado.Ingresso;

          salasGlobais.push({
            salaId: sala.id,
            salaNome: sala.Sala,
            idiomas: filmeEncontrado.Idiomas,
            filmeId: filmeEncontrado.id
          });
        }
      }
    });

    if (filmeEncontrado) {
      if (!dataSelecionada) {
        const datasIniciais = gerarDatasSemanas();
        dataSelecionada = datasIniciais[0].valor;
      }

      renderizarDetalhes(nomeFilmeUrl, filmeEncontrado);
      renderizarSelecaoData();
      renderizarSessoes();
    }

  } catch (erro) {
    console.error("Erro ao carregar dados:", erro);
  }
}

// Fuso local
function gerarDatasSemanas() {
  const datas = [];
  const hoje = new Date();
  const opcoes = { weekday: 'short', day: '2-digit', month: '2-digit' };

  console.log("Hoje:", hoje);

  for (let i = 0; i < 7; i++) {
    const dataFutura = new Date(hoje);
    dataFutura.setDate(hoje.getDate() + i);

    console.log("Datas Futuras:", dataFutura);

    const dataFormatada = dataFutura.toLocaleDateString('pt-BR', opcoes);

    const ano = dataFutura.getFullYear();
    const mes = String(dataFutura.getMonth() + 1).padStart(2, '0');
    const dia = String(dataFutura.getDate()).padStart(2, '0');
    const valorLocal = `${ano}-${mes}-${dia}`;

    datas.push({
      exibir: dataFormatada.replace('.', ''),
      valor: valorLocal
    });
  }
  return datas;
}

// Verificar horário
function verificarSessaoPassou(dataAMD, horaString) {
  const agora = new Date();
  const [ano, mes, dia] = dataAMD.split('-').map(Number);
  const [horas, minutos] = horaString.split(':').map(Number);

  // fuso local
  const dataSessao = new Date(ano, mes - 1, dia, horas, minutos, 0);
  console.log("Datas e horas:", dataSessao);

  return agora > dataSessao;
}

// Renderizar detalhes filme
function renderizarDetalhes(nome, filme) {
  const container = document.getElementById("detalhes-filme");
  if (!container) return;

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

      <p class="mt-4 text-white small"><span class="fw-bold">Título Original:</span> ${filme["Título Original"]}</p>
      <h1 class="titulo-filme display-5 fw-semibold mb-4">${nome}</h1>
    
      <div class="card-info-filme p-4 mb-5 shadow-sm">
        <div class="row g-5">
          <div class="col-md-3">
            <label class="info-filme-label d-block text-white small fw-bold text-uppercase">Direção</label>
            <span class="text-white fw-medium">${filme.Direção}</span>
          </div>
          <div class="col-md-3">
            <label class="info-filme-label d-block text-white small fw-bold text-uppercase">Gênero</label>
            <span class="text-white fw-medium">${filme.Gênero.join(", ")}</span>
          </div>
          <div class="col-md-3">
            <label class="info-filme-label d-block text-white small fw-bold text-uppercase">Ingresso</label>
            <span class="text-info fs-5 fw-bold">
              R$ ${filme.Ingresso.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div class="col-md-3">
            <label class="info-filme-label d-block text-white small fw-bold text-uppercase">Meia Entrada</label>
            <span class="text-info fs-5 fw-bold">
              R$ ${(filme.Ingresso / 2).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      <p class="descricao mb-4">${filme.Sinópse}</p>

      <div class="horarios bg-opacity-25 p-4 rounded-4 border border-white border-opacity-10">
        <h5 class="fw-bold text-white mb-4 d-flex align-items-center">
          <span class="me-2"></span>
          Sessões
        </h5>

        <div id="container-datas" class="d-flex flex-wrap gap-2 mb-4"></div>

        <hr class="border-white opacity-25 mb-4">

        <div id="lista-sessoes">
          </div>
      </div>
    </div>
    `;
}

function renderizarSessoes() {
  const containerSessoes = document.getElementById("lista-sessoes");
  if (!containerSessoes) return;

  containerSessoes.innerHTML = salasGlobais.map(s => `
        <div class="lista-sessoes-sala mb-5 p-3 rounded-3">
          <h6 class="text-info mb-3">SALA ${s.salaNome}</h6>
          ${Object.entries(s.idiomas).map(([idioma, horas]) => `
            <div class="mb-3">
              <p class="text-white small fw-bold mb-2">${idioma.toUpperCase()}</p>
              <div class="d-flex flex-wrap gap-3">
                ${horas.map(h => {

                 const sessaoEncerrada = verificarSessaoPassou(dataSelecionada, h);

                      return `
                        <button 
                          type="button"
                          class="btn btn-sessao shadow-sm ${sessaoEncerrada ? 'sessao-encerrada' : ''}" 
                          ${sessaoEncerrada ? 'disabled' : ''}
                          onclick="${sessaoEncerrada ? 'return false;' : `irParaEscolhaAssentos('${s.filmeId}', '${h}', '${s.salaId}', '${precoGlobal}')`}">
                          ${h}
                        </button>
                      `;
                     }).join("")}

              </div>
            </div>
          `).join("")}
        </div>
    `).join("");
}

// Renderizar Datas
function renderizarSelecaoData() {
  const containerDatas = document.getElementById("container-datas");

  if (!containerDatas) return;
  const datas = gerarDatasSemanas();
  containerDatas.innerHTML = "";

  datas.forEach((data) => {
    const btn = document.createElement("button");

    btn.className = "btn btn-outline-info btn-sm px-3";
    btn.innerText = data.exibir;

    // Botão sessão (data)
    if (dataSelecionada === data.valor) {
      btn.classList.add("active");
    }

    btn.onclick = () => {
      document.querySelectorAll("#container-datas .btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      dataSelecionada = data.valor;
      renderizarSessoes();
    };

    containerDatas.appendChild(btn);
  });
}

// Pág de escolha de Assentos
function irParaEscolhaAssentos(filmeId, hora, salaId, preco) {
  if (verificarSessaoPassou(dataSelecionada, hora)) {
    return;
  }

  const nomeFilme = params.get("filme");
  // URL com o nome filme
  const url = `assentos.html?id=${filmeId}&sala=${salaId}&hora=${hora}&data=${dataSelecionada}&preco=${preco}&nome=${encodeURIComponent(nomeFilme)}`;
  window.location.href = url;
}

// Badge do Carrinho
function badgeCarrinho() {
  const badge = document.getElementById("bagde-carrinho");
  if (!badge) return;

  const carrinho = JSON.parse(localStorage.getItem("carrinho_cinema")) || [];
  const totalIngressos = carrinho.reduce((acc, item) => acc + item.assentos.length, 0);

  badge.innerText = totalIngressos;
  badge.style.display = totalIngressos === 0 ? "none" : "block"; ///////////////////// ok  //
}

badgeCarrinho();
carregarDetalhesFilme();