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

// ==================== Kalkulator Warisan ====================
function formatRupiah(n) {
  return 'Rp ' + Math.round(n).toLocaleString('id-ID');
}

function hitungWarisan() {
  const hartaInput = parseFloat(document.getElementById('hartaWarisan').value);
  if (!hartaInput || hartaInput <= 0) {
    showToast('Masukkan jumlah harta warisan terlebih dahulu!', 'error');
    return;
  }

  const pasangan           = document.getElementById('pasangan').value;
  const anakLaki           = parseInt(document.getElementById('jumlahAnakLaki').value) || 0;
  const anakPerempuan      = parseInt(document.getElementById('jumlahAnakPerempuan').value) || 0;
  const statusAyah         = document.getElementById('statusAyah').value;
  const statusIbu          = document.getElementById('statusIbu').value;
  const saudaraLakiKandung = parseInt(document.getElementById('jumlahSaudaraLakiKandung').value) || 0;
  const saudaraPercKandung = parseInt(document.getElementById('jumlahSaudaraPerempuanKandung').value) || 0;
  const saudaraLakiSeibu   = parseInt(document.getElementById('jumlahSaudaraLakiSeibu').value) || 0;
  const saudaraPercSeibu   = parseInt(document.getElementById('jumlahSaudaraPerempuanSeibu').value) || 0;
  const saudaraLakiSeayah  = parseInt(document.getElementById('jumlahSaudaraLakiSeayah')?.value) || 0;
  const saudaraPercSeayah  = parseInt(document.getElementById('jumlahSaudaraPerempuanSeayah')?.value) || 0;

  const adaAnak  = (anakLaki + anakPerempuan) > 0;
  const adaAyah  = statusAyah === 'ada';
  const adaIbu   = statusIbu === 'ada';
  const totalSaudaraKandung = saudaraLakiKandung + saudaraPercKandung;
  const totalSaudaraSeibu   = saudaraLakiSeibu + saudaraPercSeibu;
  const totalSaudaraSeayah  = saudaraLakiSeayah + saudaraPercSeayah;
  const totalSaudaraSemua   = totalSaudaraKandung + totalSaudaraSeibu + totalSaudaraSeayah;

  // State variables
  let sisa = hartaInput;
  const hasil = [];
  const dasarHukum = new Set();

  // ─── Helper: add ahli waris entry ───
  function addHasil(label, fraksi, amount, dasar, colorClass) {
    hasil.push({ label, fraksi, amount, dasar, colorClass: colorClass || 'blue' });
    if (dasar) dasar.forEach(d => dasarHukum.add(d));
  }

  // ─── 1. Pasangan ───
  if (pasangan === 'suami') {
    const fraksi = adaAnak ? 1/4 : 1/2;
    const label  = adaAnak ? '¼' : '½';
    const bayar  = hartaInput * fraksi;
    addHasil('Suami / Duda', label, bayar, ['An-Nisa\' 12', 'KHI Pasal 179'], 'blue');
    sisa -= bayar;
  } else if (pasangan === 'istri') {
    const fraksi = adaAnak ? 1/8 : 1/4;
    const label  = adaAnak ? '⅛' : '¼';
    const bayar  = hartaInput * fraksi;
    addHasil('Istri / Janda', label, bayar, ['An-Nisa\' 12', 'KHI Pasal 180'], 'blue');
    sisa -= bayar;
  }

  // ─── 2. Ayah & Ibu (fixed portions first) ───
  let ayahIsAshabah = false;
  if (adaAyah) {
    if (adaAnak) {
      const bayar = hartaInput * (1/6);
      addHasil('Ayah Kandung', '⅙', bayar, ['An-Nisa\' 11', 'KHI Pasal 177'], 'green');
      sisa -= bayar;
    } else {
      // Ayah gets 1/3 or becomes ashabah — defer to ashabah calculation
      ayahIsAshabah = true;
    }
  }

  if (adaIbu) {
    const adaDuaAtauLebihSaudara = totalSaudaraSemua >= 2;
    if (adaAnak || adaDuaAtauLebihSaudara) {
      const bayar = hartaInput * (1/6);
      addHasil('Ibu Kandung', '⅙', bayar, ['An-Nisa\' 11', 'KHI Pasal 178'], 'green');
      sisa -= bayar;
    } else {
      // No anak, no ≥2 saudara
      if (adaAyah) {
        // Ibu gets 1/3 of sisa (after spouse)
        const bayar = sisa * (1/3);
        addHasil('Ibu Kandung', '⅓ dari sisa', bayar, ['An-Nisa\' 11', 'KHI Pasal 178'], 'green');
        sisa -= bayar;
      } else {
        const bayar = hartaInput * (1/3);
        addHasil('Ibu Kandung', '⅓', bayar, ['An-Nisa\' 11', 'KHI Pasal 178'], 'green');
        sisa -= bayar;
      }
    }
  }

  // ─── 3. Anak (fixed portions for perempuan, then ashabah) ───
  if (adaAnak) {
    if (anakLaki > 0) {
      // Anak laki + perempuan → ashabah with 2:1 ratio
      const unitLaki = 2, unitPerempuan = 1;
      const totalUnits = (anakLaki * unitLaki) + (anakPerempuan * unitPerempuan);
      const perUnit = sisa / totalUnits;

      if (anakLaki > 0) {
        const totalLaki = perUnit * unitLaki * anakLaki;
        const perOrangLaki = totalLaki / anakLaki;
        addHasil(
          `Anak Laki-laki (${anakLaki} orang)`,
          `Ashabah (2:1)`,
          totalLaki,
          ['An-Nisa\' 11', 'KHI Pasal 176', 'Hadits Rasulullah'],
          'amber'
        );
      }
      if (anakPerempuan > 0) {
        const totalPerempuan = perUnit * unitPerempuan * anakPerempuan;
        addHasil(
          `Anak Perempuan (${anakPerempuan} orang)`,
          `Ashabah (2:1)`,
          totalPerempuan,
          ['An-Nisa\' 11', 'KHI Pasal 176'],
          'pink'
        );
      }
      sisa = 0;
    } else {
      // Hanya anak perempuan
      let fraksiTotal, label;
      if (anakPerempuan === 1) {
        fraksiTotal = 1/2; label = '½';
      } else {
        fraksiTotal = 2/3; label = '⅔';
      }
      const bayar = hartaInput * fraksiTotal;
      addHasil(
        `Anak Perempuan (${anakPerempuan} orang)`,
        label,
        bayar,
        ['An-Nisa\' 11', 'KHI Pasal 176'],
        'pink'
      );
      sisa -= bayar;
    }
  }

  // ─── 4. Ayah ashabah (no anak) ───
  if (ayahIsAshabah && !adaAnak) {
    // Ayah gets what's left if no siblings, else 1/3 fixed first
    const adaSaudaraKandungAtauSeayah = (totalSaudaraKandung + totalSaudaraSeayah) > 0;
    // When no children, ayah gets 1/3 fixed + potentially blocks siblings
    const bayar = sisa; // Ayah takes all remaining (he blocks siblings)
    addHasil('Ayah Kandung', 'Sisa (Ashabah)', bayar, ['An-Nisa\' 11', 'KHI Pasal 177'], 'green');
    sisa = 0;
  }

  // ─── 5. Saudara (only if no anak dan no ayah kandung) ───
  if (!adaAnak && !adaAyah && sisa > 0) {
    // Saudara seibu
    if (totalSaudaraSeibu > 0) {
      let fraksiSeibu, labelSeibu;
      if (totalSaudaraSeibu === 1) {
        fraksiSeibu = 1/6; labelSeibu = '⅙';
      } else {
        fraksiSeibu = 1/3; labelSeibu = '⅓';
      }
      const bayarSeibu = hartaInput * fraksiSeibu;
      const namaSeibu = [];
      if (saudaraLakiSeibu > 0) namaSeibu.push(`${saudaraLakiSeibu} laki-laki`);
      if (saudaraPercSeibu > 0) namaSeibu.push(`${saudaraPercSeibu} perempuan`);
      addHasil(
        `Saudara Seibu (${namaSeibu.join(', ')})`,
        labelSeibu,
        bayarSeibu,
        ['An-Nisa\' 12', 'KHI Pasal 181'],
        'purple'
      );
      sisa -= bayarSeibu;
    }

    // Saudara kandung — ashabah
    if ((saudaraLakiKandung + saudaraPercKandung) > 0) {
      if (saudaraLakiKandung > 0) {
        // With male siblings → ashabah 2:1
        const totalUnits = (saudaraLakiKandung * 2) + saudaraPercKandung;
        const perUnit = sisa / totalUnits;
        const laki = perUnit * 2 * saudaraLakiKandung;
        addHasil(
          `Saudara Laki-laki Kandung (${saudaraLakiKandung} orang)`,
          'Ashabah (2:1)', laki,
          ['An-Nisa\' 12', 'KHI Pasal 182'],
          'amber'
        );
        if (saudaraPercKandung > 0) {
          const perc = perUnit * saudaraPercKandung;
          addHasil(
            `Saudara Perempuan Kandung (${saudaraPercKandung} orang)`,
            'Ashabah (2:1)', perc,
            ['An-Nisa\' 12', 'KHI Pasal 182'],
            'pink'
          );
        }
        sisa = 0;
      } else {
        // Hanya saudara perempuan kandung
        let fraksi, label;
        if (saudaraPercKandung === 1) {
          fraksi = 1/2; label = '½';
        } else {
          fraksi = 2/3; label = '⅔';
        }
        const bayar = sisa * fraksi;
        addHasil(
          `Saudara Perempuan Kandung (${saudaraPercKandung} orang)`,
          label, bayar,
          ['An-Nisa\' 12', 'KHI Pasal 182'],
          'pink'
        );
        sisa -= bayar;
      }
    } else if (saudaraLakiKandung === 0 && saudaraPercKandung === 0) {
      // Saudara seayah (only if no kandung)
      if (totalSaudaraSeayah > 0) {
        if (saudaraLakiSeayah > 0) {
          const totalUnits = (saudaraLakiSeayah * 2) + saudaraPercSeayah;
          const perUnit = sisa / totalUnits;
          const laki = perUnit * 2 * saudaraLakiSeayah;
          addHasil(
            `Saudara Laki-laki Seayah (${saudaraLakiSeayah} orang)`,
            'Ashabah (2:1)', laki,
            ['An-Nisa\' 12', 'KHI Pasal 182'],
            'amber'
          );
          if (saudaraPercSeayah > 0) {
            const perc = perUnit * saudaraPercSeayah;
            addHasil(
              `Saudara Perempuan Seayah (${saudaraPercSeayah} orang)`,
              'Ashabah (2:1)', perc,
              ['An-Nisa\' 12', 'KHI Pasal 182'],
              'pink'
            );
          }
          sisa = 0;
        } else {
          let fraksi, label;
          if (saudaraPercSeayah === 1) {
            fraksi = 1/2; label = '½';
          } else {
            fraksi = 2/3; label = '⅔';
          }
          const bayar = sisa * fraksi;
          addHasil(
            `Saudara Perempuan Seayah (${saudaraPercSeayah} orang)`,
            label, bayar,
            ['An-Nisa\' 12', 'KHI Pasal 182'],
            'pink'
          );
          sisa -= bayar;
        }
      }
    }
  }

  // ─── Render results ───
  const colorMap = {
    blue:   { bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-700',   badge: 'bg-blue-100 text-blue-700' },
    green:  { bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700',  badge: 'bg-green-100 text-green-700' },
    pink:   { bg: 'bg-pink-50',   border: 'border-pink-200',   text: 'text-pink-700',   badge: 'bg-pink-100 text-pink-700' },
    amber:  { bg: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-700',  badge: 'bg-amber-100 text-amber-700' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-700' },
  };

  document.getElementById('total-harta-display').textContent = formatRupiah(hartaInput);
  document.getElementById('badge-total-ahli').textContent = `${hasil.length} Ahli Waris`;

  const icons = { blue: '👔', green: '👨‍👩‍👧', pink: '👩', amber: '👨', purple: '🤝' };
  const detail = document.getElementById('detailHasil');
  detail.innerHTML = hasil.map(h => {
    const c = colorMap[h.colorClass] || colorMap.blue;
    const perOrang = hasil.length > 0 && h.label.match(/\((\d+) orang\)/)
      ? parseInt(h.label.match(/\((\d+) orang\)/)[1])
      : 1;
    const pctTotal = (h.amount / hartaInput * 100).toFixed(1);
    const perOrangText = perOrang > 1
      ? `<span class="text-xs ${c.text}">(${formatRupiah(h.amount / perOrang)}/orang)</span>` : '';
    return `
      <div class="${c.bg} ${c.border} border rounded-2xl p-4 transition-all">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="text-lg">${icons[h.colorClass] || '👤'}</span>
            <span class="font-semibold text-gray-800 text-sm">${h.label}</span>
          </div>
          <span class="${c.badge} text-xs font-bold px-2.5 py-1 rounded-full">${h.fraksi}</span>
        </div>
        <div class="flex items-end justify-between">
          <div>
            <p class="font-heading text-lg font-bold ${c.text}">${formatRupiah(h.amount)}</p>
            ${perOrangText}
          </div>
          <div class="text-right">
            <div class="text-xs text-gray-400">${pctTotal}% dari harta</div>
            <div class="w-24 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
              <div class="h-full rounded-full ${c.text.replace('text-', 'bg-')}" style="width:${Math.min(100,pctTotal)}%"></div>
            </div>
          </div>
        </div>
      </div>`;
  }).join('');

  // Sisa info
  const infoSisa = document.getElementById('info-sisa');
  if (sisa > 1) {
    infoSisa.className = 'mt-4 p-3 rounded-xl text-xs font-medium bg-amber-50 border border-amber-200 text-amber-800';
    infoSisa.innerHTML = `⚠️ <strong>Sisa harta: ${formatRupiah(sisa)}</strong> — Dikembalikan ke ahli waris secara proporsional (Rad) atau ke Baitul Mal.`;
    infoSisa.classList.remove('hidden');
  } else if (sisa < -1) {
    infoSisa.className = 'mt-4 p-3 rounded-xl text-xs font-medium bg-red-50 border border-red-200 text-red-700';
    infoSisa.innerHTML = `⚠️ Terjadi kekurangan — perlu dilakukan Aul (pengurangan proporsional semua bagian).`;
    infoSisa.classList.remove('hidden');
  } else {
    infoSisa.classList.add('hidden');
  }

  // Dasar hukum
  const dasarEl = document.getElementById('dasar-hukum-list');
  dasarEl.innerHTML = [...dasarHukum].map(d => `
    <div class="flex items-center gap-2 text-white/80 text-xs">
      <span class="w-4 h-4 rounded-full bg-white/15 flex items-center justify-center text-xs flex-shrink-0">✓</span>
      ${d}
    </div>`).join('');

  document.getElementById('placeholder-waris').classList.add('hidden');
  document.getElementById('hasilWarisPanel').classList.remove('hidden');
  document.getElementById('dasar-hukum-card').classList.remove('hidden');

  showToast('Perhitungan berhasil!', 'success');
  document.getElementById('hasilWarisPanel').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function resetKalkulator() {
  document.getElementById('hartaWarisan').value = '';
  document.getElementById('pasangan').value = 'tidak_ada';
  document.getElementById('jumlahAnakLaki').value = 0;
  document.getElementById('jumlahAnakPerempuan').value = 0;
  document.getElementById('statusAyah').value = 'tidak_ada';
  document.getElementById('statusIbu').value = 'tidak_ada';
  document.getElementById('jumlahSaudaraLakiKandung').value = 0;
  document.getElementById('jumlahSaudaraPerempuanKandung').value = 0;
  document.getElementById('jumlahSaudaraLakiSeibu').value = 0;
  document.getElementById('jumlahSaudaraPerempuanSeibu').value = 0;
  if (document.getElementById('jumlahSaudaraLakiSeayah'))
    document.getElementById('jumlahSaudaraLakiSeayah').value = 0;
  if (document.getElementById('jumlahSaudaraPerempuanSeayah'))
    document.getElementById('jumlahSaudaraPerempuanSeayah').value = 0;

  document.getElementById('placeholder-waris').classList.remove('hidden');
  document.getElementById('hasilWarisPanel').classList.add('hidden');
  document.getElementById('info-sisa').classList.add('hidden');
}

// ==================== Boot ====================
renderQuiz();
lucide.createIcons();
