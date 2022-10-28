/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
const mysql = require("promise-mysql");

let connection = undefined;

const mysqlConfig = {
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: "elecciones",
  socketPath: "/cloudsql/turing-rush-364923:us-central1:database-raw",
};

exports.processRows = async (event, context) => {
  try {
    if (!connection) {
      connection = await mysql.createConnection(mysqlConfig);
    }

    const message = event.data
      ? JSON.parse(Buffer.from(event.data, "base64").toString())
      : [];

    if (message.length === 0) {
      console.log("No rows to process.");
      return;
    }

    const newData = message.reduce(
      (accumulator, { region, provincia, distrito, candidato, esvalido }) => {
        if (!accumulator[region]) {
          accumulator[region] = {
            [provincia]: {
              [distrito]: {
                [candidato]: {
                  valid_votes: Number(esvalido),
                  total_votes: 1,
                },
              },
            },
          };
        } else if (!accumulator[region][provincia]) {
          accumulator[region][provincia] = {
            [distrito]: {
              [candidato]: {
                valid_votes: Number(esvalido),
                total_votes: 1,
              },
            },
          };
        } else if (!accumulator[region][provincia][distrito]) {
          accumulator[region][provincia][distrito] = {
            [candidato]: {
              valid_votes: Number(esvalido),
              total_votes: 1,
            },
          };
        } else if (!accumulator[region][provincia][distrito][candidato]) {
          accumulator[region][provincia][distrito][candidato] = {
            valid_votes: Number(esvalido),
            total_votes: 1,
          };
        } else {
          accumulator[region][provincia][distrito][candidato].valid_votes +=
            Number(esvalido);
          accumulator[region][provincia][distrito][candidato].total_votes += 1;
        }
        return accumulator;
      },
      {}
    );

    Object.entries(newData).forEach(([region, provincias]) => {
      Object.entries(provincias).forEach(([provincia, distritos]) => {
        Object.entries(distritos).forEach(([distrito, candidates]) => {
          Object.entries(candidates).forEach(
            async ([candidate, { valid_votes, total_votes }]) => {
              const query = `INSERT INTO distrito_data (region, provincia, distrito, candidato, votos_validos, votos_totales) values ('${region}', '${provincia}', '${distrito}', '${candidate}', ${valid_votes}, ${total_votes}) ON DUPLICATE KEY UPDATE votos_validos = votos_validos + ${valid_votes}, votos_totales = votos_totales + ${total_votes};`;
              await connection.query("START TRANSACTION;");
              await connection.query(query, async (error, results, fields) => {
                if (error) {
                  await connection.query("ROLLBACK;");
                  throw error;
                } else {
                  await connection.query("COMMIT;");
                }
              });
            }
          );
        });
      });
    });
  } catch (err) {
    console.error(err);
  }
  return 1;
};
