import { CategoriaService } from "../services/CategoriaService.js";
import { CategoriaDTO } from "../dto/request/CategoriaDTO.js";

class CategoriaController {

    static async findAll(req, res, next) {
        CategoriaService.findAll()
            .then(objs => res.json(objs))
            .catch(next);

    }

    static async findByPk(req, res, next) {
        CategoriaService.findByPk(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async create(req, res, next) {
        try {
            const { nome, descricao, observacao, tipoId } = req.body;
            const categoriaDTO = new CategoriaDTO(nome, descricao, observacao, tipoId);
            console.log(categoriaDTO);
            const createdCategoria = await CategoriaService.create(categoriaDTO);
            res.json(createdCategoria);
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const categoriaDTO = new CategoriaDTO(req.body.nome, req.body.descricao, req.body.observacao, req.body.tipoId);
            const updatedCategoria = await CategoriaService.update(req, categoriaDTO);
            res.json(updatedCategoria);
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        CategoriaService.delete(req)
            .then(obj => res.json(obj))
            .catch(next);

    }


}

export { CategoriaController };