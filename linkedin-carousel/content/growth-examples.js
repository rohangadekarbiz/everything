/*
  20 sample carousels for a business-growth / growth-marketing creator.
  Each one is a different carousel type in one of 10 visual styles.
  Copy is sample copy. Numbers marked "Sample data" are illustrative;
  cited figures name their source on the slide.
*/
window.CAROUSEL_AUTHOR = {
  name: "Your Name",
  initials: "YN",
  promise: "One growth breakdown every week.",
  // Background-removed portrait PNG (ideally B&W halftone with a white sticker border, to match the house style).
  // The placeholder is a neutral stand-in; set to "" to run without a face.
  photo: "assets/author-placeholder.png",
};

window.CAROUSELS = [
  /* 01 ------------------------------------------------------------ */
  {
    id: "loops", type: "Framework", theme: "blueprint", goal: "reposts",
    why: "It hands readers a mental model they can explain to their team in one sentence. The diagram is what gets screenshotted.",
    steal: "Name the idea in four words or fewer, then draw it. One diagram beats five bullet slides.",
    footer: "Growth loops",
    slides: [
      { kind: "hook", kicker: "Growth framework", title: "Funnels leak.\nLoops *compound.*", size: 150, visual: { type: "loop" } },
      { kind: "loops", heading: "A funnel ends. A loop feeds itself." },
      { kind: "list", heading: "3 loops you can build", items: [
        { t: "Content loop", d: "Users create pages. Pages rank in search. Searchers sign up." },
        { t: "Referral loop", d: "Inviting a teammate is part of using the product." },
        { t: "Paid loop", d: "Revenue from new customers funds the next round of ads." },
      ], note: "Loop model popularised by Reforge." },
    ],
  },

  /* 02 ------------------------------------------------------------ */
  {
    id: "metrics", type: "Cheat sheet", theme: "sheet", goal: "saves",
    why: "It's a reference, so people save it to check later and send it to the colleague who asked.",
    steal: "Borrow a format people already trust (a spreadsheet) and fit the whole thing on two slides.",
    footer: "Growth metrics cheat sheet",
    slides: [
      { kind: "hook", kicker: "Cheat sheet · save this", title: "12 growth metrics *every founder* should know.", size: 112, visual: { type: "sheet", badge1: "12", badge2: "metrics on 2 slides", rows: [["CAC", "S&M spend ÷ new customers", "Falling"], ["LTV", "ARPA × margin ÷ churn", "3× CAC+"], ["Payback", "CAC ÷ (ARPA × margin)", "< 12 mo"], ["NRR", "(Start + exp − churn) ÷ start", "> 100%"], ["Quick ratio", "(New + exp) ÷ (churn + contr.)", "4+"]] } },
      { kind: "table", heading: "Unit economics", formula: "=LTV/CAC", select: 1,
        cols: ["Metric", "Formula", "Rule of thumb"], widths: ["24%", "46%", "30%"], rows: [
        ["CAC", "Sales + marketing spend ÷ new customers", "Falling over time"],
        ["LTV", "ARPA × gross margin ÷ churn rate", "3× CAC or more"],
        ["CAC payback", "CAC ÷ (ARPA × gross margin)", "Under 12 months"],
        ["Burn multiple", "Net burn ÷ net new ARR", "Under 1.5×"],
        ["Magic number", "Net new ARR in quarter ÷ last quarter's S&M spend", "Above 0.75"],
        ["Trial → paid", "New customers ÷ trials started", "Beat last quarter"],
      ] },
      { kind: "table", heading: "Retention & engagement", select: 2,
        cols: ["Metric", "Formula", "Rule of thumb"], widths: ["24%", "46%", "30%"], rows: [
        ["Activation", "Activated users ÷ sign-ups", "Rising each month"],
        ["Logo churn", "Customers lost ÷ customers at start", "Lower each cohort"],
        ["NRR", "(Start MRR + expansion − contraction − churn) ÷ start", "Above 100%"],
        ["GRR", "(Start MRR − contraction − churn) ÷ start", "Above 85%"],
        ["Quick ratio", "(New + expansion) ÷ (churn + contraction)", "4 or higher"],
        ["DAU / MAU", "Daily actives ÷ monthly actives", "20%+ for daily tools"],
      ], note: "Rules of thumb vary by stage. Compare with your own trend first." },
    ],
  },

  /* 03 ------------------------------------------------------------ */
  {
    id: "experiment", type: "Step-by-step how-to", theme: "lab", goal: "saves",
    why: "Clear steps people plan to use later. Ending on a filled-in example shows what 'done' looks like.",
    steal: "Number the steps, keep each to one line, and finish with a worked example.",
    footer: "Growth experiments",
    slides: [
      { kind: "hook", kicker: "How-to · 5 steps", title: "Most growth tests are just *changes.*", size: 132, visual: { type: "stamp", id: "EXP-014 · Pricing page", title: "Show the annual price first", fields: [["Hypothesis", "Annual as the default view lifts annual share by 5+ pts."], ["Metric", "Share of new plans that are annual"], ["Duration", "21 days"]], stamp: "WIN", stampSub: "+7.8 PTS" } },
      { kind: "list", items: [
        { t: "Write the hypothesis", d: "“If we ___, then ___ will rise by ___, because ___.”" },
        { t: "Pick one primary metric", d: "Decide what counts as a win before you launch." },
        { t: "Size the sample first", d: "Not enough traffic? Test a bigger change, or skip the test." },
      ] },
      { kind: "expcard", start: 4, steps: ["Run the full length. No peeking.", "Log the learning, win or lose."],
        card: { id: "EXP-014 · Pricing page", title: "Show the annual price first", result: "WIN · +7.8 pts annual share", fields: [
          ["Hypothesis", "If annual is the default view, annual plan share rises 5+ pts, because the monthly-equivalent price looks lower."],
          ["Metric", "Share of new plans that are annual"],
          ["Duration", "21 days · 3 full weeks"],
        ] } },
    ],
  },

  /* 04 ------------------------------------------------------------ */
  {
    id: "myths", type: "Myth vs fact", theme: "oxblood", goal: "comments",
    why: "Every myth is a belief someone will defend in the comments. Debate is engagement.",
    steal: "Pick myths your audience actually holds and answer each in one line.",
    footer: "Growth myths",
    slides: [
      { kind: "hook", kicker: "Myth vs fact", title: "5 growth myths worth *unlearning.*", size: 128, visual: { type: "mythlist", items: ["More traffic fixes growth.", "Going viral is luck.", "Growth is marketing's job.", "Copy what worked for them.", "A/B test everything."] } },
      { kind: "mythfact", pairs: [
        { m: "More traffic will fix growth.", f: "If activation is broken, more traffic just leaks faster." },
        { m: "Going viral is luck.", f: "Virality is designed: who gets invited, when, and why they say yes." },
      ] },
      { kind: "mythfact", pairs: [
        { m: "Growth is marketing's job.", f: "Growth is product, marketing and sales running one system." },
        { m: "Copy what worked for them.", f: "Their playbook fit their audience, stage and budget." },
        { m: "A/B test everything.", f: "Low traffic? Make bigger changes and talk to customers." },
      ] },
    ],
  },

  /* 05 ------------------------------------------------------------ */
  {
    id: "hero-rewrite", type: "Before / after", theme: "grid", goal: "reposts",
    why: "A visible transformation is satisfying to swipe, and marketers forward it to their team as a lesson.",
    steal: "Show the real 'before' (anonymised) and annotate each fix in handwriting.",
    footer: "Homepage teardown",
    slides: [
      { kind: "hook", kicker: "Before → after", title: "Same product.\nA hero that *converts.*", size: 120, visual: { type: "beforeafter", brand: "Ledgerly", before: { h: "The all-in-one platform to supercharge your workflow", s: "Powerful. Flexible. Modern.", cta: "Get started" }, after: { h: "Close your books in 2 days, not 10.", s: "For finance teams of 5–50.", cta: "Watch the 3-min demo" } } },
      { kind: "hero", state: "before", brand: "Ledgerly", h: "The all-in-one platform to supercharge your workflow", s: "Powerful. Flexible. Built for modern teams.", cta: "Get started",
        notes: ["Could describe any product", "Adjectives, no outcome", "Get started… doing what?"] },
      { kind: "hero", state: "after", brand: "Ledgerly", h: "Close your books in 2 days, not 10.", s: "Accounting automation for finance teams of 5–50 people.", cta: "Watch the 3-min demo",
        notes: ["Outcome + time saved", "Says exactly who it's for", "Low-commitment next step"], note: "Fictional product, for illustration." },
    ],
  },

  /* 06 ------------------------------------------------------------ */
  {
    id: "mistakes", type: "Mistakes list", theme: "board", goal: "comments",
    why: "Readers recognise their own team in it and tag colleagues. Specific mistakes feel true.",
    steal: "Write each mistake as a concrete action ('five channels at once'), never vague advice ('lack of focus').",
    footer: "Growth mistakes",
    slides: [
      { kind: "hook", kicker: "Mistakes", title: "7 mistakes that stall *early growth.*", size: 120, visual: { type: "stickies", items: ["Ads before retention", "5 channels at once", "Counting sign-ups", "No clear ICP", "Discounting", "Ignoring week one", "Pricing in a vacuum"] } },
      { kind: "stickies", items: ["Scaling ads before retention is proven", "Running five channels at once", "Counting sign-ups, not activated users", "Selling to everyone (no ICP)"] },
      { kind: "stickies", start: 5, items: ["Discounting to fix a value problem", "Ignoring the first 7 days after sign-up", "Changing pricing without talking to customers"], hand: "Which one hurts most? Tell me ↓" },
    ],
  },

  /* 07 ------------------------------------------------------------ */
  {
    id: "retention-stat", type: "One big number", theme: "cobalt", goal: "reposts",
    why: "One surprising number is easy to quote in a repost caption. The source makes it safe to share.",
    steal: "Number on the cover, source in small type, the 'so what' on slide 2.",
    footer: "Retention math",
    slides: [
      { kind: "hook", kicker: "Retention", title: "Winning a customer costs *5–25×* more than keeping one.", size: 104, visual: { type: "bars", a: { value: "1×", label: "Keep a customer", h: 40 }, b: { value: "5–25×", label: "Win a new one", h: 420 }, source: "Source: Harvard Business Review, 2014" } },
      { kind: "list", heading: "Before you raise the ad budget, check three numbers.", items: [
        { t: "Month-1 retention", d: "How many new customers are still active after 30 days?" },
        { t: "Time to value", d: "How long until a new user gets their first result?" },
        { t: "Expansion revenue", d: "Do existing customers pay you more over time?" },
      ] },
      { kind: "curves", heading: "Retention decides what every new customer is *worth.*",
        a: [100, 72, 58, 50, 46, 44, 43, 42, 41, 41, 40, 40, 40], aLabel: "Flattens:|growth compounds",
        b: [100, 62, 42, 30, 22, 17, 13, 10, 8, 7, 6, 5, 5], bLabel: "Decays: a|leaking bucket",
        note: "Share of a cohort still active, by month. Sample data." },
    ],
  },

  /* 08 ------------------------------------------------------------ */
  {
    id: "gtm-motions", type: "Comparison table", theme: "sheet", goal: "saves",
    why: "It settles a debate teams keep having, in one view. People save it and share it internally.",
    steal: "Three options, five rows at most. Put the decision rule on the next slide.",
    footer: "Go-to-market motions",
    slides: [
      { kind: "hook", kicker: "Compared", title: "Which growth motion *fits you?*", size: 128, visual: { type: "options", items: [{ t: "Product-led", d: "Free plan or trial. The user buys." }, { t: "Sales-led", d: "Demo and contract. A committee buys." }, { t: "Marketing-led", d: "Content and ads. A team lead buys." }], hand: "pick by price ↓" } },
      { kind: "table", heading: "Which motion fits you?", cols: ["", "Product-led", "Sales-led", "Marketing-led"], widths: ["22%", "26%", "26%", "26%"], rows: [
        ["Price point", "Low, self-serve", "High, contract", "Mid"],
        ["Who buys", "The end user", "A buying committee", "A team lead"],
        ["First touch", "Free plan or trial", "An SDR or AE", "Content, ads, webinars"],
        ["Key metric", "Activation rate", "Pipeline & win rate", "Lead → customer rate"],
        ["Watch out", "Free users who never pay", "Long sales cycles", "Volume over quality"],
      ] },
      { kind: "ladder", heading: "Most companies end up *hybrid.*", steps: [
        "Start with the motion that matches your price.",
        "Prove one repeatable channel before adding another.",
        "Layer the next motion on top, e.g. sales on top of product-led.",
      ] },
    ],
  },

  /* 09 ------------------------------------------------------------ */
  {
    id: "prioritise", type: "2×2 matrix", theme: "board", goal: "saves",
    why: "A matrix is a tool, so people reuse it in their own planning and save it for the next one.",
    steal: "Fill each quadrant with realistic examples so readers can map their own backlog.",
    footer: "Prioritisation",
    slides: [
      { kind: "hook", kicker: "Prioritisation", title: "40 ideas. One quarter. *Start here.*", size: 120, visual: { type: "matrix", quads: [{ t: "Quick wins", s: "High impact · low effort", items: ["Fix onboarding email #1"] }, { t: "Big bets", s: "High impact · high effort", items: ["Referral program"] }, { t: "Fill-ins", s: "Low impact · low effort", items: ["Button colours"] }, { t: "Money pits", s: "Low impact · high effort", items: ["Full rebrand"] }] } },
      { kind: "matrix", heading: "Sort the backlog", x: "Effort →", y: "Impact →", quads: [
        { t: "Quick wins", s: "High impact · low effort", items: ["Fix onboarding email #1", "Social proof on pricing"] },
        { t: "Big bets", s: "High impact · high effort", items: ["Referral program", "Free tool for SEO"] },
        { t: "Fill-ins", s: "Low impact · low effort", items: ["Button colour tests"] },
        { t: "Money pits", s: "Low impact · high effort", items: ["Full rebrand", "A channel with no owner"] },
      ] },
      { kind: "table", heading: "Then score each idea with ICE", lede: "Impact, Confidence, Ease: 1–10 each. Average them.",
        cols: ["Idea", "I", "C", "E", "Score"], widths: ["52%", "11%", "11%", "11%", "15%"], numCols: [1, 2, 3], scoreCol: 4, rows: [
        ["Fix onboarding email #1", "8", "7", "9", "8.0"],
        ["Referral program", "9", "5", "4", "6.0"],
        ["Full rebrand", "4", "3", "2", "3.0"],
      ], note: "ICE scoring was introduced by Sean Ellis." },
    ],
  },

  /* 10 ------------------------------------------------------------ */
  {
    id: "aarrr", type: "Funnel diagram", theme: "blueprint", goal: "saves",
    why: "A classic model, drawn cleanly, becomes the version people bookmark.",
    steal: "Add one question per stage. It turns a diagram into a diagnostic.",
    footer: "AARRR",
    slides: [
      { kind: "hook", kicker: "Model · Dave McClure, 2007", title: "The 5 numbers that run a *growth team.*", size: 116, visual: { type: "letters", items: ["Acquisition", "Activation", "Retention", "Referral", "Revenue"] } },
      { kind: "funnel", stages: [
        { n: "Acquisition", q: "Where do our best users come from?" },
        { n: "Activation", q: "Do they reach their first win fast?" },
        { n: "Retention", q: "Do they come back next week?" },
        { n: "Referral", q: "Do they bring other people?" },
        { n: "Revenue", q: "Do they pay, and pay more over time?" },
      ] },
      { kind: "leak", heading: "Fix the *leakiest* stage first.", rows: [
        { l: "Visit → sign-up", v: 12, t: 10 },
        { l: "Sign-up → activated", v: 31, t: 60, leak: true },
        { l: "Activated → retained (M1)", v: 74, t: 70 },
        { l: "Retained → paying", v: 46, t: 40 },
      ], note: "Step conversion vs. target. Sample data." },
    ],
  },

  /* 11 ------------------------------------------------------------ */
  {
    id: "arr-stages", type: "Timeline / roadmap", theme: "dict", goal: "saves",
    why: "Readers find themselves on the timeline, which makes a general post feel personal.",
    steal: "Use the stage markers your audience already uses (ARR, team size) as the spine.",
    footer: "$0 → $1M ARR",
    slides: [
      { kind: "hook", kicker: "Roadmap", title: "$0 to $1M ARR, *stage by stage.*", size: 140, visual: { type: "route", labels: ["$10k", "$100k", "$500k", "$1M"], notes: ["find the pain", "find one channel", "fix retention", "add an engine"] } },
      { kind: "timeline", stages: [
        { at: "$0 – $10k ARR", t: "Find the pain", d: "Founder-led sales. Talk to 50 potential customers and write down their exact words." },
        { at: "$10k – $100k", t: "Find one channel", d: "Pick the single channel that brings your best customers. Ignore the rest." },
      ] },
      { kind: "timeline", stages: [
        { at: "$100k – $500k", t: "Fix retention", d: "Onboarding, activation, the first 30 days. Hire for the bottleneck." },
        { at: "$500k – $1M", t: "Add a second engine", d: "A second channel, pricing and packaging, a repeatable sales process." },
      ] },
    ],
  },

  /* 12 ------------------------------------------------------------ */
  {
    id: "launch-checklist", type: "Checklist", theme: "lab", goal: "saves",
    why: "Checklists get saved because people use them on the day they need them.",
    steal: "Group items by phase and draw real checkboxes.",
    footer: "Launch checklist",
    slides: [
      { kind: "hook", kicker: "Checklist · save for launch day", title: "The B2B launch-day *checklist.*", size: 128, visual: { type: "clipboard", head: "Week before launch", done: 2, items: ["Sign-up events firing", "UTM link for every channel", "Welcome emails live", "Pricing page tested on mobile", "Demo video under 2 min"], badge1: "13", badge2: "items to tick" } },
      { kind: "checks", groups: [
        { g: "Week before", items: ["Sign-up and activation events firing", "UTM links for every channel", "Welcome email sequence live", "Pricing page tested on mobile"] },
        { g: "Assets", items: ["Demo video under 2 minutes", "Answers to the top 5 objections"] },
      ] },
      { kind: "checks", groups: [
        { g: "Launch day", items: ["Post when your audience is online", "Reply to every comment in the first 2 hours", "Team shares with their own words, not a bare repost", "Founder DMs 20 warm contacts"] },
        { g: "Day after", items: ["Log where sign-ups came from", "Personal follow-up to every new trial", "Write down what you'd change next time"] },
      ] },
    ],
  },

  /* 13 ------------------------------------------------------------ */
  {
    id: "hooks", type: "Swipe file / templates", theme: "mustard", goal: "saves",
    why: "Fill-in-the-blank templates are usable the moment you read them, so they get saved and passed around.",
    steal: "Make the blanks visible so readers see exactly what to swap.",
    footer: "Hook formulas",
    slides: [
      { kind: "hook", kicker: "Swipe file", title: "6 hook formulas for *B2B posts.*", size: 150, visual: { type: "cards", items: ["{Old belief} is wrong. Here's why.", "How we {got result} without {cost}.", "I {did X} for {time}. Here's what happened."] } },
      { kind: "hooks", items: ["I {did X} for {time}. Here's what happened.", "{Common belief} is wrong. Here's why.", "How we {got result} without {expected cost}."] },
      { kind: "hooks", start: 4, items: ["The {number}-step {system} we use to {outcome}.", "Stop {common habit}. Do {better habit} instead.", "{Big number} {units} later, here's the one lesson."] },
    ],
  },

  /* 14 ------------------------------------------------------------ */
  {
    id: "mql", type: "Contrarian take", theme: "cobalt", goal: "comments",
    why: "A strong, defensible opinion gives people something to agree or argue with in the comments.",
    steal: "State the opinion in four words on the cover. Earn it on the slides after.",
    footer: "Pipeline > MQLs",
    slides: [
      { kind: "hook", kicker: "Unpopular opinion", visual: { type: "strike", word: "MQLs", after: "Stop chasing them.\nTrack *pipeline* instead." } },
      { kind: "poster", lines: ["An MQL measures interest in your *content.*", "Revenue needs intent to *buy.*"] },
      { kind: "list", heading: "Track these instead", items: [
        { t: "Hand-raisers", d: "Demo requests and direct replies from your ICP." },
        { t: "Pipeline by source", d: "Which channels create real opportunities?" },
        { t: "Win rate by source", d: "Which channels create customers?" },
      ] },
    ],
  },

  /* 15 ------------------------------------------------------------ */
  {
    id: "payback-case", type: "Case study", theme: "dash", goal: "reposts",
    why: "Specific before-and-after numbers make the story credible and quotable.",
    steal: "Lead with the result in numbers; explain the three changes after.",
    footer: "Case study",
    slides: [
      { kind: "hook", kicker: "Case study", title: "How a 6-person SaaS cut CAC payback by *8 months.*", size: 100, visual: { type: "chart", label: "CAC payback, months", pts: [19, 18, 15, 13, 11], min: 4, max: 21, from: "19 mo", to: "11 mo", xl: ["Q1", "Q2", "Q3", "Q4", "Q5"] } },
      { kind: "list", heading: "What they changed", items: [
        { t: "Cut 2 of 4 paid channels", d: "Kept the two that produced customers, not clicks." },
        { t: "Rebuilt onboarding around one first win", d: "Time to first value fell from 3 days to 20 minutes." },
        { t: "Annual plan as the default", d: "Cash upfront shortened payback straight away." },
      ] },
      { kind: "linechart", heading: "CAC payback, in months", pts: [19, 18, 15, 13, 11], labels: ["Q1", "Q2", "Q3", "Q4", "Q5"], yMax: 22, yTicks: [0, 5, 10, 15, 20], note: "Sample data." },
    ],
  },

  /* 16 ------------------------------------------------------------ */
  {
    id: "glossary", type: "Glossary", theme: "dict", goal: "saves",
    why: "Plain definitions help newcomers, and experts share them with new hires.",
    steal: "Use a dictionary layout: word, part of speech, one-line definition, one example.",
    footer: "Growth glossary",
    slides: [
      { kind: "hook", kicker: "Glossary", title: "Growth terms in *one line* each.", size: 120, visual: { type: "entry", entries: [{ w: "ac·ti·va·tion", pr: "/ˌak-tə-ˈvā-shən/", pos: "noun", d: "The moment a new user first gets real value from your product." }, { w: "co·hort", pr: "/ˈkō-ˌhȯrt/", pos: "noun", d: "Users who started in the same period, tracked together." }] } },
      { kind: "dict", entries: [
        { w: "Activation", p: "noun", d: "The moment a new user first gets real value from your product.", e: "e.g. “Activated = sent their first invoice.”" },
        { w: "Cohort", p: "noun", d: "Users who started in the same period, tracked together over time.", e: "e.g. “The March cohort retains better.”" },
        { w: "North Star Metric", p: "noun", d: "The one number that best captures the value customers get.", e: "e.g. weekly active teams" },
      ] },
      { kind: "dict", entries: [
        { w: "Churn", p: "noun", d: "The share of customers or revenue you lose in a period." },
        { w: "Expansion revenue", p: "noun", d: "Extra revenue from existing customers: upgrades, seats, add-ons." },
        { w: "Product–market fit", p: "noun", d: "When customers would be very disappointed if your product disappeared.", e: "Sean Ellis test: 40%+ say “very disappointed”" },
      ] },
    ],
  },

  /* 17 ------------------------------------------------------------ */
  {
    id: "drucker", type: "Quote + lesson", theme: "oxblood", goal: "reposts",
    why: "A well-known line gives people an easy reason to repost with their own take.",
    steal: "Only use quotes you can source. Your interpretation is the part people remember.",
    footer: "Lessons from Drucker",
    slides: [
      { kind: "hook", title: "The purpose of business is to create a *customer.*", size: 158, visual: { type: "quote", who: "Peter Drucker", src: "The Practice of Management, 1954" } },
      { kind: "list", heading: "What it means for growth teams", items: [
        { t: "Customers, not leads", d: "Report on customers created, not on activity." },
        { t: "Marketing and innovation", d: "Drucker called these the only two basic functions of a business." },
        { t: "Retention counts too", d: "Keeping a customer is creating them again." },
      ] },
    ],
  },

  /* 18 ------------------------------------------------------------ */
  {
    id: "content-system", type: "Process flow", theme: "grid", goal: "saves",
    why: "It shows a whole system people can copy step by step, which makes it worth saving.",
    steal: "Draw the arrows between steps and annotate where the conversion happens.",
    footer: "Content system",
    slides: [
      { kind: "hook", kicker: "System", title: "1 customer call →\n*5 pieces* of content.", size: 116, visual: { type: "fanout", items: ["One long post", "Five short posts", "Weekly newsletter", "Lead magnet", "Demo requests"], hand: "every week" } },
      { kind: "flow", nodes: [
        { t: "Customer call", note: "write down their words" },
        { t: "One long post" },
        { t: "Five short posts", note: "one idea each" },
        { t: "Weekly newsletter" },
        { t: "Lead magnet", note: "the CTA lives here" },
        { t: "Demo request" },
      ] },
      { kind: "list", heading: "Run it every week", numbered: false, items: [
        { t: "Monday", d: "One customer call. Record their exact words." },
        { t: "Tuesday", d: "One long post built on the best quote." },
        { t: "Wednesday – Friday", d: "Cut it into short posts. Send the newsletter." },
      ] },
    ],
  },

  /* 19 ------------------------------------------------------------ */
  {
    id: "scorecard", type: "Self-audit scorecard", theme: "dash", goal: "comments",
    why: "People score themselves and post their number in the comments.",
    steal: "Finish with a scoring key so readers know what their number means.",
    footer: "Growth scorecard",
    slides: [
      { kind: "hook", kicker: "Scorecard", title: "What's your growth score *out of 25?*", size: 120, visual: { type: "gauge", needle: 0.62 } },
      { kind: "scorecard", heading: "Rate each 1–5", rows: [
        "We know which channel brings our best customers.",
        "We can name the moment a user is activated.",
        "We review cohort retention every month.",
        "Every experiment has a hypothesis and a log.",
        "Sales and marketing report the same numbers.",
      ] },
      { kind: "scorekey", heading: "What your score means", bands: [
        { r: "21–25", t: "Compounding", d: "Scale what works." },
        { r: "14–20", t: "Promising", d: "Fix your lowest score first." },
        { r: "5–13", t: "Leaking", d: "Start with activation and measurement." },
      ], note: "Comment your score. I'll reply with where to start." },
    ],
  },

  /* 20 ------------------------------------------------------------ */
  {
    id: "pricing-teardown", type: "Annotated teardown", theme: "mustard", goal: "reposts",
    why: "Teardowns teach by example, so marketers forward them to their team.",
    steal: "Show the page, mark three details with numbered pins, explain each on the next slide.",
    footer: "Pricing teardown",
    slides: [
      { kind: "hook", kicker: "Teardown", title: "3 details that make this pricing page *convert.*", size: 112, visual: { type: "pricing", h: "Plans that grow with your team", plans: [{ n: "Solo", f: "For freelancers", p: 15 }, { n: "Team", f: "For teams of 2–20", p: 39, pop: true }, { n: "Company", f: "For 20+ people", p: 79 }] } },
      { kind: "pricing", h: "Plans that grow with your team", plans: [
        { n: "Solo", f: "For freelancers", p: 15 },
        { n: "Team", f: "For teams of 2–20", p: 39, pop: true },
        { n: "Company", f: "For 20+ people", p: 79 },
      ], note: "Fictional product, for illustration." },
      { kind: "pinlist", heading: "What's working", items: [
        { t: "Annual shown first", d: "The lower monthly-equivalent price becomes the anchor." },
        { t: "One plan highlighted", d: "A clear default cuts decision time." },
        { t: "Plans named for who they're for", d: "Buyers pick themselves instead of comparing feature lists." },
      ] },
    ],
  },
];
