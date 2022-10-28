/**
 * Triggered from a change to a Cloud Storage bucket.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
const { Storage } = require("@google-cloud/storage");
const { PubSub } = require("@google-cloud/pubsub");
const CSV = require("csv-string");
const mysql = require("promise-mysql");

const storage = new Storage();
const pubSubClient = new PubSub();

let mysqlPool = undefined;

const mysqlConfig = {
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: "elecciones",
  socketPath: "/cloudsql/turing-rush-364923:us-central1:database-raw",
};

const readGoogleStorageFile = async (bucketName, fileName) =>
  new Promise((resolve, reject) => {
    let buf = "";
    storage
      .bucket(bucketName)
      .file(fileName)
      .createReadStream()
      .on("data", (d) => (buf += d))
      .on("end", () => resolve(buf))
      .on("error", (e) => reject(e));
  });

exports.parseData = async (event, context) => {
  try {
    if (!mysqlPool) {
      mysqlPool = await mysql.createPool(mysqlConfig);
    }

    const file = await readGoogleStorageFile(event.bucket, event.name);
    const data = CSV.parse(file, { output: "objects" });
    let query =
      "INSERT INTO raw_data (dni, region, provincia, distrito, candidato, esvalido) VALUES ";
    data.forEach(
      ({ dni, region, provincia, distrito, candidato, esvalido }) => {
        query += `('${dni}','${region}','${provincia}','${distrito}','${candidato}',${esvalido}),`;
      }
    );
    query = `${query.slice(0, -1)};`;
    const dataBuffer = Buffer.from(JSON.stringify(data));
    await mysqlPool.query(query, async (err, results) => {
      if (err) {
        console.error(err);
      } else {
        const messageId = await pubSubClient
          .topic("projects/turing-rush-364923/topics/new-data")
          .publishMessage({ data: dataBuffer });
        console.log(`Message ${messageId} published.`);
      }
    });
  } catch (err) {
    console.error(err);
  }
};
