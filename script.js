const character = document.getElementById('character');
const speechBubble = document.getElementById('speech-bubble');
const coffeeMachine = document.getElementById('coffee-machine');
const emailBox = document.getElementById('email-box');
const emailCountElement = document.querySelector('#email-box .email-count');
const timeSinceCoffeeElement = document.getElementById('time-since-coffee');
const arriveButton = document.getElementById('arrive-button');
const leaveButton = document.getElementById('leave-button');

let quotes = {
    general: [],
    coffee: [],
    email: []
};
let isWalking = false;
let hasCoffee = false;
let coffeeCups = [];
let emailCount = 0;
let timeSinceCoffee = 0;
let coffeeTimer;
let officeHours = { start: 8.5, end: 15.5 }; // 8:30 to 15:30

// Fetch quotes from quotes.json
fetchQuotes();

// Set initial position
setInitialPosition();

// Initialize timers and intervals
initializeTimers();

// Add event listeners for buttons
arriveButton.addEventListener('click', arriveAtOffice);
leaveButton.addEventListener('click', leaveOffice);

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
    character.style.left = "-100px"; // Start off-screen
    character.style.top = "50%";
    character.style.transform = "translateY(-50%)";
}

// Function to initialize timers and intervals
function initializeTimers() {
    setInterval(showSpeechBubble, 15000);
    setInterval(updateSpeechBubblePosition, 5);
    setTimeout(updateEmailCount, Math.random() * 25000 + 5000);
    coffeeTimer = setInterval(updateTimeSinceCoffee, 1000);
    showSpeechBubble();
    idleCharacter();
    checkOfficeHours();
}

// Function to show speech bubble
function showSpeechBubble() {
    const context = getContext();
    const contextQuotes = getQuotesForContext(context);
    if (contextQuotes.length > 0) {
        const randomQuote = contextQuotes[Math.floor(Math.random() * contextQuotes.length)];
        showTemporaryMessage(randomQuote, 13000);
    }
}

// Function to get context based on character's position
function getContext() {
    const characterRect = character.getBoundingClientRect();
    const coffeeMachineRect = coffeeMachine.getBoundingClientRect();
    const emailBoxRect = emailBox.getBoundingClientRect();

    if (isNear(characterRect, coffeeMachineRect)) {
        return 'coffee';
    } else if (isNear(characterRect, emailBoxRect)) {
        return 'email';
    } else {
        return 'general';
    }
}

// Function to check if character is near a target
function isNear(characterRect, targetRect) {
    const distance = Math.hypot(
        characterRect.left - targetRect.left,
        characterRect.top - targetRect.top
    );
    return distance < 100; // Adjust this value as needed
}

// Function to get quotes for the given context
function getQuotesForContext(context) {
    return quotes[context] || quotes['general'];
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
        } else if (timeSinceCoffee > 80 && emailCount > 25) {
            showTemporaryMessage('Aaaaah! My prioritieees!', 3000);
            moveCharacter(Math.random() < 0.5 ? coffeeMachine : emailBox);
        } else if (timeSinceCoffee > 80) {
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
    if (timeSinceCoffee > 80) {
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
    emailCount += 1;
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
    if (!isNear(character.getBoundingClientRect(), emailBox.getBoundingClientRect())) {
        idleCharacter();
        return;
    }

    const interval = setInterval(() => {
        if (emailCount > 0) {
            emailCount--;
            emailCountElement.textContent = emailCount;
            if (emailCount <= 25) {
                character.classList.remove('needs-emails');
            }
        } else {
            clearInterval(interval);
            setTimeout(() => {
                idleCharacter();
                setTimeout(updateEmailCount, 5000); // Pause for 5 seconds before increasing again
            }, 5000);
        }
    }, 300); // Adjusted interval to 300 milliseconds
}

// Function to check office hours and animate arrival/departure
function checkOfficeHours() {
    const now = new Date();
    const currentHour = now.getHours() + now.getMinutes() / 60;

    if (currentHour >= officeHours.start && currentHour < officeHours.end) {
        arriveAtOffice();
    } else {
        leaveOffice();
    }

    // Check every minute
    setTimeout(checkOfficeHours, 60000);
}

// Function to animate arrival at office
function arriveAtOffice() {
    character.style.transition = 'left 2s ease-in-out';
    character.style.left = '50%';
    character.style.transform = 'translate(-50%, -50%)';
    setTimeout(() => {
        idleCharacter();
    }, 2000);
}

// Function to animate leaving the office
function leaveOffice() {
    character.style.transition = 'left 2s ease-in-out';
    character.style.left = '100%';
    character.style.transform = 'translateY(-50%)';
}

// Show speech bubble every 15 seconds
setInterval(showSpeechBubble, 15000);

// Update speech bubble position continuously
setInterval(updateSpeechBubblePosition, 5);

// Initial call to show speech bubble and start idling
showSpeechBubble();
idleCharacter();
updateEmailCount();

// Initialize coffee timer
coffeeTimer = setInterval(updateTimeSinceCoffee, 1000);