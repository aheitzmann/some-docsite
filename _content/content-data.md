---
layout: 'content-single'
title: Content Data
description: Managing your integrated content data
keywords: 
order: 0 

hero:
    title: Content Data
    text: What is integrated content data?
---

Content data refers to various pieces of information about your integrated content. There are two major kinds of content data: **identifiers** and **properties**.

[![Content Data](/resources/images/content-data-1.png)](/resources/images/content-data-1.png)**Identifiers** (IDs) are essentially unique fingerprints (often a combination of letters and numbers) that software needs in order to recognize a piece of content. A computer knows a piece of content only by its ID. If the ID for a piece of content changes, then the software will act as if this piece of content no longer exists, and the piece of content with a different ID is brand new.

Any other characteristics of the content — titles, descriptions, answers — are **properties**. Human beings use properties to describe, understand, edit, and distinguish between pieces of integrated content. Two questions with the same ID but different properties may look like two distinct pieces of content to human beings. However, a computer would view them as a single piece of content:

[![Content Data](/resources/images/content-data-2.png)](/resources/images/content-data-2.png)

On the other hand, two pieces of content with identical properties but different IDs will appear distinct to computers. One common example of this principle in practice is when a content owner accidentally creates two assessments that are, for all intents and purposes, identical:

[![Content Data](/resources/images/content-data-3.png)](/resources/images/content-data-3.png)

To the human eye, it’s obvious that these two questions are one and the same. However, a computer will treat these as two completely unique questions. Knewton might recommended the question on the left, then further test the student’s knowledge by recommending the question on the right — not realizing that the student has already answered it.

# Why Knewton requires content data

The table below lists the major types of content data for a Knewton integration. Each type of data you use will require a set of IDs — and will offer you and your users concrete benefits.

| --- | --- | --- | --- |
| **Data Type** | **Common Examples** | **Definition** | **Benefits** |
| **Atom** | A multiple choice question (including the question stem)<br><br>One page of instructional text<br><br>A 4-minute video<br><br>An interactive diagram | A single piece of integrated content that can be tracked as completed, incompleted, correct, or incorrect | Precise, automatic tracking of all student activity on your content |
| **Container** | A 5-part chemistry question<br><br>A reading passage presented alongside 3 assessment questions | A group of Atoms that must be presented to the student as a single chunk (even if the parts are tracked individually) | The ability to specify which Atoms you want students to see in the form of a Recommendation |
| **Learning Objective** | “Solve quadratic equations by using the square root property”<br><br>“Identify the main idea of the reading passage”<br><br>“Name elements, provide their symbols, and determine the number of protons, neutrons, electrons, and nuclei in elements and compounds” | A concrete outcome taught or assessed by Atoms | Learning Analytics on how your students are doing<br><br>Recommendations that take into account each student’s mastery level of every Learning Objective you’ve submitted |
| **Taxon** | TOC;Unit 1;Ch4;Sec2<br><br>Math;Grade9;Alg1;Linear Equations | A tag that situates each Atom in a learning Taxonomy, textbook, syllabus, or any structure that matters to you | Learning Analytics on whatever Taxonomy is important for you to track<br><br>A mechanism for identifying sets of Atoms and Containers that Knewton can or cannot recommend to students. |


The diagram below illustrates how IDs are the crucial connection between your adaptive learning application and your content:

[![Content Data](/resources/images/content-data-4.png)](/resources/images/content-data-4.png)

Whenever your application talks to Knewton about content—for example, to declare that a student has just answered an assessment question correctly—it will reference an ID (in this example, an Atom ID).

However, Knewton can’t interpret this ID if we don’t already have a record of what content it represents. Therefore, Knewton requires a complete and authoritative accounting of your content **before** your learning application starts sending back student activity, requesting Recommendations, or asking for Learning Analytics.

Likewise, when Knewton tells your application the best thing for this student to work on next, it will refer to an ID (in this example, an Atom ID or Container ID). Your learning application must recognize this ID to show the student the content that Knewton has recommended.