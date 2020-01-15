# BSIF 函数库（BSFL）手册
## AJAX 函数
### 用途
发送同步或异步 XMLHttpRequest 请求。
### 用法
AJAX(parameter)
### 参数
#### parameter
必填。  
设置请求的各项参数。  
类型为对象，包含如下子对象：
##### method
可缺省。  
请求的方式。  
类型为字符串，可选以下二者之一：  
"get"，"post"。  
默认值为 "get" 。
##### url
必填。  
请求的内容的地址。  
类型为字符串。
##### async
可缺省。  
设置请求是否为异步请求。  
类型为布尔型。  
默认值为 true 。
##### username
可缺省。  
设置请求中使用的用户名。  
类型为字符串。  
默认值为 null 。
##### password
可缺省。  
设置请求中使用的密码。  
类型为字符串。  
默认值为 null 。
##### send
可缺省。  
设置发送给服务器的数据。  
默认值为 null 。
##### cache
可缺省。  
设置是否允许使用浏览器缓存。  
类型为布尔型。  
默认值为 true 。
##### success
可缺省。  
设置当请求成功响应时的回调函数。  
会向该函数传递请求响应的 responseText 。  
默认为空函数。
##### fail
可缺省。  
设置当请求响应失败时的回调函数。  
会向该函数传递请求的状态代码。  
默认为空函数。
### 示例
AJAX({"url":"/path/file.backname","async":true,"success":funtion(){null}})
## getJSON 函数
### 用途
发送 AJAX 请求，并将响应的内容解析为 JSON 对象。
### 用法
getJSON(url,callback,AllowCache)
### 参数
#### url
必填。  
请求的文件的地址。  
类型为字符串。
#### callback
可缺省。  
设置当请求成功响应时的回调函数。  
会向该函数传递经过解析的 JSON 对象。  
默认为空函数。
#### AllowCache
可缺省。  
设置是否允许使用浏览器缓存。  
类型为布尔型。  
默认值为 true 。
## getXML 函数
### 用途
发送 AJAX 请求，并将响应的内容解析为 XML 文档。
### 用法
getXML(url,callback,AllowCache)
### 参数
#### url
必填。  
请求的文件的地址。  
类型为字符串。
#### callback
可缺省。  
设置当请求成功响应时的回调函数。  
会向该函数传递经过解析的 XML 文档。  
默认为空函数。
#### AllowCache
可缺省。  
设置是否允许使用浏览器缓存。  
类型为布尔型。  
默认值为 true 。
## EmptyElement 函数
### 用途
将选择的元素的内容清空。
### 用法
EmptyElement(TargetElement)
### 参数
#### TargetElement
必填。  
需要清空的目标元素。
## Load 函数
### 用途
向元素加载指定文件的内容。
### 用法
Load(url,TargetElement,AllowCache)
### 参数
#### url
必填。  
请求的文件的地址。  
类型为字符串。
#### TargetElement
必填。  
需要加载内容的目标元素。
#### AllowCache
可缺省。  
设置是否允许使用浏览器缓存。  
类型为布尔型。  
默认值为 true 。
## Each 函数
### 用途
遍历数组或对象。  
由于使用 for in 实现，在 iOS 系统上的某些浏览器可能出现重复遍历，您可以考虑自行编写遍历函数或等待本函数库的后续发布版本。
### 用法
Each(obj,action)
### 参数
#### obj
必填。  
需要遍历的数组或对象。
#### action
必填。  
对遍历的每个子项执行的操作。  
类型为函数。  
会向该函数传递两个参数：  
当 obj 为对象时，传递键值对，(键，值)。  
当 obj 为数组时，传递位值对，(位，值)。