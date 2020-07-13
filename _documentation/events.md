---
layout: 'documentation-single'
title: Events
description: Communicating student experiences to the Knewton Platform
keywords: 
order: 0

hero:
    title: Events (Student Events)
    text: Communicating student experiences and interactions
---



![4](/images/4.png)

Learners’ interactions with the application (e.g., answering questions, watching videos, completing homework) form the basis for Knewton recommendations and analytics. Whenever such an action occurs, the application should send an event describing the interaction to Knewton.

The application should:

**Send a graded event**

when a learner receives a grade for a question.

**Send an ungraded event**

when a learner watches a video or reads a passage.

The diagram below shows a simplified view of how Knewton processes events and recommendations. Events sent to Knewton are first queued for processing. An HTTP 204 No Content is then returned, meaning it has been accepted to be handled as soon as possible. Knewton then processes each event asynchronously.

Because the 204 response is returned before the event is processed, calls made immediately after should not depend on the event being processed.

**Note:** Even if the last event has not been processed yet, the module ID of said event will be filtered out from the next set of recommendation even when the recommendation itself has not been recomputed. Once the set of recommendations for this learner has been recomputed, the recommendation ID will change. In the general case it is not possible to associate a recommendation ID change with a particular event.

More information on retrieving recommendations is available [here](/product/receive-recommendations/).

![13-learning-app-flow](/images/13-learning-app-flow1.png)

## Events and Recommendations

Each event sent can cause a new recommendation to be generated for any goal assigned to that learner.

Whenever requested, the most recent recommendation is retrieved from the recommendations store and returned to the application. There is a certain latency associated with processing incoming events, so it may take up to 10 seconds for an event to fully propagate through the entire recommendation service. However, a fresh recommendation will always be available to the learner, taking all of the information we have received into account. In order to receive the freshest possible recommendation, the application should send an event as soon as all necessary event information is gathered.

Events that contain partial information should not be sent. Instead, all information should be gathered and then sent as a single event. Essay questions, for example, often need to be graded by an instructor rather than the application. Part of the information (the module\_id and interaction\_end\_time) is known immediately, while the result (is\_correct) is not known until after the essay is graded. Applications which support such questions would wait until the essay is graded, and then send a single event representing the essay information and its grade.

## Sending Events

Each event requires a different set of data to be returned, but they all require the application to:

1.  Make a POST request to the appropriate event endpoints.
2.  Check for a successful response.

Each event type includes both the registration of the user performing the action and the name of the event. For example, to notify Knewton that a user just finished watching an instructional video, the application might send the following event:

```
POST /v0/registrations/83ce46e1-ae1e-493a-95ab-826ee02a4118/ungraded-events
{
  "module_id": "mref-30c1337b-4193-4964-82b3-df52dbc8b4d0",
  "interaction_end_time": "2002-10-02T15:00:00Z"
}
```

Knewton responds to valid events with:

HTTP/1.1 204 No Content

Because successful events do not return any information, these calls are sometimes called “fire-and-forget.” However, in rare cases, an error may occur. The simplest option is to wait for the response for each event to ensure it was successfully received. This is fast because events are processed asynchronously. Another strategy is to hand events to an event dispatcher in a separate thread. Events can then be sent and retrieved asynchronously without interrupting the main application flow.

## How To Send An Event When A Question Is Answered

Graded events are the primary way that Knewton gains information about what a learner knows. When a learner correctly answers a question and an event is sent, proficiency models are adjusted and the question becomes less likely to be recommended again. Incorrectly answered questions have the opposite effect: either similar content or prerequisite content is more likely to be recommended again. Every question answered, and so every event sent, provides a better insight into what a learner knows at a specific point of time.

After the learner answers a question and a grade is calculated, the application should send a graded event. In the application

![events1-3.png](/images/events1-3.png.png)

above, learners see the solution after typing their answer and clicking the “Check Answer” button. At this point the application sends a graded event because the answer has been checked for correctness and displayed to the learner. For example, the event sent might be:

```
POST /v0/registrations/83ce46e1-ae1e-493a-95ab-826ee02a4118/graded-events
{
  "module_id": "mref-6a142970-c7c6-43be-ab65-9a87ebb5f500",
  "interaction_end_time": "2013-10-02T15:00:00Z",
  "duration": 60000,
  "is_correct": false,
}
```

