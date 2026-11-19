/* =====================================================================
   MAIN.JS — navegação por hash, loading, toggle de notação, rodapé
   ---------------------------------------------------------------------
   As abas são montadas a partir de TDZ.config.modulos (config.js).
   Rotas: #inicio, #aula-1, #aula-2 ... (o id de cada aula no config).
   ===================================================================== */
(function () {
  const TDZ = window.TDZ;
  const C = TDZ.config;
  const N = TDZ.nomes;
  const inicioCarregamento = performance.now();

  const app = document.getElementById('app');
  const abas = document.getElementById('abas');
  const secoes = {};
  let atual = null;
  let navToken = 0;

  /* Em qual módulo está uma aula? */
  function moduloDa(id) {
    return C.modulos.find((m) => m.aulas.some((a) => a.id === id)) || null;
  }
  let moduloAtual = C.modulos[0];

  /* ---------- Cabeçalho e rodapé ---------- */
  function montarCabecalho() {
    const m = moduloAtual;
    document.getElementById('marca-kicker').textContent = `MÓDULO ${m.numero} · ${m.nome.toUpperCase()}`;
    document.getElementById('marca-nome').textContent = C.site.nome;

    abas.innerHTML = '';
    const links = [{ id: 'inicio', aba: 'Início' }].concat(m.aulas);
    links.forEach((a) => {
      const el = document.createElement('a');
      el.href = '#' + a.id;
      el.textContent = a.aba;
      el.dataset.rota = a.id;
      abas.appendChild(el);
    });

    // Seletor de módulo: só aparece quando existir mais de um módulo no config.
    if (C.modulos.length > 1) {
      const sel = document.createElement('select');
      sel.className = 'seletor-modulo';
      sel.setAttribute('aria-label', 'Escolher módulo');
      C.modulos.forEach((mod) => {
        const op = document.createElement('option');
        op.value = mod.id;
        op.textContent = `Módulo ${mod.numero} · ${mod.nome}`;
        op.selected = mod === m;
        sel.appendChild(op);
      });
      sel.addEventListener('change', () => {
        const novo = C.modulos.find((x) => x.id === sel.value);
        if (novo && novo.aulas[0]) location.hash = '#' + novo.aulas[0].id;
      });
      abas.appendChild(sel);
    }
    marcarAbaAtiva();
  }

  function montarRodape() {
    const m = moduloAtual;
    document.getElementById('assinatura').textContent = C.instrutor.nome;
    document.getElementById('rodape-papel').textContent = C.instrutor.papelRodape;
    document.getElementById('rodape-versao').textContent = `Módulo ${m.numero} · ${m.nome} · ${C.site.versao}`;
  }

  /* No celular deitado as abas rolam de lado: centraliza a aba ativa. */
  function centralizarAba() {
    const ativa = abas.querySelector('[aria-current="page"]');
    if (!ativa || abas.scrollWidth <= abas.clientWidth) return;
    abas.scrollLeft = ativa.offsetLeft - abas.offsetLeft - (abas.clientWidth - ativa.offsetWidth) / 2;
  }

  function marcarAbaAtiva() {
    TDZ.$$('a[data-rota]', abas).forEach((a) => {
      if (a.dataset.rota === atual) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    centralizarAba();
  }

  /* ---------- Toggle de notação ---------- */
  function montarNotacao() {
    const botoes = TDZ.$$('.notacao button');
    const sync = () => botoes.forEach((b) => b.setAttribute('aria-pressed', b.dataset.notacao === N.modo ? 'true' : 'false'));
    botoes.forEach((b) => b.addEventListener('click', () => { N.definirModo(b.dataset.notacao); sync(); }));
    document.documentElement.dataset.notacao = N.modo;
    sync();
  }

  /* ---------- Rotas ---------- */
  function rotaDoHash() {
    const id = (location.hash || '').replace(/^#\/?/, '') || 'inicio';
    return TDZ.aulas[id] ? id : 'inicio';
  }

  async function irPara(id) {
    if (id === atual) return;
    const meu = ++navToken;
    const velha = atual ? secoes[atual] : null;
    atual = id;

    const mod = moduloDa(id);
    if (mod && mod !== moduloAtual) { moduloAtual = mod; montarCabecalho(); montarRodape(); }
    marcarAbaAtiva();
    window.dispatchEvent(new CustomEvent('tdz:rota', { detail: id }));

    // Cria a seção da aula só na primeira visita (depois ela guarda o estado).
    let nova = secoes[id];
    if (!nova) {
      nova = document.createElement('section');
      nova.className = 'view';
      nova.id = 'view-' + id;
      nova.hidden = true;
      app.appendChild(nova);
      try {
        TDZ.aulas[id](nova);
      } catch (e) {
        console.error('Erro ao montar a aula', id, e);
        nova.innerHTML = '<div class="card"><h2>Ops!</h2><p>Essa aula não carregou. Veja o console.</p></div>';
      }
      secoes[id] = nova;
    }

    if (velha && velha !== nova) {
      velha.classList.add('saindo');
      await TDZ.sleep(TDZ.movimentoReduzido() ? 0 : 150);
      velha.hidden = true;
      velha.classList.remove('saindo');
    }
    if (meu !== navToken) return; // o usuário já clicou em outra aba

    nova.hidden = false;
    TDZ.anim(nova, 'entrando');
    window.scrollTo(0, 0);
    TDZ.ui.revelar(nova);

    const titulo = id === 'inicio' ? '' : ((mod && mod.aulas.find((a) => a.id === id)) || {}).titulo;
    document.title = (titulo ? titulo + ' · ' : '') + C.site.nome;
  }

  /* ---------- Loading ---------- */
  function esconderLoading() {
    const minimo = TDZ.movimentoReduzido() ? 300 : 1200;
    const falta = Math.max(0, minimo - (performance.now() - inicioCarregamento));
    setTimeout(() => {
      const l = document.getElementById('loading');
      if (!l) return;
      l.classList.add('sumiu');
      document.body.classList.remove('carregando');
      setTimeout(() => l.remove(), 600);
    }, falta);
  }

  /* ---------- Início ---------- */
  document.body.classList.add('carregando');
  N.observar();
  montarNotacao();
  montarCabecalho();
  montarRodape();
  // Recentraliza quando as fontes terminam de carregar ou o celular gira.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(centralizarAba);
  window.addEventListener('resize', centralizarAba);
  window.addEventListener('hashchange', () => irPara(rotaDoHash()));
  irPara(rotaDoHash());

  if (document.readyState === 'complete') esconderLoading();
  else window.addEventListener('load', esconderLoading);
  // Garantia: se alguma fonte demorar demais, some mesmo assim.
  setTimeout(esconderLoading, 4000);
})();
