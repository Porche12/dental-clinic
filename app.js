// Dental Prestige Clinic Application Logic

// 1. Services Catalog Data
const SERVICES = [
  {
    id: 1,
    category: "therapy",
    icon: "🦷",
    title: "Лечение кариеса и реставрация",
    desc: "Эстетическое восстановление анатомической формы зуба нанокомпозитами последнего поколения под микроскопом.",
    price: "от 4 500 ₽"
  },
  {
    id: 2,
    category: "therapy",
    icon: "🔬",
    title: "Лечение каналов под микроскопом",
    desc: "Эндодонтическое лечение с оптикой Carl Zeiss 30x. Герметичная 3D-обтурация горячей гуттаперчей.",
    price: "от 9 500 ₽"
  },
  {
    id: 3,
    category: "implant",
    icon: "⚡",
    title: "Имплантация Nobel Biocare (Швейцария)",
    desc: "Премиальная имплантация с пожизненной международной гарантией. Приживаемость 99.8%.",
    price: "от 55 000 ₽"
  },
  {
    id: 4,
    category: "implant",
    icon: "🔩",
    title: "Имплантация Osstem (Южная Корея)",
    desc: "Оптимальное соотношение цены и долговечности. Быстрое приживление благодаря биосовместимому покрытию SA.",
    price: "от 38 000 ₽"
  },
  {
    id: 5,
    category: "aesthetic",
    icon: "✨",
    title: "Керамические виниры E-Max",
    desc: "Ультратонкие цельнокерамические виниры ручной работы немецких зубных техников. Идеальная эстетика без обточки.",
    price: "от 29 000 ₽"
  },
  {
    id: 6,
    category: "aesthetic",
    icon: "💎",
    title: "Отбеливание зубов Zoom 4 WhiteSpeed",
    desc: "Осветление эмали до 8–10 тонов за 45 минут с холодным светодиодным LED-светом без перегрева пульпы.",
    price: "от 18 000 ₽"
  },
  {
    id: 7,
    category: "ortho",
    icon: "📐",
    title: "Исправление прикуса элайнерами Spark",
    desc: "Прозрачные незаметные каппы для выравнивания зубов с цифровым 3D-планированием перемещения.",
    price: "от 140 000 ₽"
  },
  {
    id: 8,
    category: "ortho",
    icon: "🎯",
    title: "Керамические брекеты Damon Clear",
    desc: "Самолигирующие безлигатурные эстетические брекеты. Быстрый результат с минимальным дискомфортом.",
    price: "от 110 000 ₽"
  },
  {
    id: 9,
    category: "surgery",
    icon: "🛡",
    title: "Атравматичное удаление зубов мудрости",
    desc: "Бережное удаление ультразвуком Piezosurgery с сохранением костной ткани и мгновенным заживлением.",
    price: "от 6 000 ₽"
  }
];

// Initialize on DOM Load
document.addEventListener("DOMContentLoaded", () => {
  renderServices("all");
  setupFilters();
  setupCalculator();
  setupBeforeAfterSlider();
  setupPhoneMasks();
  setupDefaultDate();
});

// Render Services
function renderServices(category) {
  const grid = document.getElementById("servicesGrid");
  if (!grid) return;
  
  const filtered = category === "all" ? SERVICES : SERVICES.filter(s => s.category === category);
  
  grid.innerHTML = filtered.map(s => `
    <div class="service-card">
      <div class="service-card-top">
        <div class="service-icon-box">${s.icon}</div>
        <h3>${s.title}</h3>
        <p>${s.desc}</p>
      </div>
      <div class="service-card-bottom">
        <span class="service-price">${s.price}</span>
        <button class="btn btn-outline btn-sm" onclick="bookService('${s.title}')">Записаться</button>
      </div>
    </div>
  `).join("");
}

// Setup Filters
function setupFilters() {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderServices(btn.dataset.category);
    });
  });
}

// Interactive Calculator
let currentBasePrice = 4500;
let currentTeethCount = 1;

function setupCalculator() {
  const chipButtons = document.querySelectorAll(".chip-btn");
  const slider = document.getElementById("teethCountRange");
  const countDisplay = document.getElementById("teethCountDisplay");
  const optCt = document.getElementById("optCtScan");
  const optMicro = document.getElementById("optMicroscope");
  const optSed = document.getElementById("optSedation");

  chipButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      chipButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentBasePrice = parseInt(btn.dataset.price, 10);
      recalcTotal();
    });
  });

  if (slider && countDisplay) {
    slider.addEventListener("input", (e) => {
      currentTeethCount = parseInt(e.target.value, 10);
      countDisplay.textContent = currentTeethCount;
      recalcTotal();
    });
  }

  [optCt, optMicro, optSed].forEach(opt => {
    if (opt) opt.addEventListener("change", recalcTotal);
  });

  recalcTotal();
}

