import {UsuarioService} from "../services/UsuarioService.js";

class UsuarioController{


    //A classe Usuário não tem a função findAll implementada por conta das regras de negocio.

    static async findByPk(req, res, next){
        UsuarioService.findByPk(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async create (req, res, next){
        UsuarioService.create(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async update(req, res, next){
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