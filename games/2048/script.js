let grid = [];
let score = 0;
const gridSize = 4;

function initGame() {
    grid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
    score = 0;
    updateScore();
    addRandomTile();
    addRandomTile();
    updateGrid();
    document.querySelector('.game-message').style.display = 'none';
}

function addRandomTile() {
    let emptyCells = [];
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid[i][j] === 0) emptyCells.push({x: i, y: j});
        }
    }
    if (emptyCells.length > 0) {
        let cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[cell.x][cell.y] = Math.random() < 0.9 ? 2 : 4;
    }
}

function updateGrid() {
    const gridEl = document.getElementById('grid');
    gridEl.innerHTML = '';
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            if (grid[i][j] !== 0) {
                tile.classList.add(`tile-${grid[i][j]}`);
                tile.textContent = grid[i][j];
            }
            gridEl.appendChild(tile);
        }
    }
}

function slideRow(row) {
    let newRow = row.filter(val => val !== 0);
    for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
            newRow[i] *= 2;
            score += newRow[i];
            newRow[i + 1] = 0;
        }
    }
    newRow = newRow.filter(val => val !== 0);
    while (newRow.length < gridSize) newRow.push(0);
    return newRow;
}

function move(direction) {
    let moved = false;
    if (direction === 'left') {
        for (let i = 0; i < gridSize; i++) {
            let newRow = slideRow(grid[i]);
            if (newRow.join('') !== grid[i].join('')) moved = true;
            grid[i] = newRow;
        }
    } else if (direction === 'right') {
        for (let i = 0; i < gridSize; i++) {
            let newRow = slideRow(grid[i].reverse()).reverse();
            if (newRow.join('') !== grid[i].join('')) moved = true;
            grid[i] = newRow;
        }
    } else if (direction === 'up') {
        for (let j = 0; j < gridSize; j++) {
            let col = [grid[0][j], grid[1][j], grid[2][j], grid[3][j]];
            let newCol = slideRow(col);
            if (newCol.join('') !== col.join('')) moved = true;
            for (let i = 0; i < gridSize; i++) grid[i][j] = newCol[i];
        }
    } else if (direction === 'down') {
        for (let j = 0; j < gridSize; j++) {
            let col = [grid[0][j], grid[1][j], grid[2][j], grid[3][j]];
            let newCol = slideRow(col.reverse()).reverse();
            if (newCol.join('') !== col.join('')) moved = true;
            for (let i = 0; i < gridSize; i++) grid[i][j] = newCol[i];
        }
    }
    if (moved) {
        addRandomTile();
        updateGrid();
        updateScore();
        checkWin();
        checkGameOver();
    }
}

function updateScore() {
    document.getElementById('score').textContent = score;
}

function checkWin() {
    if (grid.flat().includes(2048)) {
        showMessage('You win! 🎉');
    }
}

function checkGameOver() {
    let hasEmpty = grid.flat().includes(0);
    let canMerge = false;
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (j < gridSize - 1 && grid[i][j] === grid[i][j + 1]) canMerge = true;
            if (i < gridSize - 1 && grid[i][j] === grid[i + 1][j]) canMerge = true;
        }
    }
    if (!hasEmpty && !canMerge) {
        showMessage('Game Over! 💀');
    }
}

function showMessage(text) {
    document.querySelector('.game-message p').textContent = text;
    document.querySelector('.game-message').style.display = 'flex';
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') move('left');
    if (e.key === 'ArrowRight') move('right');
    if (e.key === 'ArrowUp') move('up');
    if (e.key === 'ArrowDown') move('down');
});

// Touch/swipe support for mobile (optional enhancement)
let startX, startY;
document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});
document.addEventListener('touchend', (e) => {
    if (!startX || !startY) return;
    let deltaX = e.changedTouches[0].clientX - startX;
    let deltaY = e.changedTouches[0].clientY - startY;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) move('right');
        else move('left');
    } else {
        if (deltaY > 0) move('down');
        else move('up');
    }
    startX = startY = 0;
});

initGame(); // Start the game