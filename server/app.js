const OpenAI = require('openai');
var express = require("express");

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
        model: "gpt-4",
        messages: [{ role: "system", content: "You are a helpful assistant." }],
    });

    res.send(completion.choices[1].message.content)
});

app.post("/creat-new/project/explain",async (req,res)=>{
    console.log("")
})