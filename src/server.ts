import { deleteLocalFiles, filterImageFromURL, isValidURL } from './util/util';
import express, { Request, Response } from 'express';

import bodyParser from 'body-parser';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  app.get("/filteredimage", async (req: Request, res: Response) => {
    const image_URL = req.query.image_url.toString();

    // validate the image_URL query
    if (!image_URL) {
      return res.status(400).send("Bad Request! Image URL is required");
    }

    if (!isValidURL(image_URL)) {
      return res.status(400).send("Bad Request! Use a valid Image URL");
    }

    // filter the image from url
    let filtered_image_path: string;
    try {
      filtered_image_path = await filterImageFromURL(image_URL);
    } catch (error) {
      return res.status(422).send("Unprocessable Entity! No image was returned from the Image URL");
    }

    // send the filtered image and delete local files on the server
    res.status(200).sendFile(filtered_image_path, function () {
      deleteLocalFiles([filtered_image_path]);
    });
  });

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req: Request, res: Response) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();