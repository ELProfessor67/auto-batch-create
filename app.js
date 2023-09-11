import express from 'express';
import cron from 'node-cron';
import {config} from 'dotenv';
import axios from 'axios';
import {exec} from 'child_process';

config({path: './.env'});
const port = process.env.PORT || 4000;

const app = express();

app.get('/' , (req , res)=>{
   res.send('server is worling');
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