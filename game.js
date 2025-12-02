// Animal-themed Lianliankan Game
class LianliankanGame {
    constructor() {
        // Animal emojis for tiles
        this.animals = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦆', '🦉', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐢', '🦀', '🐙', '🦑', '🦐', '🐠', '🐟', '🐡', '🦈', '🐬', '🐳', '🐊', '🦎', '🐍', '🦕', '🦖', '🐘', '🦏', '🦛', '🦒', '🐆', '🐅', '🐃'];
        
        this.gameBoard = null;
        this.tiles = [];
        this.selectedTiles = [];
        this.matchedPairs = 0;
        this.score = 0;
        this.shuffleCount = 3;
        this.hintCount = 3;
        this.timerInterval = null;
        this.timeLeft = 0;
        this.totalTime = 0;
        this.isPaused = false;
        this.difficulty = 'easy';
        this.gridSize = { rows: 6, cols: 6 };
        
        this.init();
    }
    
    init() {
        // Screen elements
        this.startScreen = document.getElementById('start-screen');
        this.gameScreen = document.getElementById('game-screen');
        this.gameoverScreen = document.getElementById('gameover-screen');
        
        // Game elements
        this.gameBoard = document.getElementById('game-board');
        this.timerBar = document.getElementById('timer-bar');
        this.timerText = document.getElementById('timer-text');
        this.scoreElement = document.getElementById('score');
        this.pairsLeftElement = document.getElementById('pairs-left');
        this.lineCanvas = document.getElementById('line-canvas');
        
        // Tool buttons
        this.shuffleBtn = document.getElementById('shuffle-btn');
        this.hintBtn = document.getElementById('hint-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.shuffleCountElement = document.getElementById('shuffle-count');
        this.hintCountElement = document.getElementById('hint-count');
        
        // Difficulty buttons
        document.querySelectorAll('.difficulty-btn[data-level]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const level = e.currentTarget.dataset.level;
                this.startGame(level);
            });
        });
        
        // Tool button listeners
        this.shuffleBtn.addEventListener('click', () => this.shuffle());
        this.hintBtn.addEventListener('click', () => this.showHint());
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        
        // Restart button
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.showScreen('start');
        });
    }
    
    startGame(difficulty) {
        this.difficulty = difficulty;
        
        // Set grid size based on difficulty
        switch(difficulty) {
            case 'easy':
                this.gridSize = { rows: 6, cols: 6 };
                this.totalTime = 180; // 3 minutes
                break;
            case 'medium':
                this.gridSize = { rows: 8, cols: 8 };
                this.totalTime = 300; // 5 minutes
                break;
            case 'hard':
                this.gridSize = { rows: 10, cols: 10 };
                this.totalTime = 480; // 8 minutes
                break;
        }
        
        // Reset game state
        this.tiles = [];
        this.selectedTiles = [];
        this.matchedPairs = 0;
        this.score = 0;
        this.shuffleCount = 3;
        this.hintCount = 3;
        this.timeLeft = this.totalTime;
        this.isPaused = false;
        
        // Update UI
        this.shuffleCountElement.textContent = this.shuffleCount;
        this.hintCountElement.textContent = this.hintCount;
        this.scoreElement.textContent = this.score;
        
        this.createBoard();
        this.showScreen('game');
        this.startTimer();
    }
    
    createBoard() {
        this.gameBoard.innerHTML = '';
        this.gameBoard.style.gridTemplateColumns = `repeat(${this.gridSize.cols}, 1fr)`;
        
        const totalTiles = this.gridSize.rows * this.gridSize.cols;
        const pairsNeeded = totalTiles / 2;
        
        // Select random animals for this game
        const selectedAnimals = this.animals.slice(0, pairsNeeded);
        
        // Create pairs
        const tileValues = [...selectedAnimals, ...selectedAnimals];
        
        // Shuffle tiles
        this.shuffleArray(tileValues);
        
        // Create tile elements
        this.tiles = [];
        tileValues.forEach((animal, index) => {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.textContent = animal;
            tile.dataset.value = animal;
            tile.dataset.index = index;
            tile.dataset.row = Math.floor(index / this.gridSize.cols);
            tile.dataset.col = index % this.gridSize.cols;
            
            tile.addEventListener('click', () => this.handleTileClick(tile));
            
            this.gameBoard.appendChild(tile);
            this.tiles.push(tile);
        });
        
        this.pairsLeftElement.textContent = pairsNeeded;
    }
    
    handleTileClick(tile) {
        if (this.isPaused) return;
        if (tile.classList.contains('matched')) return;
        if (tile.classList.contains('selected')) return;
        if (this.selectedTiles.length >= 2) return;
        
        // Select tile
        tile.classList.add('selected');
        this.selectedTiles.push(tile);
        
        // Check if two tiles are selected
        if (this.selectedTiles.length === 2) {
            setTimeout(() => this.checkMatch(), 300);
        }
    }
    
    checkMatch() {
        const [tile1, tile2] = this.selectedTiles;
        
        if (tile1.dataset.value === tile2.dataset.value) {
            // Check if tiles can be connected
            if (this.canConnect(tile1, tile2)) {
                this.handleMatch(tile1, tile2);
            } else {
                this.handleMismatch();
            }
        } else {
            this.handleMismatch();
        }
    }
    
    canConnect(tile1, tile2) {
        const row1 = parseInt(tile1.dataset.row);
        const col1 = parseInt(tile1.dataset.col);
        const row2 = parseInt(tile2.dataset.row);
        const col2 = parseInt(tile2.dataset.col);
        
        // Try to find a path with at most 2 turns
        const path = this.findPath(row1, col1, row2, col2);
        
        if (path) {
            // Draw connection line
            this.drawConnectionLine(path);
            return true;
        }
        
        return false;
    }
    
    findPath(row1, col1, row2, col2) {
        // BFS to find path with at most 2 turns
        const queue = [[row1, col1, 0, -1, [{row: row1, col: col1}]]]; // row, col, turns, lastDir, path
        const visited = new Set([`${row1},${col1}`]);
        
        while (queue.length > 0) {
            const [row, col, turns, lastDir, path] = queue.shift();
            
            // Check if reached destination
            if (row === row2 && col === col2) {
                return path;
            }
            
            // Try all 4 directions
            const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // right, down, left, up
            
            for (let i = 0; i < directions.length; i++) {
                const [dr, dc] = directions[i];
                const newRow = row + dr;
                const newCol = col + dc;
                
                // Check bounds (allow one step outside the grid)
                if (newRow < -1 || newRow > this.gridSize.rows || 
                    newCol < -1 || newCol > this.gridSize.cols) {
                    continue;
                }
                
                const key = `${newRow},${newCol}`;
                if (visited.has(key)) continue;
                
                // Check if this position is free or is the target
                const isTarget = (newRow === row2 && newCol === col2);
                const isOutside = (newRow === -1 || newRow === this.gridSize.rows || 
                                  newCol === -1 || newCol === this.gridSize.cols);
                const isEmpty = !isOutside && this.isTileEmpty(newRow, newCol);
                
                if (!isTarget && !isOutside && !isEmpty) {
                    continue;
                }
                
                // Calculate new turn count
                const newDir = i;
                const newTurns = (lastDir === -1 || lastDir === newDir) ? turns : turns + 1;
                
                // Only allow paths with at most 2 turns
                if (newTurns > 2) continue;
                
                visited.add(key);
                queue.push([newRow, newCol, newTurns, newDir, [...path, {row: newRow, col: newCol}]]);
            }
        }
        
        return null;
    }
    
    isTileEmpty(row, col) {
        const tile = this.tiles.find(t => 
            parseInt(t.dataset.row) === row && 
            parseInt(t.dataset.col) === col
        );
        return !tile || tile.classList.contains('matched');
    }
    
    drawConnectionLine(path) {
        // Clear previous lines
        this.lineCanvas.innerHTML = '';
        
        // Get board position
        const boardRect = this.gameBoard.getBoundingClientRect();
        const canvasRect = this.gameScreen.getBoundingClientRect();
        
        // Calculate tile size
        const tileWidth = boardRect.width / this.gridSize.cols;
        const tileHeight = boardRect.height / this.gridSize.rows;
        
        // Create polyline
        const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        
        const points = path.map(point => {
            const x = boardRect.left - canvasRect.left + (point.col + 0.5) * tileWidth;
            const y = boardRect.top - canvasRect.top + (point.row + 0.5) * tileHeight;
            return `${x},${y}`;
        }).join(' ');
        
        polyline.setAttribute('points', points);
        polyline.setAttribute('stroke', '#4CAF50');
        polyline.setAttribute('stroke-width', '4');
        polyline.setAttribute('fill', 'none');
        polyline.setAttribute('stroke-linecap', 'round');
        polyline.setAttribute('stroke-linejoin', 'round');
        
        this.lineCanvas.appendChild(polyline);
        
        // Remove line after animation
        setTimeout(() => {
            this.lineCanvas.innerHTML = '';
        }, 500);
    }
    
    handleMatch(tile1, tile2) {
        // Mark as matched
        tile1.classList.remove('selected');
        tile2.classList.remove('selected');
        tile1.classList.add('matched');
        tile2.classList.add('matched');
        
        // Update score
        this.matchedPairs++;
        this.score += 100;
        this.scoreElement.textContent = this.score;
        this.pairsLeftElement.textContent = (this.tiles.length / 2) - this.matchedPairs;
        
        // Clear selection
        this.selectedTiles = [];
        
        // Check if game is won
        if (this.matchedPairs === this.tiles.length / 2) {
            setTimeout(() => this.gameWon(), 600);
        }
    }
    
    handleMismatch() {
        // Shake tiles
        this.selectedTiles.forEach(tile => {
            tile.classList.add('shake');
            setTimeout(() => {
                tile.classList.remove('shake');
                tile.classList.remove('selected');
            }, 500);
        });
        
        this.selectedTiles = [];
    }
    
    shuffle() {
        if (this.shuffleCount <= 0) return;
        if (this.isPaused) return;
        
        this.shuffleCount--;
        this.shuffleCountElement.textContent = this.shuffleCount;
        
        if (this.shuffleCount === 0) {
            this.shuffleBtn.disabled = true;
        }
        
        // Get all unmatched tiles
        const unmatchedTiles = this.tiles.filter(tile => !tile.classList.contains('matched'));
        const values = unmatchedTiles.map(tile => tile.dataset.value);
        
        // Shuffle values
        this.shuffleArray(values);
        
        // Reassign values
        unmatchedTiles.forEach((tile, index) => {
            tile.textContent = values[index];
            tile.dataset.value = values[index];
        });
        
        // Clear selection
        this.selectedTiles.forEach(tile => tile.classList.remove('selected'));
        this.selectedTiles = [];
    }
    
    showHint() {
        if (this.hintCount <= 0) return;
        if (this.isPaused) return;
        
        this.hintCount--;
        this.hintCountElement.textContent = this.hintCount;
        
        if (this.hintCount === 0) {
            this.hintBtn.disabled = true;
        }
        
        // Find a matching pair
        const unmatchedTiles = this.tiles.filter(tile => !tile.classList.contains('matched'));
        
        for (let i = 0; i < unmatchedTiles.length; i++) {
            for (let j = i + 1; j < unmatchedTiles.length; j++) {
                const tile1 = unmatchedTiles[i];
                const tile2 = unmatchedTiles[j];
                
                if (tile1.dataset.value === tile2.dataset.value && this.canConnectForHint(tile1, tile2)) {
                    // Highlight these tiles
                    tile1.classList.add('hint');
                    tile2.classList.add('hint');
                    
                    setTimeout(() => {
                        tile1.classList.remove('hint');
                        tile2.classList.remove('hint');
                    }, 2000);
                    
                    return;
                }
            }
        }
    }
    
    canConnectForHint(tile1, tile2) {
        const row1 = parseInt(tile1.dataset.row);
        const col1 = parseInt(tile1.dataset.col);
        const row2 = parseInt(tile2.dataset.row);
        const col2 = parseInt(tile2.dataset.col);
        
        return this.findPath(row1, col1, row2, col2) !== null;
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            this.pauseBtn.innerHTML = '<span class="emoji">▶️</span><span class="tool-text">继续</span>';
            clearInterval(this.timerInterval);
            this.gameBoard.style.opacity = '0.5';
            this.gameBoard.style.pointerEvents = 'none';
        } else {
            this.pauseBtn.innerHTML = '<span class="emoji">⏸️</span><span class="tool-text">暂停</span>';
            this.startTimer();
            this.gameBoard.style.opacity = '1';
            this.gameBoard.style.pointerEvents = 'auto';
        }
    }
    
    startTimer() {
        clearInterval(this.timerInterval);
        
        this.timerInterval = setInterval(() => {
            if (this.isPaused) return;
            
            this.timeLeft--;
            
            const minutes = Math.floor(this.timeLeft / 60);
            const seconds = this.timeLeft % 60;
            this.timerText.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            // Update timer bar
            const percentage = (this.timeLeft / this.totalTime) * 100;
            this.timerBar.style.width = percentage + '%';
            
            // Change color based on time left
            this.timerBar.classList.remove('warning', 'danger');
            if (percentage < 30) {
                this.timerBar.classList.add('danger');
            } else if (percentage < 50) {
                this.timerBar.classList.add('warning');
            }
            
            // Check if time is up
            if (this.timeLeft <= 0) {
                this.gameOver();
            }
        }, 1000);
    }
    
    gameWon() {
        clearInterval(this.timerInterval);
        
        const timeTaken = this.totalTime - this.timeLeft;
        const minutes = Math.floor(timeTaken / 60);
        const seconds = timeTaken % 60;
        
        document.getElementById('result-title').textContent = '🎉 恭喜胜利！ Victory! 🎉';
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('final-time').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        this.showScreen('gameover');
    }
    
    gameOver() {
        clearInterval(this.timerInterval);
        
        const timeTaken = this.totalTime - this.timeLeft;
        const minutes = Math.floor(timeTaken / 60);
        const seconds = timeTaken % 60;
        
        document.getElementById('result-title').textContent = '⏰ 时间到！ Time Up! ⏰';
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('final-time').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        this.showScreen('gameover');
    }
    
    showScreen(screen) {
        this.startScreen.classList.remove('active');
        this.gameScreen.classList.remove('active');
        this.gameoverScreen.classList.remove('active');
        
        switch(screen) {
            case 'start':
                this.startScreen.classList.add('active');
                break;
            case 'game':
                this.gameScreen.classList.add('active');
                break;
            case 'gameover':
                this.gameoverScreen.classList.add('active');
                break;
        }
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new LianliankanGame();
});
