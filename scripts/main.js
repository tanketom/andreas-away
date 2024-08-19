import { fetchQuotes } from './quotes.js';
import { setInitialPosition, idleCharacter } from './character.js';
import { initializeTimers } from './timers.js';
import { showSpeechBubble } from './ui.js';

// Fetch quotes from quotes.json
fetchQuotes();

// Set initial position
setInitialPosition();

// Initialize timers and intervals
initializeTimers();

// Initial call to show speech bubble and start idling
showSpeechBubble();
idleCharacter();