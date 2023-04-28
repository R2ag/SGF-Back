import {ContaService} from "../services/ContaService.js";

class ContaController{

    static async findAll(req, res, next){
        ContaService.findAll()
            .then(objs => res.json(objs))
            .catch(next);
        
    }

    static async findByPk(req, res, next){
        ContaService.findByPk(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async create (req, res, next){
        ContaService.create(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async update(req, res, next){
        ContaService.update(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async delete(req, res, next){
        ContaService.delete(req)
            .then(obj => res.json(obj))
            .catch(next);

    }


}

export {ContaController};