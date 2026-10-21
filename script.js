// Shared interactions for the portfolio: folder navigation, reveal animations, project filters,
// certificate lightbox, contact form validation, and small UI enhancements.
document.addEventListener("DOMContentLoaded", () => {
  const data = window.portfolioData || {};
  const body = document.body;
  const page = body.dataset.page || "home";

  initNav();
  initScrollProgress();
  initTypewriter();
  initBackToTop();
  initVisitorLog();
  renderPageContent(page, data);
  initReveal();
  initTiltCards();
  initContactForm();
  initProjectFilters();
});

function initVisitorLog() {
  const { hostname, protocol } = window.location;
  if (protocol !== "https:" || hostname === "localhost" || hostname === "127.0.0.1") return;

  fetch("/api/visit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: window.location.pathname }),
    keepalive: true
  })
    .then((res) => {
      if (!res.ok) {
        console.warn("Visitor log returned status:", res.status);
      }
    })
    .catch((err) => {
      console.warn("Visitor log request failed:", err);
    });
}

function initNav() {
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  const navWrap = document.querySelector(".topbar .nav-wrap");

  if (navWrap && !navWrap.querySelector(".doc-strip")) {
    const strip = document.createElement("div");
    strip.className = "doc-strip";
    strip.innerHTML = '<span>PORTFOLIO</span><span>SAHITI CHHANAM · SOFTWARE ENGINEER</span><span>20<strong>26</strong></span>';
    navWrap.prepend(strip);
  }

  if (navToggle && nav) {
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-controls", "siteNav");
    nav.id = "siteNav";
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      navToggle.classList.toggle("is-active", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach((link) => {
    const target = link.getAttribute("href");
    if (target === currentPath || (target === "index.html" && currentPath === "")) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  nav?.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle?.classList.remove("is-active");
      navToggle?.setAttribute("aria-expanded", "false");
    });
  });
}

function initScrollProgress() {
  const progressBar = document.querySelector(".scroll-progress");
  if (!progressBar) return;

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const max = document.body.scrollHeight - window.innerHeight;
    const percent = max > 0 ? (scrollTop / max) * 100 : 0;
    progressBar.style.width = percent + "%";
  };

  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();
}

function initTypewriter() {
  const target = document.querySelector(".type-target");
  if (!target) return;

  const words = window.portfolioData?.heroWords || ["Software Engineer in the Making"];
  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const type = () => {
    const currentWord = words[wordIndex];
    if (!deleting) {
      charIndex++;
      target.textContent = currentWord.slice(0, charIndex);
      if (charIndex === currentWord.length) {
        deleting = true;
        setTimeout(type, 1200);
        return;
      }
    } else {
      charIndex--;
      target.textContent = currentWord.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }
    const speed = deleting ? 45 : 90;
    setTimeout(type, speed);
  };

  type();
}

function initReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  elements.forEach((element) => observer.observe(element));
}

function initTiltCards() {
  const cards = document.querySelectorAll("[data-tilt]");
  cards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 12;
      const rotateX = (0.5 - (y / rect.height)) * 12;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
    });
  });
}

function initBackToTop() {
  const button = document.getElementById("backToTop");
  if (!button) return;

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function renderPageContent(page, data) {
  if (page === "home") {
    renderStats(data.stats || []);
    renderHomeCards(data.homeCards || []);
  }

  if (page === "projects") {
    renderProjects((data.projects || []).filter((project) => !project.external));
    renderProjectResults(data.projectResults || [], data.projects || []);
  }

  if (page === "experience") {
    renderExperience(data.experiences || []);
    const technicalCertificates = (data.certificates || []).filter((certificate) =>
      certificate.type === "Internship" || certificate.category === "course"
    );
    renderCertificates(technicalCertificates);
  }

  if (page === "contributions") {
    renderContributions(data.contributions || [], data.about?.beyondCode || []);
    renderSportsGallery(data.contributions || [], data.medals || []);
  }

  if (page === "about") {
    renderAboutCards(data.about || {});
    renderSkillCategories(data.skills || []);
  }
}

function renderStats(stats) {
  const statsRoot = document.getElementById("statsGrid");
  if (!statsRoot) return;

  statsRoot.innerHTML = stats
    .map(
      (stat) => `
        <div class="stat-box reveal" data-tilt>
          <strong class="stat-number" data-target="${stat.value}">${stat.value}</strong>
          <span>${stat.label}</span>
        </div>
      `
    )
    .join("");

  animateCounters();
}

function animateCounters() {
  const counters = document.querySelectorAll(".stat-number");
  counters.forEach((counter) => {
    const target = Number(counter.dataset.target || 0);
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 30));

    const tick = () => {
      current += step;
      counter.textContent = current >= target ? target : current;
      if (current < target) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  });
}

