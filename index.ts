interface QueryString {
    [key: string]: string
}

interface Route {
    path: string,
    query: QueryString
}

interface Handler {
    re: string,
    handler: Function,
    name?: string
}

interface Payload {
    routes: {
        [key: string]: Handler
    }
}

class Router {
    routes: {
        [key: string]: Handler
    }
    containerId: string
    appRootId: string
    appRoot: null|HTMLElement
    current: null|Handler

    constructor (config: Payload) {
        if (!('routes' in config)) {
            throw new Error('routes is a required config option')
        }
        this.routes = config.routes
        this.containerId = 'app'
        this.appRootId = '__app__'
        this.appRoot = document.getElementById(this.appRootId)
        this.current = null
        this.render()
    }

    getRoute (): Route {
        var path = location.hash.substr(1)
        var query = {}

        // Has Query String
        if (path.match(/\?(.*)=([^&]*)/)) {
            query = this.qs(path)
        }

        return { path, query }
    }

    getHandler(route: Route): Handler {
        let handler
        for (var r in this.routes) {
            var match = route.path.match(this.routes[r].re)
            if (match) {
                handler = { name: r, ...this.routes[r] }
                break
            }
        }

        if (!(handler)) {
            throw new Error('Could not find handler for route')
        }

        return handler
    }

    go (path: string) {
        window.location.href = '#' + path
    }

    render () {
        console.time('route')
        var route = this.getRoute()
        var handler = this.getHandler(route)
        this.current = handler
        handler.handler({ router: this, route: route })
        console.timeEnd('route')
    }

    trimSlashes(str: string) {
        return str.replace(/^\/+|\/+$/g, '')
    }

    qs(querystring: string) {
        if (querystring == '') { return {} }
        var values = querystring.split(/\?(.+)/)[1].split('&')
        var q: QueryString = {}
        for (var i=0; i<values.length;i++) {
            var val = values[i].split('=')
            q[val[0]] = decodeURIComponent(val[1])
        }
        return q
    }
}

export default Router
