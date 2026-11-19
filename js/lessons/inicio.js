/* =====================================================================
   INÍCIO — página de entrada
   Os textos (título, subtítulo, "como usar", bio, aulas) vêm do config.js.
   ===================================================================== */
TDZ.registrarAula('inicio', function (el) {
  const C = TDZ.config;
  const cores = ['var(--amber)', 'var(--coral)', 'var(--teal)', 'var(--blue)'];

  // Título: a última palavra fica em destaque (âmbar).
  const partes = C.site.nome.split(' ');
  const ultima = partes.pop();

  const cardsAulas = C.modulos.map((m) => `
    ${C.modulos.length > 1 ? `<h2 class="reveal" style="margin-top:10px">Módulo ${m.numero} · ${m.nome}</h2>` : ''}
    <div class="aulas-grid">
      ${m.aulas.map((a, i) => `
        <a class="aula-card reveal" href="#${a.id}" style="--c:${cores[i % cores.length]}">
          <span class="num">${a.numero}</span>
          <h3>${a.titulo}</h3>
          <p>${a.descricao}</p>
          <span class="ir">Abrir aula →</span>
        </a>`).join('')}
    </div>`).join('');

  el.innerHTML = `
    <div class="stack">
      <header class="hero inicio-hero reveal">
        <span class="kicker">Módulo ${C.modulos[0].numero} · ${C.modulos[0].nome} · aulas de teclado</span>
        <h1>${partes.join(' ')} <span>${ultima}</span></h1>
        <p class="lead">${C.site.subtitulo}</p>
      </header>

      <div class="card card-kb reveal">
        <span class="kicker">Aquece aqui</span>
        <h2>Encosta numa tecla</h2>
        <p class="muted">Clique (ou toque) nas teclas: elas fazem som. Todo teclado deste site funciona assim.</p>
        <div class="kb-host"></div>
      </div>

      <div class="grid-2">
        <article class="card acento reveal" style="--c:var(--amber)">
          <span class="kicker">Antes de começar</span>
          <h2>Como usar</h2>
          <ul class="lista">${C.comoUsar.map((t) => `<li>${t}</li>`).join('')}</ul>
        </article>

        <article class="card instrutor reveal">
          <span class="papel">${C.instrutor.papel}</span>
          <p class="nome">${C.instrutor.nome}</p>
          <p class="bio">${C.instrutor.bio}</p>
          <div class="tags">${(C.instrutor.tags || []).map((t) => `<span>${t}</span>`).join('')}</div>
        </article>
      </div>

      <div>
        <span class="kicker reveal">O caminho</span>
        ${cardsAulas}
      </div>
    </div>`;

  const kb = new TDZ.Teclado(el.querySelector('.kb-host'), { oitavas: 1, inicio: 60, nomes: true });
  // Dó marcado como "ponto de partida"
  kb.marcar(60, 'amber', '★');
});
