// オセロの盤の状態を表す2次元配列
var boardState = [
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', 'W', 'B', '', '', ''],
    ['', '', '', 'B', 'W', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '']
];

// 現在のプレイヤーを表す変数
var currentPlayer = 'B';

// 前回の盤面の状態を保持する変数（アンドゥ機能用）
var previousBoardState = null;

// ゲームログを格納する配列
var logs = [];
var maxLogs = 20;

// 盤面を表示する関数
function drawBoard() {
    var board = document.querySelector('.board');
    board.innerHTML = '';

    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            var cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = i;
            cell.dataset.col = j;

            // セルの背景色を設定
            if (boardState[i][j] === 'W') {
                cell.style.backgroundColor = 'white';
            } else if (boardState[i][j] === 'B') {
                cell.style.backgroundColor = 'black';
            }

            cell.addEventListener('click', handleCellClick);

            board.appendChild(cell);
        }
    }
}

// セルがクリックされたときの処理
function handleCellClick(event) {
    var row = parseInt(event.target.dataset.row);
    var col = parseInt(event.target.dataset.col);

    if (isValidMove(row, col)) {
        previousBoardState = JSON.parse(JSON.stringify(boardState));

        boardState[row][col] = currentPlayer;
        flipStones(row, col);
        currentPlayer = currentPlayer === 'B' ? 'W' : 'B';

        drawBoard();
        updateScore();
        updateTurn();

        if (isGameOver()) {
            var winner = getWinner();
            showWinner(winner);
        }
    }
}


// 駒をひっくり返す関数
function flipStones(row, col) {
    // 各方向のベクトル
    var directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1], [1, 0],  [1, 1]
    ];

    for (var i = 0; i < directions.length; i++) {
        var dx = directions[i][0];
        var dy = directions[i][1];

        var x = row + dx;
        var y = col + dy;

        if (isOnBoard(x, y) && boardState[x][y] !== currentPlayer && boardState[x][y] !== '') {
            var stonesToFlip = [];
            while (isOnBoard(x, y) && boardState[x][y] !== '') {
                stonesToFlip.push({ row: x, col: y });
                x += dx;
                y += dy;
                if (isOnBoard(x, y) && boardState[x][y] === currentPlayer) {
                    for (var j = 0; j < stonesToFlip.length; j++) {
                        var stoneRow = stonesToFlip[j].row;
                        var stoneCol = stonesToFlip[j].col;
                        boardState[stoneRow][stoneCol] = currentPlayer;
                    }
                    break;
                }
            }
        }
    }
}

// 盤上の指定した位置が範囲内にあるかを判定する関数
function isOnBoard(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}

// 有効な着手かどうかを判定する関数
function isValidMove(row, col) {
    if (boardState[row][col] !== '') {
        return false;
    }

    var directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
    ];

    for (var i = 0; i < directions.length; i++) {
        var dx = directions[i][0];
        var dy = directions[i][1];

        var x = row + dx;
        var y = col + dy;

        if (isOnBoard(x, y) && boardState[x][y] !== currentPlayer && boardState[x][y] !== '') {
            while (isOnBoard(x, y) && boardState[x][y] !== '') {
                x += dx;
                y += dy;
                if (isOnBoard(x, y) && boardState[x][y] === currentPlayer) {
                    return true;
                }
            }
        }
    }

    return false;
}

// 有効な着手のリストを取得する関数
function getValidMoves() {
    var moves = [];

    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            if (isValidMove(i, j)) {
                moves.push({ row: i, col: j });
            }
        }
    }

    return moves;
}

// 画面を更新して有効な着手をハイライトする関数
function showHint() {
    var hints = getValidMoves();
    highlightCells(hints);
}

// セルをハイライトする関数
function highlightCells(cells) {
    var board = document.querySelector('.board');

    for (var i = 0; i < cells.length; i++) {
        var row = cells[i].row;
        var col = cells[i].col;

        var cell = board.querySelector('[data-row="' + row + '"][data-col="' + col + '"]');
        cell.style.backgroundColor = 'yellow';
    }
}

// ハイライトを解除する関数
function removeCellHighlights() {
    var cells = document.querySelectorAll('.cell');
    for (var i = 0; i < cells.length; i++) {
        cells[i].style.backgroundColor = '#228B22';
    }
}

