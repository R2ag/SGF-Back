import * as yup from "yup";

const userSchema = yup.object().shape({
    nome: yup.string().required().min(2).max(50),
    cpf: yup.string().required().matches(/^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/),
    email: yup.string().email().required(),
    usuario: yup.string().required(),
    senha: yup.string().required(),
});

class UsuarioDTO {
    constructor(nome, cpf, email, usuario, senha, next) {
        this.nome = nome;
        this.cpf = cpf;
        this.email = email;
        this.usuario = usuario;
        this.senha = senha;

        this.isValid = this.validateData(next);
    }

    validateData(next){
        try {
            userSchema.validateSync({
                nome: this.nome,
                cpf: this.cpf,
                email: this.email,
                usuario: this.usuario,
                senha: this.senha
            });
            return true;
        } catch (error) {
            next(error);
            return false;
        }
    }

}

export { UsuarioDTO };