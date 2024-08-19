const character = document.getElementById('character');
const speechBubble = document.getElementById('speech-bubble');
let quotes = [];
let idle = true;
let targetX = window.innerWidth / 2;
let moving = false;

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
        } else if (currentX > targetX) {
            character.style.left = `${currentX - step}px`;
        } else {
            idle = true; // Stop moving when target is reached
            setTimeout(() => {
                idle = false;
                randomWalk();
            }, 5000); // Idle for 5 seconds after reaching target
        }
    }

    // Update speech bubble position to follow character
    speechBubble.style.left = `${character.offsetLeft + character.offsetWidth / 2}px`;
    speechBubble.style.top = `${character.offsetTop - speechBubble.offsetHeight}px`;

    setTimeout(moveCharacter, idle ? 5000 : 50); // Adjust timing based on idle state
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
        }, 15000); // Display for 15 seconds
    }
}

function randomWalk() {
    if (!moving) {
        idle = false;
        targetX = Math.random() * (window.innerWidth - character.offsetWidth); // Set random targetX
        moving = true;
    }
}

// Show speech bubble every 30 seconds
setInterval(showSpeechBubble, 30000);

// Random walk every 5 seconds
setInterval(() => {
    if (!moving) {
        randomWalk();
    }
}, 5000);

// Start character movement
moveCharacter();