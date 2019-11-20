# GetGroupDocs

Get the content of a folder

    action = "getGroupDocs"
    query = ${groupId}:${folder}

[Graph Documenation](https://developer.microsoft.com/en-us/graph/docs/api-reference/beta/api)

## Sample

```javascript
func(context, {
  body: {
    action: "getGroupDocs",
    query: `a996f5ca-d5bc-41de-b8e4-57c2fe725bc4:/general`
  }
});
```

### Output

```json

[
  {
    "@microsoft.graph.downloadUrl": "https://christianiabpos.sharepoint.com/sites/SandboxCardsTechnicalReferenceGuideRefactoring/_layouts/15/download.aspx?UniqueId=cec8ce9a-e565-40a1-8485-3d38320f0865&Translate=false&tempauth=eyJ0eXAiOiJKV1QiLCJhbGciOiJub25lIn0.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvY2hyaXN0aWFuaWFicG9zLnNoYXJlcG9pbnQuY29tQDc5ZGMyMjhmLWM4ZjItNDAxNi04YmYwLWI5OTBiNmM3MmU5OCIsImlzcyI6IjAwMDAwMDAzLTAwMDAtMGZmMS1jZTAwLTAwMDAwMDAwMDAwMCIsIm5iZiI6IjE1MzA1OTM3MDUiLCJleHAiOiIxNTMwNTk3MzA1IiwiZW5kcG9pbnR1cmwiOiJQMzM1NTVoekZtY1kzd3JKUkhGbVZ3aVBBOWtwOENlZncwNEhSdUVIWVFvPSIsImVuZHBvaW50dXJsTGVuZ3RoIjoiMTc5IiwiaXNsb29wYmFjayI6IlRydWUiLCJjaWQiOiJOekEyTm1RMU1Ua3RZMkUxTVMwME1EYzBMV0kzTlRVdFpHUm1ZV0V3Tm1FME5XVTIiLCJ2ZXIiOiJoYXNoZWRwcm9vZnRva2VuIiwic2l0ZWlkIjoiTUdVek1UWm1OR1V0TkdRMU5TMDBabUZoTFRoa05EUXRNbU5pWlRBd056azJNbUptIiwiYXBwX2Rpc3BsYXluYW1lIjoiRVVDIFJvbGxvdXQgTWFuYWdlciBJSSIsIm5hbWVpZCI6IjBhYjQ4ZTFhLTM1NDMtNDRjMy05MTZjLWU2NGRkN2IyODM1Y0A3OWRjMjI4Zi1jOGYyLTQwMTYtOGJmMC1iOTkwYjZjNzJlOTgiLCJyb2xlcyI6Imdyb3VwLnJlYWQgZ3JvdXAud3JpdGUgYWxsZmlsZXMucmVhZCBhbGxwcm9maWxlcy5yZWFkIiwidHQiOiIxIiwidXNlUGVyc2lzdGVudENvb2tpZSI6bnVsbH0.WjF3Yy9sWkhJL1BUbGhHYzNyMHdlL2tMcjZCL0NnR1FZSnIrRXpnakQrdz0&ApiVersion=2.0",
    "createdDateTime": "2018-05-08T11:15:32Z",
    "eTag": "\"{CEC8CE9A-E565-40A1-8485-3D38320F0865},3\"",
    "id": "01XPS5E542Z3EM4ZPFUFAIJBJ5HAZA6CDF",
    "lastModifiedDateTime": "2018-06-28T08:51:56Z",
    "name": "80c88da0-7ab0-11e8-ae1b-71da2dafcd18.docx",
    "webUrl": "https://christianiabpos.sharepoint.com/sites/SandboxCardsTechnicalReferenceGuideRefactoring/_layouts/15/Doc.aspx?sourcedoc=%7BCEC8CE9A-E565-40A1-8485-3D38320F0865%7D&file=80c88da0-7ab0-11e8-ae1b-71da2dafcd18.docx&action=default&mobileredirect=true",
]

```
