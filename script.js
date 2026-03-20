/* =============================================
   SCRIPT.JS — @oluizguedez Links
   =============================================

   ╔══════════════════════════════════════════╗
   ║  CONFIGURAÇÃO EMAILJS (OBRIGATÓRIO)      ║
   ║                                          ║
   ║  1. Crie conta em https://emailjs.com    ║
   ║  2. Vá em "Email Services" → Add Service ║
   ║     (escolha Gmail ou iCloud)            ║
   ║     → copie o SERVICE_ID                 ║
   ║  3. Vá em "Email Templates" → New        ║
   ║     Coloque no corpo do template:        ║
   ║       De: {{from_name}} ({{from_email}}) ║
   ║       Mensagem: {{message}}              ║
   ║     → copie o TEMPLATE_ID               ║
   ║  4. Vá em "Account" → copie PUBLIC_KEY   ║
   ║  5. Substitua abaixo:                    ║
   ╚══════════════════════════════════════════╝ */

const EMAILJS_SERVICE_ID  = 'SEU_SERVICE_ID';   // ← trocar
const EMAILJS_TEMPLATE_ID = 'SEU_TEMPLATE_ID';  // ← trocar
const EMAILJS_PUBLIC_KEY  = 'SUA_PUBLIC_KEY';   // ← trocar

/* =============================================
   LOADER — some após carregar a página
   ============================================= */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  // Aguarda no mínimo 600ms para o loader ter graça
  setTimeout(() => loader.classList.add('out'), 600);
});

/* =============================================
   EMAILJS — inicializa com a chave pública
   ============================================= */
emailjs.init(EMAILJS_PUBLIC_KEY);

/* =============================================
   FORMULÁRIO DE CONTATO — abrir / fechar
   ============================================= */
const toggleBtn  = document.getElementById('toggle-contact');
const formWrap   = document.getElementById('contact-form-wrap');
const chevron    = document.getElementById('chevron');

toggleBtn.addEventListener('click', () => {
  const open = formWrap.hidden;

  if (open) {
    formWrap.hidden = false;
    toggleBtn.setAttribute('aria-expanded', 'true');
    chevron.style.transform = 'rotate(180deg)';
    // scroll suave até o formulário em mobile
    setTimeout(() => formWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
  } else {
    formWrap.hidden = true;
    toggleBtn.setAttribute('aria-expanded', 'false');
    chevron.style.transform = 'rotate(0deg)';
  }
});

/* =============================================
   ENVIO DO FORMULÁRIO VIA EMAILJS
   ============================================= */
const form      = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const btnText   = document.getElementById('btn-text');
const btnSpin   = document.getElementById('btn-spin');
const formMsg   = document.getElementById('form-msg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Validação básica
  const name    = form.from_name.value.trim();
  const email   = form.from_email.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    showFeedback('Por favor, preencha todos os campos.', 'error');
    return;
  }

  if (!isValidEmail(email)) {
    showFeedback('Digite um e-mail válido.', 'error');
    return;
  }

  // Estado: enviando
  setLoading(true);

  try {
    await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);
    showFeedback('✅ Mensagem enviada! Logo entrarei em contato.', 'success');
    form.reset();
  } catch (err) {
    console.error('EmailJS erro:', err);
    showFeedback('❌ Erro ao enviar. Tente novamente ou envie direto: oluizguedez@icloud.com', 'error');
  } finally {
    setLoading(false);
  }
});

/* --- helpers --- */
function setLoading(on) {
  submitBtn.disabled = on;
  btnText.textContent = on ? 'Enviando...' : 'Enviar';
  btnSpin.hidden = !on;
}

function showFeedback(msg, type) {
  formMsg.textContent  = msg;
  formMsg.className    = 'form-msg ' + type;
  // remove após 6 segundos
  setTimeout(() => {
    formMsg.className = 'form-msg';
    formMsg.textContent = '';
  }, 6000);
}

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

/* =============================================
   EFEITO RIPPLE nos botões (clique)
   ============================================= */
document.querySelectorAll('.link-btn').forEach(btn => {
  btn.addEventListener('pointerdown', (e) => {
    const rect = btn.getBoundingClientRect();
    const r    = document.createElement('span');
    const size = Math.max(rect.width, rect.height) * 1.2;

    r.className = 'ripple';
    r.style.cssText = `
      width:${size}px; height:${size}px;
      left:${e.clientX - rect.left - size/2}px;
      top:${e.clientY - rect.top  - size/2}px;
    `;

    btn.appendChild(r);
    r.addEventListener('animationend', () => r.remove());
  });
});

/* =============================================
   ANIMAÇÃO AO SCROLL (Intersection Observer)
   — elementos com class .fade-scroll
     (opcional: adicione ao HTML se quiser)
   ============================================= */
const io = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.style.opacity  = '1';
      en.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-scroll').forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  io.observe(el);
});

/* =============================================
   PARALLAX LEVE no fundo (opcional)
   Move os blobs sutilmente com o cursor/toque
   ============================================= */
(function initParallax() {
  const blobs = document.querySelectorAll('.blob');
  if (!blobs.length) return;

  function move(x, y) {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (x - cx) / cx;   // -1 a 1
    const dy = (y - cy) / cy;

    blobs[0].style.transform = `translate(${dx * 18}px, ${dy * 14}px)`;
    blobs[1].style.transform = `translate(${dx * -14}px, ${dy * -10}px)`;
    blobs[2].style.transform = `translate(${dx * 10}px, ${dy * 16}px)`;
  }

  // Mouse (desktop)
  window.addEventListener('mousemove', e => move(e.clientX, e.clientY), { passive: true });

  // Gyroscope (mobile, fallback suave)
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', e => {
      const x = window.innerWidth  / 2 + (e.gamma || 0) * 5;
      const y = window.innerHeight / 2 + (e.beta  || 0) * 5;
      move(x, y);
    }, { passive: true });
  }
})();

/* =============================================
   INSTRUÇÕES PARA PUBLICAR NO GITHUB PAGES
   ─────────────────────────────────────────────
   1. Crie um repositório no GitHub (público)
   2. Faça upload dos 3 arquivos:
        index.html  ·  style.css  ·  script.js
   3. Vá em Settings → Pages
   4. Em "Source", selecione a branch "main"
      e a pasta "/ (root)"
   5. Clique em Save — em ~1 min o site estará em:
        https://SEU_USUARIO.github.io/NOME_DO_REPO
   ─────────────────────────────────────────────
   COMO TROCAR A FOTO DE PERFIL:
   No index.html, localize <img class="avatar"
   e troque o src pela URL da sua foto ou pelo
   nome do arquivo (ex: "foto.jpg") na mesma pasta.
   ============================================= */
