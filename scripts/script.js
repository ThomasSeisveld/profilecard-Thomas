const card = document.getElementById('card');
const toggleButton = document.getElementById('toggleButton');
const backButton = document.getElementById('backButton');

toggleButton.addEventListener('click', () => {
  card.classList.add('flipped');
});

backButton.addEventListener('click', () => {
  card.classList.remove('flipped');
});

