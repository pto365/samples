# MemberOf

Lookup manager for a given user

    action = "manager"
    query = ${upn}

[Graph Documenation](https://developer.microsoft.com/en-us/graph/docs/api-reference/beta/api)

## Sample

```javascript
func(context, {
    body: {
        action: "manager",
        query: "ngjoh@nets.eu"
    }
});
```

### Output

```json
{
  "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#directoryObjects/$entity",
  "@odata.type": "#microsoft.graph.user",
  "id": "b5d22c70-2614-4ae2-936b-1849b34a2537",
  "businessPhones": [
    "+4722898777"
  ],
  "displayName": "Trond Sjøli",
  "givenName": "Trond",
  "jobTitle": null,
  "mail": "tsjol@nets.eu",
  "mobilePhone": "+4795103929",
  "officeLocation": "20215",
  "preferredLanguage": null,
  "surname": "Sjøli",
  "userPrincipalName": "tsjol@nets.eu"
}   

```
