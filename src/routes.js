import express from "express";

import {FavorecidoController} from './controllers/FavorecidoController.js';
import {CategoriaController} from './controllers/CategoriaController.js';
import {ContaController} from './controllers/ContaController.js';
import { TipoController } from "./controllers/TipoController.js";
import { UsuarioController} from "./controllers/UsuarioController.js"

const routes = express.Router();

//Categoria
routes.get('/categorias', CategoriaController.findAll);
routes.get('/categorias/:id', CategoriaController.findByPk);
routes.post('/categorias', CategoriaController.create);
routes.put('/categorias/:id', CategoriaController.update);
routes.delete('/categorias/:id', CategoriaController.delete);

//Conta
routes.get('/contas', ContaController.findAll);
routes.get('/contas/:id', ContaController.findByPk);
routes.post('/contas', ContaController.create);
routes.put('/contas/:id', ContaController.update);
routes.delete('/contas:id', ContaController.delete);

//Favorecido
routes.get('/favorecidos', FavorecidoController.findAll);
routes.get('/favorecidos/:id', FavorecidoController.findByPk);
routes.post('/favorecidos', FavorecidoController.create);
routes.put('/favorecidos/:id', FavorecidoController.update);
routes.delete('/favortecidos/:id', FavorecidoController.delete);

//Tipo
routes.get('/tipos', TipoController.findAll);

//Usuário
routes.get('/usuarios/:id', UsuarioController.findByPk);
routes.post('/usuarios', UsuarioController.create);
routes.put('/usuarios/:id', UsuarioController.update);
routes.delete('/usuarios:id', UsuarioController.delete);



export default routes;