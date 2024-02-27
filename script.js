const snakeGrid = document.querySelector(".snakeGrid");

const doorThreshold = 0;
const enemyThreshold = 4;
const gridSize = 30;
const snakeChangeDirectionProbability = 0.2;

let foodX, foodY;
let doorA_X, doorA_Y;
let doorB_X, doorB_Y;
let snakeX = 5,
  snakeY = 10;
let snakeBody = [];
let velocityX = 0,
  velocityY = 0;
let direction = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];
let gameOver = false;
let setIntervalId;
let score = 0;
let highScore = localStorage.getItem("highScore");
let enemySnakeX, enemySnakeY;
let enemySnakeBody = [];
let enemyVelocityX = 0;
let enemyVelocityY = 0;

// This method checks whether the given coordinates collide with the snake
const checkSnakeLocation = (x, y) => {
  if (x == snakeX && y == snakeY) return true;
  for (let body of snakeBody) {
    let bodyX = body[0];
    let bodyY = body[1];
    if (x == bodyX && y == bodyY) return true;
  }
  return false;
};

// This method helps to generate a random location in the map
const randomLocation = () => {
  return Math.floor(Math.random() * gridSize) + 1;
};

// This method initialises the Food to be in a random position other than the snake or door
const randomizedFood = () => {
  foodX = randomLocation();
  foodY = randomLocation();

  if (checkSnakeLocation(foodX, foodY)) {
    return randomizedFood();
  }

  if (
    score > doorThreshold &&
    ((foodX == doorA_X && foodY == doorA_Y) ||
      (foodX == doorB_X && foodY == doorB_Y))
  )
    return randomizedFood();
};

// This method initialises the Door to be in a random position other than the snake or the food
const randomizedDoor = () => {
  doorA_X = randomLocation();
  doorA_Y = randomLocation();
  doorB_X = randomLocation();
  doorB_Y = randomLocation();

  if (
    checkSnakeLocation(doorA_X, doorA_Y) ||
    checkSnakeLocation(doorB_X, doorB_Y)
  ) {
    return randomizedDoor();
  }

  if (
    (foodX == doorA_X && foodY == doorA_Y) ||
    (foodX == doorB_X && foodY == doorB_Y) ||
    (doorA_X == doorB_X && doorB_X == doorB_Y)
  )
    return randomizedDoor();
};

// This method does the required steps to alert user that the game is over
const handleGameOver = () => {
  clearInterval(setIntervalId);
  alert("GAME OVER! Restart?");
  location.reload();
};

// This method handles event with the direction change of the head
const changeDirection = (e) => {
  if (e.key === "ArrowUp" && velocityY !== 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowDown" && velocityY !== -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowRight" && velocityX !== -1) {
    velocityX = 1;
    velocityY = 0;
  } else if (e.key === "ArrowLeft" && velocityX !== 1) {
    velocityX = -1;
    velocityY = 0;
  }
};

// This method updates the high score
const updateHighScore = () => {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    document.querySelector(".highScoreDisplay").textContent =
      "High Score: " + highScore;
  }
};

// This method updates the location of the snake
const updateSnakeLocation = () => {
  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }

  if (snakeBody.length >= 1) {
    snakeBody[0] = [snakeX, snakeY];
  }
};

const addScore = (scoreAdd) => {
  score += scoreAdd;
  document.querySelector(".scoreDisplay").textContent = "Score: " + score;

  if (score > highScore) {
    updateHighScore();
  }
};

// This method handles what happen when snake eats
const eatFood = () => {
  // Update Score
  addScore(1);

  // Add Body
  snakeBody.push([foodX, foodY]);
  // Recreate Food
  randomizedFood();
};

/*
  ENEMY SNAKE METHODS
*/

// This method updates the location of the enemy snake
const updateEnemySnakeLocation = () => {
  for (let i = enemySnakeBody.length - 1; i > 0; i--) {
    enemySnakeBody[i] = enemySnakeBody[i - 1];
  }

  if (enemySnakeBody.length >= 1) {
    enemySnakeBody[0] = [enemySnakeX, enemySnakeY];
  }
};

// This method checks what direction should the enemy move
const enemyChangeDirection = (retry = 0) => {
  // Hackish way to ensure that snake eat itself and doesn't cause exception
  if (retry > 2000) {
    spawnEnemy();
  }
  let nextVelocity = direction[Math.floor(Math.random() * 4)];
  if (Math.random() > snakeChangeDirectionProbability) {
    nextVelocity = [enemyVelocityX, enemyVelocityY];
  }
  // Make sure enemy snake dont enter edges of map
  if (
    enemySnakeX + nextVelocity[0] > 30 ||
    enemySnakeY + nextVelocity[1] > 30 ||
    enemySnakeX + nextVelocity[0] < 1 ||
    enemySnakeY + nextVelocity[1] < 1
  ) {
    return enemyChangeDirection(retry + 1);
  }

  // Check whether the snake eat itself, change direction if so
  for (i = 0; i < enemySnakeBody.length; i++) {
    if (
      enemySnakeX + nextVelocity[0] === enemySnakeBody[i][0] &&
      enemySnakeY + nextVelocity[1] === enemySnakeBody[i][1]
    ) {
      return enemyChangeDirection(retry + 1);
    }
  }
  enemySnakeX += nextVelocity[0];
  enemySnakeY += nextVelocity[1];

  enemyVelocityX = nextVelocity[0];
  enemyVelocityY = nextVelocity[1];
};

