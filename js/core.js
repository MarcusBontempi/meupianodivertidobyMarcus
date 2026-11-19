/* =====================================================================
   CORE.JS — utilitários compartilhados por todas as aulas
   (normalmente você não precisa mexer aqui)
   ===================================================================== */
(function () {
  const TDZ = (window.TDZ = window.TDZ || {});

  /* ---------- Registro de aulas ----------
     Cada arquivo em js/lessons/ chama:
       TDZ.registrarAula('aula-1', function (el) { ...monta a aula dentro de el... });
     O main.js chama essa função na primeira vez que a aula é aberta. */
  TDZ.aulas = {};
  TDZ.registrarAula = function (id, render) {
    TDZ.aulas[id] = render;
  };

  /* ---------- localStorage protegido (nunca quebra o site) ---------- */
  TDZ.storage = {
    get(chave, padrao) {
      try {
        const v = window.localStorage.getItem('tdz:' + chave);
        return v === null ? padrao : JSON.parse(v);
      } catch (e) {
        return padrao;
      }
    },
    set(chave, valor) {
      try {
        window.localStorage.setItem('tdz:' + chave, JSON.stringify(valor));
      } catch (e) { /* modo privado / bloqueado: ignora */ }
    },
  };

  /* ---------- Movimento reduzido ---------- */
  let mq = null;
  try { mq = window.matchMedia('(prefers-reduced-motion: reduce)'); } catch (e) {}
  TDZ.movimentoReduzido = () => !!(mq && mq.matches);

  TDZ.sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  TDZ.$ = (sel, raiz) => (raiz || document).querySelector(sel);
  TDZ.$$ = (sel, raiz) => Array.from((raiz || document).querySelectorAll(sel));
  TDZ.sortear = (lista) => lista[Math.floor(Math.random() * lista.length)];

  /* Reinicia uma animação CSS (ex.: 'pulso-ok', 'shake') num elemento. */
  TDZ.anim = function (el, classe) {
    if (!el) return;
    el.classList.remove(classe);
    void el.offsetWidth; // força o navegador a "esquecer" a animação anterior
    el.classList.add(classe);
    clearTimeout(el['_t_' + classe]);
    el['_t_' + classe] = setTimeout(() => el.classList.remove(classe), 700);
  };

  /* ---------- Sequências animadas canceláveis ----------
     Uso:  const seq = TDZ.criarSequencia();
           seq.rodar(async (esperar) => { ...; await esperar(300); ... });
     Se outro seq.rodar() começar (ou seq.parar()), o anterior para sozinho. */
  const CANCELADO = { cancelado: true };
  TDZ.criarSequencia = function () {
    let id = 0;
    return {
      rodar(fn) {
        const meu = ++id;
        const vivo = () => meu === id;
        const esperar = (ms) =>
          new Promise((r) => setTimeout(r, ms)).then(() => {
            if (!vivo()) throw CANCELADO;
          });
        return Promise.resolve()
          .then(() => fn(esperar, vivo))
          .catch((e) => { if (e !== CANCELADO) console.error(e); });
      },
      parar() { id++; },
    };
  };

  /* ---------- Pequenos componentes de interface ---------- */
  TDZ.ui = {};

  /* Seletor de chips (ex.: os 12 tons). itens = [{ valor, html }] */
  TDZ.ui.chips = function (container, itens, inicial, aoMudar) {
    container.classList.add('chips');
    container.setAttribute('role', 'radiogroup');
    const botoes = itens.map((it) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.setAttribute('role', 'radio');
      b.innerHTML = it.html;
      b.addEventListener('click', () => {
        definir(it.valor);
        aoMudar && aoMudar(it.valor);
      });
      container.appendChild(b);
      return { b, v: it.valor };
    });
    function definir(v) {
      botoes.forEach(({ b, v: x }) => {
        const on = x === v;
        b.classList.toggle('ativo', on);
        b.setAttribute('aria-checked', on ? 'true' : 'false');
      });
    }
    definir(inicial);
    return { definir };
  };

  /* Revela elementos .reveal com fade/slide escalonado quando entram na tela. */
  let io = null;
  TDZ.ui.revelar = function (raiz) {
    const els = TDZ.$$('.reveal:not(.in)', raiz);
    if (!('IntersectionObserver' in window) || TDZ.movimentoReduzido()) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }
    if (!io) {
      io = new IntersectionObserver((entradas) => {
        let i = 0;
        entradas.forEach((en) => {
          if (!en.isIntersecting) return;
          en.target.style.setProperty('--d', Math.min(i++, 6) * 70 + 'ms');
          en.target.classList.add('in');
          io.unobserve(en.target);
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    }
    els.forEach((el) => io.observe(el));
  };
})();
