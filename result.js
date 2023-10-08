// URLから勝者を取得
var urlParams = new URLSearchParams(window.location.search);
var winner = urlParams.get('winner');

// 勝者を表示
var winnerElement = document.getElementById('winner');
if (winner === 'Tie') {
    winnerElement.innerHTML = 'It\'s a tie!';
} else {
    winnerElement.innerHTML = 'The winner is: ' + winner;
}

// "Restart"ボタンがクリックされたときの処理
function restartGame() {
    // ゲーム開始画面に遷移する処理を追加
    window.location.href = 'index.html';
}
