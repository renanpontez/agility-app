# Instagram via Manus — fila desacoplada

## Como funciona
Nosso bot (Cowork) **não publica** no Instagram. Ao terminar de publicar o artigo no blog,
ele cria **um item de fila no Google Drive** (via conector), na pasta
`___ agility ____/site/ig-queue` (conta `renanpontez@gmail.com`), como
`<data>-<slug>.json` (imagem JPEG + legenda prontas). Uma automação no **Manus** roda
~30 min depois, lê essa pasta, publica no Instagram e **apaga** o item.

```
Cowork (6h) publica blog → escreve bot/ig-queue/<data>-<slug>.json
                                   │  (fila)
Manus (~6h30) lê a fila → posta no Instagram → apaga o item
```

## Formato do item da fila
```json
{
  "slug": "amazon-comeca-testes-da-alexa-plus-no-brasil",
  "title": "Alexa+ chega ao Brasil em teste: o que muda...",
  "blog_url": "https://www.agilitycreative.com/blog/amazon-comeca-testes-da-alexa-plus-no-brasil",
  "image_url": "https://images.unsplash.com/photo-<id>?w=1080&h=1350&fit=crop&fm=jpg&q=80",
  "caption": "<legenda PT-BR pronta: título + gancho + CTA + #hashtags>",
  "type": "feed",
  "status": "pending",
  "created_at": "2026-06-07T09:00:00Z"
}
```

## Cadastro e setup no Manus (passo a passo)

**Pré-requisitos:** uma conta Instagram **profissional** (Business ou Creator) da Agility;
a pasta `bot/ig-queue/` acessível via Google Drive (ver passo 3).

1. **Criar conta no Manus.** Acesse https://manus.im e cadastre-se (login Google/e-mail).
   Connectors + Scheduled Tasks podem exigir um plano pago — confira https://manus.im/pricing.
2. **Conectar o Instagram.** No workspace, vá em Settings → **Connectors** (ou clique no ícone
   de "plug" ao lado do chat) → **Add Connector** → **Instagram** → autentique com o perfil
   **profissional**. Se a conta for pessoal, o Manus orienta a conversão.
3. **Conectar o Google Drive** (onde mora a fila). Em Connectors → Add Connector → **Google
   Drive** → autorize. Garanta que a pasta `bot/ig-queue/` esteja no seu Drive — o jeito
   simples é ter o **Google Drive para Desktop** sincronizando o caminho que contém essa pasta.
   (Se preferir não sincronizar, me avise que eu mudo o nosso lado pra escrever a fila direto
   no Drive via conector.)
4. **Criar a automação agendada.** Settings → **Scheduled Tasks** → nova tarefa. Cole o prompt
   da seção "Automação no Manus" abaixo. Agende para **~06:30** (após a nossa às 06:00) e
   defina a entrega/saída (ex.: resumo por e-mail/Slack, opcional).
5. **Testar.** Coloque um item de teste em `bot/ig-queue/` (peça pra mim) e rode a tarefa do
   Manus manualmente uma vez para validar a publicação e a remoção do item.
6. **Gerenciar.** Em Settings → Scheduled Tasks você pausa, edita o horário ou apaga a automação.

Fontes: conector de Instagram do Manus (https://manus.im/blog/manus-instagram-connector) e
Scheduled Tasks (https://manus.im/docs/features/scheduled-tasks).

## Automação no Manus (agende para ~06:30, depois da nossa às 06:00)

Cole este prompt na automação agendada do Manus:

```
Você é o publicador de Instagram do Blog Agility. A cada execução:

1. Liste os arquivos .json da pasta de fila "ig-queue" (no Google Drive conectado).
   Se estiver vazia, finalize sem fazer nada.
2. Para cada item com "status": "pending" (processe um por vez, do mais antigo ao mais novo):
   a. Publique um POST no feed do Instagram (conector de Instagram) usando:
      - imagem = campo "image_url" (é um card branded gerado pelo nosso site, em PNG).
        BAIXE a imagem dessa URL; se o Instagram exigir JPEG, CONVERTA o PNG para JPEG
        antes de postar.
      - legenda = campo "caption" (use exatamente como está)
   b. Se a publicação der certo, APAGUE o arquivo do item da pasta ig-queue
      (ou mova para uma subpasta "ig-published"). Isso evita republicar amanhã.
   c. Se falhar, NÃO apague o arquivo (será tentado de novo na próxima execução) e
      registre o erro.
3. Ao final, faça um resumo: quantos itens publicou e os links dos posts.

Regras: publique no máximo os itens pendentes do dia; nunca republique um item já
publicado; não altere o conteúdo da legenda.
```

## Observações
- O link do artigo não é clicável em legenda do Instagram — por isso a legenda termina com
  "link na bio". Mantenha o link do blog na bio do perfil.
- A imagem é sempre JPEG 1080×1350 (4:5), o formato ideal pro feed.
- Para pausar o Instagram sem mexer no Manus, troque `enabled` para `false` em
  `bot/instagram.json` (o Cowork para de enfileirar).
