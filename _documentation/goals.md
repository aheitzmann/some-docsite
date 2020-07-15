---
layout: 'documentation-single'
title: Goals
description: Contextualising the learning exeprience with an outcomes based formative learning experience
keywords: 
order: 0

hero:
    title: Goals
    text: Contextualising the learning experience
---

Knewton goals can exist in one of several states, each of which directly impacts the behavior of Knewton recommendations and analytics. This section will discuss the lifecycle of a goal, and will go into detail around how goals move between states. It is to be noted that a single goal can be assigned to a subset of registrations in a learning instance, and at the same time, that goal may have been completed by other registrations in the same learning instance. In other words, a goal is said to be in a given state for a given registration.

In general, there are three main states:

*   **Created – A goal has been created, but has not yet been assigned to a registration.**
*   **Assigned** – A goal has been assigned to one or more registrations.
*   **Deleted** – A goal has been deleted and can no longer be used.

When a goal is in the assigned state for one or more registrations, there are two statuses that the goal can exist in for each of the registrations it is assigned to:

*   **In Progress – The learner registration is working on the goal and is still receiving recommendations to help her achieve the target score defined in the goal.**
*   **Ready** – The learner registration has achieved the target score defined in the goal.

The following state diagram describes the movement of a goal across various states.

[![Screen Shot 2016-08-29 at 1.27.04 PM](/images/Screen-Shot-2016-08-29-at-1.27.04-PM.png)](/images/Screen-Shot-2016-08-29-at-1.27.04-PM.png)

As the first step, a client application makes an API call to create a goal within a learning instance. Once the goal is created, it can then be assigned to one or more registrations in the same learning instance, at which point the status is “in progress” for each of those registrations. As Knewton receives student events from the client application informing it of a learner’s performance against the assigned goal, the goal may move to the “ready” status for a particular registration if, upon receiving a graded event, Knewton determines that the learner has achieved an expected score greater than the target score defined in the goal. If the target score defined in the goal changes, the goal may move from the “ready” status to an “in progress” one for a particular registration.

At the same time, the client application may also unassign a goal from a registration or delete a goal (an irreversible action) at any given point in time, regardless of the current goal state. The table below details the different states and status along with what happens for each interaction. Actions tagged as \[WARNING\] means that the API will not throw an error, but the partner should be aware of potential consequences and unexpected behaviors. \[ERROR CASE\] means that the API will throw a 400-level error.

