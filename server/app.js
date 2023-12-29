const OpenAI = require('openai');
var express = require("express");
const path = require('path')
require('dotenv').config();
const cors = require('cors');
const PDFParser = require('pdf-parse');
const fs = require('fs');
const multer = require('multer');
const bodyParser = require('body-parser');

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

app.use(bodyParser.json());
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(8000, function () {
    console.log("Node server is runing on port 8000...");
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
       cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
       cb(null, file.originalname);
    }
});
const upload = multer({ storage });

async function OpenAPIprompt (prompt) {
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
    });

    return(completion.choices[0].message.content)
};

function separateTitlesAndContents(pdfText) {
    const lines = pdfText.trim().split('\n');
    const sections = [];
    let currentTitle = "";
    let currentContent = [];

    lines.forEach(line => {
        line = line.trim();
        if (line) {
            // Assuming that a line is a title if it's short and not a continuation of a sentence
            if (line.length < 50 && !line.endsWith('.')) {
                if (currentTitle) {
                    sections.push({ title: currentTitle, content: currentContent.join('\n').trim() });
                }
                currentTitle = line;
                currentContent = [];
            } else {
                currentContent.push(line);
            }
        }
    });

    // Adding the last section
    if (currentTitle) {
        sections.push({ title: currentTitle, content: currentContent.join('\n').trim() });
    }

    return sections;
}


async function processPDF(pdfFilePath, res) {
    try {
        const pdfBuffer = fs.readFileSync(pdfFilePath);
        const data = await PDFParser(pdfBuffer);
        const pdfText = data.text;
        return pdfText;
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
        // const uploadDirectory = './uploads';
        const uploadDirectory = path.join(__dirname, 'public', 'uploads');
        // const filePath = `${uploadDirectory}/${fileName}`;
        const filePath = path.join(uploadDirectory, fileName);
        // const filePath = path.resolve(__dirname, 'public', 'uploads', fileName);
        console.log(filePath);
        const fileData = fs.readFileSync(filePath, 'utf8');
        await processFileData(fileData);

        const fileExtension = uploadedFile.mimetype ?uploadedFile.mimetype : null;

        if (fileExtension === 'application/pdf') {
            // generate projectID
            var projectID = generateProjectID();

            // create prompt for explanation and get response from GPT
            var pdfText = await processPDF(filePath, res);
            // var prompt = "explain this in simpler terms: "+ pdfText;
            const sections = separateTitlesAndContents(pdfText);
            var prompt='';
            sections.forEach((section, index) => {
                prompt += `Section ${index + 1} Title: ${section.title}\n`;
                prompt += `Section ${index + 1} Content: ${section.content}\n`;
                prompt +=`expain in detail the above section ${index + 1}\n\n`;
            });
            console.log(prompt);
            var openAIresponse = await OpenAPIprompt(prompt);

            // generate text to speech audio file
            var audioFilePath = "http://localhost:8000/static/audio/"+await textToSpeech(openAIresponse, projectID);
            console.log(audioFilePath);
            
            // update the firebase db
            updateUserData(openAIresponse, fileName, projectName, audioFilePath, projectID,pdfText);
            res.status(200).send({projectID: projectID});
        } else {
            console.log("The is not PDF file")
        }
    } catch (error) {
         console.error('An error occurred while processing the file:', error);
         res.status(500).json({ error: 'Failed to process the file' });
    }
})

// Function to update the document
async function updateUserData(openAIresponse, fileName, projectName, audioFilePath, projectID, pdfText) {
    // Reference to the document
    const docRef = doc(db, "user_data", "1");

    // New map (object) to add to the projects array
    const newProject = {
        projectID: projectID,
        projectName: projectName,
        explanation: openAIresponse,
        fileName: fileName,
        filePath: "http://localhost:8000/static/uploads/"+fileName,
        audioFilePath: audioFilePath,
        pdfText: pdfText
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

async function textToSpeech(text, projectID) {
    var filename = projectID + ".mp3";
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

function generateProjectID() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 7; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

app.post("/get_project_details", async (req,res)=>{
    try {
        const projectID = req.body.projectID;
        // console.log(req.body.projectID);
        // Reference to the user document
        const docRef = doc(db, "user_data", "1");

        // Get the document
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // Extract the projects array
            const userData = docSnap.data();
            const projects = userData.projects || [];
            
            const matchingProject = projects.find((project) => project.projectID === projectID);

            if (matchingProject) {
                res.json(matchingProject); // Send the found project details
            } else {
                res.status(404).json({ error: "Project not found" });
            }
        } else {
            // Document not found
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/get_answer", async (req, res) => {
    try {
        const question = req.body.question;
        const pdfText = req.body.pdfText;

        var prompt = "Using this text:"+pdfText+", answer this question:"+question;
        const answer = await OpenAPIprompt(prompt);

        res.json({ answer: answer });
    } catch (error) {
        res.status(500).json({error: "Internal server error"});
    }
});

app.post("/create_quiz", async (req, res) => {
    try {
        const pdfText = req.body.pdfText;

        var prompt = "Create 5 multiple choice questions out of the text I will attach at the end. Return the questions as a list of json objects. The key for the question will be 'question', the key for the list of options will be 'options', the key for correct answer will be 'correct_answer'. The correct_answer will contain the index of the right answer from the list of options. This is the text to create your questions from: "+pdfText+".";
        const questions = await OpenAPIprompt(prompt);

        res.json({ questions: JSON.parse(questions) });
    } catch (error) {
        res.status(500).json({error: error});
    }
});