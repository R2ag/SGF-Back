class CategoriaDTO {
    constructor(nome, descricao, observacao, tipoId) {
        console.log(nome, descricao, observacao, tipoId);
        this.validateAndAssign({ nome, descricao, observacao, tipoId })
            .then(() => {
                console.log(this.nome, this.descricao, this.observacao, this.tipoId);
            })
            .catch(error => {
                console.error(`Erro de validação: ${error.message}`);
            });
    }

    async validateAndAssign(data) {
        const errors = [];

        if (!data.nome || typeof data.nome !== "string" || data.nome.length < 2 || data.nome.length > 30) {
            errors.push("O nome da categoria deve ser preenchido e ter entre 2 e 30 caracteres.");
        }

        if (data.descricao && (typeof data.descricao !== "string" || data.descricao.length > 50)) {
            errors.push("A descrição da categoria deve ter no máximo 50 caracteres.");
        }

        if (data.observacao && (typeof data.observacao !== "string" || data.observacao.length > 50)) {
            errors.push("A observação da categoria deve ter no máximo 50 caracteres.");
        }

        if (!data.tipoId || typeof data.tipoId !== "number" || !Number.isInteger(data.tipoId)) {
            errors.push("O tipo da categoria deve ser preenchido com um número inteiro.");
        }

        if (errors.length > 0) {
            throw new Error(`Erro de validação: ${errors.join(" ")}`);
        }

        this.nome = data.nome;
        this.descricao = data.descricao;
        this.observacao = data.observacao;
        this.tipoId = data.tipoId;
    }
}

export { CategoriaDTO };