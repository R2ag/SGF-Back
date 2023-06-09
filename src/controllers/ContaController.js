import { ContaDTO } from "../dto/request/ContaDTO.js";
import { ContaService } from "../services/ContaService.js";

class ContaController {

    static async findAll(req, res, next) {
        ContaService.findAll()
            .then(objs => res.json(objs))
            .catch(next);

    }

    static async findByPk(req, res, next) {
        const { id } = req.params;
        ContaService.findByPk(id)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async create(req, res, next) {
        try {
            const { nome, tipo, descricao, saldo, usuarioId } = req.body;
            const contaDTO = new ContaDTO(nome, tipo, descricao, saldo, usuarioId, next);
            if (contaDTO.isValid) {
                const createdConta = await ContaService.create(contaDTO);
                res.status(201).json(createdConta);
            }

        } catch (error) {
            next(error);
        }

    }

    static async update(req, res, next) {
        try {
            const { id } = req.params;
            const { nome, tipo, descricao, saldo, usuarioId } = req.body;
            const contaDTO = new ContaDTO(nome, tipo, descricao, saldo, usuarioId, next);
            if (contaDTO.isValid) {
                const updatedConta = await ContaService.update(id, contaDTO);
                res.status(200).json(updatedConta);
            }

        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        const { id } = req.params;
        ContaService.delete(id)
            .then(obj => res.json(obj))
            .catch(next);

    }


}

export { ContaController };