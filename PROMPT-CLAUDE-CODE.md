# Projeto: "Teclado do Zero" · Módulo 0 (site de aulas de teclado)

Quero que você crie do zero um site estático de aulas de teclado, que eu vou hospedar de graça no Netlify (arrastando a pasta no app.netlify.com/drop). Leia tudo antes de começar.

## Contexto
- Sou o Marcus Bontempi, tecladista e estudante de front-end. Dou aulas de teclado para dois amigos iniciantes.
- O material é dividido em **módulos** e **aulas**. Este é o **Módulo 0 · Start** (piloto). Depois vou adicionar Módulo 1, 2…, então a estrutura tem que ser **fácil de expandir e editar**.
- O conteúdo precisa ser **simples, muito visual e autoexplicativo**. Tudo que envolve teclado deve ser **interativo**: teclas clicáveis, com som e destaques coloridos.
- Público: iniciantes total, em português do Brasil. Contexto de música de igreja (louvor).

## Stack e estrutura
- **HTML + CSS + JavaScript puro** (sem framework, sem build, sem dependências npm). Tem que rodar abrindo o `index.html` e subindo a pasta no Netlify.
- Só pode carregar recursos externos do Google Fonts. O áudio é gerado com **Web Audio API** (sem arquivos de som).
- Estrutura sugerida:
  ```
  /index.html
  /css/style.css
  /js/config.js      ← nome, bio, textos editáveis, lista de treinos
  /js/audio.js       ← síntese de nota, acorde e clique de metrônomo
  /js/keyboard.js    ← componente de teclado reutilizável
  /js/lessons/*.js   ← uma aula por arquivo
  /js/main.js        ← navegação, loading, toggle de notação
  ```
- Comente o código em português, explicando **onde editar textos** e **como adicionar uma aula ou módulo novo**.
- Crie também um `README.md` curto com: como rodar localmente, como editar o conteúdo, como adicionar um módulo e como publicar no Netlify.

