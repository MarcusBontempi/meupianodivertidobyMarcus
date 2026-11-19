# Teclado do Zero · Módulo 0

Site estático de aulas de teclado (HTML + CSS + JS puro, sem build e sem dependências).

## Rodar localmente
Dê dois cliques no `index.html`. Pronto, não precisa de servidor.
(Se preferir servidor: `npx serve .` ou a extensão *Live Server* do VS Code.)

## Estrutura
```
index.html               página única + ordem dos scripts
css/style.css            visual (cores e fontes nas variáveis do topo)
js/config.js             ← TEXTOS EDITÁVEIS: nome, bio, aulas, base simples, treinos
js/core.js               utilitários (localStorage seguro, animações, chips)
js/theory.js             nomes de notas (Dó/C), escalas, acordes
js/audio.js              síntese de nota, acorde, clique e metrônomo
js/keyboard.js           componente de teclado reutilizável
js/lessons/*.js          uma aula por arquivo
js/main.js               navegação (#inicio, #aula-1…), loading, toggle de notação
```

## Editar o conteúdo
- **Nome, bio, subtítulo, "Como usar", títulos/descrições das aulas, sequência da Base Simples e checklist de treinos:** tudo em `js/config.js`.
- **Texto dentro de uma aula:** no arquivo da aula em `js/lessons/`, dentro de `el.innerHTML = \`...\``.
- **Nomes de notas** no texto: use `N.span(...)` (ex.: `${g(0)}` na Aula 1). Assim eles obedecem ao botão Dó Ré Mi ↔ C D E.
- **Cores e fontes:** variáveis no topo de `css/style.css`.

## Adicionar uma aula
1. Em `js/config.js`, acrescente na lista `aulas` do módulo:
   `{ id: 'aula-5', numero: '5', aba: '5 Ritmo', titulo: 'Ritmo', descricao: '...' }`
2. Copie um arquivo de `js/lessons/` como modelo, por exemplo `aula-5-ritmo.js`, e registre:
   ```js
   TDZ.registrarAula('aula-5', function (el) {
     el.innerHTML = `<div class="stack"> ... </div>`;
     const kb = new TDZ.Teclado(el.querySelector('.kb-host'), { oitavas: 2 });
   });
   ```
3. No `index.html`, inclua `<script src="js/lessons/aula-5-ritmo.js"></script>` **antes** do `main.js`.

A aba, o card da página inicial e o link `#aula-5` aparecem sozinhos.

## Adicionar um módulo
Em `js/config.js`, acrescente um objeto novo em `modulos` (há um exemplo comentado lá) com ids de aula únicos, ex.: `m1-aula-1`. Crie os arquivos das aulas como acima. Com mais de um módulo, o cabeçalho ganha um seletor de módulo e a página inicial lista todos.

Para lançar uma versão nova, mude `versao` em `config.site` (aparece no rodapé).

## Publicar no Netlify
1. Acesse **app.netlify.com/drop**.
2. Arraste a **pasta inteira** do projeto (a que contém o `index.html`).
3. Pronto: o Netlify gera o link. Para atualizar, arraste de novo (ou, logado, use *Deploys → drag and drop* no mesmo site para manter o endereço).

Links diretos para uma aula: `https://seu-site.netlify.app/#aula-3`.

## Observações
- O som usa Web Audio API e só liga depois do primeiro clique (regra dos navegadores).
- Notação escolhida, checklist e recorde do Caça-tecla ficam salvos no `localStorage` do navegador do aluno.
- Animações respeitam a configuração "reduzir movimento" do sistema.
- **Celular:** em pé, o site fica travado com o aviso "gire o celular" (regra em `css/style.css`, seção *CELULAR EM PÉ*). Deitado, o layout fica compacto (cabeçalho numa linha só, teclados mais baixos). Tablets e computadores não são bloqueados.
