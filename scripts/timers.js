import { showSpeechBubble, updateSpeechBubblePosition } from './ui.js';
import { idleCharacter } from './character.js';

let coffeeTimer;
let emailCount = 0;
let emailsRead = 0;
const emailCountElement = document.querySelector('#email-box .email-count');
const timeSinceCoffeeElement = document.getElementById('time-since-coffee');
const emailsReadElement = document.getElementById('emails-read');

export function initializeTimers() {
    setInterval(showSpeechBubble, 15000);
    setInterval(updateSpeechBubblePosition, 5);
    setInterval(updateEmailCount, Math.random() * 30000 + 10000); // Increase interval
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
    emailCount += Math.floor(Math.random() * 1) + 1; // Decrease amount
    emailCountElement.textContent = emailCount;
    if (emailCount > 25) {
        character.classList.add('needs-emails');
    } else {
        character.classList.remove('needs-emails');
    }
    setTimeout(updateEmailCount, Math.random() * 30000 + 10000); // Increase interval
}

export function handleEmails() {
    const interval = setInterval(() => {
        if (emailCount > 0) {
            emailCount--;
            emailsRead++;
            emailCountElement.textContent = emailCount;
            emailsReadElement.textContent = `E-mails read: ${emailsRead}`;
            if (emailCount <= 25) {
                character.classList.remove('needs-emails');
            }
        } else {
            clearInterval(interval);
            idleCharacter();
        }
    }, 200); // Increase speed
}
