const OpenAI = require('openai');
var express = require("express");

var app = express();

const openai = new OpenAI({
    apiKey: "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"
});

app.get("/", function (req, res) {
    res.send(" Welcome Node js ");
});  

app.listen(8000, function () {
    console.log("Node server is runing on port 8000...");
});

app.post("/transcript", async (req, res) =>{
    const stream = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: "Say this is a test" }],
        stream: true,
    });

    for await (const chunk of stream) {
        console.log(chunk.choices[0]?.delta?.content || "");
    }
    resturn }
});

app.post("/creat-new/project/explain",async (req,res)=>{
    console.log("")
})