/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
const express = require("express");
const mysql = require("promise-mysql");

const app = express();

const mysqlConfig = {
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: "elecciones",
  socketPath: "/cloudsql/turing-rush-364923:us-central1:database-raw",
};

let mysqlPool = undefined;

app.get("/data/:regionName", async (req, res) => {
  if (!mysqlPool) {
    mysqlPool = await mysql.createPool(mysqlConfig);
  }
  const { regionName } = req.params;
  const query = `select * from region_data where region = '${regionName}';`;
  await mysqlPool.query(query, async (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(results);
    }
  });
});

app.get("/data/:regionName/:provinciaName", async (req, res) => {
  if (!mysqlPool) {
    mysqlPool = await mysql.createPool(mysqlConfig);
  }
  const { regionName, provinciaName } = req.params;
  const query = `select * from provincia_data where region = '${regionName}' and provincia = '${provinciaName}';`;
  await mysqlPool.query(query, async (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(results);
    }
  });
});

app.get("/data/:regionName/:provinciaName/:distritoName", async (req, res) => {
  if (!mysqlPool) {
    mysqlPool = await mysql.createPool(mysqlConfig);
  }
  const { regionName, provinciaName, distritoName } = req.params;
  const query = `select * from distrito_data where region = '${regionName}' and provincia = '${provinciaName}' and distrito = '${distritoName}';`;
  await mysqlPool.query(query, async (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(results);
    }
  });
});

app.get("/values", async (req, res) => {
  if (!mysqlPool) {
    mysqlPool = await mysql.createPool(mysqlConfig);
  }
  const query = `select distinct region from region_data;`;
  await mysqlPool.query(query, async (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(results.map(({ region }) => region));
    }
  });
});

app.get("/values/:regionName", async (req, res) => {
  if (!mysqlPool) {
    mysqlPool = await mysql.createPool(mysqlConfig);
  }
  const { regionName } = req.params;
  const query = `select distinct provincia from provincia_data where region = '${regionName}';`;
  await mysqlPool.query(query, async (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(results.map(({ provincia }) => provincia));
    }
  });
});

app.get("/values/:regionName/:provinciaName", async (req, res) => {
  if (!mysqlPool) {
    mysqlPool = await mysql.createPool(mysqlConfig);
  }
  const { regionName, provinciaName } = req.params;
  const query = `select distinct distrito from distrito_data where region = '${regionName}' and provincia = '${provinciaName}';`;
  await mysqlPool.query(query, async (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(results.map(({ distrito }) => distrito));
    }
  });
});

module.exports = { app };
