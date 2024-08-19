const character = document.getElementById('character');
const speechBubble = document.getElementById('speech-bubble');
const coffeeMachine = document.getElementById('coffee-machine');
const emailBox = document.getElementById('email-box');
const emailCountElement = document.querySelector('#email-box .email-count');
const timeSinceCoffeeElement = document.getElementById('time-since-coffee');
const emailsReadElement = document.getElementById('emails-read');

let quotes = [];
let isWalking = false;
let hasCoffee = false;
let coffeeCups = [];
let emailCount = 0;
let timeSinceCoffee = 0;
let emailsRead = 0;
let coffeeTimer;

// Fetch quotes from quotes.json
fetchQuotes();

// Set initial position
setInitialPosition();

// Initialize timers and intervals
initializeTimers();

// Function to fetch quotes
function fetchQuotes() {
    fetch('quotes.json')
        .then(response => response.json())
        .then(data => {
            quotes = data.quotes;
        })
        .catch(error => {
            console.error('Error fetching quotes:', error);
            showTemporaryMessage('Failed to load quotes.', 5000);
        });
}

// Function to set initial position
function setInitialPosition() {
    character.style.left = "50%";
    character.style.top = "50%";
    character.style.transform = "translate(-50%, -50%)";
}

// Function to initialize timers and intervals
function initializeTimers() {
    setInterval(showSpeechBubble, 15000);
    setInterval(updateSpeechBubblePosition, 5);
    setInterval(updateEmailCount, Math.random() * 25000 + 5000);
    coffeeTimer = setInterval(updateTimeSinceCoffee, 1000);
    showSpeechBubble();
    idleCharacter();
}

// Function to show speech bubble
function showSpeechBubble() {
    if (quotes.length > 0) {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        showTemporaryMessage(randomQuote, 13000);
    }
}

// Function to show temporary message in speech bubble
function showTemporaryMessage(message, duration) {
    speechBubble.textContent = message;
    speechBubble.style.display = 'block';
    updateSpeechBubblePosition();
    setTimeout(() => {
        speechBubble.style.display = 'none';
    }, duration);
}

// Function to update speech bubble position
function updateSpeechBubblePosition() {
    speechBubble.style.left = `${character.offsetLeft + character.offsetWidth / 2 + 8}px`;
    speechBubble.style.top = `${character.offsetTop - speechBubble.offsetHeight}px`;
}

// Function to handle character movement and motivation
function moveCharacter(target = null) {
    if (isWalking) return;

    isWalking = true;
    let newLeft, duration;

    if (target) {
        newLeft = target.offsetLeft + (target === coffeeMachine ? target.offsetWidth : 0);
        duration = Math.abs(newLeft - character.offsetLeft) / 50 * 1000;
    } else {
        const direction = Math.random() < 0.5 ? -1 : 1;
        const distance = Math.random() * 200 + 100;
        newLeft = character.offsetLeft + direction * distance;
        duration = distance / 50 * 1000;
    }

    if (newLeft > 0 && newLeft < document.body.clientWidth - character.offsetWidth) {
        character.style.transition = `left ${duration}ms ease-in-out`;
        character.style.left = `${newLeft}px`;
    }

    setTimeout(() => {
        isWalking = false;
        if (target) {
            handleTargetInteraction(target);
        } else {
            idleCharacter();
        }
    }, duration);
}

// Function to handle interactions with targets
function handleTargetInteraction(target) {
    if (target === coffeeMachine) {
        getCoffee();
    } else if (target === emailBox) {
        handleEmails();
    } else {
        idleCharacter();
    }
}

// Function to handle character idling
function idleCharacter() {
    const idleTime = Math.random() * 4000 + 3000;
    setTimeout(() => {
        if (hasCoffee) {
            prepareToDropCoffee();
        } else if (timeSinceCoffee > 60 && emailCount > 25) {
            showTemporaryMessage('Aaaaah! My prioritieees!', 3000);
            moveCharacter(Math.random() < 0.5 ? coffeeMachine : emailBox);
        } else if (timeSinceCoffee > 60) {
            moveCharacter(coffeeMachine);
        } else if (emailCount > 25) {
            moveCharacter(emailBox);
        } else if (Math.random() < 0.3) {
            moveCharacter(coffeeMachine);
        } else if (emailCount > 0 && Math.random() < 0.5) {
            moveCharacter(emailBox);
        } else {
            moveCharacter();
        }
    }, idleTime);
}

// Function to get coffee
function getCoffee() {
    hasCoffee = true;
    character.classList.add('holding-coffee');
    character.classList.remove('needs-coffee');
    showTemporaryMessage('*PSSSHhhhhh*', 3000);
    setTimeout(walkWithCoffee, 15000);
}

// Function to handle walking with coffee
function walkWithCoffee() {
    const walkTime = 30000;
    const startTime = Date.now();

    function walk() {
        if (Date.now() - startTime < walkTime) {
            moveCharacter();
            setTimeout(walk, 1000);
        } else {
            prepareToDropCoffee();
        }
    }

    walk();
}

// Function to prepare to drop coffee
function prepareToDropCoffee() {
    showTemporaryMessage('A damned fine cup of coffee!', 1000);
    setTimeout(dropCoffee, 1000);
}

// Function to handle dropping the coffee cup
function dropCoffee() {
    if (hasCoffee) {
        const coffeeCup = document.createElement('div');
        coffeeCup.textContent = '☕';
        coffeeCup.classList.add('coffee-cup');
        coffeeCup.style.left = `${character.offsetLeft + character.offsetWidth / 2 - 15}px`; // Center the cup below the character
        coffeeCup.style.top = `${character.offsetTop + character.offsetHeight}px`;
        document.body.appendChild(coffeeCup);
        coffeeCups.push(coffeeCup);

        if (coffeeCups.length > 100) {
            const oldestCup = coffeeCups.shift();
            document.body.removeChild(oldestCup);
        }

        hasCoffee = false;
        character.classList.remove('holding-coffee');
        resetCoffeeTimer(); // Reset the coffee timer
    }
    moveCharacter();
}

// Function to update time since last coffee
function updateTimeSinceCoffee() {
    timeSinceCoffee++;
    timeSinceCoffeeElement.textContent = `Time since last coffee: ${timeSinceCoffee}`;
    if (timeSinceCoffee > 60) {
        character.classList.add('needs-coffee');
    } else {
        character.classList.remove('needs-coffee');
    }
}

// Function to reset coffee timer
function resetCoffeeTimer() {
    clearInterval(coffeeTimer);
    timeSinceCoffee = 0;
    coffeeTimer = setInterval(updateTimeSinceCoffee, 1000);
}

// Function to update email count
function updateEmailCount() {
    emailCount += Math.floor(Math.random() * 5) + 1;
    emailCountElement.textContent = emailCount;
    if (emailCount > 25) {
        character.classList.add('needs-emails');
    } else {
        character.classList.remove('needs-emails');
    }
    setTimeout(updateEmailCount, Math.random() * 25000 + 5000);
}

// Function to handle emails
function handleEmails() {
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
    }, 500);
}