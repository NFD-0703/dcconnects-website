function loadHTML(selector, file, callback) {
  fetch(file)
    .then((res) => res.text())
    .then((data) => {
      document.querySelector(selector).innerHTML = data;
      if (typeof callback === "function") {
        callback();
      }
    });
}

window.addEventListener("DOMContentLoaded", () => {
  loadHTML("#header-include", "components/header.html", () => {
    adjustNavPosition?.();
    enableMobileDropdown?.();
    document.body.classList.add("header-loaded");
  });

  loadHTML("#footer-include", "components/footer.html");
});

// ---- Global: Header logo hover overlay (shared across pages) ----
(function initHeaderLogoOverlayGlobal() {
  function setupHeaderLogoOverlay() {
    // ⛔ new-detail.html, contact.html 에서는 동작 안 함
    const path = window.location.pathname.toLowerCase();
    if (
      window.innerWidth <= 1024 ||
      path.endsWith("new-detail.html") ||
      path.endsWith("contact.html")
    ) {
      // 이 페이지들에선 상단 로고 이미지만 교체
      const headerInclude = document.getElementById("header-include");

      const updateLogo = () => {
        const logoImg = headerInclude?.querySelector(".logo img"); // <div class="logo"><img .../></div>
        if (!logoImg) return false;
        // 공백 포함 경로는 URL 인코딩
        logoImg.src = "images/Company%20CI/DCC%20CI%20Full_Main%20Color.png";
        logoImg.style.marginTop = "8px";

        return true;
      };

      // 이미 로고가 있으면 즉시 교체, 아니면 include 주입을 기다렸다가 교체
      if (!updateLogo() && headerInclude) {
        const mo = new MutationObserver(() => {
          if (updateLogo()) mo.disconnect();
        });
        mo.observe(headerInclude, { childList: true, subtree: true });
      }

      return; // 오버레이 효과는 비활성화
    }

    const headerInclude = document.getElementById("header-include");
    if (!headerInclude) return;

    const ensureOverlayEl = () => {
      let overlayImg = document.getElementById("dcc-overlay-logo");
      if (!overlayImg) {
        overlayImg = document.createElement("img");
        overlayImg.id = "dcc-overlay-logo";
        // URL-encoded path to handle spaces
        overlayImg.src = "images/Company%20CI/DCC%20CI%20Full_Main%20Color.png";
        overlayImg.alt = "DCC Overlay Logo";
        overlayImg.style.position = "absolute";
        overlayImg.style.zIndex = "1000";
        overlayImg.style.pointerEvents = "none";
        overlayImg.style.transition = "opacity 0.25s ease";
        overlayImg.style.opacity = "0";
        document.body.appendChild(overlayImg);
      }
      return overlayImg;
    };

    const tryInit = () => {
      const logoImg = headerInclude.querySelector("img");
      if (!logoImg) return false;

      const overlayImg = ensureOverlayEl();
      const positionOverlay = () => {
        const rect = logoImg.getBoundingClientRect();
        const st = window.pageYOffset || document.documentElement.scrollTop;
        const sl = window.pageXOffset || document.documentElement.scrollLeft;
        // 10% larger than the original logo, 100px below, slight left padding
        overlayImg.style.width = logoImg.offsetWidth * 1.3 + "px";
        overlayImg.style.height = logoImg.offsetHeight * 1.3 + "px";
        overlayImg.style.top = rect.bottom + 100 + st + "px";
        overlayImg.style.left = rect.left + sl + 20 + "px";
      };

      const show = () => {
        positionOverlay();
        overlayImg.style.opacity = "1";
      };
      const hide = () => {
        overlayImg.style.opacity = "0";
      };

      // Avoid double-binding on pages with multiple includes
      if (!headerInclude.dataset.overlayBound) {
        headerInclude.addEventListener("mouseenter", show);
        headerInclude.addEventListener("mouseleave", hide);
        window.addEventListener("scroll", () => {
          if (overlayImg.style.opacity === "1") positionOverlay();
        });
        window.addEventListener("resize", () => {
          if (overlayImg.style.opacity === "1") positionOverlay();
        });
        headerInclude.dataset.overlayBound = "1";
      }
      return true;
    };

    if (!tryInit()) {
      // Wait until the header markup is actually injected
      const mo = new MutationObserver(() => {
        if (tryInit()) mo.disconnect();
      });
      mo.observe(headerInclude, { childList: true, subtree: true });
    }
  }

  // Hook into existing header include lifecycle if available
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    setupHeaderLogoOverlay();
  } else {
    window.addEventListener("DOMContentLoaded", setupHeaderLogoOverlay);
  }
})();
