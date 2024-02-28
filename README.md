# sNaKe

## Summary

sNaKe is a modern take on the classic Nokia game from 1997, Snake, bringing a fresh twist to the beloved retro experience. With intuitive controls and dynamic gameplay mechanics, the objective remains the same: grow your snake by consuming food while avoiding collisions with walls and your own tail.

## How to play the game

Objective: Grow your snake as long as possible!

Movement: Use the up, down, left, and right arrow keys to move the snake head in the corresponding direction. The snake will continuously move in the direction indicated until you change its course.

Food Collection: Direct the snake to consume salmon pink foods as they appear on the grid. Each food eaten will increment your score by one point and add a body to the snake. Aim to eat as many foods as possible to achieve a higher score.

![](https://github.com/snake/gifs/snakeeat.gif)

Door Mechanism: Keep an eye out for blue doors that may appear on the grid. When doors appear, guide the snake to enter one door to exit from the other door. This will transport the snake to a different location on the grid, potentially providing access to more food or bonuses.

Enemy Snake Encounter: Beware of enemy snakes that may appear during gameplay. They can enter doors and steal your food. When an enemy snake appears, maneuver your snake to consume it if your snake is longer than it. Eating an enemy snake will reward you with a significant point boost of 20 points. Enemy snake respawns each time to your snake's current length.

Score Keeping: Track your score at the top or bottom of the game screen. Each food eaten and enemy snake consumed will contribute to your total score. Strive to achieve the highest score possible within the game's duration. Highest score is recorded for each browser's session.

Game Over: The game ends when the snake collides with walls or its own tail. Avoid collisions to prolong your gameplay and maximize your score.

Enjoyment: Have fun exploring the game grid, collecting food, navigating through doors, and outsmarting enemy snakes. Embrace the challenge and excitement of the game while aiming for the top of the leaderboard.

## Getting Started

To run this application, download the GitHub zip file or clone the repository. Then open a browser window and within it open the index.html file in the directory of your application.

You can also play the game by clicking this link:
https://lekster18.github.io/snake/

## Tools used in this game

HTML
CSS
JavaScript

## Next Steps

Implement Enemy Snake Behavior:

Define the behavior of the enemy snake. It should move towards the player's snake with a certain speed.
Implement collision detection between the player's snake and the enemy snake. When they collide, trigger the game over state.

Enemy Snake Feeding Mechanism:

Program the enemy snake to prioritize moving towards and consuming food.
Define the conditions for the enemy snake to grow longer upon eating food.

Refactor Code with Classes:

Create a Snake class to encapsulate the behavior and attributes of the player's snake.
Implement methods within the Snake class to control movement, collision detection, and growth.
Create a Door class to represent the doors that appear on the game grid. Define methods to handle their appearance and functionality.
Develop a Food class to manage the generation, positioning, and consumption of food items on the grid.
Refactor existing code to instantiate objects from these classes, allowing for unlimited instances of snakes, doors, and food items.
