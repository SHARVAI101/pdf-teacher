const OpenAI = require('openai');
var express = require("express");
require('dotenv').config();
<<<<<<< Updated upstream
const cors = require('cors');

=======
const PDFParser = require('pdf-parse');
const fs = require('fs');
const uploadDirectory = './uploads';
const multer = require('multer');
const path = require('path');
const mammoth = require('mammoth');
const pdf = require('html-pdf');
>>>>>>> Stashed changes
var app = express();

app.use(cors());

const openai = new OpenAI({
    apiKey: process.env.API_TOKEN
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(8000, function () {
    console.log("Node server is runing on port 8000...");
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
       cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
       cb(null, file.originalname);
    }
});
const upload = multer({ storage });

app.post("/transcript", async (req, res) =>{
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: "You are a helpful assistant." }],
    });

    res.send({"message":completion.choices[0].message.content})
});

app.post("/creat-new/project/explain",async (req,res)=>{
    console.log("")
})