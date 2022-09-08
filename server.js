const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");

const filesPayloadExists = require('./middleware/filesPayloadExists');
const fileExtLimiter = require('./middleware/fileExtLimiter');
const fileSizeLimiter = require('./middleware/fileSizeLimiter');

//sets PORT to the environment variable or 3500
const PORT = 3500;

const app = express();

//API endpoint which sends index.html file to user
app.get("/file", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

//API endpoint that checks the file upload: exists, is .cv, is not larger than 5 mb
app.post('/upload',
    fileUpload({ createParentPath: true }),
    filesPayloadExists,
    fileExtLimiter(['.csv']),
    fileSizeLimiter,
    (req, res) => {
        //it logs on the files in a variable
        const files = req.files
        //it prints the files to the console
        console.log(files)
        //I don't know exactly what this does
        Object.keys(files).forEach(key => {
            const filepath = path.join(__dirname, 'files', files[key].name)
            //if there is an error, it will return this
            files[key].mv(filepath, (err) => {
                if (err) return res.status(500).json({ status: "error", message: err })
            })
        })
        //or it will return a successful json with the files as strings
        return res.json({ status: 'success', message: Object.keys(files).toString() })
    }
)
