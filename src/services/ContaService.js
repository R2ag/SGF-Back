import { Conta } from "../models/Conta.js";

class ContaService {
    static async findAll() {
        try {
            const objs = await Conta.findAll({ include: { all: true, nested: true } });
            return objs;
        } catch (error) {
            console.error("Erro ao buscar contas:", error);
            throw error;
        }
    }

    static async findByPk(req) {
        try {
            const { id } = req.params;
            const obj = await Conta.findByPk(id, { include: { all: true, nested: true } });
            return obj;
        } catch (error) {
            console.error("Erro ao buscar conta por ID:", error);
            throw error;
        }
    }

    static async create(contaDTO) {
        try {
            const { nome, tipo, descricao, saldo, usuarioId } = contaDTO;
            const obj = await Conta.create({ nome, tipo, descricao, saldo, usuarioId});
            return await Conta.findByPk(obj.id, { include: { all: true, nested: true } });
        } catch (error) {
            console.error("Erro ao criar conta:", error);
            throw error;
        }
    }

    static async update(req, contaDTO) {
        try {
            const { id } = req.params;
            const { nome, tipo, descricao, saldo, usuarioId } = contaDTO;
            const obj = await Conta.findByPk(id);
            if (obj == null) throw 'Conta não encontrada';
            Object.assign(obj, { nome, tipo, descricao, saldo, usuarioId});
            await obj.save();
            return obj;
        } catch (error) {
            console.error("Erro ao atualizar conta:", error);
            throw error;
        }
    }

    static async delete(req) {
        try {
            const { id } = req.params;
            const obj = await Conta.findByPk(id);
            if (obj == null) throw 'Conta não encontrada';

            await obj.destroy();
            return obj;
        } catch (error) {
            if (error.name === "SequelizeForeignKeyConstraintError") {
                throw 'Não é possível excluir uma conta que esteja em uso.';
            }
            console.error("Erro ao excluir conta:", error);
            throw error;
        }
    }

    static async atualizarSaldo(idConta, valorTransacao, transaction) {
        try {
            const selectedConta = await Conta.findByPk(idConta);
            if (selectedConta == null) throw 'Conta não encontrada';

            await selectedConta.increment('saldo', { by: valorTransacao, transaction });
            
            return selectedConta;
        } catch (error) {
            console.error("Erro ao atualizar saldo da conta:", error);
            throw error;
        }
    }
}

export { ContaService };