<table class="table table-bordered">
  <tbody>
    <tr style="background-color: #d3d3d3;">
      <td colspan="3" rowspan="1">
        <p style="text-align: center;"><span style="color: #000000;"><strong>CREATED or UNASSIGNED</strong></span> State</p>
      </td>
    </tr>
    <tr>
      <td colspan="3" rowspan="1">Goals reach the <span style="color: #000000;"><strong>CREATED</strong></span> state when the <a href="https://dev.knewton.com/developer/api-reference/goals/#post-learning-instancesidgoals">goal creation API</a> is called</td>
    </tr>
    <tr style="background-color: #c6e8ef;">
      <td colspan="1" rowspan="1">
        <p style="text-align: center;"><strong>Action in<br />
        </strong><span style="color: #000000;"><strong>CREATED or UNASSIGNED</strong></span></p>
      </td>
      <td colspan="2" rowspan="1">
        <p style="text-align: center;"><strong>Response</strong></p>
      </td>
    </tr>
    <tr>
      <td colspan="1" rowspan="1">Send <a href="https://dev.knewton.com/developer/api-reference/goals/#put-learning-instancesli_idgoalsgoal_idregistrationsreg_id">goal assignment</a> for this registration</td>
      <td colspan="2" rowspan="1">Goal is moved to the <span style="color: #000000;"><strong>ASSIGNED</strong></span> state</td>
    </tr>
    <tr>
      <td colspan="1" rowspan="1">Request <a href="https://dev.knewton.com/product/analyze/#expected-score">Expected Score</a></td>
      <td colspan="2" rowspan="1">Returns an empty payload as goal is not assigned to the registration <span style="color: #ff6600;">[WARNING] </span></td>
    </tr>
    <tr>
      <td colspan="1" rowspan="1">Request <a href="https://dev.knewton.com/product/analyze/#readiness-forecast">Readiness Forecast</a></td>
      <td colspan="2" rowspan="1">Returns an empty payload as goal is not assigned to the registration <span style="color: #ff6600;">[WARNING] </span></td>
    </tr>
    <tr>
      <td colspan="1" rowspan="1">Request <a href="https://dev.knewton.com/product/analyze/#active-time">Active Time</a> against goal</td>
      <td colspan="2" rowspan="1">Returns an empty payload as goal is not assigned to the registration <span style="color: #ff6600;">[WARNING] </span></td>
    </tr>
    <tr>
      <td colspan="1" rowspan="1">Request <a href="https://dev.knewton.com/developer/api-reference/recommendations/#get-registrationsidrecommendationgoal_idgoal_id">recommendations</a></td>
      <td colspan="2" rowspan="1">Returns a 404 error <span style="color: #ff0000;">[ERROR CASE]</span></td>
    </tr>
    <tr>
      <td colspan="1" rowspan="1">Send <a href="https://dev.knewton.com/developer/api-reference/student-events/#post-registrationsidgraded-events">graded event</a></td>
      <td colspan="2" rowspan="1">Event will not count towards any of the metrics for this particular goal, but will update learner knowledge state and update metrics on other goals and taxons for the registration</td>
    </tr>
    <tr>
      <td colspan="1" rowspan="1">Send <a href="https://dev.knewton.com/developer/api-reference/student-events/#post-registrationsidungraded-events">ungraded event</a></td>
      <td colspan="2" rowspan="1">Event will not count towards any of the metrics for this particular goal, but will update learner knowledge state and update metrics on other goals and taxons for this registration</td>
    </tr>
    <tr style="background-color: #d3d3d3;">
      <td colspan="3" rowspan="1">
        <p style="text-align: center;"><span style="color: #000000;"><strong>ASSIGNED </strong></span>State</p>
      </td>
    </tr>
    <tr>
      <td colspan="3" rowspan="1">Goals reach the <span style="color: #000000;"><strong>ASSIGNED</strong></span> state in one of two ways:</p>
        <ul>
          <li>The <a href="https://dev.knewton.com/developer/api-reference/goals/#put-learning-instancesli_idgoalsgoal_idregistrationsreg_id">goal assignment API</a> is call for this registration</li>
          <li><code>Assign=all</code> query parameter used during <a href="https://dev.knewton.com/developer/api-reference/goals/#post-learning-instancesidgoals">goal creation API</a> call</li>
        </ul>
      </td>
    </tr>
    <tr style="background-color: #fff4c3;">
      <td colspan="1" rowspan="1">
        <p style="text-align: center;"><strong>Action in<br />
        </strong><span style="color: #000000;"><strong><strong>ASSIGNED &amp; IN PROGRESS</strong></strong></span></p>
      </td>
      <td colspan="2" rowspan="1">
        <p style="text-align: center;"><strong>Response</strong></p>
      </td>
    </tr>
    <tr>
      <td colspan="1" rowspan="1">Request <a href="https://dev.knewton.com/product/analyze/#expected-score">Expected Score</a></td>
      <td colspan="2" rowspan="1">Returns latest Expected Score</td>
    </tr>
    <tr>
      <td colspan="1" rowspan="1">Request <a href="https://dev.knewton.com/product/analyze/#readiness-forecast">Readiness Forecast</a></td>
      <td colspan="2" rowspan="1">Returns latest Readiness Forecast</td>
    </tr>
    <tr>
      <td colspan="1" rowspan="1">Request <a href="https://dev.knewton.com/product/analyze/#active-time">Active Time</a> against goal</td>
      <td colspan="2" rowspan="1">Returns latest Active Time</td>
    </tr>
    <tr>
      <td colspan="1" rowspan="1">Request <a href="https://dev.knewton.com/developer/api-reference/recommendations/#get-registrationsidrecommendationgoal_idgoal_id">recommendations</a></td>
      <td colspan="2" rowspan="1"><span style="font-weight: 400;">Returns recommendations for the registration:</span></p>
        <ul>
          <li style="font-weight: 400;"><span style="font-weight: 400;">If focus_state in the recommendation response is “focused”, then most recent events for the registration have been processed and the recommendations returned is the latest set</span></li>
          <li style="font-weight: 400;"><span style="font-weight: 400;">If focus_state in the recommendation response is “unfocused”, then it’s possible that some of the recent events have not been processed; the client application may choose to request recommendations again</span></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td colspan="1" rowspan="1">Send <a href="https://dev.knewton.com/developer/api-reference/student-events/#post-registrationsidgraded-events">graded event</a></td>
      <td colspan="2" rowspan="1">Event will update learner knowledge state, which may generate new recommendations and update all goal-based analytics</td>
    </tr>
    <tr>
      <td colspan="1" rowspan="1">Send <a href="https://dev.knewton.com/developer/api-reference/student-events/#post-registrationsidungraded-events">ungraded event</a></td>
      <td colspan="2" rowspan="1">Event will update learner knowledge state, which may generate new recommendations and update all goal-based analytics</td>
    </tr>
    <tr style="background-color: #baf6aa;">
      <td colspan="1" rowspan="1">
        <p style="text-align: center;"><strong>Action in<br />
        </strong><span style="color: #000000;"><strong><strong>ASSIGNED &amp; READY</strong></strong></span></p>
      </td>
      <td colspan="2" rowspan="1">
        <p style="text-align: center;"><strong>Response</strong></p>
      </td>
    </tr>
    <tr>
      <td colspan="1" rowspan="1">Request <a href="https://dev.knewton.com/product/analyze/#expected-score">Expected Score</a></td>
      <td colspan="2" rowspan="1">Returns latest Expected Score</td>
    </tr>
    <tr>
      <td colspan="1" rowspan="1">Request <a href="https://dev.knewton.com/product/analyze/#readiness-forecast">Readiness Forecast</a></td>
      <td colspan="2" rowspan="1">Returns latest Readiness Forecast</td>
    </tr>
    <tr>
      <td colspan="1" rowspan="1">Request<a href="https://dev.knewton.com/product/analyze/#active-time"> Active Time</a> against goal</td>
      <td colspan="2" rowspan="1">Returns latest Active Time</td>
    </tr>
    <tr>
      <td colspan="1" rowspan="1">Request <a href="https://dev.knewton.com/developer/api-reference/recommendations/#get-registrationsidrecommendationgoal_idgoal_id">recommendations</a></td>
      <td colspan="2" rowspan="1"><span style="font-weight: 400;">If continued_recommendations query parameter is used when requesting recommendations, returns latest recommendations for the registration:</span></p>
        <ul>
          <li style="font-weight: 400;"><span style="font-weight: 400;">If focus_state in the recommendation response is “focused”, then most recent events for the registration have been processed and the recommendations returned is the latest set</span></li>
          <li style="font-weight: 400;"><span style="font-weight: 400;">If focus_state in the recommendation response is “unfocused”, then it’s possible that some of the recent events have not been processed; the client application may choose to request recommendations again</span></li>
        </ul>
        <p><span style="font-weight: 400;">If continued_recommendations query parameter is not used when requesting recommendations, the latest recommendations will not be sent</span></td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1">Send <a href="https://dev.knewton.com/developer/api-reference/student-events/#post-registrationsidgraded-events">graded event</a></td>
          <td colspan="2" rowspan="1"><span style="font-weight: 400;">Event will update learner knowledge state, which may generate new recommendations and update all goal-based analytics (new recommendations are not returned by default unless the continued_recommendations query parameter is used to request recommendations)</span></td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1">Send <a href="https://dev.knewton.com/developer/api-reference/student-events/#post-registrationsidungraded-events">ungraded event</a></td>
          <td colspan="2" rowspan="1"><span style="font-weight: 400;">Event will update learner knowledge state, which may generate new recommendations and update all goal-based analytics (new recommendations are not returned by default unless the continued_recommendations query parameter is used to request recommendations)</span></td>
        </tr>
        <tr style="background-color: #d3d3d3;">
          <td colspan="3" rowspan="1">
            <p style="text-align: center;"><span style="color: #000000;"><strong>DELETED</strong></span> State</p>
          </td>
        </tr>
        <tr>
          <td colspan="3" rowspan="1"><span style="font-weight: 400;"><span style="font-weight: 400;">Goals reach the </span></span><span style="font-weight: 400;"><strong>DELETED</strong> state when the </span><a href="https://dev.knewton.com/developer/api-reference/goals/#post-learning-instancesidgoals"><span style="font-weight: 400;">goal deletion API</span></a><span style="font-weight: 400;"> is called. Any calls made to this goal post-deletion will receive an HTTP 404 error.</span></td>
        </tr>
      </tbody>
    </table>





