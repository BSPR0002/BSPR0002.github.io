var ap=new AudioPlayer,ac,canvas,canvas2,context,context2,busy=false;

window.onload=function() {
	canvas=document.getElementById("canvas");
	context=canvas.getContext("2d");
	canvas2=document.getElementById("canvas2");
	context2=canvas2.getContext("2d");
	context.strokeStyle="rgba(255,0,0,1)";
	context2.strokeStyle="rgba(255,0,0,1)";
	var data=new Uint8Array(1024);
	function draw() {
		ap.analyser.getByteFrequencyData(data);
		context.clearRect(0,0,1024,256);
		context.beginPath();
		context.moveTo(0,255-data[0]);
		for (let x=1;x<1024;x++) context.lineTo(x,255-data[x]);
		context.stroke();
	}
	setInterval(draw,10);
	var data2=new Uint8Array(2048);
	function draw2() {
		ap.analyser.getByteTimeDomainData(data2);
		context2.clearRect(0,0,1024,256);
		context2.beginPath();
		context2.moveTo(0,255-data2[0]);
		for (let x=1;x<1024;x++) context2.lineTo(2*x,255-data2[2*x]);
		context2.stroke();
	}
	setInterval(draw2,10);
}

async function test() {
	if (busy) return alert("尚在加载其他音频，请稍后！");
	try {ac.stop()} catch(none) {};
	busy=true;
	try {
		ac=await ap.playFile(document.getElementById("input_file").files[0],true);
	} catch(e) {
		alert("发生了错误，您可能没有选择正确的音频文件。");
	};
	busy=false;
}
