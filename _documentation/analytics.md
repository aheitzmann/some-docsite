---
layout: 'documentation-single'
title: Learner Analytics
description: 
keywords: 
order: 0

hero:
    title: Analytics
    text: Learner Analytics
---


## POST /learning-instances/{li\_id}/metrics/status-and-progress

Version: 0

**_The following metrics are incompatible with the analytics above (e.g. taxon proficiency, readiness forecast, etc)._**

The status-and-progress endpoint provides a way to query directly for status of and progress towards completion of a goal.

Note that the metric takes into account all work an account has done across all of its registrations. However, any work requirements in a goal's `completion_criteria` can only be satisfied by interactions with that goal\_id set.

Requires the goals to be scoped goals defined with 'completion_criteria' and with learning objective targets; see docs for POST /learning-instances/{li_id}/scoped-goals).

The calling application needs to specify the following _path segments_: - li\_id: id of the learning-instance

This endpoint returns data for all registrations in the learning instance. It can be paginated if desired. The calls returns a list of rows containing specific analytics metric values for all specified registrations.

### Request/Response JSON Keys

| Parameter | Type | Optional | Immutable | In/Out | Description |
| --- | --- | --- | --- | --- | --- |
| goal\_ids, query.goal\_ids | list of UUIDs | No | Yes | In/Out | A list of goal IDs for which analytics are returned. |  |
| registration\_offset, query.registration\_offset | int | Yes | Yes | In/Out | Number of registrations in the learning instance which will appear on first row of data. |  |
| registrations\_per\_page, query.registrations\_per\_page | int | Yes | Yes | In | Maximum number of registrations on a page (number of rows equals to number of registrations). |  |
| column\_headers | list of UUIDs | No | Yes | Out | A list of goal UUIDs specifying the order of contents in returned rows of data. Whenever a query requests information for multiple goals, the column headers would reflect the order in which these results are returned across a row of data. |  |
| data | list of objects | No | Yes | Out | Each object is the status and progress information for one registration on a goal. See the fields below. |  |
| data\[\].registration\_id | UUID | No | Yes | Out | Registration ID associated with metric values on this row. |  |
| data\[\].status\_and\_progress | list of objects | No | Yes | Out | Each object is the status and progress information for one registration on a goal. See the fields below. |  |
| data\[\].status\_and\_progress\[\].goal\_id | UUID | No | Yes | Out | Goal ID associated with this status and progress information. |  |
| data\[\].status\_and\_progress\[\].status | string | No | Yes | Out | One of: `complete`, `complete_max_work`, `in_progress`, `struggling`, or `no_work`. Indicates the completion status of this registration on this goal. |  |
| data\[\].status\_and\_progress\[\].progress | float | No | Yes | Out | A value between 0 and 1 that predicts the percentage of work that has been finished in order to complete the goal. |  |
| data\[\].status\_and\_progress\[\].work\_remaining | integer | No | Yes | Out | A value between 0 and 50 (inclusive) that predicts the number of items remaining until the goal is completed. |  |
| data\[\].status\_and\_progress\[\].targets | list of objects | No | Yes | Out | Each object is the status and progress information on individual targets in the goal. See the fields below. |  |
| data\[\].status\_and\_progress\[\].targets\[\].target\_id | string | Yes | Yes | Out | Target ID associated with this status and progress information. Used if the target is a multi-module target (e.g. a learning objective) |  |
| data\[\].status\_and\_progress\[\].targets\[\].module\_id | string | Yes | Yes | Out | Module ID associated with this target's status and progress information. Used if the target is a single-module target. |  |
| data\[\].status\_and\_progress\[\].targets\[\].status | string | No | Yes | Out | One of: `complete`, `in_progress`, `struggling`, or `no_work`. Indicates the completion status of this registration on this target. |  |
| data\[\].status\_and\_progress\[\].targets\[\].progress | float | No | Yes | Out | A value between 0 and 1 that predicts the percentage of work that has been finished in order to complete the target. |  |

### Path Parameters

| Parameter | Type | Optional | Immutable | Description |
| --- | --- | --- | --- | --- |
| li\_id | UUID | No | Yes | learning instance ID |  |

### Samples

**URL:**
`https://api.knewton.com/v0/learning-instances/{li_id}/metrics/status-and-progress`

**Request Body**

```json
{
"goal_ids": [
"99660e1d-e88e-44d2-94d3-251f4861d889"
],
"registrations_per_page": "5"
}
```

**Response Body**

