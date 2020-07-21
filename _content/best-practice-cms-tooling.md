---
layout: 'content-single'
title: Best Practices for Content Management and Content Inventory Export
description: Things to consider when designing, building implementing adaptive content tooling
keywords: 
order: 0 

hero:
    title: Best Practices for Content Management and Content Inventory Export
    text: Things to consider when designing, building implementing adaptive content tooling
---

## CMS or LMS Best Practices

A Content Management System/Service (CMS) is an essential part of your product. It is the best place to create, edit, tag, and store integrated content. It is also the best place for your learning application to retrieve assets from when displaying content to students online.

When it comes to integrating with the Knewton API, **a CMS should also serve as the system of record, which is used to export a Content Inventory.**

Every time you add, revise, correct, or delete content, you must export a new Content Inventory to let Knewton know. This dependency makes a certain set of CMS features essential to ensuring a seamless integration. Most modern CMSes tend to support this functionality, but it helps to keep these features in mind when selecting an off-the-shelf CMS or building one in house:

*   **Ability to export a full list of unique Atom and Container IDs.** More specifically, you should be able to export the list of content IDs that your application and Knewton can reference when sending Student Events, Recommendations, and Learning Analytics via API. If you want to send student events to Knewton for multiple choice questions, then all multiple choice questions should be uniquely identifiable in a CMS export.

*   **Ability for content creators to align every asset to a specific Learning Objective, with its own unique Learning Objective ID.** Learning Objectives are essential for product design and adaptivity.

*   **Ability for content creators to tag each asset with multiple tags.** It helps if assets exported from the CMS can be exported along with any tags that you would like to Knewton to treat as a Taxon. Should an author decide to retag a particular asset or add another tag to that asset, the latest snapshot of these tag placements should appear automatically in the next CMS export.

*   **Ability to make batch edits to tags.** If you are managing between several hundred to several thousand assets, then having to implement large-scale revisions one asset at a time will be cost-prohibitive. Your CMS should enable you to make batch changes to tags, which may change as your product evolves.**

*   **Ability to export human-readable names for all assets.**

*   **Ability to view individual assets in a CMS in a web browser by URL.** During Content Inventory processing and Quality Assurance testing, Knewton must be able to read the actual content identified in your Content Inventory.

## ID life cycle

The notion of a unique, ever-present **identifier (ID)** is central to the creation and management of integrated content. Knewton applies this notion to the following fields:

*   **Atom ID** (used to receive student events and send Recommendations)

*   **Container ID** (used to send Recommendations that consist of multiple Atoms)

*   **Learning Objective ID** (used to track Proficiency and connect Goal targets to specific pieces of content)

*   **Taxon** (use the Taxon name itself as a unique ID to produce analytics data)

The following guidelines break down how this plays out in the export and handoff of Content Inventory, from your CMS to Knewton.

### Atoms IDs

Atom IDs are the critical link between individual assets listed in a Content Inventory and IDs returned by Knewton Recommendations. Every asset added to a Content Inventory can start appearing in Knewton recommendations as soon as it is validated and processed for adaptivity. All Atom IDs should follow [Knewton content ID guidelines](https://dev.knewton.com/developer/api-overview/#content_ids).

To Knewton, an Atom ID that has never been processed by Knewton signals a new piece of integrated content.

*   Submission of a previously received Atom ID signals that an asset Knewton already knows about is still part of the product.
*   On the other hand, an Atom ID that disappears in a later version of the Content Inventory signals that the life of this content has ended. As a result, it will be deleted from the record **permanently and irreversibly**. If you submit a Content Inventory that reintroduces this Atom ID at a later time, your submission will be blocked until the ID is removed.
*   Once an ID is assigned to a given piece of content, it should not be reused for a different type of content asset even if the original one is removed (e.g. reusing what was an Atom ID as a Container ID and vice versa). That will also block the Content Inventory submission.

The Content Inventory export from your CMS should align with Knewton’s history of Atom IDs in the Content Inventory. For instance, an asset that has been deleted (or marked deleted) in the CMS should not be included as an Atom in the Content Inventory. An asset recently added to the CMS should appear in the next Content Inventory export with a new unique ID.

Atom IDs should be sourced directly from the CMS. IDs should **never** be created or modified by hand (either in a CMS or in a Content Inventory), because that can easily cause critical and irreversible issues.

For example, accidentally changing an Atom ID from “ID123” to “ID13” will be interpreted as “ID123” being deleted and a brand new Atom, “ID13” being added. In this scenario, it could also be the case that “ID13” already exist, which then creates a duplicate ID error that will block submission.

If this happens after a product has gone live, it might lead to losing the student data associated with the asset (since that history is associated with the asset identified by “ID123”). And “ID123” will be blocked from all future submissions.

### Container IDs

Container IDs are not required for adaptivity. However, when a product does use Containers, these Containers must follow the same [content ID guidelines](https://dev.knewton.com/developer/api-overview/#content_ids) as Atoms.

The ID life cycle for Containers is less strict than the ID life cycle for Atoms. This is because student interaction data is never collected for a Container ID. Consequently, Containers can be removed and added to the Content Inventory without blocking submission. Containers can also be listed multiple times in your Content Inventory, because multiple Atoms may belong to the same Container.

Regardless of differences between Containers and Atoms, Container IDs should be sourced directly from the CMS. IDs should **never** be created or modified by hand (either in a CMS or in a Content Inventory), because that can cause unexpected and negative behavior in Recommendations for your students.

### Learning Objectives (Learning Objective ID)

Individual assets should be tagged with Learning Objective information. Learning Objective IDs are typically applied to more than one Atom, indicating to Knewton that those Atoms teach or assess the same Learning Objective. Once a Content Inventory containing Learning Objective information is processed, Learning Objective IDs can also be used as [Goal Targets](/documentation/goals/).

Knewton will interpret any change to a Learning Objective ID as a potential deletion or addition of a new Learning Objective much in the same way as it does for Atom IDs.

**If possible, Learning Objective IDs should be automatically applied via your CMS, just like Atom and Container IDs.** A CMS that allows a way to represent and export a Learning Objective (a combination of a unique ID and a description that can tag multiple assets) is generally preferred to one that does not.

### Tags (Taxon)

Atoms, Containers, and Learning Objectives have unique IDs, created and managed separately from their human-readable, descriptive names. A Taxon, however, becomes its own Taxon ID once it is submitted as part of a Taxonomy.

Because IDs are case-sensitive, Knewton will understand “CCSS:6\|3a” and “CCSS:6\|3A” as different tags. In fact, if this pair of Taxons appears in the same Content Inventory, no validation error will be reported. [See an exhaustive list of acceptable and erroneous Taxon submissions](/content/taxonomies).

There may also be other types of differences in punctuation or spelling that result in unintended consequences. Inconsistent capitalization and misspellings of either Taxonomy name or Taxon path can have dramatic effects on how Knewton interprets the Content Inventory. **Therefore, Knewton strongly recommends a CMS that guards against these inconsistencies.**

For instance, a CMS that only allows selecting a tag from a dropdown is generally preferred to the one that allows free text entry, which can lead to data entry errors.