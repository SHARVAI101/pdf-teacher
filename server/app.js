const OpenAI = require('openai');
var express = require("express");
const path = require('path')
require('dotenv').config();
const cors = require('cors');
const PDFParser = require('pdf-parse');
const fs = require('fs');
const uploadDirectory = './uploads';
const multer = require('multer');
const { initializeApp } = require("firebase/app");
// import { getAnalytics } from "firebase/analytics";
const { getFirestore, doc, updateDoc, getDoc, arrayUnion } = require("firebase/firestore");

// Firebase Configuration
const firebaseConfig = {
    // Your Firebase configuration here
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

var app = express();
app.use(cors());
app.use('/static', express.static(path.join(__dirname, 'public')));

const openai = new OpenAI({
    apiKey: process.env.API_TOKEN
});

// Initializing firebase products
const firebaseApp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebaseApp);
const db = getFirestore(firebaseApp);

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

    return(completion.choices[0].message.content)
};

async function processPDF(pdfFilePath, res) {
    try {
        const pdfBuffer = fs.readFileSync(pdfFilePath);
        const data = await PDFParser(pdfBuffer);
        const pdfText = data.text;
        return "explain this in simpler terms: "+pdfText
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

app.post("/create_new_project", upload.single('file'), async (req,res)=>{
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        console.log("file found");

        const uploadedFile = req.file;
        const projectName = req.body.name;

        const fileName = `${uploadedFile.originalname}`;
        const filePath = `${uploadDirectory}/${fileName}`;
        const fileData = fs.readFileSync(filePath, 'utf8');
        await processFileData(fileData);

        const fileExtension = uploadedFile.mimetype ?uploadedFile.mimetype : null;

        if (fileExtension === 'application/pdf') {
            // create prompt for explanation and get response from GPT
            var prompt = await processPDF(filePath, res);
            var openAIresponse = await OpenAPIprompt(prompt);

            // generate text to speech audio file
            var audioFilePath = "http://localhost:8000/static/audio/"+await textToSpeech(openAIresponse);
            console.log(audioFilePath);
            
            // update the firebase db
            updateUserData(openAIresponse, fileName, filePath, projectName, audioFilePath);
            res.send("done");
        } else {
            console.log("The is not PDF file")
        }
    } catch (error) {
         console.error('An error occurred while processing the file:', error);
         res.status(500).json({ error: 'Failed to process the file' });
    }
})

// Function to update the document
async function updateUserData(openAIresponse, fileName, filePath, projectName, audioFilePath) {
    // Reference to the document
    const docRef = doc(db, "user_data", "1");

    // New map (object) to add to the projects array
    const newProject = {
        projectName: projectName,
        explanation: openAIresponse,
        fileName: fileName,
        filePath: filePath,
        audioFilePath: audioFilePath
    };

    // Update the document
    await updateDoc(docRef, {
        projects: arrayUnion(newProject)
    });
}

app.post("/get_previous_projects", async (req,res)=>{
    try {
        // Reference to the user document
        const docRef = doc(db, "user_data", "1");

        // Get the document
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // Extract the projects array
            const userData = docSnap.data();
            const projects = userData.projects || [];

            // Send the projects array in the response
            res.json({ projects });
        } else {
            // Document not found
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

async function textToSpeech(text) {
    var filename = generateFilename()+".mp3";
    const speechFile = path.resolve(__dirname, 'public', 'audio', filename);
    try{
        const mp3 = await openai.audio.speech.create({
            model: "tts-1",
            voice: "alloy",
            input: "Today is a wonderful day to build something people love!",
          });
        // console.log(speechFile);
        const buffer = Buffer.from(await mp3.arrayBuffer());
        await fs.promises.writeFile(speechFile, buffer);
        // res.json({ audioFile: speechFile });
        return filename;
    }
    catch{
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

function generateFilename() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 7; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
