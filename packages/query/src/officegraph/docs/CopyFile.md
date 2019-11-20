# NewDoc

    action = "copyfile"
    query = ${groupNickName}:${sourceFolder}:${sourceFileName}:${destinationFolderName}:${destinationFileName}




## Sample
```javascript

var groupNickName = "TeamName"
var sourceFolder = "templates"
var sourceFileName = "Template.docx"
var destinationFolderName = "Drafts"
var destinationFileName = "NewFile.docx"



func (context,{body:{action:"CopyFile",
query:`${groupNickName}:${sourceFolder}:${sourceFileName}:${destinationFolderName}:${destinationFileName}`}});

```
### Output

```json
{

  "@microsoft.graph.downloadUrl": "https://christianiabpos.sharepoint.com/sites/SandboxCardsTechnicalReferenceGuideRefactoring/_layouts/15/download.aspx?UniqueId=8cf2075b-74e5-42b0-8e7d-e837b70b01ec&Translate=false&tempauth=eyJ0eXAiOiJKV1QiLCJhbGciOiJub25lIn0.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvY2hyaXN0aWFuaWFicG9zLnNoYXJlcG9pbnQuY29tQDc5ZGMyMjhmLWM4ZjItNDAxNi04YmYwLWI5OTBiNmM3MmU5OCIsImlzcyI6IjAwMDAwMDAzLTAwMDAtMGZmMS1jZTAwLTAwMDAwMDAwMDAwMCIsIm5iZiI6IjE1MzA2OTA2NDMiLCJleHAiOiIxNTMwNjk0MjQzIiwiZW5kcG9pbnR1cmwiOiJmd25sSW9aNkU4M0M2TmtiSFIxck5RSDdTOEtYZ0hJTEdiSVBkaE41dHZvPSIsImVuZHBvaW50dXJsTGVuZ3RoIjoiMTc5IiwiaXNsb29wYmFjayI6IlRydWUiLCJjaWQiOiJOVFEyTURFd01qUXRZMlJrTmkwME16azJMVGc0WVdNdFlXSmpPR00yWlRnMk1qazUiLCJ2ZXIiOiJoYXNoZWRwcm9vZnRva2VuIiwic2l0ZWlkIjoiTUdVek1UWm1OR1V0TkdRMU5TMDBabUZoTFRoa05EUXRNbU5pWlRBd056azJNbUptIiwiYXBwX2Rpc3BsYXluYW1lIjoiRVVDIFJvbGxvdXQgTWFuYWdlciBJSSIsIm5hbWVpZCI6IjBhYjQ4ZTFhLTM1NDMtNDRjMy05MTZjLWU2NGRkN2IyODM1Y0A3OWRjMjI4Zi1jOGYyLTQwMTYtOGJmMC1iOTkwYjZjNzJlOTgiLCJyb2xlcyI6Imdyb3VwLnJlYWQgZ3JvdXAud3JpdGUgYWxsZmlsZXMucmVhZCBhbGxwcm9maWxlcy5yZWFkIiwidHQiOiIxIiwidXNlUGVyc2lzdGVudENvb2tpZSI6bnVsbH0.NWFKQnhqbjJwYjgySTN4cmVIMmhkdkprSE5sSGhIOGdReVZ0Slg3elR4dz0&ApiVersion=2.0",
  "createdDateTime": "2018-05-08T11:15:32Z",
  "eTag": "\"{8CF2075B-74E5-42B0-8E7D-E837B70B01EC},2\"",
  "id": "01XPS5E523A7ZIZZLUWBBI47PIG63QWAPM",
  "lastModifiedDateTime": "2018-07-04T07:50:43Z",
  "name": "NewFile.docx",
  "webUrl": "https://XXXXXX.sharepoint.com/sites/TeamName/_layouts/15/Doc.aspx?sourcedoc=%7B8CF2075B-74E5-42B0-8E7D-E837B70B01EC%7D&file=testfilef42af730-7f5e-11e8-919c-1d26fe14a159.docx&action=default&mobileredirect=true",
  "cTag": "\"c:{8CF2075B-74E5-42B0-8E7D-E837B70B01EC},4\"",
  "size": 56609,
  "createdBy": {
    "user": {
      "email": "ngjoh@nets.eu",
      "id": "9beef235-49d8-49cd-8c28-aad5aeab084b",
      "displayName": "Niels Gregers Johansen"
    }
  },
  "lastModifiedBy": {},
  "parentReference": {
    "driveId": "b!Tm8xDlVNqk-NRCy-AHliv0D6UKoog-xIjZuADlqGeIsrE_QVPJ13TbGzzHumtMC1",
    "driveType": "documentLibrary",
    "id": "01XPS5E56VBO5RVKC3LRB3DUJMCCITS5L2",
    "path": "/drives/b!Tm8xDlVNqk-NRCy-AHliv0D6UKoog-xIjZuADlqGeIsrE_QVPJ13TbGzzHumtMC1/root:/General"
  },
  "file": {
    "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  },
  "fileSystemInfo": {
    "createdDateTime": "2018-05-08T11:15:32Z",
    "lastModifiedDateTime": "2018-07-04T07:50:43Z"
  }
}   
```