# Goals

Goals include, for example, due dates on upcoming assignments or navigation limitations such as “stay within this chapter.” Knowing the context in which each recommendation will be presented allows Knewton to recommend the most appropriate content for students, taking into account both personal proficiencies as well as overall course goals.

While the knowledge graph is shared for all users of a set of material, the event stream is specific to each student and the goals can potentially vary for each individual recommendation request.

See [Goal Management](/product/create-goals/) for more information.

## POST /learning-instances/{li\_id}/scoped-goals

Version: 0

Create a goal

### Request/Response JSON Keys

| Parameter | Type | Optional | Immutable | In/Out | Description |
| --- | --- | --- | --- | --- | --- |
| name | string | No | No | In/Out | Name of the goal _Warning_: Goal names must not contain any personally identifiable information (PII). Goal names containing email addresses in the name will be rejected. |  |
| targets.include | array of content IDs | No | No | In/Out |  |
| targets.score | float | No | No | In/Out |  |
| timing.end | DateTime | Yes | No | In/Out | Timestamp indicating when the goal is supposed to be completed by. One of "end" or "relative\_deadline" must be specified. Must also be less than 2-years after last time the goal was updated. |  |
| timing.relative\_deadline | DateTime | Yes | No | In/Out | Relative duration of the goal, i.e. time until deadline for completion, specified as ISO 8601 duration string. One of "end" or "relative\_deadline" must be specified. |  |
| scope.remediation\_depth | string | Yes | No | In/Out | Conceptual distance computed from learning objectives which targets are aligned to. Must be one of "none" (target content only), "one" (target content and all content prerequisites to target content), "two" (target content, all content prerequisite to target content and all content prerequisite to that prerequisite), "three" (target content, all content prerequisite to target content and two levels of content prerequisite to that prerequisite) or "maximum" (up to entity limit of recommendable modules). |  |
| scope.include | List | Yes | No | In/Out | List of taxon IDs (tref's) or module IDs (mref's) to be included in the recommendable pool. One of "include" or "remediation\_depth" must be specified. |  |
| scope.exclude | List | Yes | No | In/Out | List of taxon IDs (tref's) or module IDs (mref's) to be excluded from the recommendable pool. Defaults to \[\]. |  |
| config.analytics\_enabled | boolean | Yes | Yes | In/Out | Flag to indicate whether to compute goal-based analytics or not. Defaults to false. **If false, analytics requests for this goal will return empty payloads.** |  |
| config.assign\_to | string | Yes | Yes | In/Out | Specifies the types of registrations to assign the goal to when it's created. One of "learners", "instructors" or "all". Defaults to not assigning the goal to any registrations. |  |
| id | UUID | No | Yes | Out | Goal ID |  |
| last\_modified | DateTime | No | Yes | Out | Time the goal was last created or modified |  |
| completion\_criteria | object | Yes | Yes | In/Out | See the fields in this object below. Cannot be used if targets.score is used. Requires the goal to be defined with learning objective targets. |  |
| completion\_criteria.min\_predicted\_mastery | float | Yes | No | In/Out | The minimum score the student must achieve to be eligible for target completion, using the Predicted Mastery analytic. |  |
| completion\_criteria.min\_work\_per\_target | int | Yes | No | In/Out | The minimum number of assessing interactions the student must have on a target's concepts to be eligible for target completion. |  |
| completion\_criteria.max\_work\_on\_goal | int | Yes | No | In/Out | The maximum number of interactions (assessing and instructing) the student can have toward a goal (including on-target and off-target work), after which they'll achieve status "complete_max_work" on the goal, regardless of mastery. They will still receive recommendations, and if they complete via mastery, the status will become "complete". |  |