function renderHomeCards(cards) {
  const root = document.getElementById("homePreviewGrid");
  if (!root) return;

  const primaryDestinations = ["about.html", "projects.html", "experience.html", "contributions.html", "contact.html"];
  root.innerHTML = cards
    .filter((card) => primaryDestinations.includes(card.link))
    .map(
      (card) => `
        <a class="preview-card reveal" href="${card.link}" data-tilt>
          <span class="preview-kicker">${card.title}</span>
          <h3>${card.title}</h3>
          <p>${card.description}</p>
        </a>
      `
    )
    .join("");
}

function renderProjectResults(results, projects) {
  const root = document.getElementById("projectResultsGrid");
  const highlights = document.getElementById("projectHighlights");
  if (root) {
    root.innerHTML = results
      .map((result) => `
        <article class="result-stat reveal">
          <strong>${result.value}</strong>
          <span>${result.label}</span>
        </article>
      `)
      .join("");
  }

  if (highlights) {
    const projectHighlights = projects
      .filter((project) => !project.external && project.highlight)
      .map((project) => `<li><strong>${project.title}:</strong> ${project.highlight}</li>`);
    highlights.innerHTML = `
      <span>Key Highlights</span>
      <ul>${projectHighlights.join("")}</ul>
    `;
  }
}

function renderSkillCategories(categories) {
  const root = document.getElementById("skillCategories");
  if (!root) return;

  const categoriesHtml = categories
    .map(
      (category, index) => `
        <div class="skill-category reveal ${index === 0 ? "active" : ""}" data-category="${category.category}">
          <div class="skill-category-header">
            <span class="skill-category-icon" aria-hidden="true">${["&lt;/&gt;", "⌘", "◉", "+"][index % 4]}</span>
            <h3>${category.category}</h3>
          </div>
          <div class="skill-list">
            ${category.items
              .map(
                (item) => `
                  <span class="skill-item" aria-label="${item.name}, ${item.level}%">${item.name}</span>
                `
              )
              .join("")}
          </div>
        </div>
      `
    )
    .join("");

  root.innerHTML = categoriesHtml;

  const tabsContainer = document.getElementById("skillsTabs");
  if (!tabsContainer) return;

  const tabs = categories.map((category) => `
    <button class="skill-tab ${category.category === categories[0].category ? "active" : ""}" data-target="${category.category}">
      ${category.category}
    </button>
  `);

  tabsContainer.innerHTML = tabs.join("");

  const tabButtons = document.querySelectorAll(".skill-tab");
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const targetCategory = button.dataset.target;
      document.querySelectorAll(".skill-category").forEach((card) => {
        const shouldShow = card.dataset.category === targetCategory;
        card.classList.toggle("active", shouldShow);
      });
    });
  });
}

function renderProjects(projects) {
  const root = document.getElementById("projectGrid");
  if (!root) return;

  root.innerHTML = projects
    .map(
      (project) => `
        <article class="project-card reveal" data-category="${project.category}" data-tilt>
          <div class="browser-bar" aria-hidden="true"><i></i><i></i><i></i></div>
          <div class="project-thumb">
            <img src="${project.image}" alt="${project.title}" onerror="this.onerror=null;this.src='assets/images/project-placeholder.jpg';" />
          </div>
          <div class="project-body">
            <div class="chip-row">
              ${project.tech.map((item) => `<span class="chip">${item}</span>`).join("")}
            </div>
            <h3>${project.title}</h3>
            <p>${project.summary}</p>
            <div class="project-highlight">${project.highlight}</div>
            <div class="project-actions">
              <button class="secondary-btn" data-project-id="${project.id}">View Details</button>
              <a class="primary-btn" href="${project.gh}" target="_blank" rel="noreferrer">GitHub</a>
            </div>
          </div>
        </article>
      `
    )
    .join("");

  const modal = document.getElementById("projectModal");
  if (!modal) return;

  document.querySelectorAll("[data-project-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const project = projects.find((item) => item.id === button.dataset.projectId);
      if (!project) return;

      modal.querySelector(".modal-title").textContent = project.title;
      modal.querySelector(".modal-body").innerHTML = `
        <div class="chip-row">
          ${project.tech.map((item) => `<span class="chip">${item}</span>`).join("")}
        </div>
        <p>${project.summary}</p>
        <ul>
          ${project.details.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      `;
      modal.classList.add("open");
    });
  });

  const closeModalButton = modal.querySelector(".modal-close");
  if (closeModalButton) {
    closeModalButton.addEventListener("click", () => modal.classList.remove("open"));
  }

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.remove("open");
    }
  });

  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      document.querySelectorAll(".filter-btn").forEach((btn) => btn.classList.toggle("active", btn === button));
      document.querySelectorAll(".project-card").forEach((card) => {
        const show = filter === "all" || card.dataset.category === filter;
        card.style.display = show ? "block" : "none";
      });
    });
  });
}

