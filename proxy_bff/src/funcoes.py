from flask import session
from datetime import datetime, timedelta
import requests
from settings import API_ENDPOINT_TOKEN, API_USERNAME_TOKEN, API_PASSWORD_TOKEN, API_SSL_VERIFY
import logging


class Funcoes(object):

    # função para obter o token da API externa
    @staticmethod
    def get_api_token():
        try:
            session.clear()
            logging.info(f"Requisitando novo token de {API_ENDPOINT_TOKEN}")

            headers = {
                'accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
            data = {
                'username': API_USERNAME_TOKEN,
                'password': API_PASSWORD_TOKEN
            }

            response = requests.post(API_ENDPOINT_TOKEN, headers=headers, data=data, verify=API_SSL_VERIFY)
            response.raise_for_status()

            token_data = response.json()

            if 'access_token' not in token_data:
                msg = f"Erro ao obter token: 'access_token' não encontrado na resposta. {token_data}"
                logging.error(msg)
                raise KeyError(msg)

            session['access_token'] = token_data['access_token']
            session['expire_minutes'] = token_data['expire_minutes']
            session['token_type'] = token_data['token_type']
            session['token_validade'] = datetime.timestamp(
                datetime.now() + timedelta(minutes=token_data['expire_minutes'])
            )

            logging.info(f"Token obtido com sucesso: {session['access_token']}, válido por {session['expire_minutes']} minutos.")
            return token_data

        except Exception as e:
            if isinstance(e, requests.exceptions.HTTPError):
                msg = f"Erro HTTP: {e.response.status_code} - {e.response.text}"
            else:
                msg = f"Erro inesperado ao obter token: {e}"

            logging.error(msg)
            return {'error': msg}, 500

    # valida o token armazenado na sessão
    @staticmethod
    def validar_token():
        for _ in range(2):  # Tenta obter o token no máximo 2 vezes
            if 'token_validade' in session and session['token_validade'] > datetime.timestamp(datetime.now()):
                return True  # Token ainda é válido

            # Token inválido ou expirado, tenta obter um novo
            novo_token = Funcoes.get_api_token()
            if isinstance(novo_token, dict) and 'access_token' in novo_token:
                return True  # Novo token obtido com sucesso

        return False  # Não conseguiu obter token válido

    # realiza uma requisição para a API externa usando o token
    @staticmethod
    def make_api_request(method, url, data=None, params=None):
        if not Funcoes.validar_token():
            return {'error': 'Falha ao obter token de autenticação'}, 500

        headers = {
            'Authorization': f'Bearer {session["access_token"]}',
            'accept': 'application/json',
        }

        try:
            logging.info(f"Realizando requisição: {method.upper()} {url}")
            response = requests.request(method, url, headers=headers, json=data, params=params, verify=API_SSL_VERIFY)
            response.raise_for_status()

            result = response.json()
            return result[0] if isinstance(result, list) and result else {}, response.status_code

        except Exception as e:
            if isinstance(e, requests.exceptions.HTTPError):
                msg = f"Erro HTTP: {e.response.status_code} - {e.response.text}"
            elif isinstance(e, requests.exceptions.RequestException):
                msg = f"Erro de conexão/requisição com a API externa: {e}"
            else:
                msg = f"Erro inesperado ao processar requisição para API externa: {e}"

            logging.error(msg)
            return {'error': msg}, 500
