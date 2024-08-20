const character = document.getElementById('character');
const speechBubble = document.getElementById('speech-bubble');
const coffeeMachine = document.getElementById('coffee-machine');
const emailBox = document.getElementById('email-box');
const emailCountElement = document.querySelector('#email-box .email-count');
const timeSinceCoffeeElement = document.getElementById('time-since-coffee');
const arriveButton = document.getElementById('arrive-button');
const leaveButton = document.getElementById('leave-button');
const bike = document.getElementById('bike');

let quotes = { general: [], coffee: [], email: [] };
let isWalking = false, hasCoffee = false, manualOverride = false;
let coffeeCups = [], emailCount = 0, timeSinceCoffee = 0;
const officeHours = { start: 8.5, end: 15.5 }; // 8:30 to 15:30

// Fetch quotes from quotes.json
fetch('quotes.json')
    .then(response => response.json())
    .then(data => quotes = data.quotes)
    .catch(error => showTemporaryMessage('Failed to load quotes.', 5000));

// Set initial position
character.style.left = "-100px";
character.style.top = "50%";
character.style.transform = "translateY(-50%)";

// Initialize timers and intervals
setInterval(showSpeechBubble, 15000);
setInterval(updateSpeechBubblePosition, 5);
setTimeout(updateEmailCount, Math.random() * 25000 + 5000);
setInterval(updateTimeSinceCoffee, 1000);
checkOfficeHours();
setInterval(checkOfficeHours, 1800000); // Check every 30 minutes

// Add event listeners for buttons
arriveButton.addEventListener('click', () => { manualOverride = true; arriveAtOffice(); });
leaveButton.addEventListener('click', () => { manualOverride = true; leaveOffice(); });

function showSpeechBubble() {
    const contextQuotes = quotes[getContext()] || quotes.general;
    if (contextQuotes.length) showTemporaryMessage(contextQuotes[Math.floor(Math.random() * contextQuotes.length)], 13000);
}

function getContext() {
    const characterRect = character.getBoundingClientRect();
    if (isNear(characterRect, coffeeMachine.getBoundingClientRect())) return 'coffee';
    if (isNear(characterRect, emailBox.getBoundingClientRect())) return 'email';
    return 'general';
}

function isNear(rect1, rect2) {
    return Math.hypot(rect1.left - rect2.left, rect1.top - rect2.top) < 100;
}

function showTemporaryMessage(message, duration) {
    speechBubble.textContent = message;
    speechBubble.style.display = 'block';
    updateSpeechBubblePosition();
    setTimeout(() => speechBubble.style.display = 'none', duration);
}

function updateSpeechBubblePosition() {
    speechBubble.style.left = `${character.offsetLeft + character.offsetWidth / 2 + 8}px`;
    speechBubble.style.top = `${character.offsetTop - speechBubble.offsetHeight}px`;
}

function moveCharacter(target = null) {
    if (isWalking) return;
    isWalking = true;
    const newLeft = target ? target.offsetLeft + (target === coffeeMachine ? target.offsetWidth : 0) : character.offsetLeft + (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 200 + 100);
    const duration = Math.abs(newLeft - character.offsetLeft) / 50 * 1000;
    if (newLeft > 0 && newLeft < document.body.clientWidth - character.offsetWidth) {
        character.style.transition = `left ${duration}ms ease-in-out`;
        character.style.left = `${newLeft}px`;
    }
    setTimeout(() => {
        isWalking = false;
        target ? handleTargetInteraction(target) : idleCharacter();
    }, duration);
}

function handleTargetInteraction(target) {
    if (target === coffeeMachine) getCoffee();
    else if (target === emailBox) handleEmails();
    else idleCharacter();
}

function idleCharacter() {
    setTimeout(() => {
        if (hasCoffee) prepareToDropCoffee();
        else if (timeSinceCoffee > 80 && emailCount > 25) {
            showTemporaryMessage('Aaaaah! My prioritieees!', 3000);
            moveCharacter(Math.random() < 0.5 ? coffeeMachine : emailBox);
        } else if (timeSinceCoffee > 80) moveCharacter(coffeeMachine);
        else if (emailCount > 25) moveCharacter(emailBox);
        else if (Math.random() < 0.3) moveCharacter(coffeeMachine);
        else if (emailCount > 0 && Math.random() < 0.5) moveCharacter(emailBox);
        else moveCharacter();
    }, Math.random() * 4000 + 3000);
}

