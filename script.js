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

// Set initial idle animation and position
character.style.backgroundPosition = "0 0"; // Idle frame
character.style.left = "50%";
character.style.top = "50%";
character.style.transform = "translate(-50%, -50%)";

// Function to move character
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

// Function to show speech bubble
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

// Function to set random walk target
function randomWalk() {
    if (idle) {
        idle = false;
        const direction = Math.random() < 0.5 ? -1 : 1; // Randomly choose left or right
        targetX = character.offsetLeft + direction * (Math.random() * 200 + 100); // Move 100-300px left or right
        targetX = Math.max(0, Math.min(targetX, window.innerWidth - character.offsetWidth)); // Ensure targetX is within bounds
    }
}

// Show speech bubble every 30 seconds
setInterval(showSpeechBubble, 30000);

// Start character movement
moveCharacter();