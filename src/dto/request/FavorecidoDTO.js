import * as yup from "yup";

const favorecidoSchema = yup.object().shape({
    nome: yup.string().required("O nome do favorecido deve ser preenchido.").min(2, "O nome do favorecido deve ter no minimo 2 caracteres").max(50, "O nome do favorecido deve ter no máximo 50 caracteres."),
    ramo: yup.string().required("O ramo do favorecido deve ser preenchido.").min(2, "O Ramo do favorecido deve ter no minimo 2 caracteres").max(20, "O ramo do favorecido deve ter no máximo 20 caracteres."),
    cpfOuCnpj: yup.string().optional().matches(/^(?:(\d{3})\.\d{3}\.\d{3}-\d{2}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})$/),
    email: yup.string().optional().email("Email invalido"),

})

class FavorecidoDTO{
    constructor(nome, ramo, cpfOuCnpj, email){
        favorecidoSchema.validate({nome, ramo, cpfOuCnpj, email})
            .then(validateData =>{
                this.nome = validateData.nome;
                this.ramo = validateData.ramo;
                this.cpfOuCnpj = validateData.cpfOuCnpj;
                this.email = validateData.email;
            })
            .catch(error =>{
                throw new Error (`Erro de validação: ${error.message}`);
            })
    }
}

export { FavorecidoDTO }