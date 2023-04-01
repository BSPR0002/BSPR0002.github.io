const expiredValue=new Date(0);
function toObject() {
	const fodderBox={};
	if (document.cookie=="") return fodderBox;
	const cookiesBox=document.cookie.split("; ");
	for (let cookie of cookiesBox) {
		let edge=cookie.indexOf("=");
		fodderBox[cookie.substring(0,edge)]=cookie.substring(edge+1);
	}
	return fodderBox;
}
function get(cookieName){
	if (document.cookie=="") return null;
	const cookiesBox=document.cookie.split("; ");
	for (let cookie of cookiesBox) {
		let edge=cookie.indexOf("=");
		if (cookie.substring(0,edge)==cookieName) return cookie.substring(edge+1);
	}
	return null;
}
function set(name,value,expiresDate,path,domain) {document.cookie=name+"="+value+(expiresDate instanceof Date?";expires="+expiresDate.toUTCString()+";":"")+(typeof path=="string"?";Path="+path:"")+(typeof domain=="string"?";domain="+domain:"")}
function remove(cookieName,cookiePath,cookieDomain){set(cookieName,"",expiredValue,cookiePath,cookieDomain)}
function empty(){for (var cookie in toObject()) remove(cookie)}
function renewal(cookieName,cookiePath,cookieDomain) {
	const expiresDate=new Date();
	expiresDate.setFullYear(expiresDate.getFullYear()+1);
	set(cookieName,get(cookieName),expiresDate,cookiePath,cookieDomain);
}
export {toObject,get,set,remove,empty,renewal}