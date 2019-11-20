module.exports = function (context, req) {
  var data = req.body
  if (!data) return context.done("Missing a request body")
  if (!data.action) return context.done("Missing a body.action parameter")


  auth.getAccessToken().then(function (token) {

      var key = data.action.toLowerCase()

      switch (key) {
        case 'manager':
          graph.readManager(token, data.query, 0, processResult)
          break;
        case 'newdoc':
          var params = data.query.split("|")

          var sourceGroupId = params.length > 0 ? params[0] : ''
          var itemId = params.length > 1 ? params[1] : '/'
          var driveId = params.length > 1 ? params[2] : '/'
          var id = params.length > 1 ? params[3] : '/'
          var name = params.length > 1 ? params[4] : '/'
          graph.newDoc(token, sourceGroupId, itemId, driveId, id, name, processResult)
          break;
        case 'getgroupdrive':
          var params = data.query.split("|")

          var groupId = params.length > 0 ? params[0] : ''
          graph.getGroupDrive(token, groupId, processResult)
          break;
        case 'getgroupsite':
          var params = data.query.split("|")

          var groupId = params.length > 0 ? params[0] : ''
          graph.getGroupSite(token, groupId, processResult)
          break;
        case 'memberof':
          graph.readGroupMemberShipFor(token, data.query, processResult)
          break;
        case 'matchinggroups':
          graph.matchingGroups(token, data.query, processResult)
          break;
        case 'getgroupdocs':
          var params = data.query.split("|")
          var groupId = params.length > 0 ? params[0] : ''
          var folder = params.length > 1 ? params[1] : '/'
          graph.getGroupDocuments(token, groupId, folder, processResult)
          break;
        case 'sharepointlist':
          var params = data.query.split("|")
          var host = params.length > 0 ? params[0] : ''
          var site = params.length > 1 ? params[1] : ''
          var list = params.length > 2 ? params[2] : ''
          var listfilter = params.length > 3 ? params[3] : ''
          var itemfilter = params.length > 4 ? params[4] : ''
          graph.getSharePointList(token, host, site, list, listfilter, itemfilter, processResult)
          break;          
        case 'getgrouprootfolders':
          var params = data.query.split("|")
          var groupId = params.length > 0 ? params[0] : ''
          graph.getGroupRootFolders(token, groupId,  processResult)
          break;
        case 'getdrivechildren':
          var params =  data.query.split("|")
          var driveId = params.length > 0 ? params[0] : ''
          var itemId = params.length > 1 ? params[1] : ''
          graph.getDriveChildren(token, driveId, itemId, processResult)
          break;
        case 'collaboratewith':
          graph.analyseMembers(token, data.query, processResult)

          break;
        case 'invite':
        var params = data.query.split("|")
        var userId = params[0]
        var groupId = params[1]
          graph.invite(token, userId,"https://teams.microsoft.com/l/team/19%3a0e28628caa7745af8d1be8b1291d3fe8%40thread.skype/conversations?groupId=b4cc43ed-537d-4111-907d-a8eb4dabd7e8&tenantId=df96b8c9-51a1-40cf-b8b1-4514be8e9668", processResult)

          break;  
        case 'addcrm':

          var params = data.query.split("|")


          graph.addcrm(token, params[0],params[1],params[2],params[3], processResult)

          break;  
        case 'addmember':
          var params = data.query.split("|")
          var userId = params[0]
          var groupId = params[1]
          graph.addmember(token, userId,groupId,  processResult)
          break;  
        case 'copyfile':
          var params = data.query.split("|")

          if (params.length < 5 ){
            processResult("Wrong number of parameters ")
          }else{
          
            graph.copyfile(token, params[0],params[1],params[2],params[3],params[4], processResult)
          }
          break;

        default:
          processResult("Unsupported " + key)

          break;
      }

    },
    (err) => {
      console.log(err)
    })


  function processResult(error, result) {
    if (error) {
      context.log(json.plain(error))
      context.res = {
        error: error
      };

      return context.done()
    }
    context.log(json.plain(result))

    context.res = {
      data: Array.isArray(result) ? result : [result] // always return an array
    };
    return context.done()

  }
};

