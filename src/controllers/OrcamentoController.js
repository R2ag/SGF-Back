import { OrcamentoService } from "../services/OrcamentoService.js";
import { OrcamentoDTO } from '../dto/request/OrcamentoDTO.js';

class OrcamentoController {
    static async findAll(req, res, next) {
        try {
            const objs = await OrcamentoService.findAll();
            res.json(objs);
        } catch (error) {
            next(error);
        }
    }

    static async findByPk(req, res, next) {
        try {
            const { id } = req.params;
            const obj = await OrcamentoService.findByPk(id);
            res.json(obj);
        } catch (error) {
            next(error);
        }
    }

    static async findByUsuario(req, res, next) {
        try {
            const { usuarioId } = req.params;
            const objs = await OrcamentoService.findByUsuario(usuarioId);
            res.json(objs);
        } catch (error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        try {
            const { dataInicio, dataFinal, valorTotal, usuarioId, orcamentosCategorias } = req.body;
            const orcamentoDTO = new OrcamentoDTO(dataInicio, dataFinal, valorTotal, usuarioId, orcamentosCategorias, next)
            if (orcamentoDTO.isValid) {
                const createdOrcamento = await OrcamentoService.create(orcamentoDTO);
                res.status(201).json(createdOrcamento);
            }
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const { id } = req.params;
            const { dataInicio, dataFinal, valorTotal, usuarioId, orcamentosCategorias } = req.body;
            const orcamentoDTO = new OrcamentoDTO(dataInicio, dataFinal, valorTotal, usuarioId, orcamentosCategorias, next)
            if (orcamentoDTO.isValid) {
                const obj = await OrcamentoService.update(id, orcamentoDTO);
                res.status(200).json(obj);
            }

        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            const obj = await OrcamentoService.delete(id);
            res.json(obj);
        } catch (error) {
            next(error);
        }
    }

    static async findGraficoOfDivisaoDoTotalOrcadoByOrcamento(req, res, next) {
        const { id } = req.params;
        OrcamentoService.findGraficoOfDivisaoDoTotalOrcadoByOrcamento(id)
            .then(objs => res.json(objs))
            .catch(next);
    }

    static async findGraficoOfValoresOrcadosETransacionadosByOrcamento(req, res, next) {
        const { usuarioId, dataInicio, dataFinal } = req.params;
        OrcamentoService.findGraficoOfValoresOrcadosETransacionadosByOrcamento(usuarioId, dataInicio, dataFinal)
            .then(objs => res.json(objs))
            .catch(next);
    }
}

export { OrcamentoController };