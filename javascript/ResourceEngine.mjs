import {CacheJSON} from "/javascript/module/CacheJSON.mjs";
const json=new CacheJSON("/json/resource/library.json",true);
function match(matcher,display,names) {
	if (matcher.test(display)) return true;
	for (let name of names) if (matcher.test(name)) return true;
	return false;
}
async function search(keyword) {
	if (!json.loaded) await json.fetch();
	const data=json.data;
	if (!data) return [];
	keyword=keyword.trim();
	if (!keyword) return data;
	var matchers=keyword.replaceAll(/[\\[^.?+*()|${]/g,"\\$&").split(" ").filter((element,index,array)=>element&&array.indexOf(element)==index);
	if (matchers.length>1) matchers.unshift(keyword);
	matchers=matchers.map(value=>RegExp(value.trim(),"i"));
	const result=[];
	for (let matcher of matchers) {
		const collection=[];
		for (let i=data.length-1;i>-1;--i) {
			const item=data[i];
			if (match(matcher,item.display,item.name)) collection.unshift(data.splice(i,1)[0]);
		}
		result.push(...collection);
	}
	return result
}
function abortMission() {if (json.fetching) json.abortRequest()}
export {search,abortMission}