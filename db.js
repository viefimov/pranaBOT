const { Client } = require("pg");
function connectClient() {
  const client = new Client({
    user: "pranadb_correctto",
    host: "yps.h.filess.io",
    database: "pranadb_correctto",
    password: "567599d7000dd31fd490a05393f5ff5dc0a4c183",
    port: 5432,
  });
  client.connect();
  return client;
}
module.exports = { connectClient }; //exporting the client for use in other files.
