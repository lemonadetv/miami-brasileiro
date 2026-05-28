# 🌴 Miami Brasileiro — Guia Completo de Deploy
## Do zero ao site no ar em menos de 30 minutos

---

## O que você vai precisar (tudo grátis)

| Conta | Para que serve | Link |
|-------|---------------|------|
| GitHub | Guardar o código do site | github.com |
| Vercel | Hospedar o site (grátis) | vercel.com |
| Anthropic | IA para reescrever notícias | console.anthropic.com |
| NewsAPI | Buscar notícias automaticamente | newsapi.org |

Você já tem GitHub, Vercel e Anthropic. Falta só criar o NewsAPI.

---

## PASSO 1 — Criar conta na NewsAPI (grátis)

1. Acesse **newsapi.org**
2. Clique em **"Get API Key"**
3. Preencha nome, e-mail e senha
4. Confirme o e-mail
5. Copie sua **API Key** (parece assim: `abc123def456abc123def456abc123de`)
6. Guarde essa chave — você vai precisar depois

---

## PASSO 2 — Criar o repositório no GitHub

1. Acesse **github.com** e faça login
2. Clique no botão **"+"** (canto superior direito) → **"New repository"**
3. Preencha:
   - **Repository name:** `miami-brasileiro`
   - **Description:** Portal de notícias para brasileiros em Miami
   - Marque: **☑ Public** (necessário para o Vercel gratuito)
   - Marque: **☑ Add a README file**
4. Clique em **"Create repository"**

---

## PASSO 3 — Fazer upload dos arquivos do site

Você recebeu uma pasta chamada `miami-brasileiro` com todos os arquivos.

### Método mais fácil (arrastar e soltar):

1. No seu repositório recém-criado no GitHub, clique em **"uploading an existing file"** (link na página principal)
2. Arraste TODOS os arquivos e pastas da pasta `miami-brasileiro` para a área de upload
3. No campo **"Commit changes"**, escreva: `Primeiro upload do portal`
4. Clique em **"Commit changes"**

> ⚠️ **IMPORTANTE:** O arquivo `.env.local.example` NÃO deve ir para o GitHub com seus dados reais. Es só um modelo. Os dados reais você vai colocar direto no Vercel.

---

## PASSO 4 — Criar o Token do GitHub (para o site salvar notícias)

O site precisa de permissão para salvar artigos novos no GitHub.

1. No GitHub, clique na sua foto de perfil (canto superior direito)
2. Clique em "Settings"
3. No menu lateral, vá em "Developer settings" → "Personal access tokens" → "Tokens (classic)"
4. Clique em "Generate new token (classic)"
5. Preencha: Note: miami-brasileiro-token, Expiration: No expiration, marque repo
 6. Clique em "Generate token" e COPIE IMMEDIATAMENTE

---

## PASSO 5 — Pegar sua Chave da Anthropic

1. Acesse console.anthropic.com
2. Faça login → API Keys → Create Key
3. Dé nome: miami-brasileiro e copie a chave (sk-ant-...)

---

## PASSO 6 — Conectar o GitHub ao Vercel

1. Acesse vercel.com e faça login
2. Clique em "Add New..." → "Project"
3. Localize miami-brasileiro e clique em "Import"
 4. Framework Preset: Next.js, deixe Root Directory em branco
5. Expanda "Environment Variables"

---

## PASSO 7 — Configurar as variáveis de ambiente

| Nome da variável | Valor |
|-----------------|-------|
| ANTHROPIC_API_KEY | Sua chave do Claude (sk-ant-...) |
| NEWS_API_KEY | Sua chave da NewsAPI |
| GITHUB_TOKEN | O token do passo 4 |
| GITHUB_REPO | SEU_USUARIO/miami-brasileiro |
| CRON_SECRET | Invente uma senha forte |

---

## PASSO 8 — Fazer o deploy!

1. Clique em "Deploy" e aguarde 2-3 minutos
2. Quando aparecer "🎉 Congratulations!" seu site está no ar!
 3. Seu site estará em: https://miami-brasileiro.vercel.app

---

## Como funciona a automação

O Vercel busca notícias automaticamente:
- 7h da manhã (horário de Miami)
- 1h da tarde
- 7h da noite

Sem você fazer nada, o site sempre terá notícias frescas!

---

## Problemas comuns

- Site não abre: verifique as variáveis de ambiente no Vercel
- Automação não traz notícias: verifique NESS_API_KEY
- GitHub recusa atualização: verifique a permissão "repo" no token

---

## Suporte

Se tiver dúvidas, me pergunte! Posso ajudar com customizações, novas seções, Google AdSense, redes sociais e e-mail marketing.
