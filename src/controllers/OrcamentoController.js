import { OrcamentoService } from "../services/OrcamentoService.js";

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
      const obj = await OrcamentoService.findByPk(req);
      res.json(obj);
    } catch (error) {
      next(error);
    }
  }

  static async findByUsuario(req, res, next) {
    try {
      const objs = await OrcamentoService.findByUsuario(req);
      res.json(objs);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const obj = await OrcamentoService.create(req);
      res.json(obj);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const obj = await OrcamentoService.update(req);
      res.json(obj);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const obj = await OrcamentoService.delete(req);
      res.json(obj);
    } catch (error) {
      next(error);
    }
  }
}

export { OrcamentoController };