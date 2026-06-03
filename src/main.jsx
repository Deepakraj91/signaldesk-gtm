import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const sourceTypes = ["Case study", "Press release", "Product update", "News article", "Partner page", "Blog"];
const sourceLabels = {
  "Case study": "Case studies",
  "Press release": "PRs",
  "Product update": "Product updates",
  "News article": "News",
  "Partner page": "Partner pages",
  Blog: "Blogs"
};
const keywordOptions = [
  { key: "tax", label: "Tax software" },
  { key: "exchange", label: "Crypto exchange" },
  { key: "partner", label: "Partnership" },
  { key: "custody", label: "Custody" },
  { key: "wallet", label: "Wallet" }
];

const contactPriority = {
  "Tax software integration": "Head of Product",
  "Preferred tax platform partnership": "Head of Partnerships",
  "Native tax product rollout": "Tax Product Manager",
  "Multi-partner tax reporting": "Head of Marketplace",
  "1099 and API tax reporting": "Tax Operations Lead",
  "TaxBit integration expansion": "Head of Compliance",
  "Tax export enhancement": "Product Manager",
  "Third-party tax software guidance": "Content Partnerships"
};

const companies = [
  {
    id: "coinbase",
    company: "Coinbase",
    initials: "C",
    color: "#0d6efd",
    title: "Coinbase integrated CoinTracker crypto tax software into its exchange platform",
    date: "2026-05-21",
    activityDate: "2026-06-03T09:38:00",
    email: ".....@coinbase.com",
    sourceType: "Partner page",
    confidence: 91,
    score: 97,
    accountFit: "Enterprise exchange",
    gtmStage: "High intent",
    outreachAngle: "Reference the CoinTracker rollout and ask whether Coinbase is evaluating additional automation around tax support, user exports, or compliance reporting.",
    competitors: ["CoinTracker", "TaxBit", "Koinly"],
    trigger: "Tax software integration",
    expandedSummary: "Coinbase is a major cryptocurrency exchange platform serving both retail and institutional users, and has integrated CoinTracker's crypto tax software to assist users with tax reporting.",
    relevance: "This partnership and integration positions Coinbase as an active player in rolling out crypto tax solutions, making them a relevant target for tax compliance and reporting products or services.",
    evidence: [
      { label: "Partner integration mention", type: "Partner page", url: "https://example.com/coinbase-cointracker" },
      { label: "User tax reporting workflow", type: "Product update", url: "https://example.com/coinbase-tax-center" }
    ],
    timeline: ["Integration language detected", "Competitor TaxBit also appears in surrounding market coverage", "Best outreach angle: simplify user tax filing during peak season"],
    contacts: ["Head of Product", "Tax Operations Lead", "Head of Compliance"]
  },
  {
    id: "swissborg",
    company: "SwissBorg",
    initials: "SB",
    color: "#14b8a6",
    title: "SwissBorg announced a partnership with Koinly as its preferred crypto tax platform partner",
    date: "2026-05-10",
    activityDate: "2026-06-03T09:38:00",
    email: ".....@swissborg.com",
    sourceType: "Press release",
    confidence: 88,
    score: 93,
    accountFit: "Retail wealth platform",
    gtmStage: "High intent",
    outreachAngle: "Lead with their Koinly partnership and ask if the team is trying to increase tax-report adoption or improve partner conversion from SwissBorg users.",
    competitors: ["Koinly", "CoinLedger"],
    trigger: "Preferred tax platform partnership",
    expandedSummary: "SwissBorg is a cryptocurrency exchange and wealth management platform that serves retail and institutional users, and they have officially announced a partnership with Koinly as their preferred crypto tax platform partner.",
    relevance: "This announcement included exclusive discount codes, step-by-step integration instructions for exporting SwissBorg transaction data into Koinly, and special offers for loyalty-ranked members and Pegasus Club users, highlighting an active rollout of crypto tax software integration.",
    evidence: [
      { label: "Partnership announcement", type: "Press release", url: "https://example.com/swissborg-koinly" },
      { label: "Tax help article", type: "Blog", url: "https://example.com/swissborg-tax-reporting" }
    ],
    timeline: ["Partnership phrasing found", "Koinly named as preferred provider", "Likely buyer: product partnerships or compliance"],
    contacts: ["VP Operations", "Head of Partnerships", "Compliance Lead"]
  },
  {
    id: "binance",
    company: "Binance",
    initials: "B",
    color: "#111827",
    title: "Binance rolled out its Binance Tax calculator and reporting tool",
    date: "2026-04-28",
    activityDate: "2026-06-03T09:38:00",
    email: ".....@binance.com",
    sourceType: "Product update",
    confidence: 84,
    score: 90,
    accountFit: "Global exchange",
    gtmStage: "Expansion",
    outreachAngle: "Position the message around Binance Tax as evidence of internal investment, then offer a benchmark on automation, localization, or compliance coverage.",
    competitors: ["Internal build", "Koinly", "CoinTracker"],
    trigger: "Native tax product rollout",
    expandedSummary: "Binance is the world's largest cryptocurrency exchange by trading volume and has launched Binance Tax, a proprietary crypto tax calculator and reporting tool for users.",
    relevance: "This rollout of a dedicated tax solution aligns with recent news coverage and positions Binance as a relevant target for providers of tax compliance, reporting, or integration services for crypto platforms.",
    evidence: [
      { label: "Tax calculator product note", type: "Product update", url: "https://example.com/binance-tax" },
      { label: "Market article mentioning rollout", type: "News article", url: "https://example.com/binance-tax-news" }
    ],
    timeline: ["Native feature rollout detected", "Competitors referenced in tax comparison content", "Useful for feature gap analysis"],
    contacts: ["Head of Product", "Tax Product Manager", "Regional Compliance"]
  },
  {
    id: "cryptocom",
    company: "Crypto.com",
    initials: "CD",
    color: "#1e3a8a",
    title: "Crypto.com launched tax reporting partnerships with Koinly and TokenTax",
    date: "2026-04-12",
    activityDate: "2026-06-03T09:38:00",
    email: ".....@crypto.com",
    sourceType: "Blog",
    confidence: 86,
    score: 89,
    accountFit: "Exchange and wallet",
    gtmStage: "Competitor active",
    outreachAngle: "Mention the Koinly and TokenTax partnerships, then ask who owns tax partner performance and user activation across the marketplace.",
    competitors: ["Koinly", "TokenTax", "TaxBit"],
    trigger: "Multi-partner tax reporting",
    expandedSummary: "Crypto.com is a global cryptocurrency exchange and wallet ecosystem serving retail users, and it has launched tax reporting partnerships with Koinly and TokenTax.",
    relevance: "Multiple named tax partners indicate a partner marketplace motion and an active effort to make crypto tax workflows easier for users during filing season.",
    evidence: [
      { label: "Tax partner roundup", type: "Blog", url: "https://example.com/cryptocom-tax-partners" },
      { label: "Support article on tax exports", type: "Case study", url: "https://example.com/cryptocom-tax-support" }
    ],
    timeline: ["Tax export flow detected", "Multiple vendors named", "Angle: partner marketplace performance"],
    contacts: ["Head of Marketplace", "VP Product", "Lifecycle Marketing Lead"]
  },
  {
    id: "robinhood",
    company: "Robinhood",
    initials: "RH",
    color: "#baff00",
    title: "Robinhood is rolling out API-based crypto tax reporting and 1099 delivery",
    date: "2026-03-19",
    activityDate: "2026-06-03T09:38:00",
    email: ".....@robinhood.com",
    sourceType: "News article",
    confidence: 79,
    score: 84,
    accountFit: "Trading platform",
    gtmStage: "Expansion",
    outreachAngle: "Tie the note to 1099 delivery and API-based reporting, then offer a conversation around reducing support load during tax season.",
    competitors: ["TaxBit", "CoinTracker"],
    trigger: "1099 and API tax reporting",
    expandedSummary: "Robinhood is a major trading platform offering cryptocurrency trading to retail users, and it is rolling out API-based crypto tax reporting and 1099 delivery.",
    relevance: "This signal points to compliance reporting infrastructure, tax-form delivery, and automated data access as active product priorities for the company.",
    evidence: [
      { label: "1099 reporting coverage", type: "News article", url: "https://example.com/robinhood-1099-crypto" },
      { label: "Tax API note", type: "Product update", url: "https://example.com/robinhood-tax-api" }
    ],
    timeline: ["Tax API phrase found", "1099 delivery mentioned", "Best outreach angle: automation and support deflection"],
    contacts: ["Tax Operations Lead", "Head of Compliance", "Support Operations"]
  },
  {
    id: "gemini",
    company: "Gemini",
    initials: "G",
    color: "#111827",
    title: "Gemini expanded crypto tax reporting by integrating TaxBit across its exchange",
    date: "2026-02-26",
    activityDate: "2026-06-03T09:38:00",
    email: ".....@gemini.com",
    sourceType: "Case study",
    confidence: 92,
    score: 96,
    accountFit: "Regulated exchange",
    gtmStage: "High intent",
    outreachAngle: "Use the TaxBit deployment as the opener and ask whether Gemini is expanding tax-center coverage for CESOP, DAC8, or other reporting regimes.",
    competitors: ["TaxBit", "Koinly"],
    trigger: "TaxBit integration expansion",
    expandedSummary: "Gemini is a cryptocurrency exchange and custodian that partnered with TaxBit to deploy tax-center technology for automating crypto tax reporting.",
    relevance: "These integrations highlight Gemini's active rollout of crypto tax software and tax reporting partnerships, making it a strong target for adjacent compliance and reporting products.",
    evidence: [
      { label: "TaxBit customer story", type: "Case study", url: "https://example.com/gemini-taxbit-case-study" },
      { label: "CESOP reporting solution note", type: "Press release", url: "https://example.com/gemini-cesop" }
    ],
    timeline: ["Customer story found", "CESOP language detected", "Likely buyer: compliance and product operations"],
    contacts: ["Head of Compliance", "VP Operations", "Product Lead"]
  },
  {
    id: "kraken",
    company: "Kraken",
    initials: "K",
    color: "#6d28d9",
    title: "Kraken improved exchange tax exports and added partner-led reporting guidance",
    date: "2026-02-18",
    activityDate: "2026-06-03T09:38:00",
    email: ".....@kraken.com",
    sourceType: "Product update",
    confidence: 76,
    score: 80,
    accountFit: "Advanced trading exchange",
    gtmStage: "Education",
    outreachAngle: "Reference the tax export update and partner guidance, then suggest a short comparison of direct integrations versus export-led workflows.",
    competitors: ["CoinTracker", "Koinly"],
    trigger: "Tax export enhancement",
    expandedSummary: "Kraken is a cryptocurrency exchange serving advanced and retail users, and it improved exchange tax exports while adding partner-led tax reporting guidance.",
    relevance: "The signal is less direct than a formal integration, but the source language still shows tax workflow investment and competitor visibility around crypto tax tools.",
    evidence: [
      { label: "Tax export update", type: "Product update", url: "https://example.com/kraken-tax-export" },
      { label: "Partner guidance page", type: "Partner page", url: "https://example.com/kraken-tax-partners" }
    ],
    timeline: ["Export feature update found", "Two competitor names nearby", "Angle: tax workflow conversion"],
    contacts: ["Product Manager", "Head of Operations", "Compliance Lead"]
  },
  {
    id: "bitstamp",
    company: "Bitstamp",
    initials: "BS",
    color: "#0f766e",
    title: "Bitstamp published new tax reporting guidance with third-party tax software options",
    date: "2026-01-29",
    activityDate: "2026-06-03T09:38:00",
    email: ".....@bitstamp.net",
    sourceType: "Blog",
    confidence: 71,
    score: 74,
    accountFit: "Established exchange",
    gtmStage: "Education",
    outreachAngle: "Use the tax guidance update as a soft signal and ask whether Bitstamp is considering deeper integrations with third-party tax platforms.",
    competitors: ["Koinly", "TokenTax", "CoinLedger"],
    trigger: "Third-party tax software guidance",
    expandedSummary: "Bitstamp is an established cryptocurrency exchange that published updated tax reporting guidance with third-party crypto tax software options.",
    relevance: "This is a softer but still useful buying signal because it shows Bitstamp directing users toward tax tooling and partner-style reporting workflows.",
    evidence: [
      { label: "Tax reporting guide", type: "Blog", url: "https://example.com/bitstamp-tax-guide" },
      { label: "Help center export note", type: "Product update", url: "https://example.com/bitstamp-export" }
    ],
    timeline: ["Tax guide updated", "Three vendor names detected", "Angle: convert content partnership into integration"],
    contacts: ["Content Partnerships", "Head of Product", "Tax Operations"]
  }
];

