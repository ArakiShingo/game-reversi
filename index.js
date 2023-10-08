function selectMode(vsCpu) {
    vsCpuSelected = vsCpu;

    // "vs CPU" モードが選択された場合、白黒ボタンを有効化および表示
    // "vs PLAYER" モードが選択された場合、白黒ボタンを無効化および非表示
    if (vsCpu) {
        document.getElementById('whiteBtn').disabled = false;
        document.getElementById('blackBtn').disabled = false;
        document.getElementById('whiteBtn').style.display = 'inline-block';
        document.getElementById('blackBtn').style.display = 'inline-block';
        document.getElementById('collarChoice').style.display = 'block';
    } else {
        document.getElementById('whiteBtn').disabled = true;
        document.getElementById('blackBtn').disabled = true;
        document.getElementById('whiteBtn').style.display = 'none';
        document.getElementById('blackBtn').style.display = 'none';
        document.getElementById('collarChoice').style.display = 'none';
    }

    document.getElementById('vsCpuBtn').classList.toggle('selected', vsCpu);
    document.getElementById('vsPlayerBtn').classList.toggle('selected', !vsCpu);

    // Choose Mode: の表示を変更
    document.getElementById('modeDisplay').textContent = vsCpu ? 'vs CPU' : 'vs PLAYER';
}

function selectCollar(collar) {
    collarChoice = collar;

    // "black" ボタンが選択されている場合、"black" ボタンを無効化、"white" ボタンを有効化
    // "white" ボタンが選択されている場合、"white" ボタンを無効化、"black" ボタンを有効化
    document.getElementById('blackBtn').disabled = collar === 'black';
    document.getElementById('whiteBtn').disabled = collar === 'white';

    document.getElementById('blackBtn').classList.toggle('selected', collar === 'black');
    document.getElementById('whiteBtn').classList.toggle('selected', collar === 'white');

    // Your collar is "white?" or "black"? の表示を変更
    document.getElementById('collarDisplay').textContent = collar;

    // ボタンの色を変更
    if (collar === 'black') {
        document.getElementById('blackBtn').style.backgroundColor = '#444';
        document.getElementById('whiteBtn').style.backgroundColor = 'white';
        document.getElementById('blackBtn').style.color = 'white';
        document.getElementById('whiteBtn').style.color = 'black';
    } else {
        document.getElementById('whiteBtn').style.backgroundColor = '#444';
        document.getElementById('blackBtn').style.backgroundColor = 'black';
        document.getElementById('whiteBtn').style.color = 'black';
        document.getElementById('blackBtn').style.color = 'white';
    }
}

// 初期設定時に黒ボタンをグレーにする
document.getElementById('blackBtn').style.backgroundColor = '#444';
document.getElementById('blackBtn').style.color = 'white';

// 初期設定で黒が選択される
let collarChoice = 'black';
selectCollar('black');



function startGame() {

    // ゲームを開始してゲーム画面に遷移する処理を追加
    window.location.href = 'game.html';

}