# Internal Methods

## runLocally
```ts
runLocally(): boolean
```
The function that we use to determine which execution environment to use for a particular call. 

### Returns
`true` if the function should be evaluated locally, `false` if it should be evaluated over API.

### Subroutines
Subroutines are formatted as `[factor]Opinion()` where `factor` is one of the conditions we evaluate to determine execution environment.
They can be overridden by the user by passing a new function to `set[Factor]Opinion()`. All subroutines return a number between 0 and 1, with 0 being a strong recommendation to evaluate remotely and 1 being a strong recommendation to evaluate locally.
**TODO is this a good idea?**

### Factors
**TODO not finalized**
`network` - what the network says about where we should execute
`specs` - what the hardware difference says about where we should execute
`cost` - what the relative costs of remote vs local execution say about where we should execuite
`performance` - Which one its faster to run on

## setRunLocally
```ts
setRunLocally(func: () => void): void
```
Allows the user to completely override our logic if they want