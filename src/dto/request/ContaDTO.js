import *  as yup from 'yup';

const contaSchema = yup.object().shape({
    nome: yup.string().required("A conta deve possuir um nome.").min(2, "O nome da conta deve ter no minimo 2 caracteres").max(30,"O nome da conta deve ter no maximo 30 caracteres"),
    tipo: yup.string().min(2, "O tipo deve ter no  minimo 2 caracteres").max(20, "O tipo deve ter no maximo 20 caracteres."),
    descricao: yup.string().max(50, "A descrição deve ter no maximo 50 caracteres."),
    saldo: yup.number(),
    usuarioId: yup.number().integer().required(),
});

class ContaDTO{
    constructor(nome, tipo, descricao, saldo, usuarioId){
        contaSchema.validate({nome, tipo,descricao,saldo, usuarioId})
            .then(validateData => {
                this.nome = validateData.nome;
                this.tipo = validateData.tipo;
                this.descricao = validateData.descricao;
                this.saldo = validateData.saldo;
                this.usuarioId = validateData.usuarioId;
            })
            .catch(error => {
                throw new Error(`Erro de validação: ${error.message}`);
            });
    }
}

export { ContaDTO };