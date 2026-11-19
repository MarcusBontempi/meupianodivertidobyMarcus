/* =====================================================================
   AULA 1 · TOPOGRAFIA
   Para editar textos desta aula, mexa no HTML dentro de el.innerHTML.
   Nomes de notas usam N.span(...) para obedecer ao toggle Dó/C.
   ===================================================================== */
TDZ.registrarAula('aula-1', function (el) {
  const N = TDZ.nomes;
  const g = (pc) => N.span(N.grafar(pc));       // nome de uma tecla branca
  const seq = TDZ.criarSequencia();

  /* Mãozinha em SVG com os números dos dedos (vista de cima, palma pra baixo). */
  function mao(esquerda) {
    const W = 160;
    const fx = (x) => (esquerda ? W - x : x);
    const espelho = esquerda ? ' transform="translate(160,0) scale(-1,1)"' : '';
    const dedos = [
      { n: 2, cx: 46, top: 30 },
      { n: 3, cx: 70, top: 14 },
      { n: 4, cx: 94, top: 22 },
      { n: 5, cx: 117, top: 46 },
    ];
    return `
      <svg class="mao" viewBox="0 0 160 175" role="img" aria-label="Mão ${esquerda ? 'esquerda' : 'direita'}: polegar 1, indicador 2, médio 3, anelar 4, mindinho 5">
        <g${espelho}>
          <rect class="pele" x="9" y="86" width="24" height="60" rx="12" transform="rotate(-28 21 116)"/>
          ${dedos.map((d) => `<rect class="pele" x="${d.cx - 11}" y="${d.top}" width="22" height="${110 - d.top}" rx="11"/>`).join('')}
          <rect class="pele" x="30" y="78" width="102" height="88" rx="30"/>
        </g>
        <circle cx="${fx(13)}" cy="98" r="11"/><text x="${fx(13)}" y="98">1</text>
        ${dedos.map((d) => `<circle cx="${fx(d.cx)}" cy="${d.top + 14}" r="11"/><text x="${fx(d.cx)}" y="${d.top + 14}">${d.n}</text>`).join('')}
      </svg>`;
  }

  el.innerHTML = `
  <div class="stack">
    <header class="hero reveal">
      <span class="kicker">Aula 1 · Topografia</span>
      <h1>O teclado é um padrão de <em>12 teclas</em> que se repete.</h1>
      <p class="lead">7 brancas + 5 pretas. Aprendeu um pedaço, aprendeu o teclado inteiro: o resto é cópia, mais grave pra esquerda e mais agudo pra direita.</p>
    </header>

    <div class="grid-2">
      <article class="card acento reveal" style="--c:var(--coral)">
        <span class="kicker">Mapa</span>
        <h2>O segredo: as pretas</h2>
        <p>Não decore as brancas, olhe as <strong>pretas</strong>. Elas vêm em <strong>grupos de 2</strong> e <strong>grupos de 3</strong>, sempre alternando.</p>
        <div class="grupos-demo" aria-hidden="true">
          <div class="grupo" style="--c:var(--coral)"><i></i><i></i><small>grupo de 2</small></div>
          <div class="grupo" style="--c:var(--teal)"><i></i><i></i><i></i><small>grupo de 3</small></div>
        </div>
        <ul class="lista">
          <li>O <strong>${g(0)}</strong> fica logo à <strong>esquerda do grupo de 2</strong>.</li>
          <li>O <strong>${g(5)}</strong> fica logo à <strong>esquerda do grupo de 3</strong>.</li>
        </ul>
      </article>

      <article class="card acento reveal" style="--c:var(--amber)">
        <span class="kicker">Mãos</span>
        <h2>Dedos têm número</h2>
        <p>Nas <strong>duas mãos</strong> o polegar é o 1 e o mindinho é o 5. Quando a aula falar “dedo 3”, é o médio.</p>
        <div class="maos">
          <figure>${mao(true)}<figcaption>Mão esquerda</figcaption></figure>
          <figure>${mao(false)}<figcaption>Mão direita</figcaption></figure>
        </div>
        <div class="dedos-lista">
          <span><b>1</b>polegar</span><span><b>2</b>indicador</span><span><b>3</b>médio</span><span><b>4</b>anelar</span><span><b>5</b>mindinho</span>
        </div>
      </article>
    </div>

    <article class="card reveal">
      <span class="kicker">As 7 brancas</span>
      <h2>Mesma nota, dois nomes</h2>
      <p>No Brasil a gente fala <strong>Dó Ré Mi</strong>, mas cifra (e quase toda música de igreja) usa <strong>letras</strong>. Vale saber os dois.</p>
      <div class="tabela-wrap">
        <table class="tabela">
          <thead><tr><th>Solfejo</th><th>Dó</th><th>Ré</th><th>Mi</th><th>Fá</th><th>Sol</th><th>Lá</th><th>Si</th></tr></thead>
          <tbody><tr><td class="sol">Cifra</td><td class="cif">C</td><td class="cif">D</td><td class="cif">E</td><td class="cif">F</td><td class="cif">G</td><td class="cif">A</td><td class="cif">B</td></tr></tbody>
        </table>
      </div>
      <p class="dica" style="margin-top:12px">Truque: a cifra começa no Lá (A) — A, B, C… — por isso o Dó é C.</p>
    </article>

    <article class="card card-kb reveal">
      <span class="kicker">Mão na massa</span>
      <h2>Explore o teclado</h2>
      <div class="readout" aria-live="polite">Você tocou: <strong class="tocou">—</strong></div>
      <div class="kb-host"></div>
      <div class="btn-row">
        <button class="btn" data-acao="nomes">Esconder nomes</button>
        <button class="btn coral" data-acao="grupos">Grupos de 2 e 3</button>
        <button class="btn primario" data-acao="dos">Onde estão os ${g(0)}s?</button>
        <button class="btn blue" data-acao="semitons">Semitons sem preta</button>
        <button class="btn" data-acao="limpar">Limpar</button>
      </div>
      <div class="legenda" aria-live="polite"></div>
    </article>

    <div class="grid-3">
      <article class="card acento reveal" style="--c:var(--blue)">
        <span class="kicker">♯ e ♭</span>
        <h2>A preta pega emprestado</h2>
        <p>A tecla preta não tem nome próprio: ela usa o nome da vizinha.</p>
        <ul class="lista">
          <li><strong>♯ sustenido</strong> = meio tom <em>acima</em>: a preta à direita do ${g(0)} é ${N.span({ l: 0, a: 1 })}.</li>
          <li><strong>♭ bemol</strong> = meio tom <em>abaixo</em>: a mesma tecla é ${N.span({ l: 1, a: -1 })}.</li>
        </ul>
        <p class="dica">Mesma tecla, dois nomes. Qual usar depende do tom.</p>
      </article>

      <article class="card acento reveal" style="--c:var(--coral)">
        <span class="kicker">Distâncias</span>
        <h2>Semitom × Tom</h2>
        <p><strong>Semitom (S)</strong> = da tecla para a vizinha mais próxima, preta ou branca.<br><strong>Tom (T)</strong> = dois semitons.</p>
        <div class="aviso">⚠️ ${g(4)} → ${g(5)} e ${g(11)} → ${g(0)} não têm preta no meio: são <strong>semitom</strong> direto, branca com branca.</div>
      </article>

      <article class="card acento reveal" style="--c:var(--teal)">
        <span class="kicker">Repetição</span>
        <h2>Oitava</h2>
        <p>Conte <strong>12 semitons</strong> a partir de qualquer tecla e você chega na <strong>mesma nota, mais aguda</strong>. Isso é uma oitava.</p>
        <p class="dica">Clique em “Onde estão os ${g(0)}s?” e escute: é a mesma nota, em três alturas.</p>
      </article>
    </div>
  </div>`;

  const tocou = el.querySelector('.tocou');
  const legenda = el.querySelector('.legenda');
  const kb = new TDZ.Teclado(el.querySelector('.kb-host'), {
    oitavas: 2,
    inicio: 48,
    nomes: true,
    aoTocar: (m) => { tocou.innerHTML = N.spanAmbos(m % 12, true); },
  });

  const leg = (itens) => {
    legenda.innerHTML = itens.map(([cor, txt]) => `<span style="--c:var(--${cor})">${txt}</span>`).join('');
  };

  const acoes = {
    nomes(btn) {
      kb.mostrarNomes(!kb.nomesVisiveis);
      btn.textContent = kb.nomesVisiveis ? 'Esconder nomes' : 'Mostrar nomes';
    },
    grupos() {
      seq.parar();
      kb.limpar();
      kb.midis.forEach((m) => {
        const pc = m % 12;
        if (pc === 1 || pc === 3) kb.marcar(m, 'coral');
        if (pc === 6 || pc === 8 || pc === 10) kb.marcar(m, 'teal');
      });
      leg([['coral', 'grupo de 2'], ['teal', 'grupo de 3'], ['amber', `${g(0)} = à esquerda do 2 · ${g(5)} = à esquerda do 3`]]);
    },
    dos() {
      kb.limpar();
      const dos = kb.midisDoPc(0);
      leg([['amber', `Todos os ${g(0)}s: a mesma nota, uma oitava acima da outra`]]);
      seq.rodar(async (esperar) => {
        for (const m of dos) {
          kb.marcar(m, 'amber', g(0));
          kb.tocar(m);
          kb.rolarPara(m);
          await esperar(450);
        }
      });
    },
    semitons() {
      kb.limpar();
      const pares = [];
      kb.midis.forEach((m) => {
        if (m % 12 === 4 && kb.tecla(m + 1)) pares.push([m, m + 1]);
        if (m % 12 === 11 && kb.tecla(m + 1)) pares.push([m, m + 1]);
      });
      pares.forEach(([a, b]) => { kb.marcar(a, 'blue', 'S'); kb.marcar(b, 'blue', 'S'); });
      leg([['blue', `${g(4)}→${g(5)} e ${g(11)}→${g(0)}: meio tom sem preta no meio`]]);
      seq.rodar(async (esperar) => {
        for (const [a, b] of pares) {
          kb.tocar(a); await esperar(300);
          kb.tocar(b); await esperar(450);
        }
      });
    },
    limpar() {
      seq.parar();
      kb.limpar();
      legenda.innerHTML = '';
      tocou.textContent = '—';
    },
  };

  el.querySelectorAll('[data-acao]').forEach((b) =>
    b.addEventListener('click', () => acoes[b.dataset.acao](b))
  );
});
