---
layout: 'content-single'
title: The Content Inventory
description: How to submit content data to Knewton with the content inventory
keywords: 
order: 0 

hero:
    title: The Content Inventory
    text: How to submit content data to Knewton with the Content Inventory
---

I'm making a change

[![Content-Inventory](/resources/images/content-inventory-1.png)](/resources/images/content-inventory-1.png)

You must submit content data to Knewton by constructing and delivering a Content Inventory. The Content Inventory (see above) is a spreadsheet that you periodically export from your system of record (preferably via CMS tools) and send to Knewton. It is a snapshot of your content data. Knewton relies on the Content Inventory to interpret messages sent by your learning application and to send accurate messages back.

[![IDs in the Content Inventory are the foundation of the entire integration](/resources/images/content-inventory-2.png)](/resources/images/content-inventory-2.png)

The only reason Knewton can recognize the pieces of integrated content your students see and complete is because you’ve already listed every single one of them in the Content Inventory. The process of building your Content Inventory is separate from the process of building your learning application, but they are two layers of the same final product.

The above diagram illustrates how Knewton uses the Content Inventory to pass data back and forth about content. Once Knewton processes your Content Inventory, it can look up vital information about the content that your students are working on in your learning application.

The Content Inventory also contains an optional section titled “LO-LO Map”. Here, you can specify the relationships between your Learning Objectives. Please consult with your integration team on whether this tab is appropriate for your integration, and how to fill it out.

# How Knewton helps you define your Content Inventory

Submitting a Content Inventory to Knewton is a slightly different process for every organization. Your Knewton integration team will consult with you to define your Content Inventory, how it will be exported, and when you will submit it to Knewton for processing.

This consultation has three steps:

*   **Knewton analyzes your content and understands your editorial priorities.** By examining the content you want to deliver to students, we can advise you on options for integrating this content. If your content is still being developed, then this analysis can be done on sample content or existing content that is similar to the content being written.

*   **Knewton builds a data dictionary for your approval.** The data dictionary is a tool that we use to summarize our analysis of your content and determine how to fill your Content Inventory with real data. This step confirms what will be included in your Content Inventory, which adaptive features can be supported for your content, and which content decisions you’ll have to make as you move forward.

*   **You submit a test Content Inventory.** Once the data dictionary is completed, we’ll help you export a corresponding Content Inventory. We’ll test this file immediately and walk you through any issues that we find. Delivering this sample early is the best way to discover any unexpected obstacles and prepare you for successful handoffs to Knewton.

# How to submit your Content Inventory

Once your sample has passed testing, you will be cleared to move forward with routine Content Inventory submission whenever all of your content is ready for integration.

There are two types of submissions:

*   The **initial submission of your Content Inventory**, which enables Knewton to process your content data and in turn enables your application to begin using the Knewton API.
*   An **update to an already valid Content Inventory**. Updates will take place multiple times, as you modify your content or find extraneous or malformed data in your Content Inventory (e.g. misspelled tags, objects that don’t actually belong in the Content Inventory).

[![Content Inventory Submission Flow](/resources/images/content-inventory-3.png)](/resources/images/content-inventory-3.png)

Every time you submit your Content Inventory, Knewton scans the Content Inventory and returns a **validation report**. This report lists issues that will prevent a seamless integration or cause Recommendations and Learning Analytics to deviate from expected behavior.

If your Content Inventory does not pass validation, you must either adjust your content (e.g., remove an illegal character from a Learning Objective name) or adjust the way you are generating your Content Inventory (e.g., debug the tool that creates unique IDs for your content). Then you export and submit the Content Inventory again. At this scale of content data, validation errors are the rule, not the exception. You should budget time to resolve errors and warnings for each submission, especially your first few attempts.

[![example of a Content Inventory validation report](/resources/images/content-inventory-4.png)](/resources/images/content-inventory-4.png)

This cycle will repeat until a Content Inventory is validated with zero (0) errors. Validation is typically performed multiple times before all issues are successfully identified and eliminated.

# How to submit and resolve issues in your Content Inventory

