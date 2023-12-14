const express = require("express");
const { writeFileSync, existsSync, mkdirSync, readdirSync, readFileSync } = require("fs");
const path = require("path");

const app = express();
const folder = "timestamps";


//initial route
app.get("/", function (req, res) {
  if (req.url === "/") {
    res.send(`
    <h1>Helloo</h1>
    <p><a href="/static">Link </a> <h4>to create a text file</h4></p>
    <p><a href="/textfiles">Link</a><h4> to retrieve text files</h4></p>
    `);
  } else {
    res.status(404).end(`
    <h1>OOPS</h1>
    <p>This is the wrong page</p>
    `);
  }
});

// 1. write API end point which will create a text file in a particular folder.
app.get("/static", (req, res) => {

  //to create a directory
  if (!existsSync(folder)) {
    mkdirSync(folder);
  }

  // a)content of the file should be the current timestamp.
  const time = new Date().toLocaleString('ta-IN', { timeZone: 'Asia/Kolkata' });
  // b)The filename should be current date-time.txt
  // In tamil code

  writeFileSync(
    path.join(__dirname, folder, "/date-time.txt"), 
    `Last created timestamp format is MM/DD/YY ${time}`,
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("The file is created");
      }
    }
  );
  const timeEnglish = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
  // In English code
  writeFileSync(
    path.join(__dirname, folder, "/date-time.txt"), 
    `Last created timestamp format is MM/DD/YY ${timeEnglish}`,
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("The file is created");
      }
    }
  );

  if (req.url === "/static") {
    res.sendFile(path.join(__dirname, folder, "date-time.txt"));
  } else {
    res.statusCode(500).end(`
    <h1>OOPS</h1>
    <p>This is the wrong page</p>
    `);
  }
});


// 2) write API endpoint to retrieve all the text files in that particular folder.

app.get('/textfiles',(req,res)=>{
  const folderPath = path.join(__dirname,folder);
  const files = readdirSync(folderPath).filter(file=>file.endsWith('.txt'));
  const filesContent = files.map(file=>{
    const filePath = path.join(folderPath,file)
    return{
      filename : file,
      content: readFileSync(filePath,'utf-8')
    }
  });
  res.json(filesContent)
})


// listening the server
app.listen(3007, () => console.log("Server started on 3007"));