### Path Parameters

| Parameter | Type | Optional | Immutable | Description |
| --- | --- | --- | --- | --- |
| li\_id | UUID | No | Yes | ID of the learning instance that owns the goal |  |

### Samples

**URL:**
`https://api.knewton.com/v0/learning-instances/d0effd52-c3a7-4a3c-827a-3ac5eaa049a1/scoped-goals`

**Request Body**

```json
{
"name" : "Addition of single digit numbers",
"targets": {
"include" : [ "lref-lo56204", "lref-lo99879" ],
"completion_behavior" : "all",
"score" : 0.75
},
"timing" : {
"relative_deadline" : "P2W1D8H"
},
"scope": {
"remediation_depth" : "none",
"exclude": [ "tref-TOC:Unit5" ]
},
"config" : {
"analytics_enabled" : false,
"assign_to" : "all"
}
}
```

**Response Body**

```json
{
"id": "57466e95-6019-498d-9c42-9180aa663304",
"last_updated": "2013-04-12T17:00:00.000Z",
"name" : "Addition of single digit numbers",
"targets": {
"include" : [ "lref-lo56204", "lref-lo99879" ],
"completion_behavior" : "all",
"score" : 0.75
},
"timing" : {
"end": "2013-04-28T01:00:00.000Z",
"relative_deadline" : "P2W1D8H"
},
"scope": {
"remediation_depth" : "none",
"exclude": [ "tref-TOC:Unit5" ]
},
"config" : {
"analytics_enabled" : false,
"assign_to" : "all"
}
}

```

