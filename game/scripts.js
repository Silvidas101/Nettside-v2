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

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function loop() {
    requestAnimationFrame(loop);

    if (++count < 4) {
      return;
    }
    count = 0;

    context.clearRect(0, 0, canvas.width, canvas.height);

    snake.x += snake.dx;
    snake.y += snake.dy;

    if (snake.x < 0) {
      snake.x = canvas.width - grid;
    } else if (snake.x >= canvas.width) {
      snake.x = 0;
    }

    if (snake.y < 0) {
      snake.y = canvas.height - grid;
    } else if (snake.y >= canvas.height) {
      snake.y = 0;
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
          snake.x = 160;
          snake.y = 160;
          snake.cells = [];
          snake.maxCells = 4;
          snake.dx = grid;
          snake.dy = 0;

          apple.x = getRandomInt(0, 25) * grid;
          apple.y = getRandomInt(0, 25) * grid;
        }
      }
    });
  }

  // Helper: change direction by name so both keyboard and buttons use it
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
      var dir = btn.dataset.dir;
      changeDirection(dir);
    });
    // support touchstart for better mobile responsiveness
    btn.addEventListener('touchstart', function (ev) {
      ev.preventDefault();
      var dir = btn.dataset.dir;
      changeDirection(dir);
    }, { passive: false });
  });

  requestAnimationFrame(loop);
});