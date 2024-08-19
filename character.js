import { showSpeechBubble, updateSpeechBubblePosition } from './ui.js';

const character = document.getElementById('character');
const coffeeMachine = document.getElementById('coffee-machine');
const emailBox = document.getElementById('email-box');
let isWalking = false;
let hasCoffee = false;
let coffeeCups = [];

export function initCharacter() {
    character.style.left = "50%";
    character.style.top = "50%";
    character.style.transform = "translate(-50%, -50%)";
}

export function moveCharacter(target = null) {
    if (!isWalking) {
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
            if (target === coffeeMachine && character.offsetLeft >= coffeeMachine.offsetLeft && character.offsetLeft <= coffeeMachine.offsetLeft + coffeeMachine.offsetWidth) {
                getCoffee();
            } else if (target === emailBox && character.offsetLeft >= emailBox.offsetLeft && character.offsetLeft <= emailBox.offsetLeft + emailBox.offsetWidth) {
                handleEmails();
            } else {
                idleCharacter();
            }
        }, duration);
    }
}

export function idleCharacter() {
    const idleTime = Math.random() * 4000 + 3000;
    setTimeout(() => {
        if (hasCoffee) {
            prepareToDropCoffee();
        } else if (Math.random() < 0.3) {
            moveCharacter(coffeeMachine);
        } else if (emailCount > 0 && Math.random() < 0.5) {
            moveCharacter(emailBox);
        } else {
            moveCharacter();
        }
    }, idleTime);
}

const coffeeSound = new Audio('path/to/coffee-sound.mp3');

export function getCoffee() {
    hasCoffee = true;
    character.classList.add('holding-coffee');
    coffeeSound.play();
    showSpeechBubble('*PSSSHhhhhh*', 3000);
    setTimeout(() => {
        walkWithCoffee();
    }, 15000);
}

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

function prepareToDropCoffee() {
    showSpeechBubble('A damned fine cup of coffee!', 1000);
    setTimeout(() => {
        dropCoffee();
    }, 1000);
}

function dropCoffee() {
    if (hasCoffee) {
        const coffeeCup = document.createElement('div');
        coffeeCup.textContent = '☕';
        coffeeCup.classList.add('coffee-cup');
        coffeeCup.style.left = `${character.offsetLeft}px`;
        coffeeCup.style.top = `${character.offsetTop + character.offsetHeight}px`;
        document.body.appendChild(coffeeCup);
        coffeeCups.push(coffeeCup);

        if (coffeeCups.length > 100) {
            const oldestCup = coffeeCups.shift();
            document.body.removeChild(oldestCup);
        }

        hasCoffee = false;
        character.classList.remove('holding-coffee');
    }
    moveCharacter();
}

export function handleEmails() {
    const interval = setInterval(() => {
        if (emailCount > 0) {
            emailCount--;
            emailCountElement.textContent = emailCount;
        } else {
            clearInterval(interval);
            idleCharacter();
        }
    }, 500);
}