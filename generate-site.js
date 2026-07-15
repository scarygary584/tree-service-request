const fs = require("fs");
const path = require("path");

const root = __dirname;
const siteUrl = "https://www.treeservicerequest.com";
const phoneDisplay = "(501) 500-5094";
const phoneHref = "tel:+15015005094";
const brand = "TreeServiceRequest.com";

const services = [
  ["/emergency-tree-removal-hot-springs-ar/", "Emergency Tree Help"],
  ["/fallen-tree-removal-hot-springs-ar/", "Fallen Tree Removal"],
  ["/storm-damage-tree-removal-hot-springs-ar/", "Storm Damage Help"],
  ["/tree-removal-hot-springs-ar/", "Tree Removal"],
  ["/tree-trimming-hot-springs-ar/", "Tree Trimming"],
  ["/stump-grinding-hot-springs-ar/", "Stump Grinding"],
  ["/tree-near-house-or-power-line-hot-springs-ar/", "Tree Near House or Line"],
  ["/tree-removal-cost-hot-springs-ar/", "Cost Factors"],
  ["/tree-service-garland-county-ar/", "Garland County Requests"],
  ["/how-tree-service-requests-work/", "How Requests Work"],
];

const commonLinks = `
  <section class="section band">
    <div class="wrap">
      <div class="section-kicker">Related request pages</div>
      <h2>More tree-service request options</h2>
      <div class="link-grid">
        <a href="/">Tree service request help in Hot Springs</a>
        <a href="/emergency-tree-removal-hot-springs-ar/">Emergency tree removal requests</a>
        <a href="/tree-removal-hot-springs-ar/">Tree removal request routing</a>
        <a href="/tree-trimming-hot-springs-ar/">Tree trimming request routing</a>
        <a href="/stump-grinding-hot-springs-ar/">Stump grinding request routing</a>
        <a href="/tree-removal-cost-hot-springs-ar/">Tree removal cost factors</a>
        <a href="/tree-service-garland-county-ar/">Garland County tree-service requests</a>
        <a href="/how-tree-service-requests-work/">How TreeServiceRequest.com works</a>
      </div>
    </div>
  </section>`;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function faqMarkup(faqs) {
  return `
  <section class="section faq-section">
    <div class="wrap narrow">
      <div class="section-kicker">Questions</div>
      <h2>Frequently asked questions</h2>
      <div class="faq-list">
        ${faqs.map((item, index) => `
          <details class="faq-item"${index === 0 ? " open" : ""}>
            <summary>${escapeHtml(item.q)}</summary>
            <p>${escapeHtml(item.a)}</p>
          </details>`).join("")}
      </div>
    </div>
  </section>`;
}

function jsonLd(page, faqs, crumbs) {
  const graph = [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      "name": brand,
      "url": `${siteUrl}/`,
      "logo": `${siteUrl}/assets/tree-service-request-logo.png`,
      "telephone": phoneDisplay,
      "description": "TreeServiceRequest.com helps homeowners request connection with available local tree-service options."
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      "url": `${siteUrl}/`,
      "name": brand,
      "publisher": { "@id": `${siteUrl}/#organization` }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": crumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": `${siteUrl}${crumb.url}`
      }))
    },
    {
      "@type": "Service",
      "name": page.serviceName || page.h1,
      "areaServed": "Hot Springs, Arkansas and nearby Garland County areas depending on provider availability",
      "provider": { "@id": `${siteUrl}/#organization` },
      "description": page.meta
    },
    {
      "@type": "FAQPage",
      "mainEntity": faqs.map((item) => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.a
        }
      }))
    }
  ];
  return `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph })}</script>`;
}

function cta(label = "Call now to describe the tree concern") {
  return `
    <div class="cta-panel">
      <div>
        <p class="eyebrow">Request routing</p>
        <h2>Call ${phoneDisplay} to request connection with available local tree-service options.</h2>
        <p>${brand} is not a tree-service provider. Service availability, timing, scope, qualifications, insurance, and pricing must be confirmed directly with the independent provider.</p>
      </div>
      <a class="button button-phone" href="${phoneHref}" aria-label="${label}">Call ${phoneDisplay}</a>
    </div>`;
}

function shell(page, body, faqs) {
  const canonical = `${siteUrl}${page.url}`;
  const crumbs = page.url === "/" ? [{ name: "Home", url: "/" }] : [{ name: "Home", url: "/" }, { name: page.nav || page.h1, url: page.url }];
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(page.title)}</title>
  <meta name="description" content="${escapeHtml(page.meta)}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(page.ogTitle || page.title)}">
  <meta property="og:description" content="${escapeHtml(page.ogDescription || page.meta)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${siteUrl}/assets/og-tree-service-request.png">
  <link rel="icon" href="/assets/favicon.png" type="image/png">
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="stylesheet" href="/styles.css">
  ${jsonLd(page, faqs, crumbs)}
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="wrap header-inner">
      <a class="logo-link" href="/" aria-label="${brand} home">
        <img src="/assets/tree-service-request-logo.png" width="440" height="110" alt="${brand} logo">
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
        <span></span><span></span><span></span>
        <span class="sr-only">Menu</span>
      </button>
      <nav id="site-nav" class="site-nav" aria-label="Primary navigation">
        <a href="/">Home</a>
        <a href="/emergency-tree-removal-hot-springs-ar/">Emergency Tree Help</a>
        <a href="/tree-removal-hot-springs-ar/">Tree Removal</a>
        <a href="/tree-trimming-hot-springs-ar/">Tree Trimming</a>
        <a href="/stump-grinding-hot-springs-ar/">Stump Grinding</a>
        <a href="/tree-removal-cost-hot-springs-ar/">Cost Factors</a>
        <a href="/how-tree-service-requests-work/">How It Works</a>
        <a class="nav-call" href="${phoneHref}">Call ${phoneDisplay}</a>
      </nav>
    </div>
  </header>
  <main id="main">
    ${body}
  </main>
  <footer class="site-footer">
    <div class="wrap footer-grid">
      <div>
        <img class="footer-logo" src="/assets/tree-service-request-logo.png" width="300" height="75" alt="${brand} logo">
        <p>${brand} helps homeowners request connection with available local tree-service options. It does not remove, inspect, diagnose, trim, or grind trees.</p>
      </div>
      <div>
        <h2>Request pages</h2>
        <a href="/emergency-tree-removal-hot-springs-ar/">Emergency tree help</a>
        <a href="/fallen-tree-removal-hot-springs-ar/">Fallen tree removal</a>
        <a href="/storm-damage-tree-removal-hot-springs-ar/">Storm damage help</a>
        <a href="/tree-service-garland-county-ar/">Garland County requests</a>
      </div>
      <div>
        <h2>Important</h2>
        <a href="/how-tree-service-requests-work/">How requests work</a>
        <a href="/privacy-policy/">Privacy policy</a>
        <a href="${phoneHref}">Call ${phoneDisplay}</a>
      </div>
    </div>
    <div class="wrap footer-bottom">
      <p>Service availability, timing, scope, qualifications, insurance, and pricing must be confirmed directly with the independent provider.</p>
    </div>
  </footer>
  <a class="mobile-call" href="${phoneHref}">Call ${phoneDisplay}</a>
  <script src="/script.js" defer></script>
