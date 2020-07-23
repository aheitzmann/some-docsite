---
layout: 'content-single'
title: Best practice for adaptive content
description: Things to consider when designing, building or curating adaptive content
keywords: 
order: 0 

hero:
    title: Best practice for adaptive content
    text: Things to consider when designing, building or curating adaptive content
---

When developing content for adaptivity, partners should keep several qualities in particular in mind. These include:

*   Granularity
*   Alignment
*   Discreteness
*   Modularity
*   Volume

Partners should also think about two other factors in particular:

*   Assessment Components
*   Algorithmic Questions

These qualities and factors are described in more detail below.

## Granularity

Granularity refers to the sizes of the pieces of content within the course. There are two granularities that need to be defined:

1.  The granularity at which student interactions can be communicated to Knewton. Ideally, this is as small as possible (e.g., at the question level, answer level etc.) For example, when a student watches a video and then answers two questions, we should receive three events. One ungraded event will be sent for the video when the student completes watching it and then a graded event will be sent for each question when each is completed.
2.  The granularity of the objects that Knewton should recommend. For example, a partner might specify that Knewton should only recommend containers which include a piece of instructional content and at least two questions.

These two granularities are related but distinct. In some cases, these granularities may be the same (e.g., student interactions and recommendations may both be tracked at the item level). In other cases, the granularities will be distinct. For example, student interactions might be communicated to Knewton at a finer granularity (e.g., a student answering the first step of a multi-step assessment correctly) while Knewton recommends content at a coarser granularity (e.g., in the form of an individual assessment item).

Communicating student interactions at the most granular level possible gives Knewton a more precise understanding of a student’s proficiencies, and allows Knewton to provide more targeted and effective Recommendations and Analytics. Though the subject matter will inform the appropriate granularity for the learning objectives in a course, the following examples give some sense of reasonable sizes of learning objectives:

*   A learning objective that takes 10 minutes of classroom time to teach
*   A learning objective that is taught by a 3-page subsection of a textbook
*   A learning objective that can be assessed sufficiently with 10 questions

## Alignment

It is important for content in an adaptive course to be well-aligned.

![Content Best Practice]({{ '/resources/images/content-best-practice-1.png' | relative_url }})

The visual above shows proper content alignment. Here, each letter represents a particular learning objective: A, B, or C. The boxes in the top row represent assessment content assets, each of which assesses a particular learning objective (as labelled). The boxes in the bottom row represent instructional content assets; here, each asset teaches a given objective (as labelled).

Choices about how content is placed in containers can lead to a case of misalignment, as in the diagram below:

![Content Best Practice]({{ '/resources/images/content-best-practice-2.png' | relative_url }})

Here, the large box in the top row represents a single quiz, which simultaneously assesses learning objectives A, B, and C. A teacher could not assess a student on the single learning objective A — even if she were already confident in her measure of the student’s proficiencies on learning objectives B and C.

There are other opportunities for inefficiencies to arise. Consider the visual below:

![Content Best Practice]({{ '/resources/images/content-best-practice-3.png' | relative_url }})

Here, the instructional lessons are contained in a way that does not correspond with the containment of the assessment items. In a scenario like this, after assessing a student on learning objective A and realizing that he does not understand it, an instructor might want to instruct him further on this learning objective. In the above scenario, however, the instructor would need to show the student instructional content about learning objective X and learning objective Y as well. These learning objectives may not be worthwhile for the student to study — perhaps because they are not relevant for the course, perhaps because he is not yet prepared to learn them.

**Note:** The Knewton system is designed to handle misalignment as best it can. If content has already been developed and grouped in such a way that there is misalignment, our system can still function.

## Discreteness

Related to granularity and alignment is the notion of discreteness. A course with discrete content has minimal overlap among both a) learning objectives and b) the content that is aligned to these learning objectives. Discreteness doesn’t mean that learning objectives aren’t related — indeed, in many cases, they build on one another. The important point is that content should be developed or curated around distinct learning objectives, so that instruction and assessment can be more targeted and precise.

## Modularity

Unlike traditional linear courses, which contain units that must be delivered in a certain sequence, modular courses contain units that can be delivered in a variety of orders, depending on the individual’s needs. In general, it is easier to integrate adaptive learning technology into more modular courses.

