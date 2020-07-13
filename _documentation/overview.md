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

# Environments

## Integration / Sandbox environment

**dev-api.knewton.com**

When you are building and testing your application, you should use the above integration url. This is the URL you should use in all of your calls to the sandbox. The calls in the API reference show the production URL and should not be used for testing because the API keys will not correspond.

Note: The URL for authentication endpoints in this integration environment is dev-profile.knewton.com

## Production environment

**api.knewton.com**

When you’re application is ready to pilot, all of your API calls should be switched over to use the production URL. The production URL is shown above. This is the URL you will use for all applications that are no longer in development and testing.

Note: The URL for authentication endpoints in this integration environment is profile.knewton.com


# Response Codes

| HTTP Status Code | Reason |
| --- | --- |
| 200 | The request completed successfully. |
| 201 | The resource was created successfully. |
| 202 | The request was received and will be processed asynchronously. |
| 204 | The request was successful, and there is no data to return. |
| 207 | The request was partially successful, parse the response body to identify successful and failed parts. |
| 400 | The request was malformed. |
| 401 | The user is not authenticated. |
| 403 | The user is authenticated, but not authorized (does not have permission to do this operation). |
| 404 | Some part of the URL could not be found, usually that the Knewton ID does not exist, but could also be if that endpoint has no data or if the URL is ill-formed. |
| 405 | The method used to access the endpoint is incorrect. |
| 422 | Some part of the JSON request was ill-formed and could not be parsed, or that it could be parsed but one of the fields is incorrect, perhaps with a wrong UUID or disallowed field. Also returned whenever an entity limit was exceeded. |
| 429 | Rate limit exceeded for this endpoint. |
| 500 | Server Error. |