function renderExperience(experiences) {
  const root = document.getElementById("experienceTimeline");
  if (!root) return;

  root.innerHTML = experiences
    .map(
      (experience) => `
        <article class="timeline-item reveal" data-tilt>
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <span class="timeline-kicker">${experience.period}</span>
            <h3>${experience.role}</h3>
            <p class="company-line">${experience.company} · ${experience.location}</p>
            ${experience.award ? `<span class="award-tag">${experience.award}</span>` : ""}
            <ul>
              ${experience.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}
            </ul>
            <button class="secondary-btn" data-certificate-file="${experience.certificateFile}">View Certificate</button>
          </div>
        </article>
      `
    )
    .join("");

  document.querySelectorAll("[data-certificate-file]").forEach((button) => {
    button.addEventListener("click", () => showLightbox(button.dataset.certificateFile));
  });
}

function renderCertificates(certificates, rootId = "certificateGrid") {
  const root = document.getElementById(rootId);
  if (!root) return;

  root.innerHTML = certificates
    .map((certificate) => {
      const isPdf = /\.pdf$/i.test(certificate.file || "");
      const isComingSoon = Boolean(certificate.comingSoon);
      const metadata = [certificate.date, certificate.duration || certificate.credits].filter(Boolean).join(" · ");
      const thumbnail = isPdf ? certificate.preview || "assets/certificates/placeholder-card.jpg" : certificate.file;
      const thumbMarkup = `<div class="certificate-thumb"><img src="${encodeURI(thumbnail)}" alt="${certificate.title}" onerror="this.onerror=null;this.src='assets/certificates/placeholder-card.jpg';" /></div>`;

      return `
        <article class="certificate-card reveal ${isComingSoon ? "coming-soon" : ""}" data-tilt>
          ${thumbMarkup}
          <div class="certificate-content">
            <span class="type-tag">${certificate.type}</span>
            <h3>${certificate.title}</h3>
            <p>${certificate.issuer}</p>
            ${metadata ? `<small>${metadata}</small>` : ""}
            <div class="certificate-actions">
              <button class="secondary-btn" data-lightbox-src="${certificate.file}" data-lightbox-title="${certificate.title}">${isComingSoon ? "More" : "Open"}</button>
              ${certificate.verify ? `<a class="primary-btn" href="${certificate.verify}" target="_blank" rel="noreferrer">Verify</a>` : ""}
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  root.querySelectorAll("[data-lightbox-src]").forEach((button) => {
    button.addEventListener("click", () => showLightbox(button.dataset.lightboxSrc, button.dataset.lightboxTitle || "Certificate"));
  });
}

function renderAchievements(achievements, rootId = "achievementGrid") {
  const root = document.getElementById(rootId);
  if (!root) return;

  root.innerHTML = achievements
    .map(
      (achievement) => `
        <article class="achievement-card reveal" data-tilt>
          <div class="achievement-icon">${achievement.icon}</div>
          <h3>${achievement.title}</h3>
          <p>${achievement.detail}</p>
        </article>
      `
    )
    .join("");
}

function renderContributions(contributions, beyondCode) {
  const groups = [
    ["clubsEventsGrid", (item) => /ACM|Literary Club/i.test(item.organization)],
    ["volunteeringGrid", (item) => /ICSIT|Volunteer/i.test(`${item.organization} ${item.role}`)],
    ["hackathonGrid", (item) => /Sankalp Bharat/i.test(item.organization)]
  ];

  groups.forEach(([rootId, predicate]) => {
    const root = document.getElementById(rootId);
    if (!root) return;
    root.innerHTML = contributions.filter(predicate)
    .map(
      (item) => {
        const isPdf = /\.pdf$/i.test(item.photo || "");
        const date = item.date && item.date !== "[add details]" ? item.date : "";
        const visual = isPdf
          ? `<iframe src="${encodeURI(item.photo)}#page=1&toolbar=0&navpanes=0" title="${item.organization} certificate" loading="lazy"></iframe>`
          : `<img src="${item.photo}" alt="${item.organization}" onerror="this.onerror=null;this.src='assets/gallery/placeholder.jpg';" />`;
        return `
        <article class="story-card reveal" data-tilt>
          <div class="browser-bar" aria-hidden="true"><i></i><i></i><i></i></div>
          <div class="story-visual">
            ${visual}
          </div>
          <div class="story-body">
            <span class="story-role">${item.role}</span>
            <h3>${item.organization}</h3>
            ${date ? `<p class="story-date">${date}</p>` : ""}
            <p>${item.story}</p>
          </div>
        </article>
      `;
      })
    .join("");
  });

  const beyondCodeRoot = document.getElementById("contributionBeyondCode");
  if (beyondCodeRoot) {
    beyondCodeRoot.innerHTML = `
      <span>Beyond the code</span>
      <p>I am active in leadership through ACM and the Literary Club.</p>
      <ul>${beyondCode.map((item) => `<li>${item}</li>`).join("")}</ul>
    `;
  }

  initContributionTabs();
}

function renderSportsGallery(contributions, medals) {
  const root = document.getElementById("sportsGallery");
  if (!root) return;

  const sportsEntry = contributions.find((item) => /SportSpectra|Rival Rumble/i.test(item.organization));
  const pictures = [
    ...(sportsEntry?.photo ? [{ image: sportsEntry.photo, alt: "Sahiti holding a trophy at Symbiosis Institute of Technology, Nagpur" }] : []),
    ...medals
  ];
  root.innerHTML = pictures
    .map((picture) => `
      <figure class="sports-picture reveal">
        <div class="browser-bar" aria-hidden="true"><i></i><i></i><i></i></div>
        <img src="${encodeURI(picture.image)}" alt="${picture.alt}" onerror="this.onerror=null;this.src='assets/gallery/placeholder.jpg';" />
      </figure>
    `)
    .join("");

  root.querySelectorAll("img").forEach((image) => {
    image.addEventListener("click", () => showLightbox(image.src, image.alt));
  });
}

function initContributionTabs() {
  const tabs = [...document.querySelectorAll(".contribution-tab[data-tab]")];
  const panels = [...document.querySelectorAll(".contribution-panel[data-section]")];
  if (!tabs.length || !panels.length) return;

  const activate = (sectionId, updateHash = true) => {
    tabs.forEach((tab) => {
      const selected = tab.dataset.tab === sectionId;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    panels.forEach((panel) => {
      const selected = panel.dataset.section === sectionId;
      panel.hidden = !selected;
      panel.classList.toggle("active", selected);
      if (selected) panel.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
    });
    if (updateHash && window.location.hash !== `#${sectionId}`) window.location.hash = sectionId;
  };

  const initialSection = window.location.hash.slice(1);
  activate(panels.some((panel) => panel.dataset.section === initialSection) ? initialSection : panels[0].dataset.section, false);

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activate(tab.dataset.tab));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (index + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length;
      tabs[nextIndex].focus();
      activate(tabs[nextIndex].dataset.tab);
    });
  });
}