```json
{
"query": {
"goal_ids":["99660e1d-e88e-44d2-94d3-251f4861d889"]
},
"column_headers":["99660e1d-e88e-44d2-94d3-251f4861d889"],
"data":[
{
"registration_id":"6add6ab2-9f4a-4ecc-9969-0272c8ad051a",
"status_and_progress":[
{
"goal_id":"99660e1d-e88e-44d2-94d3-251f4861d889",
"status":"in_progress",
"progress":0.4,
"work_remaining":9,
"targets":[
{
"target_id":"1a387a89-91f9-4a97-b393-e7f788029597",
"status":"complete",
"progress":0.8
}
]
}
]
}
{
"registration_id":"e82e32b0-9ff4-46bc-964f-52ee6fd6714e",
"status_and_progress":[
{
"goal_id":"99660e1d-e88e-44d2-94d3-251f4861d889",
"status":"in_progress",
"progress":0.6,
"work_remaining":5,
"targets":[
{
"target_id":"1a387a89-91f9-4a97-b393-e7f788029597",
"status":"struggling",
"progress":0.2
}
]
}
]
}
]
}
```

<aside class="notice">Use the instructor account to retrieve analytics at a learning instance level, and use either an instructor or the registration's learner account to retrieve analytics for a particular registration.</aside>

## POST /registrations/{reg\_id}/metrics/status-and-progress

Version: 0

The status-and-progress endpoint provides a way to query directly for status of and progress towards completion of a goal. See documentation for POST /learning-instances/{li\_id}/scoped-goals for the necessary goal definition method to utilize these metrics.

Note that the metric takes into account all work an account has done across all of its registrations. However, any work requirements in a goal's `completion_criteria` can only be satisfied by interactions with that goal\_id set.

### Request/Response JSON Keys

| Parameter | Type | Optional | Immutable | In/Out | Description |
| --- | --- | --- | --- | --- | --- |
| goal\_ids, query.goal\_ids | list of UUIDs | No | Yes | In/Out | A list of goal IDs for which analytics are returned. |  |
| column\_headers | list of UUIDs | No | Yes | Out | A list of goal UUIDs specifying the order of contents in returned rows of data. Whenever a query requests information for multiple goals, the column headers would reflect the order in which these results are returned across a row of data. |  |
| data | list of objects | No | Yes | Out | See the fields in the objects below. |  |
| data\[\].registration\_id | UUID | No | Yes | Out | Registration ID associated with metric values on this row. |  |
| data\[\].status\_and\_progress | list of objects | No | Yes | Out | Each object is the status and progress information for one registration on a goal. See the fields below. |  |
| data\[\].status\_and\_progress\[\].goal\_id | UUID | No | Yes | Out | Goal ID associated with this status and progress information. |  |
| data\[\].status\_and\_progress\[\].status | string | No | Yes | Out | One of: `complete`, `complete_max_work`, `in_progress`, `struggling`, or `no_work`. Indicates the completion status of this registration on this goal. |  |
| data\[\].status\_and\_progress\[\].progress | float | No | Yes | Out | A value between 0 and 1 that predicts the percentage of work that has been finished in order to complete the goal. |  |
| data\[\].status\_and\_progress\[\].work\_remaining | integer | No | Yes | Out |  |
| data\[\].status\_and\_progress\[\].targets | list of objects | No | Yes | Out | Each object is the status and progress information on individual targets in the goal. See the fields below. |  |
| data\[\].status\_and\_progress\[\].targets\[\].target\_id | string | Yes | Yes | Out | Target ID associated with this status and progress information. Used if the target is a multi-module target (e.g. a learning objective) |  |
| data\[\].status\_and\_progress\[\].targets\[\].status | string | No | Yes | Out | One of: `complete`, `in_progress`, `struggling`, or `no_work`. Indicates the completion status of this registration on this target. |  |
| data\[\].status\_and\_progress\[\].targets\[\].progress | float | No | Yes | Out | A value between 0 and 1 that predicts the percentage of work that has been finished in order to complete the target. |  |

### Path Parameters

| Parameter | Type | Optional | Immutable | Description |
| --- | --- | --- | --- | --- |
| reg\_id | UUID | No | Yes | registration ID |  |

### Samples

**URL:**
`https://api.knewton.com/v0/registrations/{reg_id}/metrics/status-and-progress`

**Request Body**

```json
{
"goal_ids": [
"50d7d4fc-476d-45eb-8e8c-97c91d5d7c74"
]
}
```

**Response Body**

```json
{
"query": {
"goal_ids":["50d7d4fc-476d-45eb-8e8c-97c91d5d7c74"]
},
"column_headers":["50d7d4fc-476d-45eb-8e8c-97c91d5d7c74"],
"data":[
{
"registration_id":"104f4efc-62f0-4f4a-a577-c880ff7acc31",
"status_and_progress":[
{
"goal_id":"50d7d4fc-476d-45eb-8e8c-97c91d5d7c74",
"status":"in_progress",
"progress":0.4,
"work_remaining":9,
"targets":[
{
"target_id":"5d56b449-56be-4bb1-afd2-b3e281a66a42",
"status":"complete",
"progress":0.8
}
]
}
]
}
]
}
```