var graph = {};

function extractEmails(text) {
  return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
}

graph.analyseMembers = (token, emailAddresses, cb) => {


  var addresses = []

  var ar1 = emailAddresses.split("\n")
  ar1.forEach(element1 => {
    var ar2 = element1.split(";")
    ar2.forEach(element2 => {

      var smptAddresses = extractEmails(element2)
      smptAddresses.forEach(smtp => {
        addresses.push({
          checked: false,
          smtp
        })
      })

    })
  });

  var results = []
  var x = addresses.length
  addresses.forEach(address => {
    graph.readUser(token, address.smtp, 0, (err, user) => {
      x--
      address.user = user
      address.err = err
      results.push(address)
      if (x < 1) {
        cb(null, results)
        address.checked = true
      }
    })
  })




}
graph.invite = (token, emailAddress,invitationRedirectUrl, cb) => {


  var msg = 
  {
    "invitedUserEmailAddress": emailAddress,
    "inviteRedirectUrl": invitationRedirectUrl,
    "invitedUserDisplayName": emailAddress,
    "sendInvitationMessage": false,
        "invitedUserMessageInfo": {
            "customizedMessageBody": "We are really happy to invite you to the JUMPTO365 #Insider program ",
            "ccRecipients": [
              {
                "emailAddress": {
                  "name": "Niels",
                  "address": "niels@jumpto365.com"
                }
              }
            ]
        }
}
  post(token, `https://graph.microsoft.com/v1.0/invitations`, msg, 
  function (err ,response) {
    
    if (err){
      return cb(err)
    }
    cb(null,response)
    
  })



}
graph.addcrm = (token, emailAddress,first,last,tag, cb) => {


  var msg = 
  {
    "properties": [
      {
        "property": "firstname",
        "value": first
      },
      {
        "property": "lastname",
        "value": last
      },
      {
        "property": "internal_categories",
        "value": tag
      },
      // {
      //   "property": "phone",
      //   "value": "@{body('Signin')['mobilePhone']}"
      // },
      // {
      //   "property": "jobtitle",
      //   "value": "@{body('Signin')['jobTitle']}"
      // },
      // {
      //   "property": "country",
      //   "value": "@{body('Signin')['country']}"
      // }
    ]
  }

   
  post2(token, `https://api.hubapi.com/contacts/v1/contact/createOrUpdate/email/${emailAddress}/?hapikey=f305d92f-b379-4063-95fb-57e9d56976f2`, msg, 
  function (err ,response) {
    
    if (err){
      return cb(err)
    }
    cb(null,response)
    
  })



}
graph.addmember = (token, userId,groupId, cb) => {


  var msg = 
  {
    "@odata.id": `https://graph.microsoft.com/beta/directoryObjects/${userId}`
  }
  post(token, `https://graph.microsoft.com/beta/groups/${groupId}/members/$ref`, msg, 
  function (err,response ) {
    
    if (err){
      return cb(err)
    }
    cb(null)
    
  })



}

graph.getSharePointList = (token, host, site, list, listfilter, itemfilter, cb) => {
  get(token, `https://graph.microsoft.com/v1.0/sites/${host}:${site}:/lists/${list}/items?${listfilter}`, function (e, items) {
  if (e) return cb(e)
    var itemList = []

    function next() {
      if (items.length === 0) return cb(null, itemList)
      var item = items.pop()
      
      get(token, `https://graph.microsoft.com/v1.0/sites/${host}:${site}:/lists/${list}/items/${item.id}?${itemfilter}`, function (e, item) {
        if (e) return cb(e)
        itemList.push(item)
        next()
      })
    }

    next()

  })
}

graph.readGroupMembers = function (token, groupId, cb) {
  get(token, 'https://graph.microsoft.com/beta/groups/' + groupId + '/members?$select=mail,department,displayName,country,accountEnabled,userPrincipalName,givenName,surname,id', cb)
};

graph.readGroupMemberShipFor = function (token, upn, cb) {
  get(token, 'https://graph.microsoft.com/v1.0/users/' + upn + '/memberOf', cb)
};

