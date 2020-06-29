var ap,ac;

async function test() {
	var canvas=document.getElementById("canvas");
	var context=canvas.getContext("2d");
	var canvas2=document.getElementById("canvas2");
	var context2=canvas2.getContext("2d");
	context.strokeStyle="rgba(255,0,0,1)";
	ap=new AudioPlayer;
	ac=await ap.playFile(document.getElementById("input_file").files[0],true,34,180);
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
	context2.strokeStyle="rgba(255,0,0,1)";
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
