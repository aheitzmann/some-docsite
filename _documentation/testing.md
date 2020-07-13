---
layout: 'documentation-single'
title: Testing
description: Testing your Knewton integration
keywords: 
order: 0

hero:
    title: Testing
    text: Testing your Knewton Integration
---

### X-Knewton-Test

Setting the `X-Knewton-Test` header to `true` (i.e. `X-Knewton-Test: true`) allows API users to create [Test Accounts](https://dev.knewton.com/developer/authentication-accounts-profiles/).

This header should be used to create accounts for both automated testing and quality assurance testing in the integration environment (dev-api.knewton.com) and production environment (api.knewton.com).

Some key points to keep in mind when using the `X-Knewton-Test` header:

*   You should use this header only in the POST request made when creating user accounts (i.e. POST calls made to ../accounts and ../batch endpoints) with Knewton. Including the header in any other call will result in errors indicating that the header has been used incorrectly.
*   A learning instance is classified as a “test” instance if the first account that is registered to this is a test account. You will not be able to register non-test accounts to this learning instance thereafter.
*   Recommendations and Analytics responses will include `X-Knewton-Test: true` as a header, indicating that recommendations and analytics have been produced for registrations belonging to test accounts or learning instances where test accounts are registered.

If you have any questions about the test header, please reach out to your Knewton Implementation Architect or Partnership Manager.

### Request-label

In addition to the test header, Knewton also allows including a header `request-label: <string>` with an API call. By doing so, this header will be propagated all the way through the Knewton logs. This way, a partner can ask about a specific request label and Knewton can quickly identify, track, and debug that call.




## Load-testing the integration

In many integrations, partners may perform load tests to ensure that their application experiences no degradation of performance when a large number of users accesses it simultaneously.

Partners performing load tests in Knewton’s Sandbox environment are assigned a specific threshold that is measured in events per unit time (aggregated across graded, ungraded and focus events). During testing in Sandbox, if the application exceeds the predefined event rate for over 3 minutes, a “load test in progress” flag is turned on for that partner.

While the “load test in progress” flag is enabled, the client application will receive an HTTP 204 message for every event that it sends Knewton; however, these events will not be persisted or processed by the Knewton system. Additionally, while “load test in progress” flag is set recommendation requests will generate “mock recommendations”, which provide syntactically valid payloads subject to additional behaviors as described below:

*   **recommendation\_id** will be a randomly generated integer
    *   Values returned as part of this field should not be construed by the application as a real recommendation IDs.
*   **focus\_state** will always be “focused”
    *   Unlike with regular recommendations, mock recommendations will be generated regardless of the focus state of the goal.
*   **status** will be reported as “done” once every arbitrarily large number of requests or “in progress” otherwise
    *   Note that an “in progress” status may be reported for a goal for which a recommendation was previously sent with the status set to“done”. It is expected that the load test should be built in a way that this scenario will not break the test.
*   **module\_ids** will be guaranteed to be from the recommendable pool of the goal
    *   This field will be empty when the status is “done” and if **continued\_recommendations** is either “false” or omitted from the request.

The `X-Knewton-Rate-Exceeded: partner-soft-limited` header will be included on all recommendation and event responses during a load test. Thus an application can easily detect when it is receiving or is about to receive mock recommendations. Once the volume of requests falls below the aforementioned threshold, the API will return to its regular operations, i.e. the `X-Knewton-Rate-Exceeded: partner-soft-limited` header will no longer appear in the responses.

Partners should contact their Knewton Implementation Architect for best practices for load testing their applications, or if they have specific needs for load testing underlying Knewton services.
