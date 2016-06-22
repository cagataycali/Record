import { upload, uploadFile } from './modules/Upload.js';
import fs from 'fs';
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const yosay = require('yosay');
import webdriver from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
let path = require('chromedriver').path;
import config from './config';

const args = process.argv;
let uri = args[2] ? args[2]:'http://localhost:3000';

async function uploadData(url,name) {
  return new Promise(() => {
    upload(url, false, name); // Upload video
  });
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// ffmpeg           :
// ffmpeg -i out.webm -c:v mpeg4 -b:v 48k  movie.mp4
// ffmpeg with audio:
// ffmpeg -i out.webm -i audio.vaw -c:v mpeg4 -c:a vorbis -b:v 48k -b:a 4k movie.mp4

io.on('connection', (socket) => {
  // Duration
  io.emit('duration', config.video.duration);

  socket.on('log', (log) => {
    console.log(log);
  });

  // Video
  socket.on('video', async(msg) => {
    // io.emit('video', msg);
    const base64Data = msg.replace(/^data:video\/webm;base64,/, '');
    fs.writeFile(config.video.output, base64Data, 'base64', () => {
    });
    if (config.video.upload) {
      await uploadFile(config.video.output);
    }
    console.log('Screen captured.');
  });
});

/*
  Used for cli tool.
*/
async function recorder(url) {
  const service = new chrome.ServiceBuilder(path).build();
  chrome.setDefaultService(service);

  const driver = new webdriver.Builder()
      .withCapabilities(webdriver.Capabilities.chrome())
      .build();
  driver.manage().window().setSize(config.webdriver.width, config.webdriver.height);
  console.log(url);
  driver.get(url);
  io.on('connection', (socket) => {
    socket.on('done', async(msg) => {
      console.log(msg);
      if (msg === true) {
        driver.quit();
      }
    });
  });
}
/*
  Runner func,
*/
export function run(url, time) {
  http.listen(5000, async() => {
    console.log(yosay('Proccess started on *:3000'));
    if (args[2]) {
      recorder(url, time);
    }
  });
}

run(uri);