<aside class="notice">Use the account of an Instructor in the learning instance in order to create a goal.</aside>

## PUT /learning-instances/{li\_id}/scoped-goals/{goal\_id}

Version: 0

Update an existing goal. This change will apply to all registrations which currently have the goal assigned as the time of the update.

### Request/Response JSON Keys

| Parameter | Type | Optional | Immutable | In/Out | Description |
| --- | --- | --- | --- | --- | --- |
| name | string | No | No | In/Out | Name of the goal _Warning_: Goal names must not contain any personally identifiable information (PII). Goal names containing email addresses in the name will be rejected. |  |
| targets.include | array of content IDs | No | No | In/Out |  |
| targets.score | float | No | No | In/Out |  |
| scope.exclude | List | Yes | No | In/Out | List of taxon IDs (tref's) or module IDs (mref's) to be excluded from the recommendable pool. Defaults to \[\]. |  |
| scope.remediation\_depth | string | Yes | No | In/Out | Conceptual distance computed from learning objectives which targets are aligned to. Must be one of "none" (target content only), "one" (target content and all content prerequisites to target content), "two" (target content, all content prerequisite to target content and all content prerequisite to that prerequisite), "three" (target content, all content prerequisite to target content and two levels of content prerequisite to that prerequisite) or "maximum" (up to entity limit of recommendable modules). If neither "include" nor "remediation\_depth" is specified, this will default to "remediation\_depth": "maximum". |  |
| scope.include | List | Yes | No | In/Out | List of taxon IDs (tref's) or module IDs (mref's) to be included in the recommendable pool. One of "include" or "remediation\_depth" must be specified. |  |
| timing.end | DateTime | Yes | No | In/Out | Timestamp indicating when the goal is supposed to be completed by. One of "end" or "relative\_deadline" must be specified. Must also be less than 2-years after last time the goal was updated. |  |
| timing.relative\_deadline | DateTime | Yes | No | In/Out | Relative duration of the goal, i.e. time until deadline for completion, specified as ISO 8601 duration string. One of "end" or "relative\_deadline" must be specified. |  |
| config.analytics\_enabled | boolean | Yes | Yes | In/Out | Flag to indicate whether to compute goal-based analytics or not. Defaults to false. **If false, analytics requests for this goal will return empty payloads.** |  |
| id | UUID | No | Yes | Out | Goal ID |  |
| last\_modified | DateTime | No | Yes | Out | Time the goal was last created or modified |  |

### Path Parameters

| Parameter | Type | Optional | Immutable | Description |
| --- | --- | --- | --- | --- |
| li\_id | UUID | No | Yes | ID of the learning instance that owns the goal |  |
| goal\_id | UUID | No | Yes | ID of the goal to be updated |  |

### Samples

**URL:**
`https://api.knewton.com/v0/learning-instances/0cb6f3dc-8c6d-4bc7-b278-08d6147d9a0c/scoped-goals/57466e95-6019-498d-9c42-9180aa663304/`

**Request Body**

```json
{
"name" : "Multiplication of single digit numbers",
"targets": {
"include" : [ "mref-lo26482", "mref-lo917840" ],
"score" : 0.7
}
}
```

**Response Body**

```json
{
"id": "57466e95-6019-498d-9c42-9180aa663304",
"last_updated": "2013-04-12T17:00:00.000Z",
"name" : "Multiplication of single digit numbers",
"targets": {
"include" : [ "mref-lo26482", "mref-lo917840" ],
"completion_behavior" : "all",
"score" : 0.7
},
"timing" : {
"end": "2015-04-12T17:00:00.000Z",
"relative_deadline" : "P2Y"
},
"scope": {
"remediation_depth" : "maximum"
},
"config" : {
"analytics_enabled" : false,
"assign_to" : "none"
}
}

```

