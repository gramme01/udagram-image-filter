import axios from 'axios';
import fs from "fs";
import Jimp = require("jimp");

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file


export async function filterImageFromURL(inputURL: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      axios({
        method: 'get',
        url: inputURL,
        responseType: 'arraybuffer',
      })
        .then(async ({ data: imageBuffer }) => {
          const photo = await Jimp.read(imageBuffer);
          const outpath =
            "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
          await photo
            .resize(256, 256) // resize
            .quality(60) // set JPEG quality
            .greyscale() // set greyscale
            .write(__dirname + outpath, (img) => {
              resolve(__dirname + outpath);
            });
        });
    } catch (error) {
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files: Array<string>) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
  console.log("deleted");
}


/**
 * helper function to validate that a string is a url
 * 
 * @param {string} input - the string to be validated
 * @returns {boolean} if input is a valid url
 */
export function isValidURL(input: string): boolean {
  const url_regex = /^[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/i;
  return url_regex.test(input);
}
