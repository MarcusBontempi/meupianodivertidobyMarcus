/* =====================================================================
   AULA 4 · EXERCÍCIOS
   Cada exercício é uma função que monta um "painel". Para adicionar um
   exercício novo: crie uma função montarX(painel), e inclua um item na
   lista EXERCICIOS lá embaixo.
   A checklist do treino no teclado de verdade fica em config.js (treinos).
   ===================================================================== */
TDZ.registrarAula('aula-4', function (el) {
  const N = TDZ.nomes;
  const C = TDZ.config;
  const A = TDZ.audio;

  const placarHTML = (itens) =>
    `<div class="placar">${itens.map(([k, rot]) => `<div>${rot}<b data-p="${k}">0</b></div>`).join('')}</div>`;
  function setPlacar(raiz, k, v, pop) {
    const b = raiz.querySelector(`[data-p="${k}"]`);
    if (!b) return;
    b.textContent = v;
    if (pop) TDZ.anim(b, 'pop');
  }
  const aleatorio = (n) => Math.floor(Math.random() * n);

  /* =================== 1. CAÇA-TECLA =================== */
  function montarCaca(p) {
    p.innerHTML = `
      <span class="kicker">Exercício 1</span>
      <h2>Caça-tecla</h2>
      <p>Aparece o nome de uma nota: clique na tecla certa (qualquer oitava vale). Errou 2 vezes? A tecla certa acende como dica.</p>
      <div class="chips nivel"></div>
      ${placarHTML([['pontos', 'Pontos'], ['seq', 'Sequência'], ['melhor', 'Melhor']])}
      <div class="alvo"><span class="rot">Ache o</span><span class="grande"></span><span class="peq"></span></div>
      <div class="kb-host"></div>
      <p class="msg" aria-live="polite"></p>`;

    let nivel = 'brancas', alvoPc = 0, erros = 0, pontos = 0, seqAtual = 0, melhor = TDZ.storage.get('caca-melhor', 0);
    const alvo = p.querySelector('.alvo');
    const grande = p.querySelector('.grande');
    const peq = p.querySelector('.peq');
    const msg = p.querySelector('.msg');
    let travado = false;
    setPlacar(p, 'melhor', melhor);

    const kb = new TDZ.Teclado(p.querySelector('.kb-host'), {
      oitavas: 2, inicio: 48, nomes: false,
      aoTocar(m) {
        if (travado) return;
        if (m % 12 === alvoPc) {
          kb.feedback(m, 'ok');
          TDZ.anim(alvo, 'ok-pulso');
          seqAtual++;
          pontos += erros === 0 ? 10 + Math.min(seqAtual - 1, 5) * 2 : 3;
          if (seqAtual > melhor) { melhor = seqAtual; TDZ.storage.set('caca-melhor', melhor); setPlacar(p, 'melhor', melhor, true); }
          setPlacar(p, 'pontos', pontos, true);
          setPlacar(p, 'seq', seqAtual, true);
          msg.className = 'msg ok';
          msg.textContent = erros === 0 ? 'Na mosca! ✓' : 'Isso! ✓';
          travado = true;
          setTimeout(novo, 650);
        } else {
          kb.feedback(m, 'erro');
          TDZ.anim(alvo, 'erro-shake');
          erros++;
          seqAtual = 0;
          setPlacar(p, 'seq', 0);
          msg.className = 'msg erro';
          msg.innerHTML = `Essa é ${N.spanAmbos(m % 12)}. Tenta de novo!`;
          if (erros >= 2) {
            kb.midisDoPc(alvoPc).forEach((x) => kb.marcar(x, 'amber', '?'));
            msg.innerHTML += ' <span class="muted">(dica acesa no teclado)</span>';
          }
        }
      },
    });

    function novo() {
      travado = false;
      erros = 0;
      kb.limpar();
      msg.textContent = '';
      const pool = nivel === 'brancas' ? [0, 2, 4, 5, 7, 9, 11] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      let pc;
      do { pc = TDZ.sortear(pool); } while (pc === alvoPc && pool.length > 1);
      alvoPc = pc;
      const s = N.grafar(pc, Math.random() < 0.5); // preta: às vezes # às vezes b
      grande.innerHTML = N.span(s);
      peq.innerHTML = N.ePreta(pc) ? 'tecla preta' : 'tecla branca';
      TDZ.anim(grande, 'troca');
    }

    TDZ.ui.chips(p.querySelector('.nivel'), [
      { valor: 'brancas', html: 'Só brancas' },
      { valor: 'todas', html: 'Brancas + pretas' },
    ], nivel, (v) => { nivel = v; novo(); });

    novo();
  }

  /* =================== 2. MONTE O ACORDE 1 → 3 → 5 (A ORDEM IMPORTA) ===================
     O aluno toca 3 teclas. Só vale se for: 1º o 1, depois o 3, por último o 5,
     sempre subindo (cada tecla à direita da anterior). Acordes maiores.
     Para mudar os acordes sorteados, edite NATURAIS / TODAS abaixo. */
  function montarAcordeOrdem(p) {
    p.innerHTML = `
      <span class="kicker">Exercício 2</span>
      <h2>Monte o acorde 1 → 3 → 5</h2>
      <p>Aparece um acorde. Toque as <strong>3 teclas na ordem</strong>: primeiro o <strong>1</strong>, depois o <strong>3</strong>, por último o <strong>5</strong>, sempre subindo (da esquerda pra direita). Na 3ª tecla o site confere sozinho.</p>
      <div class="chips nivel"></div>
      ${placarHTML([['acertos', 'Acertos'], ['seq', 'Sequência'], ['tentativas', 'Tentativas']])}
      <div class="alvo"><span class="rot">Monte o acorde de</span><span class="grande"></span><span class="peq passo-atual"></span></div>
      <div class="kb-host kb-mini"></div>
      <div class="btn-row">
        <button class="btn" data-btn="limpar">Tentar de novo</button>
        <button class="btn" data-btn="dica">Dica</button>
        <button class="btn" data-btn="nomes">Mostrar nomes</button>
        <button class="btn teal" data-btn="proximo">Próximo →</button>
      </div>
      <p class="msg" aria-live="polite"></p>`;

    const NATURAIS = [0, 2, 4, 5, 7, 9, 11];                 // Dó Ré Mi Fá Sol Lá Si
    const TODAS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];    // + Dó# Ré# Fá# Sol# Lá#
    const SELOS = ['1', '3', '5'];
    const SEMITONS = [0, 4, 7];                              // acorde 1-3-5 (maior)
    let nivel = 'naturais', raizPc = -1, escolhidas = [], travado = false;
    let acertos = 0, tentativas = 0, seqAtual = 0;
    const alvo = p.querySelector('.alvo');
    const grande = p.querySelector('.grande');
    const passo = p.querySelector('.passo-atual');
    const msg = p.querySelector('.msg');
    const nome = (pc) => N.span(N.grafar(pc, false)); // nomes com sustenido
    const notasCertas = () => SEMITONS.map((s) => (raizPc + s) % 12);

    const kb = new TDZ.Teclado(p.querySelector('.kb-host'), {
      oitavas: 2, inicio: 48, nomes: false,
      aoTocar(m) {
        if (travado || escolhidas.length >= 3) return;
        escolhidas.push(m);
        kb.marcar(m, 'blue', SELOS[escolhidas.length - 1]);
        if (escolhidas.length < 3) mostrarPasso();
        else setTimeout(conferir, 250);
      },
    });

    function mostrarPasso() {
      passo.innerHTML = SELOS.map((s, i) =>
        i < escolhidas.length ? `<span style="color:var(--blue)">${s} ●</span>`
          : i === escolhidas.length ? `<strong style="color:var(--amber)">toque o ${s}</strong>` : s
      ).join('  →  ');
    }

    function mostrarResposta(base) {
      kb.limpar();
      const midis = SEMITONS.map((s) => base + s);
      midis.forEach((m, i) => kb.marcar(m, i === 0 ? 'coral' : 'amber', SELOS[i]));
      A.acorde(midis, { arpejo: 0.3, dur: 1.6 });
    }

    function conferir() {
      tentativas++;
      setPlacar(p, 'tentativas', tentativas);
      const certas = notasCertas();
      let erro = -1;
      for (let i = 0; i < 3; i++) if (escolhidas[i] % 12 !== certas[i]) { erro = i; break; }
      const subindo = escolhidas[0] < escolhidas[1] && escolhidas[1] < escolhidas[2];
      travado = true;

      if (erro === -1 && subindo) {
        acertos++; seqAtual++;
        setPlacar(p, 'acertos', acertos, true);
        setPlacar(p, 'seq', seqAtual, true);
        escolhidas.forEach((m, i) => { kb.marcar(m, 'green', SELOS[i]); kb.feedback(m, 'ok'); });
        TDZ.anim(alvo, 'ok-pulso');
        A.acorde(escolhidas, { arpejo: 0.12, dur: 1.8 });
        msg.className = 'msg ok';
        msg.innerHTML = `Isso! Acorde de ${nome(raizPc)} = ${certas.map((pc, i) => `<strong>${SELOS[i]}</strong> ${nome(pc)}`).join(' → ')} ✓`;
        passo.textContent = 'acertou!';
        setTimeout(() => { if (travado) novo(); }, 1600);
        return;
      }

      seqAtual = 0;
      setPlacar(p, 'seq', 0);
      escolhidas.forEach((m) => kb.feedback(m, 'erro'));
      TDZ.anim(alvo, 'erro-shake');
      msg.className = 'msg erro';
      if (erro === 0) msg.innerHTML = `Começou errado: o <strong>1</strong> do acorde de ${nome(raizPc)} é o próprio ${nome(raizPc)}.`;
      else if (erro === 1) msg.innerHTML = `O 1 está certo! Mas o <strong>3</strong> é ${nome(certas[1])}.`;
      else if (erro === 2) msg.innerHTML = `1 e 3 certos! Faltou o <strong>5</strong>: é ${nome(certas[2])}.`;
      else msg.innerHTML = `As notas estão certas, mas a ordem tem que <strong>subir</strong>: o 3 à direita do 1, e o 5 à direita do 3.`;
      msg.innerHTML += ' <span class="muted">Olha a resposta no teclado.</span>';
      passo.textContent = 'resposta: 1 → 3 → 5';
      const base = erro !== 0 && escolhidas[0] + 7 <= 72 ? escolhidas[0] : 48 + raizPc;
      setTimeout(() => mostrarResposta(base), 450);
    }

    function recomecar() {
      escolhidas = [];
      travado = false;
      kb.limpar();
      msg.textContent = '';
      mostrarPasso();
    }

    function novo() {
      const pool = nivel === 'naturais' ? NATURAIS : TODAS;
      let pc;
      do { pc = TDZ.sortear(pool); } while (pc === raizPc && pool.length > 1);
      raizPc = pc;
      grande.innerHTML = nome(pc);
      TDZ.anim(grande, 'troca');
      recomecar();
    }

    const acoes = {
      limpar: recomecar,
      proximo: novo,
      dica() {
        kb.midisDoPc(raizPc).forEach((m) => kb.piscar(m, 'amber', 1200));
        msg.className = 'msg';
        msg.innerHTML = `Dica: o <strong>1</strong> é ${nome(raizPc)} (piscando no teclado). O 3 e o 5 vêm à direita dele.`;
      },
      nomes(b) {
        kb.mostrarNomes(!kb.nomesVisiveis);
        b.textContent = kb.nomesVisiveis ? 'Esconder nomes' : 'Mostrar nomes';
      },
    };
    p.querySelectorAll('[data-btn]').forEach((b) => b.addEventListener('click', () => acoes[b.dataset.btn](b)));

    TDZ.ui.chips(p.querySelector('.nivel'), [
      { valor: 'naturais', html: 'Naturais' },
      { valor: 'todas', html: 'Naturais + sustenidos' },
    ], nivel, (v) => { nivel = v; novo(); });

    novo();
  }

  /* =================== 3. ACORDE LIVRE (qualquer ordem) =================== */
  function montarAcorde(p) {
    p.innerHTML = `
      <span class="kicker">Exercício 3</span>
      <h2>Acorde livre</h2>
      <p>Selecione as <strong>3 notas</strong> do acorde (em qualquer oitava) e clique em <strong>Conferir</strong>. Clicar de novo numa tecla tira a seleção.</p>
      ${placarHTML([['acertos', 'Acertos'], ['tentativas', 'Tentativas']])}
      <div class="alvo"><span class="rot">Monte</span><span class="grande"></span><span class="peq"></span></div>
      <div class="kb-host"></div>
      <div class="btn-row">
        <button class="btn primario" data-btn="conferir">Conferir</button>
        <button class="btn" data-btn="limpar">Limpar</button>
        <button class="btn teal" data-btn="proximo">Próximo →</button>
      </div>
      <p class="msg" aria-live="polite"></p>`;

    let raiz, q, sel = new Set(), acertos = 0, tentativas = 0, conferido = false;
    const alvo = p.querySelector('.alvo');
    const grande = p.querySelector('.grande');
    const peq = p.querySelector('.peq');
    const msg = p.querySelector('.msg');

    const kb = new TDZ.Teclado(p.querySelector('.kb-host'), {
      oitavas: 2, inicio: 48, nomes: false,
      aoTocar(m) {
        if (conferido) { conferido = false; kb.limpar(); sel.clear(); msg.textContent = ''; }
        if (sel.has(m)) { sel.delete(m); kb.desmarcar(m); }
        else { sel.add(m); kb.marcar(m, 'blue'); }
      },
    });

    function novo() {
      const pc = aleatorio(12);
      q = Math.random() < 0.5 ? 'maj' : 'min';
      raiz = N.grafarNoTom(pc);
      sel.clear();
      conferido = false;
      kb.limpar();
      msg.textContent = '';
      grande.innerHTML = N.spanAcorde(raiz, q);
      peq.innerHTML = q === 'maj' ? 'graus 1 · 3 · 5' : 'graus 1 · ♭3 · 5';
      TDZ.anim(grande, 'troca');
    }

    function conferir() {
      if (sel.size === 0) { msg.className = 'msg erro'; msg.textContent = 'Selecione as notas primeiro.'; TDZ.anim(alvo, 'erro-shake'); return; }
      tentativas++;
      setPlacar(p, 'tentativas', tentativas);
      const st = N.semitonsTriade(q);
      const r = N.pc(raiz);
      const certo = new Set(st.map((s) => (r + s) % 12));
      const escolhido = new Set(Array.from(sel).map((m) => m % 12));
      const ok = certo.size === escolhido.size && Array.from(certo).every((x) => escolhido.has(x));
      const notas = N.triade(raiz, q);
      const selos = q === 'maj' ? ['1', '3', '5'] : ['1', '♭3', '5'];
      const midis = st.map((s) => 48 + r + s);
      conferido = true;
      if (ok) {
        acertos++;
        setPlacar(p, 'acertos', acertos, true);
        sel.forEach((m) => { kb.marcar(m, 'green'); kb.feedback(m, 'ok'); });
        TDZ.anim(alvo, 'ok-pulso');
        msg.className = 'msg ok';
        msg.innerHTML = `Isso! ${N.spanAcorde(raiz, q)} = ${notas.map((s) => N.span(s)).join(' · ')} ✓`;
        A.acorde(Array.from(sel).sort((a, b) => a - b), { arpejo: 0.08 });
      } else {
        sel.forEach((m) => kb.feedback(m, 'erro'));
        TDZ.anim(alvo, 'erro-shake');
        setTimeout(() => {
          kb.limpar();
          midis.forEach((m, i) => kb.marcar(m, i === 0 ? 'coral' : 'amber', selos[i]));
          A.acorde(midis, { arpejo: 0.25 });
        }, 400);
        msg.className = 'msg erro';
        msg.innerHTML = `Quase. A resposta: ${notas.map((s, i) => `<strong>${selos[i]}</strong> ${N.span(s)}`).join(' · ')}`;
      }
    }

    const acoes = {
      conferir,
      limpar() { sel.clear(); kb.limpar(); msg.textContent = ''; conferido = false; },
      proximo: novo,
    };
    p.querySelectorAll('[data-btn]').forEach((b) => b.addEventListener('click', () => acoes[b.dataset.btn]()));
    novo();
  }

  /* =================== 4. OUVIDO DE LINCE ===================
     O site toca uma tecla escondida. O aluno escolhe a tecla no tecladinho
     e clica em Verificar. Vale a mesma nota (os dois Dós contam igual).
     Para mudar as notas sorteadas, edite NATURAIS / TODAS abaixo. */
  function montarOuvido(p) {
    p.innerHTML = `
      <span class="kicker">Exercício 4</span>
      <h2>Ouvido de lince</h2>
      <p>Aperte <strong>▶</strong> e escute uma tecla. Depois toque no tecladinho a tecla que você acha que é e clique em <strong>Verificar</strong>. Aqui as teclas <strong>não fazem som</strong>: confie no seu ouvido!</p>
      <div class="chips nivel"></div>
      ${placarHTML([['acertos', 'Acertos'], ['seq', 'Sequência'], ['tentativas', 'Tentativas']])}
      <div class="alvo ouvido-alvo">
        <button type="button" class="btn-play" data-btn="play" aria-label="Tocar o som">▶</button>
        <span class="peq escolha">Aperte ▶ para ouvir</span>
      </div>
      <div class="kb-host kb-mini"></div>
      <div class="btn-row">
        <button class="btn primario" data-btn="verificar">Verificar</button>
        <button class="btn" data-btn="referencia">Ouvir o ${N.span({ l: 0, a: 0 })} (referência)</button>
        <button class="btn" data-btn="nomes">Mostrar nomes</button>
        <button class="btn" data-btn="pular">Pular →</button>
      </div>
      <p class="msg" aria-live="polite"></p>`;

    const NATURAIS = [0, 2, 4, 5, 7, 9, 11];
    const TODAS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const BASE = 60; // tecladinho de 1 oitava a partir do Dó central
    let nivel = 'naturais', alvoPc = -1, escolhida = null, ouviu = false, travado = false;
    let acertos = 0, tentativas = 0, seqAtual = 0;
    const alvo = p.querySelector('.alvo');
    const escolha = p.querySelector('.escolha');
    const msg = p.querySelector('.msg');
    const play = p.querySelector('.btn-play');

    const kb = new TDZ.Teclado(p.querySelector('.kb-host'), {
      oitavas: 1, inicio: BASE, nomes: false,
      som: false, // SEM SOM nas teclas: assim não dá pra "colar" testando tecla por tecla
      aoTocar(m) {
        if (travado) return;
        if (escolhida !== null) kb.desmarcar(escolhida);
        escolhida = m;
        kb.marcar(m, 'blue', '?');
        escolha.innerHTML = 'Sua escolha está marcada. Clique em <strong>Verificar</strong>.';
        msg.textContent = '';
      },
    });

    function tocarAlvo() {
      if (alvoPc < 0) sortear();
      ouviu = true;
      TDZ.audio.nota(BASE + alvoPc, { dur: 1.4 });
      TDZ.anim(play, 'tocando');
      if (escolhida === null) escolha.textContent = 'Agora toque a tecla que você ouviu.';
    }

    function sortear() {
      const pool = nivel === 'naturais' ? NATURAIS : TODAS;
      let pc;
      do { pc = TDZ.sortear(pool); } while (pc === alvoPc && pool.length > 1);
      alvoPc = pc;
    }

    function novaRodada(tocar) {
      sortear();
      escolhida = null;
      travado = false;
      kb.limpar();
      msg.textContent = '';
      escolha.textContent = tocar ? 'Ouça e toque a tecla.' : 'Aperte ▶ para ouvir';
      if (tocar) setTimeout(tocarAlvo, 250);
    }

    function verificar() {
      if (travado) return;
      if (!ouviu) { msg.className = 'msg erro'; msg.textContent = 'Primeiro aperte ▶ para ouvir o som.'; TDZ.anim(play, 'erro-shake'); return; }
      if (escolhida === null) { msg.className = 'msg erro'; msg.textContent = 'Escolha uma tecla no tecladinho primeiro.'; TDZ.anim(alvo, 'erro-shake'); return; }
      tentativas++;
      setPlacar(p, 'tentativas', tentativas);
      if (escolhida % 12 === alvoPc) {
        acertos++; seqAtual++;
        setPlacar(p, 'acertos', acertos, true);
        setPlacar(p, 'seq', seqAtual, true);
        travado = true;
        kb.marcar(escolhida, 'green', '✓');
        kb.feedback(escolhida, 'ok');
        TDZ.anim(alvo, 'ok-pulso');
        msg.className = 'msg ok grande-msg';
        msg.innerHTML = `Certa resposta! ✓ Era ${N.spanAmbos(alvoPc)}.`;
        escolha.textContent = 'Preparando um novo som…';
        setTimeout(() => novaRodada(true), 1500);
      } else {
        seqAtual = 0;
        setPlacar(p, 'seq', 0);
        kb.feedback(escolhida, 'erro');
        kb.desmarcar(escolhida);
        escolhida = null;
        TDZ.anim(alvo, 'erro-shake');
        msg.className = 'msg erro grande-msg';
        msg.textContent = 'Errado — ouça novamente com calma.';
        escolha.textContent = 'Aperte ▶ de novo e compare.';
      }
    }

    const acoes = {
      play: tocarAlvo,
      verificar,
      referencia() { TDZ.audio.nota(BASE, { dur: 1.4 }); kb.piscar(BASE, 'amber', 600); },
      nomes(b) {
        kb.mostrarNomes(!kb.nomesVisiveis);
        b.textContent = kb.nomesVisiveis ? 'Esconder nomes' : 'Mostrar nomes';
      },
      pular() { seqAtual = 0; setPlacar(p, 'seq', 0); novaRodada(ouviu); },
    };
    p.querySelectorAll('[data-btn]').forEach((b) => b.addEventListener('click', () => acoes[b.dataset.btn](b)));

    TDZ.ui.chips(p.querySelector('.nivel'), [
      { valor: 'naturais', html: 'Naturais' },
      { valor: 'todas', html: 'Naturais + sustenidas' },
    ], nivel, (v) => { nivel = v; novaRodada(ouviu); });

    novaRodada(false);
  }

  /* =================== 5. TREINO NO TECLADO DE VERDADE =================== */
  function montarTreino(p) {
    const salvo = TDZ.storage.get('treinos', {});
    p.innerHTML = `
      <span class="kicker">Exercício 5</span>
      <h2>Treino no teclado de verdade</h2>
      <p>Longe da tela, no seu teclado. Marque o que já fez: fica salvo neste navegador.</p>
      <div class="progresso" aria-hidden="true"><i></i></div>
      <p class="dica conta"></p>
      <ul class="checklist">${C.treinos.map((t, i) =>
        `<li><label><input type="checkbox" data-i="${i}"${salvo[t] ? ' checked' : ''}><span>${t}</span></label></li>`).join('')}
      </ul>
      <div class="btn-row"><button class="btn" data-btn="zerar">Desmarcar tudo</button></div>`;

    const barra = p.querySelector('.progresso i');
    const conta = p.querySelector('.conta');
    const caixas = p.querySelectorAll('input[type="checkbox"]');
    function atualizar() {
      const feitos = Array.from(caixas).filter((c) => c.checked).length;
      barra.style.width = (feitos / caixas.length) * 100 + '%';
      conta.textContent = feitos === caixas.length ? `Tudo feito! ${feitos} de ${caixas.length} 🎉` : `${feitos} de ${caixas.length} feitos`;
    }
    caixas.forEach((c) => c.addEventListener('change', () => {
      const estado = TDZ.storage.get('treinos', {});
      const chave = C.treinos[+c.dataset.i];
      if (c.checked) estado[chave] = true; else delete estado[chave];
      TDZ.storage.set('treinos', estado);
      if (c.checked) TDZ.anim(c.closest('li'), 'ok-pulso');
      atualizar();
    }));
    p.querySelector('[data-btn="zerar"]').addEventListener('click', () => {
      caixas.forEach((c) => (c.checked = false));
      TDZ.storage.set('treinos', {});
      atualizar();
    });
    atualizar();
  }

  /* =================== MONTAGEM DA AULA =================== */
  const EXERCICIOS = [
    { id: 'caca', nome: '1 · Caça-tecla', montar: montarCaca },
    { id: 'ordem', nome: '2 · Monte o acorde 1-3-5', montar: montarAcordeOrdem },
    { id: 'acorde', nome: '3 · Acorde livre', montar: montarAcorde },
    { id: 'ouvido', nome: '4 · Ouvido de lince', montar: montarOuvido },
    { id: 'treino', nome: '5 · Treino real', montar: montarTreino },
  ];

  el.innerHTML = `
    <div class="stack">
      <header class="hero reveal">
        <span class="kicker">Aula 4 · Exercícios</span>
        <h1>Hora de <em>treinar</em>.</h1>
        <p class="lead">Cinco exercícios, do mais simples ao mais desafiador. Escolha um, jogue, volte amanhã e bata o seu placar.</p>
      </header>
      <div class="reveal">
        <div class="subabas" role="tablist">${EXERCICIOS.map((e) =>
          `<button class="btn" role="tab" data-ex="${e.id}" aria-selected="false" aria-controls="painel-${e.id}">${e.nome}</button>`).join('')}
        </div>
        ${EXERCICIOS.map((e) => `<article class="card card-kb painel" role="tabpanel" id="painel-${e.id}" hidden></article>`).join('')}
      </div>
    </div>`;

  const montados = {};
  function abrir(id) {
    EXERCICIOS.forEach((e) => {
      const painel = el.querySelector('#painel-' + e.id);
      const ativo = e.id === id;
      el.querySelector(`[data-ex="${e.id}"]`).setAttribute('aria-selected', ativo ? 'true' : 'false');
      if (ativo && !montados[e.id]) { e.montar(painel); montados[e.id] = true; }
      painel.hidden = !ativo;
      if (ativo) TDZ.anim(painel, 'entrando');
    });
    TDZ.storage.set('exercicio', id);
  }
  el.querySelectorAll('[data-ex]').forEach((b) => b.addEventListener('click', () => abrir(b.dataset.ex)));

  const ultimo = TDZ.storage.get('exercicio', 'caca');
  abrir(EXERCICIOS.some((e) => e.id === ultimo) ? ultimo : 'caca');

});
