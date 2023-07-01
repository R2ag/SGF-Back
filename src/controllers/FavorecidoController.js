import { FavorecidoService } from "../services/FavorecidoService.js";
import { FavorecidoDTO } from "../dto/request/FavorecidoDTO.js";

class FavorecidoController {

    static async findAll(req, res, next) {
        FavorecidoService.findAll()
            .then(objs => res.json(objs))
            .catch(next);

    }

    static async findByPk(req, res, next) {
        const { id } = req.params;
        FavorecidoService.findByPk(id)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async create(req, res, next) {
        try {
            const { nome, ramo, cpfOuCnpj, email } = req.body;
            const favorecidoDTO = new FavorecidoDTO(nome, ramo, cpfOuCnpj, email, next);
            if (favorecidoDTO.isValid) {
                const createdFavorecido = await FavorecidoService.create(favorecidoDTO);
                res.status(201).json(createdFavorecido);
            }
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const { id } = req.params;
            const { nome, ramo, cpfOuCnpj, email } = req.body;
            const favorecidoDTO = new FavorecidoDTO(nome, ramo, cpfOuCnpj, email, next);
            if (favorecidoDTO.isValid) {
                const updatedFavorecido = await FavorecidoService.update(id, favorecidoDTO);
                res.status(200).json(updatedFavorecido);
            }
        } catch (error) {
            next(error);
        }

    }

    static async delete(req, res, next) {
        const { id } = req.params;
        FavorecidoService.delete(id)
            .then(obj => res.json(obj))
            .catch(next);

    }


}

export { FavorecidoController };