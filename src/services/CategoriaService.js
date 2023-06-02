import { Categoria } from "../models/Categoria.js";

class CategoriaService {
    static async findAll() {
        try {
            const objs = await Categoria.findAll({ include: { all: true, nested: true } });
            return objs;
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
            throw error;
        }
    }

    static async findByPk(req) {
        try {
            const { id } = req.params;
            const obj = await Categoria.findByPk(id, { include: { all: true, nested: true } });
            return obj;
        } catch (error) {
            console.error("Erro ao buscar categoria por ID:", error);
            throw error;
        }
    }

    static async create(req) {
        try {
            const { nome, descricao, observacao, tipo } = req.body;
            if (tipo == null) throw 'O tipo da categoria deve ser informado!';
            const obj = await Categoria.create({ nome, descricao, observacao, tipoId: tipo.id });
            return await Categoria.findByPk(obj.id, { include: { all: true, nested: true } });
        } catch (error) {
            console.error("Erro ao criar categoria:", error);
            throw error;
        }
    }

    static async update(req) {
        try {
            const { id } = req.params;
            const { nome, descricao, observacao, tipo } = req.body;
            const obj = await Categoria.findByPk(id, { include: { all: true, nested: true } });
            if (obj == null) throw 'Categoria não encontrada';
            Object.assign(obj, { nome, descricao, observacao, tipoId: tipo.id });
            await obj.save();
            return await Categoria.findByPk(id, { include: { all: true, nested: true } });
        } catch (error) {
            console.error("Erro ao atualizar categoria:", error);
            throw error;
        }
    }

    static async delete(req) {
        try {
            const { id } = req.params;
            const obj = await Categoria.findByPk(id);
            if (obj == null) throw 'Categoria não encontrada';

            await obj.destroy();
            return obj;
        } catch (error) {
            if (error.name === "SequelizeForeignKeyConstraintError") {
                throw 'Não é possível excluir uma categoria que esteja em uso.';
            } else {
                console.error("Erro ao excluir categoria:", error);
                throw error;
            }
        }
    }
}

export { CategoriaService };
