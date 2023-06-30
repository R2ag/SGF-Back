import * as yup from 'yup';

const orcamentoCategoriaSchema = yup.object().shape({
    descricao: yup.string().required("A descrição deve ser preenchida.").min(2, "A descrição deve ter no mínimo 2 caracteres.").max(50, "A descrição deve ter no máximo 50 caracteres."),
    valor: yup.number().required("O valor deve ser preenchido.").typeError("O valor deve ser preenchido com um valor decimal.").positive("O valor deve ser um número positivo."),
    categoriaId: yup.number().integer().required()
  });

const orcamentoSchema = yup.object().shape({
    dataInicio: yup.date().required("A data de início deve ser preenchida.").typeError("A data deve ser preenchida no formato correto."),
    dataFinal: yup.date().required("A data final deve ser preenchida.").typeError("A data deve ser preenchida no formato correto."),
    valorTotal: yup.number().positive("Deve ser preenchido com um valor positivo").required("O valor total deve ser preenchido.").typeError("O valor deve ser preenchido com um valor decimal."),
    usuarioId: yup.number().integer().required(),
    orcamentosCategorias: yup.array().of(orcamentoCategoriaSchema).required("A lista de categorias do orçamento deve ser preenchida.")
});

class OrcamentoDTO {
    constructor(dataInicio, dataFinal, valorTotal, usuarioId, orcamentosCategorias, next) {

        console.log(dataInicio, dataFinal, valorTotal, usuarioId, orcamentosCategorias );
        this.dataInicio = dataInicio;
        this.dataFinal = dataFinal;
        this.valorTotal = valorTotal;
        this.usuarioId = usuarioId;
        this.orcamentosCategorias = orcamentosCategorias;

        this.isValid = this.validateData(next);
    }

    validateData(next) {
        try {
            orcamentoSchema.validateSync({
                dataInicio: this.dataInicio,
                dataFinal: this.dataFinal,
                valorTotal: this.valorTotal,
                usuarioId: this.usuarioId,
                orcamentosCategorias: this.orcamentosCategorias
            },{ abortEarly: false });

            return true;
        } catch (error) {
            next(error);
            return false;
        }
    }
}

export { OrcamentoDTO };
