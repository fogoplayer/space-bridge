# API Signature

## Isomorphic Functions

### define
```ts
define(func: Function, options?: {InitOptions}): (Parameters<typeof func>) => Promise<ReturnType<typeof func>>
```
A higher-order function that wraps your function definitions so that they can use SpaceBridge logic. It is isomorphic, so you can use define in your modules pre-export and the correct logic will be loaded in each environment. It returns a function that returns a promise, and that promise resolves to the return value of your function. For example:

```ts
// arithmetic.mjs
export const add = define((num1: number, num2: number): number => num1 + num2); // TODO this function is anonymous

// app.js
const sum = await add(1, 3);
console.log(sum); // 4
```

#### Parameters
`func` - the user-defined function to be wrapped in SpaceBridge logic
`options` - users can override global preferences by passing in a new options object. **TODO do we merge the two, or is it just an overwrite? If we merge it, we probably need an "unset" keyword or something.**

#### Returns
A promise that resolves to the return value of `func`

#### Throws
SpaceBridgeCollisionError - The name of the function being added has already been registered with SpaceBridge

## Client-side methods

### init
```ts
init({
  baseUrl: string
  weights: {
    [key: Factor]: number
  }
})
```
Initial setup for SpaceBridge.

#### Parameters
`baseUrl` - the base URL of the server where remote requests should be routed to
`weights` - the relative weight that should be given to each factor. Default for each factor is 1 if no weights are specified or the average of the specified weights if only some are not specified.

#### Returns
void

#### Throws
none

### lazy
```ts
lazy(url: string, signature?: { methods?: string[], members?: string[] }): { typeof members[number]: Promise<any>; typeof methods[number]: (...any) => Promise<any> } 
```
Dynamic imports enhanced by SpaceBridge. Unlike a usual dynamic import, the methods are immediately callable. If the method is called before the code is finished loading, SpaceBridge executes the function remotely and returns a value. This makes it ideal for very large libraries, allowing for immediate responsiveness while the code is loaded in the background.

#### Parameters
`url` - the URL to import from
`signature` - an object describing the methods and members being imported

#### Returns
An object where the keys are the values of methods and members. The values for methods are functions that return promises that resolve to the return value of the method. The values for members are promises that resolve to the value of the member.

#### Throws
SpaceBridgeClientOnlyError - the function is being called outside of a browser environment
SpaceBridgeCollisionError - The name of one of the methods or members being added has already been registered with SpaceBridge

### queue
```ts
queue(args: Parameters<typeof fetch>): void
```

A drop-in replacement for the `fetch` API that utilizes the [BackgroundSync API](https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API) where possible. Where the API is unavailable (due to browser support, execution outside of a PWA, or any other limitation) the `fetch` API is used.

#### Parameters
`resource` - the URL to fetch against
`options` - the fetch options object

#### Returns
`response` - a Promise that resolves to a Response object. If the request has been deferred until a background sync, it will **TODO what will it do?**

#### Throws
`AbortError`, `TypeError` - see the [fetch documentation](https://developer.mozilla.org/en-US/docs/Web/API/fetch) for details

### Server-side Methods

### spacebridge
```ts
spacebridge(...modules: string[]): (req, res, next) => void
```

Express middleware that generates an API signature for your methods. 

#### Parameters
Each argument is a string of a module to import. Using the `define` method in those modules registers them with SpaceBridge and allows them to create an API.

#### Returns 
An Express middleware function

#### Throws
**TODO**