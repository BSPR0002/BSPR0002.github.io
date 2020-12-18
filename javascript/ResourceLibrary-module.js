var libraryData=null;
const pulling={
	state:false,
	operator:null,
	xhr:null
};
async function pullData() {
	if (!pulling.state) {
		pulling.state=true;
		pulling.operator=new Promise(function(resolve,reject){
			var xhr=new XMLHttpRequest();
			xhr.open("get","/json/resource.json",true);
			xhr.responseType="json";
			xhr.setRequestHeader("If-Modified-Since","0");
			xhr.onload=function() {
				if ((this.status>=200&&this.status<300)||this.status==304) {
					resolve(libraryData=this.response);
				} else reject(false);
				pulling.state=false;
				pulling.xhr=pulling.operator=null
			};
			pulling.xhr=xhr;
			xhr.send();
		});
	}
	return await pulling.operator
};
async function getData() {
	if (libraryData==null) return await pullData();
	return libraryData;
}
async function search(input) {
	var data=(await getData()).concat();
	var keywords=input.trim();
	if (!keywords) return data;
	var wordsForMatching=[];
	wordsForMatching.push(RegExp(keywords,"i"));
	keywords=keywords.split(" ");
	if (keywords.length>1) {
		let existingWords=[];
		for (let word of keywords) {
			if (existingWords.indexOf(word)==-1&&!word) {
				existingWords.push(word);
				wordsForMatching.push(RegExp(word,"i"));
			}
		}
	};
	var results=[];
	for (let word of wordsForMatching) {
		let collection=[];
		for (let i=data.length-1;i>-1;--i) {
			let nameMatch=false;
			for (let name of data[i].name) {
				if (word.test(name)) {
					nameMatch=true;
					break;
				}
			};
			if (nameMatch||word.test(data[i].display)) collection=data.splice(i,1).concat(collection)
		};
		results=results.concat(collection)
	};
	return results
};
export {getData,pullData,search}