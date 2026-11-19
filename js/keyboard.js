/* =====================================================================
   KEYBOARD.JS — componente de teclado reutilizável
   ---------------------------------------------------------------------
   const kb = new TDZ.Teclado(elemento, {
     oitavas: 2,        // quantas oitavas
     inicio: 48,        // nota inicial (48 = C3)
     nomes: true,       // mostrar nomes nas teclas
     som: true,         // tocar som ao clicar
     aoTocar: (midi, kb) => { ... }  // chamado quando o aluno toca uma tecla
   });

   Métodos:
     kb.marcar(midi, 'amber', '1')  → pinta a tecla e põe um selo (cores:
                                      amber, coral, teal, blue, green, red)
     kb.desmarcar(midi)  kb.limpar()
     kb.mostrarNomes(true/false)
     kb.piscar(midi, 'amber', ms)    → brilho rápido
     kb.tocar(midi)                  → afunda a tecla e toca o som
     kb.feedback(midi, 'ok'|'erro')  → pulso verde ou shake vermelho
     kb.midisDoPc(pc)                → todas as teclas de uma nota (ex.: todos os Dós)
   ===================================================================== */
(function () {
  const TDZ = window.TDZ;
  const N = TDZ.nomes;
  const CORES = ['amber', 'coral', 'teal', 'blue', 'green', 'red'];

  class Teclado {
    constructor(alvo, opcoes) {
      this.o = Object.assign({ oitavas: 2, inicio: 48, nomes: true, som: true, aoTocar: null }, opcoes || {});
      this.teclas = new Map();
      this.nomesVisiveis = this.o.nomes;

      this.raiz = document.createElement('div');
      this.raiz.className = 'kb-scroll';
      this.kb = document.createElement('div');
      this.kb.className = 'kb';

      const fim = this.o.inicio + 12 * this.o.oitavas; // termina num Dó, fica mais bonito
      let brancas = 0;
      for (let m = this.o.inicio; m <= fim; m++) {
        const pc = m % 12;
        const preta = N.ePreta(pc);
        const t = document.createElement('button');
        t.type = 'button';
        t.className = 'key ' + (preta ? 'black' : 'white');
        t.dataset.midi = m;
        t.setAttribute('aria-label', N.ambos(pc, 'sol') + ' (' + N.ambos(pc, 'cif') + ')');
        if (preta) {
          t.style.setProperty('--wi', brancas);
          t.innerHTML =
            '<span class="badge"></span><span class="lbl">' +
            N.span(N.grafar(pc, false)) + N.span(N.grafar(pc, true)) + '</span>';
        } else {
          brancas++;
          t.innerHTML = '<span class="badge"></span><span class="lbl">' + N.span(N.grafar(pc)) + '</span>';
        }
        this.kb.appendChild(t);
        this.teclas.set(m, t);
      }
      this.kb.style.setProperty('--n', brancas);

      this.kb.addEventListener('pointerdown', (e) => {
        const t = e.target.closest('.key');
        if (!t || (e.pointerType === 'mouse' && e.button !== 0)) return;
        this._acionar(+t.dataset.midi);
      });
      this.kb.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('key')) {
          e.preventDefault();
          this._acionar(+e.target.dataset.midi);
        }
      });
      this.kb.addEventListener('contextmenu', (e) => e.preventDefault());

      if (!this.o.nomes) this.raiz.classList.add('sem-nomes');
      this.raiz.appendChild(this.kb);
      alvo.appendChild(this.raiz);
      N.preencher(this.raiz);
    }

    _acionar(m) {
      this.tocar(m);
      if (this.o.aoTocar) this.o.aoTocar(m, this);
    }

    tecla(m) { return this.teclas.get(m); }
    get midis() { return Array.from(this.teclas.keys()); }
    midisDoPc(pc) { return this.midis.filter((m) => m % 12 === ((pc % 12) + 12) % 12); }

    tocar(m, op) {
      op = op || {};
      const t = this.teclas.get(m);
      if (t) {
        t.classList.remove('down');
        void t.offsetWidth;
        t.classList.add('down');
        clearTimeout(t._down);
        t._down = setTimeout(() => t.classList.remove('down'), 200);
      }
      if (op.som !== false && this.o.som) TDZ.audio.nota(m, { dur: op.dur, vel: op.vel });
    }

    marcar(m, cor, selo) {
      const t = this.teclas.get(m);
      if (!t) return;
      CORES.forEach((c) => t.classList.remove('c-' + c));
      t.classList.add('marcada', 'c-' + (cor || 'amber'));
      const b = t.querySelector('.badge');
      b.innerHTML = selo || '';
      t.classList.toggle('com-selo', !!selo);
    }

    desmarcar(m) {
      const t = this.teclas.get(m);
      if (!t) return;
      CORES.forEach((c) => t.classList.remove('c-' + c));
      t.classList.remove('marcada', 'com-selo');
      t.querySelector('.badge').innerHTML = '';
    }

    limpar() { this.teclas.forEach((_, m) => this.desmarcar(m)); }

    mostrarNomes(v) {
      this.nomesVisiveis = !!v;
      this.raiz.classList.toggle('sem-nomes', !v);
    }

    piscar(m, cor, ms) {
      const t = this.teclas.get(m);
      if (!t) return;
      const cls = 'pisca-' + (cor || 'amber');
      t.classList.add(cls);
      setTimeout(() => t.classList.remove(cls), ms || 450);
    }

    feedback(m, tipo) {
      TDZ.anim(this.teclas.get(m), tipo === 'ok' ? 'fb-ok' : 'fb-erro');
    }

    /* No celular, rola o teclado até a tecla ficar visível. */
    rolarPara(m) {
      const t = this.teclas.get(m);
      const r = this.raiz;
      if (!t || r.scrollWidth <= r.clientWidth) return;
      const alvo = t.offsetLeft - r.clientWidth / 2 + t.offsetWidth / 2;
      try { r.scrollTo({ left: alvo, behavior: TDZ.movimentoReduzido() ? 'auto' : 'smooth' }); }
      catch (e) { r.scrollLeft = alvo; }
    }
  }

  TDZ.Teclado = Teclado;

  /* Utilitário: melhor posição (midi) para um acorde dentro do teclado.
     Retorna { baixo, triade:[3 midis] } a partir das classes de nota. */
  TDZ.voicing = function (raizPc, semitons, min, max) {
    let r = 60 + (((raizPc % 12) + 12) % 12);
    while (r + semitons[2] > max && r - 12 >= min) r -= 12;
    return { baixo: r - 12, triade: semitons.map((s) => r + s) };
  };
})();
