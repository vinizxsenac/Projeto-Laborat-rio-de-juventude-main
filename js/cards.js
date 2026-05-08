/**
 * ============================================================
 * JOVEM LAB - cards.js
 * Módulo de Renderização de Cards
 * Responsabilidade: criar e exibir cards dinamicamente no DOM
 * ============================================================
 */

const Cards = {

  // ----------------------------------------------------------
  // Renderiza lista de cards em um container
  // @param conteudos  Array de objetos de conteúdo
  // @param containerId  ID do elemento onde inserir
  // @param limite  Número máximo de cards (0 = todos)
  // ----------------------------------------------------------
  renderizar(conteudos, containerId, limite = 0) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const lista = limite > 0 ? conteudos.slice(0, limite) : conteudos;

    if (lista.length === 0) {
      container.innerHTML = this._emptyState();
      return;
    }

    container.innerHTML = lista.map((c, i) => this._templateCard(c, i)).join('');

    // Adiciona event listeners nos botões "Ver mais"
    container.querySelectorAll('[data-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        // Redireciona para a página de detalhe com o ID na URL
        window.location.href = `detalhe.html?id=${id}`;
      });
    });
  },

  // ----------------------------------------------------------
  // Renderiza apenas os cards em destaque (destaque: true)
  // ----------------------------------------------------------
  renderizarDestaques(containerId) {
    const destaques = DB.getConteudos().filter(c => c.destaque);
    this.renderizar(destaques, containerId);
  },

  // ----------------------------------------------------------
  // Renderiza cards por categoria
  // ----------------------------------------------------------
  renderizarPorCategoria(categoria, containerId) {
    const filtrados = DB.getConteudosPorCategoria(categoria);
    this.renderizar(filtrados, containerId);
  },

  // ----------------------------------------------------------
  // Renderiza cards de busca
  // ----------------------------------------------------------
  renderizarBusca(termo, containerId) {
    const resultados = DB.buscarConteudos(termo);
    this.renderizar(resultados, containerId);
  },

  // ----------------------------------------------------------
  // Template HTML de um card
  // ----------------------------------------------------------
  _templateCard(c, index) {
    const delay = Math.min(index * 0.1, 0.5);
    return `
      <article
        class="card ${c.cor || ''} animate-up"
        style="animation-delay:${delay}s; opacity:0;"
        role="article"
      >
      <div class="card-thumb">

      ${
        c.imagens && c.imagens.length > 0
          ? `
            <div class="card-slider" data-index="0">
              ${c.imagens.map(img => `
                <img src="${img}" class="slide" />
              `).join('')}
            </div>
          `
          : c.imagem
            ? `<img src="${c.imagem}" class="card-img" />`
            : `<div class="card-thumb">

  ${
    c.iconeImg
      ? `<img src="${c.iconeImg}" class="card-icon-img">`
      : `<div class="card-thumb-placeholder">${c.icone || '📰'}</div>`
  }

  <span class="card-category-badge">${c.categoria}</span>
</div>`
      }
    
      <span class="card-category-badge">${c.categoria}</span>
    </div>
        <div class="card-body">
          <h3 class="card-title">${this._escaparHtml(c.titulo)}</h3>
          <p class="card-desc">${this._escaparHtml(c.descricao)}</p>
          <div class="card-footer">
            <span class="card-meta">
              🕐 ${c.tempoLeitura || '5 min'}
            </span>
            <button
              class="card-btn"
              data-id="${c.id}"
              aria-label="Ver mais sobre ${this._escaparHtml(c.titulo)}"
            >
              Ver mais →
            </button>
          </div>
        </div>
      </article>
    `;
  },

  // Estado vazio quando não há resultados
  _emptyState() {
    return `
      <div class="empty-state" style="grid-column:1/-1;">
        <div class="emoji">🔍</div>
        <h3>Nenhum conteúdo encontrado</h3>
        <p>Tente buscar por outro termo ou categoria.</p>
      </div>
    `;
  },

  // Escapa caracteres HTML para evitar XSS
  _escaparHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }
};

window.Cards = Cards;