function recalcTotal() {
  const optCt = document.getElementById("optCtScan");
  const optMicro = document.getElementById("optMicroscope");
  const optSed = document.getElementById("optSedation");
  const totalDisplay = document.getElementById("calcTotal");
  const instDisplay = document.getElementById("installmentDisplay");

  let base = currentBasePrice * currentTeethCount;
  let extras = 0;

  if (optCt && optCt.checked) extras += parseInt(optCt.value, 10);
  if (optMicro && optMicro.checked) extras += parseInt(optMicro.value, 10);
  if (optSed && optSed.checked) extras += parseInt(optSed.value, 10);

  const total = base + extras;
  const installment = Math.round(total / 12);

  if (totalDisplay) {
    totalDisplay.textContent = `${total.toLocaleString("ru-RU")} ₽`;
  }
  if (instDisplay) {
    instDisplay.textContent = installment.toLocaleString("ru-RU");
  }
}

function bookFromCalculator() {
  const activeChip = document.querySelector(".chip-btn.active");
  const serviceName = activeChip ? activeChip.textContent.trim() : "Комплексное лечение";
  openBookingModal(serviceName);
}

// Before / After Slider Logic
function setupBeforeAfterSlider() {
  const container = document.getElementById("compareContainer1");
  if (!container) return;

  const beforeWrapper = container.querySelector(".img-before-wrapper");
  const slider = container.querySelector(".comparison-slider");
  let isDragging = false;

  const updateSlider = (x) => {
    const rect = container.getBoundingClientRect();
    let pos = x - rect.left;
    if (pos < 0) pos = 0;
    if (pos > rect.width) pos = rect.width;
    const percentage = (pos / rect.width) * 100;
    beforeWrapper.style.width = `${percentage}%`;
    slider.style.left = `${percentage}%`;
  };

  container.addEventListener("mousedown", (e) => {
    isDragging = true;
    updateSlider(e.clientX);
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    updateSlider(e.clientX);
  });

  // Touch Support
  container.addEventListener("touchstart", (e) => {
    isDragging = true;
    updateSlider(e.touches[0].clientX);
  });

  window.addEventListener("touchend", () => {
    isDragging = false;
  });

  window.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    updateSlider(e.touches[0].clientX);
  });
}

// Booking Modal Controls
function openBookingModal(serviceTitle = "") {
  const modal = document.getElementById("bookingModal");
  if (!modal) return;
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeBookingModal() {
  const modal = document.getElementById("bookingModal");
  if (!modal) return;
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

function closeModalOnOverlay(e) {
  if (e.target.id === "bookingModal") {
    closeBookingModal();
  }
}

function bookService(title) {
  openBookingModal(title);
}

function bookDoctor(docName) {
  openBookingModal();
  const select = document.getElementById("mDoctor");
  if (select) {
    for (let opt of select.options) {
      if (opt.value.includes(docName)) {
        select.value = opt.value;
        break;
      }
    }
  }
}

// Direct Form Submissions
function handleDirectBooking(e) {
  e.preventDefault();
  const name = document.getElementById("directName").value.trim();
  const phone = document.getElementById("directPhone").value.trim();
  const service = document.getElementById("directService").value;

  showToast(`Спасибо, ${name}!`, `Заявка на «${service}» принята. Мы перезвоним вам по номеру ${phone}.`);
  e.target.reset();
}

function handleModalBooking(e) {
  e.preventDefault();
  const name = document.getElementById("mName").value.trim();
  const phone = document.getElementById("mPhone").value.trim();
  const date = document.getElementById("mDate").value;
  const time = document.getElementById("mTime").value;
  const doctor = document.getElementById("mDoctor").value;

  closeBookingModal();
  showToast(`Запись подтверждена!`, `${name}, вы записаны на ${date} в ${time} к врачу: ${doctor}.`);
  e.target.reset();
}

// Toast System
function showToast(title, message) {
  const toast = document.getElementById("toast");
  const titleEl = document.getElementById("toastTitle");
  const msgEl = document.getElementById("toastMessage");

  if (!toast) return;

  titleEl.textContent = title;
  msgEl.textContent = message;
  toast.classList.add("active");

  setTimeout(() => {
    toast.classList.remove("active");
  }, 5000);
}

// Phone Masks (+7 (XXX) XXX-XX-XX)
function setupPhoneMasks() {
  const phones = [document.getElementById("directPhone"), document.getElementById("mPhone")];
  phones.forEach(input => {
    if (!input) return;
    input.addEventListener("input", (e) => {
      let val = e.target.value.replace(/\D/g, "");
      if (val.startsWith("7") || val.startsWith("8")) val = val.substring(1);
      val = val.substring(0, 10);

      let formatted = "+7 (";
      if (val.length > 0) formatted += val.substring(0, 3);
      if (val.length >= 3) formatted += ") " + val.substring(3, 6);
      if (val.length >= 6) formatted += "-" + val.substring(6, 8);
      if (val.length >= 8) formatted += "-" + val.substring(8, 10);

      e.target.value = val.length === 0 ? "" : formatted;
    });
  });
}

function setupDefaultDate() {
  const dateInput = document.getElementById("mDate");
  if (dateInput) {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    dateInput.value = today.toISOString().split("T")[0];
    dateInput.min = new Date().toISOString().split("T")[0];
  }
}

function toggleMobileMenu() {
  const nav = document.getElementById("navLinks");
  if (nav) {
    nav.style.display = nav.style.display === "flex" ? "none" : "flex";
    nav.style.flexDirection = "column";
    nav.style.position = "absolute";
    nav.style.top = "80px";
    nav.style.left = "0";
    nav.style.width = "100%";
    nav.style.background = "#ffffff";
    nav.style.padding = "20px";
    nav.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
  }
}
