// Simulação de banco de dados em memória
const usuarios = [
    { id: 1, usuario: 'admin', senha: '123', perfil: 'admin', nome: 'Administrador' },
    { id: 2, usuario: 'joao', senha: '123', perfil: 'padrao', nome: 'João Padrão' }
];

// Onde os chamados (com urgência, importância e mensagens) ficarão salvos
const chamados = [];

module.exports = {
    usuarios,
    chamados
};