Response payload format for each API endpoint and response code can be found [here](https://docs.google.com/spreadsheets/d/1OcBs7VNptIJbSXEr1sJ0X2q__52viMSrDgpvysd8PjY/edit#gid=1339334062).



The Knewton API exposes a relatively small set of constructs designed to support a variety of learning applications spanning a range of educational use cases. To integrate with Knewton, the application designer must understand the kinds of services the Knewton API provides, identify the subset of services their application must rely upon, and connect the application’s logic to corresponding API endpoints in a way that’s consistent with principles and guidelines outlined below.

The Knewton API provides key abstractions which a learning application can leverage to create resources that facilitate an adaptive learning experience for users. The resource types are:

*   Authentication and user accounts
*   Learning instances and registrations
*   Goals
*   Events
*   Recommendations
*   Analytics

The following set of recipes focus on common use cases for the Knewton API and highlight important considerations and best practices. All recipes are organized in one or more of the resource categories listed above. Each recipe links to the API Reference, which specifies detailed API endpoints including path URLs, supported parameters, fields formats, and possible error conditions.

## Application State, Flow, and Sequence

All interactions with the API take the form of the application’s request and the API’s corresponding, synchronous response. As the application flow progresses, the application must retain certain information about the entities it creates so they can be referred to at a later point in time (as described [here](#storing-ids-and-tokens-created-by-knewton)).

The system architecture is visualized below. Some resources — namely those encompassed by the data model — are managed directly by the learning application, while other resources are managed through other channels. For instance, the knowledge graph is ingested and managed through a dedicated ingestion interface, which is not exposed to the application.

![13-learning-app-flow](/images/13-learning-app-flow.png)

The sequence of key API touchpoints in a typical learning application is shown below. This diagram appears throughout these developer resources to highlight a specific set of interactions and situate the application developer in the higher-level flow.

![8-auth-reco-analytics](/images/8-auth-reco-analytics.png)

Some steps in the diagram are “hard” prerequisites for subsequent interactions. For example, user accounts must be registered in learning instances before goals can be assigned to them. Other interactions are more indirect. For instance, sending events on the learner’s behalf doesn’t necessarily lead to synchronously updated recommendations for that learner. Instead, the recommendations are generated asynchronously after some delay.

Sending events and getting recommendations is a continuous cycle in most applications, i.e., the application sends events then gets recommendations and then can send more events on the behalf of the same learner, and so on. Also, the application may choose to add new goals or assign new learners to new goals at any point during the learning progression.

Each application designer must make a set of decisions to determine how that specific application works with the API. For instance, the way an application manages its users may impact how these users are allowed to authenticate. Likewise, the way users are assigned goals impacts what kind of recommendations they can get and what kinds of events need to be sent to the API. These design decisions are informed by the learning application use cases as well as the constraints of the Knewton API.

## Storing IDs and Tokens Created by Knewton

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

### Content Identifiers (Content IDs)

Content IDs refer to the set of identifiers that an application can use to refer to content assets mapped into an adaptive course and made known to Knewton via graph ingestion or a partner’s content inventory. These references can be used throughout the API whenever an application defines goals (namely when specifying a goal’s target and recommendable modules), sends events, or requests recommendations and analytics.

Unlike UUIDs associated with resources created by Knewton (e.g. registrations, accounts, goals) and generated dynamically every time a new resource is created via the Knewton API, content IDs are generated based on partner’s own content identifiers or labels. This ensures that the same piece of content can be referenced to by the same content ID across environments (when mapped into multiple development environments), and graphs (when included in multiple graphs).

The way content IDs are generated from partner’s own content identifiers and labels allows partners to “know” the future content ID just by knowing a content’s identifier or label on their side. Partner ID to content ID mapping rules are defined below.

**Note:** Partners must ensure that the same IDs are not reused for multiple pieces of content. Each unique piece of content on the application side must have its own unique ID. If new content assets are added, they should be assigned new partner identifiers such that distinct content IDs can be generated by Knewton. This also means that once an ID is assigned to a given piece of content, it should not be reused for a different type of content asset even if the original one is removed (e.g. reusing what was an Atom ID as a Container ID and vice versa).

Three types of content identifiers are associated with every graph:

1.  A single content ID for the graph itself (**B2** on **Modules** sheet)
2.  A unique content ID for every module in the graph (**B7:B…** on **Modules** sheet)
3.  A unique content ID for every each [taxonomy](/product/create-structure-content/) (**C2: C…** on **Taxonomy UUIDs** sheet)

All of these are included in the graphing spreadsheet after ingestion.

> A portion of the sample spreadsheet showing **Modules** sheet:
>
> [![Screen Shot 2015-02-24 at 2.55.22 PM]
> (/images/Screen-Shot-2015-02-24-at-2.55.22-PM.png)]
> (/images/Screen-Shot-2015-02-24-at-2.55.22-PM.png)
>
> Figure 1: Graph content IDs and module content IDs are part of the graphing spreadsheet
> (highlighted in green) – (Modules sheet)

The first highlighted ID is the graph’s content ID, which the application passes in when creating a learning instance. A graph with the same content ID can be ingested into multiple environments, so the part of the application that creates learning instances can remain independent of which environment the application is deployed against.

The other highlighted IDs are module IDs. Each module ID corresponds to a unique partner module ID. Assuming the application uses a CMS, partner identifiers are just asset identifiers used by the partner’s CMS. Each line of the spreadsheet corresponds to a unique content asset, but the same content asset can be included in multiple content inventories or graphs. Naturally, it would then have the same partner ID, which will in turn be mapped to the same content ID.

> The highlighted content IDs are the taxon content IDs. The application uses these IDs when
> defining goals or querying taxon-based analytics:
>
> [![Screen Shot 2015-02-24 at 2.59.02 PM]
> (/images/Screen-Shot-2015-02-24-at-2.59.02-PM-1024x549.png)]
> (/images/Screen-Shot-2015-02-24-at-2.59.02-PM.png)
>
> Figure 2: Taxon content IDs are part of the graphing spreadsheet (highlighted in green) –
> (Taxonomy UUIDs sheet)

#### Partner ID to Content ID Mapping Rules

* `<Partner Graph Name>` =>
  `"gref-" + <Partner Graph Name>` (e.g. “Knewton Light Graph” becomes “gref-Knewton Light Graph”)

* `<Partner Module ID>` => `"mref-" + <Partner Module ID>` (e.g. “1928” becomes “mref-1928”)

* `<Partner Taxon Name>` => `"tref-" + <Partner Taxonomy Name> + ":" + <Full Taxon Path><Partner Taxon Name>` (e.g. “Section1” becomes “tref-TOC:Ch3|Section1”)

* `<Partner Learning Objective ID>` => `"lref-" + <Partner Learning Objective ID>` (e.g. “lo4832” becomes “lref-lo4832”)

#### Partner ID Validation and Best Practices

**Errors**

*   Any part of the graph name, module ID, taxonomy name or taxon name contains quotes (e.g.
`my-"-module`)
*   Any part of the graph name, module ID, taxonomy name or taxon name contains backslashes (e.g.
`my-module\`)

**OK**

*   Not human readable (e.g. `83ce46e1-ae1e-493a-95ab-826ee02a4118`, `129.200.11.15`)
*   Names longer than 100 characters

**Best**

*   Descriptive and human-readable (e.g. `ch1-quiz3-q14`, `algebraic_equations_video2`,
`content_nursing_v4_ch11_question_set14_v2`)





## Timing considerations

[![](/images/Screen-Shot-2016-02-08-at-6.16.50-PM.png)](/images/Screen-Shot-2016-02-08-at-6.16.50-PM.png)

Events are sent to Knewton with an `interaction_end_time` parameter. Knewton’s platform uses UTC-format time to compare the `interaction_end_time` to the configured goal start and target dates.

*   If a different timezone is specified, Knewton will convert the timezone internally to UTC.
*   If no timezone is specified, Knewton defaults to UTC.

An event with a duration at different times impacts how Recommendations and Analytics behave. The three different scenarios are events with a timestamp:

*   Before the start date
*   [Active Time](https://dev.knewton.com/product/analyze/#active-time) for the goal is not adjusted based on events with a timestamp prior to the goal’s start date

*   Between start date and target date
*   All Analytics and Recommendations are adjusted based on events with a timestamp between the goal’s start date and the target date

*   After target date reached
*   [Active Time](https://dev.knewton.com/product/analyze/#active-time) for the goal is not adjusted on events with a timestamp after the target date. If queried after the target date, [Active Time](https://dev.knewton.com/product/analyze/#active-time) for the goal will return the last seven days of data until seven days past the goal end date, after which it will return no data.
