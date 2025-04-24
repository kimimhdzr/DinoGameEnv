// index.js

// Get the canvas and set up the 2D context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Import game objects
import Dino from "./js/dino.js";
import Ground from "./js/ground.js";
import Game from "./js/game.js";

// Initialize instances of game objects
const dino = new Dino(ctx);
const ground = new Ground(ctx);
const game = new Game(ctx);

// Set up the Game Variables
let gameStarted = false;
let score = 0;
let highScore = 0;
let hasShown500Popup = false;

let scoreHistory = JSON.parse(localStorage.getItem("scoreHistory")) || [];
const scoreHistoryList = document.getElementById("scoreHistoryList");

function renderScoreHistory() {
  scoreHistoryList.innerHTML = "";

  const ranks = ["🥇", "🥈", "🥉"]; // Emojis for top 3

  scoreHistory.forEach((entry, i) => {
    if (entry && entry.name && entry.score != null) {
      const rankDisplay = i < 3 ? ranks[i] : `#${i + 1}`; // Use emoji for top 3

      const li = document.createElement("li");
      li.innerHTML = `
        <span class="rank">${rankDisplay}</span>
        <span class="name">${entry.name}</span>
        <span class="points">${entry.score} pts</span>
      `;
      scoreHistoryList.appendChild(li);
    }
  });
}

let lastObstacleScore = 0;
let speed = 5;
let animationFrameId = null; // Add this to track animation frame

// Load high score from localStorage if it exists
if (localStorage.getItem("highScore")) {
  highScore = parseInt(localStorage.getItem("highScore"));
  document.getElementById("highScore").innerHTML = highScore;
}

// Event listener for game start and restart
addEventListener("keydown", function (event) {
  if (event.key === " " || event.key === "ArrowUp") {
    if (!gameStarted || game.gameOver) {
      resetGame();
    } else {
      dino.jump();
    }
  } else if (event.key === "ArrowDown") {
    dino.crouch(true);
  }
});

addEventListener("keyup", function (event) {
  if (event.key === "ArrowDown") {
    dino.crouch(false);
  }
});

function updateScore() {
  document.getElementById("score").innerHTML = Math.floor(score);
  document.getElementById("speedDisplay").innerHTML = speed.toFixed(3);

  if (Math.floor(score) > highScore) {
    highScore = Math.floor(score);
    localStorage.setItem("highScore", highScore);
    document.getElementById("highScore").innerHTML = highScore;
  }
}

function resetGame() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  game.reset();
  score = 0;
  lastObstacleScore = 0;
  speed = 7;
  dino.reset();
  gameStarted = true;
  hasShown500Popup = false;

  render();
}


function drawGameOver() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "48px Arial";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);

  ctx.font = "24px Arial";
  ctx.fillText(
    "Press SPACE to restart",
    canvas.width / 2,
    canvas.height / 2 + 40
  );
}

function drawStartScreen() {
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Press SPACE to start", canvas.width / 2, canvas.height / 2);
}

let nextMilestone = 200;

function showMilestonePopup(score) {
  const popup = document.getElementById("milestonePopup");

  if (score == 500) {
    popup.innerText = `🏆 You reached 500 points! Claim your stamp at our booth! 🎟️`;
  } else {
    popup.innerText = `🎉 You reached ${score} points!`;
  }

  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");
  }, 2000); // Show for 2 seconds
}

// Game render loop
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ground.render();
  dino.render();

  if (!gameStarted) {
    // game not started
    drawStartScreen();
  } else {
    if (!game.gameOver) {
      //game started and not over
      //every 20 score points, a new obstacle is spawned
      if (
        Math.floor(score) % 20 === 0 &&
        Math.floor(score) !== lastObstacleScore
      ) {
        game.spawnObstacle(speed, score);
        lastObstacleScore = Math.floor(score);
      }

      game.renderObstacles();
      game.updateObstacles();

      // Check for collisions
      if (game.checkCollision(dino)) {
        game.gameOver = true;
        drawGameOver();
      
        // Show name modal if game over and score > 0
        if (score > 0) {
          setTimeout(() => {
            document.getElementById("nameModal").style.display = "flex";
            document.getElementById("playerNameInput").focus();
          }, 500); // delay a bit for smoother transition
        }
      } else {
        // score increases
        // speed increase
        ground.update(speed);
        dino.update();
        score += 0.1;

        if (!hasShown500Popup && Math.floor(score) >= 500) {
          showMilestonePopup(500);
          hasShown500Popup = true;
        }

        if (Math.floor(score) >= nextMilestone) {
          showMilestonePopup(nextMilestone);
          nextMilestone += 200;
        }


        updateScore();
        speed += 0.001;
      }
    } else {
      // game started and iver
      game.renderObstacles(); // Keep rendering obstacles when game is over
      ground.render(); // Keep rendering ground
      drawGameOver();
    }
  }

  // Continue animation unless game is over
  if (!game.gameOver) {
    // if not game over, loop continues
    animationFrameId = requestAnimationFrame(render);
  }
}

// Initial render to show start screen
renderScoreHistory();
drawStartScreen();

// Button Event Listeners
document.getElementById("jumpBtn").addEventListener("click", () => {
  if (!gameStarted || game.gameOver) {
    resetGame();
  } else {
    dino.jump();
  }
});

document.getElementById("crouchBtn").addEventListener("mousedown", () => {
  if (gameStarted && !game.gameOver) {
    dino.crouch(true); // trigger crouch
  }
});

document.getElementById("crouchBtn").addEventListener("mouseup", () => {
  if (gameStarted && !game.gameOver) {
    dino.crouch(false); // stop crouching
  }
});

document.getElementById("saveNameBtn").addEventListener("click", () => {
  const playerName = document.getElementById("playerNameInput").value.trim();
  if (playerName) {
    scoreHistory.push({ name: playerName, score: Math.floor(score) });
    scoreHistory.sort((a, b) => b.score - a.score);
    scoreHistory = scoreHistory.slice(0, 10);
    localStorage.setItem("scoreHistory", JSON.stringify(scoreHistory));
    renderScoreHistory();

    document.getElementById("nameModal").style.display = "none";
    document.getElementById("playerNameInput").value = "";
    resetGame(); // Now reset the game
  }
});

document.getElementById("cancelNameBtn").addEventListener("click", () => {
  document.getElementById("nameModal").style.display = "none";
  document.getElementById("playerNameInput").value = "";
  resetGame(); // Just start again, no save
});
