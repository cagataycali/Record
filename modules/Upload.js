import fs from 'fs';
import request from 'request';
import streamingS3 from 'streaming-s3';
import config from '../config';

export function uploadFile(filename) {
  return new Promise((resolve, reject) => {
    const fStream = fs.createReadStream(filename);
    const obj = {
      accessKeyId: config.aws.accessToken,
      secretAccessKey: config.aws.secretAccessKey,
    };
    const uploader = new streamingS3(fStream, obj,
      {
        Bucket: config.aws.bucket,
        Key: config.aws.key,
      }
    );

    uploader.begin(); // important if callback not provided.

    uploader.on('data', (bytesRead) => {
      console.log(bytesRead, ' bytes read.');
    });

    uploader.on('part', (number) => {
      console.log('Part ', number, ' uploaded.');
    });

    // All parts uploaded, but upload not yet acknowledged.
    uploader.on('uploaded', (stats) => {
      console.log('Upload stats: ', stats);
    });

    uploader.on('finished', (resp) => {
      console.log('Upload finished: ', resp);
      console.log(resp.Location);
      resolve(resp);
      // fs.unlink(filename, () => { // Delete item.
      //   console.log(`${filename} deleted successfully.`);
      // });
    });

    uploader.on('error', (e) => {
      console.log('Upload error: ', e);
      reject(e);
    });
  });
}

const download = (uri, filename, callback) => {
  request.head(uri, (err) => {
    try {
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    } catch (e) {
      console.log(`Kabuumm file does not exist ${uri}`);
    }
    if (err) {
      console.log('error', err);
    }
  });
};

async function splitItem(item) {
  return new Promise((resolve) => { resolve(item.split('/').pop(-1)); });
}

export const upload = async(uri, split = true) => {
  let item;
  if (split === true) {
    item = await splitItem(uri);
  } else {
    item = name;
  }
  try {
    download(uri, item, () => { // When download finised
      console.log('Downloaded.');
      // s3 upload..
      uploadFile(item);
    });
  } catch (e) {
    console.log('Download failed');
  }
};
