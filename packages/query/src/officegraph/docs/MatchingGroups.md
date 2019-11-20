# MatchingGroups

Search for any groups by prefix

    action = "matchingGroups"
    query = ${text}

[Graph Documenation](https://developer.microsoft.com/en-us/graph/docs/api-reference/beta/api)

## Sample

```javascript
func(context, {
  body: {
    action: "matchingGroups",
    query: "sandbox"
  }
});
```

### Output

```json
[
  {
    "@odata.type": "#microsoft.graph.group",
    "id": "210f31e6-86c5-49b1-bb38-d5500392b28a",
    "deletedDateTime": null,
    "classification": null,
    "createdDateTime": "2018-05-24T07:03:01Z",
    "creationOptions": [],
    "description": "Internal Services",
    "displayName": "sp-site-internal-services",
    "groupTypes": [],
    "mail": null,
    "mailEnabled": false,
    "mailNickname": "sp-site-internal-services",
    "onPremisesLastSyncDateTime": "2018-05-31T23:48:50Z",
    "onPremisesProvisioningErrors": [],
    "onPremisesSecurityIdentifier":
      "S-1-5-21-17364768-1056288835-3849017897-30860",
    "onPremisesSyncEnabled": true,
    "preferredDataLocation": null,
    "proxyAddresses": [],
    "renewedDateTime": "2018-05-24T07:03:01Z",
    "resourceBehaviorOptions": [],
    "resourceProvisioningOptions": [],
    "securityEnabled": true,
    "visibility": null
  }
]
```
