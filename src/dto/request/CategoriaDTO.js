import * as yup from "yup";

const categoriaSchema = yup.object().shape({
    nome: yup.string().required("O nome da categoria deveser preenchido").min(2, "O nome da Categoria deve ter no minimo 2 caracteres.").max(30, "O nome da categoria deve ter no maximo 30 caracteres."),
    descricao: yup.string().max(50, "A descrição da categoria deve ter no máximo 50 caracteres."),
    observacao: yup.string().max(50, "A observação da categoria deve ter no máximo 50 caracteres."),
    tipoId: yup.number().integer().required(),
})

class  CategoriaDTO{
    constructor(nome, descricao, observacao, tipoId){
        categoriaSchema.validate({nome, descricao, observacao, tipoId})
            .then(validateData =>{
                this.nome = validateData.nome;
                this.descricao = validateData.descricao;
                this.observacao = validateData.observacao;
                this.tipoId = validateData.tipoId;
            })
            .catch(error => {
                throw new Error (`Erro de validação: ${error.message}`);
            });
    }
}

export { CategoriaDTO };