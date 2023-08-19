class Tetri {
	#element=document .createElement("div");
	#x=0;
	get x(){return this.#x}
	set x(value){
		value=Number(value);
		if (value<0||value>9) throw Error("错误：方块的水平位置不能小于0或大于9！\n操作值："+value);
		this.#element.style.gridColumnStart=(value+1);
		this.#x=value;
	}
	#y=0;
	get y(){return this.#y}
	set y(value){
		value=Number(value);
		if (value<0||value>19) throw Error("错误：方块的垂直位置不能小于0或大于19！\n操作值："+value);
		this.#element.style.gridRowStart=(value+1)
		this.#y=value;
	}
	get color(){return this.#element.style.backgroundColor}
	set color(value){this.#element.style.backgroundColor=value}
	constructor(options){
		this.#element.className="tetris";
		var model={"x":1,"y":1,"color":"white"};
		Object.assign(model,options);
		this.x=model.x;
		this.y=model.y;
		this.color=model.color;
	}
	remove(){
		var parent=this.#element.parentNode;
		if (parent) {
			parent.removeChild(this.#element);
			return true
		} else return false
	}
	display(target){
		if (!(target instanceof Node)) throw new Error("错误：参数不是可添加子节点的 DOM 节点");
		target.appendChild(this.#element);
	}
}

var blocks=[
	{
		"range":[
			[[0,1],[1,1],[2,1],[3,1]],
			[[1,0],[1,1],[1,2],[1,3]]
		],
		"start":[[3,0],[4,0],[5,0],[6,0]],
		color:"orangered"
	},
	{
		"range":[
			[[0,1],[1,1],[2,1],[1,2]],
			[[1,0],[1,1],[1,2],[0,1]],
			[[2,1],[1,1],[0,1],[1,0]],
			[[1,2],[1,1],[1,0],[2,1]]
		],
		"start":[[3,0],[4,0],[5,0],[4,1]],
		color:"lightcoral"
	},
	{
		"range":[
			[[0,1],[1,1],[1,2],[2,2]],
			[[2,0],[2,1],[1,1],[1,2]]
		],
		"start":[[3,0],[4,0],[4,1],[5,1]],
		color:"skyblue"
	},
	{
		"range":[
			[[2,1],[1,1],[1,2],[0,2]],
			[[0,0],[0,1],[1,1],[1,2]]
		],
		"start":[[5,0],[4,0],[4,1],[3,1]],
		color:"lightgreen"
	},
	{
		"range":[
			[[0,1],[1,1],[2,1],[2,2]],
			[[1,0],[1,1],[1,2],[0,2]],
			[[2,1],[1,1],[0,1],[0,0]],
			[[1,2],[1,1],[1,0],[2,0]]
		],
		"start":[[3,0],[4,0],[5,0],[5,1]],
		color:"gold"
	},
	{
		"range":[
			[[2,1],[1,1],[0,1],[0,2]],
			[[1,2],[1,1],[1,0],[0,0]],
			[[0,1],[1,1],[2,1],[2,0]],
			[[1,0],[1,1],[1,2],[2,2]]
		],
		"start":[[5,0],[4,0],[3,0],[3,1]],
		color:"orchid"
	},
	{
		"range":[[[0,0],[1,0],[1,1],[0,1]]],
		"start":[[4,0],[5,0],[5,1],[4,1]],
		color:"saddlebrown"
	}
];
var colors=["orangered","lightcoral","skyblue","lightgreen","gold","orchid","saddlebrown"];

{
	let blength=blocks.length;
	let clength=colors.length;
	let floor=Math.floor;
	let random=Math.random;
	function randomBlock(){return blocks[floor(random()*blength)]}
	function randomColor(){return colors[floor(random()*clength)]}
}

var space=new Array(20);
for (let y=0;y<20;++y) {
	let temp=new Array(10);
	space[y]=temp;
}
function clearSpace(){
	for (let x of space) {for (let y in x) delete x[y]}
}

{
	let temp=localStorage.getItem("TetrisRecord");
	if (temp==null||!isFinite(temp)||temp<0) localStorage.setItem("TetrisRecord",0);
	let highScoreDisplay=null;
	function setHighScoreElement(target){highScoreDisplay=target}
	function updateHighScore(score){
		var highScore=localStorage.getItem("TetrisRecord");
		if (score>highScore) {
			localStorage.setItem("TetrisRecord",score);
			highScore=score;
		}
		highScoreDisplay.innerHTML=highScore;
	}
}

{
	let map=null;
	let scoreDisplay=null;
	let pauseButton=null;
	function setMapElement(target){map=target}
	function setScoreElement(target){scoreDisplay=target}
	function setPauseElement(target){pauseButton=target}
	function updateScore(){scoreDisplay.innerHTML=score}
	let rate=1,score=0;
	let intervalId=-1;
	let inGame=false;
	let terminated=null;
	let currentBlock=null;
	let nextBlock=null;
	let currentTetris=null;
	let tick=0;
	let nextActiveTick=0;
	let downKeyHold=false,downKeyBlock=false;
	function detect(range) {
		for (let i in range) {
			let point=range[i];
			if (point[0]<0||point[0]>9||point[1]<0||point[1]>19) return true;
			let target=space[point[1]][point[0]];
			if (target!=null) return true;
		}
		return false
	}
	function next() {
		currentTetris=[];
		currentBlock=nextBlock;
		nextBlock={"block":randomBlock(),"rotate":0,"color":randomColor()};
		for (let tetri of currentBlock.block.start) {
			let temp=new Tetri({x:tetri[0],y:tetri[1],color:currentBlock.color});
			temp.display(map);
			currentTetris.push(temp);
		}
	}
	function rotate() {
		if (!inGame) return;
		var origin=currentBlock.block.range[currentBlock.rotate];
		var rotate=currentBlock.rotate==currentBlock.block.range.length-1?0:currentBlock.rotate+1;
		var change=currentBlock.block.range[rotate];
		var after=[];
		for (let i=0;i<4;++i) {
			let temp=[change[i][0]-origin[i][0],change[i][1]-origin[i][1]];
			after.push([currentTetris[i].x+temp[0],currentTetris[i].y+temp[1]])
		}
		if (detect(after)) return;
		currentBlock.rotate=rotate;
		for (let i=0;i<4;++i) {
			currentTetris[i].x=after[i][0];
			currentTetris[i].y=after[i][1];
		}
	}
	function doMove(LorR) {
		if (!inGame) return;
		var adder=Boolean(LorR)?1:-1;
		var nextPosition=[];
		for (let i in currentTetris) nextPosition.push([currentTetris[i].x+adder,currentTetris[i].y]);
		if (detect(nextPosition)) return;
		for (let i in currentTetris) currentTetris[i].x+=adder;
	}
	function doFall() {
		if (!inGame) return;
		nextActiveTick=tick+51-rate;
		var nextPosition=[];
		for (let i in currentTetris) nextPosition.push([currentTetris[i].x,currentTetris[i].y+1]);
		if (detect(nextPosition)) return settle();
		for (let i in currentTetris) ++currentTetris[i].y;
	}
	function destory() {
		var firstLine=-1;
		for (let y=0;y<20;++y) {
			let count=0;
			for (let x in space[y]) ++count;
			if (count==10) {
				firstLine=y;
				let destoryLine=space.splice(y,1)[0]
				for (let i in destoryLine) destoryLine[i].remove();
				space.unshift(new Array(10));
				addScore();
			}
		}
		if (firstLine!=-1) {
			for (let y=firstLine;y>-1;--y) {
				let line=space[y];
				for (let x in line) line[x].y=y
			}
		}
	}
	function settle(){
		if (!inGame) return;
		if (downKeyHold) downKeyBlock=true;
		for (let i in currentTetris) {
			let tetri=currentTetris[i];
			space[tetri.y][tetri.x]=tetri;
		};
		destory();
		next();
		updateNext(nextBlock.block.range[0],nextBlock.color);
		if (detect(currentBlock.block.start)) return endGame();
	}
	let levelExp=0;
	function levelUp(){if (rate<50) ++rate}
	function addScore() {
		++score;
		updateScore();
		if (++levelExp==10) {
			levelExp=0;
			levelUp();
		}
	}
	function endGame() {
		if (!inGame) return;
		clearInterval(intervalId);
		updateHighScore(score);
		inGame=false;
		terminated()
	}
	let gamePaused=false;
	function pauseGame() {
		if (!inGame) return;
		if (gamePaused) {
			gamePaused=false;
			intervalId=setInterval(engine,20);
			pauseButton.innerHTML="暂停游戏";
			return
		}
		gamePaused=true;
		clearInterval(intervalId);
		pauseButton.innerHTML="继续游戏";
	}
	
	function engine() {
		if (tick>49) {
			tick=1;
			nextActiveTick-=50;
		} else ++tick;
		if (tick<nextActiveTick) return;
		doFall();
	}
	function startGame() {
		if (inGame) return;
		map.innerHTML="";
		clearSpace();
		rate=1;
		score=0;
		levelExp=0;
		nextBlock={"block":randomBlock(),"rotate":0,"color":randomColor()};
		tick=0;
		nextActiveTick=51;
		return new Promise(function(end) {
			terminated=end;
			inGame=true;
			gamePaused=true;
			updateScore();
			next();
			updateNext(nextBlock.block.range[0],nextBlock.color);
			pauseGame();
		})
	}
	function controller(event) {
		if (gamePaused) return;
		switch (event.keyCode) {
			case 37: //左
				doMove(false);
				break;
			case 38: //上
				rotate();
				break;
			case 39: //右
				doMove(true);
				break;
			case 40: //下
				if (downKeyBlock) return;
				downKeyHold=true;
				doFall();
			default:
		}
	}
	function blocker(event){if (event.keyCode==40) downKeyHold=downKeyBlock=false;}
}

{
	let next=null;
	function setNextElement(target){next=target}
	function clearNext(){next.innerHTML=""}
	function updateNext(range,color) {
		next.innerHTML="";
		for (let i in range) {
			(new Tetri({x:range[i][0],y:range[i][1],color:color})).display(next);
		}
	}
}

