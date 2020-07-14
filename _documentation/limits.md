---
layout: 'documentation-single'
title: Limits - Rate and Entitiy
description: tive learners in meaningful groups
keywords: 
order: 0

hero:
    title: Learning Instances (classes)
    text: Manage your adaptive learners in meaingful groups
---


# Rate Limits

Knewton enforces a set of _rate limits_, i.e. limits on frequency and volume of interactions with the Knewton API. These limits ensure that no one user can impact the availability of the system for other users on our multi-tenant platform. Rate limits are designed to accommodate use-cases of most applications. Partners should contact their Knewton Implementation Architect if their applications are frequently rate-limited by Knewton’s APIs.

Knewton enforces two levels of rate-limiting – the first level being IP Address-based for unauthenticated requests and the second level being Access Token-based for authenticated requests. At the same time, each API endpoint has its own limit, which may be different from the limits of other endpoints.


## Unauthenticated requests – IP Addressed based Rate Limiting

IP Address-based rate limiting is enforced per unique IP-URI pair, and is enforced when an incoming request has yet to be authenticated (i.e. a request is made to retrieve access or refresh tokens) or if an incoming request has failed authentication (i.e. a request is made with incorrect or expired tokens). This means that the combination of w.x.y.z and https://foo.com is limited independently from the combination of a.b.c.d and https://foo.com, where w.x.y.z and a.b.c.d represent the IP address of the end-user’s machine and https://foo.com is the URI of the application that has integrated with Knewton.

Each pair is allowed a quota of 10 requests per second. If the application exceeds this rate, Knewton will attempt to queue the next request. This will result in a delay in processing the request. Additionally, once a queued event is eventually processed Knewton will inform the client application of this delay with the `X-Knewton-Rate-Delay`  header in the response that will contain the time of the delay in milliseconds. For instance, if the response contains `X-Knewton-Rate-Delay: 100`, it means that there was a delay of 100 milliseconds in order to process the request since the client application has exceeded 10 requests-per-second.

If the request queue for this IP-URI pair is full, Knewton will respond with an HTTP 429 error with the `X-Knewton-Rate-Exceeded` header, implying that the client application has exceeded 10 requests-per-second _and_ that the request has been rejected because the queue is already full.

## Authenticated requests – Access Token based Rate Limiting

