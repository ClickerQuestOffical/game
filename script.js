let counter = 0;
let questActive = false;
let doublePointsTime = 0;
let questClicks = 0;
let questTimer = 60;
let questCompleted = false;

const counterElement = document.getElementById('counter');
const clickButton = document.getElementById('clickButton');
const questBox = document.getElementById('questBox');
const startQuestButton = document.getElementById('startQuestButton');
const questClickButton = document.getElementById('questClickButton');
const questCounterElement = document.getElementById('questCounter');
const questTimerElement = document.getElementById('questTimer');
const timerElement = document.getElementById('timer');
const timerValue = document.getElementById('timerValue');
const clickAnimationContainer = document.getElementById('clickAnimationContainer');
const bunny = document.getElementById('bunny');
const speechBubble = document.getElementById('speechBubble');

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startQuest() {
    if (questCompleted) return;
    questBox.style.opacity = '1';
    startQuestButton.style.display = 'none';
    questClickButton.style.display = 'inline-block';
    questActive = true;

    // Reset quest clicks and timer
    questClicks = 0;
    questTimer = 60;
    questCounterElement.textContent = questClicks;
    questTimerElement.textContent = questTimer;

    const interval = setInterval(() => {
        if (questTimer > 0) {
            questTimer--;
            questTimerElement.textContent = questTimer;
        } else {
            clearInterval(interval);
            questActive = false;
            questCompleted = true;
            doublePointsTime = questClicks;
            timerValue.textContent = doublePointsTime;
            timerElement.style.display = 'block';
            questBox.style.opacity = '0';

            const doublePointsInterval = setInterval(() => {
                if (doublePointsTime > 0) {
                    doublePointsTime--;
                    timerValue.textContent = doublePointsTime;
                } else {
                    clearInterval(doublePointsInterval);
                    timerElement.style.display = 'none';

                    // Wait 10 seconds, then shake screen and show bunny
                    setTimeout(() => {
                        document.body.style.animation = 'shake 0.5s ease-in-out infinite';
                        setTimeout(() => {
                            document.body.style.animation = '';
                            showBunny();
                        }, 5000);
                    }, 10000);
                }
            }, 1000);
        }
    }, 1000);
}

function showBunny() {
    bunny.style.display = 'block';
    let pos = -200;
    const bunnyInterval = setInterval(() => {
        if (pos < window.innerWidth / 2 - 100) {
            pos += 10;
            bunny.style.left = `${pos}px`;
        } else {
            clearInterval(bunnyInterval);
            bunny.style.animation = 'bounce 0.5s ease-in-out infinite';
            speechBubble.style.display = 'block';
            speechBubble.style.left = `${pos + 50}px`;
            speechBubble.style.top = '50px';

            setTimeout(() => {
                bunny.style.display = 'none';
                speechBubble.style.display = 'none';
                makeGameHarder(); // Make the game harder after the bunny disappears
            }, 3000);
        }
    }, 20);
}

function makeGameHarder() {
    // Make the game harder by reducing the points per click
    clickButton.removeEventListener('click', handleClick);
    clickButton.addEventListener('click', handleHarderClick);
}

function handleClick(e) {
    const points = getRandomNumber(2, 7);
    counter += doublePointsTime > 0 ? points * 2 : points;
    counterElement.textContent = counter;
    createClickAnimation(e.clientX, e.clientY, points);

    if (counter >= 500 && questBox.style.opacity !== '1' && !questCompleted) {
        startQuest();
    }
}

function handleHarderClick(e) {
    const points = getRandomNumber(1, 3); // Reduced points to make the game harder
    counter += doublePointsTime > 0 ? points * 2 : points;
    counterElement.textContent = counter;
    createClickAnimation(e.clientX, e.clientY, points);
}

function createClickAnimation(x, y, value) {
    const clickAnimation = document.createElement('div');
    clickAnimation.className = 'click-animation';
    clickAnimation.textContent = `${value >= 0 ? '+' : ''}${value}`;
    clickAnimation.style.left = `${x}px`;
    clickAnimation.style.top = `${y}px`;
    clickAnimationContainer.appendChild(clickAnimation);

    setTimeout(() => {
        clickAnimation.remove();
    }, 1000);
}

// Event listener for the "Click Me Fast!" button
questClickButton.addEventListener('click', (e) => {
    if (questActive) {
        const points = getRandomNumber(1, 3); // Random points for quest clicks
        questClicks += points;
        questCounterElement.textContent = questClicks;
        createClickAnimation(e.clientX, e.clientY, points); // Show click animation
    }
});

// Event listener for the main button
clickButton.addEventListener('click', handleClick);