This graded event tells Knewton that at 3:00pm on October 2nd, a user with registration (`83ce46e1...`) got an item (`mref-6a142970...`) wrong. The user spent 1 minute (60,000 milliseconds) working on the problem. The event provides evidence that the user may not understand the concepts the item is designed to assess, and so — depending on how the goal was constructed — the same user might next be recommended some instructional content on these concepts, or perhaps another question, or even some prerequisite content.

The basic flow when using graded events is:

1.  The application displays a question.
2.  The learner answers it.
3.  The application scores it and shows the result to the learner.
4.  The application sends a graded event to Knewton.

The fields in the graded event are:

*   `module_id`: the ID of the question
*   `interaction_end_time`: the time step #2 occurred (near enough to step #4 to just use that time)
*   `duration`: the time between step #1 and step #2
*   `is_correct`: the result of #3

An event should only be sent after the answer can no longer be changed. For example, Figure 6.3 shows a multiple choice question without a validation button. When one of the choices is selected, the correct answer is automatically displayed, as in Figure 6.4. Because the correct answer is already displayed, learners cannot change their answer. This application would send the event immediately after the learner makes a selection.

![events1-4](/images/events1-4.png)

Figure 6.3: Multiple choice which checks immediately after a choice is made

![events1-5](/images/events1-5.png)

Figure 6.4: Correct answer is immediately displayed after choosing

The above examples can be contrasted with a question with a confirm button, as in figure 6.5. Learners can select one of the choices, but then change their minds before pressing the confirm button. Because events are sent only for the learner’s final answer — the one on which the grade is based — this application would not send an event for any intermediate selections before confirm is pressed.

![events1-6](/images/events1-6.png)

Figure 6.5: A question with a confirm button

Because events take some time to process, allowing more time increases the probability they will be included whenever recommendations are requested or analytics are retrieved. Often the delay between seeing the correct answer and the learner pressing the “Next” button is enough time to process the event before the application requests the next recommendation.

This recipe describes when to send an event in which it’s clear that the final answer has been provided and graded. Other recipes describe less straightforward cases.

## How To Send Events For Answers Which Can Be Changed

Some applications allow learners to change their answers. Knewton supports such applications; however, it is important that the model’s interpretation of the event correctly captures the learner’s state of knowledge.

Sending an is\_correct=false graded event means the learner thinks the answer is A, but the correct answer is B. Sending such an event when the learner believes she can still change her answer would cause the models to believe the learner has lower proficiency than she actually does. This in turn would negatively affects recommendations and analytics. As in Who Wants to Be a Millionaire, contestants are not punished for answering incorrectly until they confirm “Is that your final answer?”

**Tip:** The application should not send a graded event until it knows the learner’s “final answer.” At that point, the event should be sent as soon as possible.

In a traditional homework assignment, learners can write their answers in pencil, and frequently go back and revise their answer before handing it in. While writing their initial answers, they are not overly concerned with correctness: there is a chance to review answers before submitting it. Students are not punished for erasing an answer and replacing it with another. In the same way, graded events should not be sent until the question can no longer be changed.

There is a difference between changing an answer and retrying a question answered incorrectly. Learners who change their answer are simply changing their mind. However, those who retry a question first answered it wrong, and then attempted it again.

**Tip:** The application should send a single event no matter how many times an answer is changed. It should send a separate event every time an answer is attempted.

The interaction\_end\_time should be set to the latest time that the question was answered. The application might first save the current time when it is answered; if the learner changes the answer, the value can be replaced with the new time. When all answers can no longer be changed, the most recent saved time can be sent.

![events1-7](/images/events1-7.png)

The wireframe above shows a learner who incorrectly gave the answer 20, but has the ability to try the question again by entering another answer and pressing the “Re-check answer” button. Because the answer was validated and the result shown, the application might send this event the first time the answer was submitted:

```
POST /v0/registrations/83ce46e1-ae1e-493a-95ab-826ee02a4118/graded-events
{
  "module_id": "mref-6a142970-c7c6-43be-ab65-9a87ebb5f500",
  "interaction_end_time": "2013-10-02T15:00:00Z",
  "duration": 10000,
  "is_correct": false
}
```

If the “Re-check answer” button is pressed, another event would be sent. This would continue until the learner gives up. Knewton interprets each of these events as a separate attempt, and it should be clear to learners that they are answering the question wrong, not simply changing their answer.

