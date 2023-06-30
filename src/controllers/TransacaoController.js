import { TransacaoService } from "../services/TransacaoService.js";
import { TransacaoDTO } from "../dto/request/TransacaoDTO.js";

class TransacaoController {
    static async findAll(req, res, next) {
        TransacaoService.findAll()
            .then(objs => res.json(objs))
            .catch(next)
    }

    static async findByPk(req, res, next) {
        const { id } = req.params;
        TransacaoService.findByPk(id)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async create(req, res, next) {
        try {
            const { data, descricao, valor, contaId, favorecidoId, categoriaId, tipoId } = req.body;
            const transacaoDTO = new TransacaoDTO(data, descricao, valor, contaId, favorecidoId, categoriaId, tipoId, next);
            if (transacaoDTO.isValid) {
                const createdTransacao = await TransacaoService.create(transacaoDTO);
                res.status(201).json(createdTransacao);
            }
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const {id} = req.params;
            const { data, descricao, valor, contaId, favorecidoId, categoriaId, tipoId } = req.body;
            const transacaoDTO = new TransacaoDTO(data, descricao, valor, contaId, favorecidoId, categoriaId, tipoId, next);
            if (transacaoDTO.isValid) {
                const updatedTransacao = await TransacaoService.update(id, transacaoDTO);
                res.status(200).json(updatedTransacao);
            }
        } catch (error) {
            next(error);
        }
        
    }

    static async delete(req, res, next) {
        const { id } = req.params;
        TransacaoService.delete(id)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async fyndByCategoriaEPeriodo(req, res, next) {
        const { idCategoria, dataInicial, dataFinal } = req.params;
        TransacaoService.fyndByCategoriaEPeriodo(idCategoria, dataInicial, dataFinal)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async fyndByContaEPeriodo(req, res, next) {

        const { idConta, dataInicial, dataFinal } = req.params;
        TransacaoService.fyndByContaEPeriodo(idConta, dataInicial, dataFinal)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async fyndByFavorecidoEPeriodo(req, res, next) {
        const { idFavorecido, dataInicial, dataFinal } = req.params;
        TransacaoService.fyndByFavorecidoEPeriodo(idFavorecido, dataInicial, dataFinal)
            .then(obj => res.json(obj))
            .catch(next);
    }

    static async listByCategoriaEPeriodo(req, res, next) {
        const { dataInicial, dataFinal } = req.params;
        TransacaoService.listByCategoriaEPeriodo(dataInicial, dataFinal)
            .then(obj => res.json(obj))
            .catch(next);
    }
}

export { TransacaoController }