</body>
</html>`;
}

function hero(page, intro, buttons = true) {
  return `
  <section class="hero">
    <div class="wrap hero-grid">
      <div class="hero-copy">
        <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a>${page.url === "/" ? "" : ` <span>/</span> <span>${escapeHtml(page.nav || page.h1)}</span>`}</nav>
        <p class="eyebrow">Hot Springs, Arkansas</p>
        <h1>${escapeHtml(page.h1)}</h1>
        <p class="hero-lead">${intro}</p>
        ${buttons ? `<div class="hero-actions"><a class="button button-phone" href="${phoneHref}">Call ${phoneDisplay}</a><a class="button button-secondary" href="/emergency-tree-removal-hot-springs-ar/">Emergency Tree Request</a></div>` : ""}
        <p class="disclosure">Connector disclosure: ${brand} routes requests to independently operated providers when options may be available. It is not the company performing tree work.</p>
      </div>
      <div class="hero-card" aria-label="Tree-service request summary">
        <div class="leaf-mark"></div>
        <h2>Before anyone starts work</h2>
        <ul class="check-list">
          <li>Confirm availability and timing directly.</li>
          <li>Ask the provider about scope, qualifications, and insurance.</li>
          <li>Discuss pricing, cleanup, access, and permits where applicable.</li>
          <li>Stay away from fallen limbs and utility-line hazards.</li>
        </ul>
      </div>
    </div>
  </section>`;
}

const homeFaqs = [
  { q: "Does TreeServiceRequest.com remove trees?", a: "No. TreeServiceRequest.com is a lead-generation and request-routing website. Independent providers discuss and perform any tree-service work directly with the caller." },
  { q: "Can I request help for a fallen tree?", a: "Yes. You can call to describe a fallen tree, blocked driveway, damaged fence, roof impact, or debris concern so the request can be routed when options may be available." },
  { q: "Is emergency service guaranteed?", a: "No. Some independent providers may offer emergency or after-hours service, but availability, timing, and response must be confirmed directly with the provider." },
  { q: "What if the tree is near a power line?", a: "Stay away from the area and do not cut near utility lines. Contact the utility company or emergency services when appropriate, then discuss the situation with a qualified provider." },
  { q: "How is tree-removal pricing determined?", a: "Pricing varies widely and must be confirmed directly with the independent provider. Size, condition, access, structures nearby, equipment, hauling, stump grinding, and timing can all matter." },
  { q: "Can I request stump grinding?", a: "Yes. Stump grinding can be requested as its own service or discussed after tree removal, depending on provider availability and site conditions." },
  { q: "Do providers serve areas outside Hot Springs?", a: "Requests may also be considered from nearby Garland County communities depending on provider availability. Coverage is not guaranteed." },
  { q: "What information should I have ready?", a: "Have the street or neighborhood, what happened to the tree, nearby structures or lines, access conditions, approximate size if safely visible, and desired timing." },
  { q: "Can a provider inspect whether a tree is hazardous?", a: "A qualified provider may discuss assessment options directly with you. TreeServiceRequest.com does not inspect trees or diagnose tree health." },
  { q: "Does calling create an obligation to hire anyone?", a: "No. Calling to request connection does not require you to hire a provider. Any agreement is between you and the independent provider." }
];

const pages = [
  {
    url: "/",
    file: "index.html",
    title: "Tree Service Request Help in Hot Springs, AR | TreeServiceRequest.com",
    meta: "Request connection with local tree-service options in Hot Springs, AR. Call for fallen trees, trimming, removal, stumps, and storm concerns.",
    h1: "Tree Service Request Help in Hot Springs, Arkansas",
    nav: "Home",
    faqs: homeFaqs,
    body: () => `
      ${hero({ url: "/", h1: "Tree Service Request Help in Hot Springs, Arkansas" }, "Homeowners in Hot Springs can call to request connection with available local tree-service options for urgent and non-urgent concerns. Availability and response times vary, and the independent provider must confirm price, scope, qualifications, insurance, and timing before any work begins.")}
      <section class="section">
        <div class="wrap">
          <div class="section-kicker">Common request reasons</div>
          <h2>Why homeowners request tree-service help</h2>
          <div class="reason-grid">
            ${["Fallen tree", "Storm-damaged limbs", "Leaning tree", "Dead or declining tree concerns", "Tree close to a roof or structure", "Broken branches", "Tree blocking a driveway", "Tree trimming", "Stump grinding", "Tree near a utility line"].map((x) => `<article><h3>${x}</h3><p>Call to describe the concern and request connection with available options. A provider should evaluate scope and next steps directly.</p></article>`).join("")}
          </div>
        </div>
      </section>
      <section class="section split">
        <div class="wrap split-grid">
          <div>
            <div class="section-kicker">Urgent situations</div>
            <h2>Fallen trees, hanging limbs, and blocked access may need quick assessment</h2>
            <p>Fallen trees, limbs hanging over roofs, blocked driveways, roof impact, and storm damage can create safety and access concerns. TreeServiceRequest.com can help route a request, but the independent provider determines whether and when help is available.</p>
            <p class="safety-note">Safety note: stay away from fallen or hanging limbs, do not approach downed utility lines, contact the utility company or emergency services when appropriate, and do not attempt dangerous cutting, climbing, rigging, roof, crane, or chainsaw work without proper training and equipment.</p>
          </div>
          ${cta("Call TreeServiceRequest.com")}
        </div>
      </section>
      <section class="section">
        <div class="wrap">
          <div class="section-kicker">Process</div>
          <h2>How the request process works</h2>
          <ol class="steps">
            <li><strong>Call and describe the location and concern.</strong><span>Share the street or neighborhood, what happened, and what property or access may be affected.</span></li>
            <li><strong>Request routing begins.</strong><span>${brand} helps route the request based on available local options.</span></li>
            <li><strong>The provider confirms details.</strong><span>The independent provider discusses timing, access, scope, qualifications, insurance, and pricing directly with the caller.</span></li>
            <li><strong>Availability is not guaranteed.</strong><span>Storm demand, access, equipment, safety concerns, and scheduling can affect whether service is available.</span></li>
          </ol>
        </div>
      </section>
      <section class="section band">
        <div class="wrap">
          <div class="section-kicker">Request types</div>
          <h2>Tree-service request pages</h2>
          <div class="service-grid">
            ${services.map(([url, label]) => `<a class="service-card" href="${url}"><span>${label}</span><p>Read what to have ready and what the provider may need to confirm.</p></a>`).join("")}
          </div>
        </div>
      </section>
      <section class="section">
        <div class="wrap content-columns">
          <div>
            <div class="section-kicker">Local context</div>
            <h2>Hot Springs and Garland County tree-service requests</h2>
            <p>Hot Springs includes wooded residential areas, mature trees, hills and slopes, lake-area properties, and varied access conditions. Trees may stand near homes, driveways, fences, outbuildings, roofs, and vehicles. Wind and storm exposure can also leave branches broken or trees leaning.</p>
            <p>Requests may also be considered from nearby Garland County communities depending on provider availability. Coverage and timing must be confirmed directly.</p>
          </div>
          <div>
            <h2>What callers should have ready</h2>
            <ul class="dot-list">
              <li>Street or neighborhood</li><li>Whether the tree is standing, leaning, broken, or fallen</li><li>Whether a structure, road, driveway, fence, or vehicle is affected</li><li>Whether utility lines may be involved</li><li>Access conditions and approximate size if safely visible</li><li>Desired timing and photos if requested by the provider</li>
            </ul>
          </div>
          <div>
            <h2>Pricing factors providers may consider</h2>
            <p>Independent providers may consider tree size, condition, location, nearby structures, access, crane or equipment needs, debris hauling, stump grinding, emergency timing, utility-line involvement, and permits or local requirements. Pricing varies widely and must be confirmed directly with the independent provider.</p>
          </div>
        </div>
      </section>
      ${faqMarkup(homeFaqs)}`
  }
];

function longServicePage(opts) {
  return {
    url: opts.url,
    file: path.join(opts.url.replace(/^\/|\/$/g, ""), "index.html"),
    title: opts.title,
    meta: opts.meta,
    h1: opts.h1,
    nav: opts.nav,
    serviceName: opts.serviceName,
    faqs: opts.faqs,
    body: () => `
      ${hero(opts, opts.intro)}
      <section class="section">
        <div class="wrap content">
          ${opts.sections.map((section) => `
            <section>
              <h2>${section.h}</h2>
              ${section.p.map((para) => `<p>${para}</p>`).join("")}
            </section>`).join("")}
          ${cta()}
        </div>
      </section>
      ${commonLinks}
      ${faqMarkup(opts.faqs)}`
  };
}

pages.push(longServicePage({
  url: "/emergency-tree-removal-hot-springs-ar/",
  title: "Emergency Tree Removal Requests in Hot Springs, AR",
  meta: "Request routing for emergency tree removal concerns in Hot Springs, AR. Fallen trees, roof impacts, blocked driveways, and storm damage.",
  h1: "Emergency Tree Removal Request Help in Hot Springs, AR",
  nav: "Emergency Tree Help",
  serviceName: "Emergency tree removal request routing",
  intro: "Call to request connection with available local options for urgent tree concerns in Hot Springs. Some independent providers may offer emergency or after-hours service, but availability must be confirmed directly.",
  sections: [
    { h: "When a tree concern feels urgent", p: [
      "Emergency tree removal requests often begin when a tree or large limb suddenly affects access, a roof, a driveway, a fence, a shed, a vehicle, or another part of the property. In Hot Springs, wooded neighborhoods, sloped lots, lake-area access, and mature trees can make the details important. TreeServiceRequest.com helps homeowners describe the situation and request connection with available local tree-service options, but it does not send crews or perform the work.",
      "A provider may need to know whether the tree is fully down, partly split, leaning after heavy wind, tangled with other limbs, resting on a structure, or blocking a route in or out of the property. Photos can be useful if the provider asks for them, but only take photos from a safe distance."
    ] },
    { h: "Safety comes before cleanup", p: [
      "Stay clear of fallen trunks, hanging limbs, and trees that have shifted onto roofs or vehicles. Do not climb damaged trees, walk under suspended limbs, or attempt chainsaw, rigging, crane, roof, or utility-line work without proper training and equipment. If a tree or branch touches a utility line, or if a line is down or damaged, stay away and contact the utility company or emergency services when appropriate.",
      "If a tree blocks emergency access, creates an immediate public hazard, or appears connected to a fire, electrical, medical, or traffic emergency, contact emergency services first. TreeServiceRequest.com can help with request routing, but it is not a substitute for emergency authorities or utility response."
    ] },
    { h: "What can affect response time", p: [
      "Independent providers determine whether they can respond. Timing may be affected by storm demand, daylight, road conditions, equipment availability, crew scheduling, the size and position of the tree, nearby structures, and whether utility-line or crane work is involved. Availability is never guaranteed through this website.",
      "When you call, describe the location, what the tree is touching or blocking, whether anyone is in immediate danger, whether utility lines may be involved, and whether trucks or equipment can access the tree. The provider will need to discuss the practical next steps directly."
    ] },
    { h: "Pricing and scope are confirmed by the provider", p: [
      "Emergency tree work can vary widely. A provider may consider tree size, weight, condition, roof or structure contact, restricted access, debris hauling, stump work, equipment needs, after-hours scheduling, and safety risks. TreeServiceRequest.com does not set prices, guarantee estimates, or determine the technical solution.",
      "Before hiring anyone, ask the independent provider about scope, qualifications, insurance, cleanup, hauling, scheduling, and any documentation you may need for your own records. Insurance questions should be handled directly with the provider and your insurer."
    ] }
  ],
  faqs: [
    { q: "Does TreeServiceRequest.com provide emergency tree removal?", a: "No. It helps route requests to independent providers when options may be available. The provider confirms availability, timing, scope, and pricing directly." },
    { q: "Can I call about a tree on a roof?", a: "Yes, but stay away from the affected area. If there is immediate danger, contact emergency services first, then discuss next steps with an independent provider." },
    { q: "Is 24/7 emergency response guaranteed?", a: "No. Some independent providers may offer emergency or after-hours service. Availability must be confirmed directly." },
    { q: "What should I say when I call?", a: "Describe the address or neighborhood, what the tree is touching or blocking, whether utility lines may be involved, access conditions, and any immediate safety concerns." },
    { q: "What if a power line is involved?", a: "Do not approach or cut near the line. Contact the utility company or emergency services when appropriate and tell the provider that utility involvement may exist." },
    { q: "Can a provider remove a tree from a driveway?", a: "A provider may be able to discuss removal options depending on availability, access, safety conditions, and equipment needs." },
    { q: "Who determines the emergency price?", a: "The independent provider determines pricing. TreeServiceRequest.com does not set or guarantee prices." }
  ]
}));

pages.push(longServicePage({
  url: "/fallen-tree-removal-hot-springs-ar/",
  title: "Fallen Tree Removal Requests in Hot Springs, AR",
  meta: "Call to request routing for fallen tree removal in Hot Springs, AR. Driveways, fences, sheds, roofs, debris, access, and provider details.",
  h1: "Fallen Tree Removal Request Help in Hot Springs, AR",
  nav: "Fallen Tree Removal",
  serviceName: "Fallen tree removal request routing",
  intro: "A fallen tree can block access, damage property, or leave heavy debris in a hard-to-reach area. Call to describe the situation and request connection with available local options.",
  sections: [
    { h: "Fallen trees are not all the same", p: [
      "A tree across a driveway is different from a tree on a fence, near a road, resting on a shed, leaning onto a garage, or touching a roof. The weight distribution, access, nearby structures, and whether the trunk is under tension can all affect how an independent provider evaluates the job.",
      "TreeServiceRequest.com does not inspect the tree or decide how it should be handled. It helps homeowners share the basic details so a request can be routed when local options may be available."
    ] },
    { h: "Details that help with request routing", p: [
      "When you call, be ready to describe where the tree fell, whether it is blocking a driveway or road access, whether a structure or vehicle is involved, and whether branches or limbs remain suspended. If the provider asks for photos, take them only from a safe location.",
      "Access for trucks and equipment can matter. Narrow gates, steep drives, soft ground, nearby fences, lake-area lots, and limited parking may affect what the provider can bring and how the work is scheduled."
    ] },
    { h: "Debris, branches, and stump handling", p: [
      "Fallen tree removal may include cutting and moving the trunk, clearing branches, and discussing whether debris should be hauled away or left in a specific area. Stump grinding is often a separate possible service and should be discussed directly with the provider.",
      "Do not assume every provider handles hauling, chips, stump work, or site cleanup the same way. Ask what is included before authorizing work."
    ] },
    { h: "Documentation and insurance questions", p: [
      "If the fallen tree affected a roof, fence, shed, garage, vehicle, or other property, the provider and your insurer should answer documentation questions directly. TreeServiceRequest.com does not provide legal, insurance, or coverage advice.",
      "Pricing, scope, qualifications, insurance, timing, and any written documentation must be confirmed with the independent provider."
    ] }
  ],
  faqs: [
    { q: "Can I request help for a tree across my driveway?", a: "Yes. Call with the location, access details, and what the tree is blocking so the request can be routed when options may be available." },
    { q: "What if the tree fell on a fence or shed?", a: "Stay clear and describe the property impact. The independent provider can discuss scope, access, and safe removal considerations directly." },
    { q: "Is stump grinding included with fallen tree removal?", a: "Not necessarily. Stump grinding is often a separate service and should be confirmed directly with the provider." },
    { q: "Should I send photos?", a: "Photos can help if the provider requests them, but only take photos from a safe distance." },
    { q: "Who handles insurance documentation?", a: "Documentation questions should be handled directly with the provider and your insurer. TreeServiceRequest.com does not make insurance guarantees." },
    { q: "Can availability be guaranteed?", a: "No. Independent providers determine whether and when they can respond." }
  ]
}));

pages.push(longServicePage({
  url: "/storm-damage-tree-removal-hot-springs-ar/",
  title: "Storm Damage Tree Removal Requests in Hot Springs, AR",
  meta: "Request routing for storm damage tree removal in Hot Springs, AR. Broken limbs, split trunks, uprooted trees, blocked access, and safety.",
  h1: "Storm Damage Tree Removal Request Help in Hot Springs, AR",
  nav: "Storm Damage Help",
  serviceName: "Storm damage tree removal request routing",
  intro: "After wind or storm damage, homeowners can call to request connection with available tree-service options for broken limbs, uprooted trees, blocked access, or property impact.",
  sections: [
    { h: "Storm damage can leave unstable conditions", p: [
      "Storm-related requests may involve wind-damaged limbs, split trunks, broken crowns, uprooted trees, hanging branches, or multiple-tree cleanup. A tree may look settled while branches remain suspended or the trunk remains under pressure.",
      "TreeServiceRequest.com helps route requests but does not inspect trees, diagnose tree health, or recommend a technical solution. The independent provider must evaluate scope and safety directly."
    ] },
    { h: "Blocked access and property impact", p: [
      "Storm damage may block driveways, roads, gates, garages, lake-area access, or paths to outbuildings. It may also affect roofs, fences, vehicles, sheds, or landscaping. Describe what is blocked or damaged when you call.",
      "If the situation involves immediate danger, fire, medical risk, traffic hazard, or utility-line involvement, contact emergency services or the utility company when appropriate before pursuing cleanup."
    ] },
    { h: "Utility-line caution", p: [
      "Do not approach downed, sagging, or damaged utility lines. Do not cut branches near energized lines or try to move limbs that may be touching electrical equipment. Qualified utility-related work must be handled through appropriate parties.",
      "Tell the provider if lines are nearby so they can decide whether the request is within their scope or requires utility coordination."
    ] },
    { h: "Scheduling after storm demand", p: [
      "Storms can create many requests at the same time. Provider availability may be affected by call volume, road access, daylight, equipment, tree size, and safety concerns. Some situations may be scheduled for assessment before cleanup or removal.",
      "A provider may also discuss follow-up trimming or removal if storm damage left other limbs or parts of the tree in question. Any recommendation should come directly from the qualified provider."
    ] }
  ],
  faqs: [
    { q: "Can I request help after storm damage?", a: "Yes. Call to describe broken limbs, uprooted trees, blocked access, or property impact so the request can be routed when options may be available." },
    { q: "Does TreeServiceRequest.com verify that a storm occurred?", a: "No. The site does not claim specific weather events. It routes homeowner requests based on the caller's described concern." },
    { q: "What if branches are hanging overhead?", a: "Stay away from the area and do not walk beneath hanging limbs. Discuss the condition with an independent provider." },
    { q: "Can multiple trees be included?", a: "You can describe multiple affected trees. The provider determines whether the scope, timing, and equipment are available." },
    { q: "Why might scheduling take longer after storms?", a: "Storm demand, safety conditions, road access, equipment availability, and job complexity can affect scheduling." },
    { q: "What should I do around utility lines?", a: "Stay away, do not cut nearby limbs, and contact the utility company or emergency services when appropriate." }
  ]
}));

pages.push(longServicePage({
  url: "/tree-removal-hot-springs-ar/",
  title: "Tree Removal Requests in Hot Springs, AR",
  meta: "Request connection with local tree removal options in Hot Springs, AR. Standing trees, access, debris, stump grinding, permits, and provider questions.",
  h1: "Tree Removal Request Help in Hot Springs, AR",
  nav: "Tree Removal",
  serviceName: "Tree removal request routing",
  intro: "For standing tree removal concerns in Hot Springs, call to request connection with available local options. Providers confirm scope, qualifications, insurance, timing, and pricing directly.",
  sections: [
    { h: "Standing tree removal requests", p: [
      "Homeowners may request tree removal when a tree is close to a structure, appears dead or declining, interferes with access, has roots affecting usable areas, or no longer fits the property plan. TreeServiceRequest.com does not diagnose disease, structural danger, or tree health.",
      "A qualified provider should discuss assessment, removal options, and whether trimming, monitoring, or removal is appropriate. The decision and any technical recommendation belong with the independent provider."
    ] },
    { h: "Tree removal versus trimming", p: [
      "Removal is different from trimming. Some concerns involve broken or overextended limbs, roof clearance, or routine pruning rather than removing the whole tree. Other situations may involve a tree too close to a home, garage, fence, driveway, or outbuilding.",
      "When you call, describe what prompted the request and whether you are asking about full removal, trimming, or both. The provider can explain what they are available to evaluate."
    ] },
    { h: "Access, equipment, debris, and stump options", p: [
      "A provider may consider tree size, height, trunk diameter, lean, nearby structures, access for equipment, and whether debris should be hauled away. Sloped lots, narrow drives, fences, and soft ground can affect planning.",
      "Stump grinding is a separate possible service. If you want the stump addressed, mention that during the call and confirm whether it is included in the provider's scope."
    ] },
    { h: "Provider questions and local requirements", p: [
      "Before authorizing removal, ask the independent provider about qualifications, insurance, scope, cleanup, timing, pricing, and whether permits or local rules may apply. TreeServiceRequest.com does not guarantee qualifications, licensing, insurance, or permitting outcomes.",
      "All terms of service are between the homeowner and the independent provider."
    ] }
  ],
  faqs: [
    { q: "Does TreeServiceRequest.com remove standing trees?", a: "No. It helps route requests. Independent providers discuss and perform tree removal work directly with callers." },
    { q: "Can I ask about a dead or declining tree?", a: "Yes, but TreeServiceRequest.com does not diagnose tree health. A qualified provider should evaluate concerns directly." },
    { q: "What if the tree is close to my house?", a: "Describe the nearby structure, access, and visible concern. The provider determines assessment, scope, and safety considerations." },
    { q: "Is trimming sometimes enough?", a: "It may be, depending on the situation. A qualified provider can discuss trimming versus removal directly." },
    { q: "Are permits required?", a: "Permits or local rules may apply in some circumstances. Confirm requirements directly with the provider and local authorities where appropriate." },
    { q: "Is debris hauling included?", a: "Not automatically. Ask the independent provider what cleanup, hauling, and disposal are included." }
  ]
}));

pages.push(longServicePage({
  url: "/tree-trimming-hot-springs-ar/",
  title: "Tree Trimming Requests in Hot Springs, AR",
  meta: "Request routing for tree trimming in Hot Springs, AR. Broken limbs, roof clearance, driveway clearance, pruning, and utility-line cautions.",
  h1: "Tree Trimming Request Help in Hot Springs, AR",
  nav: "Tree Trimming",
  serviceName: "Tree trimming request routing",
  intro: "Call to request connection with available local options for tree trimming concerns such as broken limbs, roof clearance, driveway clearance, or routine pruning requests.",
  sections: [
    { h: "Common trimming concerns", p: [
      "Tree trimming requests may involve broken or overextended limbs, branches close to roofs, clearance near driveways, limbs near structures, or storm-damaged branches. Some homeowners also request routine pruning to manage growth around usable areas.",
      "TreeServiceRequest.com does not provide tree-health advice or teach trimming methods. A qualified provider should evaluate tree health and structural decisions directly."
    ] },
    { h: "Trimming is different from topping", p: [
      "Tree trimming can mean selective pruning, clearance work, or removing damaged limbs. Topping is a different practice and may not be appropriate for many trees. Discuss goals, risks, and provider approach before authorizing work.",
      "If the concern is a tree that may need full removal, say that during the call so the provider can discuss whether removal or trimming is within their available scope."
    ] },
    { h: "Roofs, driveways, and structures", p: [
      "Branches near roofs, gutters, fences, garages, sheds, and driveways can create practical concerns. Provide details about the structure, approximate height if safely visible, and whether access for ladders or equipment appears limited.",
      "Do not climb, cut from a roof, or work near suspended limbs without proper training and equipment. The provider determines safe methods."
    ] },
    { h: "Utility-line trimming caution", p: [
      "Branches near service drops or utility lines require special caution. Homeowners should not cut near energized lines. Contact the utility company or appropriate qualified parties when line involvement may exist.",
      "Tell the provider about nearby lines before scheduling so they can determine whether the request is appropriate for them."
    ] }
  ],
  faqs: [
    { q: "Can I request trimming for limbs over my roof?", a: "Yes. Describe the roof area, access, and limb location. The provider confirms whether they can evaluate and perform the work." },
    { q: "Does TreeServiceRequest.com prune trees?", a: "No. It routes requests to independent providers when options may be available." },
    { q: "Can trimming help after storm damage?", a: "A provider may discuss broken or storm-damaged branches directly. Stay away from hanging limbs." },
    { q: "Is topping the same as trimming?", a: "No. Topping is different from selective trimming. Ask the provider about their approach and whether it is appropriate." },
    { q: "Can I request driveway clearance?", a: "Yes. Share the location, access needs, and any vehicle or structure concerns." },
    { q: "Who handles utility-line trimming?", a: "Utility-line trimming must be handled through appropriate qualified parties or the utility company when required." }
  ]
}));

pages.push(longServicePage({
  url: "/stump-grinding-hot-springs-ar/",
  title: "Stump Grinding Requests in Hot Springs, AR",
  meta: "Request connection for stump grinding in Hot Springs, AR. Leftover stumps, mowing obstacles, landscaping plans, access, roots, and chip handling.",
  h1: "Stump Grinding Request Help in Hot Springs, AR",
  nav: "Stump Grinding",
  serviceName: "Stump grinding request routing",
  intro: "Leftover stumps can interfere with mowing, access, landscaping, or outdoor use. Call to request connection with available local stump grinding options.",
  sections: [
    { h: "Why homeowners request stump grinding", p: [
      "A stump may be left after tree removal, create a trip hazard, interrupt mowing, sit in the way of a landscaping plan, or make a yard harder to use. Stump grinding can reduce the visible stump, but it does not always remove every root.",
      "TreeServiceRequest.com helps route stump grinding requests. The independent provider determines whether the stump can be accessed and what result is realistic."
    ] },
    { h: "Details that affect access", p: [
      "Access width, gates, slopes, nearby steps, fences, rocks, landscaping, and soft ground can affect whether grinding equipment can reach the stump. The provider may also ask about stump diameter, root flare, nearby structures, and surface conditions.",
      "If the stump is close to a fence, driveway, patio, utility area, or building, mention that during the call. Photos may help if requested from a safe location."
    ] },
    { h: "Utilities and nearby obstacles", p: [
      "Discuss underground utilities with the provider and the appropriate utility-marking service before work when applicable. TreeServiceRequest.com does not provide excavation instructions or utility-locating services.",
      "Rocks, metal, old fencing, irrigation, buried lines, or other hidden obstacles can affect whether a provider can grind safely."
    ] },
    { h: "Wood chips and cleanup", p: [
      "Stump grinding usually creates wood chips and grindings. Some homeowners want chips left for backfill or mulch, while others prefer cleanup options. Confirm directly with the provider what is included.",
      "If tree removal is also needed, mention both services so the provider can discuss whether they offer them together or separately."
    ] }
  ],
  faqs: [
    { q: "Does stump grinding remove every root?", a: "Not always. Stump grinding typically reduces the visible stump, but remaining roots may stay underground." },
    { q: "Can I request grinding for an old stump?", a: "Yes. Share approximate size, access, and any nearby obstacles so the request can be routed." },
    { q: "What affects stump grinding pricing?", a: "Diameter, access, root flare, nearby structures, rocks, cleanup, and site conditions can affect pricing, which must be confirmed by the provider." },
    { q: "Are wood chips hauled away?", a: "Not automatically. Ask the provider whether chips are left, spread, backfilled, or hauled away." },
    { q: "What about underground utilities?", a: "Discuss underground utilities with the provider and the appropriate utility-marking service before work when applicable." },
    { q: "Can stump grinding be added after tree removal?", a: "Often it can be discussed as a separate possible service, depending on provider availability." }
  ]
}));

pages.push(longServicePage({
  url: "/tree-near-house-or-power-line-hot-springs-ar/",
  title: "Tree Near House or Power Line Requests in Hot Springs, AR",
  meta: "Request routing for trees near houses, roofs, garages, fences, vehicles, or utility lines in Hot Springs, AR. Safety-first guidance.",
  h1: "Tree Near a House or Power Line in Hot Springs, AR",
  nav: "Tree Near House or Line",
  serviceName: "Tree near house or power line request routing",
  intro: "If a tree is leaning near a home, extending over a roof, or close to utility lines, call to request connection with available local options and keep safety first.",
  sections: [
    { h: "Trees close to structures", p: [
      "Homeowners may call about limbs over roofs, trees leaning toward homes, branches near garages, sheds, fences, vehicles, or trunks growing close to driveways and structures. These situations can involve access, clearance, and property-protection concerns.",
      "TreeServiceRequest.com does not inspect the tree or decide whether it is hazardous. A qualified provider should evaluate the situation directly and explain available options."
    ] },
    { h: "Power-line and service-drop caution", p: [
      "Do not approach, touch, or cut trees or limbs near energized utility lines. Do not try to pull branches off lines or climb a tree that may be contacting electrical equipment. Contact the utility company or emergency services when appropriate.",
      "When you call, clearly say if a branch is near a service drop, primary line, pole, transformer, or downed line. The provider must determine whether the request is within their scope or needs utility involvement."
    ] },
    { h: "Information to share", p: [
      "Describe whether the tree is standing, leaning, cracked, broken, or fallen; what structure or line is nearby; whether access is limited; and whether the concern changed recently after wind or rain. If photos are requested, take them from a safe distance only.",
      "Do not climb onto roofs, ladders, fences, or damaged trees to inspect the situation. The provider should handle assessment methods."
    ] },
    { h: "Provider confirmation", p: [
      "The independent provider confirms timing, scope, qualifications, insurance, pricing, and whether the work can be performed safely. Availability is not guaranteed, especially when utility coordination or specialized equipment is involved.",
      "All technical recommendations and service agreements are between the homeowner and provider."
    ] }
  ],
  faqs: [
    { q: "Can I request help for limbs over my roof?", a: "Yes. Call with the location, structure involved, and access details so the request can be routed when options may be available." },
    { q: "What if a limb is touching a power line?", a: "Stay away and contact the utility company or emergency services when appropriate. Do not attempt to cut or move the limb." },
    { q: "Does TreeServiceRequest.com inspect hazardous trees?", a: "No. It does not inspect trees or diagnose hazards. A qualified provider must discuss assessment directly." },
    { q: "Can a provider handle trees near vehicles or fences?", a: "A provider may discuss options depending on access, safety conditions, and availability." },
    { q: "Should I climb up to check the damage?", a: "No. Do not climb damaged trees, roofs, or ladders to inspect. Share what you can see safely from the ground." },
    { q: "Is service guaranteed for power-line situations?", a: "No. Utility involvement may require the utility company or specialized qualified parties." }
  ]
}));

pages.push(longServicePage({
  url: "/tree-removal-cost-hot-springs-ar/",
  title: "Tree Removal Cost Factors in Hot Springs, AR",
  meta: "Learn tree removal cost factors in Hot Springs, AR without made-up prices. Size, access, equipment, cleanup, stumps, permits, and timing.",
  h1: "Tree Removal Cost Factors in Hot Springs, AR",
  nav: "Cost Factors",
  serviceName: "Tree removal cost factor information",
  intro: "Pricing varies widely and must be confirmed directly with the independent provider. This page explains common factors that may affect tree removal cost discussions.",
  sections: [
    { h: "Why this page does not publish local prices", p: [
      "Tree removal cost in Hot Springs can vary too much to responsibly list made-up prices. A small, accessible tree is a different job from a tall tree near a roof, a leaning trunk near a driveway, or a storm-damaged tree that may require special equipment.",
      "TreeServiceRequest.com does not set prices, guarantee estimates, or decide scope. Independent providers determine pricing after discussing the details directly with the homeowner."
    ] },
    { h: "Tree size, height, and condition", p: [
      "Size, height, trunk diameter, canopy spread, wood weight, and condition can all influence the work. A dead, split, leaning, uprooted, or storm-damaged tree may require a different approach than a healthy standing tree in an open area.",
      "The provider may ask what you can safely see from the ground. Do not climb or cut to gather information."
    ] },
    { h: "Location, access, and nearby structures", p: [
      "Trees near homes, garages, sheds, fences, vehicles, driveways, retaining walls, or utility lines can affect planning. So can steep slopes, narrow gates, lake-area access, soft ground, limited parking, and distance from the street.",
      "Equipment needs can vary. A provider may consider ropes, lifts, loaders, cranes, traffic control, or other resources depending on the job. Crane use, if needed, can materially change scope and scheduling."
    ] },
    { h: "Cleanup, hauling, stumps, timing, and requirements", p: [
      "Debris handling, hauling, wood placement, stump grinding, emergency scheduling, permit considerations, and utility involvement can all affect the final discussion. Some homeowners want full cleanup; others may want wood left onsite.",
      "Ask the provider what is included, what is optional, and whether permits or local requirements may apply. Confirm qualifications, insurance, scope, price, and timing before hiring."
    ] }
  ],
  faqs: [
    { q: "Can TreeServiceRequest.com tell me the exact cost?", a: "No. Pricing varies widely and must be confirmed directly with the independent provider." },
    { q: "Why does tree size matter?", a: "Height, trunk diameter, canopy spread, and wood weight can affect labor, equipment, cleanup, and risk." },
    { q: "Do nearby structures affect cost?", a: "They can. Homes, fences, vehicles, sheds, roofs, and driveways may affect equipment, planning, and time." },
    { q: "Can emergency timing affect pricing?", a: "It may. Emergency or after-hours scheduling, when available, can affect provider pricing." },
    { q: "Is stump grinding included?", a: "Not automatically. Stump grinding is often a separate possible service and should be confirmed directly." },
    { q: "Can permits affect the job?", a: "Permits or local rules may apply in some circumstances. Ask the provider and local authorities where appropriate." },
    { q: "Does utility involvement affect cost?", a: "It can affect scope, timing, and whether the provider can perform the work without utility coordination." }
  ]
}));

pages.push(longServicePage({
  url: "/tree-service-garland-county-ar/",
  title: "Tree Service Requests in Garland County, AR",
  meta: "Hot Springs-focused tree-service request routing for Garland County, AR. Nearby requests may be considered depending on provider availability.",
  h1: "Tree Service Request Help in Garland County, AR",
  nav: "Garland County Requests",
  serviceName: "Garland County tree-service request routing",
  intro: "Hot Springs is the primary focus. Requests may also be considered from nearby Garland County communities depending on provider availability.",
  sections: [
    { h: "Hot Springs-focused request routing", p: [
      "TreeServiceRequest.com focuses on helping Hot Springs homeowners request connection with available local tree-service options. Some nearby Garland County requests may also be considered, but coverage is not guaranteed.",
      "The site is a request-routing and lead-generation website. It does not operate tree-service crews, inspect trees, or guarantee availability."
    ] },
    { h: "Property conditions can vary across the county", p: [
      "Garland County properties may include wooded lots, mature trees, hills, lake-area access, driveways, fences, outbuildings, and variable road or equipment access. These details can affect whether a provider can respond and how the work is discussed.",
      "When calling from outside Hot Springs, give the exact area, access notes, and type of tree concern so the request can be routed appropriately."
    ] },
    { h: "Nearby requests and scheduling", p: [
      "Provider availability may vary by location, demand, weather, equipment, and job type. A request outside the core Hot Springs area may take additional confirmation, and some providers may decline based on distance or scope.",
      "Any appointment, assessment, price, qualification, insurance, permit, warranty, or schedule detail must be confirmed directly with the independent provider."
    ] }
  ],
  faqs: [
    { q: "Does TreeServiceRequest.com guarantee countywide coverage?", a: "No. Requests may be considered from nearby Garland County communities depending on provider availability." },
    { q: "Is Hot Springs the main service focus?", a: "Yes. Hot Springs is the primary focus for tree-service request routing." },
    { q: "Can I call from outside Hot Springs?", a: "Yes, you can call and describe the location, but availability is not guaranteed." },
    { q: "What details help for county-area requests?", a: "Share the community or road area, access conditions, type of concern, and whether structures or utility lines may be involved." },
    { q: "Are separate town pages available?", a: "No. This site avoids thin town pages and uses this Garland County page for cautious nearby-area information." },
    { q: "Who confirms provider qualifications?", a: "The independent provider must confirm qualifications, insurance, scope, pricing, and scheduling directly with the caller." }
  ]
}));

pages.push(longServicePage({
  url: "/how-tree-service-requests-work/",
  title: "How Tree Service Requests Work | TreeServiceRequest.com",
  meta: "Learn how TreeServiceRequest.com routes tree-service requests and what homeowners should confirm directly with independent providers.",
  h1: "How TreeServiceRequest.com Requests Work",
  nav: "How Requests Work",
  serviceName: "Tree-service request routing explanation",
  intro: "TreeServiceRequest.com is a request-routing and lead-generation website. It helps homeowners ask to be connected with independently operated tree-service providers.",
  sections: [
    { h: "What TreeServiceRequest.com does", p: [
      "TreeServiceRequest.com helps homeowners request connection with available local tree-service options. Callers can describe a tree concern, location, urgency, and access details so the request can be routed when options may be available.",
      "Calling does not create an obligation to hire anyone. Any service agreement is between the homeowner and the independent provider."
    ] },
    { h: "What TreeServiceRequest.com does not do", p: [
      "TreeServiceRequest.com does not remove trees, trim trees, grind stumps, inspect trees, diagnose tree health, perform emergency service, employ arborists, operate trucks or crews, guarantee provider availability, guarantee response times, guarantee pricing, or guarantee insurance, licensing, certification, or qualifications.",
      "It also does not recommend a specific technical solution. Providers determine their own availability and discuss any assessment or work directly with the caller."
    ] },
    { h: "What homeowners should confirm", p: [
      "Before hiring anyone, confirm provider qualifications, licensing where applicable, insurance, scope, pricing, warranties, permits, timing, cleanup, hauling, and safety considerations directly with the provider. Ask questions until the scope is clear.",
      "If utility lines, immediate danger, or public safety concerns are involved, contact the utility company or emergency services when appropriate."
    ] },
    { h: "A transparent process", p: [
      "The goal is simple: make it easier to request a connection while keeping the roles clear. TreeServiceRequest.com is the routing website. The independent provider is responsible for evaluating the request, discussing options, and performing any agreed work.",
      "Availability is not guaranteed, and storm demand or specialized safety concerns can affect whether a provider can respond."
    ] }
  ],
  faqs: [
    { q: "Is TreeServiceRequest.com the tree-service company?", a: "No. It is a request-routing and lead-generation website." },
    { q: "Am I obligated to hire someone if I call?", a: "No. Calling to request connection does not obligate you to hire anyone." },
    { q: "Who confirms pricing?", a: "The independent provider confirms pricing directly with the caller." },
    { q: "Who confirms insurance and qualifications?", a: "The provider must answer questions about qualifications, insurance, licensing, certification, and scope directly." },
    { q: "Does TreeServiceRequest.com inspect trees?", a: "No. It does not inspect trees or diagnose tree health." },
    { q: "Can availability be guaranteed?", a: "No. Independent providers determine availability, scheduling, and response." }
  ]
}));

pages.push(longServicePage({
  url: "/privacy-policy/",
  title: "Privacy Policy | TreeServiceRequest.com",
  meta: "Privacy policy for TreeServiceRequest.com, a request-routing website for tree-service inquiries in Hot Springs, Arkansas.",
  h1: "Privacy Policy",
  nav: "Privacy Policy",
  serviceName: "Privacy policy",
  intro: "This privacy policy explains how information may be used when a homeowner contacts TreeServiceRequest.com to request connection with tree-service options.",
  sections: [
    { h: "Information you may provide", p: [
      "When you call or submit information in connection with a tree-service request, you may provide your name, phone number, property location, description of the tree concern, timing preferences, photos if requested by a provider, and other details needed to understand the request.",
      "Do not provide sensitive information that is not needed for the request."
    ] },
    { h: "How information may be used", p: [
      "Information may be used to route your request, communicate about the inquiry, help an independent provider understand the described concern, maintain business records, and improve request handling.",
      "Independent providers may contact you directly about availability, scope, pricing, qualifications, insurance, scheduling, and related service details."
    ] },
    { h: "No guarantee of provider availability", p: [
      "Submitting or calling about a request does not guarantee that a provider will be available or that any service will be performed. Any agreement for tree-service work is between you and the independent provider.",
      "TreeServiceRequest.com does not sell a guarantee of service, pricing, response time, or technical outcome."
    ] },
    { h: "Contact", p: [
      `For privacy-related questions about a request, call ${phoneDisplay}. This policy may be updated as the website changes.`
    ] }
  ],
  faqs: [
    { q: "Is calling required to use the site?", a: "The primary call to action is phone-based so the request can be described clearly." },
    { q: "May my information be shared with a provider?", a: "Information may be shared as needed to route the request to an independent provider when options may be available." },
    { q: "Does the site guarantee service?", a: "No. Provider availability, timing, scope, and pricing are confirmed directly with the provider." },
    { q: "Should I provide sensitive personal information?", a: "No. Provide only information relevant to the tree-service request." },
    { q: "Who discusses pricing?", a: "The independent provider discusses pricing directly with the caller." },
    { q: "How can I ask a privacy question?", a: `Call ${phoneDisplay} with privacy-related questions about a request.` }
  ]
}));

const css = `
:root{--green:#14613c;--leaf:#55a85f;--charcoal:#25312d;--ink:#1f2a26;--muted:#65716c;--warm:#f7f4ed;--paper:#fffdf8;--line:#d8ded4;--alert:#b85032;--shadow:0 18px 45px rgba(24,49,38,.12)}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;color:var(--ink);background:var(--paper);line-height:1.6}a{color:var(--green);text-decoration:none}a:hover{text-decoration:underline}img{max-width:100%;height:auto}.wrap{width:min(1120px,calc(100% - 40px));margin-inline:auto}.narrow{max-width:850px}.skip-link{position:absolute;left:16px;top:-80px;background:var(--charcoal);color:#fff;padding:10px 14px;border-radius:6px;z-index:20}.skip-link:focus{top:12px}.site-header{position:sticky;top:0;z-index:15;background:rgba(255,253,248,.96);backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}.header-inner{display:flex;align-items:center;justify-content:space-between;gap:24px;min-height:82px}.logo-link{display:flex;align-items:center}.logo-link img{width:198px;height:auto;display:block}.site-nav{display:flex;align-items:center;gap:16px;font-size:14px;font-weight:700}.site-nav a{color:var(--charcoal);white-space:nowrap}.nav-call{background:var(--green);color:#fff!important;padding:11px 14px;border-radius:6px}.nav-toggle{display:none;width:44px;height:44px;border:1px solid var(--line);background:#fff;border-radius:6px;align-items:center;justify-content:center;flex-direction:column;gap:5px}.nav-toggle span:not(.sr-only){display:block;width:20px;height:2px;background:var(--charcoal)}.sr-only{position:absolute;width:1px;height:1px;clip:rect(0 0 0 0);overflow:hidden;white-space:nowrap}.hero{background:linear-gradient(135deg,#f7f4ed 0%,#fffdf8 62%,#e8f2e4 100%);border-bottom:1px solid var(--line)}.hero-grid{display:grid;grid-template-columns:minmax(0,1.2fr) 380px;gap:44px;align-items:center;padding:72px 0}.breadcrumbs{font-size:13px;margin-bottom:24px;color:var(--muted)}.breadcrumbs a{color:var(--muted)}.eyebrow,.section-kicker{margin:0 0 10px;color:var(--green);font-weight:800;text-transform:uppercase;letter-spacing:0;font-size:13px}.hero h1{font-size:clamp(40px,6vw,72px);line-height:.96;letter-spacing:0;margin:0 0 22px;color:var(--charcoal);max-width:850px}.hero-lead{font-size:20px;max-width:760px;color:#3d4843;margin:0 0 26px}.hero-actions{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:20px}.button{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:13px 18px;border-radius:6px;font-weight:800;text-decoration:none}.button:hover{text-decoration:none}.button-phone{background:var(--green);color:#fff}.button-secondary{background:#fff;color:var(--green);border:1px solid var(--green)}.disclosure{font-size:14px;color:var(--muted);max-width:740px}.hero-card{background:#fff;border:1px solid var(--line);border-radius:8px;padding:26px;box-shadow:var(--shadow)}.leaf-mark{width:56px;height:56px;background:radial-gradient(circle at 40% 30%,#7fc36b 0 28%,#2f8c4f 29% 62%,#14613c 63%);border-radius:50% 50% 50% 12%;transform:rotate(-20deg);margin-bottom:18px}.hero-card h2{font-size:24px;line-height:1.1;margin:0 0 14px}.check-list,.dot-list{padding-left:20px;margin:0}.check-list li,.dot-list li{margin:8px 0}.section{padding:70px 0}.section h2{font-size:clamp(28px,4vw,44px);line-height:1.08;letter-spacing:0;color:var(--charcoal);margin:0 0 18px}.section h3{font-size:19px;line-height:1.25;margin:0 0 8px;color:var(--charcoal)}.band{background:var(--warm);border-block:1px solid var(--line)}.reason-grid,.service-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}.reason-grid article,.service-card{background:#fff;border:1px solid var(--line);border-radius:8px;padding:18px;min-height:150px}.service-card{display:block;color:var(--ink);box-shadow:0 8px 22px rgba(24,49,38,.06)}.service-card span{display:block;color:var(--green);font-weight:900;font-size:18px;margin-bottom:8px}.split-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(320px,420px);gap:34px;align-items:start}.safety-note{border-left:5px solid var(--alert);padding:14px 16px;background:#fff7f2;border-radius:0 6px 6px 0}.cta-panel{background:var(--charcoal);color:#fff;border-radius:8px;padding:28px;box-shadow:var(--shadow)}.cta-panel h2{color:#fff;font-size:28px}.cta-panel p{color:#e5ece7}.cta-panel .button-phone{background:var(--leaf);color:#10231a;margin-top:10px}.steps{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;list-style:none;padding:0;margin:0;counter-reset:step}.steps li{background:#fff;border:1px solid var(--line);border-radius:8px;padding:20px;counter-increment:step;min-height:190px}.steps li:before{content:counter(step);display:grid;place-items:center;width:36px;height:36px;background:var(--green);color:#fff;border-radius:50%;font-weight:900;margin-bottom:14px}.steps span{display:block;color:var(--muted);margin-top:8px}.content-columns{display:grid;grid-template-columns:1fr 1fr 1fr;gap:30px}.content{max-width:860px}.content section{margin-bottom:34px}.content p{font-size:18px}.link-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.link-grid a{background:#fff;border:1px solid var(--line);border-radius:6px;padding:14px;font-weight:800}.faq-list{display:grid;gap:12px}.faq-item{background:#fff;border:1px solid var(--line);border-radius:8px;padding:0}.faq-item summary{cursor:pointer;font-weight:900;color:var(--charcoal);padding:18px 20px;list-style:none}.faq-item summary::-webkit-details-marker{display:none}.faq-item p{margin:0;padding:0 20px 18px;color:#46504b}.site-footer{background:var(--charcoal);color:#edf3ef;padding:54px 0 92px}.footer-grid{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:34px}.footer-logo{width:230px;background:#fff;border-radius:6px;padding:6px;margin-bottom:12px}.site-footer h2{font-size:18px;color:#fff}.site-footer a{display:block;color:#dcefe0;margin:8px 0}.footer-bottom{border-top:1px solid rgba(255,255,255,.16);margin-top:34px;padding-top:18px;color:#c7d5cc}.mobile-call{display:none;position:fixed;left:16px;right:16px;bottom:14px;z-index:18;background:var(--green);color:#fff;text-align:center;padding:14px 18px;border-radius:6px;font-weight:900;box-shadow:var(--shadow)}.mobile-call:hover{text-decoration:none}@media (max-width:980px){.nav-toggle{display:flex}.site-nav{position:absolute;left:20px;right:20px;top:76px;display:none;flex-direction:column;align-items:stretch;background:#fff;border:1px solid var(--line);border-radius:8px;padding:14px;box-shadow:var(--shadow)}.site-nav.is-open{display:flex}.site-nav a{padding:10px}.hero-grid,.split-grid,.content-columns{grid-template-columns:1fr}.hero-grid{padding:48px 0}.hero-card{max-width:520px}.reason-grid,.service-grid,.steps,.link-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.mobile-call{display:block}}@media (max-width:620px){.wrap{width:min(100% - 28px,1120px)}.logo-link img{width:154px}.header-inner{min-height:70px}.hero h1{font-size:40px}.hero-lead{font-size:18px}.section{padding:48px 0}.reason-grid,.service-grid,.steps,.link-grid{grid-template-columns:1fr}.button{width:100%}.footer-grid{grid-template-columns:1fr}.site-footer{padding-bottom:96px}}`;

const js = `
document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#site-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", function () {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", function (event) {
    if (event.target.tagName === "A") {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
});
`;

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function write(file, content) {
  const out = path.join(root, file);
  ensureDir(out);
  fs.writeFileSync(out, content.trimStart());
}

for (const page of pages) {
  write(page.file, shell(page, page.body(), page.faqs));
}

write("styles.css", css);
write("script.js", js);
write("robots.txt", `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`);
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((page) => `  <url><loc>${siteUrl}${page.url}</loc></url>`).join("\n")}
</urlset>
`);
write("404.html", shell({
  url: "/404.html",
  title: "Page Not Found | TreeServiceRequest.com",
  meta: "The requested TreeServiceRequest.com page could not be found.",
  h1: "Page Not Found",
  nav: "Page Not Found"
}, `${hero({ url: "/404.html", h1: "Page Not Found", nav: "Page Not Found" }, "The page you requested could not be found. You can return to the homepage or call to describe your tree-service request.", true)}`, [
  { q: "Can I still call for request routing?", a: `Yes. Call ${phoneDisplay} to describe the tree concern and request connection with available local options.` }
]));
write("site.webmanifest", JSON.stringify({
  name: brand,
  short_name: "TreeServiceRequest",
  icons: [
    { src: "/assets/icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/assets/icon-512.png", sizes: "512x512", type: "image/png" }
  ],
  theme_color: "#14613c",
  background_color: "#fffdf8",
  display: "standalone"
}, null, 2));
write("vercel.json", JSON.stringify({
  cleanUrls: true,
  trailingSlash: true
}, null, 2));

console.log(`Generated ${pages.length} pages for ${brand}`);
