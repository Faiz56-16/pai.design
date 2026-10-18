import gsap from "gsap";

function initNavbar() {
  const burger = document.querySelector("#burger-btn");
  const panel = document.querySelector("#menu-overlay");
  const backdrop = document.querySelector("#menu-backdrop");

  // Guard Clause: Hentikan skrip jika elemen navbar tidak ada di halaman ini
  if (!burger || !panel || !backdrop) return;

  const line1 = document.querySelector("#burger-line-1");
  const line2 = document.querySelector("#burger-line-2");
  const line3 = document.querySelector("#burger-line-3");

  const items = gsap.utils.toArray(".menu-item");
  const canHover = window.matchMedia("(hover: hover)").matches;

  let isOpen = false;

  // ========================================
  // INITIAL STATE
  // ========================================

  gsap.set(panel, { xPercent: -100, autoAlpha: 0 });
  gsap.set(backdrop, { autoAlpha: 0 });
  if (items.length) gsap.set(items, { x: -12, autoAlpha: 0 });
  if (line2) gsap.set(line2, { transformOrigin: "left center" });

  // ========================================
  // BURGER <-> X
  // ========================================

  function showX() {
    if (line1) gsap.to(line1, { y: 9, rotation: 45, duration: 0.3, ease: "power2.out", overwrite: true });
    if (line2) gsap.to(line2, { scaleX: 0, autoAlpha: 0, duration: 0.2, overwrite: true });
    if (line3) gsap.to(line3, { y: -9, rotation: -45, duration: 0.3, ease: "power2.out", overwrite: true });
  }

  function showBurger() {
    if (line1) gsap.to(line1, { y: 0, rotation: 0, duration: 0.3, ease: "power2.out", overwrite: true });
    if (line2) gsap.to(line2, { scaleX: 1, autoAlpha: 1, duration: 0.25, overwrite: true });
    if (line3) gsap.to(line3, { y: 0, rotation: 0, duration: 0.3, ease: "power2.out", overwrite: true });
  }

  // Hover (desktop only): middle line extends while the menu is closed
  if (canHover && line2) {
    burger.addEventListener("mouseenter", () => {
      if (!isOpen) gsap.to(line2, { scaleX: 1.5, duration: 0.25, ease: "power2.out", overwrite: true });
    });

    burger.addEventListener("mouseleave", () => {
      if (!isOpen) gsap.to(line2, { scaleX: 1, duration: 0.25, ease: "power2.out", overwrite: true });
    });
  }

  // ========================================
  // MENU TIMELINE
  // ========================================

  const menuTL = gsap.timeline({ paused: true });

  menuTL
    .to(backdrop, { autoAlpha: 1, duration: 0.4, ease: "power1.out" }, 0)
    .to(panel, { xPercent: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" }, 0);

  if (items.length) {
    menuTL.to(
      items,
      { x: 0, autoAlpha: 1, stagger: 0.05, duration: 0.4, ease: "power2.out" },
      0.25
    );
  }

  // ========================================
  // OPEN / CLOSE
  // ========================================

  function openMenu() {
    isOpen = true;

    panel.classList.remove("pointer-events-none");
    backdrop.classList.remove("pointer-events-none");
    panel.setAttribute("aria-hidden", "false");
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Tutup menu");
    document.documentElement.style.overflow = "hidden";

    menuTL.timeScale(1).play();
    showX();
  }

  function closeMenu() {
    isOpen = false;

    panel.classList.add("pointer-events-none");
    backdrop.classList.add("pointer-events-none");
    panel.setAttribute("aria-hidden", "true");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Buka menu");
    document.documentElement.style.overflow = "";

    menuTL.timeScale(1.4).reverse();
    showBurger();
  }

  burger.addEventListener("click", () => (isOpen ? closeMenu() : openMenu()));
  backdrop.addEventListener("click", closeMenu);

  // Klik chapter menutup menu
  items.forEach((item) => {
    item.addEventListener("click", () => {
      if (isOpen) closeMenu();
    });
  });

  // Escape menutup menu
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) closeMenu();
  });
}

// Menjalankan fungsi setelah struktur DOM selesai dimuat
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initNavbar);
} else {
  initNavbar();
}