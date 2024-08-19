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
    const currentX = character.offsetLeft;
    const step = 5; // Step size for movement

    if (idle) {
        // Set idle frame
        character.style.backgroundPosition = "0 0"; // Idle frame
    } else {
        // Set walking frame
        character.style.backgroundPosition = "-100px 0"; // Walking frame

        // Move character towards targetX
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

    // Update speech bubble position to follow character
    speechBubble.style.left = `${character.offsetLeft + character.offsetWidth / 2}px`;
    speechBubble.style.top = `${character.offsetTop - speechBubble.offsetHeight}px`;

    setTimeout(moveCharacter, idle ? 3000 : 50); // Adjust timing based on idle state
}

function showSpeechBubble() {
    if (quotes.length > 0) {
        // Select a random quote
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        speechBubble.textContent = randomQuote;
        speechBubble.style.display = 'block';

        // Position speech bubble relative to character
        speechBubble.style.left = `${character.offsetLeft + character.offsetWidth / 2}px`;
        speechBubble.style.top = `${character.offsetTop - speechBubble.offsetHeight}px`;

        setTimeout(() => {
            speechBubble.style.display = 'none';
        }, 13000); // Display for 13 seconds
    }
}

function randomWalk() {
    if (idle) {
        idle = false;
        targetX = Math.random() * (window.innerWidth - character.offsetWidth); // Set random targetX
    }
}

// Event listener for mouse click to set targetX
document.addEventListener('click', (event) => {
    idle = false;
    targetX = event.clientX - character.offsetWidth / 2;
});

// Show speech bubble every 15 seconds
setInterval(showSpeechBubble, 15000);

// Random walk every 5 seconds
setInterval(randomWalk, 5000);

// Start character movement
moveCharacter();