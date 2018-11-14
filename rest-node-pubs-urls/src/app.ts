import * as Koa from 'koa'
import * as Router from 'koa-router'
import * as loki from 'lokijs';
import * as pubsUrls from './urls.json'
import * as config from './config.json'

let app = new Koa();
let router = new Router();

//setup host and port optionally via the environment
const NODE_PORT = +process.env.PORT || 9100;
const NODE_HOST = process.env.HOST || '0.0.0.0';

const environment = process.env.NODE_ENV || 'development'
const envConfig = config[environment]

interface IUrls{
    key: string
    type: string
    url: string
}

//Load the database
var db = new loki('my-app')
let urlC = db.addCollection('urls')
pubsUrls.map(u => urlC.insert(u))

router.get('/url/:pubKey', async http => {
    let pubId = http.params['pubKey']

    let thisPub = urlC.findOne({key:pubId})
    if (thisPub) {
        delete thisPub.meta
        delete thisPub.$loki
        http.response.body = thisPub
    }
    else 
        http.response.ctx.throw(404)
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(envConfig.local_port);
console.log('Server started on port', envConfig.local_port)

