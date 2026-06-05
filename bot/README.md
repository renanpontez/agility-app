# Blog Bot — Agility

Bot autônomo que gera e publica **1 artigo de tecnologia em PT-BR por dia** no blog da Agility
(`agilitycreative.com/blog`), consumindo a API existente do site.

## Arquitetura (tudo no Cowork)

O bash/python do ambiente do Cowork **não tem rede para a API** (firewall). A solução: a própria
tarefa agendada publica **pelo Chrome** — o navegador roda no seu Mac, tem rede real, e como a
página e a API estão na mesma origem (`https://www.agilitycreative.com`), o `fetch` interno não
sofre CORS.

```
┌─ Tarefa agendada do Cowork (todo dia 6h) ──────────────────────────┐
│  0. CHECA bot/queue/ primeiro:                                      │
│     • tem pendente? → pula a pesquisa, só publica (economiza tokens)│
│     • fila vazia?   → segue o fluxo completo abaixo                 │
│  1. navega as fontes → cruza → escreve o artigo PT-BR              │
│  2. grava o payload em bot/queue/<data>-<slug>.json                │
│  3. PUBLICA via Chrome: navega em /blog e faz fetch('/api/blog')   │
│     (POST de mesma origem, token lido de bot/.secret-token)        │
│  4. em 201: move o arquivo p/ bot/published/ + historico.json      │
│     (em falha: arquivo fica na fila e é reaproveitado amanhã)      │
│  5. avisa no Slack #agility-creative (tema + link)                 │
└────────────────────────────────────────────────────────────────────┘
```

**Dependência:** o Google Chrome precisa estar **aberto com a extensão do Claude conectada** às 6h.

## Arquivos

| Arquivo | Função |
|---|---|
| `PROMPT-DIARIO.md` | Instruções da tarefa agendada (fonte de verdade do processo). |
| `guia-de-voz.md` | Tom, público e estrutura editorial. |
| `sources.json` | Fontes (homepages + pesos). |
| `api.json` | Config e restrições da API. |
| `historico.json` | `publicados` (dedup de temas) + `links_lidos` (dedup de leitura). |
| `.secret-token` | Token da API. **Não commitar.** |
| `queue/` | Artigos prontos aguardando publicação. Se um pendente sobra, a próxima execução só publica (sem pesquisar). |
| `published/` `failed/` | Arquivos movidos após sucesso (201) / erro definitivo. |
| `rascunhos/` | Dry run e material de apoio. |
| `publish.mjs`, `run-publisher.sh`, `*.plist` | **Fallback opcional** (publicador local via launchd). Ver abaixo. Não usado no fluxo padrão (Chrome). |

## Pré-requisitos (uma vez)

1. **Chrome + extensão do Claude** conectada (para o passo de publicação).
2. **Conector do Slack** ativo no Cowork, com acesso ao canal `#agility-creative`.
3. **`bot/.secret-token`** com o token real (já configurado).
4. Na seção *Scheduled* da barra lateral, clique **"Run now"** uma vez para pré-aprovar as
   ferramentas (Chrome, Slack, arquivos) — assim os runs automáticos não param pedindo permissão.

## Agendamento
Tarefa **blog-agility-diario**, todo dia às 6h (horário local). Gerencie em *Scheduled*.
Como tarefas do Cowork só rodam com o app aberto, se o Mac estiver desligado às 6h, roda no
próximo abrir do app.

## Fallback opcional: publicador local (launchd)
Se algum dia você preferir publicar fora do Chrome (ex.: rodar headless), o publicador Node
continua disponível: ele lê `bot/queue/*.json` e faz o POST no host.
```bash
cd ~/Desktop/_dev/Agility/agility-app/bot
node publish.mjs --dry-run            # valida sem publicar
cp ~/Desktop/_dev/Agility/agility-app/bot/com.agility.blog-publisher.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.agility.blog-publisher.plist
```
> Atenção: se ativar o launchd E o fluxo do Chrome ao mesmo tempo, há risco de publicação dupla.
> Use um ou outro. No fluxo padrão (Chrome), **não** instale o launchd.

## Segurança
- `.secret-token` e `.slack-webhook` estão no `.gitignore`. O token nunca aparece em logs/Slack.

## Decisões fechadas
- Publicação: **a própria tarefa do Cowork, via Chrome** (sem launchd no fluxo padrão).
- Modelo: **auto-publica**, avisa no `#agility-creative` só com tema + link.
- Fontes: Tecnoblog, Olhar Digital, Zoom Digital, TechTudo, TechRadar (EN), Sydle (peso baixo).
- Imagem de capa: placeholder por enquanto (placehold.co).

## Pendências
- [ ] Garantir Chrome aberto + extensão conectada às 6h (ou rodar via "Run now" quando estiver).
- [ ] Confirmar que o conector do Slack alcança `#agility-creative`.
- [ ] Categorias do blog hoje: **Gestão, Produto, Design**. Decidir se tech/IA entra como
      categoria nova fixa (ex.: "Inteligência Artificial"/"Tecnologia").
