---
layout: 'documentation-single'
title: API Overview & Organising Principles
description: How to get started with the Knewton Enterprise API
keywords: 
order: -1

hero:
    title: API Overview & Organising Principles
    text: How to get started with the Knewton Enterprise API
---

## Organizing Principles

The Knewton API exposes a relatively small set of constructs designed to support a variety of learning applications spanning a range of educational use cases. To integrate with Knewton, the application designer must understand the kinds of services the Knewton API provides, identify the subset of services their application must rely upon, and connect the application’s logic to corresponding API endpoints in a way that’s consistent with principles and guidelines outlined below.

The Knewton API provides key abstractions which a learning application can leverage to create resources that facilitate an adaptive learning experience for users. The resource types are:

*   [Authentication and user accounts](/documentation/authentication)
*   [Learning instances and registrations](/documentation/learning-instances-registrations)
*   [Goals](/documentation/goals)
*   [Events](/documentation/events)
*   [Recommendations](/documentation/recommendations)
*   [Analytics](/documentation/analytics)

The following set of recipes focus on common use cases for the Knewton API and highlight important considerations and best practices. All recipes are organized in one or more of the resource categories listed above. Each recipe links to the API Reference, which specifies detailed API endpoints including path URLs, supported parameters, fields formats, and possible error conditions.

### Application State, Flow, and Sequence