Suppose the application displays the correct answer before the learner answers it correctly, as in the wireframe below. In this case the application would always send a single is\_correct event: either true or false. Both designs — allowing learners to change their answer and not — are supported by Knewton.

![events1-8](/images/events1-8.png)

## How to Determine When to Send Events

Sometimes it might not be clear when an event should be sent. For example, if a learner starts to view an instructional video but stops midway, should an ungraded event be sent? Or if a student does part of an assessment module correctly, but doesn’t complete the last step, should a graded event be sent? This is a decision for each individual partner. Instructional videos and assessment modules are examples of atoms — the most granular piece of content which Knewton knows about. For Knewton, an atom is either viewed or not; an assessment item is either viewed or not. There is no notion of “partially instructed” or “partially assessed.” The partner must decide whether partial completion is synonymous with completion; if so, an event should be sent. If partial completion is not good enough, then an event should not be sent unless 100% of the atom has been completed. There is flexibility within the Knewton API for each partner to express its own product vision. For example, one application might require a student to have watched 100% of an instructional video to send an ungraded event. Another application might require that the student watched only 90%. Another application that presented content repeated in various ways, in the same instructional module, might only require 30%. Many times, an application won’t be instrumented to know how much of a video a student has seen, or if that student has scrolled through all the available text content. But if the application has separate “continue” and “skip” buttons, for example, the application would probably want to send an ungraded event after the learner clicked “continue,” but **not** send an event if the learner specifically clicked the “skip” button.

## How To Send Events For Manually Graded Questions

