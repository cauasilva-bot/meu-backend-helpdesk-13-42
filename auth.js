const jwt = require('jsonwebtoken');
const { usuarios } = require('./database');

const SECRET_KEY = 'rs_servicos_chave_segura';

// Função que valida o login do frontend
function login(req, res) {
    const { identificador, senha } = req.body;
    
    // Busca o usuário no "banco de dados"
    const user = usuarios.find(u => u.usuario === identificador && u.senha === senha);
    
    if (!user) {
        return res.status(401).json({ erro: 'Usuário ou senha inválidos' });
    }
    
    // Gera o token de acesso válido por 8 horas
    const token = jwt.sign({ id: user.id, nome: user.nome, perfil: user.perfil }, SECRET_KEY, { expiresIn: '8h' });
    res.json({ token, usuario: { nome: user.nome, perfil: user.perfil } });
}

// Middleware de verificação para proteger as rotas de chamados
function verificarToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ erro: 'Token não fornecido' });

    jwt.verify(token.split(' ')[1], SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ erro: 'Token inválido' });
        req.usuarioId = decoded.id;
        next();
    });
}

module.exports = { login, verificarToken };