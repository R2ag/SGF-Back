import Sequelize from 'sequelize';
import { dbConfig } from "../config/database-config.js";

import { Usuario } from '../models/Usuario.js';
import { Conta } from '../models/Conta.js';

import * as fs from 'fs';

function databaseInserts() {

    const sequelize = new Sequelize(dbConfig);

    Usuario.init(sequelize);
    Conta.init(sequelize);

    // A ordem das efetivações das associações importa: neste exemplo, Uf.associate antes de Cidade.associate deixa foreignKey: { allowNull: true } poder ser null
    Conta.associate(sequelize.models);

    (async () => {
        await sequelize.sync({ force: true });

        const usuario1 = await Usuario.create({ nome: "Usuario1", cpf: "111.111.111-11", email: "usuario1@email.com", usuario: "usuario1", senha: "123456" });
        const usuario2 = await Usuario.create({ nome: "Usuario2", cpf: "222.222.222-22", email: "usuario2@email.com", usuario: "usuario2", senha: "123456" });
        const usuario3 = await Usuario.create({ nome: "Usuario3", cpf: "333.333.333-33", email: "usuario3@email.com", usuario: "usuario3", senha: "123456" });
        const usuario4 = await Usuario.create({ nome: "Usuario4", cpf: "444.444.444-44", email: "usuario4@email.com", usuario: "usuario4", senha: "123456" });

        const conta1 = await Conta.create({ nome: "Conta1", tipo: "Tipo 0001", descricao: "Descrição 0000", saldo: "1000", usuarioId: 1 });
        const conta2 = await Conta.create({ nome: "Conta2", tipo: "Tipo 0002", descricao: "Descrição 0000", saldo: "1500", usuarioId: 2 });
        const conta3 = await Conta.create({ nome: "Conta3", tipo: "Tipo 0003", descricao: "Descrição 0000", saldo: "2000", usuarioId: 3 });
        const conta4 = await Conta.create({ nome: "Conta4", tipo: "Tipo 0004", descricao: "Descrição 0000", saldo: "2500", usuarioId: 4 });
    })();

}

export default databaseInserts;