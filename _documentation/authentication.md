---
layout: 'documentation-single'
title: Authentication
description: Connecting to the Knewton API
keywords: 
order: 0

hero:
    title: Authentication
    text: Connecting to the Knewton API
---


### Client ID and Client Secret

The application is identified by two strings: a client ID and client secret. The Knewton IA provides both of these identifiers to the application inside [Passpack](https://www.passpack.com/). The application then passes these to Knewton as part of the [authentication flow](/developer/authentication-accounts-profiles/).

Although anyone can see the client ID, the client secret should never be shown to anyone. The client ID essentially serves as the application’s username, while the client secret serves as the password. If the client secret is ever compromised, the IA should be notified to provide a new secret.

### Authentication Tokens

Each call to Knewton is performed as a specific user in the learning application. An access token identifies the user, and the application includes this token in the authentication header on each call to Knewton. Because access tokens have a short lifetime, they must be periodically refreshed using a _refresh token_. This section contains a quick overview of these tokens and why they must be persisted; detailed information is available in the [authentication section](/developer/authentication-accounts-profiles/).

The application makes a call to `POST /oauth/token` in order to obtain both of these tokens. The call actually returns a large set of fields, only some of which need to be stored. Here is an example return object:

```json
{
  "access_token": "79c1260bbe754eadb12084aa1db86a9e",
  "token_type": "Bearer",
  "expires_in": 3599,
  "refresh_token": "1be6ce4a1e764904aad2f079f88cb393",
  "scope": "*",
  "account_id":"85b95240-b8e6-11e2-9e96-0800200c9a66",
  "expires_at": "2014-01-06T21:10:57.588Z"
}
```

*   The `access_token` and `refresh_token` keys contain the access token and refresh token mentioned above. Because a new access token can be obtained by calling `POST /oauth/token` with the refresh token, it may not be necessary to store the access token permanently in the data store. However, the access token should be reused until it expires, since calling `POST /oauth/token` every time an access token is needed is discouraged.
*   The `refresh_token` should always be stored persistently. If a user’s refresh token is lost, the authentication flow needs to be repeated, which for 3-legged OAuth requires the user to re-enter their username and password.
*   As mentioned above, the `account_id` is a normal UUID like other resources. It can be used to register users into learning instances.
*   The `expires_in` and `expires_at` fields can optionally be persisted. Either of these fields can be used to refresh tokens before receiving a 401 Unauthorized response due to expiration; this saves a call to the server.

The `token_type` and `scope` fields always return the same values and do not need to be stored.



# Authentication and User Accounts

One of the key design considerations in application development is selecting an authentication strategy appropriate for the use case, and designing an application flow that supports it.

How an application handles authentication is a crucial component of integrating with Knewton; all users must authenticate in order to use the Knewton API. This includes system users who create the initial set of accounts and learning instances, learners who send events, or instructors who retrieve analytics data for a learning instance. The authentication process describes how a user’s identity is communicated to the Knewton API by the application and/or user.

![1](/images/1.png)

## Security Fundamentals

Once a user is authenticated, each one of the requests issued by the application on his or her behalf must still be validated against the permissions and role(s) assigned to that user.

When users authenticate with the API, they are granting a learning application (“client”) a set of permissions to communicate with the Knewton API (“server”) on their behalf. Each API client has a unique identifier called a client\_id, which is used to distinguish calls made by different applications. This setup establishes a hierarchy of trust between a user and the Knewton API, and allows multiple applications and users to securely exchange information with the server.

![1-user-client-plat](/images/1-user-client-plat.png)

The corresponding entities in Knewton-integrated product are:

![2-learner-app-api2](/images/2-learner-app-api2.png)

In order to facilitate user management, Knewton maintains a set of entities called User Accountswhich allow the platform to uniquely associate user actions with specific users.

An account is a user record in the context of a single learning application. Each user has a set of user credentials, i.e. a user ID (also known as external ID), which uniquely identifies the user in the context of that application. Likewise, every application has its own ID ([client\_id](/product/glossary/#client-id)) and secret ([client\_secret](/product/glossary/#client-secret)) by which it identifies itself to the platform. Together, the application identifier, application ID, and user ID provide the basis for associating API requests with user accounts.

## Authentication Strategies

The Knewton API supports two authentication flows, corresponding to two-legged (2-party) and three-legged (3-party) OAuth 2.0 authentication schemes. For three-legged OAuth, please reach out to your Knewton Implementation Architect.

### 2-legged OAuth

2-legged authentication is between a learning application and the Knewton API, whereby a learning application certifies to the Knewton API that it is authorized to authenticate a user without a user’s explicit involvement. The Knewton API responds with security credentials, which can subsequently be used to identify and authorize a user with a specified external user ID.

![7-app-knewt-only](/images/7-app-knewt-only.png)

Security credentials between the learning application and the Knewton API are encoded and exchanged as tokens. An application in possession of a token (while the token has not expired) can use the token to act on behalf of a uniquely identified user.

Applications are responsible for securing their client\_secret and any and all tokens transmitted to them by the Knewton API. Failure to do so may allow another, possibly malicious application to act on behalf of a user.


## Authenticating Users with 2-Legged OAuth Flow

In order to successfully authenticate a user with this flow, an account for the user must have already been created by either a POST /v0/bulk or POST /v0/accounts call. The account’s external user ID must be associated with the user in step 4 of the flow below.

### ![2-legged-oauth](/images/2-legged-oauth.png)

### Flow Walkthrough:

*   The user opens the browser and navigates to the learning application.
*   The user submits his or her username and password (or whatever form of user credentials the learning application requires).
*   These credentials are posted to the learning application.
*   After successfully authenticating the user, the learning application looks up the user’s access token (if retrieved previously) and checks if it has expired. Alternatively, the application can use timers to notify itself of token expiration regardless of whether the user logs in. If the access token has not expired, then the application can skip Steps 4 and 5. Otherwise, it proceeds with Step 4.
*   The learning application makes `POST /v0/oauth/token` call on the user’s behalf.
*   `grant_type` is set to `client_credentials`.
*   `client_id` and `client_secret` are application-specific credentials assigned by Knewton and communicated to the partner via [Passpack](https://www.passpack.com) mechanism.
*   `scope` is set to the logged-in user’s external user ID.
*   Scope is a required parameter in 2-legged OAuth flow. The Knewton API uses this parameter to associate the user of the learning application with their account on the Knewton side. Recall that a user account must have been created prior to this flow being initiated.
*   The Knewton API responds with the access and refresh token.
*   The learning application redirects the user back to the logged-in page. The user has been successfully authenticated.
*   The user loads more pages and otherwise interacts with the learning application.
*   The learning application continues to invoke the Knewton API with the user’s access token.

### Relevant endpoints:

[POST /v0/oauth/token](/developer/api-reference/authentication/#get-oauthtoken)

## Refreshing Security Credentials

All access and refresh tokens have a well-defined lifetime that is communicated to the learning application by the Knewton API. Once a token expires, it can no longer be used to authenticate the user against the API. Applications may choose to keep track of token timeouts explicitly or to watch for API errors corresponding to token expiration, which is denoted by HTTP code 401.

For 2-legged OAuth, an application can request another token by initiating a token request with refresh\_token grant\_type and supplying the previously received, but unexpired refresh token as one of the call parameters. If the refresh token has expired, then the application can initiate a token request with client\_credentials grant\_type as described in Step 4 of 2-legged Authentication flow.

### Relevant endpoints:

[POST /v0/oauth/token](/developer/api-reference/authentication/#get-oauthtoken)

## Authenticating a User (Step-by-Step Walkthrough)

The 2-legged authentication flow can be performed entirely from the command line. Assuming that the application has been granted [Sandbox access](/developer/poc-walkthrough/#sandbox), the [system user](/product/glossary/#system-user) can be authenticated by following these calls.

These instructions are provided for Linux and Mac OS users. Windows users can download [Cygwin](http://www.cygwin.com/) and use the curl tool provided there.

1.  The following three environmental variables should be set temporarily (the values should be replaced with the credentials shared in Passpack):


export CLIENT\_ID="client\_id"
export CLIENT\_SECRET="client\_secret"
TEST\_USERNAME="e8efb165ff4f4f018b7442b13e76fbf4-SystemUser"

2.  Build the authorization header with the client ID and client secret that provided ([RFC 6750, section 2.1](https://tools.ietf.org/html/rfc6750#section-2.1))


AUTH\_HEADER=\`echo -n ${CLIENT\_ID}:${CLIENT\_SECRET}|base64\`

3.  The client credentials should be exchanged for an access token, which corresponds to Step 4 of 2-legged authentication flow shown [above](#2-legged).


curl https://dev-api.knewton.com/v0/oauth/token -X POST -H "Authorization: Basic ${AUTH\_HEADER}" -d "scope=${TEST\_USERNAME}" -d "grant\_type=client\_credentials"

4.  The response body should look as follows, corresponding to Step 5 of the 2-legged authentication flow defined [above](#2-legged):


{
  "access\_token": "79c1260bbe754eadb12084aa1db86a9e",
  "token\_type": "Bearer",
  "expires\_in": 3599,
  "refresh\_token": "1be6ce4a1e764904aad2f079f88cb393",
  "scope": "\*",
  "account\_id":"85b95240-b8e6-11e2-9e96-0800200c9a66",
  "expires\_at": "2014-01-06T21:10:57.588Z"
}

5.  The application should save the tokens for future use.


ACCESS\_TOKEN=79c1260bbe754eadb12084aa1db86a9e
REFRESH\_TOKEN=1be6ce4a1e764904aad2f079f88cb393

6.  The application should use the access token to make a trial call by setting the authorization header to “Bearer.” This example uses the “/v0/accounts/current” call as an example, but any Knewton API call could be used:


curl https://dev-api.knewton.com/v0/accounts/current -H "Authorization: Bearer ${ACCESS\_TOKEN}"

7.  The following indicates the user has been authenticated and can make API calls.


{
  "id": "0e375455-1d5c-4474-8e0f-e5f5e64f65f6",
  "entitlements": \[ "all" \],
  "external\_user\_id": "e8efb165ff4f4f018b7442b13e76fbf4-SystemUser"
}





Authentication API endpoints support 2-legged and 3-legged OAuth 2.0 flows. The endpoints are available at `profile.knewton.com` (production environment) and `dev-profile.knewton.com` (sandbox/integration environment).

For more information on authenticating with Knewton API, see [Knewton Authentication](/developer/authentication-accounts-profiles/).

## POST /oauth/token

Version: 0

Retrieve an access token and a refresh token to be used for all Knewton API calls.

These call is used in two different contexts:

1.  As part of 2-legged OAuth authentication flow when client credentials, client ID and client secret are used to obtain an access and refresh tokens for a particular user.
2.  As part of exchanging a previously issued refresh token for a new access token.

"grant\_type" is the form parameter used to distinguish among these contexts.

Note that the application must set the HTTP header as follows: `"Authorization: Basic <key>"` where is a base64-encoded `api_key:api_secret`, both of which were provided by Knewton. All other parameters are passed as form parameters.

For more details, see [OAuth section 4.4.2](http://tools.ietf.org/html/rfc6749#section-4.4.2) for using client credentials grant type, and [section 4.6](http://tools.ietf.org/html/rfc6749#section-6) for exchanging a refresh token.

### Query (& Form) Parameters

| Parameter | Type | Optional | Immutable | Description |
| --- | --- | --- | --- | --- |
| grant\_type | string | No | No | One of "refresh\_token", or "client\_credentials" |  |
| refresh\_token | string | Yes | No | The refresh token returned from the `/oauth/token` call. Required only when grant\_type is "refresh\_token" |  |
| scope | string | Yes | No | An existing external user ID for which an account has been created previously with `POST /batch` or `POST /accounts`. Required only when grant\_type is "client\_credentials". |  |

### Samples

**URL:**
`https://profile.knewton.com/v0/oauth/token`

**Request Body**

grant\_type=client\_credentials&scope=user\_601726
_or_
grant\_type=refresh\_token&refresh\_token=bc11124fc08c41ecafe2cf6a9814024d

**Response Body**

```json
{
"access_token": "6f6b3df25befe8ac344b",
"refresh_token": "c09c781ab44c9cb3b529",
"token_type": "Bearer",
"expires_in": 15555599,
"expires_at": "2013-11-05T21:19:45.268Z",
"account_id": "d0effd52-c3a7-4a3c-827a-3ac5eaa049a1"
}
```