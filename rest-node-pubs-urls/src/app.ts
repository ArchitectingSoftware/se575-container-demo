import * as Koa from 'koa'
import * as Router from 'koa-router'
import * as loki from 'lokijs';
import * as pubsUrls from './urls.json'
import * as config from './config.json'

let app = new Koa();
let router = new Router();

//setup environment
const environment = process.env.NODE_ENV || 'development'
let envConfig = config[environment]
if(!envConfig){
    let msg = "Cant find the desired configuration for environment variable NODE_ENV " +
            "that is currently set to " + process.env.NODE_ENV + " using environment " +
            "for development as default.  If you think this might be incorrect please "+
            "check and likely adjust the config.json file."
    console.log(msg)
    envConfig = config['development']
}
console.log('Using this configuration: ',envConfig)

interface IUrls{
    key: string
    type: string
    url: string
}

//Load the database
var db = new loki('my-app')
let urlC = db.addCollection('urls')
pubsUrls.map(u => urlC.insert(u))

//implement the API
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

//setup the middleware and run the server
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(envConfig.local_port);
console.log('Server started on port', envConfig.local_port)

