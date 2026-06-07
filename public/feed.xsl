<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:media="http://search.yahoo.com/mrss/">
  <xsl:output method="html" version="5.0" encoding="UTF-8" indent="yes" omit-xml-declaration="yes" />
  <xsl:template match="/">
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <title><xsl:value-of select="rss/channel/title" /> — RSS</title>
        <style>
          :root {
            --bg: #fafaf9;
            --surface: #ffffff;
            --border: rgba(0, 0, 0, 0.06);
            --border-strong: rgba(0, 0, 0, 0.12);
            --text: #1c1917;
            --text-muted: #78716c;
            --text-dim: #a8a29e;
            --accent: #fd512e;
          }
          * { box-sizing: border-box; }
          html, body {
            margin: 0;
            background: var(--bg);
            color: var(--text);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, "Helvetica Neue", Arial, sans-serif;
            font-size: 15px;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
          }
          .wrap { max-width: 760px; margin: 0 auto; padding: 56px 24px 96px; }
          header { padding-bottom: 32px; border-bottom: 1px solid var(--border); margin-bottom: 36px; }
          .eyebrow {
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            color: var(--accent);
            display: inline-flex;
            align-items: center;
            gap: 12px;
            margin: 0 0 16px;
          }
          .eyebrow::before {
            content: "";
            display: inline-block;
            width: 32px;
            height: 1px;
            background: var(--accent);
          }
          h1 {
            font-size: 38px;
            font-weight: 600;
            letter-spacing: -0.02em;
            margin: 0;
            line-height: 1.1;
          }
          p.lede {
            color: var(--text-muted);
            margin: 16px 0 0;
            font-size: 17px;
            line-height: 1.55;
          }
          .actions { display: flex; gap: 12px; flex-wrap: wrap; margin: 28px 0 0; }
          .btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 16px;
            border-radius: 999px;
            font-size: 13px;
            font-weight: 500;
            text-decoration: none;
            transition: all .2s ease;
          }
          .btn-primary {
            background: #1c1917;
            color: #fafaf9;
            box-shadow: 0 1px 2px rgba(0,0,0,.08), inset 0 1px 0 rgba(255,255,255,.08);
          }
          .btn-primary:hover { background: #292524; }
          .btn-ghost {
            background: transparent;
            color: var(--text-muted);
            border: 1px solid var(--border-strong);
          }
          .btn-ghost:hover { color: var(--text); border-color: var(--text); }
          .url-row {
            margin-top: 28px;
            padding: 14px 16px;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            flex-wrap: wrap;
          }
          .url-row code {
            font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
            font-size: 13px;
            color: var(--text);
            word-break: break-all;
          }
          .url-row .label {
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: var(--text-dim);
          }
          .items { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; }
          .item {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 22px 24px;
            transition: all .25s ease;
          }
          .item:hover {
            border-color: var(--border-strong);
            box-shadow: 0 12px 28px -16px rgba(0,0,0,.12);
            transform: translateY(-1px);
          }
          .item .meta {
            display: flex;
            gap: 10px;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: var(--text-dim);
            margin-bottom: 10px;
            align-items: center;
          }
          .item .meta .cat { color: var(--accent); }
          .item .meta .dot {
            width: 4px; height: 4px; border-radius: 50%;
            background: var(--border-strong);
          }
          .item h2 {
            margin: 0 0 6px;
            font-size: 19px;
            font-weight: 600;
            letter-spacing: -0.01em;
            line-height: 1.3;
          }
          .item h2 a {
            color: var(--text);
            text-decoration: none;
          }
          .item h2 a:hover { color: var(--accent); }
          .item .desc {
            color: var(--text-muted);
            margin: 0;
            font-size: 14px;
            line-height: 1.55;
          }
          footer {
            margin-top: 40px;
            color: var(--text-dim);
            font-size: 12px;
            display: flex;
            justify-content: space-between;
            gap: 16px;
            flex-wrap: wrap;
          }
          footer a { color: inherit; text-decoration: underline; text-decoration-color: var(--border-strong); }
        </style>
      </head>
      <body>
        <main class="wrap">
          <header>
            <p class="eyebrow">RSS Feed</p>
            <h1><xsl:value-of select="rss/channel/title" /></h1>
            <p class="lede"><xsl:value-of select="rss/channel/description" /></p>
            <div class="url-row">
              <span class="label">URL do feed</span>
              <code><xsl:value-of select="rss/channel/atom:link/@href" /></code>
            </div>
            <div class="actions">
              <a class="btn btn-primary">
                <xsl:attribute name="href">feed://<xsl:value-of select="substring-after(rss/channel/atom:link/@href, '://')" /></xsl:attribute>
                Inscrever no leitor RSS
              </a>
              <a class="btn btn-ghost" target="_blank" rel="noopener">
                <xsl:attribute name="href">https://feedly.com/i/subscription/feed/<xsl:value-of select="rss/channel/atom:link/@href" /></xsl:attribute>
                Adicionar ao Feedly
              </a>
              <a class="btn btn-ghost">
                <xsl:attribute name="href"><xsl:value-of select="rss/channel/link" /></xsl:attribute>
                Voltar ao blog
              </a>
            </div>
          </header>

          <ul class="items">
            <xsl:for-each select="rss/channel/item">
              <li class="item">
                <div class="meta">
                  <span><xsl:value-of select="substring(pubDate, 6, 11)" /></span>
                  <xsl:if test="category">
                    <span class="dot"></span>
                    <span class="cat"><xsl:value-of select="category" /></span>
                  </xsl:if>
                </div>
                <h2>
                  <a>
                    <xsl:attribute name="href"><xsl:value-of select="link" /></xsl:attribute>
                    <xsl:value-of select="title" />
                  </a>
                </h2>
                <p class="desc"><xsl:value-of select="description" /></p>
              </li>
            </xsl:for-each>
          </ul>

          <footer>
            <span>Agility Creative · <a href="/blog">/blog</a></span>
            <span>Spec: <a href="https://www.rssboard.org/rss-specification" rel="noopener">RSS 2.0</a></span>
          </footer>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
