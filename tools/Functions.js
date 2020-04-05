function generate_preview(data) {
	var preview=document.createDocumentFragment();
	function operator_meta(target,index,value,type,path) {
		var obj_child=document.createElement("p");
		obj_child.className="preview_child";
		obj_child.appendChild(document.createTextNode(index+":"));
		var obj_child_value=document.createElement("p");
		value=JSON.stringify(value);
		obj_child_value.innerText=value;
		obj_child_value.className="preview_value_"+type;
		obj_child_value.id="preview_f"+path+"[\""+index+"\"]";
		obj_child.appendChild(obj_child_value);
		obj_child.appendChild(document.createElement("br"));
		target.appendChild(obj_child);
	};
	function operator_object(target,index,data,type,path) {
		path+="[\""+index+"\"]";
		var obj_child=document.createElement("details");
		var obj_child_index=document.createElement("summary");
		obj_child_index.appendChild(document.createTextNode(index+":"));
		var obj_child_type=document.createElement("p");
		obj_child_type.innerText=type+"("+Object.keys(data).length+")";
		obj_child_type.className="preview_value_type_"+type;
		obj_child_index.appendChild(obj_child_type);
		obj_child.appendChild(obj_child_index);
		var obj_child_value=document.createElement("div");
		obj_child_value.className="preview_child";
		operator(data,obj_child_value,path);
		obj_child.appendChild(obj_child_value);
		target.appendChild(obj_child);
	};
	function operator(data,outer,path) {
		for (let index in data) {
			var type=typeof data[index];
			switch (type) {
				case "undefined":
				case "number":
				case "boolean":
				case "string":
					operator_meta(outer,index,data[index],type,path);
					break;
				case "object":
					if (data[index]===null) {
						operator_meta(outer,index,"null","null",path);
					} else {
						if (Array.isArray(data[index])) {
							var otype="Array";
						} else var otype="Object";
						operator_object(outer,index,data[index],otype,path);
					};
			};
		};
	};
	operator(data,preview,"");
	EmptyElement(document.getElementById("preview_frame"));
	document.getElementById("preview_frame").appendChild(preview);
}

function start_edit(object) {
	generate_preview(object);
	editor.file.file_json=object;
	editor.radio_onAir();
	document.getElementById("open").style.display="none";
	document.getElementById("editor").style.display="block";
	window_board.hide();
}

var editor={
	"file":{
		"file_modified":false,
		"file_name":null,
		"file_json":null,
	},
	"radio_listen":function() {
		var path=this.parentNode.getElementsByClassName("filter_path_input")[0].value;
		var index=document.getElementById("index_set").value;
		var path=path.split("${i}");
		for (let part=1,length=path.length;part<length;part++) {
			path[0]+=index+path[part];
		};
		function Navi(target) {
			var length=target.length;
			var route="";
			for (var index=0;index<length;index++) {
				switch (target[index]) {
					case "[":
						var name="";
						for (index++;index<length;index++) {
							if (target[index]==="]") break;
							name+=target[index];
						};
						if (typeof JSON.parse(name)!="string") name="\""+name+"\"";
						route+="["+name+"]";
						break;
					case ".":
						var name="";
						for (index++;index<length;index++) {
							if (target[index]==="["||target[index]===".") break;
							name+=target[index];
						};
						index--;
						route+="[\""+name+"\"]";
				}
			};
			return route;
		};
		var preview_path="preview_f";
		try {
			preview_path+=Navi(path[0]);
		} catch(error) {preview_path+="null"}
		try {
			eval("this.value=JSON.stringify(editor.file.file_json"+path[0]+")");
			var target=document.getElementById(preview_path);
			if (target==null) throw "none";
			this.data={
				"preview":target,
				"path":path[0]
			};
			this.removeAttribute("disabled");
			this.style.backgroundColor="#ffffff";
		} catch(error) {
			this.value="路径错误或此类型不可编辑";
			this.setAttribute("disabled",1);
			this.style.backgroundColor="#ffdddd";
		}
	},
	"radio_inside":function() {
		this.parentNode.parentNode.getElementsByClassName("filter_edit")[0].dispatchEvent(new Event("radio"));
	},
	"radio_onAir":function() {
		for (var member of document.getElementsByClassName("filter_edit")) {
			member.dispatchEvent(new Event("radio"));
		}
	},
	"edit":function() {
		try {
			var value=this.value;
			var data=JSON.parse(value);
			var type=typeof data;
			if (type=="object") {
				if (data!=null) throw "no";
				type="null";
			};
			eval("editor.file.file_json"+this.data.path+"="+value);
			editor.file.file_modified=true;
			this.data.preview.innerText=value;
			this.data.preview.className="preview_value_"+type;
			this.style.backgroundColor="#ffffff";
		} catch(no) {this.style.backgroundColor="#ffdddd"};
	}
};

function file_Save() {
	FileAPI.save(new Blob([JSON.stringify(editor.file.file_json)],{"type":"application/json;charset=utf-8"}),editor.file.file_name);
}

