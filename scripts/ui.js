import { quotes } from './quotes.js';
import { getContext, getQuotesForContext } from './character.js';

const speechBubble = document.getElementById('speech-bubble');
const timeSinceCoffeeElement = document.getElementById('time-since-coffee');
const emailsReadElement = document.getElementById('emails-read');

export function showSpeechBubble() {
    const context = getContext();
    const contextQuotes = getQuotesForContext(context);
    if (contextQuotes.length > 0) {
        const randomQuote = contextQuotes[Math.floor(Math.random() * contextQuotes.length)];
        showTemporaryMessage(randomQuote, 13000);
    }
}

export function showTemporaryMessage(message, duration) {
    speechBubble.textContent = message;
    speechBubble.style.display = 'block';
    updateSpeechBubblePosition();
    setTimeout(() => {
        speechBubble.style.display = 'none';
    }, duration);
}

export function updateSpeechBubblePosition() {
    speechBubble.style.left = `${character.offsetLeft + character.offsetWidth / 2 + 8}px`;
    speechBubble.style.top = `${character.offsetTop - speechBubble.offsetHeight}px`;
}