// スコアを更新する関数
function updateScore() {
    var blackScore = 0;
    var whiteScore = 0;

    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            if (boardState[i][j] === 'B') {
                blackScore++;
            } else if (boardState[i][j] === 'W') {
                whiteScore++;
            }
        }
    }

    var scoreElement = document.getElementById('score');
    scoreElement.innerHTML = 'Black: ' + blackScore + ', White: ' + whiteScore;
}

// ターン表示を更新する関数
function updateTurn() {
    var turnElement = document.getElementById('turn');
    turnElement.textContent = 'Current Turn: ' + (currentPlayer === 'B' ? 'Black' : 'White');
}

// ゲーム終了かどうかを判定する関数
function isGameOver() {
    var moves = getValidMoves();
    if (moves.length === 0) {
        // 連続でパスの場合、盤上の駒の数で勝敗を判定
        var blackCount = 0;
        var whiteCount = 0;
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                if (boardState[i][j] === 'B') {
                    blackCount++;
                } else if (boardState[i][j] === 'W') {
                    whiteCount++;
                }
            }
        }
        if (blackCount > whiteCount) {
            return 'B';
        } else if (whiteCount > blackCount) {
            return 'W';
        } else {
            return 'Tie';
        }
    }
    return false;
}

// 勝者を判定する関数
function getWinner() {
    var blackScore = 0;
    var whiteScore = 0;

    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            if (boardState[i][j] === 'B') {
                blackScore++;
            } else if (boardState[i][j] === 'W') {
                whiteScore++;
            }
        }
    }

    if (blackScore > whiteScore) {
        return 'Black';
    } else if (whiteScore > blackScore) {
        return 'White';
    } else {
        return 'Tie';
    }
}

// 勝者を表示する関数
function showWinner(winner) {
    var winnerElement = document.getElementById('winner');
    if (winner === 'Tie') {
        winnerElement.innerHTML = 'It\'s a tie!';
    } else {
        winnerElement.innerHTML = 'The winner is: ' + winner;
    }
}

// メニューバー
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menu-toggle");
    const menuBar = document.getElementById("menu-bar");

    menuToggle.addEventListener("click", function () {
        menuBar.classList.toggle("show-menu");
        // メニューバーが表示されている間、三本線のボタンを非表示にする
        menuToggle.style.display = menuBar.classList.contains("show-menu") ? "none" : "block";
    });

    // メニューバー以外の場所をクリックしたときにメニューを非表示にする
    document.addEventListener("click", function (event) {
        if (!menuBar.contains(event.target) && event.target !== menuToggle) {
            menuBar.classList.remove("show-menu");
            // メニューバーが非表示になるとき、三本線のボタンを再度表示する
            menuToggle.style.display = "block";
        }
    });
});

// Remake Game ボタンの処理
document.getElementById('remakeGameBtn').addEventListener('click', remakeGame);

// Reset ボタンの処理
document.getElementById('resetBtn').addEventListener('click', resetGame);

// Hint ボタンの処理
document.getElementById('hintBtn').addEventListener('click', showHint);

// ログを表示する関数
function displayLogs() {
    var logsElement = document.getElementById('logs');
    logsElement.innerHTML = '';

    for (var i = 0; i < logs.length; i++) {
        var logItem = document.createElement('div');
        logItem.textContent = logs[i];
        logsElement.appendChild(logItem);
    }
}

// 駒の位置をログに追加する関数
function addLog(row, col, player) {
    logs.unshift(player + ':(' + row + ',' + col + ')');
    if (logs.length > maxLogs) {
        logs.pop();
    }
    displayLogs();
}

// パスのログを追加する関数
function addPassLog(player) {
    logs.unshift(player + ':Pass');
    if (logs.length > maxLogs) {
        logs.pop();
    }
    displayLogs();
}

// ゲームをリセットする関数
function resetGame() {
    boardState = [
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', 'W', 'B', '', '', ''],
        ['', '', '', 'B', 'W', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '']
    ];
    currentPlayer = 'B';
    previousBoardState = null;
    logs = [];
    displayLogs();
    drawBoard();
    updateScore();
    updateTurn();
    var winnerElement = document.getElementById('winner');
    winnerElement.innerHTML = '';
}

// ゲームをリメイクする関数
function remakeGame() {
    window.location.href = 'index.html'; // index.html のパスを適切に指定
}

// 初期盤面を描画
drawBoard();
updateScore();
updateTurn();
