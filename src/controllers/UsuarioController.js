import {UsuárioService} from "../services/UsuarioService.js";

class UsuarioController{

    static async findByPk(req, res){
        UsuárioService.findByPk(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async create (req, res){
        UsuárioService.create(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async update(req, res){
        UsuárioService.update(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async delete(req, res, next){
        UsuárioService.delete(req)
            .then(obj => res.json(obj))
            .catch(next);

    }


}

export {UsuarioController};