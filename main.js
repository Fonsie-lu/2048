let grid;
let grid_new;
let score = 0;
let scoreText;
let gameState;

function setup() {
  createCanvas(400, 400);
  grid = blankGrid();
  grid_new = blankGrid();
  addNumber();
  addNumber();
  scoreText = createP(score).style("font-size", "32pt");
  gameState = createP(score).style("font-size", "32pt");
  noLoop();
  updateCanvas();
}

function flipGrid(grid) {
  for (let i = 0; i < 4; i++) {
    grid[i].reverse();
  }
  return grid;
}

function rotateGrid(grid) {
  let newGrid = blankGrid();
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      newGrid[i][j] = grid[j][i];
    }
  }
  return newGrid;
}

function keyPressed() {
  let played = false;
  let flipped = false;
  let rotated = false;
  if (keyCode === DOWN_ARROW) {
    played = true;
  } else if (keyCode === UP_ARROW) {
    grid = flipGrid(grid);
    flipped = true;
    played = true;
  } else if (keyCode === RIGHT_ARROW) {
    grid = rotateGrid(grid);
    rotated = true;
    played = true;
  } else if (keyCode === LEFT_ARROW) {
    grid = rotateGrid(grid);
    grid = flipGrid(grid);
    rotated = true;
    flipped = true;
    played = true;
  }

  if (played) {
    let past = copyGrid(grid);
    for (let i = 0; i < 4; i++) {
      grid[i] = operate(grid[i]);
    }

    let changed = compare(past, grid);
    if (flipped) {
      flipGrid(grid);
    }
    if (rotated) {
      grid = rotateGrid(grid);
      grid = rotateGrid(grid);
      grid = rotateGrid(grid);
    }
    if (changed) {
      addNumber();
      updateCanvas();
    }
  } else {
    console.log("not played");
  }
  if (checkGameOver()) {
    gameState.html("Game Over");
  }
  if (gameWon()) {
    gameState.html("Game Won");
  }
}

function operate(row) {
  row = slide(row);
  row = combine(row);
  row = slide(row);
  return row;
}

function blankGrid() {
  return [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
}

function copyGrid(grid) {
  let extra = blankGrid();
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      extra[i][j] = grid[i][j];
    }
  }
  return extra;
}

function compare(a, b) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (a[i][j] !== b[i][j]) {
        return true;
      }
    }
  }
  return false;
}

function combine(row) {
  for (let i = 3; i >= 0; i--) {
    let a = row[i];
    let b = row[i - 1];
    if (a === b) {
      row[i] = 2 * a;
      row[i - 1] = 0;
      score += row[i];
    }
  }
  return row;
}

function slide(row) {
  let arr = row.filter(val => val);
  let missing = 4 - arr.length;
  let zeros = Array(missing).fill(0);
  arr = zeros.concat(arr);
  return arr;
}

function updateCanvas() {
  background(240);
  scoreText.html(" Score: " + score);
  gameState.html("");
  drawGrid();
}

function drawGrid() {
  let w = 100;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      noFill();
      let val = grid[i][j];
      let s = val.toString();
      if (grid_new[i][j] === 1) {
        strokeWeight(3);
        grid_new[i][j] = 0;
      } else {
        strokeWeight(0);
      }
      stroke(0);
      if (val != 0) {
        fill(colorsSizes[s].color);
      } else {
        noFill();
      }
      rect(i * w, j * w, w, w, 20);
      if (val !== 0) {
        textAlign(CENTER, CENTER);
        noStroke();
        fill(0);
        textSize(colorsSizes[s].size);
        noStroke();
        text(val, i * w + w / 2, j * w + w / 2);
      }
    }
  }
}

function addNumber() {
  let options = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) {
        options.push({ x: i, y: j });
      }
    }
  }
  if (options.length > 0) {
    let spot = random(options);
    let r = random(1);
    grid[spot.x][spot.y] = r > 0.2 ? 2 : 4;
    grid_new[spot.x][spot.y] = 1;
  }
}
