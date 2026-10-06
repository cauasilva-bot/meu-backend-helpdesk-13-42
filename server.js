const express = require('express');
const cors = require('cors');
const auth = require('./auth');
const db = require('./database');

const app = express();
app.use(cors());

// Limite alto (50mb) configurado para suportar o recebimento de fotos e arquivos do chat em Base64
app.use(express.json({ limit: '50mb' })); 

// ----------------------------------------------------
// ROTAS ABERTAS
// ----------------------------------------------------
app.post('/api/login', auth.login);

// ----------------------------------------------------
// ROTAS PROTEGIDAS (Exigem o auth.verificarToken)
// ----------------------------------------------------
app.get('/api/chamados', auth.verificarToken, (req, res) => {
    res.json(db.chamados);
});

// Rota para criar um novo chamado (recebe Importância e Urgência do frontend)
app.post('/api/chamados', auth.verificarToken, (req, res) => {
    const novoChamado = {
        id: Date.now(),
        ...req.body,
        mensagens: [], // Inicia o chat vazio
        dataCriacao: new Date().toISOString()
    };
    db.chamados.push(novoChamado);
    res.status(201).json(novoChamado);
});

// Rota para o chat (recebe mensagens e os arquivos Base64)
app.post('/api/chamados/:id/mensagens', auth.verificarToken, (req, res) => {
    const chamado = db.chamados.find(c => c.id == req.params.id);
    if (!chamado) return res.status(404).json({ erro: 'Chamado não encontrado' });

    const novaMensagem = req.body;
    chamado.mensagens.push(novaMensagem);
    
    res.status(201).json(novaMensagem);
});

// Inicialização do Servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});