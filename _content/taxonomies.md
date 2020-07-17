---
layout: 'content-single'
title: Taxonomies
description: Why, how, and when to submit Taxonomies
keywords: 
order: 0 

hero:
    title: Taxonomies
    text: Why, how, and when to submit Taxonomies
---

# What is a Taxonomy?

A Taxonomy is a deliberately structured collection of tags that you can use to identify sets of Atoms and Containers that should be recommendable in [Goals](/documentation/goals)

**Taxonomies are often pulled directly from your existing content metadata.** In many cases, Taxonomies can represent an existing hierarchy in your content’s structure (e.g., Table of Contents) or standards (e.g., Common Core State Standards).

# What is a Taxon?

A Taxon is a tag used to classify an Atom or Container in the Content Inventory.

A Taxon can also be single level of a hierarchical Taxonomy. A Taxon can exist at any level in the hierarchy (e.g., a section, a Common Core State Standard, etc.).

Multiple Taxons can be used to tag the same Atom or Container.

# Example of a Taxonomy that contains multiple Taxons

The Common Core State Standards (CCSS) is a hierarchical Taxonomy. The diagram below translates a path through 6 levels of the hierarchy [CCSS.Math.Content.8.G.B.7](http://www.corestandards.org/Math/Content/8/G/B/7/) into the format required by the Knewton API CCSS:Math\|Content\|8\|G\|B\|7.

**[![Anatomy of a Taxonomy](/resources/images/taxonomies-1.png)](/resources/images/content-taxonomies-1.png)**In this case, CCSS is the Taxonomy name, and each individual standard contained within (e.g., level Math\|Content\|8\|G\|B\|7) is a Taxon. When submitted to Knewton as a Taxon in the Content Inventory, this path indicates that the corresponding Atom or Container belongs to all 6 levels identified.

## **Use a Taxon for Goals**

In **Goals** (which configure Recommendation behavior), Taxons can be used as shorthand when defining the recommendable modules set. ([More on Goals](https://dev.knewton.com/product/create-goals/).)

Your integration team will help you design Taxonomies that enable use of Learning Analytics and Goals.

# Requirements and guidelines for Taxonomy submission via Content Inventory

All fully specified Taxons should follow Knewton’s [content ID guidelines](https://dev.knewton.com/developer/api-overview/#content_ids). In order to recognize Taxons for Learning Analytics and Goals, Knewton must look up those Taxons in the corresponding Content Inventory. Knewton won’t be able to respond to API requests made before the Content Inventory is successfully processed.

**A Taxon can be used to tag an Atom or a Container.**

*   Each Taxonomy must be submitted as its own column in the Content Inventory .xlsx file.
*   Row 5 in v1.3 or 6 in v1.4 of the Content Inventory must contain the Taxonomy Name.
*   Every subsequent Row must list the levels of the Taxonomy in hierarchical order ending with the Taxon being used to tag this Atom or Container.
*   A pipe (\|) must be used to separate each level of the Taxonomy. Knewton will read your Taxon submission from left to right. Using the above Taxonomy (“**CCSS**”) as an example:
    *   To tag with “8th Grade”, enter **Math\|Content\|8th Grade**
    *   To tag with “7”, enter **Math\|Content\|8th Grade\|Geometry\|B\|7**

# Acceptable Taxon formatting and special character requirements

The Content Inventory accepts all languages that are submitted in [Unicode UTF-8](http://unicode.org/faq/utf_bom.html#utf8-1). However, Knewton does have [special character guidelines](https://dev.knewton.com/product/submit-content-data-knewton-content-inventory/). Incorrectly formatted Taxon values may result in unexpected behavior, so please note how Knewton interprets these characters in Taxons:

*   **Case sensitive.** If two Taxon values are identical in spelling but one is capitalized and the other is not (e.g., “Math” and “math”), then Knewton will interpret these as two entirely different Taxons.

*   **Spaces.** If two Taxon values are identical in spelling and capitalization, but one contains a space in the middle of it and the other does not (e.g., “G5 and G 5”), then Knewton will interpret these as two entirely different Taxons. However, leading and trailing spaces will be removed.

*   **A colon (:)** separates Taxonomy name from Taxon values. Unlike when referencing a Taxon pathway in an API call, you are not required to include Taxonomy name with its Taxon values in the Content Inventory. Knewton recommends not using colons in this way because it increases the risk of malformed Taxon submissions.

*   **A pipe (\|)** separates two levels of the Taxonomy.

*   **Double quotes (“) of any kind are illegal** and will block Taxonomy submission. Single quotes are an acceptable substitute for double quotes.

*   A **tilde (~)** marks the end of one Taxon value and the start of another Taxon value.\*

*   **Backslashes (\\)** are illegal and will block Taxonomy submission.\*

_\* Please note that if you are using v1.3 of the Content Inventory, some values are treated differently from what is listed above. Specifically:_

*   For v1.3 of the Content Inventory, a **comma (,)** marks the end of one Taxon value and the start of another Taxon value.

*   If you are using v1.3 of the Content Inventory, the **backslash (\\)** character can be used to submit a Taxon that intentionally contains a comma. Enter the backslash (\\) directly before each comma, using it as an escape character, to prevent this Taxon from being split into multiple values.

### Examples of valid Taxon values

The table below presents many examples of Taxons in the current version of the Content Inventory. If you are on the previous version of the Content Inventory (v1.3), please consult with your integration team on any specific questions.

| --- | --- | --- |
| **Value in Content Inventory** | **What it is** | **How it’s interpreted by Knewton** |
| **Taxonomy Name**<br>CCSS<br>**Taxon**<br>edu6 | a flat Taxon, no spaces | Knewton will apply “edu6” as a Taxon under the parent Taxonomy CCSS. |
| **Taxonomy Name**<br>CCSS<br>**Taxon**<br>edu6 | a flat Taxon with space after Taxonomy Name | Knewton will truncate space(s) after the **:** and apply “edu6” as a Taxon under the parent Taxonomy CCSS. |
| **Taxonomy Name**<br>CCSS<br>**Taxon**<br>edu6 | a flat Taxon with space after Taxonomy Name and space before Taxon value | Knewton will truncate space(s) before and after the **:** and apply “edu6” as a Taxon under the parent Taxonomy CCSS. |
| **Taxonomy Name**<br>CCSS<br>**Taxon**<br>edu 6 | a flat Taxon, with a space within Taxon value | Knewton will preserve the space(s) within the Taxon name and apply “edu 6” as a unique Taxon under the parent Taxonomy CCSS. |
| **Taxonomy Name**<br>Objective<br>**Taxon**<br>Solve quadratic equations using quadratic formula, factoring, or graphing | a single flat Taxon | Knewton will see one Taxon value within the “Objective” Taxonomy:  <br>“Solve quadratic equations using quadratic formula, factoring, or graphing”  <br>Knewton will recognize this Taxon when it receives the following Taxon reference in an API call: “tref-Objective: Solve quadratic equations using quadratic formula, factoring, or graphing” |
| **Taxonomy Name**<br>CCSS<br>**Taxon**<br>edu6\|2\|6 | a hierarchical Taxon, no spaces | Knewton will apply the Taxon hierarchy “edu6\|2\|6” under the parent Taxonomy CCSS. Applying a Taxon hierarchy means that “edu6”, “edu6\|2”, and “edu6\|2\|6” are all applied to this Atom. |
| **Taxonomy Name**<br>CCSS<br>**Taxon**<br>edu6\|2\|6 | a hierarchical Taxon, with space after Taxonomy Name | Knewton will truncate space(s) after the **:** and apply the Taxon hierarchy “edu6\|2\|6” under the parent Taxonomy CCSS. |
| **Taxonomy Name**<br>CCSS<br>**Taxon**<br>edu6\|2\|6 | a hierarchical Taxon, with space after Taxonomy Name and space before Taxon value | Knewton will truncate space(s) before and after the **:** and apply the Taxon hierarchy “edu6\|2\|6” under the parent Taxonomy CCSS. |
| **Taxonomy Name**<br>CCSS<br>**Taxon**<br>edu 6\|2\|6 | a hierarchical Taxon, with a space within Taxon value | Knewton will preserve the space(s) within the Taxon name and apply the Taxon hierarchy **:** “edu 6\|2\|6” under the parent Taxonomy CCSS. |
| **Taxonomy Name**<br>CCSS<br>**Taxon**<br>edu\_6\|2\|6 | a hierarchical Taxon, with an \_ within Taxon name | Knewton will preserve the \_ within the Taxon name and apply the Taxon hierarchy **:** “edu\_6\|2\|6” under the parent Taxonomy CCSS. |
| **Taxonomy Name**<br>CCSS<br>**Taxon**<br>edu\_6\|2\|5.0~edu\_6\|3\|5.1~edu\_6\|3\|5.2 | multiple hierarchical Taxon values within a given Taxonomy, no spaces | Knewton will apply three Taxon hierarchies under the parent Taxonomy CCSS **:**<br>1.  edu\_6\|2\|5.0<br>2.  edu\_6\|3\|5.1<br>3.  edu\_6\|3\|5.2<br>**Note:** Ultimately, “edu\_6”, “edu\_6\|2”, “edu\_6\|3”, “edu\_6\|2\|5.0”, “edu\_6\|3\|5.1”, and “edu\_6\|3\|5.2” will be applied to this Atom. |
| **Taxonomy Name**<br>TOC<br>**Taxon**<br>W2 \| 6 \| 31 \| C E \| FBlank | multiple hierarchical Taxon values within a given Taxonomy, with spaces before and after each \| | Knewton will truncate spaces before and after the \| and save the Taxon hierarchy **:** “W2\|6\|31\|C E\|FBlank” under the parent Taxonomy “TOC”.<br>**Note:** Knewton will preserve the space between C and E. |

### Erroneous and commonly misused Taxon formatting

|     |     |     |
| --- | --- | --- |
| **Value in Content Inventory** | **Potential Misuse** | **How it’s interpreted by Knewton** |
| **Taxonomy Name**<br>CCSS<br>**Taxon**<br>edu6\\2 | using a backslash (\\) to represent hierarchy within a Taxon | Knewton will not be able to ingest an Inventory with a backslash (\\), so an Inventory with this value will have to be modified and re-submitted to Knewton. |
| **Taxonomy Name**<br>CCSS<br>**Taxon**<br>edu6:2 | using a : instead of \| to represent hierarchy within a Taxon | Knewton will read this string as two parent Taxonomies (CCSS and edu6) instead of a Taxon hierarchy within a parent Taxon (“CCSS: edu6\|2”). |
| **Taxonomy Name**<br>CCSS<br>**Taxon**<br>edu6&2 | using a & instead of \| to represent hierarchy within a Taxon | Knewton will read this string as a flat Taxon and apply “edu6&2” under the parent Taxonomy CCSS. |
| **Taxonomy Name**<br>CCSS<br>**Taxon**<br>CCSS:edu6~ CCSS:edu7 | including the Taxonomy Name in the space for Taxon Value (comma separating two flat Taxons with the same parent Taxonomy) | Knewton will not ingest this Taxon string. An appropriate input would be “edu6~edu7” where “CCSS” is entered as the parent Taxonomy in row 6, and “edu6” and “edu7” are two Taxons within that Taxonomy. |
| **Taxonomy Name**<br>concept<br>**Taxon**<br>1.1.1~edu6\|2 | a single column of the Content Inventory mixing Taxons values from different parent Taxonomies | The tool bundles all the Taxons under the Taxonomy parent entered into row 6, so “1.1.1,” and “edu6\|2” will all be associated with “concept.” These should be separated into two columns, one for all “concept” Taxons, and one for all “CCSS” Taxons. |