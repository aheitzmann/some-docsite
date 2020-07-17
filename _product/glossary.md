---
layout: 'product-single'
title: Platform Glossary
description: Glossary of common platform terms
keywords: 
order: 0 

hero:
    title: Glossary
    text: 
---

**Account** – A user signed into a specific learning application. The account generally includes the user’s unique identifier on the application’s system. Both learners and instructors may have accounts.

**Alignment** – Course instruction and assessment are aligned when the units of instruction in a course teach the concepts assessed by the corresponding units of assessment.

**Analytics** – Inferred metrics that provide instructors, learners, and parents with deeper insight to drive meaningful interventions. Knewton analytics are typically defined by probabilistic models that take into account large amounts of observed data about learner interactions with content and other data from the partner system, and present back actionable information.

**API** – Application Programming Interface. An API is a software interface between a client application and the server. The Knewton API is the software interface between a partner’s learning application and the Knewton platform.

**Atoms** – The minimal unit of content that can be distinguished when recording learner interactions. This is the smallest way a piece of content can be broken down and still make sense (e.g., a quiz could be broken down into questions, each of which would be an atom; a 15-minute video could be broken into three main segments, each of which would be an atom).

**Bundles** – A group of atoms. For example, a bundle might be the set of instructional and assessment items in a lesson consisting of a sequence of videos and text that is recommended as a whole or a set of assessment items on a test.

**Client ID** – A unique identifier Knewton assigns to the partner’s learning application. The client ID is used in user authentication flows to identify the application.

**Client Secret** – A secret key assigned by Knewton to the partner’s learning application. The client secret is used in user authentication flows to verify the identity of the application.

**Concept** – A group of content assets aligned around a common learning outcome (aka learning objective). Knewton’s treatment of “concepts” is unique in that a Knewton concept is formally defined by content. The name and description of each concept must therefore be strictly reinforced by the parts of content that teach or assess that concept.

**Confidence Interval** – A range that indicates the set of values that are realistically possible for a given parameter. For instance, for a learner’s Expected Score on a goal, a 95% confidence interval of (.80, .90) means that Knewton’s models believe that 95% of the time, under normal conditions, the learner will receive a score between 80 and 90%.

**Content Inventory** – A complete listing of every piece of content in a learning application or book, corresponding to the “Modules” tab in an API knowledge graph spreadsheet. Each piece of content should represent a single interaction between the learner and the application (e.g., a single assessment question or a single instructional lesson).

**Content** – Teaching or assessment materials included in a Knewton-powered course.

**Discreteness** – A course with discrete content is a course that has minimal “overlap” among concepts as well as minimal overlap among the content that is aligned to these concepts.

**Entitlement** – A set of permissions granted to a user account of Knewton’s API allowing the user to perform certain actions through API calls.

**Expected Score** – A metric estimating a learner’s level of knowledge with respect to a specific assessment targeted by a goal. This metric answers the question, “What score would Knewton expect a particular learner to get on an assessment, in the form of a Knewton goal, if they took the assessment right now?” Expected score is reported over goals on a typical 0 to 1 scale and includes an estimate status which indicates whether there is sufficient data to calculate the value.

**Event** – A learner interaction within the learning application. Events inform Knewton’s generation of recommendations and analytics.

**Goals** – Objectives that define the scope of the partner application’s adaptivity. A goal could be an assignment with a few learning objectives due at the end of the end of a particular week, or a quiz assessing all of the skills worked on a given month. Every recommendation request in a Knewton-powered learning application must be in reference to a goal.

**Granularity** – Refers to the sizes of the entities that describe the course.

**Informal data** – Optional content or activity characteristics that may be worth recording, e.g., intended age alignments of content or expected time required for completion.

**Integration (environment)** – An API environment made available for the purposes of testing builds and prototypes of partner applications during the integration process.

**Item** – A subtype of module that has assessment value, i.e., can be answered correctly or incorrectly (such as a quiz question).

**Knowledge Graph** – A structured representation of the content in a course, as defined by a group of subject-matter experts. The knowledge graph is the subject matter experts’ best hypothesis about the important conceptual structures in a body of content. This hypothesis is used to inform initial recommendations and analytics. As Knewton gathers learner data, the hypothesis is refined, as are the recommendations and analytics that users see.

**Learning Application (LA)** – A partner’s software that delivers learning experiences. The learning application serves both instructional and assessment content.

**Learning Instance** – A grouping of users around a common piece of educational content collection. A section of a class, for example, is a learning instance.

**Metadata Tags** – A metadata marker used to annotate modules that share a feature not explicitly captured by the properties or relations of the graph.

**Modularity** – Modular courses contain units that can be delivered in a variety of orders, with the optimal order dependent on the individual’s needs.

**Module** – A single piece of content that Knewton can observe learners interacting with, e.g., a section of text, a question, or a video.

**Point Estimate** – A single value estimate of a particular metric. Usually a point estimate will be returned with a confidence interval.

**Postrequisite Concept** – The concept on the other end of the prerequisite relationship. If concept A is prerequisite to concept B, then concept B is postrequisite to concept A.

**Prerequisite** – A relationship between two concepts that states a learning dependency of one concept on the other. Concept A is prerequisite to concept B if the content associated with concept B expects and assumes knowledge that exists in the content associated with concept A — and no other intermediate concepts transmits this knowledge along the way.

**Properties (of modules)** – Capture features of modules that are used by recommendations and/or analytics, e.g., the time the module was created.

**Recommendable modules** – In a goal, the set of modules that Knewton is permitted to recommend. This allows a partner to limit recommendations to a certain part of the knowledge graph. It is at the partner’s discretion whether or not the target modules are included within the recommendable modules.

**Recommendation** – An up-to-date listing of the next set of content that a learner should interact with, based on previous interactions.

**Registration** – A link between an account and a learning instance. An account may have many registrations at any given time.

**Sandbox (environment)** – An API environment made available for the purposes prototyping partner applications using a Knewton sample graph.

**System user** – An administrator user account with “all” entitlements. A single system user is created by Knewton for every partner. The system user is typically used to provision key application resources like accounts, learning instances, and registrations.

**Target modules** – The set of modules used in a goal, which define the content a partner wants a student to achieve proficiency on (as defined by the target score). Also see “recommendable modules”

**Target score** – In a goal, the level of proficiency a partner wants a student to achieve on a set of target modules. For example, a target score of 0.7 means that the partner wants the student to reach a level of proficiency where they would be expected to get at least 70% of the target modules correct

**Target date** — In a goal, the date which a partner wants a student to reach a particular target score by. The target date can be used to correspond to in-class test dates or other deadlines.

**Taxon** – A component of a larger taxonomy. Examples include a textbook structure, Common Core State Standard, or reading lexile levels.

**Taxonomies** – A hierarchical labeling a partner can apply to content. Taxonomies have relevance to the partner but are not intrinsic to Knewton’s models. Taxonomies are comprised of taxons.

**(Access) Token** – A short sequence of characters generated by the Knewton API and passed to the learning application as part of the authentication flow. Applications then use these tokens to securely and uniquely identify the user on whose behalf the API calls are made.

**Volume** – The amount of content available for Knewton to recommend. The Knewton system is designed to work with large volumes of content but can also adapt to situations where content is sparse.
