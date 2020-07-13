---
layout: 'documentation-single'
title: Accounts
description: Manage your learners and their adaptive accounts
keywords: 
order: 0

hero:
    title: Accounts
    text: Manage your learners and their adaptive accounts
---


### Creating User Accounts

Different learning applications have different requirements for creating user accounts. The Knewton API allows accounts to be created in bulk prior to any one user interacting with the system, or one at a time at the time of first interaction by that user. There are two endpoints — `POST /v0/batch` and `POST /v0/accounts` — which facilitate the account creation process. The `batch` endpoint allows accounts to be created in batches of arbitrary size (currently only batch creation of accounts is supported), and is useful for upfront account provisioning, whereas the `accounts` endpoint supports creating accounts one at a time.

The account creation endpoints can only be called by the [system user](/product/glossary/#system-user). Once an account is created by Knewton, it is associated with an external user ID, which must be unique within the learning application. The external user ID is then used as part of the 2-party authentication flow to request [tokens](/product/glossary/#access-token) for that user.

The account ID is returned by the API so the learning application has a way to refer to the user when registering that user in a learning instance in the future. The learning application is responsible for maintaining the mapping between external user IDs (client side) and account IDs (platform side).

[![Screen Shot 2016-06-14 at 5.21.43 PM](/images/Screen-Shot-2016-06-14-at-5.21.43-PM.png)](/images/Screen-Shot-2016-06-14-at-5.21.43-PM.png)



# Accounts

Knewton’s representation of an individual interacting with the Knewton system via a partner system. Generally includes partner’s source system identifier and the user’s unique identifier on the partner’s system. Both learners and instructors may have accounts.

Accounts are not created via REST calls, but rather via the [authentication flow](/developer/authentication-accounts-profiles/).

## POST /accounts

Version: 0

Creates an account with a specified external user ID

### Request/Response JSON Keys

| Parameter | Type | Optional | Immutable | In/Out | Description |
| --- | --- | --- | --- | --- | --- |
| external\_user\_id | String | No | Yes | In/Out | External ID of the account to be created. The ID must be unique for any given set of application credentials.
Any account created this way can be authenticated using token request endpoint and `client_credentials` grant type (see [Authentication](developer/api-reference/accounts/#post-oauthtoken))

**Warning:** External IDs must be completely anonymized and must never contain any personally identifiable information (PII).

 |  |
| email\_verified | Boolean | Yes | No | Out | Indicates whether an account has a verified email address associated with it. |  |
| entitlements | List of Objects | No | No | Out | Entitlements that have been granted to this account. |  |
| id | UUID | No | Yes | Out | Unique ID of this account |  |

### Samples

**URL:**
`https://api.knewton.com/v0/accounts`

**Request Body**

```json
{
"external_user_id" : "abc321"
}
```

**Response Body**

```json
{
"external_user_id" : "abc321",
"entitlements": [],
"id": "828815a2-5038-4352-a681-82c96921ddf5",
"email_verified": false
}
```

<aside class="notice">Current account must have Partner Administrator privileges</aside>

## GET /accounts/current

Version: 0

Retrieves the Account of the user who is currently authenticated via the OAuth flow. This call will typically only be used to ensure OAuth is setup correctly.

### Request/Response JSON Keys

| Parameter | Type | Optional | Immutable | In/Out | Description |
| --- | --- | --- | --- | --- | --- |
| email\_verified | Boolean | Yes | No | Out | Indicates whether an account has a verified email address associated with it. |  |
| id | UUID | No | Yes | Out | Unique ID of this account |  |
| entitlements | List of Objects | No | No | Out | Entitlements that have been granted to this account. |  |
| external\_user\_id | String | No | Yes | Out | External ID of the account |  |

### Samples

**URL:**
`https://api.knewton.com/v0/accounts/current`

**Request Body**

None.

**Response Body**

```json
{
"external_user_id" : "abc123",
"id": "eff3b9cf-df82-477a-ac12-c0e01b90bf6e",
"entitlements": [],
"email_verified": false
}
```

## GET /accounts/{id}

Version: 0

Retrieves the given account.

### Request/Response JSON Keys

| Parameter | Type | Optional | Immutable | In/Out | Description |
| --- | --- | --- | --- | --- | --- |
| email\_verified | Boolean | Yes | No | Out | Indicates whether an account has a verified email address associated with it. |  |
| entitlements | List of Objects | No | No | Out | Entitlements that have been granted to this account. |  |
| external\_user\_id | String | No | Yes | Out | External ID of the account |  |

### Path Parameters

| Parameter | Type | Optional | Immutable | Description |
| --- | --- | --- | --- | --- |
| id | UUID | No | Yes | Unique ID of the account |  |

### Samples

**URL:**
`https://api.knewton.com/v0/accounts/d0effd52-c3a7-4a3c-827a-3ac5eaa049a1`

**Request Body**

None

**Response Body**

```json
{
"external_user_id" : "abc123",
"id": "d0effd52-c3a7-4a3c-827a-3ac5eaa049a1",
"entitlements": [],
"email_verified": false
}
```

<aside class="notice">The current account must either be the account or have partner administrator privileges.</aside>

## DELETE /accounts/{id}

Version: 0

Disables the given account and marks it as inactive. Note that regardless of whether an account has been disabled, any subsequent call to create an account with the same external user ID will fail.

### Path Parameters

| Parameter | Type | Optional | Immutable | Description |
| --- | --- | --- | --- | --- |
| id | UUID | No | No | ID of the account to delete. |  |

### Samples

**URL:**
`https://api.knewton.com/v0/accounts/d0effd52-c3a7-4a3c-827a-3ac5eaa049a1`

**Request Body**

None

**Response Body**

None.

<aside class="notice">The current account must either be the account to be deleted, or have partner administrator privileges.</aside>

## POST /batch

Version: 0

Wraps multiple account creation requests into one batch call. Each request is formatted as an HTTP method (e.g. "post"), relative URL of the API endpoint and the body of the request. The response contains an ordered set of individual response payloads corresponding to each of the requests.

### Request/Response JSON Keys

| Parameter | Type | Optional | Immutable | In/Out | Description |
| --- | --- | --- | --- | --- | --- |
| requests | List of Requests | No | Yes |  | A list of requests to be processed by the batch call |  |

### Request

| Name | Type | Optional | Immutable | Description |
| --- | --- | --- | --- | --- |
| method | string | No | Yes | HTTP method for the embedded request. The only supported method is "post". |  |
| relative\_url | string | No | Yes | Relative URL of the embedded API request. The only supported URL is "/accounts" |  |
| body | Object | No | Yes | Body of the embedded API request |  |

### Samples

**URL:**
`https://api.knewton.com/v0/batch`

**Request Body**

```json
{
"requests" :
[
{
"method" : "post",
"relative_url" : "/accounts",
"body" : { "external_user_id" : "abc321" }
},
{
"method" : "post",
"relative_url" : "/accounts",
"body" : { "external_user_id" : "abc322" }
},
{
"method" : "post",
"relative_url" : "/accounts",
"body" : { "external_user_id" : "abc322" }
}
...
]
}
```

**Response Body**

```json
{
“responses” :
[
{
"code" : 200,
"body": { "external_user_id" : "abc321",
"account_id" : "828815a2-5038-4352-a681-82c96921ddf5",
"entitlements" : [ ]
}
},
{
"code" : 200,
"body": { "external_user_id" : "abc322",
"account_id" : "edd9d421-3979-4249-82f8-955684d715ea",
"entitlements" : [ ]
}
},
{
"code" : 422,
"body": { "code" : 422,
"error_message" : "Duplicate account with abc322" },
}
...
]
}

```

<aside class="notice">Up to 50 account requests are allowed per single batch call. Current account must have partner administrator privileges.</aside>
