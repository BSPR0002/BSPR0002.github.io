var data=localStorage.getItem("BSIF site settings");
try {
    let temp=JSON.parse(data);
    if (!(temp instanceof Object)) throw "broken";
    data=temp;
} catch(none) {
    data={};
    save();
}
function getItem(key,defaultValue=null) {
    if (key in data) return data[key];
    return defaultValue
}
function setItem(key,value){
    var temp=data[key]=value;
    save();
    return temp;
}
function save(){localStorage.setItem("BSIF site settings",JSON.stringify(data))}
const setting={getItem,setItem};
async function notificationPermission() {
    var permission=Notification.permission;
    if (permission=="default") permission=await Notification.requestPermission();
    return permission=="granted";
}
export {setting,notificationPermission}