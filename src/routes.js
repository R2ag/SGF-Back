import express from "express";

import { FavorecidoController } from "./controllers/FavorecidoController.js";
import { CategoriaController } from "./controllers/CategoriaController.js";
import { ContaController } from "./controllers/ContaController.js";
import { TipoController } from "./controllers/TipoController.js";
import { UsuarioController } from "./controllers/UsuarioController.js";
import { TransacaoController } from "./controllers/TransacaoController.js";
import { OrcamentoController } from "./controllers/OrcamentoController.js";


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
routes.delete('/contas/:id', ContaController.delete);

//Favorecido
routes.get('/favorecidos', FavorecidoController.findAll);
routes.get('/favorecidos/:id', FavorecidoController.findByPk);
routes.post('/favorecidos', FavorecidoController.create);
routes.put('/favorecidos/:id', FavorecidoController.update);
routes.delete('/favorecidos/:id', FavorecidoController.delete);

//Tipo
routes.get('/tipos', TipoController.findAll);

//Usuário
routes.get('/usuarios/', UsuarioController.findAll);
routes.get('/usuarios/:id', UsuarioController.findByPk);
routes.post('/usuarios', UsuarioController.create);
routes.put('/usuarios/:id', UsuarioController.update);
routes.delete('/usuarios/:id', UsuarioController.delete);

//Transação
routes.get('/transacoes', TransacaoController.findAll);
routes.get('/transacoes/:id', TransacaoController.findByPk);
routes.post('/transacoes', TransacaoController.create);
routes.put('/transacoes/:id', TransacaoController.update);
routes.delete('/transacoes/:id', TransacaoController.delete);
routes.get('/transacoes/fyndByCategoriaEPeriodo/:idCategoria/:dataInicial/:dataFinal', TransacaoController.fyndByCategoriaEPeriodo);
routes.get('/transacoes/fyndByContaEPeriodo/:idConta/:dataInicial/:dataFinal', TransacaoController.fyndByContaEPeriodo);
routes.get('/transacoes/fyndByFavorecidoEPeriodo/:idFavorecido/:dataInicial/:dataFinal', TransacaoController.fyndByFavorecidoEPeriodo);
routes.get('/transacoes/listByCategoriaEPeriodo/:dataInicial/:dataFinal', TransacaoController.listByCategoriaEPeriodo);

//Orcamento
routes.get('/orcamentos', OrcamentoController.findAll);
routes.get('/orcamentos/:id', OrcamentoController.findByPk);
routes.get('/orcamentos/findByUsuario/:usuarioId', OrcamentoController.findByUsuario);
routes.post('/orcamentos', OrcamentoController.create);
routes.put('/orcamentos/:id', OrcamentoController.update);
routes.delete('/orcamentos/:id', OrcamentoController.delete);
routes.get('/orcamentos/findGraficoOfDivisaoDoTotalOrcadoByOrcamento/:usuarioId/:dataInicio/:dataFinal',OrcamentoController.findGraficoOfDivisaoDoTotalOrcadoByOrcamento);
routes.get('/orcamentos/findGraficoOfValoresOrcadosETransacionadosByOrcamento/:id',OrcamentoController.findGraficoOfValoresOrcadosETransacionadosByOrcamento);

export default routes;