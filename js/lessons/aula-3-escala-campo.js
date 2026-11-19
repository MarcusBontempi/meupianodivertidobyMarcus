/* =====================================================================
   AULA 3 · ESCALA MAIOR & BASE SIMPLES (mão esquerda + mão direita)
   A sequência tocada na Base Simples fica em TDZ.config.baseSimples.
   ===================================================================== */
TDZ.registrarAula('aula-3', function (el) {
  const N = TDZ.nomes;
  const C = TDZ.config;
  const A = TDZ.audio;
  const seq = TDZ.criarSequencia();
  const SELOS = ['1', '3', '5'];
  const SEMITONS = [0, 4, 7];
  const GRAUS_BASE = [1, 4, 5]; // acordes oferecidos na Base Simples
  let tonica = 0;
  let grauBase = 1;

  el.innerHTML = `
  <div class="stack">
    <header class="hero reveal">
      <span class="kicker">Aula 3 · Escala & Base</span>
      <h1>Uma fórmula, <em>12 tons</em>.</h1>
      <p class="lead">A escala maior é sempre o mesmo caminho de passos: <strong class="mono">T · T · S · T · T · T · S</strong>. Começou numa nota, seguiu a fórmula, pronto.</p>
    </header>

    <article class="card card-kb reveal">
      <span class="kicker">Escolha o tom</span>
      <div class="chips-tom"></div>
      <span class="rotulo">A fórmula no tom escolhido</span>
      <div class="faixa faixa-escala"></div>
      <div class="btn-row">
        <button class="btn primario" data-acao="escala">▶ Tocar a escala</button>
        <button class="btn" data-acao="graus">Mostrar graus 1–8</button>
        <button class="btn" data-acao="limpar">Limpar</button>
      </div>
      <div class="kb-host"></div>
    </article>

    <article class="card card-kb reveal">
      <span class="kicker">Duas mãos</span>
      <h2>Base Simples · Acompanhamento da Mão Esquerda</h2>
      <p>Até aqui cada mão trabalhou sozinha. Agora vamos <strong>juntar as duas</strong>: elas descem no teclado <strong>no mesmo instante</strong>, como se fosse um movimento só.</p>
      <p>Por enquanto a receita é fácil: <strong style="color:var(--blue)">1 dedo na mão esquerda</strong> e <strong style="color:var(--amber)">3 dedos na mão direita</strong>.</p>

      <div class="grid-3" style="margin:16px 0 6px">
        <div class="passo-base" style="--c:var(--blue)"><b>Mão esquerda · 1 dedo</b><span>Toca só o <strong>1</strong> do acorde, lá embaixo (à esquerda, mais grave). É o “baixo”.</span></div>
        <div class="passo-base" style="--c:var(--amber)"><b>Mão direita · 3 dedos</b><span>Toca o acorde <strong>1 · 3 · 5</strong> com os dedos 1, 3 e 5, mais pro meio do teclado.</span></div>
        <div class="passo-base" style="--c:var(--coral)"><b>Juntas</b><span>As duas mãos encostam nas teclas <strong>ao mesmo tempo</strong>. Nem antes, nem depois.</span></div>
      </div>

      <span class="rotulo">Escolha o acorde (no tom escolhido lá em cima)</span>
      <div class="chips-base"></div>
      <div class="btn-row">
        <button class="btn blue" data-base="esquerda">1 · Só a esquerda</button>
        <button class="btn primario" data-base="direita">2 · Só a direita</button>
        <button class="btn coral" data-base="juntas">3 · As duas juntas</button>
        <button class="btn" data-base="sequencia">▶ Base ${C.baseSimples.sequencia.join(' · ')}</button>
      </div>
      <div class="agora" aria-live="polite"></div>
      <div class="legenda"><span style="--c:var(--blue)">mão esquerda (1 dedo)</span><span style="--c:var(--amber)">mão direita (3 dedos)</span></div>
      <div class="kb-host-base"></div>
      <p class="dica">Comece devagar: conte “1, 2, 3, 4” em voz alta e toque as duas mãos juntas sempre no “1”.</p>
    </article>
  </div>`;

  const kb = new TDZ.Teclado(el.querySelector('.kb-host'), { oitavas: 3, inicio: 48, nomes: true });
  const kbb = new TDZ.Teclado(el.querySelector('.kb-host-base'), { oitavas: 3, inicio: 48, nomes: true });
  const faixa = el.querySelector('.faixa-escala');
  const agora = el.querySelector('.agora');
  const chipsBase = el.querySelector('.chips-base');

  const base = () => 48 + tonica;
  const escala = () => N.escala(tonica);

  /* ---------- Escala ---------- */
  function desenharFaixa() {
    const e = escala();
    const notas = e.concat([e[0]]);
    faixa.innerHTML = notas.map((s, i) =>
      `<span class="pill" data-i="${i}"><b>${i + 1}</b> ${N.span(s)}</span>` +
      (i < 7 ? `<span class="passo ${N.PASSOS[i]}" title="${N.PASSOS[i] === 'T' ? 'Tom' : 'Semitom'}">${N.PASSOS[i]}</span>` : '')
    ).join('');
  }
  const midisEscala = () => N.MAIOR.concat([12]).map((st) => base() + st);

  function mostrarGraus() {
    kb.limpar();
    midisEscala().forEach((m, i) => kb.marcar(m, i === 0 || i === 7 ? 'coral' : 'amber', String(i + 1)));
  }

  function tocarEscala() {
    kb.limpar();
    const ms = midisEscala();
    const pills = faixa.querySelectorAll('.pill');
    const ordem = [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1, 0];
    seq.rodar(async (esperar) => {
      for (const i of ordem) {
        pills.forEach((p) => p.classList.remove('on'));
        pills[i].classList.add('on');
        kb.marcar(ms[i], i === 0 || i === 7 ? 'coral' : 'amber', String(i + 1));
        kb.tocar(ms[i], { dur: 0.8 });
        kb.rolarPara(ms[i]);
        await esperar(340);
      }
      await esperar(300);
      pills.forEach((p) => p.classList.remove('on'));
    });
  }

  /* ---------- Base Simples ---------- */
  // Acorde do grau g no tom: esquerda = 1 na oitava de baixo; direita = 1-3-5 uma oitava acima.
  function maos(g) {
    const raiz = escala()[g - 1];
    const pc = N.pc(raiz);
    return {
      g, raiz,
      notas: N.triade(raiz, 'maj'),
      esquerda: 48 + pc,
      direita: SEMITONS.map((s) => 60 + pc + s),
    };
  }

  function texto(a, quais) {
    const esq = `<strong style="color:var(--blue)">${N.span(a.raiz)}</strong> <span class="muted">(1 dedo)</span>`;
    const dir = `<strong>${a.notas.map((s) => N.span(s)).join(' · ')}</strong> <span class="muted">(dedos 1-3-5)</span>`;
    const partes = [];
    if (quais !== 'direita') partes.push('Mão esquerda: ' + esq);
    if (quais !== 'esquerda') partes.push('Mão direita: ' + dir);
    return `Acorde do <strong>${a.g}</strong> · ${N.span(a.raiz)} — ` + partes.join(' &nbsp;|&nbsp; ');
  }

  function mostrarMaos(a, quais, som) {
    kbb.limpar();
    if (quais !== 'direita') kbb.marcar(a.esquerda, 'blue', 'E');
    if (quais !== 'esquerda') a.direita.forEach((m, i) => kbb.marcar(m, 'amber', SELOS[i]));
    agora.innerHTML = texto(a, quais);
    if (!som) return;
    const ms = [];
    if (quais !== 'direita') ms.push(a.esquerda);
    if (quais !== 'esquerda') ms.push(...a.direita);
    ms.forEach((m) => kbb.tocar(m, { som: false }));
    A.acorde(ms, { dur: 1.8 });
  }

  function desenharChipsBase() {
    chipsBase.innerHTML = '';
    TDZ.ui.chips(
      chipsBase,
      GRAUS_BASE.map((g) => ({ valor: g, html: `<b>${g}</b> · ${N.span(escala()[g - 1])}` })),
      grauBase,
      (g) => { grauBase = g; seq.parar(); mostrarMaos(maos(g), 'juntas', true); }
    );
  }

  function tocarSequencia() {
    const tempo = 60 / (C.baseSimples.bpm || 80);
    seq.rodar(async (esperar) => {
      for (const g of C.baseSimples.sequencia) {
        const a = maos(g);
        for (let t = 0; t < 4; t++) {
          if (t === 0) mostrarMaos(a, 'juntas', true);
          else A.clique(false);
          agora.innerHTML = texto(a, 'juntas') + ` <span class="muted">· tempo ${t + 1}</span>`;
          await esperar(tempo * 1000);
        }
      }
    });
  }

  const acoesBase = {
    esquerda: () => { seq.parar(); mostrarMaos(maos(grauBase), 'esquerda', true); },
    direita: () => { seq.parar(); mostrarMaos(maos(grauBase), 'direita', true); },
    juntas: () => { seq.parar(); mostrarMaos(maos(grauBase), 'juntas', true); },
    sequencia: tocarSequencia,
  };
  el.querySelectorAll('[data-base]').forEach((b) => b.addEventListener('click', () => acoesBase[b.dataset.base]()));

  /* ---------- Ações da escala ---------- */
  const acoes = {
    escala: tocarEscala,
    graus() { seq.parar(); mostrarGraus(); },
    limpar() {
      seq.parar();
      kb.limpar();
      faixa.querySelectorAll('.pill').forEach((p) => p.classList.remove('on'));
    },
  };
  el.querySelectorAll('[data-acao]').forEach((b) => b.addEventListener('click', () => acoes[b.dataset.acao]()));

  function atualizarTom() {
    seq.parar();
    desenharFaixa();
    mostrarGraus();
    desenharChipsBase();
    mostrarMaos(maos(grauBase), 'juntas', false);
  }

  TDZ.ui.chips(
    el.querySelector('.chips-tom'),
    Array.from({ length: 12 }, (_, pc) => ({ valor: pc, html: N.span(N.grafarNoTom(pc)) })),
    tonica,
    (pc) => { tonica = pc; atualizarTom(); kb.tocar(base()); }
  );

  atualizarTom();
});