Access Token based rate limiting is enforced on a per token-URI-endpoint triple (for ex. the combination of <token\_a> and https://foo.com is treated independently from the combination of <token\_b> and https://foo.com for a particular endpoint, where <token\_a> and <token\_b> represent the access tokens of end-users and https://foo.com is the URI of the application that has integrated with Knewton), and is enforced once an incoming request has successfully been authenticated by Knewton. Refer to the [Authentication and User Accounts](#authentication-and-user-accounts) page for more information on using tokens.

[![Screen Shot 2016-06-14 at 5.31.39 PM](/images/Screen-Shot-2016-06-14-at-5.31.39-PM.png)](/images/Screen-Shot-2016-06-14-at-5.31.39-PM.png)

In case a triple exceeds the quota, Knewton will respond with an HTTP 429 error with the `X-Knewton-Rate-Exceeded` header, implying that the client application has exceed the rate limit for that token-URI-endpoint triple. Exhausting the quota on one endpoint does not mean that the application must wait to make calls to other endpoints.



# Entity Limits

The Knewton API maintains a set of limits for different resources within the system. The table below specifies these limits. An error will be thrown if these limits are reached.

| Resource | Limit |
| --- | --- |
| Any character field (e.g. learning instance name) | 256 characters |
| Modules per graph | 20000 |
| Concepts per graph | 2000 |
| Graphs per learning instance | 1 |
| Number of taxons in a taxonomy | 2000 (warning) |
| Number of taxons applied to individual module | 20 (warning) |
| Depth of a taxonomy | 7 levels (warning) |
| Registrations per account (learner or instructor) | 500 |
| Registrations in a learning instance | 500 |
| Goals assigned per registration (total) | 200 |
| Goals assigned per registration (with config.analytics\_enabled:true, or using [deprecated APIs](https://dev.knewton.com/developer/api-reference/deprecated-apis/) for goals, metrics\_enabled:true) | 50 |
| Focused goals per registration | 3 (most recently focused) |
| Target modules per goal (individual assets represented by module\_ids or learning\_objectives) | 750 for config.analytics\_enabled=true goals
7500 for config.analytics\_enabled=false goals

 |
| Recommendable modules per goal | 15000 |
| Includes and excludes modules/taxons per goal (for scope.include and scope.exclude) | 50 for scope.include and 100 for scope.exclude |
| Goals per learning instance | 5000 |
| Modules returned per recommendation | 10 |
| Registrations per page in an analytics query | 30 registrations |
| Consecutive days in an analytics query | 7 days (inclusive of start and end dates) |
| Student events per batch | 500 |
| Registrations per batch to assign a goal to or unassign a goal from | 500 |
| Account creation requests per batch | 50 |
| Goal IDs or taxons allowed in query parameter set for /rows analytics endpoint requests | 50 taxon IDs
or
40 goal IDs
(no mix & matching) |
| Goal IDs or taxons allowed in query parameter set for smart grouping reports | 50 total taxon IDs and/or goal IDs
(mix & matching allowed) |

# Rate Limits

The Knewton API maintains a set of rate limits for different endpoints within the system. The table below specifies these limits. The logic for enforcing these limits is can be referenced [here](https://dev.knewton.com/developer/rate-limits-overview/).

| Action | Endpoint | Rate Limit |
| --- | --- | --- |
| **Account and Auth** |  |  |
| Account create | POST /accounts | 750/min/token |
| Account create (batch) | POST /batch | 90/min/token |
| Account current | GET /accounts/current | 15/min/token |
| Account get ID | GET /accounts/{id} | 15/min/token |
| Account delete | DELETE /accounts/{id} | 150/min/token |
| **Registrations** |  |  |
| Registration create | POST /registrations | 375/min/token |
| Registraton get | GET /registrations/{id} | 15/min/token |
| Registration delete | DELETE /registrations/{id} | 375/min/token |
| **Learning Instances** |  |  |
| Learning Instance create | POST /learning-instances | 750/min/token |
| Learning Instance get | GET /learning-instances | 15/min/token |
| Learning Instance get (id) | GET /learning-instances/{id} | 15/min/token |
| Learning Instance get registrations | GET /learning-instances/{id}/registrations | 15/min/token |
| **Goals** |  |  |
| Goal creation | POST /learning-instances/{id}/scoped-goals | 90/min/token |
| Goal update | PUT /learning-instances/{id}/scoped-goals/{goal\_id} | 90/min/token |
| Goal assignment (individual) | PUT /learning-instances/{learning\_instance\_id}/scoped-goals/ {goal\_id}/registrations/{registration\_id} | 135/min/token |
| Goal assignment (batch) | PUT /learning-instances/{learning\_instance\_id}/scoped-goals/ {goal\_id}/registrations | 10 assigns/min/token or 100 unassigns/min/token |
| Goal assignment check | GET /learning-instances/{learning\_instance\_id}/scoped-goals/ {goal\_id}/registrations/{registration\_id} | 15/min/token |
| Goal assignment delete | DELETE /learning-instances/{learning\_instance\_id}/scoped-goals/ {goal\_id}/registrations/{registration\_id} | 135/min/token |
| **Events** |  |  |
| Student Events ungraded | POST /registrations/{id}/ungraded-events | 15/min/token |
| Student Events graded | POST /registrations/{id}/graded-events | 15/min/token |
| Focus events | POST /registrations/{id}/focus-events | 15/min/token |
| Recommendation followed | POST /registrations/{id}/recommendation-followed-events | 15/min/token |
| Batch Events | POST /registrations/{id}/batch-events | 15/min/token |
| **Recommendations** |  |  |
| Recommendation get | GET /registrations/{id}/recommendation?goal\_id={goal\_id} | 15/min/token |
| **Analytics** |  |  |
| Expected Score for learning instance | POST /learning-instances/{id}/metrics/expected-score/rows | 225/min/token |
| Readiness Forecast for learning instance | POST /learning-instances/{id}/metrics/readiness-forecast/rows | 225/min/token |
| Active Time for taxon(s) or goal(s) for learning instance | POST /learning-instances/{id}/metrics/active-time/rows | 225/min/token |
| Proficiency for learning instance | POST /learning-instances/{id}/metrics/proficiency/rows | 225/min/token |
| Expected Score for registration | POST /registrations/{id}/metrics/expected-score/rows | 225/min/token |
| Readiness Forecast for registration | POST /registrations/{id}/metrics/readiness-forecast/rows | 225/min/token |
| Active Time for taxon(s) or goal(s) for registration | POST /registrations/{id}/metrics/active-time/rows | 225/min/token |
| Proficiency for registration | POST /registrations/{id}/metrics/proficiency/rows | 225/min/token |
| **Smart Groupings** |
| Learners to Watch | POST learning-instances/{id}/metrics/groups | 25/min/token |

## Handling rate limit errors

When an application encounters an error because it has exceeded Knewton’s rate limit or because the request queue was full (i.e. 429 error code is returned and `X-Knewton-Rate-Exceeded` header is present), the Knewton API has not processed any part of the request. Therefore, the application must be designed to queue up the request, wait for some time for the quota to be replenished, and then attempt to resend the same request. The application will receive the following message when it exceeds Knewton’s rate limits:

`{"message": "Too many requests."}`
