# API Signature

## Isomorphic Functions

### define
```ts
define(name: string, func: Function): (Parameters<typeof func>) => Promise<ReturnType<typeof func>>
```
Registers the method with the SpaceBridge middleware. The name is used to generate an API url which is mapped to the function.

Asynchronous methods passed into `define` get awaited so that the response sent back is a value, not a promise.

Because SpaceBridge's API uses the function name to connect functionality on the client and on the server, `define` checks that each function passed in has a unique name

#### Parameters
`name` - the name of the function
`func` - the user-defined function to be wrapped in SpaceBridge logic

#### Returns
`func`

#### Throws
SpaceBridgeCollisionError - The name of the function being added has already been registered with SpaceBridge

### spacebridge
```ts
spacebridge(...modules: string[]): (req, res, next) => void
```

Express middleware that generates an API signature for your methods. It creates a unique URL for each method, based on the name. It also generates a GET endpoint with a mapping of URLs to function names. 
Under the hood, SpaceBridge is making POST requests to these endpoints to call these methods and a GET request to get diagnostic information (such as typical response time) about the endpoint, and a PUT request to provide diagnostic information (such as the response time for that client).

#### Parameters
Each argument is a string of a module to import. Using the `define` method in those modules registers them with SpaceBridge and allows them to create an API.

#### Returns 
An Express middleware function

#### Throws
_TODO_