graph.readManager = function (token, userPrincipalName, index, cb) {
  get(token, 'https://graph.microsoft.com/v1.0/users/' + userPrincipalName + '/manager', cb, null, index)
}

graph.readUser = function (token, userPrincipalName, index, cb) {
  get(token, 'https://graph.microsoft.com/v1.0/users/' + userPrincipalName, cb, null, index)
}


graph.matchingGroups = function (token, searchText, cb) {
  get(token, `https://graph.microsoft.com/v1.0/groups?$select=displayName,id,mail,mailNickname,groupTypes,description&$filter=startsWith(displayName,'${searchText}')`, cb)
}

graph.findGroup = function (token, searchText, cb) {
  get(token, `https://graph.microsoft.com/v1.0/groups?$select=displayName,id,mail,mailNickname,groupTypes,description&$filter=mailNickname eq '${searchText}'`, cb)
}

graph.getGroupDocuments = function (token, groupId, folderName, cb) {
  get(token, `https://graph.microsoft.com/beta/groups/${groupId}/drive/items/root:${folderName}:/children`, cb)
}

graph.getGroupDrive = function (token, groupId, cb) {
  get(token, `https://graph.microsoft.com/beta/groups/${groupId}/drive`, cb)
}
graph.getGroupSite = function (token, groupId, cb) {
  get(token, `https://graph.microsoft.com/beta/groups/${groupId}/sites/root`, cb)
}

graph.getDriveChildren = function (token, driveId,itemId, cb) {
  get(token, `https://graph.microsoft.com/beta/drives/${driveId}/items/${itemId}/children`, cb)
}

graph.getGroupRootFolders = function (token, groupId, cb) {
  get(token, `https://graph.microsoft.com/beta/groups/${groupId}/drive/items/root/children`, cb)
}

graph.getSharePointSiteByName = function (token, hostName,relativePath, cb) {
  get(token, `https://graph.microsoft.com/v1.0/sites/${hostName}:/sites/${relativePath}`, cb)
}

graph.getSharePointSiteDrive = function (token, id,path, cb) {
  get(token, `https://graph.microsoft.com/v1.0/sites/${id}/drive/root:/${path}:/children`, cb)
}


graph.copyfile = function(token,groupNickName,fromFolder,fromName, toFolder,toName,cb){

graph.findGroup(token,groupNickName,function (err,groups){
    if (err) return cb(err)
    if (groups.length!==1) return cb("Did't find a unique group")
    var group = groups[0]
    graph.getGroupDocuments(token,group.id,"/" + fromFolder,function (err,fromItems){
      if (err) return cb(err)
      var match = _.find(fromItems,{"name":fromName})
      graph.getGroupRootFolders(token,group.id,function (err,targetFolders){
        if (err) return cb(err)
        var destFolder = _.find(targetFolders,{"name":toFolder})
        if (!destFolder) return cb("Did't find target folder")
        graph.newDoc(token,group.id,match.id,destFolder.parentReference.driveId,  destFolder.id,toName,function (err,result){
          if (err) return cb(err)
          return cb(null,result)
        })
      })
     })
       
    })


}


function lookupFile(token,driveId,id,name,iterations,cb){
    // Content have been copied 
    graph.getDriveChildren(token,driveId,id,function (err,result){
      if (err){
        return cb(err)
      }
      // content of destination folder 


    for (let index = 0; index < result.length; index++) {

      const file = result[index];

      console.log("Comparing",file.name,name)
      if (file.name === name){
        // match found  
        console.log("Match found")
        return cb(null,file)
      }
    }

        
    function retry(){
      console.log("Retrying",iterations)
      //
      if (iteration > 10){
        return (cb(`Think that the file has been created, but could not find a reference to if. Filename is ${name} - Tryed ${iterations} to find it `))
      }
      lookupFile(token,driveId,id,name,iterations+1,cb)
      

    }
    // no match found so we will wait a second a try again
    setTimeout(retry, 1000)
      
    
    })
  }

