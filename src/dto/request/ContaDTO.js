import * as yup from 'yup';

const contaSchema = yup.object().shape({
    nome: yup.string().required("A conta deve possuir um nome.").min(2, "O nome da conta deve ter no mínimo 2 caracteres").max(30, "O nome da conta deve ter no máximo 30 caracteres"),
    tipo: yup.string().min(2, "O tipo deve ter no mínimo 2 caracteres").max(20, "O tipo deve ter no máximo 20 caracteres."),
    descricao: yup.string().max(50, "A descrição deve ter no máximo 50 caracteres."),
    saldo: yup.number(),
    usuarioId: yup.number().integer().required(),
});

class ContaDTO {
    constructor(nome, tipo, descricao, saldo, usuarioId, next) {
        this.nome = nome;
        this.tipo = tipo;
        this.descricao = descricao;
        this.saldo = saldo;
        this.usuarioId = usuarioId;
        this.isValid = this.validateData(next);
        
    }

    validateData(next) {
        try {
            contaSchema.validateSync({
                nome: this.nome,
                tipo: this.tipo,
                descricao: this.descricao,
                saldo: this.saldo,
                usuarioId: this.usuarioId
            });
            return true;
        } catch (error) {
            next(error);
            return false;
        }
    }
}

export { ContaDTO };