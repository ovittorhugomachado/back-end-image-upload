const routes = require('express').Router() //Importa o router do express
const multer = require('multer'); //Importa o multer para lidar com requisições de arquivos estáticos
const multerConfig = require('./config/multer') //Importa as configurações personalizadas do arquivo multer config

// Define uma rota POST para '/posts' que vai:
// 1. Usar o middleware do multer com suas configurações
// 2. Processar um único arquivo com o nome de campo 'file'
// 3. Receber a requisição (req) e enviar a resposta (res)
routes.post('/posts', multer(multerConfig).single('file'), (req, res) => {
    console.log(req.file) // Mostra no console do servidor as informações do arquivo recebido
    return res.json({message: 'Hello world!!'}) // Retorna uma resposta JSON para o usuário
});

// Exporta as rotas configuradas para serem usadas no arquivo principal (index.js)
module.exports = routes