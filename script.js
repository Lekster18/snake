const snakeGrid = document.querySelector(".snakeGrid");
const doorThreshold = 2;
const gridSize = 30;

let foodX, foodY;
let doorA_X, doorA_Y;
let doorB_X, doorB_Y;
let snakeX = 5,
  snakeY = 10;
let snakeBody = [];
let velocityX = 0,
  velocityY = 0;
let gameOver = false;
let setIntervalId;
let score = 0;
let highScore = 0;

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
    foodX == doorA_X &&
    foodY == doorA_Y &&
    foodX == doorB_X &&
    foodY == doorB_Y
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
  // TODO: Currently this can run faster than the game loop so we can eat ourselves still
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

// This method handles what happen when snake eats
const eatFood = () => {
  // Update Score
  score += 1;
  document.querySelector(".scoreDisplay").textContent = "Score: " + score;

  // Recreate Food
  randomizedFood();

  // Add Body
  snakeBody.push([foodX, foodY]);
};

// This method is the main event loop of the game
const initGame = () => {
  let htmlMarkup = `<div class="food" style="grid-area: ${foodY}/ ${foodX}"></div>`;

  if (snakeX === foodX && snakeY === foodY) {
    eatFood();
  }

  if (score > doorThreshold) {
    htmlMarkup += `<div class="door" style="grid-area: ${doorA_X}/ ${doorA_Y}"></div>`;
    htmlMarkup += `<div class="door" style="grid-area: ${doorB_X}/ ${doorB_Y}"></div>`;
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
  if (gameOver) return handleGameOver();
  snakeGrid.innerHTML = htmlMarkup;
};

randomizedFood();
randomizedDoor();
setIntervalId = setInterval(initGame, 100);

document.addEventListener("keydown", changeDirection);
