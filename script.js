(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Sticky header, reading progress, back-to-top, and active navigation state.
  const header = $('.site-header');
  const progress = $('.progress-track span');
  const topButton = $('.back-to-top');
  const navLinks = $$('.main-nav a');
  const sections = navLinks.map(link => $(link.getAttribute('href'))).filter(Boolean);
  let scrollQueued = false;
  const updateScrollState = () => {
    const maxScroll = document.documentElement.scrollHeight - innerHeight;
    const ratio = maxScroll > 0 ? scrollY / maxScroll : 0;
    progress.style.width = `${Math.min(100, ratio * 100)}%`;
    header.classList.toggle('scrolled', scrollY > 16);
    topButton.classList.toggle('visible', scrollY > 600);
    let current = '';
    sections.forEach(section => { if (section.getBoundingClientRect().top < innerHeight * .42) current = `#${section.id}`; });
    navLinks.forEach(link => link.classList.toggle('active', link.hash === current));
    scrollQueued = false;
  };
  addEventListener('scroll', () => { if (!scrollQueued) { requestAnimationFrame(updateScrollState); scrollQueued = true; } }, { passive: true });
  updateScrollState();
  topButton.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  // Mobile menu closes after navigation and when the user presses Escape.
  const menuToggle = $('.menu-toggle');
  const mainNav = $('.main-nav');
  const closeMenu = () => { menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', '打开导航菜单'); mainNav.classList.remove('open'); };
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
    mainNav.classList.toggle('open', open);
  });
  navLinks.forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

  // Light/dark theme with a remembered user preference.
  const themeToggle = $('.theme-toggle');
  const themeIcon = $('.theme-icon');
  const applyTheme = dark => {
    document.body.classList.toggle('dark', dark);
    themeIcon.textContent = dark ? '☀' : '☾';
    themeToggle.setAttribute('aria-label', dark ? '切换浅色模式' : '切换深色模式');
    document.querySelector('meta[name="theme-color"]').content = dark ? '#0c0c0e' : '#f5f5f7';
  };
  const savedTheme = localStorage.getItem('iphone17-theme');
  applyTheme(savedTheme ? savedTheme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches);
  themeToggle.addEventListener('click', () => {
    const dark = !document.body.classList.contains('dark');
    applyTheme(dark);
    localStorage.setItem('iphone17-theme', dark ? 'dark' : 'light');
  });

  // Reveal sections only after they enter the viewport.
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('in-view'); revealObserver.unobserve(entry.target); }
  }), { threshold: .12 });
  $$('.reveal').forEach(element => revealObserver.observe(element));

  // Color selector updates both the CSS phone and hero accents.
  const colorMap = {
    lavender: { name: '薰衣草紫', image: 'assets/iphone-17-lavender.jpg' },
    sage: { name: '鼠尾草绿', image: 'assets/iphone-17-sage.jpg' },
    blue: { name: '雾蓝色', image: 'assets/iphone-17-blue.jpg' },
    white: { name: '白色', image: 'assets/iphone-17-white.jpg' },
    black: { name: '黑色', image: 'assets/iphone-17-black.jpg' }
  };
  $$('.swatch').forEach(button => button.addEventListener('click', () => {
    const color = colorMap[button.dataset.color];
    if (!color) return;
    $$('.swatch').forEach(item => { const selected = item === button; item.classList.toggle('selected', selected); item.setAttribute('aria-pressed', String(selected)); });
    const productImage = $('#color-product-image');
    productImage.style.opacity = '0.35';
    productImage.src = color.image;
    productImage.alt = `Apple 官方${color.name} iPhone 17 背面特写`;
    productImage.onload = () => { productImage.style.opacity = '1'; };
  }));

  // Pointer drag and touch scrolling for the highlights carousel.
  const carousel = $('.feature-carousel');
  let dragging = false, dragStart = 0, dragScroll = 0, dragged = false;
  carousel.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    dragging = true; dragged = false; dragStart = event.clientX; dragScroll = carousel.scrollLeft;
    carousel.classList.add('dragging'); carousel.setPointerCapture(event.pointerId);
  });
  carousel.addEventListener('pointermove', event => {
    if (!dragging) return;
    const delta = event.clientX - dragStart;
    if (Math.abs(delta) > 4) dragged = true;
    carousel.scrollLeft = dragScroll - delta;
  });
  const endDrag = () => { dragging = false; carousel.classList.remove('dragging'); setTimeout(() => { dragged = false; }, 0); };
  carousel.addEventListener('pointerup', endDrag); carousel.addEventListener('pointercancel', endDrag);
  carousel.addEventListener('click', event => { if (dragged) { event.preventDefault(); event.stopPropagation(); } }, true);
  const moveCarousel = direction => {
    const card = $('.feature-card', carousel);
    carousel.scrollBy({ left: direction * (card.getBoundingClientRect().width + 21), behavior: 'smooth' });
  };
  $('.carousel-arrow.prev').addEventListener('click', () => moveCarousel(-1));
  $('.carousel-arrow.next').addEventListener('click', () => moveCarousel(1));
  carousel.addEventListener('keydown', event => { if (event.key === 'ArrowRight') moveCarousel(1); if (event.key === 'ArrowLeft') moveCarousel(-1); });

  // Camera lens details: tab controls plus accessible modal from physical lens hotspots.
  const lensCopy = {
    main: ['48MP Fusion 主摄', '26 毫米主摄具备 ƒ/1.6 光圈、传感器位移式光学图像防抖与 100% Focus Pixels，并支持 24MP / 48MP 照片和 2 倍光学品质长焦。'],
    ultra: ['48MP Fusion 超广角', '13 毫米超广角摄像头拥有 120° 视角与 ƒ/2.2 光圈，支持高分辨率照片和 48MP 微距摄影。'],
    front: ['18MP Center Stage 前置摄像头', '方形传感器支持灵活取景、自动构图与横竖切换；也支持视频通话 Center Stage、超稳定视频和 Dual Capture。']
  };
  const showLens = name => {
    $$('.lens-detail').forEach(detail => detail.classList.toggle('active', detail.id === `lens-${name}`));
    $$('.lens-tab').forEach(tab => tab.classList.toggle('selected', tab.dataset.show === name));
  };
  $$('.lens-tab').forEach(tab => tab.addEventListener('click', () => showLens(tab.dataset.show)));
  const cameraDialog = $('.camera-dialog');
  $$('.camera-hotspot').forEach(hotspot => hotspot.addEventListener('click', () => {
    const name = hotspot.dataset.lens || (hotspot.classList.contains('lens-one') ? 'main' : 'ultra');
    const [title, copy] = lensCopy[name] || lensCopy.main;
    showLens(name); $('#dialog-title').textContent = title; $('#dialog-copy').textContent = copy;
    if (typeof cameraDialog.showModal === 'function') cameraDialog.showModal();
    else cameraDialog.setAttribute('open', '');
  }));
  $('.dialog-close').addEventListener('click', () => cameraDialog.close());
  cameraDialog.addEventListener('click', event => { if (event.target === cameraDialog) cameraDialog.close(); });

  // Scene demo changes its local illustration and descriptive caption.
  const sceneInfo = {
    portrait: ['自然光人像', '48MP Fusion 主摄 · 2 倍光学品质长焦'],
    landscape: ['开阔风景', '48MP Fusion 超广角 · 120° 视角'],
    macro: ['微距细节', '48MP Fusion 超广角 · 微距摄影'],
    night: ['夜色时分', '夜间模式 · 更自然地记录暗光氛围']
  };
  $$('.scene-tab').forEach(button => button.addEventListener('click', () => {
    const scene = button.dataset.scene;
    $$('.scene-tab').forEach(tab => tab.classList.toggle('active', tab === button));
    const view = $('.scene-view');
    view.className = `scene-view scene-${scene}`;
    $('.scene-caption b').textContent = sceneInfo[scene][0];
    $('.scene-caption span').textContent = sceneInfo[scene][1];
  }));

  // A19 core explorer updates both the copy and selected visual node.
  const coreInfo = {
    cpu: ['6 核 CPU：快速响应日常任务。', '2 个性能核心与 4 个能效核心协同处理应用启动、多任务和日常计算。'],
    gpu: ['5 核 GPU：图形与游戏表现。', '5 核 GPU 配备神经网络加速器，支持硬件加速光线追踪，为图形任务提供专用处理能力。'],
    neural: ['16 核 Neural Engine：机器学习任务。', 'Neural Engine 为设备端机器学习任务提供专门计算能力，可参与 Apple Intelligence 功能处理。']
  };
  const setCore = core => {
    if (!coreInfo[core]) return;
    $('#chip-title').textContent = coreInfo[core][0]; $('#chip-description').textContent = coreInfo[core][1];
    $$('[data-core]').forEach(node => node.classList.toggle('active', node.dataset.core === core));
  };
  $$('[data-core]').forEach(button => button.addEventListener('click', () => setCore(button.dataset.core)));

  // Charging and battery cards update a concise information panel.
  const powerInfo = {
    battery: ['长效电池续航', 'Apple 标称视频播放最长 30 小时，流媒体视频播放最长 27 小时。实际续航因网络、设置、使用方式和其他因素而异。'],
    wired: ['USB-C 快速充电', '搭配 40W 或更高功率 USB-C 电源适配器与充电线，约 20 分钟可充至最高 50%。适配器需另购；测试条件会影响实际充电速度。'],
    wireless: ['MagSafe 与 Qi2 无线充电', 'MagSafe 与 Qi2 无线充电功率最高 25W。Apple 测试使用相应充电器与适配器；实际充电速度受环境、配件和设备状态影响。']
  };
  $$('.power-card').forEach(button => button.addEventListener('click', () => {
    $$('.power-card').forEach(card => card.classList.toggle('active', card === button));
    const [title, copy] = powerInfo[button.dataset.power];
    $('#power-detail-title').textContent = title; $('#power-detail-copy').textContent = copy;
  }));

  // FAQ behaves as a single-open accordion while preserving native details semantics.
  $$('.faq-list details').forEach(detail => detail.addEventListener('toggle', () => {
    if (detail.open) $$('.faq-list details').forEach(other => { if (other !== detail) other.open = false; });
  }));
})();
