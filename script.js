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
  const saudaraLakiSeayah  = parseInt(document.getElementById('jumlahSaudaraLakiSeayah') ? document.getElementById('jumlahSaudaraLakiSeayah').value : 0) || 0;
  const saudaraPercSeayah  = parseInt(document.getElementById('jumlahSaudaraPerempuanSeayah') ? document.getElementById('jumlahSaudaraPerempuanSeayah').value : 0) || 0;

  const adaAnak  = (anakLaki + anakPerempuan) > 0;
  const adaAyah  = statusAyah === 'ada';
  const adaIbu   = statusIbu === 'ada';
  const totalSaudaraKandung = saudaraLakiKandung + saudaraPercKandung;
  const totalSaudaraSeibu   = saudaraLakiSeibu + saudaraPercSeibu;
  const totalSaudaraSeayah  = saudaraLakiSeayah + saudaraPercSeayah;
  const totalSaudaraSemua   = totalSaudaraKandung + totalSaudaraSeibu + totalSaudaraSeayah;

  let sisa = hartaInput;
  const hasil = [];
  const dasarHukum = new Set();

  function addHasil(label, fraksi, amount, dasar, colorClass) {
    hasil.push({ label, fraksi, amount, dasar, colorClass: colorClass || 'blue' });
    if (dasar) dasar.forEach(d => dasarHukum.add(d));
  }

  // ── 1. Pasangan ──
  if (pasangan === 'suami') {
    const fraksi = adaAnak ? 1/4 : 1/2;
    const label  = adaAnak ? '¼' : '½';
    const bayar  = hartaInput * fraksi;
    addHasil('Suami / Duda', label, bayar, ["An-Nisa' 12", 'KHI Pasal 179'], 'blue');
    sisa -= bayar;
  } else if (pasangan === 'istri') {
    const fraksi = adaAnak ? 1/8 : 1/4;
    const label  = adaAnak ? '⅛' : '¼';
    const bayar  = hartaInput * fraksi;
    addHasil('Istri / Janda', label, bayar, ["An-Nisa' 12", 'KHI Pasal 180'], 'blue');
    sisa -= bayar;
  }

  // ── 2. Ayah ──
  let ayahIsAshabah = false;
  if (adaAyah) {
    if (adaAnak) {
      const bayar = hartaInput * (1/6);
      addHasil('Ayah Kandung', '⅙', bayar, ["An-Nisa' 11", 'KHI Pasal 177'], 'green');
      sisa -= bayar;
    } else {
      ayahIsAshabah = true;
    }
  }

  // ── 3. Ibu ──
  if (adaIbu) {
    const adaDuaAtauLebihSaudara = totalSaudaraSemua >= 2;
    if (adaAnak || adaDuaAtauLebihSaudara) {
      const bayar = hartaInput * (1/6);
      addHasil('Ibu Kandung', '⅙', bayar, ["An-Nisa' 11", 'KHI Pasal 178'], 'green');
      sisa -= bayar;
    } else {
      if (adaAyah) {
        // Bersama ayah: ibu dapat 1/3 dari sisa setelah pasangan
        const bayar = sisa * (1/3);
        addHasil('Ibu Kandung', '⅓ dari sisa', bayar, ["An-Nisa' 11", 'KHI Pasal 178'], 'green');
        sisa -= bayar;
      } else {
        const bayar = hartaInput * (1/3);
        addHasil('Ibu Kandung', '⅓', bayar, ["An-Nisa' 11", 'KHI Pasal 178'], 'green');
        sisa -= bayar;
      }
    }
  }

  // ── 4. Anak ──
  if (adaAnak) {
    if (anakLaki > 0) {
      // Ashabah 2:1
      const totalUnits = (anakLaki * 2) + anakPerempuan;
      const perUnit = sisa / totalUnits;
      const totalBayarLaki = perUnit * 2 * anakLaki;
      addHasil(
        `Anak Laki-laki (${anakLaki} orang)`,
        'Ashabah (2:1)', totalBayarLaki,
        ["An-Nisa' 11", 'KHI Pasal 176', 'Hadits Rasulullah'], 'amber'
      );
      if (anakPerempuan > 0) {
        const totalBayarPerempuan = perUnit * anakPerempuan;
        addHasil(
          `Anak Perempuan (${anakPerempuan} orang)`,
          'Ashabah (2:1)', totalBayarPerempuan,
          ["An-Nisa' 11", 'KHI Pasal 176'], 'pink'
        );
      }
      sisa = 0;
    } else {
      // Hanya anak perempuan
      let fraksiTotal = anakPerempuan === 1 ? 1/2 : 2/3;
      let label = anakPerempuan === 1 ? '½' : '⅔';
      const bayar = hartaInput * fraksiTotal;
      addHasil(
        `Anak Perempuan (${anakPerempuan} orang)`,
        label, bayar, ["An-Nisa' 11", 'KHI Pasal 176'], 'pink'
      );
      sisa -= bayar;
    }
  }

  // ── 5. Ayah ashabah (tanpa anak) ──
  if (ayahIsAshabah) {
    addHasil('Ayah Kandung', 'Sisa (Ashabah)', sisa, ["An-Nisa' 11", 'KHI Pasal 177'], 'green');
    sisa = 0;
  }

  // ── 6. Saudara (hanya jika tidak ada anak dan tidak ada ayah) ──
  if (!adaAnak && !adaAyah && sisa > 0) {
    // Saudara seibu
    if (totalSaudaraSeibu > 0) {
      const fraksi = totalSaudaraSeibu === 1 ? 1/6 : 1/3;
      const label  = totalSaudaraSeibu === 1 ? '⅙' : '⅓';
      const bayar  = hartaInput * fraksi;
      const nama = [];
      if (saudaraLakiSeibu > 0) nama.push(`${saudaraLakiSeibu} laki-laki`);
      if (saudaraPercSeibu > 0) nama.push(`${saudaraPercSeibu} perempuan`);
      addHasil(`Saudara Seibu (${nama.join(', ')})`, label, bayar, ["An-Nisa' 12", 'KHI Pasal 181'], 'purple');
      sisa -= bayar;
    }

    // Saudara kandung (menghalangi seayah)
    if (totalSaudaraKandung > 0) {
      if (saudaraLakiKandung > 0) {
        const totalUnits = (saudaraLakiKandung * 2) + saudaraPercKandung;
        const perUnit = sisa / totalUnits;
        addHasil(
          `Saudara Laki-laki Kandung (${saudaraLakiKandung} orang)`,
          'Ashabah (2:1)', perUnit * 2 * saudaraLakiKandung,
          ["An-Nisa' 12", 'KHI Pasal 182'], 'amber'
        );
        if (saudaraPercKandung > 0) {
          addHasil(
            `Saudara Perempuan Kandung (${saudaraPercKandung} orang)`,
            'Ashabah (2:1)', perUnit * saudaraPercKandung,
            ["An-Nisa' 12", 'KHI Pasal 182'], 'pink'
          );
        }
        sisa = 0;
      } else {
        const fraksi = saudaraPercKandung === 1 ? 1/2 : 2/3;
        const label  = saudaraPercKandung === 1 ? '½' : '⅔';
        const bayar  = sisa * fraksi;
        addHasil(
          `Saudara Perempuan Kandung (${saudaraPercKandung} orang)`,
          label, bayar, ["An-Nisa' 12", 'KHI Pasal 182'], 'pink'
        );
        sisa -= bayar;
      }
    } else if (totalSaudaraSeayah > 0) {
      // Saudara seayah (hanya jika tidak ada kandung)
      if (saudaraLakiSeayah > 0) {
        const totalUnits = (saudaraLakiSeayah * 2) + saudaraPercSeayah;
        const perUnit = sisa / totalUnits;
        addHasil(
          `Saudara Laki-laki Seayah (${saudaraLakiSeayah} orang)`,
          'Ashabah (2:1)', perUnit * 2 * saudaraLakiSeayah,
          ["An-Nisa' 12", 'KHI Pasal 182'], 'amber'
        );
        if (saudaraPercSeayah > 0) {
          addHasil(
            `Saudara Perempuan Seayah (${saudaraPercSeayah} orang)`,
            'Ashabah (2:1)', perUnit * saudaraPercSeayah,
            ["An-Nisa' 12", 'KHI Pasal 182'], 'pink'
          );
        }
        sisa = 0;
      } else {
        const fraksi = saudaraPercSeayah === 1 ? 1/2 : 2/3;
        const label  = saudaraPercSeayah === 1 ? '½' : '⅔';
        const bayar  = sisa * fraksi;
        addHasil(
          `Saudara Perempuan Seayah (${saudaraPercSeayah} orang)`,
          label, bayar, ["An-Nisa' 12", 'KHI Pasal 182'], 'pink'
        );
        sisa -= bayar;
      }
    }
  }

  // ── Render ──
  const colorMap = {
    blue:   { bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-700',   bar: 'bg-blue-400',   badge: 'bg-blue-100 text-blue-700' },
    green:  { bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700',  bar: 'bg-green-400',  badge: 'bg-green-100 text-green-700' },
    pink:   { bg: 'bg-pink-50',   border: 'border-pink-200',   text: 'text-pink-700',   bar: 'bg-pink-400',   badge: 'bg-pink-100 text-pink-700' },
    amber:  { bg: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-700',  bar: 'bg-amber-400',  badge: 'bg-amber-100 text-amber-700' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', bar: 'bg-purple-400', badge: 'bg-purple-100 text-purple-700' },
  };
  const icons = { blue: '💍', green: '🧑', pink: '👩', amber: '👨', purple: '🤝' };

  document.getElementById('total-harta-display').textContent = formatRupiah(hartaInput);
  document.getElementById('badge-total-ahli').textContent = `${hasil.length} Ahli Waris`;

  const detail = document.getElementById('detailHasil');
  detail.innerHTML = hasil.map(h => {
    const c = colorMap[h.colorClass] || colorMap.blue;
    const match = h.label.match(/\((\d+) orang\)/);
    const jumlahOrang = match ? parseInt(match[1]) : 1;
    const pct = (h.amount / hartaInput * 100).toFixed(1);
    const perOrangHtml = jumlahOrang > 1
      ? `<span class="text-xs ${c.text} mt-0.5 block">${formatRupiah(h.amount / jumlahOrang)}/orang</span>` : '';
    return `
      <div class="${c.bg} ${c.border} border rounded-2xl p-4">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="text-base">${icons[h.colorClass] || '👤'}</span>
            <span class="font-semibold text-gray-800 text-sm">${h.label}</span>
          </div>
          <span class="${c.badge} text-xs font-bold px-2.5 py-1 rounded-full">${h.fraksi}</span>
        </div>
        <div class="flex items-end justify-between mt-1">
          <div>
            <p class="font-heading text-lg font-bold ${c.text}">${formatRupiah(h.amount)}</p>
            ${perOrangHtml}
          </div>
          <div class="text-right">
            <span class="text-xs text-gray-400">${pct}%</span>
            <div class="w-20 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
              <div class="h-full rounded-full ${c.bar}" style="width:${Math.min(100, pct)}%"></div>
            </div>
          </div>
        </div>
      </div>`;
  }).join('');

  // Sisa / rad / aul
  const infoSisa = document.getElementById('info-sisa');
  if (sisa > 1) {
    infoSisa.className = 'mt-4 p-3 rounded-xl text-xs font-medium bg-amber-50 border border-amber-200 text-amber-800';
    infoSisa.innerHTML = `⚠️ <strong>Sisa harta: ${formatRupiah(sisa)}</strong> — Dikembalikan ke ahli waris secara proporsional (Rad) atau diserahkan ke Baitul Mal.`;
    infoSisa.classList.remove('hidden');
  } else if (sisa < -1) {
    infoSisa.className = 'mt-4 p-3 rounded-xl text-xs font-medium bg-red-50 border border-red-200 text-red-700';
    infoSisa.innerHTML = `⚠️ Total bagian melebihi harta — perlu dilakukan <strong>Aul</strong> (pengurangan proporsional semua bagian).`;
    infoSisa.classList.remove('hidden');
  } else {
    infoSisa.classList.add('hidden');
  }

  // Dasar hukum
  const dasarEl = document.getElementById('dasar-hukum-list');
  if (dasarEl) {
    dasarEl.innerHTML = [...dasarHukum].map(d =>
      `<div class="flex items-center gap-2 text-white/80 text-xs">
        <span class="w-4 h-4 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">✓</span>${d}
      </div>`
    ).join('');
  }

  document.getElementById('placeholder-waris').classList.add('hidden');
  document.getElementById('hasilWarisPanel').classList.remove('hidden');
  const dc = document.getElementById('dasar-hukum-card');
  if (dc) dc.classList.remove('hidden');

  showToast('Perhitungan berhasil!', 'success');
  document.getElementById('hasilWarisPanel').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function resetKalkulator() {
  const ids = [
    'hartaWarisan','jumlahAnakLaki','jumlahAnakPerempuan',
    'jumlahSaudaraLakiKandung','jumlahSaudaraPerempuanKandung',
    'jumlahSaudaraLakiSeibu','jumlahSaudaraPerempuanSeibu',
    'jumlahSaudaraLakiSeayah','jumlahSaudaraPerempuanSeayah'
  ];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = id === 'hartaWarisan' ? '' : 0;
  });
  const selects = ['pasangan','statusAyah','statusIbu'];
  selects.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = 'tidak_ada';
  });
  document.getElementById('placeholder-waris').classList.remove('hidden');
  document.getElementById('hasilWarisPanel').classList.add('hidden');
  const infoSisa = document.getElementById('info-sisa');
  if (infoSisa) infoSisa.classList.add('hidden');
}

// ==================== Boot ====================
renderQuiz();
lucide.createIcons();
