import * as yup from "yup";

const userSchema = yup.object().shape({
    nome: yup.string().required().min(2).max(50),
    cpf: yup.string().required().matches(/^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/),
    email: yup.string().email().required(),
    usuario: yup.string().required(),
    senha: yup.string().required(),
});

class UsuarioDTO {
    constructor(nome, cpf, email, usuario, senha) {
        userSchema.validate({ nome, cpf, email, usuario, senha })
            .then(validatedData => {
                this.nome = validatedData.nome;
                this.cpf = validatedData.cpf;
                this.email = validatedData.email;
                this.usuario = validatedData.usuario;
                this.senha = validatedData.senha;
            })
            .catch(error => {
                throw new Error(`Erro de validação: ${error.message}`);
            });
    }

}

export { UsuarioDTO };