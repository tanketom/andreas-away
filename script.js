const character = document.getElementById('character');
const speechBubble = document.getElementById('speech-bubble');
const characterContainer = document.getElementById('character-container');
let quotes = [];
let idle = true;

// Fetch quotes from quotes.json
fetch('quotes.json')
    .then(response => response.json())
    .then(data => {
        quotes = data.quotes;
    })
    .catch(error => console.error('Error fetching quotes:', error));

function moveCharacter() {
    if (idle) {
        character.style.backgroundImage = "url('gfx/idle.gif')";
    } else {
        character.style.backgroundImage = "url('gfx/walk.gif')";
        const randomX = Math.random() * (window.innerWidth - character.offsetWidth);
        const randomY = Math.random() * (window.innerHeight - character.offsetHeight);
        character.style.left = `${randomX}px`;
        character.style.top = `${randomY}px`;
    }
    idle = !idle;
    setTimeout(moveCharacter, idle ? 3000 : 1000);
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

setInterval(showSpeechBubble, 60000);
moveCharacter();