As described in [How to Send an Event when a Question is Answered](/developer/events/#recipe-events-regular), the application sends graded events after learners provide final answers and the answer is graded. If the application can automatically check the answer, the two actions occur at the same time. However, if scoring is a manual step, as is commonly the case with essay questions, the event containing the score can not be sent until grading is completed.

Sending an event for a manually graded question is no different than an automatically graded question: the graded event should be sent when the answer is scored. However, the interaction\_end\_time should be set to when the question was answered. This way Knewton can tell when the learner actually did the work, even if scoring occurs at a later time. Knewton doesn’t need to know the score time, just the time the learner finished interacting with the item.

If Knewton recommends a manually graded question, it is likely to continue recommending the same module until the question has been scored and an event sent. Since there is a delay between the learner providing the final answer and the event being sent, simply displaying the first recommended module would cause the same question to be displayed over and over.

Fortunately, Knewton can be configured to return multiple modules as part of the recommendation by setting the max\_recommendation\_size to a value greater than 1 when creating the goal. When the application receives a new recommendation, it can simply ignore those which are waiting to be graded.

## How To Calculate An Accurate Event Duration

The duration field is an optional field on both graded and ungraded events. Although events can be sent without setting it, some operations function poorly or not at all when omitted. The Active Time model, for instance, ignores all events that do not contain a duration. The duration parameter also enables the most accurate representation of the learner’s knowledge state. For example, a learner who usually answers questions quickly but spends more time on a particularly challenging question is probably struggling.

**Tip:** Although the field is optional, applications should compute and send duration data in order to ensure best recommendation quality and accurate values for the active time analytics metric.

To calculate the duration, a timer should be started when a learner is first shown the item, and stopped when the item is no longer visible. Actions not directly related to the question, like displaying a help screen or a leaderboard, should pause the timer. However, displaying a calculator or a scratch pad should not pause the timer, since these actions are directly related to the question being answered. The application might decide to pause the timer when a user logs out of the system and resume it when the question is displayed again, especially if work that the user performed is persisted with the question. Duration should include all time spent answering the question.

If some content is viewed multiple times before sending an event, the total of all time spent viewing that item should be sent. However, if an item is viewed on two separate occasions with an event sent for each, the timer should be reset before it is viewed a second time. Finally, note that the duration field is in milliseconds.



**Warning:** Recommendations requested for unfocused goals are not updated until the goal is focused again. If many events were sent since becoming out of focus, the recommendation may be significantly different from what would have been recommended for a focused goal. For this reason, the application should check every incoming recommendation for the state “focused”. If a recommendation is returned with “unfocused”, the application should immediately send a focus event for that goal and try again.

**Warning:** Applications should expect some latency between the time when a goal is assigned to a registration and the time when the first recommendation can be retrieved. During this period of time the recommendation request for this goal and registration pair will result in a 404 error (see [Additional Timing Consideration](https://dev.knewton.com/developer/api-reference/additional-timing-considerations/) for more detail).

## How to Send a Batch of Student Events

The Knewton API allows events occurring within a learning application to be sent individually as they occur (as discussed above), or grouped and sent in a batch. Knewton prefers to receive events as soon as they occur. However, this is not possible for applications that allow students to work offline or where events are generated very rapidly. It also isn’t possible in cases where students can’t rely on having a constant Internet connection. All four types of student events — focus events, ungraded events, graded events, and recommendation followed events — can be sent using the batch endpoint. In order to create batches that comply with the endpoint’s requirements, the application needs to have specific logic added for batch formation. A batch must:

*   have zero or one focus events;
*   order events chronologically (oldest event first);
*   not exceed 500 events in the batch; and
*   only include events for a single registration.

The best way to think about creating logic for a batch is to think about the learner flow through the learning application. When a learner starts a new section, a focus event is queued. If there are recommendations available and the learner selects one, a recommendation followed event is queued. When the learner views instructional content, an ungraded event is queued. When the learner answers a question, a graded event is queued. When the learner switches to working on a new section, the application should store the previous events to be sent as one batch and start a new batch that begins with this focus event. If the learner workflow does not include starting a new section or switching between sections (meaning no focus events are needed), all of the events can be sent together in one batch. This implementation would lead to code similar to this example:

```
var event_queue = {}
var current_batch = {}

def send_event(user, event_params):
if online:
api_send_event(user, event_params)
else:
if event_params.is_focus() or current_batch[user].size() >= 500:
event_queue[user].enqueue(current_batch[user])
current_batch[user].empty()
if event_params.is_focus():
current_batch[user].add_goal(event_params.goal_id)
else:
current_batch[user].enqueue(event_params)

def callback_online_again():
for (user in event_queue):
goal = get_last_focused(event_queue[user])
while (event_queue[user].not_empty()):
event_batch = event_queue[user].dequeue()
api_send_events(user, event_batch, type = “/batch-events”)

recommendation = wait_for_recommendation(user, goal)
user.recommend(recommendation)


```

If events are sent out of order, analytics will be inaccurate for the learner. The queue of batched events should check that each batch submitted has been successfully accepted before sending the next batch in the queue. Success and error responses for batch events will follow the error codes [here](http://dev.knewton.com/developer/api-reference/response-codes/). This is an example batch event that includes a focus event. If there were no focus event the goal\_id at the beginning would be omitted from the call.

```

POST registration/{id}/batch-events

{
  "goal_id" : “f7e86f46-b81f-4ef7-aac1-e4fdf5e7612e”
  "events" : [
  {
    "type" : "recommendation-followed",
    "recommendation_id": 9289981387,
    "module_id": "mref-c3f6b4f2-4496-4e46-a48b-885b9a44c86b",
    "time_followed": "2012-11-19T16:30:32-04:00"
    },
    {
      "type" : “graded-events”
      "duration": 12294,
      "module_id": "mref-f7e86f46-b81f-4ef7-aac1-e4fdf5e7612e",
      "interaction_end_time": "2012-11-19T16:31:31-04:00",
      "is_correct": true
    },
    {
     "type" : “ungraded-events”
     "duration": 312904,
     "module_id": "mref-c3f6b4f2-4496-4e46-a48b-885b9a44c86b",
     "interaction_end_time": "2012-11-19T16:32:30-04:00"
   }]
 }





# Student Events

All events are associated with a registration, i.e. an account registered in a learning instance. Whenever an event is sent through the API, the Knewton platform gains more understanding of the learner's progress. There are three types of events:

1.  Graded event: A learner performed an action on a module that could have a grade; for example, the learner answered a multiple choice question.
2.  Ungraded event: A learner performed an action on some other type of module; for example, the learner watched a video.
3.  Recommendation followed event: A learner followed a recommendation sent by Knewton.

## POST /registrations/{id}/ungraded-events

Version: 0

Creates a new ungraded event for the given registration. This is used to record work that a student has done against a module which does not assess knowledge, typically a teaching module.

Note that events (including ungraded events) should only be sent on atoms, and never on bundles. If a student completes atoms in a bundle, then a separate event must be sent for each atom.

### Request/Response JSON Keys

| Parameter | Type | Optional | Immutable | In/Out | Description |
| --- | --- | --- | --- | --- | --- |
| duration | Duration | Yes | Yes |  | The best estimate of the number of milliseconds the student gave primary attention to the module. This is **required** if Active Time or Time Spentwill be requested for as part of Analytics. |  |
| module\_id | UUID or Content ID | No | Yes |  | ID of the module on which this event took place. |  |
| interaction\_end\_time | DateTime | No | Yes |  | The time this interaction ended. Note: If duration is provided, start time is found by subtracting "duration" from "interaction\_end\_time". |  |
| is\_complete | boolean | Yes | Yes |  | This field is **not used** but is preserved for backwards compatibility, and should always be present and set to **‘true’** in all implementations. If a student has not fully consumed a piece of content, then no event should be sent at all. |  |
| goal\_id | UUID | No | Yes |  | ID for the goal which the event is a part of - this field can be passed instead of making an additional call using the ../recommendation-followed-events endpoint |  |

### Path Parameters

| Parameter | Type | Optional | Immutable | Description |
| --- | --- | --- | --- | --- |
| id | UUID | No | No | Registration of the student creating the event. |  |

### Samples

**URL:**
`https://api.knewton.com/v0/registrations/d0effd52-c3a7-4a3c-827a-3ac5eaa049a1/ungraded-events`

**Request Body**

```json
{
"duration": 312904,
"module_id": "mref-c3f6b4f2-4496-4e46-a48b-885b9a44c86b",
"interaction_end_time": "2012-11-19T16:30:31-04:00",
"is_complete": "true"
}
```

**Response Body**

None.

<aside class="notice">Registration must be for the current account.</aside>

## POST /registrations/{id}/graded-events

Version: 0

Sends a new graded event for the given [registration](#registrations). This is used to record work that a student has done against a module which assesses a learner.

Note that events (including graded events) should only be sent on atoms, and never on bundles. If a student completes atoms in a bundle, then a separate event must be sent for each atom.

### Request/Response JSON Keys

| Parameter | Type | Optional | Immutable | In/Out | Description |
| --- | --- | --- | --- | --- | --- |
| duration | Duration | Yes | Yes |  | The best estimate of the number of milliseconds the student gave primary attention to the module. This is **required** if Active Time or Time Spent will be requested for as part of Analytics. |  |
| module\_id | UUID or Content ID | No | Yes |  | ID of the module on which this event took place. |  |
| interaction\_end\_time | DateTime | No | Yes |  | The time this interaction ended. Note: If duration is provided, start time is found by subtracting 'duration' from 'interaction_end_time'. |  |
| is\_correct | boolean | No | Yes |  | `true` if the learner demonstrated the knowledge assessed by the item, `false` otherwise. |  |
| is\_complete | boolean | Yes | Yes |  | This field is **not used** but is preserved for backwards compatibility, and should always be present and set to **‘true’** in all implementations. If a student has not answered an assessment module, then no event should be sent. If the student has answered an assessment module, but the partner software does not yet know if the assessment is correct or incorrect, then it should wait to send an event until it has determined correctness. |  |
| instance\_hash | String | Yes | Yes |  | A string that uniquely identifies which instance of an algorithmic question was shown, within the context of the module\_id. This field should only be provided when sending an event for algorithmic question. |  |
| goal\_id | UUID | No | Yes |  | ID for the goal which the event is a part of - this field can be passed instead of making an additional call using the ../recommendation-followed-events endpoint |  |

### Path Parameters

| Parameter | Type | Optional | Immutable | Description |
| --- | --- | --- | --- | --- |
| id | UUID | No | No | The registration ID of the student creating the event. |  |

### Samples

**URL:**
`https://api.knewton.com/v0/registrations/d0effd52-c3a7-4a3c-827a-3ac5eaa049a1/graded-events`

**Request Body**

```json
{
"duration": 12294,
"module_id": "mref-f7e86f46-b81f-4ef7-aac1-e4fdf5e7612e",
"interaction_end_time": "2012-11-19T16:30:31-04:00",
"is_correct": true,
"instance_hash": "6,7",
"is_complete": "true"
}
```

**Response Body**

None.

<aside class="notice">Registration must be for the current account.</aside>