1.  Email your Content Inventory .xlsx file to your integration team.
2.  Receive a validation report from Knewton, via email.
3.  Resolve errors. Errors block your submission.
    1.  Read each error listed in the report. See [this key](https://docs.google.com/spreadsheets/d/17pUbRtiojp0N6qqGe7QPg9AH6vjqq6tbAGQDk0o1lVg/edit#gid=903277433) for a complete explanation of every error type. If the key is insufficient, contact your integration team for clarification.
    2.  For every error listed, make corrections as close to the system of record as possible. Correcting the .xlsx file will be insufficient if, say, the .xlsx file is automatically exported from a CMS. The same error will block your next submission.
4.  Resolve warnings. Warnings point to potential problems or unintended use of the Content Inventory format.
    1.  Read each warning listed in the report. See [this key](https://docs.google.com/a/knewton.com/spreadsheets/d/17pUbRtiojp0N6qqGe7QPg9AH6vjqq6tbAGQDk0o1lVg/edit?usp=drive_web) for a complete explanation of every warning type. If the key is insufficient, contact your integration team for clarification.
    2.  Warnings are reported separately because Knewton cannot tell whether these issues are intentional. For every warning listed, double-check that you haven’t made a mistake in the way you’ve entered your content or exported your Content Inventory.
        1.  If needed, make corrections as close to the system of record as possible. Correcting an issue in the .xlsx file will be insufficient if, say, the .xlsx file is automatically exported from a CMS. This same warning will block your next submission.
        2.  If you don’t feel a correction is necessary, let your integration team know. Knewton will verify that there are no unforeseen side effects and that those warnings can be ignored.
5.  When you have resolved all errors and warnings, export a fresh Content Inventory .xlsx file and attach it as a reply to the email containing your validation report.

This cycle will repeat until a Content Inventory is validated with zero (0) errors. Then the handoff will be complete. You will receive a confirmation that your Content Inventory is valid, and that content processing has begun. You will receive another notification when content processing is complete.

# Content Inventory template, fields, and requirements

**[See the Content Inventory template.](https://docs.google.com/spreadsheets/d/1rLtu6sqNJWLfjOQD3R_6o7Jzi9IPZ-m5dnKl3wizjgI/edit)**  Please note that this template has many fields, and some may not be necessary for your learning application. Your integration team will assist you by tailoring the template to your specific needs and consulting on how the Content Inventory .xlsx file can be most effectively exported.

**[See the complete set of Content Inventory requirements.](https://docs.google.com/spreadsheets/d/1KEbEGwAyn60ddTm_gxIPUGzb7cJAYiF2pC3QqQpG74Q/edit#gid=0)** This table spells out:

*   the name of every field (column) in the Content Inventory template
*   whether the field is an **[identifier](/content/content-data/)**
*   whether the field is **required**
*   whether the value submitted must be unique within the Content Inventory
*   whether the field has a limit on how many values can be submitted
*   any other guidelines for successfully filling and submitting data

## Comprehensive Key to Content Inventory Validation Report

**[See a complete key](https://docs.google.com/a/knewton.com/spreadsheets/d/17pUbRtiojp0N6qqGe7QPg9AH6vjqq6tbAGQDk0o1lVg/edit?usp=drive_web)** to Errors and Warnings returned during Content Inventory Validation.

# Supported Content Inventory versions: v1.3 versus v1.4

As of 12/20/16, the current version of the Content Inventory (v1.4) has a few small format differences from its predecessor. It supports additional validation and the submission of your LO-LO (prerequisite) map in the same file as your Content Inventory. If you are unsure of which version of the Content Inventory you are currently using, please consult with your integration team. If you are just beginning integrating a product with Knewton, please use the version provided to you by your integration team.

For various reasons, you may be using the previous version of the Content Inventory (v1.3). Please consult with your integration team on whether moving to v1.4 makes sense for your integration.

If you are using the previous version of the Content Inventory (v1.3), please consult the following resources:

*   **[Content Inventory v1.3 Template](https://docs.google.com/spreadsheets/d/11d-HK67EsRRGkwMuy0bwq8f46QTzhf7Ln5MEHd0CDhg/edit?usp=sharing)**
*   **[Content Inventory v1.3 requirements table](https://docs.google.com/a/knewton.com/spreadsheets/d/1VG0TmeRzTqdTy_nlXRYI7IDgJak2TURDr_2tblzXm8U/edit?usp=drive_web)**
*   **[Content Inventory v1.3 validation error and warning codes](https://docs.google.com/spreadsheets/d/17pUbRtiojp0N6qqGe7QPg9AH6vjqq6tbAGQDk0o1lVg/edit?usp=sharing)**
