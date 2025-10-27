// Lista de palavras com tema de programação
const words = ["codigo", "javascript", "python", "debug", "array", "funcao", "objeto", "classe"];

// Elementos do DOM
const userInput = document.getElementById("user-input");
const executeBtn = document.getElementById("execute-btn");
const resultDiv = document.getElementById("result");
const currentWordSpan = document.getElementById("current-word");
const modeRadios = document.getElementsByName("mode");
const imageContainer = document.getElementById("image-container");

// Canvas confete
const confettiCanvas = document.getElementById("confetti-canvas");
const confettiCtx = confettiCanvas.getContext("2d");
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;

let confettiParticles = [];
let currentWord = "";
let encryptedWord = "";

// Escolhe uma palavra aleatória
function pickRandomWord() {
  const index = Math.floor(Math.random() * words.length);
  return words[index];
}

// Inicializa o jogo com uma nova palavra
function initializeGame() {
  currentWord = pickRandomWord();
  encryptedWord = btoa(currentWord);
  updateWordDisplay();
}

// Atualiza a exibição da palavra (só mostra no modo descriptografar)
function updateWordDisplay() {
  const mode = getSelectedMode();
  currentWordSpan.textContent = (mode === "decrypt") ? encryptedWord : "";
}

// Verifica qual modo está selecionado
function getSelectedMode() {
  for (let radio of modeRadios) {
    if (radio.checked) return radio.value;
  }
  return "encrypt";
}

// Funções para confete 
function launchConfetti() {
  confettiParticles = [];
  for (let i = 0; i < 200; i++) {
    confettiParticles.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height - confettiCanvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * 10 + 5,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      tilt: Math.floor(Math.random() * 10) - 10,
      tiltAngleIncrement: Math.random() * 0.07 + 0.05
    });
  }
  animateConfetti();
}

function animateConfetti() {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiParticles.forEach(p => {
    p.tilt += p.tiltAngleIncrement;
    p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
    p.x += Math.sin(p.d);
    confettiCtx.beginPath();
    confettiCtx.lineWidth = p.r;
    confettiCtx.strokeStyle = p.color;
    confettiCtx.moveTo(p.x + p.tilt + p.r / 2, p.y);
    confettiCtx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
    confettiCtx.stroke();
  });
  requestAnimationFrame(animateConfetti);
}

// Quando clicar em Executar
executeBtn.addEventListener("click", () => {
  const mode = getSelectedMode();
  const input = userInput.value.trim();
  imageContainer.innerHTML = "";

  if (input === "") {
    resultDiv.textContent = "Digite algo!";
    return;
  }

  if (mode === "encrypt") {
    // 🔒 Criptografar
    const encrypted = btoa(input);
    resultDiv.textContent = `Criptografado: ${encrypted}`;
  } else {
    // 🔓 Descriptografar
    if (input.toLowerCase() === currentWord.toLowerCase()) {

      //Acertou
      resultDiv.textContent = "Parabéns! Você acertou!";
      launchConfetti();

      // Troca de palavra após 2 segundos
      setTimeout(() => {
        currentWord = pickRandomWord();
        encryptedWord = btoa(currentWord);
        updateWordDisplay();
        resultDiv.textContent = "";
        imageContainer.innerHTML = "";
      }, 2000);

    } else {
      //Errou
      resultDiv.textContent = "Você errou! Nova palavra gerada!";

      // Troca imediata para nova palavra
      currentWord = pickRandomWord();
      encryptedWord = btoa(currentWord);
      updateWordDisplay();
    }
  }

  userInput.value = "";
  userInput.focus();
});

// Atualiza a exibição ao trocar de modo
modeRadios.forEach(radio => {
  radio.addEventListener("change", () => {
    updateWordDisplay();
    resultDiv.textContent = "";
    imageContainer.innerHTML = "";
    userInput.value = "";
  });
});

// Inicia o jogo
initializeGame();







/*
"codigo" = "Y29kaWdv"
"javascript" = "amF2YXNjcmlwdA=="
"python" = "cHl0aG9u"
"debug" = "ZGVidWc="
"array" = "YXJyYXk="
"funcao" = "ZnVuY2Fv"
"objeto" = "b2JqZXRv"
"classe" = "Y2xhc3Nl"
*/