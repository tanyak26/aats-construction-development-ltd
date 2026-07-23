const fs = require("fs");
const http = require("http");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT || 3300);

const routes = new Map([
  ["", "index.html"],
  ["about", "about.html"],
  ["services", "services.html"],
  ["activities", "activities.html"],
  ["faq", "faq.html"],
  ["contact", "contact.html"],
  ["favicon.svg", "assets/favicon.svg"],
]);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

function sendFile(res, filePath) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(error.code === "ENOENT" ? 404 : 500, {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      });
      res.end(error.code === "ENOENT" ? "Not found" : "Server error");
      return;
    }

    res.writeHead(200, {
      "Content-Type": types[path.extname(filePath)] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const cleanPath = decodeURIComponent(url.pathname).replace(/^\/+/, "");

  if (/^google[a-z0-9]+\.html$/i.test(cleanPath)) {
    sendFile(res, path.resolve(root, cleanPath));
    return;
  }

  if (url.pathname.endsWith(".html")) {
    const cleanUrl = url.pathname === "/index.html" ? "/" : url.pathname.replace(/\.html$/, "");
    res.writeHead(301, {
      Location: cleanUrl + url.search,
      "X-Content-Type-Options": "nosniff",
    });
    res.end();
    return;
  }

  const requestedPath = routes.get(cleanPath) || cleanPath || "index.html";
  const filePath = path.resolve(root, requestedPath);

  if (!filePath.startsWith(root)) {
    res.writeHead(403, { "X-Content-Type-Options": "nosniff" });
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, (error, stats) => {
    if (!error && stats.isDirectory()) {
      sendFile(res, path.join(filePath, "index.html"));
      return;
    }

    if (!error && stats.isFile()) {
      sendFile(res, filePath);
      return;
    }

    sendFile(res, path.join(root, "index.html"));
  });
});

server.listen(port, () => {
  console.log(`AATS Construction and Development site running at http://127.0.0.1:${port}`);
});
