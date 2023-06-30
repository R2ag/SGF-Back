import { Favorecido } from "../models/Favorecido.js";

class FavorecidoService {
    static async findAll() {
        try {
            const objs = await Favorecido.findAll({ include: { all: true, nested: true } });
            return objs;
        } catch (error) {
            console.error("Erro ao buscar favorecidos:", error);
            throw error;
        }
    }

    static async findByPk(id) {
        try {
            const obj = await Favorecido.findByPk(id, { include: { all: true, nested: true } });
            return obj;
        } catch (error) {
            console.error("Erro ao buscar favorecido por ID:", error);
            throw error;
        }
    }

    static async create(favorecidoDTO) {
        try {
            const { nome, ramo, cpfOuCnpj, email } = favorecidoDTO;
            const obj = await Favorecido.create({ nome, ramo, cpfOuCnpj, email });
            return await Favorecido.findByPk(obj.id, { include: { all: true, nested: true } });
        } catch (error) {
            console.error("Erro ao criar favorecido:", error);
            throw error;
        }
    }

    static async update(id, favorecidoDTO) {
        try {
            const { nome, ramo, cpfOuCnpj, email } = favorecidoDTO;
            const obj = await Favorecido.findByPk(id);
            if (obj == null) throw 'Favorecido não encontrado';
            Object.assign(obj, { nome, ramo, cpfOuCnpj, email });
            return await obj.save();
        } catch (error) {
            console.error("Erro ao atualizar favorecido:", error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            const obj = await Favorecido.findByPk(id);
            if (obj == null) throw 'Favorecido não encontrado';

            await obj.destroy();
            return obj;
        } catch (error) {
            if (error.name === "SequelizeForeignKeyConstraintError") {
                throw 'Não é possível remover um favorecido que tenha participação em transações.';
            }
            console.error("Erro ao excluir favorecido:", error);
            throw error;
        }
    }
}

export { FavorecidoService };