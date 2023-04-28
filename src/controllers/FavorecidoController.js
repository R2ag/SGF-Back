import {FavorecidoService} from "../services/FavorecidoService.js";

class FavorecidoController{

    static async findAll(req, res, next){
        FavorecidoService.findAll()
            .then(objs => res.json(objs))
            .catch(next);
        
    }

    static async findByPk(req, res, next){
        FavorecidoService.findByPk(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async create (req, res, next){
        FavorecidoService.create(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async update(req, res, next){
        FavorecidoService.update(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async delete(req, res, next){
        FavorecidoService.delete(req)
            .then(obj => res.json(obj))
            .catch(next);

    }


}

export {FavorecidoController};