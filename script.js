const character = document.getElementById('character');
const speechBubble = document.getElementById('speech-bubble');
let quotes = [];
let idle = true;
let targetX = window.innerWidth / 2;

// Fetch quotes from quotes.json
fetch('quotes.json')
    .then(response => response.json())
    .then(data => {
        quotes = data.quotes;
    })
    .catch(error => console.error('Error fetching quotes:', error));

function moveCharacter() {
    if (idle) {
        character.style.backgroundPosition = "0 0"; // Idle frame
    } else {
        character.style.backgroundPosition = "-100px 0"; // Walking frame
        const currentX = character.offsetLeft;
        const step = 5; // Step size
        if (currentX < targetX) {
            character.style.left = `${currentX + step}px`;
            character.style.transform = "translate(-50%, -50%) scaleX(1)"; // Facing right
        } else if (currentX > targetX) {
            character.style.left = `${currentX - step}px`;
            character.style.transform = "translate(-50%, -50%) scaleX(-1)"; // Facing left
        } else {
            idle = true; // Stop moving when target is reached
        }
    }
    setTimeout(moveCharacter, idle ? 3000 : 50);
}

function showSpeechBubble() {
    if (quotes.length > 0) {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        speechBubble.textContent = randomQuote;
        speechBubble.style.display = 'block';
        speechBubble.style.left = `${character.offsetLeft + character.offsetWidth / 2}px`;
        speechBubble.style.top = `${character.offsetTop - speechBubble.offsetHeight}px`;
        setTimeout(() => {
            speechBubble.style.display = 'none';
        }, 3000);
    }
}

function randomWalk() {
    if (idle) {
        idle = false;
        targetX = Math.random() * (window.innerWidth - character.offsetWidth);
    }
}

document.addEventListener('click', (event) => {
    idle = false;
    targetX = event.clientX - character.offsetWidth / 2;
});

setInterval(showSpeechBubble, 60000);
setInterval(randomWalk, 5000); // Random walk every 5 seconds
moveCharacter();