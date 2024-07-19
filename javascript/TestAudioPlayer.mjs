import {AudioAnalyser, AudioPlayer} from "/javascript/module/AudioPlayer.mjs";
import {parseAndGetNodes as ArrayHTML} from "/javascript/module/ArrayHTML.mjs";
import MiniWindow from "/javascript/module/MiniWindow.mjs";
//交互托盘
const toolInterface=ArrayHTML([
	["div",[
		["style",[
			"#test_audio_player>*{max-width:100%}",
			"#test_audio_player button{border:solid 2px #FFFFFF;border-radius:4px;background-color:#000000;font-size:15px}",
			"#test_audio_player .controls_speed{padding:0;width:24px;height:24px}"
		]],
		["span",[
			"当前文件：",["span","无文件",null,"currentFile"]
		],{style:"grid-area:current;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;max-width:100%;font-size:14px"}],
		["input",null,{type:"file",style:"grid-area:input",accept:"audio/*"},"input"],
		["div",[
			["button","播放",null,"play"],
			["button","停止",null,"stop"],
			["div",[
				["button","－",{class:"controls_speed",title:"-0.1"},"speedDown"],
				["span",[
					"×",
					["span","1",{style:"place-self:start"},"playbackRate"]
				],{style:"display:grid;grid-template-columns:auto 2em"}],
				["button","＋" ,{class:"controls_speed",title:"+0.1"},"speedUp"]
			],{style:"display:grid;grid-template-columns:24px 1fr 24px;grid-gap:inherit;place-items:center;height:100%",title:"速度"}]
		],{style:"grid-area:controls;display:grid;grid-template-columns:auto auto 1fr;grid-gap:0.5em;place-items:center;height:100%"}],
		["div",[
			"音量",
			["span",[["#text",null,null,"volumeDisplay"],"%"]],
			["input",null,{type:"range",step:1,min:0,max:100},"volumeSlide"]
		],{style:"box-sizing:border-box;border:solid 2px #FFFFFF;background-color:#000;height:100%;width:100%;border-radius:2em;grid-area:volume;display:grid;grid-template-columns:2em 3em auto;grid-gap:0.5em;place-items:end;place-content:center"}]
	],{style:"display:grid;grid-template-rows:1fr 1fr;grid-template-columns:1fr 1fr;grid-template-areas:\"current input\"\"controls volume\";grid-gap:5px;place-items:center",class:"test_tools",id:"test_audio_player"}]
]),nodes=toolInterface.nodes;
//控制逻辑
const audioPlayer=new AudioPlayer,analyser=new AudioAnalyser(audioPlayer.context);
analyser.insertToChain(audioPlayer);
var audioController=null,busy=false;
async function play() {
	if (busy) return new MiniWindow("尚在加载其他音频，请稍后！");
	stop();
	changeFileName(1);
	busy=true;
	try {
		let file=nodes.input.files[0];
		audioController=await audioPlayer.playFile(file,true);
		changeFileName([file.name]);
		nodes.playbackRate.innerText=1;
	} catch(error) {
		new MiniWindow("发生了错误，您可能没有选择正确的音频文件。\n"+error.message);
		changeFileName(0);
	}
	busy=false
}
function stop(){
	if (audioController) {
		audioController.destroy();
		audioController=null;
		changeFileName(0);
	}
}
function changeSpeed(fasterOrSlower){
	if (audioController) {
		let temp=audioController.playbackRate*10
		switch (Boolean(fasterOrSlower)) {
			case true:
				if (temp<40) nodes.playbackRate.innerText=audioController.playbackRate=(temp+1)/10;
				break;
			case false:
				if (temp>1) nodes.playbackRate.innerText=audioController.playbackRate=(temp-1)/10;
		}
	}
}
function changeFileName(name){
	switch (name) {
		case 0:
			nodes.currentFile.innerText="无文件";
			nodes.currentFile.removeAttribute("title");
			break;
		case 1:
			nodes.currentFile.innerText="读取文件中……";
			nodes.currentFile.removeAttribute("title");
			break;
		default:
			nodes.currentFile.title=nodes.currentFile.innerText=name;
	}
}
testTools.audioPlayer=Object.freeze({
	play,stop,changeSpeed,player:audioPlayer,analyser,
	get controller(){return audioController}
});
//事件绑定
nodes.play.addEventListener("click",play);
nodes.stop.addEventListener("click",stop);
nodes.speedUp.addEventListener("click",function(){changeSpeed(true)});
nodes.speedDown.addEventListener("click",function(){changeSpeed(false)});
nodes.volumeSlide.value=nodes.volumeDisplay.textContent=audioPlayer.volume;
nodes.volumeSlide.addEventListener("input",function(){audioPlayer.volume=Number(nodes.volumeDisplay.textContent=this.value)});
//显示控件
document.getElementById("tools_plate").appendChild(toolInterface.documentFragment);
//canvas绘图
const context=testCanvas.context;
context.translate(0.5,255.5);
context.scale(1,-1);
const data=new Uint8Array(1024),data2=new Uint8Array(2048);
function draw1() {
	context.beginPath();
	context.strokeStyle="rgb(255,0,0)";
	context.moveTo(-0.5,data[0]);
	for (let x=0;x<1024;++x) context.lineTo(x,data[x]);
	context.lineTo(1023.5,data[1023]);
	context.stroke();
}
function draw2() {
	context.beginPath();
	context.strokeStyle="rgb(0,0,255)";
	context.moveTo(-0.5,data2[0]);
	for (let x=0;x<1024;++x) context.lineTo(x,data2[x*2]);
	context.lineTo(1023.5,data2[2046]);
	context.stroke();
}
function loop() {
	analyser.getByteFrequencyData(data);
	analyser.getByteTimeDomainData(data2);
	context.clearRect(-1,0,1025,256);
	draw2();
	draw1();
	requestAnimationFrame(loop)
}
loop();