<aside class="notice">This must be a full update, partial updates will fail. All existing validation rules remain in effect.</aside>

## DELETE /learning-instances/{li\_id}/scoped-goals/{goal\_id}

Version: 0

Delete an existing goal.

### Path Parameters

| Parameter | Type | Optional | Immutable | Description |
| --- | --- | --- | --- | --- |
| goal\_id | UUID | No | No | ID of the goal to be deleted |  |
| li\_id | UUID | No | No | ID of the learning instance that owns the goal |  |

### Samples

**URL:**
`https://api.knewton.com/v0/learning-instances/0cb6f3dc-8c6d-4bc7-b278-08d6147d9a0c/scoped-goals/57466e95-6019-498d-9c42-9180aa663304/`

**Request Body**

None

**Response Body**

```json
{
"id": "57466e95-6019-498d-9c42-9180aa663304",
"created": "2013-04-12T17:00:00.000Z",
"name" : "Multiplication of single digit numbers",
"targets": {
"include" : [ "mref-lo26482", "mref-lo917840" ],
"completion_behavior" : "all",
"score" : 0.7
},
"timing" : {
"end": "2015-04-12T17:00:00.000Z",
"relative_deadline" : "P2Y"
},
"scope": {
"remediation_depth" : "maximum"
},
"config" : {
"analytics_enabled" : false,
"assign_to" : "none"
}
}
```

## PUT /learning-instances/{li\_id}/scoped-goals/{goal\_id}/registrations/{reg\_id}

Version: 0

Assign a goal to a registration

### Path Parameters

| Parameter | Type | Optional | Immutable | Description |
| --- | --- | --- | --- | --- |
| li\_id | UUID | No | No | ID of the learning instance that owns the goal |  |
| goal\_id | UUID | No | Yes | The ID of the goal to prepare for recommendations |  |
| reg\_id | UUID | No | Yes | ID of a registration to prepare for recommendations |  |

### Samples

**URL:**
`https://api.knewton.com/v0/learning-instances/0cb6f3dc-8c6d-4bc7-b278-08d6147d9a0c/scoped-goals/f6d8c4f2-4956-4ff6-aa8b-995b6c77d68f/registrations/d0effd52-c3a7-4a3c-827a-3ac5eaa049a1`

**Request Body**

None

**Response Body**

```json
{
"goal_id": "f6d8c4f2-4956-4ff6-aa8b-995b6c77d68f",
"registration_id": "d0effd52-c3a7-4a3c-827a-3ac5eaa049a1"
}
```

<aside class="notice">Current Account must be an instructor for this learning instance or have Partner Administrator privileges</aside>

## GET /learning-instances/{li\_id}/scoped-goals/{goal\_id}/registrations/{reg\_id}

Version: 0

Check if the registration has been assigned to this goal. If an HTTP 404 Not Found is returned, then it has not been assigned, otherwise it has been.

### Path Parameters

| Parameter | Type | Optional | Immutable | Description |
| --- | --- | --- | --- | --- |
| li\_id | UUID | No | Yes | ID of the learning instance that owns the goal |  |
| goal\_id | UUID | No | Yes | The ID of the goal to check for recommendation preparation |  |
| reg\_id | UUID | No | Yes | ID of the registration to check for recommendation preparation |  |

### Samples

**URL:**
`https://api.knewton.com/v0/learning-instances/0cb6f3dc-8c6d-4bc7-b278-08d6147d9a0c/scoped-goals/f6d8c4f2-4956-4ff6-aa8b-995b6c77d68f/registrations/d0effd52-c3a7-4a3c-827a-3ac5eaa049a1`

**Request Body**

None

**Response Body**

```json
{
"goal_id": "f6d8c4f2-4956-4ff6-aa8b-995b6c77d68f",
"registration_id": "d0effd52-c3a7-4a3c-827a-3ac5eaa049a1"
}
```

<aside class="notice">Current Account must be an instructor for this learning instance or have Partner Administrator privileges</aside>

## DELETE /learning-instances/{li\_id}/scoped-goals/{goal\_id}/registrations/{reg\_id}

Version: 0

Remove the assigning of a goal from a registration

