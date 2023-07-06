import * as yup from "yup";

const favorecidoSchema = yup.object().shape({
    nome: yup.string().required("O nome do favorecido deve ser preenchido.").min(2, "O nome do favorecido deve ter no minimo 2 caracteres").max(50, "O nome do favorecido deve ter no máximo 50 caracteres."),
    ramo: yup.string().required("O ramo do favorecido deve ser preenchido.").min(2, "O Ramo do favorecido deve ter no minimo 2 caracteres").max(20, "O ramo do favorecido deve ter no máximo 20 caracteres."),
    cpfOuCnpj: yup.string().matches(/^(?:(\d{3})\.\d{3}\.\d{3}-\d{2}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})?$/),
    email: yup.string().email("Email invalido"),

})

class FavorecidoDTO{
    constructor(nome, ramo, cpfOuCnpj, email, next){
        this.nome = nome;
        this.ramo = ramo;
        this.cpfOuCnpj = cpfOuCnpj;
        this.email = email

        this.isValid = this.validateData(next);
    }

    validateData(next){
        try{
            favorecidoSchema.validateSync({
                nome: this.nome,
                ramo: this.ramo,
                cpfOuCnpj: this.cpfOuCnpj,
                email: this.email
            });
            return true;
        }catch(error){
            next(error);
            return false;
        }
    }
}

export { FavorecidoDTO }