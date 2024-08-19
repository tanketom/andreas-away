const character = document.getElementById('character');
const speechBubble = document.getElementById('speech-bubble');
const quotes = [
    "Hello there!",
    "How's it going?",
    "I'll be back soon.",
    "Stay tuned!"
];

let position = 0;
const speed = 2;

function moveCharacter() {
    position += speed;
    character.style.left = `${position % window.innerWidth}px`;
    requestAnimationFrame(moveCharacter);
}

function showSpeechBubble() {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    speechBubble.textContent = randomQuote;
    speechBubble.style.display = 'block';
    setTimeout(() => {
        speechBubble.style.display = 'none';
    }, 3000);
}

setInterval(showSpeechBubble, 60000);
moveCharacter();
