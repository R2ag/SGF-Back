import express from "express";
import routes from './routes.js'

import databaseInserts from '../src/config/database-inserts.js';
databaseInserts();

const app = express();

app.use(express.json());
app.use(routes);

app.listen(3333);

