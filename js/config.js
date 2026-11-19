/* =====================================================================
   CONFIG.JS — TODOS OS TEXTOS EDITÁVEIS DO SITE FICAM AQUI
   ---------------------------------------------------------------------
   • Pode mudar qualquer texto entre aspas/crases sem medo.
   • Textos com crase (`...`) aceitam HTML simples: <strong>, <em>, <br>.
   • Para ADICIONAR UMA AULA:
       1. Acrescente um item na lista "aulas" do módulo (id, numero, aba,
          titulo, descricao).
       2. Crie o arquivo js/lessons/<nome>.js (copie uma aula existente
          como modelo) e registre com TDZ.registrarAula('<id>', ...).
       3. Inclua o <script> do arquivo novo no index.html, antes do main.js.
   • Para ADICIONAR UM MÓDULO:
       Acrescente um objeto novo em "modulos" (veja o exemplo comentado
       no fim da lista). Use ids de aula únicos, ex.: 'm1-aula-1'.
       Quando houver mais de um módulo, o cabeçalho mostra um seletor.
   ===================================================================== */
window.TDZ = window.TDZ || {};

TDZ.config = {
  site: {
    nome: 'Teclado do Zero',
    subtitulo: `Quatro aulas curtas pra sair do “onde fica o Dó?” e chegar no “toca o 4 aí” sem travar.`,
    versao: 'v1',
  },

  instrutor: {
    nome: 'Marcus Bontempi',
    papel: 'Seu instrutor',
    papelRodape: 'Instrutor · Teclado do Zero',
    bio: `Tecladista há mais de 6 anos. Um pouco de aula teórica, um pouco de partitura e muito de fundo musical e de ser jogado em fogueiras crentes, tocando com Leo Black e outras pessoas mais complexas, em todo tipo de igreja e estrutura.`,
    // Etiquetas que aparecem no card do instrutor (pode apagar ou trocar)
    tags: ['Louvor', 'Fundo musical', 'Harmonia na prática'],
  },

  // Itens do card "Como usar" na página inicial
  comoUsar: [
    `<strong>Faça as aulas em ordem.</strong> Uma puxa a outra: 1 → 2 → 3 → 4.`,
    `<strong>Leia, clique, repita.</strong> Leia o card, toque no teclado da tela e depois repita no seu teclado de verdade.`,
    `<strong>Escolha a notação.</strong> No topo tem o botão <em>Dó Ré Mi</em> ↔ <em>C D E</em> (cifra). Ele troca todos os nomes do site na hora e fica salvo.`,
    `<strong>Ligue o som.</strong> O áudio começa depois do primeiro clique (regra dos navegadores). Sem som? Confira o volume e o modo silencioso do celular.`,
  ],

  modulos: [
    {
      id: 'm0',
      numero: 0,
      nome: 'Start',
      aulas: [
        { id: 'aula-1', numero: '1', aba: '1 Topografia',      titulo: 'Topografia',              descricao: 'O mapa do teclado: pretas em grupos de 2 e 3, as 7 notas e os números dos dedos.' },
        { id: 'aula-2', numero: '2', aba: '2 Acorde 1-3-5',    titulo: 'Acorde 1 · 3 · 5',        descricao: 'Seu primeiro acorde: três notas juntas, com os dedos 1, 3 e 5.' },
        { id: 'aula-3', numero: '3', aba: '3 Escala & Base',   titulo: 'Escala maior & base simples', descricao: 'A fórmula T·T·S·T·T·T·S e as duas mãos juntas: 1 dedo na esquerda, 3 na direita.' },
        { id: 'aula-4', numero: '4', aba: '4 Exercícios',      titulo: 'Exercícios',              descricao: 'Caça-tecla, monte o acorde 1-3-5, acorde livre e ouvido de lince.' },
      ],
    },
    // EXEMPLO de módulo futuro (tire as barras // para ativar e crie os arquivos):
    // {
    //   id: 'm1', numero: 1, nome: 'Base',
    //   aulas: [
    //     { id: 'm1-aula-1', numero: '1', aba: '1 Inversões', titulo: 'Inversões', descricao: 'Mesmo acorde, outra posição.' },
    //   ],
    // },
  ],

  // Base Simples (Aula 3): sequência de acordes tocada com as duas mãos e o andamento.
  // Use só 1, 4 e 5 por enquanto (são os acordes ensinados até aqui).
  baseSimples: {
    sequencia: [1, 4, 5, 1],
    bpm: 80,
  },

  // Checklist "Treino no teclado de verdade" (Aula 4). O progresso fica salvo
  // no navegador do aluno. Se mudar o texto de um item, a caixinha dele zera.
  treinos: [
    `<strong>Caça ao Dó de olho fechado:</strong> achar todos os Dós e Fás só pelo toque nas pretas.`,
    `<strong>Escadinha 1-2-3-4-5-4-3-2-1</strong> com a mão direita em Dó, Sol, Fá e Ré, sem olhar pra mão.`,
    `<strong>Tríades nas 12 tonalidades,</strong> subindo de meio em meio tom (maiores, depois menores).`,
    `<strong>Maior ↔ menor:</strong> segurar 1 e 5 e só mexer a terça.`,
    `<strong>Escala maior em Dó, Sol e Ré,</strong> falando T-T-S-T-T-T-S em voz alta.`,
    `<strong>1-5-6-4</strong> cantando um louvor conhecido.`,
    `<strong>Mão esquerda no baixo (1) e direita na tríade,</strong> começando com 1-4-5-1.`,
  ],
};
