import htm from 'htm'
import vhtml from 'vhtml'
import Router from 'mvcr'

function render (content, target, containerId) {
    const appId = containerId || 'app'
    var app = document.createElement('div')
    app.setAttribute('id', appId)

    var node = document.createRange().createContextualFragment(content)
    app.appendChild(node)

    var existingApp = document.getElementById(appId)

    if (!(existingApp)) {
        target.appendChild(app)
    } else {
        target.replaceChild(app, existingApp)
    }
}

const html = htm.bind(vhtml)
const myHandler = ctx => {
    render(
        html`<div id=${Date.now()}>Hello World</div>`,
        document.getElementById('__app__')
    )
}

const everything = /(.*)/
const router = new Router({
    routes: {
        main: {
            re: everything,
            handler: myHandler
        }
    }
})
router.start()