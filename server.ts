import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import * as cheerio from "cheerio";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Fetch Metadata for URL
  app.get("/api/metadata", async (req, res) => {
    const { url } = req.query;
    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "URL is required" });
    }

    try {
      const response = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        },
        timeout: 5000
      });
      const $ = cheerio.load(response.data);

      const metadata = {
        title: $("meta[property='og:title']").attr("content") || $("title").text() || "",
        description: $("meta[property='og:description']").attr("content") || $("meta[name='description']").attr("content") || "",
        thumbnail: $("meta[property='og:image']").attr("content") || "",
        favicon: $("link[rel='icon']").attr("href") || $("link[rel='shortcut icon']").attr("href") || "",
        domain: new URL(url).hostname,
        url: url
      };

      // Fix favicon path if relative
      if (metadata.favicon && !metadata.favicon.startsWith("http")) {
        const urlObj = new URL(url);
        metadata.favicon = `${urlObj.origin}${metadata.favicon.startsWith("/") ? "" : "/"}${metadata.favicon}`;
      }

      res.json(metadata);
    } catch (error) {
      console.error("Metadata fetch error:", error);
      res.status(500).json({ error: "Failed to fetch metadata" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