function renderAboutCards(about) {
  const container = document.getElementById("aboutCards");
  const headline = document.getElementById("aboutHeadline");
  if (headline) headline.textContent = about.headline || "";
  if (container) container.innerHTML = "";
}

function renderEducation(education) {
  const timeline = document.getElementById("educationTimeline");
  const chips = document.getElementById("courseChips");

  if (timeline) {
    const secondaryYear = education.secondary?.year || "[add details]";
    const secondaryCity = education.secondary?.city || "[add details]";
    const secondaryBoard = education.secondary?.board || "[add details]";
    const secondaryStream = education.secondary?.stream || "[add details]";
    const secondaryPercentage = education.secondary?.percentage || "[add details]";
    const matricYear = education.matriculation?.year || "[add details]";
    const matricCity = education.matriculation?.city || "[add details]";
    const matricBoard = education.matriculation?.board || "[add details]";
    const matricPercentage = education.matriculation?.percentage || "[add details]";

    timeline.innerHTML = `
      <article class="timeline-item reveal" data-tilt>
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <span class="timeline-kicker">Present</span>
          <h3>${education.degree}, ${education.school}</h3>
          <p>Specialization: ${education.specialization}. Expected graduation: ${education.graduationYear || "[add details]"}.</p>
        </div>
      </article>
      <article class="timeline-item reveal" data-tilt>
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <span class="timeline-kicker">${secondaryYear}</span>
          <h3>${education.secondary.name}</h3>
          <p>${secondaryCity}, ${secondaryBoard}, ${secondaryStream}. Percentage: ${secondaryPercentage}.</p>
        </div>
      </article>
      <article class="timeline-item reveal" data-tilt>
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <span class="timeline-kicker">${matricYear}</span>
          <h3>${education.matriculation.name}</h3>
          <p>${matricCity}, ${matricBoard}. Percentage: ${matricPercentage}.</p>
        </div>
      </article>
    `;
  }

  if (chips) {
    chips.innerHTML = (education.coursework || [])
      .map((course) => `<span class="chip">${course}</span>`)
      .join("");
  }
}

function initProjectFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  if (!filterButtons.length) return;

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      document.querySelectorAll(".filter-btn").forEach((btn) => btn.classList.toggle("active", btn === button));
      document.querySelectorAll(".project-card").forEach((card) => {
        const visible = filter === "all" || card.dataset.category === filter;
        card.style.display = visible ? "block" : "none";
      });
    });
  });
}

function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  const pageUrlField = form.querySelector('[name="_url"]');
  if (pageUrlField) pageUrlField.value = window.location.href;

  form.addEventListener("submit", (event) => {
    if (window.location.protocol === "file:") {
      event.preventDefault();
      showFormError(form, "Open this page through a local web server (http://localhost) to submit the contact form.");
      return;
    }

    const name = form.querySelector("#name").value.trim();
    const email = form.querySelector("#email").value.trim();
    const message = form.querySelector("#message").value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;

    if (!name || name.length < 2) {
      showFormError(form, "Please enter a valid name.");
      isValid = false;
    }

    if (!emailPattern.test(email)) {
      showFormError(form, "Please enter a valid email address.");
      isValid = false;
    }

    if (!message || message.length < 15) {
      showFormError(form, "Message should be at least 15 characters long.");
      isValid = false;
    }

    if (!isValid) {
      event.preventDefault();
      return;
    }

    const status = form.querySelector(".form-status");
    if (status) {
      status.textContent = "";
      status.classList.remove("error");
    }
    const submitButton = form.querySelector('[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending…";
    }
  });
}

function showFormError(form, message) {
  const status = form.querySelector(".form-status");
  if (!status) return;
  status.textContent = message;
  status.classList.add("error");
}

function showLightbox(imageSrc, title = "Portfolio item") {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  const caption = document.getElementById("lightboxCaption");
  const body = lightbox.querySelector(".lightbox-body");
  if (!body || !caption) return;

  const isPdf = /\.pdf$/i.test(imageSrc || "");

  body.innerHTML = isPdf
    ? `<iframe src="${encodeURI(imageSrc)}" title="${title}"></iframe>`
    : `<img src="${imageSrc}" alt="${title}" onerror="this.onerror=null;this.src='assets/certificates/placeholder-card.jpg';" />`;

  const openLink = document.createElement("a");
  openLink.href = imageSrc;
  openLink.target = "_blank";
  openLink.rel = "noreferrer";
  openLink.className = "primary-btn";
  openLink.textContent = "Open in new tab";
  openLink.style.marginTop = "1rem";
  body.appendChild(openLink);

  caption.textContent = title;
  lightbox.classList.add("open");
}

window.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  const closeLightboxButton = lightbox.querySelector(".lightbox-close");
  if (closeLightboxButton) {
    closeLightboxButton.addEventListener("click", () => lightbox.classList.remove("open"));
  }

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      lightbox.classList.remove("open");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      lightbox.classList.remove("open");
      const modal = document.getElementById("projectModal");
      if (modal) modal.classList.remove("open");
    }
  });
});

window.addEventListener("load", () => {
  document.body.classList.add("is-loaded");
});
