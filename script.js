const character = document.getElementById('character');
const speechBubble = document.getElementById('speech-bubble');
const coffeeMachine = document.getElementById('coffee-machine');
const emailBox = document.getElementById('email-box');
const emailCountElement = document.querySelector('#email-box .email-count');
let quotes = [];
let isWalking = false;
let hasCoffee = false;
let coffeeCups = [];
let emailCount = 0;

// Fetch quotes from quotes.json
fetch('quotes.json')
    .then(response => response.json())
    .then(data => {
        quotes = data.quotes;
    })
    .catch(error => {
        console.error('Error fetching quotes:', error);
        speechBubble.textContent = 'Failed to load quotes.';
        speechBubble.style.display = 'block';
        setTimeout(() => {
            speechBubble.style.display = 'none';
        }, 5000); // Display error message for 5 seconds
    });

// Set initial position
character.style.left = "50%";
character.style.top = "50%";
character.style.transform = "translate(-50%, -50%)";

// Function to show speech bubble
function showSpeechBubble() {
    if (quotes.length > 0) {
        // Select a random quote
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        speechBubble.textContent = randomQuote;
        speechBubble.style.display = 'block';

        // Position speech bubble relative to character
        updateSpeechBubblePosition();

        setTimeout(() => {
            speechBubble.style.display = 'none';
        }, 13000); // Display for 13 seconds
    }
}

// Function to update speech bubble position
function updateSpeechBubblePosition() {
    speechBubble.style.left = `${character.offsetLeft + character.offsetWidth / 2 + 8}px`;
    speechBubble.style.top = `${character.offsetTop - speechBubble.offsetHeight}px`;
}

// Function to handle character movement
function moveCharacter() {
    if (!isWalking) {
        isWalking = true;
        const direction = Math.random() < 0.5 ? -1 : 1; // Random direction: left or right
        const distance = Math.random() * 200 + 100; // Random distance: 100-300 pixels
        const newLeft = character.offsetLeft + direction * distance;
        const duration = distance / 50 * 1000; // Calculate duration based on distance for slower movement

        // Ensure character stays within viewport and doesn't go past coffee machine
        if (newLeft > 0 && newLeft < coffeeMachine.offsetLeft + coffeeMachine.offsetWidth - character.offsetWidth) {
            character.style.transition = `left ${duration}ms linear`; // Set transition duration
            character.style.left = `${newLeft}px`;
        }

        setTimeout(() => {
            isWalking = false;
            idleCharacter();
        }, duration); // Wait for the movement to complete
    }
}

// Function to handle character idling
function idleCharacter() {
    const idleTime = Math.random() * 4000 + 3000; // Random idle time: 3-7 seconds
    setTimeout(() => {
        if (hasCoffee) {
            putDownCoffee();
        } else if (Math.random() < 0.3) { // 30% chance to go to coffee machine
            goToCoffeeMachine();
        } else {
            moveCharacter();
        }
    }, idleTime);
}

// Function to handle going to coffee machine
function goToCoffeeMachine() {
    const coffeeMachineLeft = coffeeMachine.offsetLeft + coffeeMachine.offsetWidth;
    const duration = Math.abs(coffeeMachineLeft - character.offsetLeft) / 50 * 1000; // Calculate duration based on distance

    character.style.transition = `left ${duration}ms linear`; // Set transition duration
    character.style.left = `${coffeeMachineLeft}px`;

    setTimeout(() => {
        hasCoffee = true;
        character.classList.add('holding-coffee');
        showCoffeeSpeechBubble(); // Show speech bubble when getting coffee
        setTimeout(() => {
            walkWithCoffee();
        }, 15000); // Hold coffee for 15 seconds
    }, duration); // Wait for the movement to complete
}

// Function to show speech bubble when getting coffee
function showCoffeeSpeechBubble() {
    speechBubble.textContent = '*PSSSHhhhhh*';
    speechBubble.style.display = 'block';
    updateSpeechBubblePosition();
    setTimeout(() => {
        speechBubble.style.display = 'none';
    }, 3000); // Display for 3 seconds
}

// Function to handle walking with coffee
function walkWithCoffee() {
    const walkTime = 30000; // Walk with coffee for 30 seconds
    const startTime = Date.now();

    function walk() {
        if (Date.now() - startTime < walkTime) {
            moveCharacter();
            setTimeout(walk, 1000); // Move every second
        } else {
            putDownCoffee();
        }
    }

    walk();
}

// Function to handle putting down coffee cup
function putDownCoffee() {
    if (hasCoffee) {
        const coffeeCup = document.createElement('div');
        coffeeCup.textContent = '☕';
        coffeeCup.style.position = 'absolute';
        coffeeCup.style.left = `${character.offsetLeft}px`;
        coffeeCup.style.top = `${character.offsetTop + character.offsetHeight}px`;
        document.body.appendChild(coffeeCup);
        coffeeCups.push(coffeeCup);

        // Remove oldest coffee cup if more than 100
        if (coffeeCups.length > 100) {
            const oldestCup = coffeeCups.shift();
            document.body.removeChild(oldestCup);
        }

        hasCoffee = false;
        character.classList.remove('holding-coffee');
    }
    moveCharacter();
}

// Function to update email count
function updateEmailCount() {
    emailCount += Math.floor(Math.random() * 5) + 1; // Increase by 1-5
    emailCountElement.textContent = emailCount;
    setTimeout(updateEmailCount, Math.random() * 25000 + 5000); // Update every 5-30 seconds
}

// Function to handle character's urgency to get to email box
function checkEmailUrgency() {
    if (emailCount > 0) {
        const distanceToEmailBox = Math.abs(emailBox.offsetLeft - character.offsetLeft);
        const urgency = Math.min(emailCount / 10, 1); // Scale urgency based on email count
        const moveChance = urgency * 0.5; // 50% chance at max urgency

        if (Math.random() < moveChance) {
            moveToEmailBox();
        }
    }
    setTimeout(checkEmailUrgency, 1000); // Check every second
}

// Function to move character to email box
function moveToEmailBox() {
    const emailBoxLeft = emailBox.offsetLeft;
    const duration = Math.abs(emailBoxLeft - character.offsetLeft) / 50 * 1000; // Calculate duration based on distance

    character.style.transition = `left ${duration}ms linear`; // Set transition duration
    character.style.left = `${emailBoxLeft}px`;

    setTimeout(() => {
        const interval = setInterval(() => {
            if (emailCount > 0) {
                emailCount--;
                emailCountElement.textContent = emailCount;
            } else {
                clearInterval(interval);
                idleCharacter();
            }
        }, 500); // Decrease email count every 0.5 seconds
    }, duration); // Wait for the movement to complete
}

// Show speech bubble every 15 seconds
setInterval(showSpeechBubble, 15000);

// Update speech bubble position continuously
setInterval(updateSpeechBubblePosition, 5);

// Initial call to show speech bubble and start idling
showSpeechBubble();
idleCharacter();
updateEmailCount();
checkEmailUrgency();
