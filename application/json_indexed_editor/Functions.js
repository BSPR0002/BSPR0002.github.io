{
	let prevent=function(event){event.preventDefault()};
	document.addEventListener("dragover",prevent);
	document.addEventListener("drop",prevent);
	let special=function(event){event.stopPropagation()};
	let input=document.getElementById("input_file")
	input.addEventListener("dragover",special);
	input.addEventListener("drop",special);
}

function generate_preview(data) {
	var preview=document.createDocumentFragment();
	function operator_meta(target,index,value,type,path) {
		var obj_child=document.createElement("span");
		obj_child.className="preview_child";
		obj_child.appendChild(document.createTextNode(index+":"));
		var obj_child_value=document.createElement("span");
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
		var obj_child_type=document.createElement("span");
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
						operator_meta(outer,index,null,"null",path);
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

var editor=(function(){
	function start_edit(object,fileName) {
		generate_preview(object);
		file.name=fileName;
		file.json=object;
		filter.radio.toAir();
		document.getElementById("open").style.display="none";
		document.getElementById("editor").style.display="block";
		window_board.hide();
	};
	function edit() {
		try {
			var value=this.value;
			var data=JSON.parse(value);
			var type=typeof data;
			if (type=="object") {
				if (data!=null) throw "no";
				type="null";
			};
			eval("file.json"+this.data.path+"="+value);
			file.modified=true;
			this.data.preview.innerText=value;
			this.data.preview.className="preview_value_"+type;
			this.style.backgroundColor="#ffffff";
		} catch(no) {this.style.backgroundColor="#ffdddd"};
	};
	function file_close() {
		window_board.display("正在进行清理，请稍等……","请稍等",true);
		document.getElementById("editor").style.display="none";
		EmptyElement(document.getElementById("preview_frame"));
		file.name=null;
		file.json=null;
		file.modified.false;
		document.getElementById("open").style.display="block";
		window_board.hide();
	};
	var file={
		"name":null,
		"json":null,
		"modified":false,
		"save":function(){FileAPI.save(new File([JSON.stringify(file.json)],file.name,{"type":"application/json;charset=utf-8"}),file.name)},
		"close":function() {
			if (file.modified) {
				let HN=ArrayHTML.decode([
					"文件已被修改，是否要保存？",
					["br"],
					["button","是",{
						"style":"border:solid 1px #000000;border-radius:5px;transition:background-color 0.2s",
						"id":"dialog_button_yes",
						"onmouseover":"javascript:this.style.backgroundColor='#FFFFFF'",
						"onmouseout":"javascript:this.style.backgroundColor=null"
					},"yes"],"　",
					["button","否",{
						"style":"border:solid 1px #000000;border-radius:5px;transition:background-color 0.2s",
						"id":"dialog_button_no",
						"onmouseover":"javascript:this.style.backgroundColor='#FFFFFF'",
						"onmouseout":"javascript:this.style.backgroundColor=null"
					},"no"],"　",
					["button","取消",{
						"style":"border:solid 1px #000000;border-radius:5px;transition:background-color 0.2s",
						"id":"dialog_button_cancel",
						"onmouseover":"javascript:this.style.backgroundColor='#FFFFFF'",
						"onmouseout":"javascript:this.style.backgroundColor=null"
					},"cancel"]
				],"dialog-close",true);
				HN.getNodes.yes.addEventListener("click",function(){window_board.hide();file.save();file_close()});
				HN.getNodes.no.addEventListener("click",function(){window_board.hide();file_close()});
				HN.getNodes.cancel.addEventListener("click",window_board.hide());
				window_board.display(HN.DocumentFragment,"保存文件",true);
			} else file_close();
		}
	};
	var filter=(function(){
		function add(title,value) {
			if (typeof title!="string") title="索引器";
			if (typeof value!="string") value="";
			var Filter=ArrayHTML.decode([
				["DIV",[
					["DIV",[
						["INPUT",null,{"class":"filter_title_input","type":"text","value":title},"title"],
						["BUTTON",null,{"class":"filter_delete","title":"删除这个索引器"},"remove"]
					],{"class":"filter_title"}],
					["DIV",[
						["P",["索引路径"]],
						["INPUT",null,{"class":"filter_path_input","type":"search","placeholder":"索引编号占位符 ${i}","value":value},"path"]
					],{"class":"filter_path"}],
					["INPUT",null,{"class":"filter_edit","type":"text"},"edit"]
				],{"class":"filter"}]
			],"editor-filter",true);
			Filter.getNodes.path.addEventListener("input",filter.radio.toInside);
			Filter.getNodes.edit.addEventListener("radio",filter.radio.listener);
			Filter.getNodes.edit.addEventListener("input",editor.edit);
			Filter.getNodes.remove.addEventListener("click",filter.remove);
			Filter.getNodes.edit.dispatchEvent(new Event("radio"));
			document.getElementById("filter_list_frame").appendChild(Filter.DocumentFragment);
		};
		function remove() {
			var target=this.parentNode.parentNode;
			target.parentNode.removeChild(target);
		};
		function save() {
			var data=new Array;
			for (let member of document.getElementsByClassName("filter")) {
				data.push({"name":member.getElementsByClassName("filter_title_input")[0].value,"value":member.getElementsByClassName("filter_path_input")[0].value});
			};
			localStorage.setItem("M2-PSB-SCN-JSON-EDITOR-filter",JSON.stringify(data));
			window_board.display("保存完成！");
		};
		function load() {
			var data=localStorage.getItem("M2-PSB-SCN-JSON-EDITOR-filter");
			if (typeof data=="string") {
				data=JSON.parse(data);
				document.getElementById("filter_0_title").value=data[0].name;
				document.getElementById("filter_0_path").value=data[0].value;
				for (let i=1,l=data.length;i<l;i++) {
					filter.add(data[i].name,data[i].value);
				};
			};
		};
		function clearSaves() {
			localStorage.removeItem("M2-PSB-SCN-JSON-EDITOR-filter");
			window_board.display("已清除！");
		};
		function pathNavi(target) {
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
		var radio={
			"listener":function() {
				var path=this.parentNode.getElementsByClassName("filter_path_input")[0].value;
				var index=document.getElementById("index_set").value;
				var path=path.split("${i}");
				for (let part=1,length=path.length;part<length;part++) {
					path[0]+=index+path[part];
				};
				var preview_path="preview_f";
				try {
					preview_path+=pathNavi(path[0]);
				} catch(error) {preview_path+="null"}
				try {
					eval("this.value=JSON.stringify(file.json"+path[0]+")");
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
			"toInside":function() {
				this.parentNode.parentNode.getElementsByClassName("filter_edit")[0].dispatchEvent(new Event("radio"));
			},
			"toAir":function() {
				for (var member of document.getElementsByClassName("filter_edit")) {
					member.dispatchEvent(new Event("radio"));
				}
			}
		};
		return {
			"add":add,
			"remove":remove,
			"save":save,
			"load":load,
			"clearSaves":clearSaves,
			"radio":radio
		}
	})();
	var editor={
		"startEdit":start_edit,
		"edit":edit,
		"saveFile":file.save,
		"closeFile":file.close,
		"filter":filter
	};
	Object.defineProperty(editor,"file",{
		"get":function(){return file.json},
		"set":function(){console.error("Cannot assign to this property!")},
		"configrable":false,
		"enumerable":true
	});
	return editor;
})();

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
	FileAPI.read(file,4,function(text){
		try {
			var data=JSON.parse(text);
		} catch(error) {
			window_board.display("选择的不是 JSON 文件！","错误！");
			return false;
		};
		editor.startEdit(data,file.name);
	});
});
document.getElementById("file_S").addEventListener("click",editor.saveFile);
document.getElementById("file_C").addEventListener("click",editor.closeFile);
document.getElementById("filter_S").addEventListener("click",editor.filter.save);
document.getElementById("filter_C").addEventListener("click",editor.filter.clearSaves);
document.getElementById("filter_add_button").addEventListener("click",editor.filter.add);
document.getElementById("index_set").addEventListener("input",editor.filter.radio.toAir);
document.getElementById("filter_0_path").addEventListener("input",editor.filter.radio.toInside);
document.getElementById("filter_0_edit").addEventListener("radio",editor.filter.radio.listener);
document.getElementById("filter_0_edit").addEventListener("input",editor.edit);
editor.filter.load();