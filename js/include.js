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


