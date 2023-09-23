# Server API Signature

## Methods

### define
```ts
define(name: string, func: Function, options: SpaceBridgeOptions): (Parameters<typeof func>) => Promise<ReturnType<typeof func>>
```
Registers the method with the SpaceBridge middleware. The name is used to generate an API url which is mapped to the function.

Unlike on the client, on the server `define` returns the same method that gets passed in, without being wrapped in a promise. This means defined functions can be exported and used normally.

Because SpaceBridge's API uses the function name to connect functionality on the client and on the server, `define` checks that each function passed in has a unique name

#### Parameters
`name` - the name of the function

`func` - the user-defined function to be wrapped in SpaceBridge logic

`options` - overrides for the global SpaceBridge options

#### Returns
`func`

#### Throws
`SpaceBridgeCollisionError` - The name of the function being added has already been registered with SpaceBridge

### spacebridge
```ts
spacebridge(...modules: ReturnType<typeof import>[], options?: SpaceBridgeOptions): (req, res, next) => void
```

Express middleware that generates an API signature for your methods. It creates a unique URL for each method, based on the name. It also generates a GET endpoint with a mapping of URLs to function names. 

Under the hood, SpaceBridge is making POST requests to these endpoints to call these methods and a GET request to get diagnostic information (such as typical response time) about the endpoint, and a PUT request to provide diagnostic information (such as the response time for that client).

Because we are using dynamic imports, if a request comes in before we are done importing, the server will respond as soon as the relevent function is imported.

Static imports at the top of the file can be used instead of the modules parameter, but is discouraged for lack of clarity.

For example:
```ts
spacebridge(import("./myModule.js"), import("../lib/anotherModule.js"), {
  prefix: "my-app-bridge",
  stats: false;
})
```

#### Parameters
`modules` - a series of dynamic imports of modules using the `define` method

`options` - configures the server

#### Returns 
An Express middleware function

#### Throws
The `spacebridge` function throws 
* _TODO_

The function that it returns throws:
* ReferenceError - an API call was recieved asking for a method that does not exist.

## Types

### SpaceBridgeOptions
```ts
type SpaceBridgeOptions = {
  prefix: string = "spacebridge"; // a prefix for the spacebridge API endpoints
  stats: boolean = true; // if false, GET and PUT requests return a 404
}
```