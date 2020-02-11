/**
 * 
 * MIT License

Copyright (c) 2019 PnP

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

var axios = require("axios")
const ASSETS =
  "https://github.com/pnp/custom-learning-office-365/raw/master/docs/learningpathways/v3/assets.json";
const METADATA =
  "https://github.com/pnp/custom-learning-office-365/raw/master/docs/learningpathways/v3/metadata.json";
const PLAYLISTS =
  "https://github.com/pnp/custom-learning-office-365/raw/master/docs/learningpathways/v3/playlists.json";

function load() {
  return new Promise((resolve, reject) => {
    var toLoad = 3;
    var data = {};
    function doneLoading() {
      resolve(data);
    }

    axios
      .get(ASSETS)
      .then(result => {
        data.assets = result.data;
        toLoad--;
        if (toLoad === 0) {
          doneLoading();
        }
      })
      .catch(error => {
        return reject(error.message);
      });
    axios
      .get(METADATA)
      .then(result => {
        data.metadata = result.data;
        toLoad--;
        if (toLoad === 0) {
          doneLoading();
        }
      })
      .catch(error => {
        return reject(error.message);
      });
    axios
      .get(PLAYLISTS)
      .then(result => {
        data.playlists = result.data;
        toLoad--;
        if (toLoad === 0) {
          doneLoading();
        }
      })
      .catch(error => {
        return reject(error.message);
      });
  });
}
module.exports = {loadLearningPath:load} 
// load().then(data=>{
//     fs.writeJSONSync(path.join(__dirname,"LearningPathways.json"),data)
//     console.log("loaded")
// }).catch(error=>{
//     error.log(error)
// })