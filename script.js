// ==================== Quiz Data ====================
const quizData = [
  { q: "Berapa jumlah rukun iman dalam Islam?", opts: ["4","5","6","7"], correct: 2 },
  { q: "Kitab suci umat Islam adalah...", opts: ["Taurat","Zabur","Injil","Al-Qur'an"], correct: 3 },
  { q: "Shalat wajib dilakukan berapa kali sehari?", opts: ["3 kali","4 kali","5 kali","7 kali"], correct: 2 },
  { q: "Rukun Islam yang pertama adalah...", opts: ["Shalat","Syahadat","Puasa","Zakat"], correct: 1 },
  { q: "Nabi terakhir dalam Islam adalah...", opts: ["Nabi Isa AS","Nabi Musa AS","Nabi Ibrahim AS","Nabi Muhammad SAW"], correct: 3 }
];

let currentQ = 0, score = 0, answered = false;

function renderQuiz() {
  const prog = document.getElementById('quiz-progress');
  prog.innerHTML = quizData.map((_, i) =>
    `<div class="h-1.5 flex-1 rounded-full ${i < currentQ ? 'bg-pai-500' : i === currentQ ? 'bg-pai-300' : 'bg-gray-200'} transition-all"></div>`
  ).join('');

  document.getElementById('quiz-q-text').textContent = `${currentQ + 1}. ${quizData[currentQ].q}`;

  const optsEl = document.getElementById('quiz-options');
  optsEl.innerHTML = quizData[currentQ].opts
    .map((o, i) =>
      `<div class="quiz-option border-2 border-gray-200 rounded-xl p-4 text-sm font-medium text-gray-700"
            onclick="selectAnswer(${i})" data-idx="${i}">${o}</div>`
    ).join('');

  document.getElementById('quiz-feedback').classList.add('hidden');
  document.getElementById('quiz-next').disabled = true;
  document.getElementById('quiz-score').textContent = `Skor: ${score}/${quizData.length}`;
  answered = false;
  lucide.createIcons();
}

function selectAnswer(idx) {
  if (answered) return;
  answered = true;

  const correct = quizData[currentQ].correct;
  const opts = document.querySelectorAll('.quiz-option');

  opts.forEach((o, i) => {
    o.style.pointerEvents = 'none';
    if (i === correct) o.classList.add('correct');
    if (i === idx && i !== correct) o.classList.add('wrong');
  });

  if (idx === correct) score++;

  const fb = document.getElementById('quiz-feedback');
  fb.classList.remove('hidden');
  fb.className = `mb-4 p-4 rounded-xl text-sm font-medium ${
    idx === correct
      ? 'bg-green-50 text-green-700 border border-green-200'
      : 'bg-red-50 text-red-700 border border-red-200'
  }`;
  fb.textContent = idx === correct
    ? '✅ Jawaban benar! Alhamdulillah.'
    : `❌ Jawaban salah. Jawaban yang benar: ${quizData[currentQ].opts[correct]}`;

  document.getElementById('quiz-score').textContent = `Skor: ${score}/${quizData.length}`;
  document.getElementById('quiz-next').disabled = false;
}

function nextQuestion() {
  currentQ++;
  if (currentQ >= quizData.length) {
    document.getElementById('quiz-container').classList.add('hidden');
    document.getElementById('quiz-result').classList.remove('hidden');
    const pct = Math.round(score / quizData.length * 100);
    document.getElementById('quiz-result-text').textContent =
      `Anda mendapat skor ${score}/${quizData.length} (${pct}%). ${
        pct >= 80 ? 'Luar biasa! Masya Allah!' : pct >= 60 ? 'Bagus! Terus belajar!' : 'Tetap semangat belajar!'
      }`;
  } else {
    renderQuiz();
  }
}

function resetQuiz() {
  currentQ = 0;
  score = 0;
  document.getElementById('quiz-container').classList.remove('hidden');
  document.getElementById('quiz-result').classList.add('hidden');
  renderQuiz();
}

