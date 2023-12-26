const OpenAI = require('openai');
var express = require("express");
require('dotenv').config();
const cors = require('cors');
const PDFParser = require('pdf-parse');
const fs = require('fs');
const uploadDirectory = './uploads';
const multer = require('multer');

var app = express();
app.use(cors());

const openai = new OpenAI({
    apiKey: process.env.API_TOKEN
});

console.log(process.env.FIREBASE_TOKEN);

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

async function OpenAPIprompt (prompt) {
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: prompt }],
    });

    return({"AIgenerated":completion.choices[0].message.content, "prompt":prompt})
};

async function processPDF(pdfFilePath, res) {
    try {
        const pdfBuffer = fs.readFileSync(pdfFilePath);
        const data = await PDFParser(pdfBuffer);
        const pdfText = data.text;
        return pdfText
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

app.post("/explain", upload.single('file'), async (req,res)=>{
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        console.log("file found");

        const uploadedFile = req.file;

        const fileName = `${uploadedFile.originalname}`;
        const filePath = `${uploadDirectory}/${fileName}`;
        const fileData = fs.readFileSync(filePath, 'utf8');
        await processFileData(fileData);

        const fileExtension = uploadedFile.mimetype ?uploadedFile.mimetype : null;

        if (fileExtension === 'application/pdf') {
            var prompt = await processPDF(filePath, res);
            res.send(await OpenAPIprompt(prompt));
        } else {
            console.log("The is not PDF file")
        }
    } catch (error) {
         console.error('An error occurred while processing the file:', error);
         res.status(500).json({ error: 'Failed to process the file' });
    }
})