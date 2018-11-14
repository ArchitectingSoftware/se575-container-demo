import * as Koa from 'koa'
import * as Router from 'koa-router'

import {PaperDB} from './paperDB'

let app = new Koa();
let router = new Router();

//setup host and port optionally via the environment
const NODE_PORT = +process.env.PORT || 9205;
const NODE_HOST = process.env.HOST || '0.0.0.0';




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

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(NODE_PORT);
console.log('Server started on port', NODE_PORT)