// ==================== Toast ====================
function showToast(msg, type) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast ${type} show`;
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ==================== Navbar Scroll ====================
const wrapper = document.getElementById('app-wrapper');
wrapper.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (wrapper.scrollTop > 80) {
    nav.style.background = 'rgba(15, 23, 42, 0.95)';
    nav.style.backdropFilter = 'blur(12px)';
    nav.style.boxShadow = '0 4px 30px rgba(0,0,0,0.1)';
  } else {
    nav.style.background = 'transparent';
    nav.style.backdropFilter = 'none';
    nav.style.boxShadow = 'none';
  }
});

// ==================== Mobile Menu ====================
function toggleMobile() {
  document.getElementById('mobile-menu').classList.toggle('hidden');
}
function closeMobile() {
  document.getElementById('mobile-menu').classList.add('hidden');
}

// ==================== Scroll Animations ====================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      const anim = e.target.dataset.anim;
      if (anim) e.target.classList.add(anim);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.obs').forEach(el => observer.observe(el));

// ==================== Contact Form ====================
async function handleSubmit(e) {
  e.preventDefault();

  const btn     = document.getElementById('submit-btn');
  const text    = document.getElementById('submit-text');
  const spinner = document.getElementById('submit-spinner');
  const success = document.getElementById('form-success');
  const error   = document.getElementById('form-error');

  btn.disabled = true;
  text.textContent = 'Mengirim...';
  spinner.classList.remove('hidden');
  success.classList.add('hidden');
  error.classList.add('hidden');

  try {
    const result = await window.dataSdk.create({
      name:         document.getElementById('c-name').value,
      email:        document.getElementById('c-email').value,
      phone:        document.getElementById('c-phone').value || '',
      message:      document.getElementById('c-msg').value,
      submitted_at: new Date().toISOString()
    });

    if (result.isOk) {
      success.classList.remove('hidden');
      document.getElementById('contact-form').reset();
      showToast('Pesan berhasil terkirim!', 'success');
    } else {
      error.classList.remove('hidden');
    }
  } catch (err) {
    error.classList.remove('hidden');
  }

  btn.disabled = false;
  text.textContent = 'Kirim Pesan';
  spinner.classList.add('hidden');
}

// ==================== SDK Config ====================
const defaultConfig = {
  hero_title:            'Pendidikan Agama Islam',
  hero_subtitle:         'Universitas Muhammadiyah Malang',
  cta_button_text:       'Daftar Sekarang',
  visi_text:             'Menjadi program studi Pendidikan Agama Islam terkemuka dan profesional di tingkat Internasional pada tahun 2030',
  contact_email:         'pai@umm.ac.id',
  contact_phone:         '(0341) 464318',
  contact_address:       'Jl. Raya Tlogomas No.246, Malang, Jawa Timur 65144',
  background_color:      '#0f172a',
  surface_color:         '#ffffff',
  text_color:            '#1e3a5a',
  primary_action_color:  '#1e40af',
  secondary_action_color:'#3b82f6',
  font_family:           'Playfair Display',
  font_size:             16
};

function applyConfig(config) {
  const g = (k) => config[k] || defaultConfig[k];

  const heroTitle = document.getElementById('hero-title');
  if (heroTitle) heroTitle.innerHTML = g('hero_title').replace(/\n/g, '<br>');

  const ctaBtn = document.getElementById('cta-btn');
  if (ctaBtn) ctaBtn.firstChild.textContent = g('cta_button_text') + ' ';

  const visi = document.getElementById('visi-content');
  if (visi) visi.textContent = g('visi_text');

  const pe = document.getElementById('profile-email');  if (pe) pe.textContent = g('contact_email');
  const pp = document.getElementById('profile-phone');  if (pp) pp.textContent = g('contact_phone');
  const da = document.getElementById('display-address');if (da) da.textContent = g('contact_address');
  const dp = document.getElementById('display-phone');  if (dp) dp.textContent = g('contact_phone');
  const de = document.getElementById('display-email');  if (de) de.textContent = g('contact_email');

  const bg        = g('background_color');
  const primary   = g('primary_action_color');
  const secondary = g('secondary_action_color');
  const textC     = g('text_color');

  document.querySelectorAll('.hero-gradient').forEach(el => {
    el.style.background = `linear-gradient(135deg, ${bg} 0%, ${primary} 50%, ${secondary} 100%)`;
  });
  document.querySelectorAll('.bg-pai-600').forEach(el => el.style.backgroundColor = primary);
  document.querySelectorAll('.bg-pai-700').forEach(el => el.style.backgroundColor = primary);
  document.querySelectorAll('.text-pai-900').forEach(el => el.style.color = textC);
  document.querySelectorAll('.text-pai-700').forEach(el => el.style.color = primary);

  const ff = g('font_family');
  document.querySelectorAll('.font-heading').forEach(el => {
    el.style.fontFamily = `${ff}, serif`;
  });
  document.body.style.fontSize = `${g('font_size')}px`;
}

// ==================== SDK Init ====================
if (window.elementSdk) {
  window.elementSdk.init({
    defaultConfig,
    onConfigChange: async (config) => { applyConfig(config); },
    mapToCapabilities: (config) => {
      const g  = (k) => config[k] || defaultConfig[k];
      const mk = (key) => ({
        get: () => g(key),
        set: (v) => { config[key] = v; window.elementSdk.setConfig({ [key]: v }); }
      });
      return {
        recolorables: [
          mk('background_color'), mk('surface_color'), mk('text_color'),
          mk('primary_action_color'), mk('secondary_action_color')
        ],
        borderables:  [],
        fontEditable: mk('font_family'),
        fontSizeable: mk('font_size')
      };
    },
    mapToEditPanelValues: (config) => {
      const g = (k) => config[k] || defaultConfig[k];
      return new Map([
        ['hero_title',       g('hero_title')],
        ['hero_subtitle',    g('hero_subtitle')],
        ['cta_button_text',  g('cta_button_text')],
        ['visi_text',        g('visi_text')],
        ['contact_email',    g('contact_email')],
        ['contact_phone',    g('contact_phone')],
        ['contact_address',  g('contact_address')]
      ]);
    }
  });
}

if (window.dataSdk) {
  window.dataSdk.init({
    onDataChanged(data) { /* write-only mode */ }
  });
}

// ==================== Boot ====================
renderQuiz();
lucide.createIcons();
