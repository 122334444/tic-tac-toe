document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const turnInfo = document.getElementById('turn-info');
    const timerElement = document.getElementById('time-left');
    const restartButton = document.getElementById('restart');

    let size = 3;
    let cells;
    let currentPlayer = 'X';
    let timeLeft = 10;
    let timer;

    function createGrid(size) {
        grid.innerHTML = '';
        grid.style.gridTemplateColumns = `repeat(${size}, 60px)`;
        cells = Array.from({ length: size * size }, (_, i) => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            cell.addEventListener('click', handleMove);
            grid.appendChild(cell);
            return cell;
        });
    }

    function handleMove(event) {
        const cell = event.target;
        if (cell.textContent !== '') return;

        cell.textContent = currentPlayer;
        if (checkWin()) {
            alert(`Player ${currentPlayer} wins!`);
            clearInterval(timer);
            return;
        } else if (cells.every(cell => cell.textContent !== '')) {
            alert('It\'s a draw!');
            clearInterval(timer);
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        turnInfo.textContent = `Turn: Player ${currentPlayer}`;
        resetTimer();
    }

    function checkWin() {
        const lines = [
            // Rows
            ...Array(size).fill().map((_, i) => Array.from({ length: size }, (_, j) => i * size + j)),
            // Columns
            ...Array(size).fill().map((_, i) => Array.from({ length: size }, (_, j) => j * size + i)),
            // Diagonals
            Array.from({ length: size }, (_, i) => i * (size + 1)),
            Array.from({ length: size }, (_, i) => (i + 1) * (size - 1))
        ];

        return lines.some(line => line.every(index => cells[index].textContent === currentPlayer));
    }

    function resetTimer() {
        clearInterval(timer);
        timeLeft = 10;
        timerElement.textContent = timeLeft;
        timer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;
            if (timeLeft === 0) {
                alert(`Player ${currentPlayer} ran out of time!`);
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                turnInfo.textContent = `Turn: Player ${currentPlayer}`;
                resetTimer();
            }
        }, 1000);
    }

    

    restartButton.addEventListener('click', () => {
        currentPlayer = 'X';
        turnInfo.textContent = `Turn: Player ${currentPlayer}`;
        createGrid(size);
        resetTimer();
    });

    createGrid(size);
    resetTimer();
});


document.body.insertBefore(gridSizeButtons, document.getElementById('game-container'));

gridSizeButtons.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
        size = parseInt(event.target.dataset.size);
        currentPlayer = 'X';
        turnInfo.textContent = `Turn: Player ${currentPlayer}`;
        createGrid(size);
        resetTimer();
    }
});