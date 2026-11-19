/* =====================================================================
   AUDIO.JS — som gerado na hora com Web Audio API (sem arquivos)
   ---------------------------------------------------------------------
   TDZ.audio.nota(midi, { dur, vel, quando })   → toca uma nota
   TDZ.audio.acorde([midis], { arpejo, dur })   → várias notas
   TDZ.audio.clique(acento, quando)             → clique de metrônomo
   TDZ.audio.criarMetronomo({ bpm, aoBater })   → metrônomo preciso
   midi: 60 = Dó central (C4). 48 = C3.
   Se o navegador não suportar áudio, tudo continua funcionando, só sem som.
   ===================================================================== */
(function () {
  const TDZ = window.TDZ;
  const A = (TDZ.audio = {});
  let ctx = null;
  let saida = null;
  let falhou = false;

  /* Cria o AudioContext só depois de um gesto do usuário (regra dos navegadores). */
  function garantir() {
    if (ctx || falhou) return ctx;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) { falhou = true; return null; }
      ctx = new AC();
      const comp = ctx.createDynamicsCompressor(); // evita estourar quando soam muitas notas
      comp.threshold.value = -14;
      comp.ratio.value = 4;
      saida = ctx.createGain();
      saida.gain.value = 0.75; // VOLUME GERAL (0 a 1)
      saida.connect(comp);
      comp.connect(ctx.destination);
    } catch (e) {
      falhou = true;
      ctx = null;
    }
    return ctx;
  }

  A.desbloquear = function () {
    const c = garantir();
    if (c && c.state === 'suspended') c.resume().catch(() => {});
  };
  // Primeiro gesto em qualquer lugar da página libera o som.
  ['pointerdown', 'keydown', 'touchstart'].forEach((ev) =>
    window.addEventListener(ev, A.desbloquear, { capture: true, passive: true })
  );

  A.disponivel = () => !!ctx && ctx.state === 'running';
  A.freq = (midi) => 440 * Math.pow(2, (midi - 69) / 12);

  /* Nota tipo piano simples: triângulo + harmônico em seno,
     ataque rápido e decaimento exponencial. */
  A.nota = function (midi, op) {
    op = op || {};
    const c = garantir();
    if (!c) return;
    try {
      if (c.state === 'suspended') c.resume().catch(() => {});
      const dur = op.dur || 1.3;
      const vel = op.vel == null ? 0.8 : op.vel;
      const t = c.currentTime + 0.005 + (op.quando || 0);
      const f = A.freq(midi);

      const env = c.createGain();
      env.gain.setValueAtTime(0.0001, t);
      env.gain.exponentialRampToValueAtTime(0.32 * vel, t + 0.008);
      env.gain.exponentialRampToValueAtTime(0.12 * vel, t + 0.25);
      env.gain.exponentialRampToValueAtTime(0.0001, t + dur);

      const filtro = c.createBiquadFilter();
      filtro.type = 'lowpass';
      filtro.frequency.setValueAtTime(Math.min(9000, f * 9), t);
      filtro.frequency.exponentialRampToValueAtTime(Math.max(300, f * 2), t + dur);

      const o1 = c.createOscillator();
      o1.type = 'triangle';
      o1.frequency.value = f;

      const o2 = c.createOscillator();
      o2.type = 'sine';
      o2.frequency.value = f * 2;
      const g2 = c.createGain();
      g2.gain.value = 0.3;

      o1.connect(filtro);
      o2.connect(g2).connect(filtro);
      filtro.connect(env).connect(saida);
      o1.start(t); o2.start(t);
      o1.stop(t + dur + 0.05); o2.stop(t + dur + 0.05);
    } catch (e) { /* sem som, sem drama */ }
  };

  /* Acorde: arpejo = segundos entre cada nota (0 = tudo junto). */
  A.acorde = function (midis, op) {
    op = op || {};
    const arp = op.arpejo || 0;
    const vel = op.vel == null ? 0.6 : op.vel;
    midis.forEach((m, i) => A.nota(m, { dur: op.dur || 1.8, vel, quando: (op.quando || 0) + i * arp }));
  };

  /* Clique de metrônomo; acento = tempo 1 (mais agudo e forte). */
  A.clique = function (acento, quando) {
    const c = garantir();
    if (!c) return;
    try {
      const t = c.currentTime + 0.005 + (quando || 0);
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = 'square';
      o.frequency.value = acento ? 1760 : 1180;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(acento ? 0.22 : 0.12, t + 0.002);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
      o.connect(g).connect(saida);
      o.start(t);
      o.stop(t + 0.06);
    } catch (e) {}
  };

  /* Metrônomo com agendamento antecipado (não "atrasa" como setInterval puro).
     aoBater(indiceDoTempo) é chamado no momento de cada tempo (0, 1, 2, ...). */
  A.criarMetronomo = function (op) {
    let bpm = op.bpm || 72;
    let timer = null;
    let prox = 0;
    let tempo = 0;
    let sessao = 0;

    // Relógio do navegador: continua andando mesmo se o áudio falhar.
    const relogio = () => performance.now() / 1000;

    function agendar() {
      const agora = relogio();
      while (prox < agora + 0.12) {
        const t = tempo;
        const atraso = Math.max(0, prox - agora);
        const minha = sessao;
        A.clique(t % 4 === 0, atraso);
        setTimeout(() => { if (minha === sessao) op.aoBater(t); }, atraso * 1000);
        prox += 60 / bpm;
        tempo++;
      }
    }
    return {
      iniciar() {
        this.parar();
        garantir();
        sessao++;
        tempo = 0;
        prox = relogio() + 0.08;
        agendar();
        timer = setInterval(agendar, 25);
      },
      parar() {
        sessao++;
        clearInterval(timer);
        timer = null;
      },
      definirBpm(v) { bpm = v; },
      get rodando() { return !!timer; },
    };
  };
})();
