class Router {
    constructor ({ routes }) {
        this.routes = routes
        this.containerId = 'app'
        this.appRootId = '__app__'
        this.appRoot = document.getElementById(this.appRootId)
        this.current = null

        // // Initial Render
        // this.render()
        // window.router = this
    }

    getRoute () {
        var path = this.trimSlashes(decodeURI(location.pathname))
        var query = this.qs(location.search)
        return { path, query }
    }

    getHandler(route) {
        const { path } = route

        for (var route in this.routes) {
            if (!('re' in this.routes[route])) {
                throw new Error('no regex pattern set in route')
            }

            var match = path.match(this.routes[route].re)

            if (match) {
                console.log(this.routes, route)
                return {
                    name: route,
                    ...this.routes[route]
                }
            }
        }
    }

    redirect (path) {
        window.location = path
    }

    navigate (path) {
        if (!(path.charAt(0) == '/')) {
            throw new Error('route must start with /')
        }
        window.history.pushState(null, null, path)
        this.render()
    }

    render () {
        console.time('route')
        var route = this.getRoute()
        var handler = this.getHandler(route)
        this.current = handler

        if ('handler' in handler) {
            if (!(handler.handler instanceof Function)) {
                throw new Error('route handler must be a function')
            }
            this._render(handler.handler, route)
            console.timeEnd('route')
        } else {
            throw new Error('no handler methods found in route')
        }
    }

    _render (handler, route) {
        console.time('render')
        var app = document.createElement('div')
        app.setAttribute('id', this.containerId)

        const content = handler({
            container: app,
            router: this,
            route: route
        })

        var node = document.createRange().createContextualFragment(content)
        app.appendChild(node)

        var existingApp = document.getElementById(this.containerId)

        if (!(this.appRoot)) {
            throw new Error('could not find #' + this.appRootId)
        }
        if (!(existingApp)) {
            this.appRoot.appendChild(app)
        } else {
            this.appRoot.replaceChild(app, existingApp)
        }

        console.timeEnd('render')
    }

    trimSlashes(str) {
        // Remove n number of leading or trailing slashes
        return str.replace(/^\/+|\/+$/g, '')
    }

    qs(querystring) {
        if (querystring == '') { return {} }
        var values = querystring.split('?')[1].split('&')
        var q = {}
        for (var i=0; i<values.length;i++) {
            var val = values[i].split('=')
            q[val[0]] = val[1]
        }
        return q
    }
}

module.exports = Router
