const routes = require('express').Router() //Importa o router do express
const multer = require('multer'); //Importa o multer para lidar com requisições de arquivos estáticos
const multerConfig = require('./config/multer') //Importa as configurações personalizadas do arquivo multer config
const { PrismaClient } = require('@prisma/client'); 
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');

const prisma = new PrismaClient() //atribui o prisma client à uma variável

// Define uma rota POST para '/posts' que vai:
// Listar todos os registros
routes.get('/posts', async (req, res) => {
    const posts = await prisma.usuario.findMany()

    return res.status(200).json(posts)
})

// Define uma rota POST para '/posts' que vai:
// 1. Usar o middleware do multer com suas configurações
// 2. Processar um único arquivo com o nome de campo 'file'
// 3. Receber a requisição (req) e enviar a resposta (res)
routes.post('/posts', multer(multerConfig).single('file'), async (req, res) => {
    const { originalname: name, size, key, location: url = "" } = req.file //desestrutura os objetos do corpo da requisição

    const post = await prisma.usuario.create({ //cria um novo registro no BD usuario
        data: {
            name,
            size,
            key,
            url
        },
    });

    return res.json(post) // Retorna uma resposta os dados do arquivo em formato JSON
});

// Define uma rota DELETE para '/posts' que vai:
// Deleta a imagem no banco de dados e no S3
routes.delete('/posts/:id', async (req, res) => {

    try {
        const id = Number(req.params.id) //transforma o parametro em numero

        const post = await prisma.usuario.findUnique({ //encontra o unico registro 
            where: { id } //onde id === id
        })

        if (!post) { //se não tiver nenhum registro com o id definido
            return res.status(404).json({ message: "imagem não encontrada" })
        }

        if (post.key && process.env.STORAGE_TYPE === "s3") { //se a variável de ambiente no .env for s3(aws s3)

            await multerConfig.s3Client.send(new DeleteObjectCommand({
                Bucket: 'bucket.rangos', //bucket que vai ser deletada
                Key: post.key //key no s3 é o nome do arquivo
            }));
        }

        await prisma.usuario.delete({ //deleta o registro do banco de dadoss
            where: { id } //onde is === id
        })

        res.status(200).json({ message: "deletado com sucesso" })

    } catch (error) {
        console.error("Erro ao deletar:", error);
        return res.status(500).json({ error: "Erro ao deletar o post" });
    }
})

// Exporta as rotas configuradas para serem usadas no arquivo principal (index.js)
module.exports = routes