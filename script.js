const character = document.getElementById('character');
const speechBubble = document.getElementById('speech-bubble');
let quotes = [];
let isWalking = false;

// Fetch quotes from quotes.json
fetch('quotes.json')
    .then(response => response.json())
    .then(data => {
        quotes = data.quotes;
    })
    .catch(error => {
        console.error('Error fetching quotes:', error);
        speechBubble.textContent = 'Failed to load quotes.';
        speechBubble.style.display = 'block';
        setTimeout(() => {
            speechBubble.style.display = 'none';
        }, 5000); // Display error message for 5 seconds
    });

// Set initial position
character.style.left = "50%";
character.style.top = "50%";
character.style.transform = "translate(-50%, -50%)";
character.style.transition = "left 1s"; // Add transition for smooth movement

// Function to show speech bubble
function showSpeechBubble() {
    if (quotes.length > 0) {
        // Select a random quote
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        speechBubble.textContent = randomQuote;
        speechBubble.style.display = 'block';

        // Position speech bubble relative to character
        let bubbleLeft = character.offsetLeft + character.offsetWidth / 2;
        let bubbleTop = character.offsetTop - speechBubble.offsetHeight;

        // Ensure speech bubble stays within viewport
        if (bubbleLeft + speechBubble.offsetWidth > window.innerWidth) {
            bubbleLeft = window.innerWidth - speechBubble.offsetWidth;
        }
        if (bubbleLeft < 0) {
            bubbleLeft = 0;
        }
        if (bubbleTop < 0) {
            bubbleTop = character.offsetTop + character.offsetHeight;
        }

        speechBubble.style.left = `${bubbleLeft}px`;
        speechBubble.style.top = `${bubbleTop}px`;

        setTimeout(() => {
            speechBubble.style.display = 'none';
        }, 13000); // Display for 13 seconds
    }
}

// Function to handle character movement
function moveCharacter() {
    if (!isWalking) {
        isWalking = true;
        const direction = Math.random() < 0.5 ? -1 : 1; // Random direction: left or right
        const distance = Math.random() * 200 + 100; // Random distance: 100-300 pixels
        const newLeft = character.offsetLeft + direction * distance;

        // Ensure character stays within viewport
        if (newLeft > 0 && newLeft < window.innerWidth - character.offsetWidth) {
            character.style.left = `${newLeft}px`;
        }

        setTimeout(() => {
            isWalking = false;
            idleCharacter();
        }, 1000); // Simulate walking duration
    }
}

// Function to handle character idling
function idleCharacter() {
    const idleTime = Math.random() * 4000 + 3000; // Random idle time: 3-7 seconds
    setTimeout(moveCharacter, idleTime);
}

// Show speech bubble every 15 seconds
setInterval(showSpeechBubble, 15000);

// Initial call to show speech bubble and start idling
showSpeechBubble();
idleCharacter();