const OpenAI = require('openai');
var express = require("express");
require('dotenv').config();

var app = express();

const openai = new OpenAI({
    apiKey: process.env.API_TOKEN
});

app.get("/", function (req, res) {
    res.send(" Welcome Node js ");
});  

app.listen(8000, function () {
    console.log("Node server is runing on port 8000...");
});

app.post("/transcript", async (req, res) =>{
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: "You are a helpful assistant." }],
    });

<<<<<<< HEAD
    res.send({"message":completion.choices[0].message.content})
=======
    res.send({"Message":completion.choices[0].message.content})
>>>>>>> 2944454d59b8477081cbc6c9c26fb632426628c4
});

app.post("/creat-new/project/explain",async (req,res)=>{
    console.log("")
})