const Joi = require('joi')
const express = require('express');
const app = express();
const env_result = require('dotenv').config();

const {createClient} = require('@supabase/supabase-js');
const supabaseURL = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_ANON_KEY
const supabase = createClient(supabaseURL, supabaseKey)
console.log(supabase)

app.use(express.json());


app.get('/', (req, res)=>{
    res.send("type /api/champions to see all the champion builds!")
})

app.get('/api/champions', async(req, res)=>{
    const {data, error} = await supabase.from('champions').select()
    if(error){
        res.status(500).send("Error fetching data from supabase.")
        return
    }
    res.send(data)
})

app.get('/api/champions/:name', async(req, res)=>{
    const {data, error} = await supabase.from("champions").select().eq('name', req.params.name)
    
    if(data.length === 0){
        res.status(404).send("No build for champion exist but you can add one!")
        return
    }

    if(error){
        res.status(500).send("Error fetching data from supabase.")
        return
    }

    res.send(data)

})

app.put('/api/champions/:name', async(req, res) => {
    champ_name = req.params.name
    const schema = {
        item1: Joi.string(),
        item2: Joi.string(), 
        item3: Joi.string(), 
        item4: Joi.string(), 
        item5: Joi.string(), 
        item6: Joi.string()
    }
    const result = Joi.validate(req.body, schema)

    item1 = req.body.item1
    item2 = req.body.item2
    item3 = req.body.item3
    item4 = req.body.item4
    item5 = req.body.item5
    item6 = req.body.item6

    if(result.error){
        res.status(404).send("Only 6 items can be added!")
        return
    }

    const {data, error} = await supabase.from("champions").update({item1, item2, item3, item4, item5, item6}).eq('name', champ_name).select()
    if(data.length == 0){
        res.status(500).send("No build for champion exist but you can add one!")
        return
    }
    if(error){
        res.status(500).send("Error fetching data from supabase.")
        return
    }

    res.send(data)
})

app.post('/api/champions', async(req, res) => {
    const schema = {
        name:  Joi.string().required(),
        item1: Joi.string().required(),
        item2: Joi.string().required(), 
        item3: Joi.string().required(), 
        item4: Joi.string().required(), 
        item5: Joi.string().required(), 
        item6: Joi.string().required()
    }

    const result = Joi.validate(req.body, schema)
    if(result.error){
        res.status(404).send("Need to provide 6 items and the name of a champion!")
        return
    }

    name = req.body.name
    item1 = req.body.item1
    item2 = req.body.item2
    item3 = req.body.item3
    item4 = req.body.item4
    item5 = req.body.item5
    item6 = req.body.item6

    const {data, error} = await supabase.from("champions").insert([{name, item1, item2, item3, item4, item5, item6}]).select()

    if(error){
        res.status(500).send("Error fetching data from supabase.")
        return
    }

    res.send(data)

})

app.delete('/api/champions/:name', async(req, res) => {
    const champ = req.params.name

    const {data, error} = await supabase.from("champions").delete().eq('name', champ).select()

    if(data.length == 0){
        res.status(400).send("Champion doesn't exist!")
        return
    }

    if(error){
        res.status(500).send("Error fetching data from supabase.")
        return
    }
    
    res.send(data)
})




const port = process.env.PORT || 3000
app.listen(port, ()=> console.log(`Listening on port ${port}...`))