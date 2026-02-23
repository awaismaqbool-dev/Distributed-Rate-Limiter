
import express from 'express';
import axios from 'axios';
import { FixedredisMiddelwear, redisFloatMiddelwear } from '../middelWear/redisMiddelWear.js';
import Client from '../client/client.js';
const app = express()
const port = 9000
app.get('/fixed-window', FixedredisMiddelwear, async (req, res )=>{
    const casheData= await Client.get("todos");
        if (casheData) {
        return res.json(JSON.parse(casheData));
    }
    const {data}= await axios.get('https://jsonplaceholder.typicode.com/todos/1');
    await Client.set('todos', JSON.stringify({data},'EX', 50))
    return res.json({data})

})
app.get('/float-window', redisFloatMiddelwear, async (req, res )=>{
    const casheData= await Client.get("todos");
        if (casheData) {
        return res.json(JSON.parse(casheData));
    }
    const {data}= await axios.get('https://jsonplaceholder.typicode.com/todos/1');
    await Client.set('todos', JSON.stringify({data},'EX', 50))
    return res.json({data})

})
app.listen(port, ()=>{
    console.log('app listen on 9000 port ');
    
})