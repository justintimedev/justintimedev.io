const game = document.getElementById('game');
const player = document.getElementById('player');
const scoreEl = document.getElementById('score');
let obstacles = [];
let bullet = null;
let score = 0;
let isPlaying = false;
let gameInterval = null;
let obstacleInterval = null;

function createObstacle() {
    var obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    obstacle.style.left = Math.floor(Math.random() * 350) + "px";
    obstacle.style.top = "0px"; // set the top position to 0 initially
    game.appendChild(obstacle);
    obstacles.push(obstacle);
}

function moveObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        const obstacleTop = parseInt(obstacle.style.top);
        if (obstacleTop < 400) {
            obstacle.style.top = obstacleTop + 5 + 'px';
        } else {
            game.removeChild(obstacle);
            obstacles.splice(i, 1);
        }
    }
}

function shoot() {
    if (!bullet) {
        var playerRect = player.getBoundingClientRect();
        var bulletLeft = playerRect.left + player.offsetWidth / 2 - 3;
        bullet = document.createElement("div");
        bullet.className = "bullet";
        bullet.style.left = bulletLeft + "px";
        bullet.style.top = playerRect.top - 10 + "px";
        game.appendChild(bullet);
    }
}

function moveBullet() {
    if (bullet) {
        const bulletTop = parseInt(bullet.style.top);
        if (bulletTop > 0) {
            bullet.style.top = bulletTop - 10 + 'px';
            checkCollision();
        } else {
            game.removeChild(bullet);
            bullet = null;
        }
    }
}

function checkCollision() {
    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        const bulletRect = bullet.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();
        if (
            bulletRect.top < obstacleRect.bottom &&
            bulletRect.right > obstacleRect.left &&
            bulletRect.left < obstacleRect.right &&
            bulletRect.bottom > obstacleRect.top
        ) {
            game.removeChild(obstacle);
            obstacles.splice(i, 1);
            game.removeChild(bullet);
            bullet = null;
            score++;
            scoreEl.innerHTML = `Score: ${score}`;
            break;
        }
    }
}

function startGame() {
    isPlaying = true;
    gameInterval = setInterval(() => {
        moveObstacles();
        moveBullet();
    }, 50);
    obstacleInterval = setInterval(() => {
        createObstacle();
    }, 1000);
}

function stopGame() {
    isPlaying = false;
    clearInterval(gameInterval);
    clearInterval(obstacleInterval);
}

function handleKeyPress(event) {
    if (event.code === 'Space') {
        shoot();
    } else if (event.key === 'ArrowLeft') {
        player.style.left = parseInt(player.style.left) - 5 + 'px';
    } else if (event.key === 'ArrowRight') {
        player.style.left = parseInt(player.style.left) + 5 + 'px';
    } else if (event.code === 'KeyS') {
        if (isPlaying) {
            stopGame();
        } else {
            startGame();
        }
    }
}

document.addEventListener('keydown', handleKeyPress);