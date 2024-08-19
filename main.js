import { initCharacter, moveCharacter, idleCharacter, getCoffee, handleEmails } from './character.js';
import { showSpeechBubble, updateEmailCount } from './ui.js';

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

// Initial call to show speech bubble and start idling
showSpeechBubble();
idleCharacter();
updateEmailCount();