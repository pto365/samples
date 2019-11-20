var func = require("./index")
var context = require("./context")
const uuidv1 = require('uuid/v1');


var sourceGroupId = "a996f5ca-d5bc-41de-b8e4-57c2fe725bc4"
var itemId = "01XPS5E56STWFQ5ODOJBH37QZL6SXRGMTY"
var driveId = "b!Tm8xDlVNqk-NRCy-AHliv0D6UKoog-xIjZuADlqGeIsrE_QVPJ13TbGzzHumtMC1"
var id = "01XPS5E56VBO5RVKC3LRB3DUJMCCITS5L2"
var filenameprefix = uuidv1()
var name = "testfile" + filenameprefix + ".docx"



func (context,{body:{action:"newDoc",
query:`${sourceGroupId}:${itemId}:${driveId}:${id}:${name}`}});


