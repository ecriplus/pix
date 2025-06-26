This doc has been generated on 6/16/2025, 11:36:42 AM with `scripts/generate-api-documentation.js`. See package.json.

---
## Modules

<dl>
<dt><a href="#module_OrganizationApi">OrganizationApi</a></dt>
<dd></dd>
<dt><a href="#module_OrganizationFeaturesApi">OrganizationFeaturesApi</a></dt>
<dd></dd>
</dl>

<a name="module_OrganizationApi"></a>

## OrganizationApi

* [OrganizationApi](#module_OrganizationApi)
    * [~getOrganization(id)](#module_OrganizationApi..getOrganization) ⇒ <code>Promise.&lt;OrganizationDTO&gt;</code>
    * [~OrganizationDTO](#module_OrganizationApi..OrganizationDTO) : <code>object</code>

<a name="module_OrganizationApi..getOrganization"></a>

### OrganizationApi~getOrganization(id) ⇒ <code>Promise.&lt;OrganizationDTO&gt;</code>
**Kind**: inner method of [<code>OrganizationApi</code>](#module_OrganizationApi)  

| Param | Type |
| --- | --- |
| id | <code>number</code> | 

<a name="module_OrganizationApi..OrganizationDTO"></a>

### OrganizationApi~OrganizationDTO : <code>object</code>
**Kind**: inner typedef of [<code>OrganizationApi</code>](#module_OrganizationApi)  
**Properties**

| Name | Type |
| --- | --- |
| id | <code>number</code> | 
| name | <code>string</code> | 
| type | <code>string</code> | 
| logoUrl | <code>string</code> | 
| isManagingStudents | <code>boolean</code> | 
| identityProvider | <code>string</code> | 

<a name="module_OrganizationFeaturesApi"></a>

## OrganizationFeaturesApi

* [OrganizationFeaturesApi](#module_OrganizationFeaturesApi)
    * [~getAllFeaturesFromOrganization(organizationId)](#module_OrganizationFeaturesApi..getAllFeaturesFromOrganization) ⇒ <code>Promise.&lt;OrganizationFeaturesDTO&gt;</code>
    * [~OrganizationFeatureItemDTO](#module_OrganizationFeaturesApi..OrganizationFeatureItemDTO) : <code>object</code>
    * [~OrganizationFeaturesDTO](#module_OrganizationFeaturesApi..OrganizationFeaturesDTO) : <code>object</code>

<a name="module_OrganizationFeaturesApi..getAllFeaturesFromOrganization"></a>

### OrganizationFeaturesApi~getAllFeaturesFromOrganization(organizationId) ⇒ <code>Promise.&lt;OrganizationFeaturesDTO&gt;</code>
**Kind**: inner method of [<code>OrganizationFeaturesApi</code>](#module_OrganizationFeaturesApi)  

| Param | Type |
| --- | --- |
| organizationId | <code>number</code> | 

<a name="module_OrganizationFeaturesApi..OrganizationFeatureItemDTO"></a>

### OrganizationFeaturesApi~OrganizationFeatureItemDTO : <code>object</code>
**Kind**: inner typedef of [<code>OrganizationFeaturesApi</code>](#module_OrganizationFeaturesApi)  
**Properties**

| Name | Type |
| --- | --- |
| name | <code>string</code> | 
| params | <code>object</code> \| <code>Array.&lt;string&gt;</code> | 

<a name="module_OrganizationFeaturesApi..OrganizationFeaturesDTO"></a>

### OrganizationFeaturesApi~OrganizationFeaturesDTO : <code>object</code>
**Kind**: inner typedef of [<code>OrganizationFeaturesApi</code>](#module_OrganizationFeaturesApi)  
**Properties**

| Name | Type |
| --- | --- |
| features | <code>Array.&lt;OrganizationFeatureItemDTO&gt;</code> | 
| hasLearnersImportFeature | <code>boolean</code> | 
| hasOralizationFeature | <code>boolean</code> | 


