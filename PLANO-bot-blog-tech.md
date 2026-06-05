# Plano: Bot autônomo de artigos de tecnologia (PT-BR)

> Documento de planejamento — **nada será construído ainda**. Objetivo: mapear requisitos, arquitetura, features e o que falta para começar.

---

## 1. Visão geral

Um bot que, **todo dia**, automaticamente:

1. Lê os posts recentes de uma lista de blogs de tecnologia.
2. Identifica os tópicos mais interessantes / em alta.
3. **Cruza informações entre várias fontes** para garantir precisão e evitar cópia.
4. Escreve **1 artigo de blog em Português (Brasil)**, legível por humanos, com tom editorial.
5. (Opcional) Gera imagem(ns) de capa/ilustração.
6. **Envia o artigo para a API do seu site** (endpoint já existente — sem mudar código do site).
7. Te notifica e permite revogar/editar (modelo híbrido aprovado por você).

### Decisões já tomadas (suas respostas)

| Tema | Decisão |
|---|---|
| Runtime / "nuvem" | **Claude Cowork** (tarefa agendada) |
| API de publicação | **Já existe — você tem a spec** |
| Motor de IA | **Claude (Anthropic)** — nativo no Cowork |
| Controle | **Híbrido**: publica automático, te notifica, você pode revogar/editar |

---

## 2. Por que o Cowork muda (simplifica) tudo

Como o bot roda **dentro do Cowork**, você **não precisa** de:

- ❌ Servidor / VPS / container sempre ligado
- ❌ AWS Lambda, EventBridge, filas
- ❌ Integração manual com a API do Claude (o Cowork já é o Claude)
- ❌ Pipeline de CI/CD para o bot

O que o Cowork fornece nativamente:

- ✅ **Agendamento diário** (scheduled task)
- ✅ **Navegação/busca web** (para ler os blogs e cruzar fontes)
- ✅ **Escrita do artigo** em PT-BR
- ✅ **Geração de imagem**
- ✅ **Conectores** já disponíveis: Slack, Gmail, Google Drive, Google Calendar
- ✅ **Arquivos no seu workspace** (`agility-app/`) para guardar config e histórico

> Trade-off honesto: uma scheduled task do Cowork é ótima para **1 execução leve por dia**. Não é um sistema de filas industrial. Para "1 artigo/dia" é exatamente o ponto certo. Se um dia você precisar de 50 artigos/hora, aí sim migra para infra dedicada.

---

## 3. Arquitetura proposta

```
                 ┌─────────────────────────────────────────┐
                 │   Cowork Scheduled Task (diária, ex: 6h) │
                 └─────────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        ▼                           ▼                           ▼
 1. LER CONFIG              2. COLETAR & ANALISAR        3. ESCREVER
 - sources.json            - fetch dos blogs/RSS         - artigo PT-BR
 - guia-de-voz.md (intro)  - cruzar 2-3 fontes           - título, slug, SEO
 - historico.json (dedup)  - escolher 1 tópico novo      - (opcional) imagem
                                    │
                                    ▼
                 4. PUBLICAR via API do site (POST)
                                    │
                                    ▼
                 5. NOTIFICAR (Slack/Email) + opção de revogar
                                    │
                                    ▼
                 6. REGISTRAR em historico.json (evita repetir tópico)
```

Tudo orquestrado por **um único prompt agendado** + alguns **arquivos de configuração** no seu workspace.

---

## 4. Componentes / features a construir

### 4.1 Arquivos de configuração (no workspace `agility-app/`)

| Arquivo | Conteúdo | Quem fornece |
|---|---|---|
| `bot/sources.json` | Lista de blogs (URL + feed RSS quando houver) + peso/prioridade | **Você** (a lista que não chegou) |
| `bot/guia-de-voz.md` | Tom, persona, público-alvo, do's & don'ts, comprimento | **Você** (a "intro" que não chegou) |
| `bot/api.json` | Endpoint, método, headers/auth, schema do payload | **Você** (a spec) |
| `bot/historico.json` | Tópicos/URLs já cobertos (deduplicação) | Gerado pelo bot |
| `bot/prompt-diario.md` | O prompt mestre que a tarefa agendada executa | Eu construo |

### 4.2 Coleta de conteúdo
- Preferir **RSS/Atom feeds** quando existirem (mais estável que scraping de HTML).
- Fallback: busca web + leitura de página.
- Janela: posts das últimas 24–72h.

### 4.3 Seleção de tópico ("o que é interessante")
- Critérios configuráveis: recorrência do tema em várias fontes, relevância pro público, ineditismo (não repetir `historico.json`).
- Cross-check: confirmar fatos em **≥2 fontes independentes** antes de escrever.

