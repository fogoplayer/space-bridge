# Isomorphic Functions

## init
```typescript
init({
  baseUrl: string
})
```
Initial setup for SpaceBridge.

### Parameters
`baseUrl` - the base URL of the server where remote requests should be routed to

### Returns
void

### Throws
none

---

## define
```typescript
define(func: Function): (Parameters<typeof func>) => Promise<ReturnType<typeof func>>
```
A higher-order function that wraps your function definitions so that they can use SpaceBridge logic. It is isomorphic, so you can use define in your modules pre-export and the correct logic will be loaded in each environment. It returns a function that returns a promise, and that promise resolves to the return value of your function. For example:

```typescript
// arithmetic.mjs
export add = define((num1: number, num2: number): number => num1 + num2);

// app.js
const sum = await add(1, 3);
console.log(sum); // 4
```

### Parameters
`func` - the user-defined function to be wrapped in SpaceBridge logic

### Returns
A promise that resolves to the return value of `func`

### Throws
none