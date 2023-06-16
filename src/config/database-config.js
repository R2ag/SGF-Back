
/*
// Configuração do bando de dados no ambiente de teste
export const dbConfig = {
  dialect: 'sqlite',
  storage: 'database.sqlite',
  define: {
    freezeTableName: true
  }
};


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

*/

// Configuração do bando de dados no ambiente de produção
export const dbConfig = {
  dialect: 'postgres',
  host: 'dpg-ci65j66nqql3q38f6rtg-a.oregon-postgres.render.com',
  username: 'sgf_back_db_user',
  password: 'G5WJSlnfIPB7Ke2XM3TlLfxH0PHsz7LH',
  database: 'sgf_back_db',
  define: {
    timestamps: true,
    freezeTableName: true,
    underscored: true
  },
  dialectOptions: {
    ssl: true
  }
};

