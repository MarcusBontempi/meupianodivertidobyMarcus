/* =====================================================================
   AULA 2 · ACORDE 1 · 3 · 5
   Versão simples: 1-3-5 como "receita" de acorde, sem teoria de
   intervalos. Para editar os textos, mexa no HTML de el.innerHTML.
   ===================================================================== */
TDZ.registrarAula('aula-2', function (el) {
  const N = TDZ.nomes;
  const seq = TDZ.criarSequencia();
  const SELOS = ['1', '3', '5'];
  const SEMITONS = [0, 4, 7]; // posição das 3 notas a partir do 1 (uso interno)
  let notaPc = 0; // 0 = Dó. Muda pelos chips.

  el.innerHTML = `
  <div class="stack">
    <header class="hero reveal">
      <span class="kicker">Aula 2 · Acorde 1-3-5</span>
      <h1>Seu primeiro acorde: <em>1 · 3 · 5</em>.</h1>
      <p class="lead">Acorde é tocar <strong>três notas ao mesmo tempo</strong>. A receita mais usada no louvor tem nome de número: <strong>1, 3 e 5</strong>. Escolha o acorde, o site mostra as três teclas, você toca.</p>
    </header>

    <article class="card card-kb reveal">
      <span class="kicker">Escolha o acorde</span>
      <div class="chips-tom"></div>
      <div class="faixa faixa-135"></div>
      <div class="btn-row">
        <button class="btn primario" data-acao="mostrar">Mostrar 1 · 3 · 5</button>
        <button class="btn" data-acao="umaauma">Tocar 1 → 3 → 5</button>
        <button class="btn coral" data-acao="juntas">Tocar as 3 juntas</button>
        <button class="btn" data-acao="limpar">Limpar</button>
      </div>
      <div class="kb-host"></div>
    </article>

    <div class="grid-3">
      <article class="card acento reveal" style="--c:var(--coral)">
        <span class="kicker">Nome</span>
        <h2>O 1 dá o nome</h2>
        <p>O <strong>1</strong> é a nota que dá nome ao acorde: o acorde de ${N.span({ l: 0, a: 0 })} começa no ${N.span({ l: 0, a: 0 })}.</p>
        <p>O <strong>3</strong> e o <strong>5</strong> são as duas notas que completam.</p>
      </article>

      <article class="card acento reveal" style="--c:var(--amber)">
        <span class="kicker">Mão direita</span>
        <h2>Dedos 1, 3 e 5</h2>
        <p>Polegar no <strong>1</strong>, médio no <strong>3</strong>, mindinho no <strong>5</strong>. O número do dedo é o mesmo número da nota.</p>
        <p class="dica">Os dedos 2 e 4 ficam no ar, sem tocar.</p>
      </article>

      <article class="card acento reveal" style="--c:var(--teal)">
        <span class="kicker">Ordem</span>
        <h2>Sempre 1 → 3 → 5</h2>
        <p>Monte de baixo pra cima: <strong>primeiro o 1</strong>, depois o 3, por último o 5, cada um à direita do anterior.</p>
        <p class="dica">Em alguns acordes uma das notas é preta (veja o de ${N.span({ l: 1, a: 0 })}). Não decore regra: decore o <strong>desenho</strong> no teclado.</p>
      </article>
    </div>
  </div>`;

  const kb = new TDZ.Teclado(el.querySelector('.kb-host'), { oitavas: 2, inicio: 48, nomes: true });
  const faixa = el.querySelector('.faixa-135');

  const raiz = () => N.grafarNoTom(notaPc);
  const midis = () => SEMITONS.map((s) => 48 + notaPc + s);

  function desenharFaixa() {
    const notas = N.triade(raiz(), 'maj');
    faixa.innerHTML =
      notas.map((s, i) => `<span class="pill"><b>${SELOS[i]}</b> · ${N.span(s)}</span>`).join('<span class="seta">+</span>') +
      `<span class="igual">= acorde de ${N.span(raiz())}</span>`;
  }

  function marcar() {
    kb.limpar();
    midis().forEach((m, i) => kb.marcar(m, i === 0 ? 'coral' : 'amber', SELOS[i]));
  }

  const acoes = {
    mostrar() { seq.parar(); marcar(); },
    umaauma() {
      kb.limpar();
      const ms = midis();
      const pills = faixa.querySelectorAll('.pill');
      seq.rodar(async (esperar) => {
        for (let i = 0; i < 3; i++) {
          pills.forEach((p) => p.classList.remove('on'));
          pills[i].classList.add('on');
          kb.marcar(ms[i], i === 0 ? 'coral' : 'amber', SELOS[i]);
          kb.tocar(ms[i], { dur: 1 });
          await esperar(450);
        }
        await esperar(300);
        pills.forEach((p) => p.classList.remove('on'));
      });
    },
    juntas() {
      seq.parar();
      marcar();
      midis().forEach((m) => kb.tocar(m, { som: false }));
      TDZ.audio.acorde(midis(), { dur: 2 });
    },
    limpar() { seq.parar(); kb.limpar(); },
  };
  el.querySelectorAll('[data-acao]').forEach((b) => b.addEventListener('click', () => acoes[b.dataset.acao]()));

  TDZ.ui.chips(
    el.querySelector('.chips-tom'),
    Array.from({ length: 12 }, (_, pc) => ({ valor: pc, html: N.span(N.grafarNoTom(pc)) })),
    notaPc,
    (pc) => {
      notaPc = pc;
      desenharFaixa();
      acoes.juntas();
      kb.rolarPara(48 + pc);
    }
  );

  desenharFaixa();
  marcar();
});
