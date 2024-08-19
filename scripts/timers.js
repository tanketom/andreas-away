import { showSpeechBubble, updateSpeechBubblePosition } from './ui.js';
import { idleCharacter, moveCharacter } from './character.js';

let coffeeTimer;

export function initializeTimers() {
    setInterval(showSpeechBubble, 15000);
    setInterval(updateSpeechBubblePosition, 5);
    setInterval(updateEmailCount, Math.random() * 25000 + 5000);
    coffeeTimer = setInterval(updateTimeSinceCoffee, 1000);
    showSpeechBubble();
    idleCharacter();
}

export function resetCoffeeTimer() {
    clearInterval(coffeeTimer);
    timeSinceCoffee = 0;
    coffeeTimer = setInterval(updateTimeSinceCoffee, 1000);
}

export function updateTimeSinceCoffee() {
    timeSinceCoffee++;
    timeSinceCoffeeElement.textContent = `Time since last coffee: ${timeSinceCoffee}`;
    if (timeSinceCoffee > 60) {
        character.classList.add('needs-coffee');
    } else {
        character.classList.remove('needs-coffee');
    }
}

export function updateEmailCount() {
    emailCount += Math.floor(Math.random() * 2) + 1;
    emailCountElement.textContent = emailCount;
    if (emailCount > 25) {
        character.classList.add('needs-emails');
    } else {
        character.classList.remove('needs-emails');
    }
    setTimeout(updateEmailCount, Math.random() * 25000 + 5000);
}