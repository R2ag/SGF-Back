import {FavorecidoService} from "../services/FavorecidoService.js";

class FavorecidoController{

    static async findAll(req, res, next){
        FavorecidoService.findAll()
            .then(objs => res.json(objs))
            .catch(next);
        
    }

    static async findByPk(req, res){
        FavorecidoService.findByPk(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async create (req, res){
        FavorecidoService.create(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async update(req, res){
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