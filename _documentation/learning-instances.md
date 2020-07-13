---
layout: 'documentation-single'
title: Learning Instances (classes)
description: Manage your adaptive learners in meaningful groups
keywords: 
order: 0

hero:
    title: Learning Instances (classes)
    text: Manage your adaptive learners in meaingful groups
---

Learning applications allow groups of students to work through the same content toward a common learning objective. These groups range from very large (e.g., hundreds of students in an introductory college course) to very small (e.g., a single student working in a direct-to-consumer application).

Regardless of the size of the group, the ability to enroll students in distinct groups is critical. The ability to assign learning objectives — expressed as [goals](/product/create-goals/) — to the group as a whole and to monitor a group’s progress towards those objectives by querying inferred [analytics](http://dev.knewton.com/product/analyze/ "Analyze") for the group are also crucial.

The Knewton API uses the term “learning instance” to refer to a grouping of users in the context of an application. For example, an application might use a learning instance to represent a class of students in a bricks-and-mortar class, the full roster of students in an online class, or a group of students in an ad hoc study group.

![2](/images/2.png)

As shown above, learning instances are often created as part of the initial application provisioning process. This corresponds well with a use case in which the set of learning instances is known beforehand and remains static (e.g., sections and courses scheduled for the current semester at a high school). In such a case, the application can construct the learning instances prior to any student interacting with content or asking for recommendations. In other use cases, it may be necessary to create new learning instances dynamically, based on input from instructors and/or school administrators.

In order for an application to create a new learning instance resource using the Knewton API, at least one knowledge graph must be ingested and available. This enables the application to provide a graph ID for the content it wants to associate with the instance. The association between the graph and the learning instance remains immutable for the lifetime of the learning instance.

Once a learning instance has been created, the application can start enrolling students. Enrollment is represented by “registrations,” which associate a user account with a learning instance. A user may be registered in multiple learning instances at once, and can be unregistered or re-registered in learning instances at any point. However, when a user is unregistered, the analytics data associated with that learning instance (i.e., goal-driven metrics) is discarded.

The Knewton API differentiates between two different types of registrations — “instructor” and “learner” — corresponding to instructors and learners for that learning instance. Instructors are permitted to assign goals and retrieve analytics for some or all registrations in the learning instance.

By associating user accounts with learning instances through a registration, the application can orchestrate the user’s learning experience across multiple learning instances and knowledge graphs.

![6-account-reg-graph](/images/6-account-reg-graph.png)

The user experience is further modulated by [goals](/product/create-goals) (also associated with learning instances) and [analytics](http://dev.knewton.com/product/analyze/ "Analyze") (associated with goals), which can be retrieved by instructors and learners for a given learning instance.



# Registrations

A record of the presence of an account in a learning instance (for example, a learner enrolled in a course). A registration is a link between an account and a learning instance.

## POST /registrations

Version: 0

Register a user in a given [learning instance](#learning-instances).

### Request/Response JSON Keys

| Parameter | Type | Optional | Immutable | In/Out | Description |
| --- | --- | --- | --- | --- | --- |
| id | UUID | Yes | Yes | Out | The registration ID. |  |
| account\_id | UUID | No | Yes | In/Out | The ID of the account that will be the owner of this registration. |  |
| learning\_instance\_id | UUID | No | Yes | In/Out | The ID of the [learning instance](#learning-instances) in which to register the user. |  |
| type | learner or instructor | No | Yes | In/Out | "Learner": a learner in a [learning instance](#learning-instances). "Instructor": a registration that receives administrative privileges on the [learning instance](#learning-instances). |  |
| invalid | boolean | Yes | Yes | Out | Automatically set to true if the registration becomes invalid, for example if the associated learning instance is deleted. |  |

### Samples

**URL:**
`https://api.knewton.com/v0/registrations`

**Request Body**

```json
{
  "type": "learner",
  "account_id": "eff3b9cf-df82-477a-ac12-c0e01b90bf6e",
  "learning_instance_id": "307b072c-6194-46fa-b226-68d40cee521f"
}
```

**Response Body**

```json
{
  "id": "d0effd52-c3a7-4a3c-827a-3ac5eaa049a1",
  "type": "learner",
  "account_id": "eff3b9cf-df82-477a-ac12-c0e01b90bf6e",
  "learning_instance_id": "307b072c-6194-46fa-b226-68d40cee521f",
}
```

<aside class="notice">Use the partner administrator account to register instructors whereas use the instructor account to register learners into a learning instance.</aside>

## GET /registrations/{id}

Version: 0

Retrieves a registration.

### Path Parameters

| Parameter | Type | Optional | Immutable | Description |
| --- | --- | --- | --- | --- |
| id | UUID | No | No | ID of the registration to retrieve. |  |

### Samples

**URL:**
`https://api.knewton.com/v0/registrations/d0effd52-c3a7-4a3c-827a-3ac5eaa049a1`

**Request Body**

None

**Response Body**

```json
{
"id": "d0effd52-c3a7-4a3c-827a-3ac5eaa049a1",
"type": "learner",
"account_id": "eff3b9cf-df82-477a-ac12-c0e01b90bf6e",
"learning_instance_id": "307b072c-6194-46fa-b226-68d40cee521f"
}
```

<aside class="notice">The current account must be an instructor of the learning instance or have partner administrator privileges, or be the registration owner.</aside>

## DELETE /registrations/{id}

Version: 0

Deletes the registration from a given [learning instance](#learning-instances).

### Path Parameters

| Parameter | Type | Optional | Immutable | Description |
| --- | --- | --- | --- | --- |
| id | UUID | No | No | Registration ID to delete. |  |

### Samples

**URL:**
`https://api.knewton.com/v0/registrations/d0effd52-c3a7-4a3c-827a-3ac5eaa049a1`

**Request Body**

None

**Response Body**

None.

<aside class="notice">The current account must be an instructor of the learning instance or have partner administrator privileges.</aside>
