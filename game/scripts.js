let username = "";

// Ask for username until they enter something
while (username === "" || username === null) {
  username = window.prompt('Enter your username');
}
// Show username in console log
console.log(`Hello ${username}`);

// Run the game code after the DOM is ready so the canvas element exists
document.addEventListener('DOMContentLoaded', function () {
  var canvas = document.getElementById('game');
  if (!canvas) {
    console.error('Canvas element with id "game" not found.');
    return;
  }
  var context = canvas.getContext('2d');

  var grid = 16;
  var count = 0;
  var running = false;
  var speed = 4; // default speed (frames per move)

  var snake = {
    x: 160,
    y: 160,
    dx: grid,
    dy: 0,
    cells: [],
    maxCells: 4
  };

  var apple = {
    x: 320,
    y: 320
  };

  // Reset game state to starting values
  function resetGame() {
    snake.x = 160;
    snake.y = 160;
    snake.cells = [];
    snake.maxCells = 4;
    snake.dx = grid;
    snake.dy = 0;

    apple.x = getRandomInt(0, 25) * grid;
    apple.y = getRandomInt(0, 25) * grid;
    running = false;
    showOverlay();
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function showOverlay() {
    document.getElementById('startOverlay').style.display = 'flex';
  }
  function hideOverlay() {
    document.getElementById('startOverlay').style.display = 'none';
  }

  function loop() {
    if (!running) return;
    requestAnimationFrame(loop);

    if (++count < speed) {
      return;
    }
    count = 0;

    context.clearRect(0, 0, canvas.width, canvas.height);
    // Draw white border inside the canvas for extra clarity
    context.strokeStyle = 'white';
    context.lineWidth = 4;
    context.strokeRect(0, 0, canvas.width, canvas.height);

    snake.x += snake.dx;
    snake.y += snake.dy;

    // If the snake hits any edge, reset the game and show overlay
    if (snake.x < 0 || snake.x >= canvas.width || snake.y < 0 || snake.y >= canvas.height) {
      resetGame();
      return;
    }

    snake.cells.unshift({ x: snake.x, y: snake.y });
    if (snake.cells.length > snake.maxCells) {
      snake.cells.pop();
    }

    context.fillStyle = 'red';
    context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

    context.fillStyle = 'green';
    snake.cells.forEach(function (cell, index) {
      context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

      if (cell.x === apple.x && cell.y === apple.y) {
        snake.maxCells++;
        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
      }

      for (var i = index + 1; i < snake.cells.length; i++) {
        if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
          resetGame();
          return;
        }
      }
    });
  }

  //  change direction by name so both keyboard and buttons use it
  function changeDirection(dir) {
    if (dir === 'left' && snake.dx === 0) {
      snake.dx = -grid; snake.dy = 0;
    } else if (dir === 'up' && snake.dy === 0) {
      snake.dy = -grid; snake.dx = 0;
    } else if (dir === 'right' && snake.dx === 0) {
      snake.dx = grid; snake.dy = 0;
    } else if (dir === 'down' && snake.dy === 0) {
      snake.dy = grid; snake.dx = 0;
    }
  }

  // Keyboard controls: arrow keys + WASD
  document.addEventListener('keydown', function (e) {
    if (!running) return;
    var key = e.key; // modern string key
    if (key === 'ArrowLeft' || key === 'a' || key === 'A') {
      changeDirection('left');
      e.preventDefault();
    } else if (key === 'ArrowUp' || key === 'w' || key === 'W') {
      changeDirection('up');
      e.preventDefault();
    } else if (key === 'ArrowRight' || key === 'd' || key === 'D') {
      changeDirection('right');
      e.preventDefault();
    } else if (key === 'ArrowDown' || key === 's' || key === 'S') {
      changeDirection('down');
      e.preventDefault();
    }
  });

  // On-screen buttons (touch / click)
  var controlButtons = document.querySelectorAll('.control-button');
  controlButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!running) return;
      var dir = btn.dataset.dir;
      changeDirection(dir);
    });
    // support touchstart for better mobile responsiveness
    btn.addEventListener('touchstart', function (ev) {
      if (!running) return;
      ev.preventDefault();
      var dir = btn.dataset.dir;
      changeDirection(dir);
    }, { passive: false });
  });

  // Speed selection logic
  var speedButtons = document.querySelectorAll('.speed-button');
  var speedMap = { slug: 10, worm: 6, python: 4, cobra: 2 };
  var selectedSpeed = 'worm';
  // handle clicks on speed buttons
  speedButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      speedButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedSpeed = btn.dataset.speed;
      speed = speedMap[selectedSpeed];
      // if user chooses a normal speed, ensure cobra is not highlighted
      var cobraBtn = document.getElementById('cobraButton');
      if (cobraBtn) cobraBtn.classList.remove('selected');
    });
  });
  // Set default selected
  speedButtons.forEach(function (btn) {
    if (btn.dataset.speed === selectedSpeed) btn.classList.add('selected');
  });

  // Cobra secret button (global, top-right of viewport)
  var cobraBtn = document.getElementById('cobraButton');
  if (cobraBtn) {
    cobraBtn.addEventListener('click', function () {
      // unselect other speed buttons
      speedButtons.forEach(b => b.classList.remove('selected'));
      // select cobra visually
      cobraBtn.classList.add('selected');
      selectedSpeed = 'cobra';
      speed = speedMap['cobra'];
    });
  }

  // Start button logic
  var startButton = document.getElementById('startButton');
  startButton.addEventListener('click', function () {
    hideOverlay();
    running = true;
    count = 0;
    requestAnimationFrame(loop);
  });

  // Show overlay on load
  showOverlay();
});