// This method spawns the enemy snake at the edge of the map
const spawnEnemy = () => {
  enemySnakeX = 30;
  enemySnakeY = 30;
  enemySnakeBody = [];
  for (let i = 1; i <= snakeBody.length; i++) {
    enemySnakeBody.push([enemySnakeX + i, enemySnakeY]);
  }
};

// This method is the catch all for most enemy logic
const enemySnakeLogic = () => {
  updateEnemySnakeLocation();
  enemyChangeDirection();
  if (enemySnakeX === foodX && enemySnakeY === foodY) {
    // Add Body
    enemySnakeBody.push([foodX, foodY]);
    // Recreate Food
    randomizedFood();
  }
  //Check whether the enemy snake and snake collide
  if (snakeBody.length > enemySnakeBody.length) {
    if (snakeX == enemySnakeX && snakeY == enemySnakeY) {
      addScore(20);
      spawnEnemy();
    }

    for (i = 0; i < enemySnakeBody.length; i++) {
      if (snakeX == enemySnakeBody[i][0] && snakeY == enemySnakeBody[i][1]) {
        addScore(20);
        spawnEnemy();
      }
    }
  }
};

// This method is the main event loop of the game
const initGame = () => {
  let htmlMarkup = `<div class="food" style="grid-area: ${foodY}/ ${foodX}"></div>`;

  document.querySelector(".highScoreDisplay").textContent =
    "High Score: " + highScore;

  if (snakeX === foodX && snakeY === foodY) {
    eatFood();

    if (score == enemyThreshold) {
      spawnEnemy();
    }
  }

  if (score > doorThreshold) {
    htmlMarkup += `<div class="door" style="grid-area: ${doorA_Y}/ ${doorA_X}"></div>`;
    htmlMarkup += `<div class="door" style="grid-area: ${doorB_Y}/ ${doorB_X}"></div>`;

    // Snake enter door
    if (snakeX == doorA_X && snakeY == doorA_Y) {
      snakeX = doorB_X;
      snakeY = doorB_Y;
    } else if (snakeX == doorB_X && snakeY == doorB_Y) {
      snakeX = doorA_X;
      snakeY = doorA_Y;
    }
    if (score % 5 == 0) {
      randomizedDoor();
    }

    // enemy enter door
    if (enemySnakeX == doorA_X && enemySnakeY == doorA_Y) {
      enemySnakeX = doorB_X;
      enemySnakeY = doorB_Y;
    } else if (enemySnakeX == doorB_X && enemySnakeY == doorB_Y) {
      enemySnakeX = doorA_X;
      enemySnakeY = doorA_Y;
    }
  }

  updateSnakeLocation();

  // Move the snake to the location of the next frame
  snakeX += velocityX;
  snakeY += velocityY;

  // Check whether the snake hits the border
  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    gameOver = true;
    updateHighScore();
  }

  for (let i = 0; i < snakeBody.length; i++) {
    htmlMarkup += `<div class = "snakeBody" style = "grid-area: ${snakeBody[i][1]}/${snakeBody[i][0]}"></div>`;

    // Check whether the snake ate itself
    if (
      i != 0 &&
      snakeBody[0][1] === snakeBody[i][1] &&
      snakeBody[0][0] === snakeBody[i][0]
    ) {
      gameOver = true;
      updateHighScore();
    }
  }

  htmlMarkup += `<div class="snakeHead" style="grid-area: ${snakeY}/ ${snakeX}"></div>`;

  enemySnakeLogic();

  const enemySnakeHTML = () => {
    htmlMarkup += `<div class="enemySnake" style="grid-area: ${enemySnakeY}/ ${enemySnakeX}"></div>`;

    for (let i = 0; i < enemySnakeBody.length; i++) {
      if (enemySnakeBody[i][0] > 30 || enemySnakeBody[i][1] > 30) {
        break;
      }
      htmlMarkup += `<div class = "enemySnakeBody" style = "grid-area: ${enemySnakeBody[i][1]}/${enemySnakeBody[i][0]}"></div>`;
    }
  };
  enemySnakeHTML();

  if (gameOver) return handleGameOver();
  snakeGrid.innerHTML = htmlMarkup;
};

randomizedFood();
randomizedDoor();
setIntervalId = setInterval(initGame, 100);

document.addEventListener("keydown", changeDirection);
