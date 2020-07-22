---
layout: 'documentation-single'
title: (DRAFT) Recommendations
description: 
keywords: 
order: 0

hero:
    title: Recommendations 
    text: Recommendations
---


The Knewton platform’s selected set of modules for what a learner in a learning instance (i.e. a registration) should do next based on the events and context at the current time.

## GET /registrations/{id}/recommendation?goal\_id={goal\_id}

Version: 0

Recommendation includes a list of module IDs the user should work on next.

If the goal is complete (i.e. the target score has been reached and therefore the `status` is "ready"), and the `continued_recommendations` query parameter is not specified (or is set to false), then the returned module ID list will be empty.

If the goal is complete and the `continued_recommendations` query parameter is set true, then the returned module IDs set list will still contain recommendations. Goal completion can still be detected by checking if the `status` field returns "ready".

Be aware that the registration with this goal must be prepared before making this call.

### Query Parameters

| Parameter | Type | Optional | Immutable | Description |
| --- | --- | --- | --- | --- |
| goal\_id | UUID | No | No | The ID generated during the goal creation process. |  |
| continued\_recommendations | Boolean | Yes | No | Either the string "true" or "false". Defaults to false. If true, module\_ids will contain modules even if the goal is complete. |  |

### Request/Response JSON Keys

| Parameter | Type | Optional | Immutable | In/Out | Description |
| --- | --- | --- | --- | --- | --- |
| recommendation\_id | Object | No | Yes |  | Recommendation ID |  |
| module\_ids | List of UUIDs or List of Content IDs | Yes | No |  | The list of recommended modules. Empty if the goal is complete and `continued_recommendations` is not specified or set to false. |  |
| focus\_state | string | No | Yes |  | The state of the goal, can either be "focused" or "unfocused". Refer to [How To Send An Event When Work Begins On A Goal](/developer/events#recipe-events-focus) for more information. |  |
| status | string | No | Yes |  | The status of the goal, can be one of "in progress", "ready", or "unfocused".
*   "in progress" - the student has not completed the goal
*   "ready" - the student is prepared against the targets of the goal Knewton has confidence that the student is competent in all of the target modules at their target scores
*   "unfocused" - the goal is not in focus, therefore a status is not calculated

 |

### Path Parameters

| Parameter | Type | Optional | Immutable | Description |
| --- | --- | --- | --- | --- |
| id | UUID | No | No | Registration of the student requesting the recommendation. |  |
