# space-bridge

SpaceBridge is a research project by Zarin Loosli; a library that serves as a load balancer for code that can be executed client-side or server-side. Each execution environment has its own advantages and disadvantages.

Server-side execution:
 * is not affected by the specs of the users' device
 * improves loading times
 * has guaranteed access to other backend services like databases
 * can use more performant languages
 * can access low-level APIs to work with highly specific protocols and formats

Client-side execution:
 * can continue functioning with a slow, spotty, or nonexistent network,
 * reduces server load
 * has zero latency

Even when code is technically capable of running in both environments, most services tend to only implement one or the other based on which benefits best fit their business model. SpaceBridge asks, _¿Por que nos dos? Why not both?_

Imagine:
A browser-based 3d modeling program can use server-side processing when running on a low-end Chromebook while utilizing the local power users' engineering workstations.
An AI image generator's models take several minutes to load when running client-side. The site is immediately responsive via the API, then seamlessly transition users to a local copy of the model whenever it is downloaded.
Photo and video editors can use remote render farms when a user hits "export" with a solid internet connection, but when they are offline it will fall back to a local version.