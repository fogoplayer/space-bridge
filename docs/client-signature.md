# Client API Signature

## Methods

### define
```ts
define(name: string, func: Function, options?: DefineOptions): BridgedFunction
```
A higher-order function that wraps your function definitions so that they can use SpaceBridge logic. It is isomorphic, so you can use define in your modules pre-export and the correct logic will be loaded in each environment. It returns a function that returns a promise, and that promise resolves to the return value of your function. For example:

```ts
// arithmetic.mjs
export const add = define("add", (num1: number, num2: number): number => num1 + num2); // TODO is there a way to avoid naming it twice?

// app.js
const sum = await add(1, 3);
console.log(sum); // 4
```

Asynchronous methods passed into `define` get awaited, meaning that when the defined function's promise resolves, it will resolve to the return value of the function, not another promise.

Because SpaceBridge's API uses the function name to connect functionality on the client and on the server, `define` checks that each function passed in has a unique name

`options`, when provided, does a deep merge to only overwrite properties that have been specified. SpaceBridge provides an export called `unset` that can be used to revert an option back to the default.

#### Parameters
`name` - the name of the function
`func` - the user-defined function to be wrapped in SpaceBridge logic
`options` - users can override global preferences by passing in a new options object. 

#### Returns
A function that returns a promise that resolves to the return value of `func`

#### Throws
SpaceBridgeCollisionError - The name of the function being added has already been registered with SpaceBridge


### init
```ts
init({
  baseUrl,
  weights,
}: InitOptions)
```
Initial setup for SpaceBridge.

#### Parameters
`baseUrl` - the base URL of the server where remote requests should be routed to
`weights` - the relative weight that should be given to each factor. Default for each factor is 1 if no weights are specified or the average of the specified weights if only some are not specified.

#### Returns
void

#### Throws
none


### networkFirst
```ts
networkFirst(modulePromise: ReturnType<typeof import>, signature?: { 
  methods?: (string | Schema)[], 
  members?: (string | Schema)[] 
}): { 
  typeof members[number]: Promise<any>;
  typeof methods[number]: (...any) => Promise<any>
} 
```
Dynamic imports enhanced by SpaceBridge. Unlike a usual dynamic import, the methods are immediately callable. If the method is called before the code is finished loading, SpaceBridge executes the function remotely and returns a value. This makes it ideal for very large libraries, allowing for immediate responsiveness while the code is loaded in the background.
For example:
```ts
const module = networkFirst(import("./module.mjs"), {
  methods: ["method1", {
    name: "method2",
    args: [{name: "foo", type: String}]
    returnType: Array
  }]
  members: ["member1", {
    name: "member2",
    type: Object
  }]
})
```

#### Parameters
`url` - a dynamic import of the module
`signature` - an object describing the methods and members being imported

#### Returns
An object where the keys are the values of methods and members. The values for methods are functions that return promises that resolve to the return value of the method (similar to `define`). The values for members are promises that resolve to the value of the member.

#### Throws
SpaceBridgeClientOnlyError - the function is being called outside of a browser environment
SpaceBridgeCollisionError - The name of one of the methods or members being added has already been registered with SpaceBridge


### lazy
```ts
lazy(fetchModule: Function, signature?: { 
  methods?: (string | Schema)[], 
  members?: (string | Schema)[] 
}): [
  { 
    typeof members[number]: Promise<any>;
    typeof methods[number]: (...any) => Promise<any>
  },
  Function
]
```
Similar to networkFirst, but won't start downloading until triggered.

For example:
```ts
const [myModule, downloadMyModule]  = lazy(() => import("./my-module.mjs"), {
  methods: ["method1", {
    name: "method2",
    args: [{name: "foo", type: String}]
    returnType: Array
  }]
  members: ["member1", {
    name: "member2",
    type: Object
  }]
})

document.querySelector(".download-button").addEventListener("click", () => downloadMyModule());
```

#### Parameters
`url` - the URL to import from
`signature` - an object describing the methods and members being imported

#### Returns
An object where the keys are the values of methods and members. The values for methods are functions that return promises that resolve to the return value of the method (similar to `define`). The values for members are promises that resolve to the value of the member.

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
`response` - a Promise that resolves to a Response object. If the request has been deferred until a background sync, it will _TODO what will it do?_

#### Throws
`AbortError`, `TypeError` - see the [fetch documentation](https://developer.mozilla.org/en-US/docs/Web/API/fetch) for details



## Types

### BridgedFunction
```ts
type BridgedFunction<OrigFunc extends Function> = 
  (Parameters<OrigFunc>) => Promise<ReturnType<OrigFunc>> & {
    runLocal: (Parameters<OrigFunc>) => Promise<ReturnType<OrigFunc>>
    runRemote: (Parameters<OrigFunc>) => Promise<ReturnType<OrigFunc>>
  }
```

### InitOptions
```ts
type Factor = "network" | "specs" | "cost" | "performance" // subject to change from further research
```

```ts
{
  prefix?: string = "spacebridge"; // a prefix for the spacebridge API endpoints
  baseUrl?: string = "/"; // the base URL of the server where remote requests should be routed to
  weights?: { //the relative weight that should be given to each factor. 
    // Default for each factor is 1 if no weights are specified or the average of the specified weights if only some are not specified.
    [key: Factor]: number
  };
  headers?: Object; // header to be included in any request (for example, for authentication)
  body?: Object; // body fields to be included in any request (for example, for authentication)
}: InitOptions
```

### DefineOptions
```ts
type DefineOptions = InitOptions & {
  url: string; // override the autogenerated URL 
}
```

### Schema
```ts
type Schema = MethodSchema | MemberSchema

type MethodSchema = {
  name: string; // function or member name
  args: Schema[];
  returnType: Function; // class name like Object or MyClass
}

type MemberSchema = {
  name: string;
  type: Function; // class name like Object or MyClass
}
```