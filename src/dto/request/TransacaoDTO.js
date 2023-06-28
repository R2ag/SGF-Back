import * as yup from 'yup';

const transacaoSchema = yup.object().shape({
    data: yup.date().required("A data deve ser preenchida.").typeError("A data deve ser preenchida no formato correto."),
    descricao: yup.string().max(50, "A descrição deve ter no máximo 50 caracteres."),
    valor: yup.number().when('tipoId', {
        is: (tipoId) => tipoId === 2, 
        then: yup.number().required("O valor deve ser preenchido.").typeError("O valor deve ser preenchido com um valor decimal.").lessThan(0, "O valor deve ser um número negativo."),
        otherwise: yup.number().required("O valor deve ser preenchido.").typeError("O valor deve ser preenchido com um valor decimal.").moreThan(0, "O valor deve ser um número positivo.")
    }),
    contaId: yup.number().integer().required("A conta utilizada na transação deve ser preenchida"),
    favorecidoId: yup.number().integer().required("O favorecido na Transação deve ser informado"),
    categoriaId: yup.number().integer().required("A categoria da transação deve ser informada"),
    tipoId: yup.number().integer().required("O tipo da transação deve ser informado")
});

class TransacaoDTO {
    constructor(data, descricao, valor, contaId, favorecidoId, categoriaId, tipoId, next) {
        this.data = data;
        this.descricao = descricao;
        this.valor = valor;
        this.contaId = contaId;
        this.favorecidoId = favorecidoId;
        this.categoriaId = categoriaId;
        this.tipoId = tipoId;

        this.isValid = this.validateData(next);
    }

    validateData() {
        try {
            transacaoSchema.validateSync({
                data: this.data,
                descricao: this.descricao,
                valor: this.valor,
                contaId: this.contaId,
                favorecidoId: this.favorecidoId,
                categoriaId: this.categoriaId,
                tipoId: this.tipoId
            });
            return true;
        } catch (error) {
            next(error);
            return false;
        }
    }
}

export { TransacaoDTO };
