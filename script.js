const snakeGrid = document.querySelector(".snakeGrid");

let foodX, foodY;
let snakeX = 5,
  snakeY = 10;
let snakeBody = [];
let velocityX = 0,
  velocityY = 0;
let gameOver = false;
let setIntervalId;

const randomizedFood = () => {
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = () => {
  clearInterval(setIntervalId);
  alert("GAME OVER! Restart?");
  location.reload();
};

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

const initGame = () => {
  if (gameOver) return handleGameOver();
  let htmlMarkup = `<div class="food" style="grid-area: ${foodY}/ ${foodX}"></div>`;

  if (snakeX === foodX && snakeY === foodY) {
    console.log("1", snakeBody);
    randomizedFood();
    snakeBody.push([foodX, foodY]);
  }
  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }

  if (snakeBody.length >= 1) {
    snakeBody[0] = [snakeX, snakeY];
  }

  console.log(snakeBody);
  snakeX += velocityX;
  snakeY += velocityY;

  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    gameOver = true;
  }

  for (let i = 0; i < snakeBody.length; i++) {
    htmlMarkup += `<div class = "snakeBody" style = "grid-area: ${snakeBody[i][1]}/${snakeBody[i][0]}"></div>`;
    if (
      i !== 0 &&
      snakeBody[0][1] === snakeBody[i][1] &&
      snakeBody[0][0] === snakeBody[i][0]
    ) {
      gameOver = true;
    }
  }

  htmlMarkup += `<div class="snakeHead" style="grid-area: ${snakeY}/ ${snakeX}"></div>`;
  snakeGrid.innerHTML = htmlMarkup;
};

randomizedFood();
setIntervalId = setInterval(initGame, 100);

document.addEventListener("keydown", changeDirection);
