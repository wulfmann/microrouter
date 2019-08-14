# mvcr

Zero-Dependency Client-Side Javascript Router

## Description

This is a simple hash-based router that does path matching off of provided regular expressions.

## Install

`npm install mvcr`

## Usage

```js
    import Router from 'mvcr'

    const router = new Router({
        routes: {
            default: {
                re: /(.*)/,
                handler: function (ctx) {
                    console.log(ctx)
                }
            }
        }
    })

    router.start()
```

See the `example` directory.

## Handler

A handler for a given route is expected to be a function. At render time, this function will receive a context object containing a reference to the router instance and current route.

### Example

```js
    {
        router: {
            routes: {}
        },
        route: {
            path: '',
            query: {}
        }
    }
```

## Route

The route object that's passed in the context will contain the current path, along with an object referencing any query string that was passed.
