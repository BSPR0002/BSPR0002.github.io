const 
MEDIA_TAGS={
	"game":"游戏",
	"animation":"动画",
	"comic":"漫画",
	"novel":"小说"
},
CONTENT_TAGS={
	"ct01":"色情",
	"ct11":"兽娘",
	"ct12":"魔幻",
	"ct13":"异世界"
};
Object.freeze(MEDIA_TAGS);
Object.freeze(CONTENT_TAGS);
function buildNameList(names,elementClass){return names.map(name=>["SPAN",name,{class:elementClass}])}
function buildMediaTags(tags,elementClass) {
	const result=[];
	for (let tag of tags) {
		let temp=MEDIA_TAGS[tag];
		if (!temp) continue;
		result.push(["SPAN",temp,{class:elementClass}]);
	}
	return result
}
function buildContentTags(tags,elementClass) {
	const result=[];
	for (let tag of tags) {
		let temp=CONTENT_TAGS[tag];
		if (!temp) continue;
		result.push(["SPAN",temp,{class:`${elementClass} ${tag}`}]);
	}
	return result
}
export {buildNameList,buildMediaTags,buildContentTags};