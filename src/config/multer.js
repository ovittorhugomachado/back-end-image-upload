const multer = require('multer'); //Importa o multer
const path = require('path'); //Importa o path (módulo nativo do node) para trabalhar com caminhos de arquivos e diretórios.
const crypto = require('crypto'); //Importa o crypto (módulo nativo do node) para criar hashes/bytes aleatórios

module.exports = { // Exporta um objeto de configuração para o multer
    dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'), // Define o diretório de destino para os uploads
    storage: multer.diskStorage({ // Configura o armazenamento em disco (diskStorage)
        destination: (req, file, cb) => { // Define a pasta de destino dos arquivos
            cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads')); // Retorna o caminho absoluto da pasta de uploads
        }, //* cb = callback
        filename: (req, file, cb) => { // Define como os arquivos serão nomeados
            crypto.randomBytes(16, (err, hash) => { //Cria 16 bytes aleatórios
                if (err) return cb(err); // Se der erro, retorna o erro
                
                const ext = path.extname(file.originalname); //Pega a extensão do arquivo selecionado

                //Define o nome do arquivo quando salvo
                const fileName = `${hash.toString('hex')}-${file.originalname}.${ext}`; //nome vai ser hash hexadecimal(numero e letras) + nome original + tipo do arquivo
                
                cb(null, fileName); // Retorna o nome do arquivo
            });
        }
    }),
    limits: { //Define os limites para o upload
        fileSize: 2 * 1024 * 1024, // Limite de 2MB por arquivo
    },
    fileFilter: (req, file, cb) => { // Filtro para tipos de arquivos permitidos
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