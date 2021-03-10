var informations=null,allData=null,carousel=null,single=null,pending=false;
async function getData() {
    if (informations) return informations;
    pending=true;
    var data=await (informations=new Promise(function(resolve,reject){getJSON("/json/informations.json",resolve,false,reject)}));
    allData=[],carousel=[],single=[];
    filter(data.carousel,carousel,9);
    filter(data.single,single,3);
    pending=false;
}
function filter(data,collection,max) {
	for (let i=0,l=data.length,n=0;i<l;++i) {
		let item=data[i];
		if (item.unshow) continue;
        allData.push(item);
        if (n<max) {
            collection.push(item);
            ++n;
        }
	}
}
async function getCarousel() {
    if (carousel) return carousel;
    await getData();
    return carousel.concat();
}
async function getSingle() {
    if (single) return single;
    await getData();
    return single.concat();
}
async function getAll() {
    if (allData) return allData;
    await getData();
    return allData.concat();
}
function reload() {
    if (pending) return;
    informations=null,allData=null,carousel=null,single=null;
    getData();
}
export {getAll,getCarousel,getSingle,reload}