const express = require("express")
const mongoose = require("mongoose")

const app = express()
const PORT = 5000

app.use(express.json({ extended:true }))
app.use('/api/auth', require('./routes/auth.route'))
app.use('/api/todo', require('./routes/todo.route'))

async function start (){
    try {
        await mongoose.connect(
            "mongodb+srv://nev-dev:77884386Je@cluster0.ob6uw.mongodb.net/todo?retryWrites=true&w=majority",
            {useNewUplParser : true},
            {useUnifiedTopology : true},
            {useCreateIndex: true},
            {useFindAndModify: true})

            app.listen(PORT, ()=>{
                console.log(`Server started on port ${PORT}`)
            })
    } catch (err) {
        console.error(err);
    }
}

start()