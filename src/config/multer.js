const multer = require('multer'); //Importa o multer
const path = require('path'); //Importa o path (módulo nativo do node) para trabalhar com caminhos de arquivos e diretórios.
const crypto = require('crypto'); //Importa o crypto (módulo nativo do node) para criar hashes/bytes aleatórios
const { S3Client } = require('@aws-sdk/client-s3'); //importa o cliente da aws s3
const multerS3 = require('multer-s3') //pacote para integrar multer com s3

const s3 = new S3Client({ //define o cliente do s3
    region: process.env.AWS_DEFAULT_REGION, //define a região que vem do .env
    forcePathStyle: true,
    credentials: {//define as credenciais que vem do .env
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRETE_ACCESS_KEY,
    },
})

const storageTypes = {
    local: multer.diskStorage({ // Configura o armazenamento em disco (diskStorage)
        destination: (req, file, cb) => { // Define a pasta de destino dos arquivos
            cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads')); // Retorna o caminho absoluto da pasta de uploads
        }, //* cb = callback
        filename: (_, file, cb) => { // Define como os arquivos serão nomeados
            crypto.randomBytes(16, (err, hash) => { //Cria 16 bytes aleatórios
                if (err) return cb(err); // Se der erro, retorna o erro

                const fileName = file.originalname.normalize('NFD').toLowerCase().replace(/\s+/g, '');
                const ext = path.extname(file.originalname); //Pega a extensão do arquivo selecionado

                //Define o nome do arquivo quando salvo
                file.key = `${hash.toString('hex')}-${fileName}.${ext}`; //nome vai ser hash hexadecimal(numero e letras) + nome original + tipo do arquivo

                cb(null, file.key); // Retorna o nome do arquivo
            });
        }
    }),
    s3: multerS3({ //integra o multer com s3
        s3: s3, //usa a variável s3 atribuida no início do código
        bucket: process.env.AWS_S3_BUCKET,//define a bucket que vai ser usada
        contentType: multerS3.AUTO_CONTENT_TYPE, //deteta automaticamente o tipo de arquivo enviado
        key: (_, file, cb) => {
            crypto.randomBytes(16, (err, hash) => { //Cria 16 bytes aleatórios
                if (err) return cb(err); // Se der erro, retorna o erro

                const fileName = file.originalname.normalize('NFD').toLowerCase().replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '');
                const ext = path.extname(file.originalname); //Pega a extensão do arquivo selecionado

                //Define o nome do arquivo quando salvo
                const fileNameInS3 = `${hash.toString('hex')}-${fileName}`; //nome vai ser hash hexadecimal(numero e letras) + nome original + tipo do arquivo

                cb(null, fileNameInS3); // Retorna o nome do arquivo
            });
        }
    })
}

module.exports = { // Exporta um objeto de configuração para o multer
    dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'), // Define o diretório de destino para os uploads
    storage: storageTypes[process.env.STORAGE_TYPE],
    limits: { //Define os limites para o upload
        fileSize: 2 * 1024 * 1024, // Limite de 2MB por arquivo
    },
    fileFilter: (_, file, cb) => { // Filtro para tipos de arquivos permitidos
        const allowedMimes = [ // Lista de MIME types permitidos
            'image/jpeg',
            'image/pjpeg', // Algumas versões do JPEG
            'image/png',
            'image/gif',
        ];

        if (allowedMimes.includes(file.mimetype)) { // Verifica se o tipo do arquivo está na lista de permitidos
            cb(null, true); // Arquivo permitido
        } else {
            cb(new Error('Invalid file type.')); // Rejeita arquivos com tipos não permitidos
        }
    }
};

module.exports.s3Client = s3