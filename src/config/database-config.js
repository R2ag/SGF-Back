
/*
// Configuração do bando de dados no ambiente de teste
export const dbConfig = {
  dialect: 'sqlite',
  storage: 'database.sqlite',
  define: {
    freezeTableName: true
  }
};

*/
// Configuração do bando de dados no ambiente de desenvolvimento
export const dbConfig = {
  dialect: 'postgres',
  host: 'db',
  username: 'postgres',
  password: 'secreto',
  database: 'sgf-api',
  define: {
    timestamps: true,
    freezeTableName: true,
    underscored: true
  },
};


/*
// Configuração do bando de dados no ambiente de produção
export const dbConfig = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'postgres',
  database: 'scv-backend-node-sequelize',
  define: {
    timestamps: true
  },
};
*/
