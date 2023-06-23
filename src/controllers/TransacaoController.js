import { TransacaoService } from "../services/TransacaoService.js";


class TransacaoController{
    static async findAll(req, res, next){
        TransacaoService.findAll()
            .then(objs => res.json(objs))
            .catch(next)
    }

    static async findByPk(req, res, next){
        TransacaoService.findByPk(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async create(req, res, next){
        TransacaoService.create(req)
            .then(obj => res.status(201).json(obj))
            .catch(next);
    }

    static async update(req, res, next){
        TransacaoService.update(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async delete(req, res, next){
        TransacaoService.delete(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async fyndByCategoriaEPeriodo(req, res, next){
        TransacaoService.fyndByCategoriaEPeriodo(req)
            .then(obj =>res.json(obj))
            .catch(next);
    }

    static async fyndByContaEPeriodo(req, res, next){
        TransacaoService.fyndByContaEPeriodo(req)
            .then(obj =>res.json(obj))
            .catch(next);
    }

    static async fyndByFavorecidoEPeriodo(req, res, next){
        TransacaoService.fyndByFavorecidoEPeriodo(req)
            .then(obj =>res.json(obj))
            .catch(next);
    }

    static async listByCategoriaEPeriodo(req, res, next){
        TransacaoService.listByCategoriaEPeriodo(req)
            .then(obj =>res.json(obj))
            .catch(next);
    }
}

export {TransacaoController}