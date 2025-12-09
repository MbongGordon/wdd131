(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const formatNaira = (n) =>
    `₦${Number(n).toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;

  const storage = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    },
    remove(key) {
      localStorage.removeItem(key);
    },
  };

  // Data (objects + arrays)
  const products = [
    { id: "fresh-loin", name: "Fresh Pork Loin", category: "fresh", price: 12000, unit: "per kg", desc: "Lean, tender cut for roasting and chops.", image: "images/products/fresh-loin.jpg", badge: "Fresh" },
    { id: "fresh-shoulder", name: "Fresh Pork Shoulder", category: "fresh", price: 9500, unit: "per kg", desc: "Great for stews, shredding, and slow cooking.", image: "images/products/fresh-shoulder.jpg", badge: "Fresh" },
    { id: "fresh-ribs", name: "Pork Ribs", category: "fresh", price: 15000, unit: "per kg", desc: "Juicy ribs for grilling, smoking, or oven baking.", image: "images/products/fresh-ribs.jpg", badge: "Fresh" },
    { id: "fresh-belly", name: "Pork Belly", category: "fresh", price: 14000, unit: "per kg", desc: "Rich cut for crispy pork, stir-fry, or braising.", image: "images/products/fresh-belly.jpg", badge: "Fresh" },
    { id: "fresh-mince", name: "Fresh Pork Mince", category: "fresh", price: 8000, unit: "per kg", desc: "Ground pork for meatballs, patties, and fillings.", image: "images/products/fresh-mince.jpg", badge: "Fresh" },

    { id: "proc-sausage", name: "Farm Sausages", category: "processed", price: 7000, unit: "per pack", desc: "Seasoned sausages, suitable for breakfast and snacks.", image: "images/products/proc-sausage.jpg", badge: "Processed" },
    { id: "proc-smoked", name: "Smoked Pork", category: "processed", price: 16000, unit: "per kg", desc: "Smoked for flavor, ideal for soups and sauces.", image: "images/products/proc-smoked.jpg", badge: "Processed" },
    { id: "proc-bacon", name: "Bacon Strips", category: "processed", price: 9000, unit: "per pack", desc: "Crisp-ready strips with balanced fat and flavor.", image: "images/products/proc-bacon.jpg", badge: "Processed" },
    { id: "proc-ham", name: "Cured Ham", category: "processed", price: 18000, unit: "per kg", desc: "Cured ham for sandwiches and meals.", image: "images/products/proc-ham.jpg", badge: "Processed" },

    { id: "breed-piglets", name: "Healthy Piglets", category: "breeding", price: 25000, unit: "each", desc: "Strong starter piglets for new and growing farms.", image: "images/products/breed-piglets.jpg", badge: "Breeding" },
    { id: "breed-growers", name: "Grower Pigs", category: "breeding", price: 42000, unit: "each", desc: "Growers ready for finishing or farm expansion.", image: "images/products/breed-growers.jpg", badge: "Breeding" },
    { id: "breed-sow", name: "Mature Sow", category: "breeding", price: 60000, unit: "each", desc: "Mature sow option based on availability and checks.", image: "images/products/breed-sow.jpg", badge: "Breeding" },
    { id: "breed-boar", name: "Breeding Boar", category: "breeding", price: 60000, unit: "each", desc: "Breeding boar option based on availability and checks.", image: "images/products/breed-boar.jpg", badge: "Breeding" },
  ];

  const galleryImages = [
    { src: "images/gallery/farm-1.jpg", alt: "Clean pig pens and farm walkway", cat: "farm", caption: "Clean pens and safe walkways" },
    { src: "images/gallery/farm-2.jpg", alt: "Feed storage and preparation area", cat: "farm", caption: "Feed storage and preparation" },
    { src: "images/gallery/animals-1.jpg", alt: "Healthy pigs in a clean pen", cat: "animals", caption: "Healthy pigs in comfortable housing" },
    { src: "images/gallery/animals-2.jpg", alt: "Piglets feeding", cat: "animals", caption: "Strong piglets feeding well" },
    { src: "images/gallery/products-1.jpg", alt: "Fresh pork cuts packaged", cat: "products", caption: "Fresh cuts packaged safely" },
    { src: "images/gallery/products-2.jpg", alt: "Processed pork products", cat: "products", caption: "Processed products ready for customers" },
    { src: "images/gallery/farm-3.jpg", alt: "Farm staff doing routine checks", cat: "farm", caption: "Routine checks and monitoring" },
    { src: "images/gallery/animals-3.jpg", alt: "Grower pig in pen", cat: "animals", caption: "Grower pig—healthy growth" },
    { src: "images/gallery/products-3.jpg", alt: "Smoked pork product", cat: "products", caption: "Smoked pork for rich flavor" },
  ];

  // Year
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = `${new Date().getFullYear()}`;

  // Mobile nav (DOM + event)
  const initMobileMenu = () => {
    const btn = $("[data-nav-toggle]");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("nav-open");
      btn.setAttribute("aria-expanded", `${isOpen}`);
    });

    const nav = $("#siteNav");
    if (!nav) return;

    nav.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (!link) return;
      document.body.classList.remove("nav-open");
      btn.setAttribute("aria-expanded", "false");
    });
  };

  // Back-to-top (DOM + event)
  const initBackToTop = () => {
    const btn = $("[data-back-to-top]");
    if (!btn) return;

    const toggle = () => {
      if (window.scrollY > 450) btn.classList.add("is-visible");
      else btn.classList.remove("is-visible");
    };

    window.addEventListener("scroll", toggle, { passive: true });
    toggle();

    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  };

  // Hero slider (functions + DOM + events)
  const initHeroSlider = () => {
    const slider = $("[data-hero-slider]");
    if (!slider) return;

    const slides = $$(".hero-slide", slider);
    if (slides.length < 2) return;

    let idx = 0;
    let timer = null;

    const show = (next) => {
      slides[idx].classList.remove("is-active");
      idx = (next + slides.length) % slides.length;
      slides[idx].classList.add("is-active");
    };

    const start = () => {
      stop();
      timer = window.setInterval(() => show(idx + 1), 5000);
    };

    const stop = () => {
      if (timer) window.clearInterval(timer);
      timer = null;
    };

    const prevBtn = $("[data-hero-prev]");
    const nextBtn = $("[data-hero-next]");
    if (prevBtn) prevBtn.addEventListener("click", () => { show(idx - 1); start(); });
    if (nextBtn) nextBtn.addEventListener("click", () => { show(idx + 1); start(); });

    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);

    start();
  };

  // Template literal output: product cards
  const productCardHTML = (p, compact) => {
    const label = p.badge ? `<span class="pill">${p.badge}</span>` : "";
    const desc = compact ? "" : `<p class="muted small">${p.desc}</p>`;
    return `
      <article class="card">
        <div class="card-media">
          <img src="${p.image}" alt="${p.name}" width="960" height="640" loading="lazy">
        </div>
        <div class="card-title">
          <h3>${p.name}</h3>
          <div style="text-align:right">
            ${label}
            <div class="price">${formatNaira(p.price)}</div>
            <div class="muted small">${p.unit}</div>
          </div>
        </div>
        ${desc}
        <div class="card-actions">
          <button class="btn btn-secondary" type="button" data-product-open="${p.id}">More Info</button>
          <a class="btn btn-ghost" href="contact.html">Order / Ask</a>
        </div>
      </article>
    `;
  };

  const renderFeatured = () => {
    const target = $("#featuredProducts");
    if (!target) return;
    const featured = products.slice(0, 6);
    target.innerHTML = `${featured.map((p) => productCardHTML(p, true)).join("")}`;
  };

  // Products page: filters + localStorage + array methods
  const FILTERS_KEY = "ghinckz_filters_v1";

  const initProducts = () => {
    const grid = $("#productGrid");
    if (!grid) return;

    const state = {
      categories: new Set(["fresh", "processed", "breeding"]),
      maxPrice: 60000,
      sort: "featured",
    };

    const saved = storage.get(FILTERS_KEY, null);
    if (saved) {
      if (Array.isArray(saved.categories)) state.categories = new Set(saved.categories);
      if (Number.isFinite(saved.maxPrice)) state.maxPrice = saved.maxPrice;
      if (typeof saved.sort === "string") state.sort = saved.sort;
    }

    const maxPriceInput = $("#maxPrice");
    const maxPriceLabel = $("#maxPriceLabel");
    const sortSelect = $("#sortSelect");
    const countEl = $("#productCount");
    const clearBtn = $("[data-clear-filters]");

    $$('input[name="category"]').forEach((cb) => { cb.checked = state.categories.has(cb.value); });
    if (maxPriceInput) maxPriceInput.value = `${state.maxPrice}`;
    if (maxPriceLabel) maxPriceLabel.textContent = `${formatNaira(state.maxPrice)}`;
    if (sortSelect) sortSelect.value = `${state.sort}`;

    const persist = () => {
      storage.set(FILTERS_KEY, {
        categories: Array.from(state.categories),
        maxPrice: state.maxPrice,
        sort: state.sort,
      });
    };

    const sortProducts = (arr) => {
      const copy = [...arr];
      switch (state.sort) {
        case "price-asc": return copy.sort((a, b) => a.price - b.price);
        case "price-desc": return copy.sort((a, b) => b.price - a.price);
        case "name-asc": return copy.sort((a, b) => a.name.localeCompare(b.name));
        default: return copy;
      }
    };

    const apply = () => {
      const filtered = products
        .filter((p) => state.categories.has(p.category))
        .filter((p) => p.price <= state.maxPrice);

      const sorted = sortProducts(filtered);

      grid.innerHTML = `${sorted.map((p) => productCardHTML(p, false)).join("")}`;
      if (countEl) countEl.textContent = `Showing ${sorted.length} product(s)`;

      persist();
    };

    $$('input[name="category"]').forEach((cb) => {
      cb.addEventListener("change", () => {
        if (cb.checked) state.categories.add(cb.value);
        else state.categories.delete(cb.value);

        // conditional branching (avoid empty selection)
        if (state.categories.size === 0) {
          state.categories.add(cb.value);
          cb.checked = true;
        }
        apply();
      });
    });

    if (maxPriceInput) {
      maxPriceInput.addEventListener("input", () => {
        state.maxPrice = Number(maxPriceInput.value);
        if (maxPriceLabel) maxPriceLabel.textContent = `${formatNaira(state.maxPrice)}`;
        apply();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", () => {
        state.sort = `${sortSelect.value}`;
        apply();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        state.categories = new Set(["fresh", "processed", "breeding"]);
        state.maxPrice = 60000;
        state.sort = "featured";

        $$('input[name="category"]').forEach((cb) => (cb.checked = true));
        if (maxPriceInput) maxPriceInput.value = `${state.maxPrice}`;
        if (maxPriceLabel) maxPriceLabel.textContent = `${formatNaira(state.maxPrice)}`;
        if (sortSelect) sortSelect.value = `${state.sort}`;

        apply();
      });
    }

    initProductModal(grid);
    apply();
  };

  const capitalize = (s) => (s ? `${s.charAt(0).toUpperCase()}${s.slice(1)}` : "");

  const initProductModal = (grid) => {
    const modal = $("[data-modal]");
    const modalBody = $("#modalBody");
    if (!modal || !modalBody) return;

    const open = (productId) => {
      const p = products.find((x) => x.id === productId);
      if (!p) return;

      modalBody.innerHTML = `
        <h3 id="modalTitle">${p.name}</h3>
        <p class="muted">${p.desc}</p>

        <div class="grid" style="grid-template-columns:1fr;gap:.75rem;margin-top:.75rem">
          <div class="card" style="padding:0;border:none;box-shadow:none">
            <img src="${p.image}" alt="${p.name}" width="960" height="640" loading="lazy" style="border-radius:16px">
          </div>

          <div class="card" style="box-shadow:none;border:1px solid rgba(0,0,0,.06)">
            <p><strong>Category:</strong> ${capitalize(p.category)}</p>
            <p><strong>Price:</strong> ${formatNaira(p.price)} <span class="muted">(${p.unit})</span></p>
            <p class="muted small">For bulk orders, include quantity and location in your message.</p>
            <a class="btn btn-primary" href="contact.html">Request Pricing</a>
          </div>
        </div>
      `;

      modal.hidden = false;
      document.body.style.overflow = "hidden";
    };

    const close = () => {
      modal.hidden = true;
      document.body.style.overflow = "";
    };

    grid.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-product-open]");
      if (!btn) return;
      open(`${btn.getAttribute("data-product-open")}`);
    });

    $$("[data-modal-close]").forEach((el) => el.addEventListener("click", close));
    window.addEventListener("keydown", (e) => {
      if (!modal.hidden && e.key === "Escape") close();
    });
  };

  // Gallery page (DOM + events + arrays)
  const initGallery = () => {
    const grid = $("#galleryGrid");
    if (!grid) return;

    const filterSel = $("#galleryFilter");
    const countEl = $("#galleryCount");

    const state = { filter: "all", currentIndex: 0, currentList: [...galleryImages] };

    const render = () => {
      const list =
        state.filter === "all"
          ? [...galleryImages]
          : galleryImages.filter((img) => img.cat === state.filter);

      state.currentList = list;

      grid.innerHTML = `${list
        .map((img, i) => `
          <button class="gallery-item" type="button" data-gallery-open="${i}">
            <img src="${img.src}" alt="${img.alt}" width="960" height="720" loading="lazy">
          </button>
        `)
        .join("")}`;

      if (countEl) countEl.textContent = `Showing ${list.length} photo(s)`;
    };

    if (filterSel) {
      filterSel.addEventListener("change", () => {
        state.filter = `${filterSel.value}`;
        render();
      });
    }

    initLightbox(grid, state);
    render();
  };

  const initLightbox = (grid, state) => {
    const box = $("[data-lightbox]");
    const imgEl = $("#lightboxImg");
    const capEl = $("#lightboxCap");
    if (!box || !imgEl || !capEl) return;

    const open = (index) => {
      state.currentIndex = index;
      const item = state.currentList[state.currentIndex];
      if (!item) return;

      imgEl.src = `${item.src}`;
      imgEl.alt = `${item.alt}`;
      capEl.textContent = `${item.caption}`;

      box.hidden = false;
      document.body.style.overflow = "hidden";
    };

    const close = () => {
      box.hidden = true;
      document.body.style.overflow = "";
      imgEl.src = "";
    };

    const next = () => open((state.currentIndex + 1) % state.currentList.length);
    const prev = () => open((state.currentIndex - 1 + state.currentList.length) % state.currentList.length);

    grid.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-gallery-open]");
      if (!btn) return;
      open(Number(btn.getAttribute("data-gallery-open")));
    });

    $$("[data-lightbox-close]").forEach((el) => el.addEventListener("click", close));
    const nextBtn = $("[data-lightbox-next]");
    const prevBtn = $("[data-lightbox-prev]");
    if (nextBtn) nextBtn.addEventListener("click", next);
    if (prevBtn) prevBtn.addEventListener("click", prev);

    window.addEventListener("keydown", (e) => {
      if (box.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    });
  };

  // FAQ accordion (DOM + events)
  const initFAQ = () => {
    const root = $("[data-faq]");
    if (!root) return;

    root.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-faq-btn]");
      if (!btn) return;

      const item = btn.closest(".faq-item");
      const panel = item ? $("[data-faq-panel]", item) : null;
      if (!panel) return;

      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", `${!expanded}`);
      panel.hidden = expanded;
    });
  };

  // Contact form validation + localStorage draft
  const CONTACT_KEY = "ghinckz_contact_draft_v1";

  const initContactForm = () => {
    const form = $("#contactForm");
    if (!form) return;

    const status = $("#formStatus");
    const clearBtn = $("[data-clear-contact]");

    const fields = {
      fullName: $("#fullName"),
      email: $("#email"),
      phone: $("#phone"),
      subject: $("#subject"),
      message: $("#message"),
    };

    const errorEl = (name) => $(`[data-error-for="${name}"]`);
    const setError = (name, msg) => {
      const el = errorEl(name);
      if (el) el.textContent = `${msg}`;
    };
    const clearError = (name) => setError(name, "");

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validate = () => {
      let ok = true;

      const nameVal = fields.fullName?.value.trim() || "";
      const emailVal = fields.email?.value.trim() || "";
      const subjectVal = fields.subject?.value || "";
      const messageVal = fields.message?.value.trim() || "";
      const phoneVal = fields.phone?.value.trim() || "";

      if (nameVal.length < 2) { setError("fullName", "Please enter your full name."); ok = false; }
      else clearError("fullName");

      if (!validateEmail(emailVal)) { setError("email", "Please enter a valid email address."); ok = false; }
      else clearError("email");

      if (phoneVal && phoneVal.length < 7) { setError("phone", "Phone number looks too short."); ok = false; }
      else clearError("phone");

      if (!subjectVal) { setError("subject", "Please select a subject."); ok = false; }
      else clearError("subject");

      if (messageVal.length < 10) { setError("message", "Please provide more details (at least 10 characters)."); ok = false; }
      else clearError("message");

      return ok;
    };

    const saveDraft = () => {
      const draft = {
        fullName: fields.fullName?.value || "",
        email: fields.email?.value || "",
        phone: fields.phone?.value || "",
        subject: fields.subject?.value || "",
        message: fields.message?.value || "",
      };
      storage.set(CONTACT_KEY, draft);
    };

    const loadDraft = () => {
      const draft = storage.get(CONTACT_KEY, null);
      if (!draft) return;

      if (fields.fullName) fields.fullName.value = `${draft.fullName || ""}`;
      if (fields.email) fields.email.value = `${draft.email || ""}`;
      if (fields.phone) fields.phone.value = `${draft.phone || ""}`;
      if (fields.subject) fields.subject.value = `${draft.subject || ""}`;
      if (fields.message) fields.message.value = `${draft.message || ""}`;

      if (status) status.textContent = "Draft restored from your last visit.";
    };

    loadDraft();

    Object.values(fields).forEach((el) => {
      if (!el) return;
      el.addEventListener("input", saveDraft);
      el.addEventListener("blur", () => validate());
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!validate()) {
        if (status) status.textContent = "Please fix the highlighted errors and try again.";
        return;
      }

      if (status) status.textContent = "Message saved. For live sending, connect an email service or backend endpoint.";
      storage.remove(CONTACT_KEY);
      form.reset();
    });

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        storage.remove(CONTACT_KEY);
        form.reset();
        ["fullName", "email", "phone", "subject", "message"].forEach(clearError);
        if (status) status.textContent = "Cleared.";
      });
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    initMobileMenu();
    initBackToTop();
    initHeroSlider();
    initFAQ();
    initProducts();
    initGallery();
    initContactForm();
    renderFeatured();
  });
})();
