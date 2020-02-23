var func = require("./index")
var context = require("./context")



var groupId = "a996f5ca-d5bc-41de-b8e4-57c2fe725bc4"


func(context, {
  body: {
    action: "GetGroupDrive",
    query: `${groupId}`
  }
});