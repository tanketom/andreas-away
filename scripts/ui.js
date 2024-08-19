const speechBubble = document.getElementById('speech-bubble');
const emailCountElement = document.querySelector('#email-box .email-count');
let emailCount = 0;

export function showSpeechBubble(text, duration = 13000) {
    speechBubble.textContent = text;
    speechBubble.style.display = 'block';
    updateSpeechBubblePosition();
    setTimeout(() => {
        speechBubble.style.display = 'none';
    }, duration);
}

export function updateSpeechBubblePosition() {
    const character = document.getElementById('character');
    speechBubble.style.left = `${character.offsetLeft + character.offsetWidth / 2 + 8}px`;
    speechBubble.style.top = `${character.offsetTop - speechBubble.offsetHeight}px`;
}

export function updateEmailCount() {
    emailCount += Math.floor(Math.random() * 5) + 1;
    emailCountElement.textContent = emailCount;
    setTimeout(updateEmailCount, Math.random() * 25000 + 5000);
}