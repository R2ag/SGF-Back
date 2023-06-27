import { TransacaoService } from "../services/TransacaoService.js";
import { TransacaoDTO } from "../dto/request/TransacaoDTO.js";

class TransacaoController {
    static async findAll(req, res, next) {
        TransacaoService.findAll()
            .then(objs => res.json(objs))
            .catch(next)
    }

    static async findByPk(req, res, next) {
        TransacaoService.findByPk(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async create(req, res, next) {
        try {
            const { data, descricao, valor, contaId, favorecidoId, categoriaId } = req.body;
            const transacaoDTO = new TransacaoDTO(data, descricao, valor, contaId, favorecidoId, categoriaId, next);
            if (transacaoDTO.isValid) {
                const createdTransacao = TransacaoService.create(transacaoDTO);
                res.status(201).json(createdTransacao);
            }
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const { data, descricao, valor, contaId, favorecidoId, categoriaId } = req.body;
            const transacaoDTO = new TransacaoDTO(data, descricao, valor, contaId, favorecidoId, categoriaId, next);
            if (transacaoDTO.isValid) {
                const updatedTransacao = TransacaoService.update(req, transacaoDTO);
                res.status(200).json(updatedTransacao);
            }
        } catch (error) {
            next(error);
        }
        
    }

    static async delete(req, res, next) {
        TransacaoService.delete(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async fyndByCategoriaEPeriodo(req, res, next) {
        TransacaoService.fyndByCategoriaEPeriodo(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async fyndByContaEPeriodo(req, res, next) {
        TransacaoService.fyndByContaEPeriodo(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async fyndByFavirecidoEPeriodo(req, res, next) {
        TransacaoService.fyndByFavirecidoEPeriodo(req)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async listByCategoriaEPeriodo(req, res, next) {
        TransacaoService.listByCategoriaEPeriodo(req)
            .then(obj => res.json(obj))
            .catch(next);
    }
}

export { TransacaoController }