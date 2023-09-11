# space-bridge

SpaceBridge is a research project by Zarin Loosli; a library that serves as a load balancer for code that can be executed client-side or server-side. Each execution environment has its own advantages and disadvantages.

Server-side execution:
 * is not affected by the specs of the users' device
 * improves loading times
 * has guaranteed access to other backend services like databases
 * can use more performant languages
 * can access low-level APIs to work with highly specific protocols and formats

Client-side execution:
 * can continue functioning with a slow, spotty, or nonexistent network
 * reduces server load
 * has zero latency

Even when code is technically capable of running in both environments, most services tend to only implement one or the other based on which benefits best fit their business model. SpaceBridge asks, _¿Por que nos dos? Why not both?_

Imagine:

- A browser-based 3d modeling program can use server-side processing when running on a low-end Chromebook while utilizing the local power users' engineering workstations.
- An AI image generator's models take several minutes to load when running client-side. The site is immediately responsive via the API, then seamlessly transition users to a local copy of the model whenever it is downloaded.
- Photo and video editors can use remote render farms when a user hits "export" with a solid internet connection, but when they are offline it will fall back to a local version.

## Read More:
* [Client-side API](./docs/client-signature.md)
* [Server-side API](./docs/server-signature.md)
* [Unresolved Design Questions](./docs/open-questions.md) - feedback is welcome!
* [Internal Details](./docs/internals.md)
* [Examples](./docs/examples)

## Security, Privacy, and Other Concerns

There are a number of non-technical reasons why an organization may choose to run code exclusively on the client or server. Perhaps the latency of remote execution is unacceptable. Perhaps you don't want to ship a proprietary, trade-secret algorithm to clients where it can be decompiled, inspected, and reverse-engineered. There may be security issues with bringing certain code from the server onto the client, or privacy concerns with bringing client-side operations onto the server.

These problems are worth addressing, and solutions may be included in future versions of SpaceBridge if they are found and implemented. Already, SpaceBridge supports having [different implementations](./docs/examples/separate-implementations) of a function for each context.

However, the research motivating SpaceBridge's creaction is currently focused on the technical challenges of bridging execution across environments. Until the scope of that research broadens, it is left up to the user to determine where such a solution would be beneficial.

_Note: thanks to Aral Balkan ([@aral](https://mastodon.ar.al/@aral) on Mastodon) for suggesting this section's inclusion!_
