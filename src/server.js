import express from "express";

import databaseInserts from '../src/config/database-inserts.js';
databaseInserts();

const app = express();

app.listen(3333);

