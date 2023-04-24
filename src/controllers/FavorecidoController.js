import {FavovecidoService} from "../services/FavorecidoService.js";

class FavorecidoController{

    static async findAll(req, res, next){
        FavovecidoService.findAll()
            .then(objs => res.json(objs))
            .catch(next);
        
    }

    static async findByPk(req, res){
        FavovecidoService.findByPk(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async create (req, res){
        FavovecidoService.create(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async update(req, res){
        FavovecidoService.update(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async delete(req, res, next){
        FavovecidoService.delete(req)
            .then(obj => res.json(obj))
            .catch(next);

    }


}

export {FavorecidoController};