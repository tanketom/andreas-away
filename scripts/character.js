import { showTemporaryMessage, updateSpeechBubblePosition } from './ui.js';
import { resetCoffeeTimer, updateEmailCount } from './timers.js';

const character = document.getElementById('character');
const coffeeMachine = document.getElementById('coffee-machine');
const emailBox = document.getElementById('email-box');

let isWalking = false;
let hasCoffee = false;
let coffeeCups = [];
let emailCount = 0;
let timeSinceCoffee = 0;

export function setInitialPosition() {
    character.style.left = "50%";
    character.style.top = "50%";
    character.style.transform = "translate(-50%, -50%)";
}

export function idleCharacter() {
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

export function moveCharacter(target = null) {
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

function handleTargetInteraction(target) {
    if (target === coffeeMachine) {
        getCoffee();
    } else if (target === emailBox) {
        handleEmails();
    } else {
        idleCharacter();
    }
}

function getCoffee() {
    hasCoffee = true;
    character.classList.add('holding-coffee');
    character.classList.remove('needs-coffee');
    showTemporaryMessage('*PSSSHhhhhh*', 3000);
    setTimeout(walkWithCoffee, 15000);
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

        if (coffeeCups.length > 100) {
            const oldestCup = coffeeCups.shift();
            document.body.removeChild(oldestCup);
        }

        hasCoffee = false;
        character.classList.remove('holding-coffee');
        resetCoffeeTimer();
    }
    moveCharacter();
}