graph.newDoc = function (token, sourceGroupId, itemId, driveId, id, name, cb) {


  post(token, `https://graph.microsoft.com/beta/groups/${sourceGroupId}/drive/items/${itemId}/copy`, {
    "parentReference": {
      "driveId": driveId,
      "id": id
    },
    "name": name
  }, function (err){ // no result from that call - by design from Microsoft
    if (err){
      return cb(err)
    }

    // so we fill try to find a referece our self
    lookupFile(token,driveId,id,name,0,cb)
  })


}






var fs = require("fs");
var json = require("format-json")
var _ = require("lodash")
var request = require('request');
var globalConfig = require("../../config")
//var Q = require('q');


var auth = {};
module.exports.auth = auth
var config = {
  clientId:  globalConfig.keys.ptostorage.app,
  clientSecret: globalConfig.keys.ptostorage.key,
  tokenEndpoint: 'https://login.microsoftonline.com/79dc228f-c8f2-4016-8bf0-b990b6c72e98/oauth2/token',
};



auth.getAccessToken = function () {
  return new Promise((resolve, reject) => {

    var requestParams = {
      grant_type: 'client_credentials',
      client_id: config.clientId,
      client_secret: config.clientSecret,
      resource: 'https://graph.microsoft.com'
    };

    request.post({
      url: config.tokenEndpoint,
      form: requestParams
    }, function (err, response, body) {
      var parsedBody = JSON.parse(body);

      if (err) {

        reject(err);
      } else if (parsedBody.error) {
        reject(parsedBody.error_description);
      } else {
        resolve(parsedBody.access_token);
      }
    });
  })
};

function post2(token, url, body, cb) {
  request.post({
    url: url,
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  }, function (err, response, body) {
    var parsedBody;

    if (err) {
      return cb(err);
    } else {

      parsedBody = body === "" ? {} : JSON.parse(body);
      if (parsedBody.error) {
        return cb(
          parsedBody.error
        );
      } else {
        cb(null, parsedBody);
      }
    }
  });

}

function post(token, url, body, cb) {
  request.post({
    url: url,
    headers: {
      'content-type': 'application/json',
      authorization: 'Bearer ' + token
    },
    body: JSON.stringify(body)
  }, function (err, response, body) {
    var parsedBody;

    if (err) {
      return cb(err);
    } else {

      parsedBody = body === "" ? {} : JSON.parse(body);
      if (parsedBody.error) {
        return cb(
          parsedBody.error
        );
      } else {
        cb(null, parsedBody);
      }
    }
  });

}

function get(token, url, cb, appendTo, index, retrycount) {
  console.log("getting", url, appendTo === true)
  request.get({
    url: url,
    headers: {
      'content-type': 'application/json',
      authorization: 'Bearer ' + token
    }
  }, function (err, response, body) {
    var parsedBody;

    if (err) {
      var errCounter = retrycount ? retrycount + 1 : 1;
      if (errCounter > 3) {
        return cb(err, null, index);
      } else {
        // retry 
        console.log("retry #", errCounter)
        return get(token, url, cb, appendTo, index, errCounter)
      }
    }

    parsedBody = JSON.parse(body);
    if (parsedBody.error) {
      return cb(
        parsedBody.error, null, index
      );
    }

    if (parsedBody['@odata.nextLink']) {
      var data;
      if (!appendTo) {
        data = parsedBody.value
      } else {
        data = appendTo.concat(parsedBody.value)
      }

      return get(token, parsedBody['@odata.nextLink'], cb, data, index)
    }

    if (appendTo) {
      cb(null, appendTo.concat(parsedBody.value), index)
    } else {
      if (parsedBody.value) {
        cb(null, parsedBody.value, index);
      } else {
        cb(null, parsedBody, index);
      }
    };
  });
};

module.exports.getRaw = (token, url) => {
  console.log("getting", url)

  return new Promise((resolve, reject) => {
    
  
  request.get({
    url: url,
    headers: {
      authorization: 'Bearer ' + token
    }
  }, function (err, response, body) {
   

    if (err) {
        return resolve({hasError:true,error:err})
    }
    resolve({hasError:false,result:body})
    
  });
});
};


module.exports.get = (token,url) => {
  return new Promise((resolve, reject) => {
    get(token,url,(error,result)=>{
      if (error) return reject(error)
      resolve(result)})  
  });
  

}