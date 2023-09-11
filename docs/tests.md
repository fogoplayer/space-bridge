# Tests

## Client-side

### define
* When a function is passed in, an async function is returned
* That function's behavior is not changed (other than being async)
* Locally calling the function works
* Remotely calling the function works
* Throws collision error if method is defined twice in the same file
* Throws collision error if method is defined twice in two different files

### init
* Check that each setting does what it says it does

### networkFirst
* During loading, requests are routed through the API
* After loading, requests can be routed through the API
* After loading, requests can be handled locally
* The returned module object matches the signature passed in
* Members can be accessed
* Methods can be accessed
* Throws SpaceBridgeClientOnlyError when called in node
* Throws collision error if method is already defined elsewhere

### lazy
* Module is not loaded until triggered
* Calling the trigger function starts the download
* Before loading, requests are routed through the API
* During loading, requests are routed through the API
* After loading, requests can be routed through the API
* After loading, requests can be handled locally
* The returned module object matches the signature passed in
* Members can be accessed
* Methods can be accessed
* Throws SpaceBridgeClientOnlyError when called in node
* Throws collision error if method is already defined elsewhere

### queue
* Works in HTTP context
* Works in non-PWA context
* Works in online PWA context
* Service worker gets registered
* Works in offline PWA context
