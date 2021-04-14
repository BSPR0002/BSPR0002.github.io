var data=localStorage.getItem("BSIF site settings");
try {
    let temp=JSON.parse(data);
    if (!(temp instanceof Object)) throw "broken";
    data=temp;
} catch(none) {
    localStorage.setItem("BSIF site settings","{}");
    data={};
}
function getItem(key,defaultValue) {
    if (key in data) return data[key];
    return defaultValue
}
function setItem(key,value){return data[key]=value}
const setting={getItem,setItem};
async function notificationPermission() {
    var permission=Notification.permission;
    if (permission=="default") permission=await Notification.requestPermission();
    return permission=="granted";
}
export {setting,notificationPermission}