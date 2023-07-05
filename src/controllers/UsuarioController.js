import { UsuarioDTO } from "../dto/request/UsuarioDTO.js";
import { UsuarioService } from "../services/UsuarioService.js";

class UsuarioController {


    static async findAll(req, res, next) {
        UsuarioService.findAll()
            .then(objs => res.json(objs))
            .catch(next)
    }

    static async findByPk(req, res, next) {
        UsuarioService.findByPk(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async create(req, res, next) {
        try {
            const { nome, cpf, email, usuario, senha } = req.body;
            const usuarioDTO = new UsuarioDTO(nome, cpf, email, usuario, senha, next);

            if (usuarioDTO.isValid) {
                const createdUsuario = await UsuarioService.create(usuarioDTO);
                res.status(201).json(createdUsuario);
            }

        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const {id} = req.params;
            const { nome, cpf, email, usuario, senha } = req.body;
            const usuarioDTO = new UsuarioDTO(nome, cpf, email, usuario, senha, next);

            if(usuarioDTO.isValid){
                const updatedUsuario = await UsuarioService.update(id, usuarioDTO);
                res.status(200).json(updatedUsuario);
            }
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        UsuarioService.delete(req)
            .then(obj => res.json(obj))
            .catch(next);

    }


}

export { UsuarioController };