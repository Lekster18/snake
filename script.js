//TODO: Update README.md

const snakeGrid = document.querySelector(".snakeGrid");

const doorThreshold = 0;
const enemyThreshold = 1;
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
let highScore = localStorage.getItem("highScore");

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

// This method handles what happen when snake eats
const eatFood = () => {
  // Update Score
  score += 1;
  document.querySelector(".scoreDisplay").textContent = "Score: " + score;
  if (score > highScore) {
    updateHighScore();
  }

  // Recreate Food
  randomizedFood();

  // Add Body
  snakeBody.push([foodX, foodY]);
};

// This method is the main event loop of the game
const initGame = () => {
  let htmlMarkup = `<div class="food" style="grid-area: ${foodY}/ ${foodX}"></div>`;
  document.querySelector(".highScoreDisplay").textContent =
    "High Score: " + highScore;
  if (snakeX === foodX && snakeY === foodY) {
    //TODO: After we eat, if score is more than X, we expand the map
    // AKA: Change HTML Style to be bigger, also change gridSize
    // Possible is that we want the map to expand evenly so we need to change the location of all the stuff inside
    eatFood();
  }

  if (score > doorThreshold) {
    htmlMarkup += `<div class="door" style="grid-area: ${doorA_Y}/ ${doorA_X}"></div>`;
    htmlMarkup += `<div class="door" style="grid-area: ${doorB_Y}/ ${doorB_X}"></div>`;
    // console.log(
    //   snakeX,
    //   snakeY,
    //   "||",
    //   doorA_X,
    //   doorA_Y,
    //   "||",
    //   doorB_X,
    //   doorB_Y,
    //   snakeX == doorA_X && snakeY == doorA_Y
    // );
    if (snakeX == doorA_X && snakeY == doorA_Y) {
      snakeX = doorB_X;
      snakeY = doorB_Y;
      // console.log("hit door a");
    } else if (snakeX == doorB_X && snakeY == doorB_Y) {
      snakeX = doorA_X;
      snakeY = doorA_Y;
    }
    if (score % 5 == 0) {
      randomizedDoor();
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

  // TODO: if score more than enemyThreshold, move enemy snake (we init a position at the very beginning)
  // we can use a randomize the direction the enemy moves at the start
  // We can then add the code to move the enemy towards our snake always (can use the direction taht would bring the enemy head closer to any part of our snake)
  // Check if either we or enemy touch each other body if so eat, we can add condition on size of snake; only bigger snake can eat small snakes
  // We can also make it so that enemy can eat food too so it can get longer

  const enemySnake = () => {
    let enemySnakeBody = `<div class="enemySnake" style="grid-area: 13/22,14/22,15/22,16/22"></div>`;
  };

  if (gameOver) return handleGameOver();
  snakeGrid.innerHTML = htmlMarkup;
};

randomizedFood();
randomizedDoor();
// enemySnake();
setIntervalId = setInterval(initGame, 100);

document.addEventListener("keydown", changeDirection);
