import {CategoriaService} from "../services/CategoriaService.js";

class CategoriaController{

    static async findAll(req, res, next){
        CategoriaService.findAll()
            .then(objs => res.json(objs))
            .catch(next);
        
    }

    static async findByPk(req, res, next){
        CategoriaService.findByPk(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async create (req, res, next){
        CategoriaService.create(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async update(req, res, next){
        CategoriaService.update(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async delete(req, res, next){
        CategoriaService.delete(req)
            .then(obj => res.json(obj))
            .catch(next);

    }


}

export {CategoriaController};