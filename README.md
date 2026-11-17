# vulnerable-demo-api

> ⚠️ **Projeto propositalmente vulnerável.** Serve só para testar scanners de segurança
> (SAST, dependências e segredos). **Não rode exposto na internet e não reutilize o código.**
> Todas as credenciais são falsas e a chave privada foi gerada só para este teste.

## O que os scanners devem encontrar

| Tipo | Onde | Exemplos |
|---|---|---|
| Código (Semgrep) | `src/app.js`, `scripts/report.py` | SQL injection, injeção de comando, `eval`, XSS, open redirect, path traversal, desserialização insegura, TLS desativado, `subprocess` com `shell=True`, `yaml.load`, `pickle` |
| Dependências (Trivy) | `package-lock.json`, `requirements.txt` | lodash, minimist, jsonwebtoken, axios, node-serialize, ejs, PyYAML, Jinja2, requests… |
| Segredos (Gitleaks) | `src/config.js`, `.env.production`, `certs/server.key` | chaves de API, senha de banco na URL, segredo JWT, chave privada |

## Subir para o GitHub

```powershell
git init
git add .
git commit -m "Projeto vulnerável para teste de scanners"
git branch -M main
git remote add origin https://github.com/<seu-usuario>/vulnerable-demo-api.git
git push -u origin main
```

Se o GitHub bloquear o push por "secret scanning / push protection", siga o link que ele
mostra e marque como "usado em testes" — os valores são falsos.
