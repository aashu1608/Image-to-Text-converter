const imageUpload = document.getElementById('imageUpload');
const preview = document.getElementById('preview');
const outputText = document.getElementById('outputText');
const convertBtn = document.getElementById('convertBtn');

let selectedImage;

imageUpload.addEventListener('change', (e) => {
  selectedImage = e.target.files[0];
  if (selectedImage) {
    preview.src = URL.createObjectURL(selectedImage);
  }
});

convertBtn.addEventListener('click', () => {
  if (!selectedImage) {
    alert("Please upload an image first.");
    return;
  }

  Tesseract.recognize(
    selectedImage,
    'eng',
    {
      logger: m => console.log(m)  // optional: progress
    }
  ).then(({ data: { text } }) => {
    outputText.value = text;
  }).catch(err => {
    console.error(err);
    alert("Error during OCR.");
  });
});

const speakBtn = document.getElementById('speakBtn');
let speechActive = false;
let utterance;

speakBtn.addEventListener('click', () => {
  const text = outputText.value.trim();
  if (!text) {
    alert("No text to speak.");
    return;
  }

  if (!speechActive) {
    utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
    speakBtn.textContent = "Pause";
    speechActive = true;

    utterance.onend = () => {
      speechActive = false;
      speakBtn.textContent = "Speak Text";
    };
  } else {
    speechSynthesis.cancel(); // pauses or stops
    speakBtn.textContent = "Speak Text";
    speechActive = false;
  }
});