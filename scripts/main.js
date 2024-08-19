import { initCharacter, moveCharacter, idleCharacter } from './scripts/character.js';
import { showSpeechBubble, updateEmailCount } from './scripts/ui.js';

let quotes = [];

// Fetch quotes from quotes.json
fetch('quotes.json')
    .then(response => response.json())
    .then(data => {
        quotes = data.quotes;
    })
    .catch(error => {
        console.error('Error fetching quotes:', error);
        showSpeechBubble('Failed to load quotes.', 5000);
    });

// Initialize character and start initial actions
initCharacter();
showSpeechBubble();
idleCharacter();
updateEmailCount();