## Identidade visual
- **Paleta escura**: fundo bem escuro (ex.: #0f1117 / #161a24), cards um pouco mais claros, **textos claros** (#ece8df) e acentos vibrantes: âmbar/mostarda (#f0b429), coral (#ff6b4a), verde-água (#3fc1b0), azul (#6c7cff). Contraste acessível (WCAG AA).
- Clima moderno e "retrô de manual", com bastante personalidade: títulos com uma fonte display marcante (ex.: Bowlby One), corpo em Work Sans, rótulos em fonte mono (Space Mono).
- **Não usar avatar nem ilustração de personagem.** O perfil do instrutor é só texto (nome + bio) num card bonito.
- Assinatura no rodapé de todas as páginas: "Marcus Bontempi" em fonte manuscrita tipo assinatura (ex.: Mrs Saint Delafield), com "Instrutor · Teclado do Zero" e a versão "Módulo 0 · Start · v1".
- Responsivo: no celular, o teclado rola na horizontal em vez de espremer as teclas.

## Animações e efeitos
- **Tela de loading** ao abrir: um **ícone de piano animado** (teclas que afundam em sequência, como se alguém tocasse uma escala) + o nome "Teclado do Zero". Ela some com fade quando a página carrega (mínimo ~1,2 s pra dar tempo de ver).
- Transição suave entre aulas/abas (fade + leve deslize).
- Elementos entrando com fade/slide escalonado quando a seção aparece.
- Botões com hover e press (leve escala ou sombra).
- Teclas: animação de "afundar" ao tocar e brilho suave nas teclas destacadas.
- Feedback de acerto/erro nos jogos: pulso verde ou "shake" vermelho.
- Animações simples e rápidas (150–400 ms). Respeitar `prefers-reduced-motion`.

## Componentes globais
- **Cabeçalho fixo** com: "MÓDULO 0 · START" / "Teclado do Zero" e um menu de abas: Início · 1 Topografia · 2 Graus 1-5 · 3 Escala & Campo · 4 Exercícios.
- Navegação por hash (`#inicio`, `#aula-1`… `#aula-4`) para dar pra mandar o link de uma aula específica.
- **Toggle de notação** no cabeçalho: "Dó Ré Mi" ↔ "C D E" (cifra). Ele atualiza todos os nomes do site na hora e fica salvo no localStorage (com try/catch).
- **Componente de teclado** reutilizável: X oitavas começando em C3, com teclas brancas e pretas posicionadas corretamente e clicáveis (pointerdown). Cada tecla toca o som. Precisa de métodos para: marcar tecla com cor + selo de texto (ex.: o grau "1", "3", "5"), limpar, mostrar/esconder nomes e "piscar".
- **Som**: síntese tipo piano simples (triângulo + harmônico em seno, ataque rápido e decaimento exponencial), mais uma função de acorde e um clique de metrônomo (acentuado no tempo 1).
- Usar sustenidos ou bemóis conforme o tom (F, Bb, Eb, Ab, Db usam bemol).

## Conteúdo

### Início
- Título "Teclado do Zero", subtítulo "Quatro aulas curtas pra sair do 'onde fica o Dó?' e chegar no 'toca o 4 aí' sem travar."
- Card "Como usar": fazer as aulas em ordem; ler, clicar no teclado da tela e repetir no teclado de verdade; explicar o toggle de notação.
- Card do instrutor (só texto, sem imagem):
  - **Marcus Bontempi**, "Seu instrutor"
  - Bio: "Tecladista há mais de 6 anos. Um pouco de aula teórica, um pouco de partitura e muito de fundo musical e de ser jogado em fogueiras crentes, tocando com Leo Black e outras pessoas mais complexas, em todo tipo de igreja e estrutura."
- Grade com os 4 cards das aulas, cada um com número grande, título e uma linha de descrição, levando à aula.

### Aula 1 · Topografia
- Ideia central: o teclado é um padrão de 12 teclas que se repete.
- Card "O segredo: as pretas": grupos de 2 e de 3. O Dó fica à esquerda do grupo de 2 e o Fá à esquerda do grupo de 3.
- Card "Dedos têm número": 1 polegar, 2 indicador, 3 médio, 4 anelar, 5 mindinho (nas duas mãos). Se der, fazer uma mãozinha simples em SVG com os números.
- Tabela das 7 notas brancas: Dó/C, Ré/D, Mi/E, Fá/F, Sol/G, Lá/A, Si/B.
- Teclado interativo de 2 oitavas com nomes, mostrando "Você tocou: Fá (F)". Na tecla preta, mostra os dois nomes (Dó# = Réb).
- Botões: Mostrar/esconder nomes · Grupos de 2 e 3 (cores diferentes) · Onde estão os Dós? (destaca e toca) · Semitons sem preta (Mi-Fá e Si-Dó) · Limpar.
- Cards: ♯ e ♭ (a preta "pega emprestado" o nome da vizinha) · Semitom × Tom (aviso de Mi→Fá e Si→Dó) · Oitava (12 semitons, mesma nota mais aguda).

### Aula 2 · Graus 1, 2, 3, 4, 5
- Ideia: músico de igreja fala em número ("vai pro 4"). Grau = posição da nota a partir da tônica (1). Muda o tom e os números continuam iguais.
- Seletor de tônica com 12 chips.
- Botões: Mostrar 1 a 5 (selos numerados nas teclas) · Tocar 1→5→1 (animado nota por nota) · Acorde MAIOR 1-3-5 · Acorde MENOR 1-♭3-5 (arpejo e depois o acorde junto).
- Faixa visual mostrando a contagem: "1 · Dó → 4 semitons → 3 · Mi → 3 semitons → 5 · Sol = Dó maior" (e a versão menor com 3 + 4).
- Cards: "Primeira, terça, quinta" (tríade = uma sim, uma não; mão direita com dedos 1-3-5) e "Maior × menor: é só a terça" (maior soa aberto/alegre, menor fechado/introspectivo).

### Aula 3 · Escala maior & campo harmônico
- Fórmula **T · T · S · T · T · T · S**, mostrada como faixa com as notas do tom e as etapas entre elas (T e S com cores diferentes).
- Seletor de tom (12 chips), botão "Tocar a escala" (animado) e teclado de 3 oitavas com graus 1–8.
- **Campo harmônico**: 7 cards clicáveis (I, ii, iii, IV, V, vi, vii°) com o nome do acorde no tom escolhido e a qualidade (maior / menor / diminuto), com cor por qualidade. Clicar destaca a tríade no teclado e toca (arpejo, acorde e baixo uma oitava abaixo). Padrão: Maior, menor, menor, Maior, Maior, menor, dim.
- **Progressões do culto** (botões que tocam e destacam acorde por acorde): 1-4-5-1 · 1-5-6-4 · 6-4-1-5 · 2-5-1.
- Card bônus: relativa menor = 6º grau (em Dó, Lá menor: mesmas notas, outro clima).

### Aula 4 · Exercícios (com placar e feedback animado)
1. **Caça-tecla**: aparece um nome de nota e o aluno clica na tecla certa. Tem pontos e sequência, níveis "Só brancas" e "Brancas + pretas", e depois de 2 erros a tecla certa é destacada como dica.
2. **Monte o acorde**: aparece um acorde aleatório (ex.: "Ré menor"). O aluno seleciona as 3 notas em qualquer oitava e clica em Conferir. Se errar, mostra a resposta com os graus. Botões Limpar e Próximo, com contador de acertos.
3. **Ouvido de lince**: toca o 1 e depois o grau 2, 3, 4 ou 5. O aluno escolhe qual foi. Tem botão Repetir, mostra a resposta no teclado e conta o placar.
4. **Modo Fogueira** 🔥 (o destaque, um simulador de "o ministro mudou tudo e ninguém avisou"):
   - Opções: tom, nível (Tranquilo 1·4·5 / Culto normal 1·4·5·6 / Fogueira 1 ao 6), BPM (50–130) e "esconder nome (só número)".
   - Metrônomo com 4 bolinhas de tempo (a 1 acentuada). A cada 2 compassos sorteia um grau novo (diferente do atual), mostra o número **gigante** + o nome do acorde, toca o acorde e destaca no teclado.
   - No 2º compasso, aparece "próximo → X" pra preparar a troca.
   - Botão Começar/Parar. Mudar o BPM reinicia o metrônomo.
5. **Treino no teclado de verdade**: checklist com caixinhas salvas no localStorage. Os itens ficam em `config.js`:
   - Caça ao Dó de olho fechado: achar todos os Dós e Fás só pelo toque nas pretas.
   - Escadinha 1-2-3-4-5-4-3-2-1 com a mão direita em Dó, Sol, Fá e Ré, sem olhar pra mão.
   - Tríades nas 12 tonalidades, subindo de meio em meio tom (maiores, depois menores).
   - Maior ↔ menor: segurar 1 e 5 e só mexer a terça.
   - Escala maior em Dó, Sol e Ré, falando T-T-S-T-T-T-S em voz alta.
   - 1-5-6-4 cantando um louvor conhecido.
   - Mão esquerda no baixo (1) e direita na tríade, começando com 1-4-5-1.
   - Modo Fogueira: 2 min no "Culto normal" a 72 BPM sem errar troca.

## Critérios de pronto
- Funciona abrindo `index.html` direto e no Netlify, sem erros no console.
- O áudio só inicia após o primeiro clique (regra dos navegadores) e não quebra se o Web Audio falhar.
- Todo uso de localStorage é protegido com try/catch.
- Testado em desktop e celular (teclado rolável, menu quebrando linha).
- Textos editáveis centralizados e código comentado pra eu expandir sozinho.