### 4.4 Geração do artigo (PT-BR)
- Estrutura: título, subtítulo, intro, corpo com subtítulos, conclusão, CTA.
- **Original** — síntese própria, sem copiar parágrafos; citar/linkar fontes.
- SEO básico: slug, meta description, tags/categoria.
- Formato de saída: o que a sua API espera (Markdown? HTML? blocos?).

### 4.5 Imagens (opcional)
- Gerar capa + 0–2 ilustrações.
- **Ponto a resolver:** sua API aceita **upload de imagem**? Ou espera uma **URL** (precisaria de um host/CDN — ex. Cloudinary, S3, ou o próprio storage do seu site)?

### 4.6 Publicação (API)
- Cliente faz `POST` no seu endpoint com o payload no schema correto.
- Tratamento de erro: retry + notificação se falhar.

### 4.7 Notificação + revogação (modelo híbrido)
- Após publicar, manda **Slack ou e-mail** com: título, link do artigo publicado, resumo e instruções para **editar/despublicar**.
- "Revogar" depende da sua API ter um endpoint de update/unpublish (ou status `draft`).

### 4.8 Logs e deduplicação
- `historico.json` guarda tópicos, URLs-fonte e data — evita repetir assunto.

---

## 5. Integração com a API — o que eu preciso de você

Para `bot/api.json`, preciso de:

1. **URL** do endpoint de criação de post.
2. **Método** (POST/PUT) e **Content-Type**.
3. **Autenticação**: API key? Bearer token? Onde vai no request (header `Authorization`?).
4. **Schema do payload** — nomes exatos dos campos. Ex.:
   - `title`, `slug`, `excerpt`, `content` (Markdown ou HTML?), `coverImage` (URL ou upload?), `tags[]`, `category`, `author`, `status` (`published`/`draft`), `publishedAt`, `lang` (`pt-BR`).
5. **Imagem**: upload multipart, base64, ou só URL?
6. **Endpoint de update/unpublish** (para o "revogar").
7. Um **exemplo de request que funciona** (curl/Postman) — vale ouro.

> ⚠️ **Segurança:** a API key/token será necessária na execução. Vamos definir onde guardá-la com segurança (não commitar em texto puro no repositório). Discutir antes de construir.

---

## 6. O que ainda falta de você (inputs)

| Item | Status |
|---|---|
| 📄 Lista de blogs/sites a monitorar | **Não chegou** — reenviar |
| 📄 "Intro" / guia de voz e público | **Não chegou** — reenviar |
| 🔌 Spec completa da API (seção 5) | Pendente |
| 🖼️ Imagens: API aceita upload ou só URL? | Pendente |
| 🔁 Endpoint de unpublish/edit existe? | Pendente |
| 📢 Canal de notificação: Slack ou e-mail? | Definir |
| ⏰ Horário diário da publicação | Definir (ex. 6h) |
| 🌐 Categoria/tags padrão e autor do post | Definir |

---

## 7. Riscos & mitigações

| Risco | Mitigação |
|---|---|
| **Alucinação / fato errado** | Cross-check em ≥2 fontes; modelo híbrido (você revisa); citar fontes |
| **Plágio / copyright** | Síntese original, sem copiar trechos; sempre linkar a fonte |
| **Repetir o mesmo tópico** | `historico.json` de deduplicação |
| **Fonte fora do ar / muda HTML** | Preferir RSS; fallback de busca; pular fonte com erro |
| **API falhar no POST** | Retry + notificação de falha; salvar rascunho local |
| **Vazamento da API key** | Armazenamento seguro de segredo (definir) |
| **Qualidade do PT-BR** | Guia de voz + revisão híbrida nas primeiras semanas |

---

## 8. Rollout em fases (sugerido)

- **Fase 0 — Setup:** você envia sites + intro + spec da API. Eu monto os arquivos de config.
- **Fase 1 — Dry run (sem publicar):** bot gera 1 artigo e te manda por Slack/e-mail para revisão. Ajustamos tom/qualidade.
- **Fase 2 — Publicação manual assistida:** bot publica via API quando você aprova.
- **Fase 3 — Híbrido automático:** agenda diária, publica sozinho, te notifica, você revoga se precisar.
- **Fase 4 — Imagens + SEO refinado:** adiciona capas geradas e otimização.

---

## 9. Próximo passo

Me reenvie (1) a **lista de sites**, (2) a **intro/guia de voz** e (3) a **spec da API** (seção 5). Com isso eu monto a Fase 0 e fazemos um **dry run** antes de qualquer publicação automática.
