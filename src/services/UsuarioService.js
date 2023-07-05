import { Usuario } from "../models/Usuario.js";

class UsuarioService {
	static async findAll() {
        try {
            const objs = await Usuario.findAll();
            return objs;
        } catch (error) {
            console.error("Erro ao buscar todos os usuários:", error);
            throw error;
        }
    }
	
	static async findByPk(req) {
		try {
			const { id } = req.params;
			const obj = await Usuario.findByPk(id, { include: { all: true, nested: true } });
			return obj;
		} catch (error) {
			console.error("Erro ao buscar usuário por ID:", error);
			throw error;
		}
	}

	static async create(usuarioDTO) {
		try {
			const { usuario, senha, nome, cpf, email } = usuarioDTO;
			const obj = await Usuario.create({ usuario, senha, nome, cpf, email });
			return await Usuario.findByPk(obj.id, { include: { all: true, nested: true } });
		} catch (error) {
			console.error("Erro ao criar usuário:", error);
			throw error;
		}
	}

	static async update(id, usuarioDTO) {
		try {
			const { usuario, senha, nome, cpf, email } = usuarioDTO;
			const obj = await Usuario.findByPk(id);
			if (obj == null) throw 'Usuário não encontrado';
			Object.assign(obj, { usuario, senha, nome, cpf, email });
			return await obj.save();
		} catch (error) {
			console.error("Erro ao atualizar usuário:", error);
			throw error;
		}
	}

	static async delete(req) {
		try {
			const { id } = req.params;
			const obj = await Usuario.findByPk(id);
			if (obj == null) throw 'Usuário não encontrado';

			await obj.destroy();
			return obj;
		} catch (error) {
			if (error.name === "SequelizeForeignKeyConstraintError") {
				throw 'Não é possível remover um usuário que esteja em uso.';
			}
			console.error("Erro ao excluir usuário:", error);
			throw error;
		}
	}
}

export { UsuarioService };