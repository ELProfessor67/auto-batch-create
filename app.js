import express from 'express';
import cron from 'node-cron';
import {config} from 'dotenv';
import axios from 'axios';
import {exec} from 'child_process';
import {generatePdf} from 'html-pdf-node';

config({path: './.env'});
const port = process.env.PORT || 4000;

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json({extended: true}));


app.get('/' , (req , res)=>{
   res.send('hello from simple server :)')
});

app.post('/html-to-pdf' , async (req , res)=>{
  const {htmlCode} = req.body;
  // console.log(req.body)
  if (!htmlCode){
    return res.status(402).json({
      success: false,
      message: 'please provide html code'
    });
  }
  
  try {
    let options = { format: 'A4' };
    let file = { content: htmlCode };
    const pdfBuffer = await generatePdf(file, options);
    const pdfBase64 = new Buffer(pdfBuffer).toString('base64');
    res.status(200).send(pdfBase64);
  } catch (error) {
    res.status(500).send(error.message)
  }
});

// cron jobs 
cron.schedule("0 17 * * *",async function(){
    const url = process.env.GATE_URL + '/projects/createview?key=' + process.env.KEY;
    const command = `curl -i -H "Authorization: Bearer YOUR_ACCESS_TOKEN" ${url}`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          return;
        }
        
        if (stderr) {
          console.error(`Stderr: ${stderr}`);
          return;
        }
      
        console.log(`Stdout: ${stdout}`);
    });    
},{
    timezone: 'America/New_York',
    // timezone: 'Asia/Kolkata',
    scheduled: true
});


app.listen(port, () => console.log(`server running on port ${port}`));