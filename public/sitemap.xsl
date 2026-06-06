<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" version="5.0" encoding="UTF-8" indent="yes" omit-xml-declaration="yes" />
  <xsl:template match="/">
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <title>Agility Creative — Sitemap</title>
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
            font-size: 14px;
            line-height: 1.55;
            -webkit-font-smoothing: antialiased;
          }
          .wrap { max-width: 1100px; margin: 0 auto; padding: 56px 24px 96px; }
          header { padding-bottom: 28px; border-bottom: 1px solid var(--border); margin-bottom: 28px; }
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
            font-size: 36px;
            font-weight: 600;
            letter-spacing: -0.02em;
            margin: 0;
            line-height: 1.1;
          }
          p.lede {
            color: var(--text-muted);
            margin: 14px 0 0;
            max-width: 640px;
            font-size: 16px;
            line-height: 1.55;
          }
          .meta {
            display: flex;
            gap: 24px;
            margin-top: 24px;
            color: var(--text-muted);
            font-size: 12px;
            flex-wrap: wrap;
          }
          .meta strong { color: var(--text); font-weight: 600; font-feature-settings: "tnum"; }
          .table {
            border: 1px solid var(--border);
            border-radius: 16px;
            overflow: hidden;
            background: var(--surface);
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
          }
          .row {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 160px 90px 70px;
            gap: 20px;
            padding: 14px 20px;
            border-bottom: 1px solid var(--border);
            align-items: center;
          }
          .row:last-child { border-bottom: 0; }
          .row.head {
            background: rgba(0, 0, 0, 0.02);
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: var(--text-muted);
            padding-top: 12px;
            padding-bottom: 12px;
          }
          a.loc {
            color: var(--text);
            text-decoration: none;
            font-weight: 500;
            word-break: break-all;
          }
          a.loc:hover { color: var(--accent); }
          .lastmod, .changefreq, .priority {
            color: var(--text-muted);
            font-feature-settings: "tnum";
            font-size: 12px;
          }
          .priority { text-align: right; font-weight: 600; color: var(--text); }
          .pill {
            display: inline-block;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            padding: 3px 8px;
            border-radius: 999px;
            background: rgba(0, 0, 0, 0.04);
            color: var(--text-muted);
          }
          footer {
            margin-top: 32px;
            color: var(--text-dim);
            font-size: 12px;
            display: flex;
            justify-content: space-between;
            gap: 16px;
            flex-wrap: wrap;
          }
          footer a { color: inherit; text-decoration: underline; text-decoration-color: var(--border-strong); }
          @media (max-width: 720px) {
            .wrap { padding: 36px 18px 64px; }
            h1 { font-size: 28px; }
            .row { grid-template-columns: minmax(0, 1fr); gap: 6px; padding: 14px 16px; }
            .row.head { display: none; }
            .lastmod::before { content: "Atualizado: "; color: var(--text-dim); }
            .changefreq::before { content: "Freq.: "; color: var(--text-dim); }
            .priority { text-align: left; }
            .priority::before { content: "Prioridade: "; color: var(--text-dim); font-weight: 400; }
          }
        </style>
      </head>
      <body>
        <main class="wrap">
          <header>
            <p class="eyebrow">Sitemap</p>
            <h1>Páginas indexáveis do site</h1>
            <p class="lede">
              Esta página existe para mecanismos de busca. Cada linha é uma URL canônica
              com seu <em>last-modified</em>, frequência sugerida de atualização e prioridade
              relativa.
            </p>
            <div class="meta">
              <span><strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)" /></strong> URLs</span>
              <span>XML em <a href="?raw=1" style="color:inherit;">formato bruto</a> também disponível</span>
            </div>
          </header>

          <section class="table" aria-label="Lista de URLs">
            <div class="row head">
              <span>URL</span>
              <span>Last-modified</span>
              <span>Freq.</span>
              <span>Prio.</span>
            </div>
            <xsl:for-each select="sitemap:urlset/sitemap:url">
              <div class="row">
                <a class="loc">
                  <xsl:attribute name="href"><xsl:value-of select="sitemap:loc" /></xsl:attribute>
                  <xsl:value-of select="sitemap:loc" />
                </a>
                <span class="lastmod">
                  <xsl:value-of select="substring(sitemap:lastmod, 1, 10)" />
                </span>
                <span class="changefreq">
                  <span class="pill"><xsl:value-of select="sitemap:changefreq" /></span>
                </span>
                <span class="priority"><xsl:value-of select="sitemap:priority" /></span>
              </div>
            </xsl:for-each>
          </section>

          <footer>
            <span>Agility Creative · <a href="/">agilitycreative.com</a></span>
            <span>Spec: <a href="https://www.sitemaps.org/protocol.html" rel="noopener">sitemaps.org</a></span>
          </footer>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
