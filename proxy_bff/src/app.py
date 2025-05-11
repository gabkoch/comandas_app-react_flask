import os
from flask import Flask, send_from_directory, session
from datetime import timedelta
from flask_cors import CORS
import logging
from settings import PROXY_PORT, PROXY_DEBUG, TEMPO_SESSION, FRONTEND_URL
from funcoes import Funcoes

# blueprints
from mod_funcionario.funcionario import bp_funcionario
from mod_cliente.cliente import bp_cliente
from mod_produto.produto import bp_produto

# Configuração básica de logging
logging.basicConfig(level=logging.INFO)

# Aplicação Flask
app = Flask(__name__)

# Habilita CORS para permitir requisições do frontend React
CORS(app, resources={r"/api/*": {"origins": f"{FRONTEND_URL}"}})

# Rota para o favicon
@app.route('/favicon.ico')
def favicon():
    return send_from_directory(
        directory='static',
        path='favicon.ico',
        mimetype='image/vnd.microsoft.icon'
    )

# Rota para teste de token
@app.route('/api/teste_token', methods=['POST'])
def teste_token():
    return Funcoes.get_api_token()

# Rota raiz simples para teste
@app.route("/")
def home():
    return "Servidor Flask está rodando!"

# Geração da chave secreta
app.secret_key = os.urandom(12).hex()

# Configuração do tempo de sessão
app.permanent_session_lifetime = timedelta(minutes=int(TEMPO_SESSION))

# Configurações de cookies
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True

# Antes de cada requisição
@app.before_request
def before_request():
    session.permanent = True

# Registro dos blueprints
app.register_blueprint(bp_funcionario)
app.register_blueprint(bp_cliente)
app.register_blueprint(bp_produto)

# Execução do servidor
if __name__ == '__main__':
    logging.info(f"Iniciando o servidor Flask na porta: {PROXY_PORT}")
    app.run(host='0.0.0.0', port=PROXY_PORT, debug=PROXY_DEBUG, use_reloader=PROXY_DEBUG)