function file_Close() {
	function fclose() {
		window_board.display("正在进行清理，请稍等……","请稍等",true);
		document.getElementById("editor").style.display="none";
		EmptyElement(document.getElementById("preview_frame"));
		editor.file={
			"file_modified":false,
			"file_name":null,
			"file_json":null,
		};
		document.getElementById("open").style.display="block";
		window_board.hide();
	};
	if (editor.file.file_modified) {
		var HN=HADecoder([
			"文件已被修改，是否要保存？",
			["br"],
			["button","是",{
				"style":"border:solid 1px #000000;border-radius:5px;transition:background-color 0.2s",
				"id":"dialog_button_yes",
				"onmouseover":"javascript:this.style.backgroundColor='#FFFFFF'",
				"onmouseout":"javascript:this.style.backgroundColor=null"
			}],"　",
			["button","否",{
				"style":"border:solid 1px #000000;border-radius:5px;transition:background-color 0.2s",
				"id":"dialog_button_no",
				"onmouseover":"javascript:this.style.backgroundColor='#FFFFFF'",
				"onmouseout":"javascript:this.style.backgroundColor=null"
			}],"　",
			["button","取消",{
				"style":"border:solid 1px #000000;border-radius:5px;transition:background-color 0.2s",
				"id":"dialog_button_cancel",
				"onmouseover":"javascript:this.style.backgroundColor='#FFFFFF'",
				"onmouseout":"javascript:this.style.backgroundColor=null"
			}]
		],"dialog-close");
		HN.getElementById("dialog_button_yes").addEventListener("click",function(){window_board.hide();file_Save();fclose()});
		HN.getElementById("dialog_button_no").addEventListener("click",function(){window_board.hide();fclose()});
		HN.getElementById("dialog_button_cancel").addEventListener("click",function(){window_board.hide()});
		window_board.display(HN,"保存文件",true);
	} else fclose();
}

function add_filter() {
	var filter=HADecoder([
		["DIV",[
			["DIV",[
				["INPUT",null,{"class":"filter_title_input","type":"text","value":"索引器"}],
				["BUTTON",null,{"class":"filter_delete","title":"删除这个索引器"}]
			],{"class":"filter_title"}],
			["DIV",[
				["P",["索引路径"]],
				["INPUT",null,{"class":"filter_path_input","type":"search","placeholder":"索引编号占位符 ${i}"}]
			],{"class":"filter_path"}],
			["INPUT",null,{"class":"filter_edit","type":"text"}]
		],{"class":"filter"}]
	]);
	var target=filter.firstElementChild;
	target.getElementsByClassName("filter_path_input")[0].addEventListener("input",editor.radio_inside);
	target.getElementsByClassName("filter_edit")[0].addEventListener("radio",editor.radio_listen);
	target.getElementsByClassName("filter_edit")[0].addEventListener("input",editor.edit);
	target.getElementsByClassName("filter_delete")[0].addEventListener("click",remove_filter);
	target.getElementsByClassName("filter_edit")[0].dispatchEvent(new Event("radio"));
	document.getElementById("filter_list_frame").appendChild(filter);
}

function remove_filter() {
	var target=this.parentNode.parentNode;
	target.parentNode.removeChild(target);
}

var window_board={
	"show":function() {
		var board=document.getElementById("window_board_layer");
		board.style.opacity="1";
		board.style.display="flex";
	},
	"hide":function() {
		var board=document.getElementById("window_board_layer");
		board.style.opacity="0";
		board.style.display="none";
	},
	"display":function(content,title,NoManualClose,boardSize) {
		var size={};
		try {Object.assign(size,boardSize)} catch(error) {console.warn("无法接收参数 boardSize ！\n",boardSize)};
		var board=document.getElementById("window_board");
		var board_title=document.getElementById("window_board_title");
		var board_close=document.getElementById("window_board_close");
		var board_content=document.getElementById("window_board_content");
		if (NoManualClose===true) {board_close.style.display="none"} else {board_close.style.display="block"};
		if (typeof title=="string") {
			board_title.innerText=title;
		} else {
			board_title.innerText="提示";
		};
		EmptyElement(board_content);
		switch (typeof content) {
			case "string":
				board_content.innerText=content;
			break;
			case "object":
				board_content.appendChild(content);
		};
		board.removeAttribute("style");
		if (typeof size.width!="undefined") board.style.width=size.width;
		if (typeof size.height!="undefined") board.style.width=size.height;
		window_board.show();
	}
};

document.getElementById("window_board_close").addEventListener("click",window_board.hide);
document.getElementById("input_file").addEventListener("change",function(){
	window_board.display("正在进行加载，请稍等……","请稍等",true);
	var file=this.files[0];
	this.value=null;
	editor.file.file_name=file.name;
	FileAPI.read(file,4,function(text){
		try {
			data=JSON.parse(text);
		} catch(error) {
			window_board.display("选择的不是 JSON 文件！","错误！");
			return false;
		};
		start_edit(JSON.parse(text));
	});
});
document.getElementById("file_S").addEventListener("click",file_Save);
document.getElementById("file_C").addEventListener("click",file_Close);
document.getElementById("filter_add_button").addEventListener("click",add_filter);
document.getElementById("index_set").addEventListener("input",editor.radio_onAir);
document.getElementById("filter_0_path").addEventListener("input",editor.radio_inside);
document.getElementById("filter_0_edit").addEventListener("radio",editor.radio_listen);
document.getElementById("filter_0_edit").addEventListener("input",editor.edit);
window.onbeforeunload=function(event){
	if (editor.file.modified) event.returnValue="文件已被修改。若未保存，修改将会丢失！";
};