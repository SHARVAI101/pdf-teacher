const OpenAI = require('openai');
var express = require("express");
const path = require('path')
require('dotenv').config();
const cors = require('cors');
const PDFParser = require('pdf-parse');
const fs = require('fs');
const uploadDirectory = './uploads';
const multer = require('multer');

var app = express();
app.use(cors());
app.use('/static', express.static(path.join(__dirname, 'public')));

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

app.post("/creat-new/project/explain",upload.single('file'),async (req,res)=>{
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const uploadedFile = req.file;

        const fileName = `${uploadedFile.originalname}`;
        const filePath = `${uploadDirectory}/${fileName}`;
        const fileData = fs.readFileSync(filePath, 'utf8');
        await processFileData(fileData);

        const fileExtension = uploadedFile.mimetype ?uploadedFile.mimetype : null;

        if (fileExtension === 'application/pdf') {
            var prompt = await processPDF(filePath, res);
            res.send({"prompt":prompt});
        } else {
            console.log("The is not PDF file")
        }
    } catch (error) {
         console.error('An error occurred while processing the file:', error);
         res.status(500).json({ error: 'Failed to process the file' });
    }
})

async function processPDF(pdfFilePath, res) {
    try {
        const pdfBuffer = fs.readFileSync(pdfFilePath);
        PDFParser(pdfBuffer).then((data) => {
            var allPagesData = [];

            // Number of pages
            console.log(data.numpages);
            
            // Process each page
            let pageProcessingPromises = [];
            for (let i = 0; i < data.numpages; i++) {
                let promise = PDFParser(pdfBuffer, {max: i + 1, min: i})
                    .then(function(pageData) {
                        let pageNumber = 'Page Number_' + (i + 1);
                        allPagesData.push({ [pageNumber]: pageData.text });
                    });
                pageProcessingPromises.push(promise);
            }

            // After all pages have been processed
            Promise.all(pageProcessingPromises).then(() => {
                console.log(allPagesData);
            });
        });
    } catch (error) {
          console.error('An error occurred while processing the PDF:', error);
          res.status(500).json({ error: 'Failed to process the PDF' });
    }
}

function processFileData(fileData) {
    fs.writeFile('output.txt', fileData, (err) => {
          if (err) {
              console.error('Error writing file:', err);
          } else {
              console.log('File written successfully');
          }
        });
  }


  app.get("/text-to-speech", async (req, res) =>{
    const speechFile = path.resolve("./speech.mp3");
    try{
        const mp3 = await openai.audio.speech.create({
            model: "tts-1",
            voice: "alloy",
            input: "Today is a wonderful day to build something people love!",
          });
        console.log(speechFile);
        const buffer = Buffer.from(await mp3.arrayBuffer());
        await fs.promises.writeFile(speechFile, buffer);
        res.json({ audioFile: speechFile });
    }
    catch{
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
});