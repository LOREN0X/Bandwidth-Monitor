document.addEventListener("DOMContentLoaded", function () {
  const settingsPopup = document.getElementById("settingsPopup");
  const settingsBtn = document.querySelector(".settings-btn");
  const closeBtn = document.getElementById("closeSettings");
  const advancedMenuBtn = document.getElementById("advancedMenuBtn");
  const advancedMenu = document.getElementById("advancedMenu");

  function toggleSettings() {
      settingsPopup.style.display = settingsPopup.style.display === "block" ? "none" : "block";
  }

  function toggleAdvancedMenu() {
      advancedMenu.style.display = advancedMenu.style.display === "block" ? "none" : "block";
  }

  // Add event listeners
  settingsBtn.addEventListener("click", toggleSettings);
  closeBtn.addEventListener("click", toggleSettings);
  advancedMenuBtn.addEventListener("click", toggleAdvancedMenu);

  const connectionsInput = document.getElementById("connections");
  const intervals = document.getElementById("intervals");
  const fontSizeSelect = document.getElementById("fontSize");
  const themeToggle = document.getElementById("themeToggle");

  // Load saved settings
  connectionsInput.value = localStorage.getItem("maxConnections") || 8;
  intervals.value = localStorage.getItem("intervals") || 3;
  fontSizeSelect.value = localStorage.getItem("fontSize") || "20px";
  themeToggle.checked = localStorage.getItem("theme") === "light";

  // Apply settings instantly
  document.body.style.fontSize = fontSizeSelect.value;
  document.body.classList.toggle("dark-mode", themeToggle.checked);

  // Save settings when the save button is clicked
  document.getElementById("saveSettings").addEventListener("click", function () {
      localStorage.setItem("maxConnections", connectionsInput.value);
      localStorage.setItem("intervals", intervals.value);
      localStorage.setItem("fontSize", fontSizeSelect.value);
      localStorage.setItem("theme", themeToggle.checked ? "light" : "dark");

      document.body.style.fontSize = fontSizeSelect.value;
      document.body.classList.toggle("dark-mode", themeToggle.checked);

      settingsPopup.style.display = "none"; // Close settings after saving
  });
});
