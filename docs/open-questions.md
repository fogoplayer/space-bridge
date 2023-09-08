# Open questions

## Client API

### [define](https://github.com/fogoplayer/space-bridge/blob/spec/docs/client-signature.md#define)
* Is there a way to avoid naming functions twice (once as a named export and once to register it with SpaceBridge)

### [queue](https://github.com/fogoplayer/space-bridge/blob/spec/docs/client-signature.md#queue)
* What shou


## Server API
* Does the middleware function throw any errors?

## Internals
* What factors should influence load-balancing?
* Is there a better way to structure our subroutines API? 
  - Do we want them to return a spectrum between 0 and 1 or a boolean? 
  - How do the weights affect things?
  - Are there some situations where we want to always defer to one subroutine (ex. if networkOpinion says we're offline, it kind of doesn't matter what the rest say)