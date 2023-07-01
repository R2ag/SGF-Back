import * as yup from 'yup';

const categoriaSchema = yup.object().shape({
    nome: yup.string().required("O nome da categoria deve ser preenchido!").min(2, "O nome da categoria deve ter no mínimo 2 caracteres").max(30, "O nome da categoria deve ter no máximo 30 caracteres"),
    descricao: yup.string().max(50, "A descrição deve ter no máximo 50 caracteres."),
    observacao: yup.string().max(50, "A observação deve ter no máximo 50 caracteres."),
    tipoId: yup.number().integer().required()
});

class CategoriaDTO {
    constructor(nome, descricao, observacao, tipoId, next) {
        this.nome = nome;
        this.descricao = descricao;
        this.observacao = observacao;
        this.tipoId = tipoId;

        this.isValid = this.validateData(next);
    }

    validateData(next) {
        try {
            categoriaSchema.validateSync({
                nome: this.nome,
                descricao: this.descricao,
                observacao: this.observacao,
                tipoId: this.tipoId
            });
            return true;
        } catch (error) {
            next(error);
            return false;
        }
    }
}

export { CategoriaDTO };