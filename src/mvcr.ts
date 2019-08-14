interface Context {
    route: Route,
    router: Router
}

interface QueryString {
    [key: string]: string
}

interface Route {
    path: string,
    query: QueryString
}

interface Handler {
    re: RegExp,
    handler: (ctx: Context) => void,
    name?: string
}

interface Payload {
    routes: {
        [key: string]: Handler
    }
}

class Router {
    public routes: {
        [key: string]: Handler
    }
    public current: null|Handler

    constructor (config: Payload) {
        if (!('routes' in config)) {
            throw new Error('routes is a required config option')
        }
        this.routes = config.routes
        this.current = null
    }

    public go (path: string) {
        window.location.href = '#' + path
    }

    public start () {
        this.render()
        // Handle Subsequent Navigation
        window.onhashchange = e => {
            this.render()
        }
    }

    public getRoute(): Route {
        const path = location.hash.substr(1)
        let query = {}

        // Has Query String
        if (path.match(/\?(.*)=([^&]*)/)) {
            query = this.qs(path)
        }

        return { path, query }
    }

    public getHandler(route: Route): Handler {
        let handler
        for (const r in this.routes) {
            if (this.routes.hasOwnProperty(r)) {
                const match = route.path.match(this.routes[r].re)
                if (match) {
                    handler = { name: r, ...this.routes[r] }
                    break
                }
            }
        }

        if (!(handler)) {
            throw new Error('Could not find handler for route')
        }

        return handler
    }

    public render () {
        const route = this.getRoute()
        const handler = this.getHandler(route)
        this.current = handler
        handler.handler({ router: this, route })
    }

    public qs(querystring: string) {
        if (querystring === "") { return {} }
        const values = querystring.split(/\?(.+)/)[1].split('&')
        const q: QueryString = {}
        for (const i of values) {
            const val = i.split('=')
            q[val[0]] = decodeURIComponent(val[1])
        }
        return q
    }
}

export default Router
