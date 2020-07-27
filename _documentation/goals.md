---
layout: 'documentation-single'
title: (DRAFT) Goals
description: Contextualising the learning exeprience with an outcomes based formative learning experience
keywords: 
order: 0

hero:
    title: Goals
    text: In a Knewton-powered learning applications, goals help express the scope and deadlines used to guide the recommendations delivered to a learner. A goal can be broad (“pass this final in four weeks at 90% overall score”) or much more specific (“achieve a target score on a specific weekly quiz”). Product designers and instructors can use goals to tailor a product or course to their needs. Goals are also used for contextual analytics.

---

*In this section:*

- [Managing Goals](#managing-goals)
	- [Goal Management Endpoints](#goal-management-endpoints)
		- [Create a new goal](#create-a-new-goal)
			- [Example Request - Create a goal.](#example-request---create-a-goal)
		- [Update an existing goal](#update-an-existing-goal)
		- [Delete an existing goal](#delete-an-existing-goal)
	- [Goal Request/Response JSON Keys](#goal-requestresponse-json-keys)
	- [Goal Path Parameters](#goal-path-parameters)
	- [Notes about Goals](#notes-about-goals)
- [Goals and Registrations](#goals-and-registrations)
	- [Goal and Registration Endpoints](#goal-and-registration-endpoints)
		- [Assign a goal to a registration](#assign-a-goal-to-a-registration)
			- [Example Request - Assign a goal to multiple registrations](#example-request---assign-a-goal-to-multiple-registrations)
		- [Check if a registration as been assigned a goal](#check-if-a-registration-as-been-assigned-a-goal)
		- [Un-Assign a goal from a registration](#un-assign-a-goal-from-a-registration)
		- [Batch assign or unassign a goal to or from multiple registrations](#batch-assign-or-unassign-a-goal-to-or-from-multiple-registrations)
	- [Goal and Registration Path Parameters](#goal-and-registration-path-parameters)
	- [Goal and Registration Request/Response JSON Keys](#goal-and-registration-requestresponse-json-keys)
  
<br>

---

# Managing Goals

## Goal Management Endpoints

### Create a new goal
**POST** `/learning-instances/{li_id}/scoped-goals`

#### Example Request - Create a goal.

**Url:** `https://api.knewton.com/v0/learning-instances/d0effd52-c3a7-4a3c-827a-3ac5eaa049a1/scoped-goals`

**Verb:** `POST`

**Request Body:**

```json
{
	"name": "Addition of single digit numbers",
	"targets": {
		"include": [
			"lref-lo56204",
			"lref-lo99879"
		],
		"completion_behavior": "all",
		"score": 0.75
	},
	"timing": {
		"relative_deadline": "P2W1D8H"
	},
	"scope": {
		"remediation_depth": "none",
		"exclude": [
			"tref-TOC:Unit5"
		]
	},
	"config": {
		"analytics_enabled": false,
		"assign_to": "all"
	}
}
```

**Create Goal - Response Body:**

```json
{
	"id": "57466e95-6019-498d-9c42-9180aa663304",
	"last_updated": "2013-04-12T17:00:00.000Z",
	"name": "Addition of single digit numbers",
	"targets": {
		"include": ["lref-lo56204", "lref-lo99879"],
		"completion_behavior": "all",
		"score": 0.75
	},
	"timing": {
		"end": "2013-04-28T01:00:00.000Z",
		"relative_deadline": "P2W1D8H"
	},
	"scope": {
		"remediation_depth": "none",
		"exclude": ["tref-TOC:Unit5"]
	},
	"config": {
		"analytics_enabled": false,
		"assign_to": "all"
	}
}
```

### Update an existing goal
**PUT** `/learning-instances/{li\_id}/scoped-goals/{goal\_id}`

This will update an existing goal. This change will apply to all registrations which currently have the goal assigned as the time of the update.

<div class="callout callout--info">
    <p>Note: No partial updates, you must post the entire goal body</p>
</div>

### Delete an existing goal
**DELETE** `/learning-instances/{li\_id}/scoped-goals/{goal\_id}`

Delete an existing goal.

## Goal Request/Response JSON Keys

| Parameter | Type | Optional | Description |
| --- | --- | --- | --- | --- | --- |
| name | string | No | Name of the goal _Warning_: Goal names must not contain any personally identifiable information (PII). Goal names containing email addresses in the name will be rejected. |
| targets.include | array of content IDs | No | |
| targets.score | float | No | | 
| timing.end | DateTime | Yes | Timestamp indicating when the goal is supposed to be completed by. One of "end" or "relative\_deadline" must be specified. Must also be less than 2-years after last time the goal was updated. |
| timing.relative\_deadline | DateTime | Yes | Relative duration of the goal, i.e. time until deadline for completion, specified as ISO 8601 duration string. One of "end" or "relative\_deadline" must be specified. |
| scope.<br>remediation\_depth | string | Yes | Conceptual distance computed from learning objectives which targets are aligned to. Must be one of "none" (target content only), "one" (target content and all content prerequisites to target content), "two" (target content, all content prerequisite to target content and all content prerequisite to that prerequisite), "three" (target content, all content prerequisite to target content and two levels of content prerequisite to that prerequisite) or "maximum" (up to entity limit of recommendable modules). |
| scope.include | List | Yes | List of taxon IDs (tref's) or module IDs (mref's) to be included in the recommendable pool. One of "include" or "remediation\_depth" must be specified. |
| scope.exclude | List | Yes | List of taxon IDs (tref's) or module IDs (mref's) to be excluded from the recommendable pool. Defaults to \[\]. |
| config.analytics\_enabled | boolean | Yes | Flag to indicate whether to compute goal-based analytics or not. Defaults to false. **If false, analytics requests for this goal will return empty payloads.** |
| config.assign\_to | string | Yes | Specifies the types of registrations to assign the goal to when it's created. One of "learners", "instructors" or "all". Defaults to not assigning the goal to any registrations. |
| id | UUID | No | Goal ID |
| last\_modified | DateTime | No | Time the goal was last created or modified |
| completion\_criteria | object | Yes | See the fields in this object below. Cannot be used if targets.score is used. Requires the goal to be defined with learning objective targets. |
| completion\_criteria.<br>min\_predicted\_mastery | float | Yes | The minimum score the student must achieve to be eligible for target completion, using the Predicted Mastery analytic. |
| completion\_criteria.<br>min\_work\_per\_target | int | Yes | The minimum number of assessing interactions the student must have on a target's concepts to be eligible for target completion. |
| completion\_criteria.<br>max\_work\_on\_goal | int | Yes | The maximum number of interactions (assessing and instructing) the student can have toward a goal (including on-target and off-target work), after which they'll achieve status "complete_max_work" on the goal, regardless of mastery. They will still receive recommendations, and if they complete via mastery, the status will become "complete". |

## Goal Path Parameters

| Parameter | Type | Optional | Immutable | Description |
| --- | --- | --- | --- | --- |
| goal\_id | UUID | No | No | ID of the goal to be deleted |
| li\_id | UUID | No | No | ID of the learning instance that owns the goal | 

## Notes about Goals
* Use the account of an Instructor in the learning instance in order to create a goal.
* The time it takes for a new goal to be created is a function of the number of target and recommendable module in the goal and, if it is being assigned at creation, the number of registrations it is being assigned to. While most responses are quite quick, the high-end timing can be up to **10 seconds** to create and assign very large goals

Knewton goals can exist in one of several states, each of which directly impacts the behavior of Knewton recommendations and analytics. It is to be noted that a single goal can be assigned to a subset of registrations in a learning instance, and at the same time, that goal may have been completed by other registrations in the same learning instance. In other words, a goal is said to be in a given state for a given registration.

*   **Created** – A goal has been created, but has not yet been assigned to a registration.
*   **Assigned** – A goal has been assigned to one or more registrations.
*   **In Progress** – The learner registration is working on the goal and is still receiving recommendations to help her achieve the target score defined in the goal.
*   **Ready** – The learner registration has achieved the target score defined in the goal.

<br>

# Goals and Registrations
A single goal can be assigned to many registrations

## Goal and Registration Endpoints

### Assign a goal to a registration
**PUT** `/learning-instances/{li\_id}/scoped-goals/{goal\_id}/registrations/{reg\_id}`

#### Example Request - Assign a goal to multiple registrations

**Url:** `https://api.knewton.com/v0/learning-instances/0cb6f3dc-8c6d-4bc7-b278-08d6147d9a0c/scoped-goals/f6d8c4f2-4956-4ff6-aa8b-995b6c77d68f/registrations/`

**Verb:** `PUT`

**Request Body:**

```json
{
	"action": "assign",
	"registration_ids": ["1538cf56-2fec-4734-b477-6b74ab489273", "6b74ab48-7f56-6b74-6b74-6b741538cf56"]
}
```

**Assign Goal to Registrations - Response Body:**

```json
{
	"action": "assign",
	"registration_ids": ["1538cf56-2fec-4734-b477-6b74ab489273", "6b74ab48-7f56-6b74-6b74-6b741538cf56"],
	"success": {
		"code": 200,
		"body": {
			"registration_ids": ["1538cf56-2fec-4734-b477-6b74ab489273", "6b74ab48-7f56-6b74-6b74-6b741538cf56"]
		}
	}
}
```

<div class="callout callout--info">
    <p>Note: Current Account must be an instructor for this learning instance or have Partner Administrator privileges</p>
</div>

### Check if a registration as been assigned a goal
**GET** `/learning-instances/{li\_id}/scoped-goals/{goal\_id}/registrations/{reg\_id}`

Check if the registration has been assigned to this goal. If an HTTP 404 Not Found is returned, then it has not been assigned, otherwise it has been.

### Un-Assign a goal from a registration
**DELETE** `/learning-instances/{li\_id}/scoped-goals/{goal\_id}/registrations/{reg\_id}`

Remove the assigning of a goal from a registration

### Batch assign or unassign a goal to or from multiple registrations
**PUT** `/learning-instances/{li\_id}/scoped-goals/{goal\_id}/registrations`

Assign (or unassign) a goal to (or from) multiple registrations in a single call

## Goal and Registration Path Parameters

| Parameter | Type | Optional | Immutable | Description |
| --- | --- | --- | --- | --- |
| li\_id | UUID | No | No | ID of the learning instance that owns the goal |
| goal\_id | UUID | No | Yes | The ID of the goal to prepare for recommendations |
| reg\_id | UUID | No | Yes | ID of a registration to prepare for recommendations |

<div class="callout callout--info">
    <p>Note: Current Account must be an instructor for this learning instance or have Partner Administrator privileges</p>
</div>

## Goal and Registration Request/Response JSON Keys

| Parameter | Type | Optional | Description |
| --- | --- | --- | --- | --- | --- |
| action | String | No | Must be either "assign" or "unassign" | 
| registration\_type | String | Yes | Type of batch call - can be either "all" (action taken against all registrations) or "learners" (action taken against only learner registrations) or "instructors" (action taken only against instructor registrations). Only one of registration_type or registration_ids can be specified. |
| registration\_ids | Array of UUIDs | Yes | List of registration ids to assign to or unassign from a particular goal in a learning instance. Only one of registration_type or registration_ids can be specified. |
| success.code | Integer | Yes  | Part of a partial response, the HTTP status code for this part |
| success.body | Object | Yes  | Part of a partial response, contains the successfully updated registration ids |
| success.body.registration\_ids | Array of UUIDs | Yes | The IDs for the registrations successfully updated |
| failure\[x\].code | Integer | Yes | Part of a partial response, the HTTP status for this part of the errors |
| failure\[x\].message | String | Yes | Part of a partial response, a string description of the error that occurred |
| failure\[x\].error\_id | UUID | Yes | Part of a partial response, a unique error ID for this failure |
| failure\[x\].body | Object | Yes | Part of a partial response, contains the unsuccessfully updated registration IDs |
| failure\[x\].body.registration\_ids | Array of UUIDs | Yes | The IDs for the registrations not successfully updated |