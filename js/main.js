/**
 * ============================================================
 * JOVEM LAB - main.js
 * Módulo Principal / Orquestrador
 * Responsabilidade: inicializar a aplicação, lógica de cada
 * página e comportamentos globais (navegação, scroll, etc.)
 * ============================================================
 */

// Aguarda o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', () => {

  // 1. Inicializa o banco de dados local
  DB.init();

  // 2. Detecta qual página está sendo exibida e executa a lógica correspondente
  const pagina = detectarPagina();

  switch (pagina) {
    case 'home':       inicializarHome();      break;
    case 'conteudos':  inicializarConteudos(); break;
    case 'detalhe':    inicializarDetalhe();   break;
    case 'cadastro':   inicializarCadastro();  break;
  }

  // 3. Componentes globais presentes em todas as páginas
  inicializarNavegacao();
  inicializarScrollTop();
  marcarNavAtiva();
});

// ============================================================
// DETECÇÃO DE PÁGINA
// ============================================================
function detectarPagina() {
  const path = window.location.pathname;
  if (path.includes('conteudos')) return 'conteudos';
  if (path.includes('detalhe'))   return 'detalhe';
  if (path.includes('cadastro'))  return 'cadastro';
  return 'home';
}

// ============================================================
// HOME — index.html
// ============================================================
function inicializarHome() {
  // Renderiza todos os conteúdos de destaque na home
  Cards.renderizarDestaques('cards-home');

  // Animação suave do hero
  const heroEls = document.querySelectorAll('.hero .animate-up');
  heroEls.forEach((el, i) => {
    el.style.opacity = '0';
    setTimeout(() => {
      el.style.opacity = '1';
    }, i * 150);
  });
}

// ============================================================
// CONTEÚDOS — conteudos.html
// ============================================================
function inicializarConteudos() {
  // Renderiza todos os conteúdos inicialmente
  Cards.renderizar(DB.getConteudos(), 'cards-conteudos');

  // ---- Filtros de categoria ----
  const filtros = document.querySelectorAll('.filtro-btn');
  filtros.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove classe ativo de todos
      filtros.forEach(b => b.classList.remove('ativo'));
      btn.classList.add('ativo');

      const cat = btn.getAttribute('data-cat');
      if (cat === 'todos') {
        Cards.renderizar(DB.getConteudos(), 'cards-conteudos');
      } else {
        Cards.renderizarPorCategoria(cat, 'cards-conteudos');
      }
    });
  });

  // ---- Busca ----
  const searchInput = document.getElementById('search-input');
  const searchBtn   = document.getElementById('search-btn');

  function executarBusca() {
    const termo = searchInput.value.trim();
    if (!termo) {
      Cards.renderizar(DB.getConteudos(), 'cards-conteudos');
      return;
    }
    // Resetar filtros
    filtros.forEach(b => b.classList.remove('ativo'));
    document.querySelector('[data-cat="todos"]')?.classList.add('ativo');
    Cards.renderizarBusca(termo, 'cards-conteudos');
  }

  searchBtn?.addEventListener('click', executarBusca);
  searchInput?.addEventListener('keydown', e => {
    if (e.key === 'Enter') executarBusca();
  });
  // Busca em tempo real ao digitar (debounce)
  let debounceTimer;
  searchInput?.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(executarBusca, 400);
  });
}

// ============================================================
// DETALHE — detalhe.html
// ============================================================
function inicializarDetalhe() {
  // Pega o ID da URL (?id=X)
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    window.location.href = 'conteudos.html';
    return;
  }

  const conteudo = DB.getConteudoPorId(id);
  if (!conteudo) {
    document.getElementById('detalhe-titulo').textContent = 'Conteúdo não encontrado';
    document.getElementById('detalhe-corpo').innerHTML = '<p>O conteúdo solicitado não existe ou foi removido.</p>';
    return;
  }

  // Preenche título da aba
  document.title = `${conteudo.titulo} | Jovem Lab`;

  // Preenche elementos da página
  _setText('detalhe-categoria',    conteudo.categoria);
  _setText('detalhe-titulo',       conteudo.titulo);
  _setText('detalhe-tempo',        `🕐 ${conteudo.tempoLeitura || '5 min'} de leitura`);
  _setText('detalhe-data',         `📅 ${formatarData(conteudo.dataPublicacao)}`);
  _setText('detalhe-autor',        `✍️ ${conteudo.autor}`);

  // Corpo do artigo (HTML já sanitizado no storage)
  const corpoEl = document.getElementById('detalhe-corpo');
  if (corpoEl) corpoEl.innerHTML = conteudo.conteudo;

  // Vídeo do YouTube (se houver)
  const videoEl = document.getElementById('detalhe-video');
  if (videoEl && conteudo.videoId) {
    videoEl.innerHTML = `
      <div class="video-wrapper">
        <iframe
          src="https://www.youtube.com/embed/${conteudo.videoId}"
          title="${conteudo.titulo}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          loading="lazy"
        ></iframe>
      </div>
    `;
  }

  // Cards relacionados (mesma categoria, exceto o atual)
  const relacionados = DB.getConteudosPorCategoria(conteudo.categoria)
    .filter(c => c.id !== conteudo.id)
    .slice(0, 3);
  if (relacionados.length > 0) {
    Cards.renderizar(relacionados, 'cards-relacionados');
    document.getElementById('relacionados-section')?.removeAttribute('hidden');
  }
}

