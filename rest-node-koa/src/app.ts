import * as Koa from 'koa'
import * as Router from 'koa-router'

import {PaperDB} from './paperDB'
import Axios from 'axios'
import * as config from './config.json'

let app = new Koa();
let router = new Router();

//setup host and port optionally via the environment
const NODE_PORT = process.env.PORT || 8080;
const NODE_HOST = process.env.HOST || '0.0.0.0';

const environment = process.env.NODE_ENV || 'development'
const envConfig = config[environment]


router.get('/publications', async http => {
    http.response.body = PaperDB
})

router.get('/publications/:id', async http => {
    let id = http.params['id']
    //http.response.body = http.params['id']

    let paper = PaperDB.find(p => p.id == id)
    if (paper)
        http.response.body = paper
    else 
        http.response.ctx.throw(404)
})

async function getRemoteUrlData(url: string){
    try{
        const response = await Axios.get(url)
        return response.data
    } catch(error){
        console.log ('Error from fetching url data ',error)
        return null
    }
}

router.get('/publications/:id/location', async http => {
    let id = http.params['id']
    let paper = PaperDB.find(p => p.id == id)
    if (paper) {
        const remoteUrl = "http://"+envConfig.code_host+":"+envConfig.code_port+"/url/"+paper.code
        let rData = await getRemoteUrlData(remoteUrl)
        paper.meta = rData
        http.response.body = paper
    }
    else 
        http.response.ctx.throw(404)
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(envConfig.local_port);
console.log('Server started on port', envConfig.local_port)

