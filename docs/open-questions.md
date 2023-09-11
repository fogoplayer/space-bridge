# Open questions

## Client API

### [define](./client-signature.md#define)
* Is there a way to avoid naming functions twice (once as a named export and once to register it with SpaceBridge)

### [networkFirst](./client-signature.md#networkFirst)
* Should networkFirst & lazy expose their download progress? (https://javascript.info/fetch-progress)

### [queue](./client-signature.md#queue)
* What should queue return if it has been successfully added to the BackgroundSync but hasn't actually been sent?


## Server API
* Does the middleware function throw any errors?

### [define](./server-signature.md#define)
* Should it return a promise-wrapped function? It's not technologically necessary but might be nice for consistency

## Internals
* What factors should influence load-balancing?

### [subroutines](./internals.md#subroutines)
* Is there a better way to structure our subroutines API? 
  - Do we want them to return a spectrum between 0 and 1 or a boolean? 
  - How do the weights affect things?
  - Are there some situations where we want to always defer to one subroutine (ex. if networkOpinion says we're offline, it kind of doesn't matter what the rest say)