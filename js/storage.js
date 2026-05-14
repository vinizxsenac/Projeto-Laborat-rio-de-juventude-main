/**
 * ============================================================
 * JOVEM LAB - storage.js
 * Módulo de Banco de Dados Local (LocalStorage)
 * Responsabilidade: toda leitura/escrita de dados persistidos
 * ============================================================
 */

const DB = {
  // Chaves usadas no LocalStorage
  KEYS: {
    USUARIOS:  'jovemlab_usuarios',
    CONTEUDOS: 'jovemlab_conteudos',
    INICIADO:  'jovemlab_db_init'
  },

  // ----------------------------------------------------------
  // INICIALIZAÇÃO
  // Popula o banco com dados exemplo se ainda não existir
  // ----------------------------------------------------------
  init() {
    // 🔥 MODO DESENVOLVIMENTO (sempre atualiza)
    this._salvarConteudos(this._dadosIniciais());
    this._salvarUsuarios([]);
  
    console.log('[JovemLab DB] Atualizado automaticamente.');
  },

  // ----------------------------------------------------------
  // USUÁRIOS
  // ----------------------------------------------------------

  /** Retorna lista de todos os usuários */
  getUsuarios() {
    return JSON.parse(localStorage.getItem(this.KEYS.USUARIOS) || '[]');
  },

  /** Cadastra novo usuário. Retorna {ok, msg} */
  cadastrarUsuario({ nome, email, senha }) {
    const usuarios = this.getUsuarios();
    if (usuarios.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, msg: 'Este e-mail já está cadastrado.' };
    }
    const novoUsuario = {
      id:      Date.now(),
      nome:    nome.trim(),
      email:   email.trim().toLowerCase(),
      // Em produção, NUNCA armazene senha em texto claro — use hash
      senha:   btoa(senha),
      dataCadastro: new Date().toISOString()
    };
    usuarios.push(novoUsuario);
    this._salvarUsuarios(usuarios);
    return { ok: true, msg: 'Cadastro realizado com sucesso!', usuario: novoUsuario };
  },

  /** Busca usuário por email */
  buscarUsuarioPorEmail(email) {
    return this.getUsuarios().find(u => u.email === email.toLowerCase()) || null;
  },

  _salvarUsuarios(lista) {
    localStorage.setItem(this.KEYS.USUARIOS, JSON.stringify(lista));
  },

  // ----------------------------------------------------------
  // CONTEÚDOS
  // ----------------------------------------------------------

  /** Retorna todos os conteúdos */
  getConteudos() {
    return JSON.parse(localStorage.getItem(this.KEYS.CONTEUDOS) || '[]');
  },

  /** Filtra conteúdos por categoria. '' ou 'todos' retorna todos */
  getConteudosPorCategoria(categoria) {
    const todos = this.getConteudos();
    if (!categoria || categoria === 'todos') return todos;
    return todos.filter(c => c.categoria.toLowerCase() === categoria.toLowerCase());
  },

  /** Busca conteúdo por ID */
  getConteudoPorId(id) {
    return this.getConteudos().find(c => c.id === Number(id)) || null;
  },

  /** Busca textual em título e descrição */
  buscarConteudos(termo) {
    const t = termo.toLowerCase();
    return this.getConteudos().filter(c =>
      c.titulo.toLowerCase().includes(t) ||
      c.descricao.toLowerCase().includes(t) ||
      c.categoria.toLowerCase().includes(t)
    );
  },

  _salvarConteudos(lista) {
    localStorage.setItem(this.KEYS.CONTEUDOS, JSON.stringify(lista));
  },

  // ----------------------------------------------------------
  // DADOS INICIAIS DE EXEMPLO
  // ----------------------------------------------------------
  _dadosIniciais() {
    return [
      // ---- VAGAS E TRABALHOS --------------------------------
      {
        id: 1,
        titulo: 'Mentir no Curriculo vale a pena?',
        descricao: 'Há casos em que mentir no currículo é crime, mas não é a regra.',
        categoria: 'Curriculo',
        icone: '📋🎯',
        cor: 'cat-curriculo',
        destaque: true,
        dataPublicacao: '2026-04-13',
        tempoLeitura: '7 min',
        autor: 'Lucas Henrique',
        conteudo: `
        <div class="slide-lucas">  
          <p>"Mentir no currículo pode parecer uma saída rápida, mas os riscos são altos. Entenda por que a honestidade é sempre a melhor estratégia e como valorizar suas habilidades sem precisar inventar experiências."</p>

          <h3>Porque mentir no curriculo pode ser prejudicial<\h3>
          
          <p>Mentir no currículo pode parecer, à primeira vista, uma solução rápida para aumentar as chances de conseguir um emprego, mas essa prática traz consequências sérias, tanto do ponto de vista ético quanto profissional. Em um mercado de trabalho cada vez mais competitivo e transparente, a honestidade deixou de ser apenas uma virtude moral e passou a ser um requisito estratégico para construir uma carreira sólida e sustentável.</p>
        

          <div class="destaque-box"><p>💡 <strong>Dica:</strong> Em primeiro lugar, é importante entender que o currículo é, essencialmente, um retrato profissional.</p></div>

          <h2>Por que eu não mentiria no curriculo?</h2>
          <p>Ele representa não apenas suas experiências e habilidades, mas também sua credibilidade. Quando alguém inclui informações falsas — como cursos que nunca fez, cargos que nunca ocupou ou habilidades que não domina — está criando uma base frágil para sua trajetória. Mesmo que a mentira ajude a conquistar uma vaga inicialmente, ela dificilmente se sustenta ao longo do tempo. Processos seletivos modernos frequentemente incluem etapas de verificação, como checagem de referências, testes práticos e validação de certificados, o que aumenta significativamente o risco de a falsidade ser descoberta.</p>
        
          <h2>E se eu conseguir o emprego?</h2>
          <p>Outro ponto relevante é o impacto interno dessa prática. Sustentar uma mentira exige esforço constante: a pessoa precisa lembrar do que disse, evitar contradições e, muitas vezes, lidar com tarefas para as quais não está preparada. Isso gera ansiedade, insegurança e estresse, prejudicando o desempenho e o bem-estar no ambiente de trabalho. Em contraste, a honestidade permite que o profissional atue com mais confiança, reconhecendo suas limitações e buscando aprendizado real.</p>
          <a href="https://www.jusbrasil.com.br/artigos/mentir-no-curriculo-e-crime/869996185?msockid=1cd652b61db066c424a4458b19b06d3a" target="_blank">
          <img src="jovem-lab/assets/images/slidelucas.png" alt="curriculo" style="width:100%; border-radius:10px; margin:20px 0;">
        </div>  
          `
      },
      {
        id: 2,
        titulo: 'Dicas de Ética e conduta no mundo do trabalho',
        descricao: "Entenda a importância da ética e da boa conduta no ambiente de trabalho. Saiba como atitudes profissionais, respeito e responsabilidade podem fortalecer sua imagem e abrir portas na sua carreira.",
        categoria: 'Dicas',
        icone: '🧠⚖️',
        cor: 'cat-dicas',
        destaque: false,
        dataPublicacao: '2026-04-13',
        tempoLeitura: '5 min',
        autor: 'Ana Clara e Arnold',
        conteudo: `
        <div class="slide-arnold">  
          <a href="https://www.linkedin.com/pulse/como-adotar-um-comportamento-%C3%A9tico-trabalho-veja-11-dicas-kiko-campos/" target="_blank">
            <img src="jovem-lab/assets/images/slidearnoldeanaclara.png">
        </div>
        `
      },

      {
        id: 3,
        titulo: 'Dicas para um curriculo melhor',
        descricao: 'Descubra dicas essenciais para criar um currículo claro, organizado e profissional. Aprenda a destacar suas habilidades e experiências para aumentar suas chances no mercado de trabalho.',
        categoria: 'Curriculo',
        icone: '📄🚀',
        cor: 'cat-curriculo',
        destaque: true,
        dataPublicacao: '2026-04-13',
        tempoLeitura: '2 min',
        autor: 'Vivian',
        conteudo: `
        <div class="slide-vivian">  
          <img src="jovem-lab/assets/images/SlideVivian1.png" alt="DicasVivian1" style="width:100%; border-radius:10px; margin:20px 0;">
        </div>
          `
      },
      {
        id: 4,
        titulo: 'Comportamento em uma entrevista de emprego',
        descricao: 'Saiba como se comportar em uma entrevista de emprego e causar uma boa impressão. Aprenda dicas essenciais sobre postura, comunicação e atitudes que podem aumentar suas chances de ser contratado.',
        categoria: 'Entrevistas',
        icone: '🗣️👔',
        cor: 'cat-entrevista',
        destaque: false,
        dataPublicacao: '2026-04-16',
        tempoLeitura: '4 min',
        autor: 'Kalebe',
        conteudo: `
        <div class="slides-kalebe">  
          <div class="slide-kalebe1">
            <img src="jovem-lab/assets/images/Slidekalebe1.jpg" alt="Dicas-kalebe">
          </div>
          <div class="slide-kalebe2">
            <a href="https://www.dicasdemulher.com.br/entrevista-de-emprego/" target="_blank">
            <img src="jovem-lab/assets/images/Slidekalebe2.jpg">
            </a>          
            </div>
          <div class="slide-kalebe3">
            <a href="https://ocurriculo.com.br/blog/segundo-estudos-aparencia-pode-impactar-entrevista-de-emprego" target="_blank">
            <img src="jovem-lab/assets/images/Slidekalebe3.jpg">
            </a>
        </div>
        `
      },

      {
        id: 5,
        titulo: 'Como ter controle emocional no trabalho',
        descricao: 'Controlar as emoções no trabalho é essencial para o sucesso. Veja como manter a calma, evitar atitudes impulsivas e se destacar com maturidade e inteligência emocional.',
        categoria: 'Dicas',
        icone: '🧘💼',
        cor: 'cat-dicas',
        destaque: true,
        dataPublicacao: '2026-04-17',
        tempoLeitura: '3 min',
        autor: 'Vinicius Gonçalves',
        conteudo: `
        <div class="slide-vinicius"  
          <a href="https://produtividadeemocional.com.br/controle-emocional-no-trabalho/" target="_blank">
          <img src="jovem-lab/assets/images/Slideviniciusg.png">
          </a>
        </div>
          `
      },
      {
        id: 6,
        titulo: 'Como encontrar o primeiro emprego',
        descricao: 'Impressões iniciais são duradouras. Veja como causar um ótimo impacto desde o começo.',
        categoria: 'Dicas',
        icone: '🚀💼',
        cor: 'cat-primeiro-emprego',
        destaque: false,
        dataPublicacao: '2026-04-17',
        tempoLeitura: '4 min',
        autor: 'Maria Clara e Ytallo',
        conteudo: `
        <div class="slide-ytallo">  
          <img src="jovem-lab/assets/images/slidemariaclaraeitallo.png">
          <a href="https://br.linkedin.com/" class="btn-link link1">Linkedin</a>
          <a href="https://login.infojobs.com.br/" class="btn-link link2">Info Jobs</a>
          <a href="https://www.catho.com.br/" class="btn-link link3">Catho</a>
          <a href="https://login.gupy.io/candidates/signin" class="btn-link link4">Gupy</a>
          <a href="https://br.indeed.com/" class="btn-link link5">Indeed</a>
        </div>        
          `
      
      },
      {
        id: 7,
        titulo: 'Quais cursos são mais valorizados pelas empresas',
        descricao: 'Descubra quais cursos são mais valorizados pelas empresas e aumente suas chances no mercado de trabalho. Conheça áreas em alta e veja como investir na sua qualificação pode fazer a diferença na sua carreira.',
        categoria: 'Curriculo',
        icone: '🗣️👔',
        cor: 'cat-curriculo',
        destaque: false,
        dataPublicacao: '2026-04-28',
        tempoLeitura: '7 min',
        autor: 'Davi Teixeira Granjeiro e Gabryel Barbosa Ramos e Silva',
        conteudo: `
        <div class="slides-davi">  
          <div class="slide-davi1">
            <img src="jovem-lab/assets/images/davi1.png" alt="curriculo-davi">
          </div>
          <div class="slide-davi2">
            <a href="https://querobolsa.com.br/revista/7-cursos-que-as-empresas-mais-pedem" target="_blank">
            <img src="jovem-lab/assets/images/davi2.png">
          </div>
          <div class="slide-davi3">
            <a href="https://querobolsa.com.br/revista/7-cursos-que-as-empresas-mais-pedem" target="_blank">
            <img src="jovem-lab/assets/images/davi3.png">
          </div>
          <div class="slide-davi4">
            <a href="https://querobolsa.com.br/revista/7-cursos-que-as-empresas-mais-pedem" target="_blank">
            <img src="jovem-lab/assets/images/davi4.png">
          </div>
          <div class="slide-davi5">
            <a href="https://querobolsa.com.br/revista/7-cursos-que-as-empresas-mais-pedem" target="_blank">
            <img src="jovem-lab/assets/images/davi5.png">
          </div>
          <div class="slide-davi6">
            <a href="https://querobolsa.com.br/revista/7-cursos-que-as-empresas-mais-pedem" target="_blank">
            <img src="jovem-lab/assets/images/davi6.png">
          </div>
          <div class="slide-davi7">
            <a href="https://querobolsa.com.br/revista/7-cursos-que-as-empresas-mais-pedem" target="_blank">
            <img src="jovem-lab/assets/images/davi7.png">
          </div>
          <div class="slide-davi8">
            <a href="https://querobolsa.com.br/revista/7-cursos-que-as-empresas-mais-pedem" target="_blank">
            <img src="jovem-lab/assets/images/davi8.png">
          </div>
          <div class="slide-davi9">
            <a href="https://querobolsa.com.br/revista/7-cursos-que-as-empresas-mais-pedem" target="_blank">
            <img src="jovem-lab/assets/images/davi9.png">
          </div>
          <div class="slide-davi10">
            <a href="https://querobolsa.com.br/revista/7-cursos-que-as-empresas-mais-pedem" target="_blank">
            <img src="jovem-lab/assets/images/davi10.png">
          </div>
          <div class="slide-davi11">
            <img src="jovem-lab/assets/images/davi11.png">
          </div>
          <div class="slide-davi12">
            <a href="https://www.df.senac.br" target="_blank">
            <img src="jovem-lab/assets/images/davi12.png">
          </div>
        `
      },
      {
        id: 8,
        titulo: 'Quiz sobre Empregabilidade',
        descricao: 'Teste se você está pronto para conquistar seu primeiro emprego e descubra o que o mercado realmente espera de você. Identifique seus pontos fortes, corrija falhas e saia na frente dos concorrentes.',
        categoria: 'Dicas',
        icone: '🧑‍💻 📊',
        cor: 'cat-dicas',
        destaque: false,
        dataPublicacao: '2026-04-28',
        tempoLeitura: '4 min',
        autor: 'Luiz Fernando e Victor Huggo',
        conteudo: `
        <div class="slide-quiz">
          <a href="https://forms.office.com/r/25n98XLjz8?origin=lprLink" target="_blank">
          <img src="jovem-lab/assets/images/slidequiz.jpg">
        </div>    
        `
      },
      {
      id: 9,
        titulo: 'O que fazer na entrevista de emprego?',
        descricao: 'Saiba como se preparar para uma entrevista de emprego, causar uma boa impressão e responder com confiança. Descubra dicas essenciais de comportamento, postura, comunicação e apresentação para aumentar suas chances de conquistar a vaga.',
        categoria: 'Entrevistas',
        icone: '👔🎯',
        cor: 'cat-entrevista',
        destaque: false,
        dataPublicacao: '2026-04-28',
        tempoLeitura: '4 min',
        autor: 'Amanda Vitória',
        conteudo: `
          <div class="slide-amanda1">
            <img src="jovem-lab/assets/images/amanda1.jpg">
          </div>
          <div classe="slide-amanda2">
            <img src="jovem-lab/assets/images/amanda2.jpg">
          </div>
          <div classe="slide-amanda3">
            <img src="jovem-lab/assets/images/amanda3.jpg">
          </div>
          <div classe="slide-amanda4">
            <img src="jovem-lab/assets/images/amanda4.jpg">
          </div>
          <div classe="slide-amanda5">
            <img src="jovem-lab/assets/images/amanda5.jpg">
          </div>
          <div classe="slide-amanda6">
            <img src="jovem-lab/assets/images/amanda6.jpg">
          </div>
          <div classe="slide-amanda7">
            <img src="jovem-lab/assets/images/amanda7.jpg">
          </div>
          <div classe="slide-amanda8">
            <img src="jovem-lab/assets/images/amanda8.jpg">
          </div>
          <div classe="slide-amanda9">
            <img src="jovem-lab/assets/images/amanda9.jpg">
          </div>
          <div classe="slide-amanda10">
            <img src="jovem-lab/assets/images/amanda10.jpg">
          </div>
          <div classe="slide-amanda11">
            <img src="jovem-lab/assets/images/amanda11.jpg">
          </div>
          <div classe="slide-amanda12">
            <img src="jovem-lab/assets/images/amanda12.jpg">
          </div>
          <div classe="slide-amanda13">
            <img src="jovem-lab/assets/images/amanda13.jpg">
          </div>
          <div classe="slide-amanda14">
            <img src="jovem-lab/assets/images/amanda14.jpg">
          </div>
          <div classe="slide-amanda15">
            <img src="jovem-lab/assets/images/amanda15.jpg">
          </div>
          <div classe="slide-amanda16">
            <img src="jovem-lab/assets/images/amanda16.jpg">
          </div>
          <div classe="slide-amanda17">
            <img src="jovem-lab/assets/images/amanda17.jpg">
          </div>
        `
      },
      {
        id: 10,
        titulo: '6 Profissões em Alta',
        descricao: 'Descubra quais são os 6 empregos em alta no mercado de trabalho e conheça as profissões que estão ganhando destaque em áreas como tecnologia, saúde, finanças e engenharia. Veja tendências, oportunidades e como se preparar para conquistar espaço nas carreiras mais promissoras de 2026.',
        categoria: 'Dicas',
        icone: '💼🏆',
        cor: 'cat-dicas',
        destaque: false,
        dataPublicacao: '2026-04-28',
        tempoLeitura: '4 min',
        autor: 'Isaac Samuel coelho pereira',
        conteudo: `
        <div class="slideisaac">
          <a href="https://revistadoestudante.com.br/as-10-carreiras-mais-promissoras-para-os-jovens-de-hoje/" target="_blank">
          <img src="jovem-lab/assets/images/slideisaac.jpg">
        </div>
        `
      },
      {
        id: 11,
        titulo: 'Cursos Gratuitos para alavancar sua carreira',
        descricao: 'Impulsione sua carreira com cursos gratuitos e desenvolva habilidades valorizadas pelo mercado.',
        categoria: 'Dicas',
        icone: '🚀 📚',
        cor: 'cat-dicas',
        destaque: false,
        dataPublicacao: '2026-04-28',
        tempoLeitura: '4 min',
        autor: 'Kamilly Cristine Mendes Cardoso',
        conteudo: `
        <div class="slide-kamilly">
          <div class="slide-kamilly1">
            <img src="jovem-lab/assets/images/kamilly1.jpg">
          </div>
           <div class="slide-kamilly2">
            <img src="jovem-lab/assets/images/kamilly2.jpg">
          </div>
           <div class="slide-kamilly3">
            <a href="https://orango.senac.br/" target="_blank">
            <img src="jovem-lab/assets/images/kamilly3.jpg">
          </div>
           <div class="slide-kamilly4">
            <a href="https://www.df.senac.br/" target="_blank">
            <img src="jovem-lab/assets/images/kamilly4.jpg">
          </div>
           <div class="slide-kamilly5">
            <a href="https://www.df.senac.br/" target="_blank">
            <img src="jovem-lab/assets/images/kamilly5.jpg">
          </div>
           <div class="slide-kamilly6">
            <a href="https://www.ev.org.br/" target="_blank">
            <img src="jovem-lab/assets/images/kamilly6.jpg">
          </div>
           <div class="slide-kamilly7">
            <a href="https://etcdf.com.br/" target="_blank">
            <img src="jovem-lab/assets/images/kamilly7.jpg">
          </div>
           <div class="slide-kamilly8">
            <img src="jovem-lab/assets/images/kamilly8.jpg">
          </div>
        `
      },
      {
        id: 12,
        titulo: 'Autores do site',
        descricao: 'Somos uma equipe apaixonada por tecnologia, inovação e desenvolvimento profissional, dedicada a criar soluções que aproximam pessoas das melhores oportunidades no mercado de trabalho. Nosso objetivo é tornar a empregabilidade mais acessível, oferecendo informações, recursos e ferramentas que ajudam candidatos a desenvolver habilidades, encontrar vagas e crescer profissionalmente.',
        categoria: 'Autores',
        icone: '🎓🏆',
        cor: 'cat-dicas',
        destaque: false,
        dataPublicacao: '2026-05-14',
        tempoLeitura: '10 min',
        autor: 'Turma de Aprendizagem 2026.08.53',
        conteudo: `
        `
      },
      {
        id: 13,
        titulo: 'Autores do site',
        descricao: 'Somos uma equipe apaixonada por tecnologia, inovação e desenvolvimento profissional, dedicada a criar soluções que aproximam pessoas das melhores oportunidades no mercado de trabalho. Nosso objetivo é tornar a empregabilidade mais acessível, oferecendo informações, recursos e ferramentas que ajudam candidatos a desenvolver habilidades, encontrar vagas e crescer profissionalmente.',
        categoria: 'Autores',
        icone: '🎓🏆',
        cor: 'cat-dicas',
        destaque: false,
        dataPublicacao: '2026-05-14',
        tempoLeitura: '10 min',
        autor: 'Turma de Aprendizagem 2026.08.53',
        conteudo: `
        <div class="Foto-autores">
          <div class="kamilly">
            <img src="jovem-lab/assets/images/kamillyfoto.jpeg">
          </div>
          <div class="rebeca">
            <img src="jovem-lab/assets/images/rebecafoto.jpeg">
          </div>
          <div class="arnold">
            <img src="jovem-lab/assets/images/arnoldfoto.jpeg">
          </div>
          <div class="itallo">
            <img src="jovem-lab/assets/images/itallofoto.jpg">
          </div>
          <div class="kalebe">
            <img src="jovem-lab/assets/images/kalebefoto.jpg">
          </div>
          <div class="davi">
            <img src="jovem-lab/assets/images/davifoto.webp">
          </div>
          <div class="vivian">
            <img src="jovem-lab/assets/images/vivianfoto.jpg">
          </div>
          <div class="bruna">
            <img src="jovem-lab/assets/images/brunafoto.jpeg">
          </div>
          <div class="ester">
            <img src="jovem-lab/assets/images/esterfoto.jpeg">
          </div>
          <div class="mariaclara">
            <img src="jovem-lab/assets/images/mariaclarafoto.jpeg">
          </div>
          <div class="vinicius">
            <img src="jovem-lab/assets/images/viniciusfoto.webp">
          </div>
          <div class="viniciusg">
            <img src="jovem-lab/assets/images/viniciusg.webp">
          </div>
          <div class="amandac">
            <img src="jovem-lab/assets/images/amandac.jpg">
          </div>
          <div class="gabrielle">
            <img src="jovem-lab/assets/images/gabriellefoto.jpg">
          </div>
          <div class="amandav">
            <img src="jovem-lab/assets/images/amandavfoto.jpg">
          </div>
          <div class="gabryel">
            <img src="jovem-lab/assets/images/gabryelfoto.png">
          </div>
          <div class="analuiza">
            <img src="jovem-lab/assets/images/analuizafoto.webp">
          </div>
          <div class="anaclara">
            <img src="jovem-lab/assets/images/anaclarafoto.webp">
          </div>
          <div class="victor">
            <img src="jovem-lab/assets/images/victorfoto.jpeg">
          </div>
          <div class="lucas">
            <img src="jovem-lab/assets/images/lucasfoto.jpeg">
          </div>

               
        `
      },
    ];
  }
};

// Exporta como variável global (sem módulos ES, para compatibilidade pura)
window.DB = DB;