function getCoffee() {
    hasCoffee = true;
    character.classList.add('holding-coffee');
    character.classList.remove('needs-coffee');
    showTemporaryMessage('*PSSSHhhhhh*', 3000);
    setTimeout(walkWithCoffee, 15000);
}

function walkWithCoffee() {
    const walkTime = 30000, startTime = Date.now();
    (function walk() {
        if (Date.now() - startTime < walkTime) {
            moveCharacter();
            setTimeout(walk, 1000);
        } else prepareToDropCoffee();
    })();
}

function prepareToDropCoffee() {
    showTemporaryMessage('A damned fine cup of coffee!', 1000);
    setTimeout(dropCoffee, 1000);
}

function dropCoffee() {
    if (hasCoffee) {
        const coffeeCup = document.createElement('div');
        coffeeCup.textContent = '☕';
        coffeeCup.classList.add('coffee-cup');
        coffeeCup.style.left = `${character.offsetLeft + character.offsetWidth / 2 - 15}px`;
        coffeeCup.style.top = `${character.offsetTop + character.offsetHeight}px`;
        document.body.appendChild(coffeeCup);
        coffeeCups.push(coffeeCup);
        if (coffeeCups.length > 100) document.body.removeChild(coffeeCups.shift());
        hasCoffee = false;
        character.classList.remove('holding-coffee');
        resetCoffeeTimer();
    }
    moveCharacter();
}

function updateTimeSinceCoffee() {
    timeSinceCoffee++;
    timeSinceCoffeeElement.textContent = `Time since last coffee: ${timeSinceCoffee}`;
    character.classList.toggle('needs-coffee', timeSinceCoffee > 80);
}

function resetCoffeeTimer() {
    clearInterval(coffeeTimer);
    timeSinceCoffee = 0;
    coffeeTimer = setInterval(updateTimeSinceCoffee, 1000);
}

function updateEmailCount() {
    emailCount++;
    emailCountElement.textContent = emailCount;
    character.classList.toggle('needs-emails', emailCount > 25);
    setTimeout(updateEmailCount, Math.random() * 25000 + 5000);
}

function handleEmails() {
    if (!isNear(character.getBoundingClientRect(), emailBox.getBoundingClientRect())) return idleCharacter();
    const interval = setInterval(() => {
        if (emailCount > 0) {
            emailCount--;
            emailCountElement.textContent = emailCount;
            if (emailCount <= 25) character.classList.remove('needs-emails');
        } else {
            clearInterval(interval);
            setTimeout(() => {
                idleCharacter();
                setTimeout(updateEmailCount, 5000);
            }, 5000);
        }
    }, 300);
}

function checkOfficeHours() {
    if (manualOverride) return;
    const now = new Date(), currentHour = now.getHours() + now.getMinutes() / 60;
    currentHour >= officeHours.start && currentHour < officeHours.end ? arriveAtOffice() : leaveOffice();
}

function arriveAtOffice() {
    bike.style.display = 'block';
    bike.style.left = '100%';
    bike.style.transition = 'left 2s ease-in-out';
    bike.style.left = '50%';
    setTimeout(() => {
        character.style.transition = 'left 2s ease-in-out';
        character.style.left = '50%';
        character.style.transform = 'translate(-50%, -50%)';
        bike.style.display = 'none';
        showTemporaryMessage('I am not made of sugar!', 2000);
        setTimeout(() => {
            character.style.display = 'block';
            idleCharacter();
        }, 2000);
    }, 2000);
}

function leaveOffice() {
    showTemporaryMessage('This machine kills fascists!', 2000);
    character.style.transition = 'left 2s ease-in-out, top 2s ease-in-out';
    character.style.left = '90%';
    character.style.top = '90%';
    setTimeout(() => {
        bike.style.display = 'block';
        bike.style.left = '90%';
        bike.style.transition = 'left 2s ease-in-out';
        bike.style.left = '100%';
        setTimeout(() => {
            character.style.display = 'none';
            speechBubble.style.display = 'none';
            character.style.left = '-100px';
            character.style.top = '50%';
            character.style.transform = 'translateY(-50%)';
            bike.style.display = 'none';
        }, 2000);
    }, 2000);
}

// Initial call to show speech bubble and start idling
showSpeechBubble();
idleCharacter();
updateEmailCount();