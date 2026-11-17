# ⚠️ Script PROPOSITALMENTE inseguro, apenas para testar scanners.
import pickle
import subprocess

import requests
import yaml
from flask import Flask, request

app = Flask(__name__)


@app.route("/report")
def report():
    # Injeção de comando: shell=True com entrada do usuário
    name = request.args.get("name")
    output = subprocess.check_output("cat reports/" + name, shell=True)
    return output


@app.route("/import", methods=["POST"])
def import_config():
    # yaml.load sem Loader seguro permite executar código
    config = yaml.load(request.data)
    return str(config)


@app.route("/restore", methods=["POST"])
def restore():
    # Desserialização insegura com pickle
    return str(pickle.loads(request.data))


@app.route("/fetch")
def fetch():
    # Verificação de certificado desativada
    return requests.get(request.args.get("url"), verify=False).text


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
