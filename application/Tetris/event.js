setMapElement(document.getElementById("tetris_box"));
setNextElement(document.getElementById("board_block_preview"));
setScoreElement(document.getElementById("board_score_display"));
setHighScoreElement(document.getElementById("high_score_display"));
updateHighScore()
{
	let target=document.getElementById("board_option_pause");
	setPauseElement(target);
	target.addEventListener("click",pauseGame);
}
document.getElementById("board_option_end").addEventListener("click",endGame);

{
	let start=document.getElementById("start");
	document.getElementById("start_game").addEventListener("click",function(){
		this.disabled=true;
		start.style.display="none";
		this.disabled=false;
		startGame().then(function(){start.style.display="block"});
	});
}

document.addEventListener("keydown",controller);
document.addEventListener("keyup",blocker);