function App() {
  const [query, setQuery] = useState("Crypto exchanges or crypto trading platforms that implemented, launched, integrated, partnered with, or rolled out crypto tax software, tax reporting tools, 1099 reporting, DAC8/CESOP reporting, or tax platform partnerships from 2026 till now.");
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState("2026-06-03");
  const [selectedSources, setSelectedSources] = useState(sourceTypes);
  const [keywords, setKeywords] = useState(["tax", "exchange", "partner"]);
  const [sortBy, setSortBy] = useState("score");
  const [active, setActive] = useState(false);
  const [drawerCompany, setDrawerCompany] = useState(null);
  const [toast, setToast] = useState("");
  const [liveResults, setLiveResults] = useState(null);
  const [searchState, setSearchState] = useState({ loading: false, mode: "seed", message: "Showing seeded sample accounts. Run a live search to fetch current signals." });

  const seedResults = useMemo(() => {
    const queryTerms = query.toLowerCase().split(/[^a-z0-9]+/).filter((term) => term.length > 3);
    const selectedKeywordSet = new Set(keywords);

    return companies
      .filter((company) => {
        const date = new Date(company.date);
        const searchable = `${company.title} ${company.expandedSummary} ${company.relevance} ${company.trigger} ${company.competitors.join(" ")}`.toLowerCase();
        const keywordMatch = selectedKeywordSet.size === 0 || [...selectedKeywordSet].some((keyword) => searchable.includes(keyword));
        return date >= new Date(startDate) && date <= new Date(endDate) && selectedSources.includes(company.sourceType) && keywordMatch;
      })
      .map((company) => {
        const searchable = `${company.title} ${company.expandedSummary} ${company.relevance} ${company.trigger} ${company.competitors.join(" ")}`.toLowerCase();
        const matches = queryTerms.filter((term) => searchable.includes(term)).length;
        return { ...company, liveScore: company.score + Math.min(8, matches) };
      })
      .sort((a, b) => {
        if (sortBy === "date") return new Date(b.date) - new Date(a.date);
        if (sortBy === "confidence") return b.confidence - a.confidence;
        return b.liveScore - a.liveScore;
      });
  }, [endDate, keywords, query, selectedSources, sortBy, startDate]);

  const results = useMemo(() => {
    const base = liveResults || seedResults;
    return [...base].sort((a, b) => {
      if (sortBy === "date") return new Date(b.date) - new Date(a.date);
      if (sortBy === "confidence") return b.confidence - a.confidence;
      return (b.liveScore || b.score) - (a.liveScore || a.score);
    });
  }, [liveResults, seedResults, sortBy]);

  const stats = useMemo(() => ({
    highIntent: results.filter((result) => result.gtmStage === "High intent").length,
    contacts: new Set(results.flatMap((result) => result.contacts)).size,
    confidence: results.length ? Math.round(results.reduce((sum, result) => sum + result.confidence, 0) / results.length) : 0
  }), [results]);

  function flash(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  async function runSignalSearch() {
    setSearchState({ loading: true, mode: "searching", message: "Searching the web for fresh GTM signals..." });
    try {
      const response = await fetch("/api/signals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          startDate,
          endDate,
          sourceTypes: selectedSources,
          keywords
        })
      });
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error("This URL is serving the static UI only. Deploy the Render Web Service to enable /api/signals.");
      }
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Search failed.");
      setLiveResults(payload.results || []);
      setSearchState({
        loading: false,
        mode: payload.mode || "live",
        message: payload.message || `Found ${(payload.results || []).length} signals.`
      });
      flash(payload.mode === "live" ? "Live signal search complete." : "Search backend responded in demo mode.");
    } catch (error) {
      setSearchState({
        loading: false,
        mode: "error",
        message: error instanceof Error ? error.message : "Search failed."
      });
      flash("Signal search failed. Check backend configuration.");
    }
  }

  function toggleKeyword(key) {
    setKeywords((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]);
  }

  function toggleSource(source) {
    setSelectedSources((current) => current.includes(source) ? current.filter((item) => item !== source) : [...current, source]);
  }

  function exportCsv() {
    const header = ["Company", "Signal", "GTM Stage", "Primary Contact", "Outreach Angle", "Date", "Source Type", "Confidence", "Competitors", "Summary"];
    const csv = [header, ...results.map((row) => [
      row.company,
      row.title,
      row.gtmStage,
      contactPriority[row.trigger] || row.contacts[0],
      row.outreachAngle,
      row.date,
      row.sourceType,
      `${row.confidence}%`,
      row.competitors.join("; "),
      row.expandedSummary
    ])]
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "crypto-tax-integration-signals.csv";
    link.click();
    URL.revokeObjectURL(url);
    flash("CSV exported with the current preview results.");
  }

  return (
    <>
      <Sidebar />
      <main className="shell">
        <header className="topbar">
          <button className="icon-button" title="Back" aria-label="Back">{"<"}</button>
          <div>
            <h1>GTM Signals for Crypto Tax Outreach</h1>
            <span className={`status-pill ${active ? "active" : ""}`}>{active ? "Active" : "Inactive"}</span>
          </div>
          <div className="top-actions">
            <button className="ghost-button" onClick={runSignalSearch} disabled={searchState.loading}>
              {searchState.loading ? "Searching..." : "Search Live Signals"}
            </button>
            <button className="primary-button" onClick={() => {
              setActive((value) => !value);
              flash(active ? "Signal paused." : "Signal activated. New outbound-ready accounts will be monitored daily.");
            }}>{active ? "Pause Signal" : "Activate Signal"}</button>
            <button className="icon-button" title="Export CSV" aria-label="Export CSV" onClick={exportCsv}>v</button>
          </div>
        </header>

        <section className="workspace">
          <SignalBuilder
            query={query}
            setQuery={setQuery}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            keywords={keywords}
            toggleKeyword={toggleKeyword}
            selectedSources={selectedSources}
            toggleSource={toggleSource}
          />
          <Results
            results={results}
            stats={stats}
            sortBy={sortBy}
            setSortBy={setSortBy}
            openDrawer={setDrawerCompany}
            searchState={searchState}
            usingLiveResults={Boolean(liveResults)}
          />
        </section>
      </main>

      <CompanyDrawer company={drawerCompany} close={() => setDrawerCompany(null)} />
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}