### Path Parameters

| Parameter | Type | Optional | Immutable | Description |
| --- | --- | --- | --- | --- |
| li\_id | UUID | No | Yes | ID of the learning instance that owns the goal |  |
| goal\_id | UUID | No | Yes | The ID of the goal to stop preparing for recommendation |  |
| reg\_id | UUID | No | Yes | ID of the registration to stop preparing for recommendations |  |

### Samples

**URL:**
`https://api.knewton.com/v0/learning-instances/0cb6f3dc-8c6d-4bc7-b278-08d6147d9a0c/scoped-goals/f6d8c4f2-4956-4ff6-aa8b-995b6c77d68f/registrations/d0effd52-c3a7-4a3c-827a-3ac5eaa049a1`

**Request Body**

None

**Response Body**

None

<aside class="notice">Current Account must be an instructor for this learning instance or have Partner Administrator privileges</aside>

## PUT /learning-instances/{li\_id}/scoped-goals/{goal\_id}/registrations

Version: 0

Assign (or unassign) a goal to (or from) multiple registrations in a single call

### Request/Response JSON Keys

| Parameter | Type | Optional | Immutable | In/Out | Description |
| --- | --- | --- | --- | --- | --- |
| action | String | No | Yes | In/Out | Must be either "assign" or "unassign" |  |
| registration\_type | String | Yes | Yes | In/Out | Type of batch call - can be either "all" (action taken against all registrations) or "learners" (action taken against only learner registrations) or "instructors" (action taken only against instructor registrations). Only one of registration_type or registration_ids can be specified. |  |
| registration\_ids | Array of UUIDs | Yes | Yes | In/Out | List of registration ids to assign to or unassign from a particular goal in a learning instance. Only one of registration_type or registration_ids can be specified. |  |
| success.code | Integer | Yes | Yes | Out | Part of a partial response, the HTTP status code for this part |  |
| success.body | Object | Yes | Yes | Out | Part of a partial response, contains the successfully updated registration ids |  |
| success.body.registration\_ids | Array of UUIDs | Yes | Yes | Out | The IDs for the registrations successfully updated |  |
| failure\[x\].code | Integer | Yes | Yes | Out | Part of a partial response, the HTTP status for this part of the errors |  |
| failure\[x\].message | String | Yes | Yes | Out | Part of a partial response, a string description of the error that occurred |  |
| failure\[x\].error\_id | UUID | Yes | Yes | Out | Part of a partial response, a unique error ID for this failure |  |
| failure\[x\].body | Object | Yes | Yes | Out | Part of a partial response, contains the unsuccessfully updated registration IDs |  |
| failure\[x\].body.registration\_ids | Array of UUIDs | Yes | Yes | Out | The IDs for the registrations not successfully updated |  |

### Path Parameters

| Parameter | Type | Optional | Immutable | Description |
| --- | --- | --- | --- | --- |
| li\_id | UUID | No | Yes | ID of the learning instance that owns the goal |  |
| goal\_id | UUID | No | Yes | The ID of the goal to prepare or stop preparing for recommendations |  |

### Samples

**URL:**
`https://api.knewton.com/v0/learning-instances/0cb6f3dc-8c6d-4bc7-b278-08d6147d9a0c/scoped-goals/f6d8c4f2-4956-4ff6-aa8b-995b6c77d68f/registrations/`

**Request Body**

```json
{
"action": "assign",
"registration_ids": ["1538cf56-2fec-4734-b477-6b74ab489273","6b74ab48-7f56-6b74-6b74-6b741538cf56"
]
}
```

**Response Body**

```json
{
"action": "assign",
"registration_ids": ["1538cf56-2fec-4734-b477-6b74ab489273", "6b74ab48-7f56-6b74-6b74-6b741538cf56"
],
"success": {
"code": 200,
"body": {
"registration_ids": ["1538cf56-2fec-4734-b477-6b74ab489273", "6b74ab48-7f56-6b74-6b74-6b741538cf56"
]
}
}
}
```

<aside class="notice">Current Account must be an instructor for this learning instance or have Partner Administrator privileges</aside>


## Goal Creation Latency

The time it takes for a new goal to be created is a function of the number of target and recommendable module in the goal and, if it is being assigned at creation, the number of registrations it is being assigned to. While most responses are quite quick, the high-end timing is the following:

*   Up to **10 seconds** to create and assign very large goals
