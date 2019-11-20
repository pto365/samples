# GetGroupDrive

Get the drive for a group

    action = "GetGroupDrive"
    query = ${groupId}

[Graph Documenation](https://developer.microsoft.com/en-us/graph/docs/api-reference/beta/api)

## Sample

```javascript
func(context, {
  body: {
    action: "GetGroupDrive",
    query: `${groupId}`
  }
});
```

### Output

```json
index.js:246
{
  "@odata.context": "https://graph.microsoft.com/beta/$metadata#drives/$entity",
  "createdDateTime": "2018-04-25T21:45:05Z",
  "description": "",
  "id": "b!Tm8xDlVNqk-NRCy-AHliv0D6UKoog-xIjZuADlqGeIsrE_QVPJ13TbGzzHumtMC1",
  "lastModifiedDateTime": "2018-05-08T08:55:11Z",
  "name": "Documents",
  "webUrl": "https://christianiabpos.sharepoint.com/sites/SandboxCardsTechnicalReferenceGuideRefactoring/Shared%20Documents",
  "driveType": "documentLibrary",
  "createdBy": {
    "user": {
      "displayName": "System Account"
    }
  },
  "owner": {
    "group": {
      "email": "SandboxCardsTechnicalReferenceGuideRefactoring@CHRISTIANIABPOS.onmicrosoft.com",
      "id": "a996f5ca-d5bc-41de-b8e4-57c2fe725bc4",
      "displayName": "Sandbox Cards Technical Reference Guide Refactoring"
    }
  },

```
