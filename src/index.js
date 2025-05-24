const express = require('express');
const morgan = require('morgan')

const app = express();// Cria uma instância do aplicativo Express

app.use(express.json());// Middleware pro exmpres interpretar requisições com formato JSON

app.use(morgan('dev'))//Faz os logs no terminal com as informações da requisição

app.use(express.urlencoded({ extended: true }));// Middleware para o express conseguir lidar com requisições no padrão urlencoded
// O parâmetro { extended: true } permite o parseamento de dados complexos (arrays, objetos aninhados)

app.use(require('./routes'));// Importa e usa as rotas definidas no arquivo routes.js
// Todas as rotas definidas em routes.js serão acessíveis a partir da raiz do servidor (/)

app.listen(3001);// fica escutando o servidor na porta 3000