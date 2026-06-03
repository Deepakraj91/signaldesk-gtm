import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";

const port = Number(process.env.PORT || 3000);
const distRoot = path.resolve("dist");
const tavilyKey = process.env.TAVILY_API_KEY;

const cryptoCompetitors = ["Koinly", "CoinTracker", "TaxBit", "TokenTax", "CoinLedger", "Binance Tax"];
const exchangeHints = ["Coinbase", "Binance", "Kraken", "Gemini", "Crypto.com", "SwissBorg", "Bitstamp", "Robinhood", "OKX", "Bybit", "Bitget", "KuCoin", "Bitpanda", "eToro"];

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon"
};

const demoResults = [
  {
    id: "demo-coinbase",
    company: "Coinbase",
    initials: "C",
    color: "#0d6efd",
    title: "Coinbase integrated CoinTracker crypto tax software into its exchange platform",
    date: "2026-05-21",
    activityDate: new Date().toISOString(),
    email: ".....@coinbase.com",
    sourceType: "Partner page",
    confidence: 91,
    score: 97,
    liveScore: 97,
    accountFit: "Enterprise exchange",
    gtmStage: "High intent",
    outreachAngle: "Reference the CoinTracker rollout and ask whether Coinbase is evaluating additional automation around tax support, user exports, or compliance reporting.",
    competitors: ["CoinTracker", "TaxBit", "Koinly"],
    trigger: "Tax software integration",
    expandedSummary: "Coinbase is a major cryptocurrency exchange platform serving both retail and institutional users, and has integrated CoinTracker's crypto tax software to assist users with tax reporting.",
    relevance: "This is demo data. Add TAVILY_API_KEY on Render to turn this into real-time web search.",
    evidence: [{ label: "Demo evidence placeholder", type: "Partner page", url: "https://example.com" }],
    timeline: ["Demo signal shown because live search is not configured", "Add a search API key in Render environment variables", "Redeploy the web service"],
    contacts: ["Head of Product", "Tax Operations Lead", "Head of Compliance"]
  }
];

function sendJson(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

function classifySource(result) {
  const text = `${result.title || ""} ${result.url || ""} ${result.content || ""}`.toLowerCase();
  if (text.includes("press") || text.includes("prnewswire") || text.includes("businesswire")) return "Press release";
  if (text.includes("case-study") || text.includes("customer story") || text.includes("case study")) return "Case study";
  if (text.includes("blog")) return "Blog";
  if (text.includes("support") || text.includes("help") || text.includes("docs")) return "Product update";
  if (text.includes("partner") || text.includes("integration")) return "Partner page";
  return "News article";
}

function detectCompany(result) {
  const haystack = `${result.title || ""} ${result.content || ""}`;
  const known = exchangeHints.find((name) => haystack.toLowerCase().includes(name.toLowerCase()));
  if (known) return known;
  const title = (result.title || "Unknown company").replace(/[|:–-].*$/, "").trim();
  return title.split(/\s+/).slice(0, 3).join(" ");
}

function initials(company) {
  return company.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function domainFromUrl(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "company.com";
  }
}

function detectCompetitors(result) {
  const haystack = `${result.title || ""} ${result.content || ""}`.toLowerCase();
  const matches = cryptoCompetitors.filter((name) => haystack.includes(name.toLowerCase()));
  return matches.length ? matches : ["Competitor signal found"];
}

function normalizeResult(result, index, query) {
  const company = detectCompany(result);
  const sourceType = classifySource(result);
  const competitors = detectCompetitors(result);
  const domain = domainFromUrl(result.url);
  const hasPartner = /partner|integrat|rollout|launch|announce/i.test(`${result.title} ${result.content}`);
  const confidence = Math.min(95, 68 + competitors.length * 7 + (hasPartner ? 12 : 0));

  return {
    id: `live-${index}-${company.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    company,
    initials: initials(company),
    color: ["#0d6efd", "#14b8a6", "#111827", "#6d28d9", "#0f766e"][index % 5],
    title: result.title || `${company} matched your GTM signal`,
    date: result.published_date || new Date().toISOString().slice(0, 10),
    activityDate: new Date().toISOString(),
    email: `.....@${domain}`,
    sourceType,
    confidence,
    score: confidence + 8,
    liveScore: confidence + 8,
    accountFit: /exchange|trading|crypto|wallet/i.test(`${result.title} ${result.content}`) ? "Crypto platform" : "Target account",
    gtmStage: confidence >= 88 ? "High intent" : confidence >= 80 ? "Expansion" : "Education",
    outreachAngle: `Reference this ${sourceType.toLowerCase()} and connect it to your query: "${query.slice(0, 120)}${query.length > 120 ? "..." : ""}". Ask who owns the initiative and whether they are evaluating vendors or integrations.`,
    competitors,
    trigger: hasPartner ? "Public rollout or partnership signal" : "Relevant market signal",
    expandedSummary: result.content || result.title || `${company} matched this outbound signal.`,
    relevance: "This account appeared in live web results for your GTM query and has source evidence you can cite in outbound sales outreach.",
    evidence: [{ label: result.title || domain, type: sourceType, url: result.url }],
    timeline: ["Live web result found", `${sourceType} classified from source URL and content`, "Review evidence before sequencing outreach"],
    contacts: ["Head of Product", "VP Operations", "Head of Partnerships", "Head of Compliance"]
  };
}

async function tavilySearch(query) {
  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tavilyKey}`
    },
    body: JSON.stringify({
      query,
      search_depth: "advanced",
      max_results: 10,
      include_answer: false,
      include_raw_content: false
    })
  });

  if (!response.ok) {
    throw new Error(`Search provider returned ${response.status}`);
  }

  return response.json();
}

async function handleSignals(req, res) {
  try {
    const body = await readBody(req);
    const query = String(body.query || "").trim();
    if (!query) {
      sendJson(res, 400, { error: "Query is required." });
      return;
    }

    if (!tavilyKey) {
      sendJson(res, 200, {
        mode: "demo",
        message: "Live web search is not configured yet. Add TAVILY_API_KEY to the Render service environment variables.",
        results: demoResults
      });
      return;
    }

    const search = await tavilySearch(query);
    const results = (search.results || []).map((result, index) => normalizeResult(result, index, query));

    sendJson(res, 200, {
      mode: "live",
      message: `Found ${results.length} live web results.`,
      results
    });
  } catch (error) {
    sendJson(res, 500, {
      error: "Signal search failed.",
      detail: error instanceof Error ? error.message : String(error)
    });
  }
}

function safeFilePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const requested = path.normalize(decoded === "/" ? "/index.html" : decoded);
  const filePath = path.join(distRoot, requested);
  return filePath.startsWith(distRoot) ? filePath : path.join(distRoot, "index.html");
}

async function serveStatic(req, res) {
  try {
    const filePath = safeFilePath(req.url || "/");
    const ext = path.extname(filePath);
    const data = await fs.readFile(filePath);
    res.writeHead(200, {
      "Content-Type": mime[ext] || "application/octet-stream",
      "Cache-Control": ext === ".html" ? "no-store" : "public, max-age=31536000, immutable"
    });
    res.end(data);
  } catch {
    const data = await fs.readFile(path.join(distRoot, "index.html"));
    res.writeHead(200, { "Content-Type": mime[".html"], "Cache-Control": "no-store" });
    res.end(data);
  }
}

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/api/signals") {
    handleSignals(req, res);
    return;
  }
  serveStatic(req, res);
});

server.listen(port, () => {
  console.log(`SignalDesk GTM listening on ${port}`);
});