All interactions with the API take the form of the application’s request and the API’s corresponding, synchronous response. As the application flow progresses, the application must retain certain information about the entities it creates so they can be referred to at a later point in time (as described [here](#storing-ids-and-tokens-created-by-knewton)).

The system architecture is visualized below. Some resources — namely those encompassed by the data model — are managed directly by the learning application, while other resources are managed through other channels. For instance, the knowledge graph is ingested and managed through a dedicated ingestion interface, which is not exposed to the application.

The sequence of key API touchpoints in a typical learning application is shown below. This diagram appears throughout these developer resources to highlight a specific set of interactions and situate the application developer in the higher-level flow.

![Api Workflow](/resources/images/documentation-api-workflow-1.png )

Some steps in the diagram are “hard” prerequisites for subsequent interactions. For example, user accounts must be registered in learning instances before goals can be assigned to them. Other interactions are more indirect. For instance, sending events on the learner’s behalf doesn’t necessarily lead to synchronously updated recommendations for that learner. Instead, the recommendations are generated asynchronously after some delay.

Sending events and getting recommendations is a continuous cycle in most applications, i.e., the application sends events then gets recommendations and then can send more events on the behalf of the same learner, and so on. Also, the application may choose to add new goals or assign new learners to new goals at any point during the learning progression.

Each application designer must make a set of decisions to determine how that specific application works with the API. For instance, the way an application manages its users may impact how these users are allowed to authenticate. Likewise, the way users are assigned goals impacts what kind of recommendations they can get and what kinds of events need to be sent to the API. These design decisions are informed by the learning application use cases as well as the constraints of the Knewton API.

### Storing IDs and Tokens Created by Knewton

The Knewton API identifies most resources by a 36-character string of hexadecimal digits and hyphens called [a universally unique identifier](https://en.wikipedia.org/wiki/Universally_unique_identifier). These IDs are guaranteed to be unique across all learning applications. Each time a resource is created, Knewton creates a UUID and returns it to the application. The application then stores the UUID into some sort of persistent datastore, e.g., a database. Whenever the application wants to refer to any of the resources it created, it must pass the resource’s UUID to the Knewton API.

To register a user with account `3de631` into learning instance `41409a` (these UUIDs are shortened
for convenience throughout the documentation), the application creates a resource in the
`/registrations` endpoint (the account and learning instance were created previously and their IDs
stored in the same datastore)

```json
POST /v0/registrations
{
    "account_id": "3de63120-ebcd-4568-935a-0d04e3bf0f72",
    "learning_instance_id": "41409a38-3153-41f8-aa90-d6bacb7e23ed",
    "type": "learner"
}
```

> Knewton parses the fields, creates the registration, and assigns it an ID. The Knewton API then
returns this ID in the response along with the fields passed in:

```json
{
    "id": "83ce46e1-ae1e-493a-95ab-826ee02a4118",
    "account_id": "3de63120-ebcd-4568-935a-0d04e3bf0f72",
    "learning_instance_id": "41409a38-3153-41f8-aa90-d6bacb7e23ed",
    "type": "learner"
}
```

The application needs to parse the response, extract the `id` field, and store it. Anytime the application needs to reference this particular registration, it reads the ID from the application datastore and passes it to Knewton. For example, to [send an event to Knewton](/developer/events/), the application passes the ID of the registration in the URL, like this:

`POST /v0/registrations/83ce46e1-ae1e-493a-95ab-826ee02a4118/graded-events`

The application includes this same ID in the call to get a recommendation:

`GET /v0/registrations/83ce46e1-ae1e-493a-95ab-826ee02a4118/recommendation?goal_id=9d48bb52-b280-41bc-b85c-5289908ffb76`

Here, two IDs are used: the registration ID and the goal ID. The goal ID is obtained in the same way, i.e., by parsing the `id` field which is returned after creating a goal. IDs of most resources are returned in the response fields of corresponding API calls.

#### Account IDs

Returned when obtaining an access token with `POST /v0/oauth/token/`

#### Goal IDs

Returned when creating a goal with `POST /v0/learning-instances/<learning_instance_id>/goals/`

#### Learning instance IDs

Returned when creating a learning instance with `POST /v0/learning-instances/`

#### Registration IDs

Returned when registering an account with `POST /v0/registrations/`

In addition to these resources, the application must also store the following parameters:

*   Graph ID
*   Client ID and client secret
*   Authentication tokens
*   Recommendation IDs

## Content-type and Return Types

Currently `application/json` is the only supported content type. The response’s Content-type header will be set to the same type as the request.

Additionally, the Knewton API supports [content IDs](http://https://dev.knewton.com/developer/api-overview#content_ids) containing unicode characters that are submitted in the UTF-8 encoding.

When providing content IDs containing UTF-8 encoded strings the `Content-Type` header should be set to `application/json;charset=UTF-8`. The request library serializing the request should be configured to match this encoding.

All response bodies are returned as JSON.

## Data types

Type information given below should be interpreted as JSON values, except for the following:

1.  **UUID**: A [universally unique identifier](http://en.wikipedia.org/wiki/Universally_unique_identifier). Knewton resources are generally identified by a UUID. For example: `550e8400-e29b-41d4-a716-446655440000`. The client should treat these strings as opaque identifiers and simply pass them to the system as needed. Clients never need to create their own UUIDs.
2.  **Content ID**: A string. Content assets (modules and graph IDs) and categories (taxonomies and taxon names) processed for adaptivity by Knewton can be identified by their [Content IDs](https://dev.knewton.com/developer/api-overview#content_ids "API Overview"), which are derived from partner-chosen IDs and labels for those assets.
3.  **long** (recommendation\_id): Recommendations are identified by a non-negative long value instead of a UUID. For example: `9289981383`.
4.  **datetime**: ISO-8601 format is used, for example `2002-10-02T10:00:00.000Z`.
5.  **duration**: Non-negative long value in milliseconds.

## Extensions and Backward Compatibility

The API will continue to expand and evolve. The following considerations should be made when integrating:

*   New **optional** JSON keys may be added to requests bodies
*   **Additional** parameters may be added to response bodies
*   Existing JSON keys and parameter names and format **will** **not** change within the current version of the API

## Environments

### Integration / Sandbox environment

**dev-api.knewton.com**

When you are building and testing your application, you should use the above integration url. This is the URL you should use in all of your calls to the sandbox. The calls in the API reference show the production URL and should not be used for testing because the API keys will not correspond.

Note: The URL for authentication endpoints in this integration environment is dev-profile.knewton.com

### Production environment

**api.knewton.com**

**api.knewton.ie**

When you’re application is ready to pilot, all of your API calls should be switched over to use the production URL. The production URL is shown above. This is the URL you will use for all applications that are no longer in development and testing.

## API Versioning

Knewton’s version support policy for the Knewton APIs is as follows: each new version of the Knewton API shall have a six (6) month period following release where such version is considered a “release candidate.” During that six (6) month period, Knewton collects input from its API partners and can make changes to that version of the Knewton API. After that six (6) months ends, the release candidate is promoted to a long-term support (“LTS”) version of such Knewton API. When a new LTS version of a Knewton API is released, the previous LTS version will continue to be supported for a period of 12 months; provided, however, that the foregoing shall not be construed to limit Knewton’s ability to require immediately implementation of patches and updates to address security, intellectual property, legal compliance or other critical issues.

The Knewton API exposes a relatively small set of constructs designed to support a variety of learning applications spanning a range of educational use cases. To integrate with Knewton, the application designer must understand the kinds of services the Knewton API provides, identify the subset of services their application must rely upon, and connect the application’s logic to corresponding API endpoints in a way that’s consistent with principles and guidelines outlined below.

The Knewton API provides key abstractions which a learning application can leverage to create resources that facilitate an adaptive learning experience for users. The resource types are:

*   Authentication and user accounts
*   Learning instances and registrations
*   Goals
*   Events
*   Recommendations
*   Analytics

The following set of recipes focus on common use cases for the Knewton API and highlight important considerations and best practices. All recipes are organized in one or more of the resource categories listed above. Each recipe links to the API Reference, which specifies detailed API endpoints including path URLs, supported parameters, fields formats, and possible error conditions.