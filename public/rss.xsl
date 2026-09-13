<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:media="http://search.yahoo.com/mrss/">
  <xsl:output method="html" encoding="UTF-8" indent="yes" />
  <xsl:template match="/">
    <html lang="de">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <title><xsl:value-of select="rss/channel/title" /> – RSS-Feed</title>
        <style>
          :root { color-scheme: light; }
          body { margin: 0; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; background: #f7f5ef; color: #1b2330; line-height: 1.6; }
          header { background: #03122b; color: #fff; padding: 40px 20px; }
          .wrap { max-width: 820px; margin: 0 auto; padding: 0 20px; }
          header p { color: rgba(255,255,255,.75); margin: 8px 0 0; }
          .hinweis { background: #fff; border-radius: 16px; padding: 18px 20px; margin: -24px auto 28px; max-width: 780px; box-shadow: 0 10px 30px -15px rgba(3,18,43,.4); }
          code { background: #eef2e6; padding: 2px 6px; border-radius: 6px; word-break: break-all; }
          article { background: #fff; border-radius: 16px; padding: 20px; margin: 0 0 16px; border: 1px solid #e3e6ea; }
          article h2 { margin: 0 0 6px; font-size: 20px; line-height: 1.3; }
          article a { color: #3f611d; }
          .meta { font-size: 13px; color: #4b5563; }
        </style>
      </head>
      <body>
        <header>
          <div class="wrap">
            <strong style="color:#8cc152;letter-spacing:.14em;font-size:13px">RSS-FEED</strong>
            <h1 style="margin:6px 0 0;font-size:30px"><xsl:value-of select="rss/channel/title" /></h1>
            <p><xsl:value-of select="rss/channel/description" /></p>
          </div>
        </header>
        <div class="wrap">
          <div class="hinweis">
            Diese Seite ist ein <strong>RSS-Feed</strong>. Kopieren Sie die Adresse in Ihren Feed-Reader (z. B. Feedly, Inoreader, Outlook), um neue Beiträge automatisch zu erhalten:
            <br /><code><xsl:value-of select="rss/channel/*[local-name()='link' and @rel='self']/@href" /></code>
          </div>
          <xsl:for-each select="rss/channel/item">
            <article>
              <h2><a href="{link}"><xsl:value-of select="title" /></a></h2>
              <div class="meta"><xsl:value-of select="category" /> · <xsl:value-of select="substring(pubDate, 6, 11)" /></div>
              <p><xsl:value-of select="description" /></p>
            </article>
          </xsl:for-each>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
