# 🚀 Jovem Lab

> Blog educacional para jovens em busca do primeiro emprego.

## 📁 Estrutura do Projeto

```
jovem-lab/
│
├── index.html          ← Página inicial (Home)
├── conteudos.html      ← Listagem de todos os artigos
├── detalhe.html        ← Página de artigo completo
├── cadastro.html       ← Formulário de cadastro de usuário
│
├── css/
│   └── style.css       ← Folha de estilos completa
│
├── js/
│   ├── storage.js      ← Banco de dados local (LocalStorage)
│   ├── cards.js        ← Renderização dinâmica de cards
│   └── main.js         ← Orquestrador / lógica por página
│
├── assets/
│   ├── images/         ← Imagens do projeto
│   └── icons/          ← Ícones
│
└── README.md           ← Este arquivo
```

## 🗂️ Responsabilidade de Cada Arquivo

| Arquivo | Responsabilidade |
|---|---|
| `index.html` | Página inicial com hero, stats e cards em destaque |
| `conteudos.html` | Lista todos os artigos com filtros e busca |
| `detalhe.html` | Exibe um artigo completo (texto + vídeo) via `?id=N` |
| `cadastro.html` | Formulário de cadastro com validação |
| `css/style.css` | Todos os estilos: variáveis, layout, componentes, responsividade |
| `js/storage.js` | CRUD no LocalStorage — usuários e conteúdos |
| `js/cards.js` | Cria e insere HTML dos cards no DOM dinamicamente |
| `js/main.js` | Inicializa a página certa, navegação mobile e comportamentos globais |

## 🎨 Identidade Visual

- **Laranja** `#FF6B2C` — destaque, CTAs, botões primários
- **Azul** `#1B3E72` — header, footer, elementos de navegação
- **Branco** `#FFFFFF` — fundo principal

## 🗃️ Banco de Dados (LocalStorage)

Os dados são armazenados no `localStorage` do navegador com as chaves:

```
jovemlab_conteudos   ← Array de objetos de artigos
jovemlab_usuarios    ← Array de usuários cadastrados
jovemlab_db_init     ← Flag de inicialização
```

## 🚀 Como Usar

1. Abra `index.html` em qualquer navegador moderno
2. Não é necessário servidor — funciona com abertura direta de arquivo

## 🧰 Tecnologias

- HTML5 semântico
- CSS3 (Flexbox, Grid, Custom Properties)
- JavaScript puro (ES6+)
- LocalStorage para persistência