function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Main navigation">
      <div className="brand">
        <span className="brand-mark">S</span>
        <span>SignalDesk GTM</span>
      </div>
      <nav>
        {["Home", "Signals", "Accounts", "Contacts", "Activity"].map((item, index) => (
          <a className={`nav-item ${index === 0 ? "active" : ""}`} href="#" key={item}><span>{index + 1}</span>{item}</a>
        ))}
      </nav>
      <div className="sidebar-card">
        <span className="label">Credits</span>
        <strong>78 / 200</strong>
        <div className="meter"><span /></div>
      </div>
      <div className="profile">
        <div className="avatar">DR</div>
        <div>
          <strong>Deepak Raj</strong>
          <span>Workspace owner</span>
        </div>
      </div>
    </aside>
  );
}

function SignalBuilder({ query, setQuery, startDate, setStartDate, endDate, setEndDate, keywords, toggleKeyword, selectedSources, toggleSource }) {
  return (
    <section className="builder" aria-label="Signal builder">
      <div className="panel">
        <div className="panel-head">
          <span className="step">1</span>
          <h2>What buying signals should we monitor?</h2>
        </div>
        <label htmlFor="query">Outbound signal query</label>
        <textarea id="query" rows="7" value={query} onChange={(event) => setQuery(event.target.value)} />
        <div className="quick-row">
          {keywordOptions.map((option) => (
            <button
              className={`chip ${keywords.includes(option.key) ? "selected" : ""}`}
              key={option.key}
              onClick={() => toggleKeyword(option.key)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <span className="step">2</span>
          <h2>GTM filters and evidence</h2>
        </div>
        <div className="grid-two">
          <label>Start date
            <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
          </label>
          <label>End date
            <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
          </label>
        </div>
        <div className="source-grid">
          {sourceTypes.map((source) => (
            <label key={source}>
              <input type="checkbox" checked={selectedSources.includes(source)} onChange={() => toggleSource(source)} />
              {sourceLabels[source]}
            </label>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <span className="step">3</span>
          <h2>Who should we contact?</h2>
        </div>
        <label htmlFor="titles">Buying committee titles</label>
        <input id="titles" defaultValue="Head of Product, VP Operations, Head of Compliance, Tax Operations Lead" />
        <div className="hint-box">
          SignalDesk will turn each account signal into an outbound-ready lead with a contact persona, source-backed reason, and suggested outreach angle.
        </div>
      </div>
    </section>
  );
}

function Results({ results, stats, sortBy, setSortBy, openDrawer, searchState, usingLiveResults }) {
  return (
    <section className="results" aria-label="Preview results">
      <div className="results-head">
        <div>
          <h2>{results.length} outbound-ready accounts</h2>
          <p>{usingLiveResults ? "Live account signals returned from the backend search engine." : "Seeded examples. Click Search Live Signals to run a new real-time query."}</p>
        </div>
        <div className="controls">
          <label htmlFor="sortSelect">Sort</label>
          <select id="sortSelect" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="score">Relevance</option>
            <option value="date">Newest</option>
            <option value="confidence">Confidence</option>
          </select>
        </div>
      </div>
      <div className={`search-status ${searchState.mode}`}>
        <strong>{searchState.mode === "live" ? "Live search" : searchState.mode === "demo" ? "Backend demo mode" : searchState.mode === "error" ? "Search error" : searchState.mode === "searching" ? "Searching" : "Sample mode"}</strong>
        <span>{searchState.message}</span>
      </div>
      <div className="insight-strip">
        <div><strong>{stats.highIntent}</strong><span>high-intent accounts</span></div>
        <div><strong>{stats.contacts}</strong><span>contact personas</span></div>
        <div><strong>{stats.confidence}%</strong><span>avg confidence</span></div>
      </div>
      <div className="cards">
        {results.map((company) => <ResultCard company={company} key={company.id} openDrawer={openDrawer} />)}
      </div>
    </section>
  );
}

function ResultCard({ company, openDrawer }) {
  return (
    <article className="result-card expanded">
      <div className="logo" style={{ background: company.color, color: company.color === "#baff00" ? "#111827" : "#fff" }}>{company.initials}</div>
      <div className="card-body">
        <h3 className="card-title"><span>{company.company}</span> {company.title.replace(company.company, "")}</h3>
        <p className="summary">{company.expandedSummary}</p>
        <p className="summary">{company.relevance}</p>
        <div className="gtm-box">
          <span className="stage-pill">{company.gtmStage}</span>
          <strong>{company.accountFit}</strong>
          <p>{company.outreachAngle}</p>
        </div>
        <div className="lead-footer">
          <div className="lead-row">
            <span className="lead-icon">o</span>
            <strong>Primary Contact:</strong>
            <span>{contactPriority[company.trigger] || company.contacts[0]}</span>
          </div>
          <div className="lead-row">
            <span className="lead-icon">@</span>
            <strong>Enriched Email:</strong>
            <span>{company.email}</span>
            <button className="mini-action" title="Email contact" aria-label={`Email ${company.company} contact`}>@</button>
            <button className="mini-action" title="Open LinkedIn" aria-label={`Open ${company.company} LinkedIn`}>in</button>
          </div>
          <div className="lead-row">
            <span className="lead-icon">c</span>
            <strong>Activity Date:</strong>
            <span>{formatActivityDate(company.activityDate)}</span>
          </div>
        </div>
      </div>
      <div className="card-actions">
        <button className="details-button" onClick={() => openDrawer(company)}>Evidence</button>
        <div className="score">
          <strong>{company.liveScore}</strong>
          <span className="label">Score</span>
        </div>
      </div>
    </article>
  );
}

function CompanyDrawer({ company, close }) {
  return (
    <aside className={`drawer ${company ? "open" : ""}`} aria-label="Company details" aria-hidden={!company}>
      <button className="icon-button close" title="Close" aria-label="Close" onClick={close}>x</button>
      {company && (
        <div>
          <h2>{company.company}</h2>
          <p>{company.expandedSummary}</p>
          <div className="meta-row">
            <span className="meta">{formatDate(company.date)}</span>
            <span className="meta">{company.confidence}% confidence</span>
            <span className="meta">{company.sourceType}</span>
          </div>
          <DetailBlock title="Outbound Trigger"><p>{company.title}</p></DetailBlock>
          <DetailBlock title="Suggested First Line"><p>{company.outreachAngle}</p></DetailBlock>
          <DetailBlock title="Competitors Mentioned">
            <div className="tag-row">{company.competitors.map((competitor) => <span className="meta" key={competitor}>{competitor}</span>)}</div>
          </DetailBlock>
          <DetailBlock title="Evidence">
            <ul className="evidence">
              {company.evidence.map((item) => <li key={item.label}><a href={item.url} target="_blank" rel="noreferrer">{item.label}</a><br /><span className="label">{item.type}</span></li>)}
            </ul>
          </DetailBlock>
          <DetailBlock title="Signal Reasoning">
            <ul className="timeline">{company.timeline.map((item) => <li key={item}>{item}</li>)}</ul>
          </DetailBlock>
          <DetailBlock title="Buying Committee To Enrich">
            <ul className="contacts">{company.contacts.map((item) => <li key={item}>{item}</li>)}</ul>
          </DetailBlock>
        </div>
      )}
    </aside>
  );
}

function DetailBlock({ title, children }) {
  return (
    <div className="detail-block">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function formatActivityDate(value) {
  const date = new Date(value);
  const day = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
  const time = new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit", hour12: true }).format(date).replace(" AM", "am").replace(" PM", "pm");
  return `${day} at ${time}`;
}

createRoot(document.getElementById("root")).render(<App />);
