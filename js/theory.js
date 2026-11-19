/* =====================================================================
   THEORY.JS — nomes das notas, escalas e acordes
   ---------------------------------------------------------------------
   Uma nota "grafada" é um objeto { l, a }:
     l = letra (0=Dó/C, 1=Ré/D ... 6=Si/B)
     a = acidente (0 natural, 1 sustenido, -1 bemol)
   Assim "Mi#" e "Fá" são coisas diferentes, como na teoria de verdade.

   TOGGLE DE NOTAÇÃO: qualquer nome de nota no site é um
     <span class="nn" data-k="n" data-l="0" data-a="0"></span>
   que é preenchido automaticamente com "Dó" ou "C" conforme a notação.
   Use os atalhos N.span(), N.spanAcorde(), N.spanAmbos() para gerar.
   ===================================================================== */
(function () {
  const TDZ = window.TDZ;
  const N = (TDZ.nomes = {});

  const SOL = ['Dó', 'Ré', 'Mi', 'Fá', 'Sol', 'Lá', 'Si'];
  const CIF = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const NAT = [0, 2, 4, 5, 7, 9, 11]; // semitons de cada letra a partir do Dó

  N.MAIOR = [0, 2, 4, 5, 7, 9, 11];                          // escala maior
  N.PASSOS = ['T', 'T', 'S', 'T', 'T', 'T', 'S'];             // fórmula
  N.CAMPO = ['maj', 'min', 'min', 'maj', 'maj', 'min', 'dim']; // campo harmônico maior
  N.ROMANOS = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
  N.QUALIDADE = { maj: 'maior', min: 'menor', dim: 'diminuto' };
  N.TONS_BEMOL = [5, 10, 3, 8, 1]; // F, Bb, Eb, Ab, Db usam bemol

  N.modo = TDZ.storage.get('notacao', 'sol') === 'cif' ? 'cif' : 'sol';

  const mod12 = (n) => ((n % 12) + 12) % 12;
  N.ePreta = (pc) => [1, 3, 6, 8, 10].includes(mod12(pc));
  N.usaBemol = (pc) => N.TONS_BEMOL.includes(mod12(pc));

  /* Grafia simples de uma nota (pc = 0..11). bemol=true → Réb em vez de Dó# */
  N.grafar = function (pc, bemol) {
    pc = mod12(pc);
    const i = NAT.indexOf(pc);
    if (i >= 0) return { l: i, a: 0 };
    return bemol ? { l: NAT.indexOf(mod12(pc + 1)), a: -1 } : { l: NAT.indexOf(mod12(pc - 1)), a: 1 };
  };
  /* Grafia "do jeito do tom": tons da lista TONS_BEMOL usam bemol. */
  N.grafarNoTom = (pc) => N.grafar(pc, N.usaBemol(pc));

  N.pc = (s) => mod12(NAT[s.l] + s.a);

  /* Nota a X letras e Y semitons de distância (ex.: terça maior = 2 letras, 4 semitons). */
  N.intervalo = function (raiz, letras, semitons) {
    const l = (raiz.l + letras) % 7;
    let a = mod12(N.pc(raiz) + semitons - NAT[l]);
    if (a > 6) a -= 12;
    return { l, a };
  };

  /* Escala maior grafada corretamente (7 notas). */
  N.escala = function (tonica) {
    const r = N.grafarNoTom(tonica);
    return N.MAIOR.map((st, i) => N.intervalo(r, i, st));
  };

  N.semitonsTriade = (q) => (q === 'maj' ? [0, 4, 7] : q === 'min' ? [0, 3, 7] : [0, 3, 6]);
  N.triade = (raiz, q) => {
    const st = N.semitonsTriade(q);
    return [raiz, N.intervalo(raiz, 2, st[1]), N.intervalo(raiz, 4, st[2])];
  };

  /* ---------- Texto ---------- */
  const acc = (a) => (a > 0 ? '#'.repeat(a) : a < 0 ? 'b'.repeat(-a) : '');
  N.nome = (s, modo) => ((modo || N.modo) === 'cif' ? CIF : SOL)[s.l] + acc(s.a);
  N.acorde = function (s, q, modo) {
    modo = modo || N.modo;
    if (modo === 'cif') return N.nome(s, modo) + { maj: '', min: 'm', dim: '°' }[q];
    return N.nome(s, modo) + ' ' + N.QUALIDADE[q];
  };
  /* Tecla preta mostra os dois nomes: "Dó# = Réb" */
  N.ambos = function (pc, modo) {
    if (!N.ePreta(pc)) return N.nome(N.grafar(pc), modo);
    return N.nome(N.grafar(pc, false), modo) + ' = ' + N.nome(N.grafar(pc, true), modo);
  };
  const outro = (m) => (m === 'cif' ? 'sol' : 'cif');

  /* ---------- Spans que obedecem ao toggle ----------
     dual=true → mostra também a outra notação entre parênteses: "Fá (F)" */
  const d = (dual) => (dual ? ' data-dual="1"' : '');
  N.span = (s, dual) => `<span class="nn" data-k="n" data-l="${s.l}" data-a="${s.a}"${d(dual)}></span>`;
  N.spanAcorde = (s, q, dual) => `<span class="nn" data-k="c" data-l="${s.l}" data-a="${s.a}" data-q="${q}"${d(dual)}></span>`;
  N.spanAmbos = (pc, dual) => `<span class="nn" data-k="b" data-pc="${mod12(pc)}"${d(dual)}></span>`;

  function texto(el, modo) {
    const ds = el.dataset;
    if (ds.k === 'b') return N.ambos(+ds.pc, modo);
    const s = { l: +ds.l, a: +ds.a };
    if (ds.k === 'c') return N.acorde(s, ds.q, modo);
    return N.nome(s, modo);
  }
  function preencherUm(el) {
    let t = texto(el, N.modo);
    if (el.dataset.dual) t += ' (' + texto(el, outro(N.modo)) + ')';
    if (el.textContent !== t) el.textContent = t;
  }
  N.preencher = function (raiz) {
    raiz = raiz || document;
    if (raiz.matches && raiz.matches('.nn')) preencherUm(raiz);
    if (raiz.querySelectorAll) raiz.querySelectorAll('.nn').forEach(preencherUm);
  };

  N.definirModo = function (m) {
    N.modo = m === 'cif' ? 'cif' : 'sol';
    TDZ.storage.set('notacao', N.modo);
    document.documentElement.dataset.notacao = N.modo;
    N.preencher(document);
    window.dispatchEvent(new CustomEvent('tdz:notacao', { detail: N.modo }));
  };

  /* Preenche sozinho qualquer .nn que aparecer na página. */
  N.observar = function () {
    N.preencher(document);
    if (!('MutationObserver' in window)) return;
    new MutationObserver((muts) => {
      for (const m of muts) for (const n of m.addedNodes) if (n.nodeType === 1) N.preencher(n);
    }).observe(document.body, { childList: true, subtree: true });
  };
})();
