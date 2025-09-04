const toggleButton = document.getElementById("toggleButton");
const extraInfo = document.getElementById("extraInfo");
const card = document.getElementById("card");

toggleButton.addEventListener("click", () => {
    extraInfo.classList.toggle("open");
    card.classList.toggle("expanded");

    toggleButton.textContent = extraInfo.classList.contains("open")
      ? "Minder informatie"
      : "Meer informatie";
  });


