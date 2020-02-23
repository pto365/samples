var auth = require("..").auth;
var graphGet = require("..").get;
var graphGetRaw = require("..").getRaw;
var json = require("format-json");
var fs = require("fs-extra")
var path = require("path") 

function get(url) {
  return new Promise(async (resolve, reject) => {
    var token = await auth.getAccessToken();
    graphGet(token, url)
      .then(result => resolve({ hasError: false, result }))
      .catch(error => resolve({ hasError: true, error: error.message }));
  });
}
function getFile(url) {
    return new Promise(async (resolve, reject) => {
      var token = await auth.getAccessToken();
      graphGetRaw(token, url)
        .then(result => resolve({ hasError: false, result }))
        .catch(error => resolve({ hasError: true, error: error.message }));
    });
  }
async function file(url) {
  //"https://365adm.sharepoint.com/sites/McCool/Shared%20Documents/General/Images/Gulhat.jpg"
  //https://graph.microsoft.com/v1.0/sites/365adm.sharepoint.com:/sites/McCool

  // https://graph.microsoft.com/v1.0/sites/365adm.sharepoint.com,c07c0509-7117-4769-a291-8c95dd49c07e,e1b3eb16-5a55-4891-bd82-9a6b67decc6c
  // https://graph.microsoft.com/v1.0/sites/365adm.sharepoint.com:/sites/McCool:/drive

  // driveid = b!CQV8wBdxaUeikYyV3UnAfhbrs-FVWpFIvYKaa2fezGzVohIZL4e4R7-FtbmGhUBA
  //https://graph.microsoft.com/v1.0/drives/b!CQV8wBdxaUeikYyV3UnAfhbrs-FVWpFIvYKaa2fezGzVohIZL4e4R7-FtbmGhUBA/root:/General/Images/Hvidfuckyou!.jpg

  return new Promise((resolve, reject) => {
    get(
      `https://graph.microsoft.com/v1.0/drives/b!CQV8wBdxaUeikYyV3UnAfhbrs-FVWpFIvYKaa2fezGzVohIZL4e4R7-FtbmGhUBA/root:/General/Images/Hvidfuckyou!.jpg`
    ).then(r => {
      if (!r.hasError) {
        getFile(r.result["@microsoft.graph.downloadUrl"])
          .then(file => {
     
            
            fs.writeFileSync(path.join(__dirname,"xx.jpg"),file.result.result )             
                
                
            resolve({ hasError: false, result: file });
          })
          .catch(error => {
            resolve({ hasError: true, error });
          });
      }
    });
  });
}

async function me(upn) {
  return get(`https://graph.microsoft.com/v1.0/users/${upn}`);
}

async function memberOf(upn) {
  return get(`https://graph.microsoft.com/v1.0/users/${upn}/memberOf`);
}
async function teamChilds(groupIdForTeams) {
  return get(
    `https://graph.microsoft.com/v1.0/groups/${groupIdForTeams}/drive/root/children`
  );
}

async function run() {
  console.log(await me("niels@jumpto365.com"));
  // var groups = await memberOf("niels@jumpto365.com")
  // if (groups.result){
  //     groups.result.forEach(group=>{
  //         console.log(group.id,group.displayName)
  //     })
  // }
  var groupChildren = await teamChilds("5fd5fb86-cf11-4ce1-9e44-6e9a981c95e7");
  if (groupChildren.result) {
    groupChildren.result.forEach(group => {
      console.log(group.folder ? true : false, group.id, group.name);
    });
  }
}

//run();
module.exports = {};
file().then(f => {
  console.log(json.plain(f.result));
});
