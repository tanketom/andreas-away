const character = document.getElementById('character');
const speechBubble = document.getElementById('speech-bubble');
let quotes = [];

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
        }, 13000); // Display for 13 seconds
    }
}

// Show speech bubble every 15 seconds
setInterval(showSpeechBubble, 15000);

// Initial call to show speech bubble
showSpeechBubble();