Because Knewton attempts to find the ideal learning path for each student, there is no predefined order in which a student will encounter recommended content. As a result, the content in a fully adaptive course should contain a minimal amount of “pre-sequencing”; course-level pre-tests, post-tests, and upfront diagnostics, for example, can constrain the degree of personalization within a course, as can strict intra-lesson sequences. A fully adaptive course should also not contain implicit ordering schemes (e.g., lesson numbers or a table of contents) or references within content to moments of instruction that may or may not have happened yet (“As you saw in the last lesson…”).

Modular courses can still contain structure and enable instructors to set strong linear milestones. Knewton Recommendations can be embedded in a way that supports existing product flows, such as instructor-created assignments and comprehensive final exams. Moreover, partners — and the end users of a partner’s product — can help guide Recommendations by setting a goal for each recommendation request and identifying a list of content assets that can be recommended at any time.

## Volume

Volume of content is the amount of content available for Knewton to recommend. The Knewton system is designed to work with large volumes of content but can also adapt to work with smaller volumes. If a student gets stuck on a certain learning objective and there is little content available to recommend to her, Knewton will recommend the best available piece of content, given that constraint. In other words, “gaps” or “lightness” in content do not block Knewton from functioning.

That said, greater volume of instructional content allows Knewton to present the same learning objective to a struggling student in a variety of ways — content written for different reading levels, for example, or developed in different media — so that students with different learning needs can receive the best possible instruction within the system. The need for differentiated instruction on the same learning objective is greater in “soft” subjects, in which there tends to be less of a prerequisite, or progressive, structure, and thus less to be gained from asking a student to review previous learning objectives.

Similarly, a greater volume of assessment content allows Knewton to make the best recommendations based on student interactions, without fear of showing the same assessment items to a student. A lower volume of assessment content may result in Knewton showing the same item to a student on more than one occasion.

A greater volume of content doesn’t mean that every student will interact with that greater volume. Additional instruction or assessment will only be delivered to those students who need it, on a per-learning objective basis.

## Assessment Components

Assessments have many different components, each of which impacts Knewton’s ability to generate reliable proficiency estimates. The table below gives a sense of the type of data that Knewton makes use of.

Note that these data types are interrelated. For example, the fact that a partner’s assessment items have only three answer choices can be compensated for by the fact that each of the items is instrumented. Note, too, that the preferences expressed below are averages; for example, not every learning objective needs to be highly granular for the system to work, nor does every learning objective need 25 assessment items.

This chart is sorted in terms of decreasing importance to overall product experience.

![Content Best Practice]({{ '/resources/images/content-best-practice-4.png' | relative_url }})

A partner for which all assessment components are merely “viable” should consult with Knewton before proceeding. Assessments that are not automatically scorable or that rely on rubrics to be scored should also be discussed with Knewton.

For the most part, the above considerations — granularity, alignment, discreteness, modularity, and volume — are important regardless of the way Knewton Recommendations are embedded in a product (e.g., as the primary workflow or a secondary “tutor on the side” supplement). There are, however, times in which the considerations will vary depending on the implementation. Here are two examples:

*   _Modularity_: If Knewton Recommendations exist in a secondary workflow (e.g., a secondary “intelligent tutor on the side” study plan) and can, to the extent possible, draw from a pool of assets that do not refer to any predetermined ordering scheme, then the primary workflow can still make use of ordered assets, such as pre-tests, post-tests, or numbered lessons. Knewton Recommendations will appear as updates on a secondary interface that students can access whenever they need additional assistance. Furthermore, partners can establish linear (or rule-based) flows by assembling atoms into bundles and controlling the flow within a bundle.
*   _Granularity_ of recommendable objects: If Knewton Recommendations drive the primary workflow, the partner may wish to bundle content into larger assets for a more cohesive learning experience. If, on the other hand, the primary workflow is driven by instructor-created assets (e.g., assignments), then there may not be a need for a partner to create these bundles upfront.

## Algorithmic Questions

An algorithmic question is an question where one or more parts can be dynamically or “algorithmically” generated. For example, instead of having separately graphed assessment items for the questions “3 + 5 = ?”, “8 + 2 = ?”, “4 + 7 = ?”, etc., the partner can have a single _algorithmic question_, which dynamically generates the correct answer to any problem consisting of adding two single-digit numbers.

All algorithmic questions should include the metadata field pool\_size in the inventory. The value for “pool size” should reflect the number of times the question can be seen before the question would “feel repeated” to a learner. For example, there are 100 possible combinations of adding two single-digit numbers, but if a learner kept seeing the same question template in a row (just with different numbers), it would quickly begin to feel repetitive. Depending on the product and its target user, a reasonable “pool size” for this atom might be 5.
