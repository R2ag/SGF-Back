/**Incluir a lista de OrçametoCategorias */

import * as yup from 'yup';

const orcamentoSchema = yup.object().shape({
    dataInicio: yup.date().required("A data de início deve ser preenchida.").typeError("A data deve ser preenchida no formato correto."),
    dataFinal: yup.date().required("A data final deve ser preenchida.").typeError("A data deve ser preenchida no formato correto."),
    valorTotal: yup.number().positive("Deve ser preenchido com um valor positivo").required("O valor total deve ser preenchido.").typeError("O valor deve ser preenchido com um valor decimal."),
    usuarioId: yup.number().integer().required()
});

class OrcamentoDTO {
    constructor(dataInicio, dataFinal, valorTotal, usuarioId, next) {
        this.dataInicio = dataInicio;
        this.dataFinal = dataFinal;
        this.valorTotal = valorTotal;
        this.usuarioId = usuarioId;

        this.isValid = this.validateData(next);
    }

    validateData(next) {
        try {
            orcamentoSchema.validateSync({
                dataInicio: this.dataInicio,
                dataFinal: this.dataFinal,
                valorTotal: this.valorTotal,
                usuarioId: this.usuarioId
            });
            return true;
        } catch (error) {
            next(error);
            return false;
        }
    }
}

export { OrcamentoDTO };
