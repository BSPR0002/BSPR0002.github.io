{
	let ap=new AudioPlayer,ac,busy=false;
	window.ap=ap;
	var test=async function() {
		if (busy) return alert("尚在加载其他音频，请稍后！");
		try {ac.stop()} catch(none) {};
		busy=true;
		try {
			ac=await ap.playFile(document.getElementById("tool_select_files_select").files[0],true);
		} catch(e) {
			alert("发生了错误，您可能没有选择正确的音频文件。");
		};
		busy=false;
		window.ac=ac;
	};
	window.addEventListener("load",function() {
		context=testCanvas.context;
		context.strokeStyle="rgba(255,0,0,1)";
		var pa=x=>x+0.5;
		var data=new Uint8Array(1024);
		function draw() {
			ap.analyser.getByteFrequencyData(data);
			context.clearRect(0,0,1024,256);
			context.beginPath();
			context.moveTo(0,pa(255-data[0]));
			for (let x=0;x<1024;x++) context.lineTo(pa(x),pa(255-data[x]));
			context.lineTo(1024,pa(255-data[1023]))
			context.stroke();
		}
		var data2=new Uint8Array(2048);
		function draw2() {
			ap.analyser.getByteTimeDomainData(data2);
			context.clearRect(0,0,1024,256);
			context.beginPath();
			context.moveTo(0,255-data2[0]);
			for (let x=1;x<1024;x++) context.lineTo(2*x,255-data2[2*x]);
			context.stroke();
		}
		function loop(){draw();requestAnimationFrame(loop)}
		loop();
	},{"once":true})
}

/* 玩具
var robot=new MultiThread("self.onmessage=function(e){self.postMessage(self.eval(e.data))}",function(d){console.log(d)});
robot.do=function(command){
	this.send(command);
}
*/

var a=[];
{
	let rgb={r:255,g:0,b:0};
	let tl=[["b",255],["r",0],["g",255],["b",0],["r",255],["g",0]];
	for(let c of tl){
 		let i=c[0],g=c[1],p=Boolean(g);
 		while(rgb[i]!=g){
 		p?++rgb[i]:--rgb[i];
 		a.push(`rgb(${rgb.r},${rgb.g},${rgb.b})`);
		}
	}
	i=0;
	e=a.length;
	//window.addEventListener("load",function(){bgs=document.body.style;function loop(){bgs.backgroundColor=a[i];if(++i==e)i=0;requestAnimationFrame(loop)}loop()},{once:true})
}

var floatOperate={}