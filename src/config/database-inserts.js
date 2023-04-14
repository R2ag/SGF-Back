import Sequelize from 'sequelize';
import { dbConfig } from "../config/database-config.js";

import { Usuario } from '../models/Usuario.js';
import { Conta } from '../models/Conta.js';
import { Favorecido } from '../models/Favorecido.js';
import { Categoria } from '../models/Categoria.js';
import { Transacao } from '../models/Transacao.js';
import { OrcamentoCategoria } from '../models/OrcamentoCategoria.js';
import { Orcamento } from '../models/Orcamento.js';

function databaseInserts() {

    const sequelize = new Sequelize(dbConfig);

    Usuario.init(sequelize);
    Conta.init(sequelize);
    Favorecido.init(sequelize);
    Categoria.init(sequelize);
    Transacao.init(sequelize);
    OrcamentoCategoria.init(sequelize);
    Orcamento.init(sequelize);


    // A ordem das efetivações das associações importa: neste exemplo, Uf.associate antes de Cidade.associate deixa foreignKey: { allowNull: true } poder ser null
    Usuario.associate(sequelize.models);
    Conta.associate(sequelize.models);
    Favorecido.associate(sequelize.models);
    Categoria.associate(sequelize.models);
    Transacao.associate(sequelize.models);
    OrcamentoCategoria.associate(sequelize.models);
    Orcamento.associate(sequelize.models);

    (async () => {
        await sequelize.sync({ force: true });

        const usuario1 = await Usuario.create({ nome: "Usuario1", cpf: "111.111.111-11", email: "usuario1@email.com", usuario: "usuario1", senha: "123456" });
        const usuario2 = await Usuario.create({ nome: "Usuario2", cpf: "222.222.222-22", email: "usuario2@email.com", usuario: "usuario2", senha: "123456" });
        const usuario3 = await Usuario.create({ nome: "Usuario3", cpf: "333.333.333-33", email: "usuario3@email.com", usuario: "usuario3", senha: "123456" });
        const usuario4 = await Usuario.create({ nome: "Usuario4", cpf: "444.444.444-44", email: "usuario4@email.com", usuario: "usuario4", senha: "123456" });

        const conta1 = await Conta.create({ nome: "Conta1", tipo: "Tipo 01", descricao: "Descrição 0000", saldo: "1000", usuarioId: 1 });
        const conta2 = await Conta.create({ nome: "Conta2", tipo: "Tipo 02", descricao: "", saldo: "1500", usuarioId: 2 });
        const conta3 = await Conta.create({ nome: "Conta3", tipo: "Tipo 01", descricao: "Descrição 0000", saldo: "2000", usuarioId: 3 });
        const conta4 = await Conta.create({ nome: "Conta4", tipo: "Tipo 02", descricao: "Descrição 0000", saldo: "2500", usuarioId: 4 });

        const favorecido1 = await Favorecido.create({ nome: "Favorecido1", ramo: "Ramo 0001", cpfOuCnpj: "111.111.111-11", email: "favorecido1@email.com" });
        const favorecido2 = await Favorecido.create({ nome: "Favorecido2", ramo: "Ramo 0002", cpfOuCnpj: "222.222.222-22", email: "favorecido2@email.com" });
        const favorecido3 = await Favorecido.create({ nome: "Favorecido3", ramo: "Ramo 0003", cpfOuCnpj: "333.333.333-33", email: "favorecido3@email.com" });
        const favorecido4 = await Favorecido.create({ nome: "Favorecido4", ramo: "Ramo 0004", cpfOuCnpj: "444.444.444-44", email: "favorecido4@email.com" });

        const categoria1 = await Categoria.create({ nome: "Categoria1", tipo: "Tipo 01", descricao: "", observacao: "observação1" });
        const categoria2 = await Categoria.create({ nome: "Categoria2", tipo: "Tipo 02", descricao: "Descrição 0000", observacao: "" });
        const categoria3 = await Categoria.create({ nome: "Categoria3", tipo: "Tipo 01", descricao: "Descrição 0000", observacao: "observação3" });
        const categoria4 = await Categoria.create({ nome: "Categoria4", tipo: "Tipo 02", descricao: "Descrição 0000", observacao: "observação4" });

        const transacao1 = await Transacao.create({ valor: "7000", data: "2023-04-14", descricao: "Descrução 0000", categoriaId: 1, contaId: 1, favorecidoId: 1 });
        const transacao2 = await Transacao.create({ valor: "8000", data: "2023-04-12", descricao: "Descrução 0000", categoriaId: 2, contaId: 2, favorecidoId: 2 });
        const transacao3 = await Transacao.create({ valor: "6000", data: "2023-04-11", descricao: "Descrução 0000", categoriaId: 3, contaId: 3, favorecidoId: 3 });
        const transacao4 = await Transacao.create({ valor: "9000", data: "2023-04-15", descricao: "Descrução 0000", categoriaId: 4, contaId: 4, favorecidoId: 4 });

        const orcamentoCategoria1 = await OrcamentoCategoria.create({ valor: "1000", descricao: "Descrição 0000", categoriaId: 1, orcamentoId: 1 });
        const orcamentoCategoria2 = await OrcamentoCategoria.create({ valor: "2000", descricao: "Descrição 0000", categoriaId: 2, orcamentoId: 2 });
        const orcamentoCategoria3 = await OrcamentoCategoria.create({ valor: "3000", descricao: "Descrição 0000", categoriaId: 3, orcamentoId: 3 });
        const orcamentoCategoria4 = await OrcamentoCategoria.create({ valor: "1500", descricao: "Descrição 0000", categoriaId: 4, orcamentoId: 4 });

        const orcamento1 = await Orcamento.create({ dataInicio: "2023-01-01", dataFinal: "2023-02-01", valorTotal: "1000", usuarioId: 1});
        const orcamento2 = await Orcamento.create({ dataInicio: "2023-03-01", dataFinal: "2023-04-01", valorTotal: "2000", usuarioId: 2});
        const orcamento3 = await Orcamento.create({ dataInicio: "2023-04-01", dataFinal: "2023-06-01", valorTotal: "3000", usuarioId: 3});
        const orcamento4 = await Orcamento.create({ dataInicio: "2023-07-01", dataFinal: "2023-08-01", valorTotal: "1500", usuarioId: 4});
    })();

}

export default databaseInserts;