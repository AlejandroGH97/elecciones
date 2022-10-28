const Busboy = require("busboy");
const { v4: uuidv4 } = require("uuid");
const { Storage } = require("@google-cloud/storage");
const stream = require("stream");

const storage = new Storage();
const bucketName = "lab8-2-software";

exports.uploadFile = (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).end();
  }
  const busboy = Busboy({ headers: req.headers });

  const myBucket = storage.bucket(bucketName);
  let fileData = null;
  let bucketFileName = `${uuidv4()}.csv`;

  busboy.on("file", (fieldname, file, { filename }) => {
    file.on("data", (data) => {
      if (fileData === null) {
        fileData = data;
      } else {
        fileData = Buffer.concat([fileData, data]);
      }
    });
  });

  busboy.on("finish", async () => {
    const bucketFile = myBucket.file(bucketFileName);
    const passthroughStream = new stream.PassThrough();
    passthroughStream.write(fileData);
    passthroughStream.end();

    async function streamFileUpload() {
      passthroughStream
        .pipe(bucketFile.createWriteStream())
        .on("finish", () => {});
      console.log(`${bucketFileName} uploaded to ${bucketName}`);
    }

    streamFileUpload().catch(console.error);
    res.send(200);
  });

  busboy.end(req.rawBody);
};
