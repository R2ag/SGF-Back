import {UsuarioService} from "../services/UsuarioService.js";

class UsuarioController{

    static async findByPk(req, res){
        UsuarioService.findByPk(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async create (req, res){
        UsuarioService.create(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async update(req, res){
        UsuarioService.update(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async delete(req, res, next){
        UsuarioService.delete(req)
            .then(obj => res.json(obj))
            .catch(next);

    }


}

export {UsuarioController};