// ============================================================
// CADASTRO — cadastro.html
// ============================================================
function inicializarCadastro() {
  const form     = document.getElementById('form-cadastro');
  const alertBox = document.getElementById('alert-cadastro');

  if (!form) return;

  // Renderiza usuários já cadastrados
  renderizarUsuarios();

  form.addEventListener('submit', e => {
    e.preventDefault();

    // Coleta dados
    const nome  = document.getElementById('campo-nome').value.trim();
    const email = document.getElementById('campo-email').value.trim();
    const senha = document.getElementById('campo-senha').value;
    const conf  = document.getElementById('campo-confirma').value;

    // Limpa erros anteriores
    limparErros();

    // Validação
    let valido = true;

    if (nome.length < 2) {
      mostrarErro('erro-nome', 'Informe seu nome completo.');
      valido = false;
    }

    if (!emailValido(email)) {
      mostrarErro('erro-email', 'Informe um e-mail válido.');
      valido = false;
    }

    if (senha.length < 6) {
      mostrarErro('erro-senha', 'A senha deve ter pelo menos 6 caracteres.');
      valido = false;
    }

    if (senha !== conf) {
      mostrarErro('erro-confirma', 'As senhas não coincidem.');
      valido = false;
    }

    if (!valido) return;

    // Cadastra no banco local
    const resultado = DB.cadastrarUsuario({ nome, email, senha });

    if (resultado.ok) {
      exibirAlerta('sucesso', `✅ ${resultado.msg} Bem-vindo(a), ${nome}!`);
      form.reset();
      renderizarUsuarios();
    } else {
      exibirAlerta('erro', `❌ ${resultado.msg}`);
    }
  });

  // Helpers de formulário
  function mostrarErro(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.classList.add('visible');
    el.closest('.form-group')?.querySelector('input')?.classList.add('error');
  }

  function limparErros() {
    document.querySelectorAll('.form-error').forEach(el => {
      el.classList.remove('visible');
    });
    document.querySelectorAll('.form-input').forEach(el => {
      el.classList.remove('error');
    });
    if (alertBox) alertBox.className = 'alert';
  }

  function exibirAlerta(tipo, msg) {
    if (!alertBox) return;
    alertBox.textContent = msg;
    alertBox.className = `alert ${tipo}`;
    // Auto-esconde sucesso após 5 segundos
    if (tipo === 'sucesso') {
      setTimeout(() => { alertBox.className = 'alert'; }, 5000);
    }
  }

  function renderizarUsuarios() {
    const lista   = document.getElementById('lista-usuarios');
    const secao   = document.getElementById('secao-usuarios');
    const usuarios = DB.getUsuarios();

    if (!lista || !secao) return;

    if (usuarios.length === 0) {
      secao.hidden = true;
      return;
    }

    secao.hidden = false;
    lista.innerHTML = usuarios.map(u => `
      <li class="usuario-item">
        <div class="usuario-avatar">${u.nome.charAt(0).toUpperCase()}</div>
        <div>
          <strong>${u.nome}</strong><br>
          <span style="font-size:.75rem">${u.email}</span>
        </div>
      </li>
    `).join('');
  }
}

// ============================================================
// NAVEGAÇÃO MOBILE (hamburguer)
// ============================================================
function inicializarNavegacao() {
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');

  toggle?.addEventListener('click', () => {
    links?.classList.toggle('open');
  });

  // Fecha o menu ao clicar em um link
  links?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
}

// ============================================================
// BOTÃO ROLAR AO TOPO
// ============================================================
function inicializarScrollTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visivel', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================================
// MARCA LINK ATIVO NA NAV CONFORME URL ATUAL
// ============================================================
function marcarNavAtiva() {
  const links  = document.querySelectorAll('.nav-link');
  const atual  = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const pagHref = href.split('/').pop();
    if (
      pagHref === atual ||
      (atual === '' && pagHref === 'index.html') ||
      (atual === 'index.html' && pagHref === 'index.html')
    ) {
      link.classList.add('ativo');
    }
  });
}

// ============================================================
// UTILITÁRIOS
// ============================================================

/** Verifica se um email é válido */
function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Formata data ISO para DD/MM/AAAA */
function formatarData(iso) {
  if (!iso) return '';
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}

/** Define texto de um elemento pelo ID */
function _setText(id, texto) {
  const el = document.getElementById(id);
  if (el) el.textContent = texto;
}

// ============================================================
// SLIDES MÚLTIPLOS
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('.slider-artigo').forEach(slider => {
    const slides = slider.querySelectorAll('.slide');
    let index = 0;

    slides.forEach((slide, i) => {
      slide.style.display = i === 0 ? 'block' : 'none';
    });

    setInterval(() => {
      slides[index].style.display = 'none';
      index = (index + 1) % slides.length;
      slides[index].style.display = 'block';
    }, 3000);
  });

});