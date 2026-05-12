/* ============================================================
   SYRACUSE SNOWFALL DASHBOARD — script.js
   ============================================================
   This file does everything: holds the data, builds the charts,
   wires up click handlers, and handles CSV uploads.

   ORGANIZATION:
     §1  Raw Data
     §2  App Constants & Data-Processing Functions
     §3  Application State
     §4  Custom Chart.js Plugin (average reference line)
     §5  DOM Render Functions (stat cards, rankings, big days)
     §6  Chart Render Functions (bar, cumulative, monthly)
     §7  State Setters (setCompare, setShowAll)
     §8  CSV Upload & Parsing
     §9  Event Listeners
     §10 Initial Render
   ============================================================ */


/* ============================================================
   §1 — RAW DATA
   ============================================================
   Three datasets copied directly from App.jsx.

   ST  — Season Totals: array of [season_label, total_inches]
   SM  — Season Monthly: object keyed by season; each value is an
          array of 12 numbers indexed July=0 through June=11
   BIG_DAYS — Top 10 single-day snowfall records
   ============================================================ */

const ST = [["1938-39",99.7],["1939-40",0],["1940-41",88.4],["1941-42",84.6],["1942-43",94.2],["1943-44",66.1],["1944-45",127.7],["1945-46",67.8],["1946-47",110.7],["1947-48",75.5],["1948-49",76.6],["1949-50",118],["1950-51",92.8],["1951-52",100.5],["1952-53",77.5],["1953-54",85.9],["1954-55",101.4],["1955-56",146.8],["1956-57",76.1],["1957-58",141.1],["1958-59",137.2],["1959-60",134.8],["1960-61",130.5],["1961-62",0],["1962-63",116.5],["1963-64",83.8],["1964-65",97.3],["1965-66",118.8],["1966-67",83],["1967-68",81.2],["1968-69",97.9],["1969-70",125.5],["1970-71",157.2],["1971-72",133.7],["1972-73",81.2],["1973-74",123.2],["1974-75",105.5],["1975-76",95.8],["1976-77",145],["1977-78",161.2],["1978-79",0],["1979-80",93.4],["1980-81",79],["1981-82",137.1],["1982-83",66],["1983-84",113.6],["1984-85",116.4],["1985-86",104.9],["1986-87",93.5],["1987-88",111.4],["1988-89",97.8],["1989-90",162],["1990-91",96.9],["1991-92",166.9],["1992-93",192.1],["1993-94",163.8],["1994-95",66.9],["1995-96",170.9],["1996-97",131.1],["1997-98",134.7],["1998-99",98.3],["1999-00",85.8],["2000-01",191.9],["2001-02",59.4],["2002-03",153.2],["2003-04",181.3],["2004-05",136.2],["2005-06",124.6],["2006-07",140.2],["2007-08",109.1],["2008-09",149.6],["2009-10",106.3],["2010-11",179],["2011-12",50.6],["2012-13",115.4],["2013-14",132],["2014-15",119.7],["2015-16",80.3],["2016-17",134.9],["2017-18",153.6],["2018-19",115],["2019-20",87.6],["2020-21",73.3],["2021-22",76],["2022-23",65.6],["2023-24",60.8],["2024-25",115.4],["2025-26",142.8]];

const SM = {"1938-39":[0,0,0,0,8.0,32.7,30.7,15.3,13.0,0,0,0],"1939-40":[0,0,0,0,0,0,0,0,0,0,0,0],"1940-41":[0,0,0,0.3,9.3,8.6,21.7,15.7,32.4,0.4,0,0],"1941-42":[0,0,0,0,0.5,19.0,9.4,33.2,14.8,7.7,0,0],"1942-43":[0,0,0,1.5,7.5,13.4,29.2,27.4,8.6,6.1,0.5,0],"1943-44":[0,0,0,0,7.4,9.7,16.3,18.6,12.6,1.5,0,0],"1944-45":[0,0,0,0,24.4,46.1,39.8,14.7,1.5,0.2,1,0],"1945-46":[0,0,0,0,7.8,7.7,26.3,22.2,1.4,2.4,0,0],"1946-47":[0,0,0,0.6,0.9,25.8,11.1,26.6,38.6,5.4,1.7,0],"1947-48":[0,0,0,0,6.6,21.1,21.3,13.4,12.5,0.6,0,0],"1948-49":[0,0,0,0,1.8,23.1,22.2,12.5,17.0,0,0,0],"1949-50":[0,0,0,0,6.5,8.9,20.2,44.1,33.9,4.4,0,0],"1950-51":[0,0,0,0,8.1,33.8,21.2,17.5,12.2,0,0,0],"1951-52":[0,0,0,0,15.2,38.2,14.5,21.0,11.6,0,0,0],"1952-53":[0,0,0,4.4,4.2,11.1,17.5,31.0,9.2,0.1,0,0],"1953-54":[0,0,0,0,7.0,15.4,22.3,19.2,18.4,3.6,0,0],"1954-55":[0,0,0,0.1,6.9,20.0,20.0,26.8,27.5,0.1,0,0],"1955-56":[0,0,0,0.8,7.8,38.2,26.2,31.6,36.0,6.2,0,0],"1956-57":[0,0,0,0,7.7,16.8,25.2,6.7,12.7,7.0,0,0],"1957-58":[0,0,0,0,5.0,13.5,35.6,72.6,12.5,1.9,0,0],"1958-59":[0,0,0,0,22.1,22.5,48.8,17.8,26.0,0,0,0],"1959-60":[0,0,0,0,16.6,11.6,31.6,50.5,22.9,1.6,0,0],"1960-61":[0,0,0,2,2.7,27.8,37.3,25.8,26.5,8.4,0,0],"1961-62":[0,0,0,0,0,0,0,0,0,0,0,0],"1962-63":[0,0,0,2.8,11.0,33.8,22.2,28.3,15.8,1.8,0.8,0],"1963-64":[0,0,0,0,4.0,28.4,18.8,16.1,15.2,1.3,0,0],"1964-65":[0,0,0,0.3,4.0,18.3,31.8,24.9,13.3,4.7,0,0],"1965-66":[0,0,0,1.8,2.7,7.1,71.0,27.0,7.8,0.5,0.9,0],"1966-67":[0,0,0,0,0,33.0,18.3,21.0,10.4,0.3,0,0],"1967-68":[0,0,0,0,14.4,14.4,18.5,23.2,10.7,0,0,0],"1968-69":[0,0,0,0.8,16.5,25.4,24.5,21.3,9.4,0,0,0],"1969-70":[0,0,0,1.7,9.7,52.5,21.7,25.8,12.7,1.2,0.2,0],"1970-71":[0,0,0,0.8,7.0,51.9,30.3,25.2,37.2,4.8,0,0],"1971-72":[0,0,0,0,16.7,18.3,18.2,50.0,22.7,7.8,0,0],"1972-73":[0,0,0,0.3,15.8,29.8,11.9,13.3,3.6,5.3,1.2,0],"1973-74":[0,0,0,0,20.6,24.4,15.5,23.7,31.2,7.8,0,0],"1974-75":[0,0,0,2.8,4.8,26.2,11.8,27.3,20.6,12.0,0,0],"1975-76":[0,0,0,0,2.8,27.0,35.8,12.7,16.6,0.9,0,0],"1976-77":[0,0,0,0.3,25.9,25.7,52.3,24.4,13.5,1.9,1,0],"1977-78":[0,0,0,0,11.3,40.1,72.2,26.1,11.1,0.4,0,0],"1978-79":[0,0,0,0,0,0,0,0,0,0,0,0],"1979-80":[0,0,0,0.1,1.5,13.8,24.5,32.8,20.5,0.2,0,0],"1980-81":[0,0,0,0,7.3,28.8,23.4,8.5,10.6,0.4,0,0],"1981-82":[0,0,0,0.5,12.1,37.3,48.2,11.6,14.4,13.0,0,0],"1982-83":[0,0,0,0,1.9,10.9,20.3,8.2,8.3,16.4,0,0],"1983-84":[0,0,0,0,7.6,24.2,21.8,19.7,40.3,0,0,0],"1984-85":[0,0,0,0,5.0,23.4,57.3,21.6,7.1,2.0,0,0],"1985-86":[0,0,0,0,8.0,28.2,29.9,26.1,11.0,1.7,0,0],"1986-87":[0,0,0,0,16.1,8.8,49.2,15.1,3.0,1.3,0,0],"1987-88":[0,0,0,0,10.8,20.7,18.0,46.1,10.2,5.6,0,0],"1988-89":[0,0,0,5.7,0.2,34.4,19.4,21.7,9.9,6.5,0,0],"1989-90":[0,0,0,0,12.9,64.6,27.4,33.3,15.2,8.6,0,0],"1990-91":[0,0,0,0.2,7.8,24.5,30.9,27.7,2.8,3.0,0,0],"1991-92":[0,0,0,0,5.5,37.9,50.5,27.6,41.3,4.1,0,0],"1992-93":[0,0,0,1.4,10.1,19.8,42.9,51.3,54.4,12.2,0,0],"1993-94":[0,0,0,1.0,17.1,29.0,57.0,30.7,25.3,3.7,0,0],"1994-95":[0,0,0,0,3.5,5.9,13.4,32.3,7.1,4.7,0,0],"1995-96":[0,0,0,0,34.2,45.1,36.0,16.5,32.2,4.8,2.1,0],"1996-97":[0,0,0,0,25.9,21.2,38.7,19.1,23.4,2.8,0,0],"1997-98":[0,0,0,1.2,19.3,47.8,31.8,14.7,19.9,0,0,0],"1998-99":[0,0,0,0,0,13.5,50.7,5.7,28.4,0,0,0],"1999-00":[0,0,0,0,3.8,15.7,29.9,27.4,7.1,1.9,0,0],"2000-01":[0,0,0,0,20.2,70.3,28.4,27.8,45.0,0.2,0,0],"2001-02":[0,0,0,0.2,0.5,7.3,21.2,13.5,14.1,2.6,0,0],"2002-03":[0,0,0,0,17.2,40.0,44.2,37.1,11.7,3.0,0,0],"2003-04":[0,0,0,0,10.5,48.5,78.1,19.4,20.5,4.3,0,0],"2004-05":[0,0,0,0,2.6,19.0,44.5,42.0,28.1,0,0,0],"2005-06":[0,0,0,0,8.4,53.0,12.1,34.8,16.3,0,0,0],"2006-07":[0,0,0,0,0.1,12.1,37.9,59.5,19.9,10.7,0,0],"2007-08":[0,0,0,0,6.8,49.8,10.1,29.5,12.9,0,0,0],"2008-09":[0,0,0,0.6,16.1,57.3,49.8,24.2,0.9,0.7,0,0],"2009-10":[0,0,0,0,0.3,22.2,45.5,38.1,0,0,0.2,0],"2010-11":[0,0,0,0,0.8,72.8,43.2,43.3,18.5,0.4,0,0],"2011-12":[0,0,0,0,0.6,6.6,24.6,11.6,7.2,0,0,0],"2012-13":[0,0,0,0,2.8,32.4,11.6,36.4,20.2,12.0,0,0],"2013-14":[0,0,0,0,14.3,29.0,25.3,41.3,21.7,0.4,0,0],"2014-15":[0,0,0,0,11.0,17.5,18.3,60.0,12.3,0.6,0,0],"2015-16":[0,0,0,0.4,0.4,2.1,38.8,25.1,5.4,8.1,0,0],"2016-17":[0,0,0,0.2,25.2,37.2,8.4,32.7,30.9,0.3,0,0],"2017-18":[0,0,0,0,5.2,34.2,44.5,23.6,43.6,2.5,0,0],"2018-19":[0,0,0,0,22.8,14.7,33.0,27.2,14.8,2.5,0,0],"2019-20":[0,0,0,0,6.6,23.5,16.2,29.8,7.1,4.1,0.3,0],"2020-21":[0,0,0,0,1.6,13.2,22.7,26.9,4.6,4.3,0,0],"2021-22":[0,0,0,0,4.2,9.5,23.5,20.9,15.9,2.0,0,0],"2022-23":[0,0,0,0,3.7,16.4,10.2,21.6,13.7,0,0,0],"2023-24":[0,0,0,0,5.5,4.8,17.6,17.7,14.6,0.6,0,0],"2024-25":[0,0,0,0,0.2,20.8,42.3,41.7,7.1,3.3,0,0],"2025-26":[0,0,0,0,17.7,60.8,35.2,19.8,7.7,1.6,0,0]};

const BIG_DAYS = [
  ["2025-12-30",24.2,"2025-26"],["1993-03-13",22.1,"1992-93"],["1966-01-31",22,"1965-66"],
  ["1961-02-04",20.8,"1960-61"],["1944-11-30",20.1,"1944-45"],["1993-03-14",19.9,"1992-93"],
  ["1992-01-18",19.8,"1991-92"],["2017-03-14",18.9,"2016-17"],["1997-12-30",18.6,"1997-98"],
  ["2016-11-21",18.3,"2016-17"]
];


/* ============================================================
   §2 — APP CONSTANTS & DATA-PROCESSING FUNCTIONS
   ============================================================ */

/*
  MONTH_IDX maps to positions in the SM monthly arrays.
  The 12 positions correspond to July(0) Aug(1) Sep(2) Oct(3) Nov(4) Dec(5)
                                    Jan(6) Feb(7) Mar(8) Apr(9) May(10) Jun(11)
  We only display Oct–Apr, so MONTH_IDX = [3,4,5,6,7,8,9].
*/
const MONTH_IDX  = [3, 4, 5, 6, 7, 8, 9];
const MONTH_NAMES = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];

/*
  processData() — takes the raw ST and SM data and computes
  everything the dashboard needs: which seasons are valid,
  the historical average, the sorted rankings, etc.

  By putting all this logic in one function we can easily re-run it
  after the user uploads a new CSV.
*/
function processData(st, sm) {
  /*
    Identify "no data" seasons: those where the total is 0 AND
    every tracked monthly value is also 0. This matches the three
    known missing-data seasons in the original dataset (1939-40,
    1961-62, 1978-79) while still allowing a season with genuinely
    zero snow to be treated as valid if any month has a non-zero value.
  */
  const noData = st
    .filter(([s, t]) => t === 0 && MONTH_IDX.every(idx => (sm[s] || [])[idx] === 0))
    .map(([s]) => s);

  /* Valid seasons are all seasons except the no-data ones */
  const valid = st.filter(([s]) => !noData.includes(s));

  /* Historical average total (rounded to 1 decimal) */
  const avg = Math.round(
    valid.reduce((sum, [, t]) => sum + t, 0) / valid.length * 10
  ) / 10;

  /* Sort valid seasons from highest to lowest snowfall to get rankings */
  const ranked = [...valid]
    .sort((a, b) => b[1] - a[1])
    .map(([s, t], i) => ({ rank: i + 1, season: s, total: t }));

  /*
    The "current" season is the one with the highest start year
    (i.e., the most recent season in whatever data we have).
  */
  const currentSeason = st.reduce((latest, [s]) => {
    return parseInt(s, 10) > parseInt(latest, 10) ? s : latest;
  }, st[0][0]);

  const currentRank = ranked.find(r => r.season === currentSeason)?.rank;
  const snowiest    = ranked[0];
  const lightest    = ranked[ranked.length - 1];

  return { noData, valid, avg, ranked, currentSeason, currentRank, snowiest, lightest };
}

/*
  getCumulative() — for a given season, builds a running total
  of snowfall from Oct through Apr.

  Example for 1992-93:
    Oct → 1.4"  cumulative: 1.4
    Nov → 11.5" cumulative: 12.9  (1.4 + 11.5... wait, monthly values are per month)
    Actually it just adds each month's value to the running sum.

  Returns: [ {month:"Oct", value:1.4}, {month:"Nov", value:12.9}, ... ]
*/
function getCumulative(season, sm) {
  const m = sm[season];
  if (!m) return MONTH_NAMES.map(month => ({ month, value: 0 }));
  let running = 0;
  return MONTH_IDX.map((idx, i) => {
    running += (m[idx] || 0);
    return { month: MONTH_NAMES[i], value: Math.round(running * 10) / 10 };
  });
}

/*
  getAvgCumulative() — for each month Oct–Apr, computes the
  average cumulative snowfall across all valid seasons, plus the
  25th and 75th percentiles (the "typical range" gray band).

  The percentile calculation: sort all values for a given month,
  then take the value at position 25% and 75% through the sorted list.
*/
function getAvgCumulative(valid, sm) {
  /* Build a bucket of cumulative values for each month position */
  const buckets = MONTH_IDX.map(() => []);
  valid.forEach(([season]) => {
    const m = sm[season];
    if (!m) return;
    let running = 0;
    MONTH_IDX.forEach((idx, i) => {
      running += (m[idx] || 0);
      buckets[i].push(running);
    });
  });

  return MONTH_IDX.map((_, i) => {
    const sorted = [...buckets[i]].sort((a, b) => a - b);
    const n   = sorted.length;
    const avg = sorted.reduce((a, b) => a + b, 0) / n;
    return {
      month: MONTH_NAMES[i],
      avg: Math.round(avg * 10) / 10,
      p25: Math.round(sorted[Math.floor(n * 0.25)] * 10) / 10,
      p75: Math.round(sorted[Math.floor(n * 0.75)] * 10) / 10,
    };
  });
}


/* ============================================================
   §3 — APPLICATION STATE
   ============================================================
   These variables are the "memory" of the dashboard.
   When a user clicks a bar or ranking, we update these and
   then re-draw the affected charts.
   ============================================================ */

/* The active data (starts as the hardcoded data; replaced on CSV upload) */
let appST      = ST;
let appSM      = SM;
let appBigDays = BIG_DAYS;

/* Derived/computed values (recalculated whenever data changes) */
let computed = processData(ST, SM);

/*
  The season currently selected for comparison (orange color).
  Defaults to 1992-93 — the snowiest season on record.
*/
let compareSeasons = "1992-93";

/*
  Whether the cumulative chart is in "Compare" mode (false)
  or "All Seasons" mode (true).
*/
let showAll = false;

/* Chart.js chart instances — we store them here so we can destroy
   and recreate them whenever data or selections change. */
let barChartInst     = null;
let cumChartInst     = null;
let monthlyChartInst = null;


/* ============================================================
   §4 — CUSTOM CHART.JS PLUGIN: AVERAGE REFERENCE LINE
   ============================================================
   Chart.js doesn't have a built-in "draw a horizontal line at Y"
   feature, so we register a small custom plugin that draws it
   using the Canvas 2D drawing API.

   Every Chart.js plugin is an object with lifecycle hooks.
   "afterDraw" runs after Chart.js finishes drawing everything else,
   so our line appears on top.
   ============================================================ */
const avgLinePlugin = {
  id: 'avgLine',
  afterDraw(chart) {
    /* Read our custom config from chart.options.plugins.avgLine */
    const opts = chart.options.plugins.avgLine;
    if (!opts || !opts.enabled) return;

    const { ctx, chartArea, scales } = chart;

    /*
      scales.y.getPixelForValue(v) converts a data value (like 112.5")
      into a pixel Y position on the canvas.
    */
    const y = scales.y.getPixelForValue(opts.value);

    /* Draw the dashed line using the Canvas 2D API */
    ctx.save();
    ctx.strokeStyle = '#3a6080';
    ctx.lineWidth   = 1;
    ctx.setLineDash([6, 3]);   /* [dash length, gap length] in pixels */
    ctx.beginPath();
    ctx.moveTo(chartArea.left, y);
    ctx.lineTo(chartArea.right, y);
    ctx.stroke();
    ctx.setLineDash([]);       /* Reset to solid lines for everything else */
    ctx.restore();
  }
};

/* Register the plugin so Chart.js uses it automatically on every chart */
Chart.register(avgLinePlugin);


/* ============================================================
   §5 — DOM RENDER FUNCTIONS
   These functions update the HTML content of the page.
   They don't touch charts — just text and lists.
   ============================================================ */

function renderStatCards() {
  const { currentSeason, avg, ranked, currentRank, snowiest, lightest, valid } = computed;
  const currentTotal = appST.find(([s]) => s === currentSeason)?.[1] ?? 0;

  const cards = [
    { label: "Current Season", value: `${currentTotal}"`, sub: currentSeason.replace('-', '–'), hl: true },
    { label: "All-Time Rank",  value: `#${currentRank}`,  sub: `of ${valid.length} seasons`,    hl: true },
    { label: "Historical Avg", value: `${avg}"`,           sub: "per season" },
    { label: "Snowiest",       value: `${snowiest.total}"`, sub: snowiest.season.replace('-', '–') },
    { label: "Lightest",       value: `${lightest.total}"`, sub: lightest.season.replace('-', '–') },
  ];

  document.getElementById('stat-grid').innerHTML = cards.map(c => `
    <div class="stat-card ${c.hl ? 'stat-card--hl' : ''}">
      <div class="stat-label">${c.label}</div>
      <div class="stat-value ${c.hl ? 'stat-value--hl' : ''}">${c.value}</div>
      <div class="stat-sub">${c.sub}</div>
    </div>
  `).join('');
}

function renderRankings() {
  const { ranked, currentSeason } = computed;
  const top20 = ranked.slice(0, 20);
  const currentEntry = ranked.find(r => r.season === currentSeason);
  const showEllipsis = currentEntry && currentEntry.rank > 20;

  /* Build rows for the top 20 */
  let html = top20.map(r => {
    const isCur = r.season === currentSeason;
    const isCmp = r.season === compareSeasons;
    return `
      <div class="ranking-row ${isCur ? 'ranking-row--current' : ''} ${isCmp ? 'ranking-row--compare' : ''}"
           data-season="${r.season}">
        <span class="ranking-num ${r.rank <= 3 ? 'ranking-num--top3' : ''}">${r.rank}</span>
        <span class="ranking-season">${r.season}</span>
        <span class="ranking-total">${r.total.toFixed(1)}"</span>
      </div>`;
  }).join('');

  /* If current season is outside top 20, show it below a separator */
  if (showEllipsis) {
    html += `<div class="ranking-ellipsis">···</div>`;
    html += `
      <div class="ranking-row ranking-row--current" data-season="${currentSeason}">
        <span class="ranking-num">${currentEntry.rank}</span>
        <span class="ranking-season">${currentSeason}</span>
        <span class="ranking-total">${currentEntry.total.toFixed(1)}"</span>
      </div>`;
  }

  const listEl = document.getElementById('rankings-list');
  listEl.innerHTML = html;

  /* Wire up click handlers — clicking a row sets it as the comparison season */
  listEl.querySelectorAll('.ranking-row[data-season]').forEach(row => {
    const season = row.dataset.season;
    if (season !== currentSeason) {
      row.style.cursor = 'pointer';
      row.addEventListener('click', () => setCompare(season));
    }
  });
}

function renderBigDays() {
  const { currentSeason } = computed;

  document.getElementById('big-days-list').innerHTML = appBigDays.map(([date, snow, season], i) => {
    const isCur = season === currentSeason;
    /* Format date like "Dec 30, 2025" */
    const formatted = new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
    return `
      <div class="big-day ${isCur ? 'big-day--current' : ''} ${i === 0 ? 'big-day--record' : ''}">
        <span class="big-day-snow ${isCur ? 'big-day-snow--current' : i < 3 ? 'big-day-snow--top' : ''}">
          ${snow.toFixed(1)}"
        </span>
        <div class="big-day-info">
          <div class="big-day-date ${isCur ? 'big-day-date--current' : ''}">${formatted}</div>
          <div class="big-day-season">${season}</div>
        </div>
        ${i === 0 ? '<span class="big-day-badge">Record</span>' : ''}
      </div>`;
  }).join('');
}


/* ============================================================
   §6 — CHART RENDER FUNCTIONS
   ============================================================
   Each function destroys the existing Chart.js instance (if any)
   and creates a fresh one. This is the simplest approach and
   works perfectly well for user-driven interactions.
   ============================================================ */

/* ── Bar Chart ──────────────────────────────────────────── */
function renderBarChart() {
  if (barChartInst) { barChartInst.destroy(); barChartInst = null; }

  const { noData, avg, currentSeason } = computed;
  const seasons = appST.map(([s]) => s);
  const labels  = seasons.map(s => "'" + s.slice(2, 4));  /* "1992-93" → "'92" */
  const totals  = appST.map(([, t]) => t);

  /*
    Per-bar colors — stored as arrays, one entry per bar.
    Chart.js reads backgroundColor[i] for the i-th bar.
  */
  const bgColors = seasons.map(s => {
    if (s === currentSeason) return '#64b5f6';                 /* blue  — current */
    if (s === compareSeasons) return '#d4956a';                /* orange — compare */
    if (noData.includes(s))   return 'rgba(74,122,158,0.05)'; /* near-invisible */
    return 'rgba(74,122,158,0.22)';                            /* dim blue — default */
  });

  const borderColors = seasons.map(s =>
    (s === currentSeason || s === compareSeasons) ? 'rgba(255,255,255,0.25)' : 'transparent'
  );

  barChartInst = new Chart(document.getElementById('bar-chart'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data:            totals,
        backgroundColor: bgColors,
        borderColor:     borderColors,
        borderWidth:     1,
        borderRadius:    2,
        borderSkipped:   false,
      }]
    },
    options: {
      animation:           false,   /* instant updates when user clicks */
      maintainAspectRatio: false,   /* lets us control height via CSS */
      plugins: {
        legend:  { display: false },   /* we draw our own legend below */

        /* Our custom plugin config — drawn by avgLinePlugin above */
        avgLine: { enabled: true, value: avg },

        tooltip: {
          backgroundColor: 'rgba(8,16,28,0.94)',
          titleColor:      '#b8d8f0',
          bodyColor:       '#c0d8ea',
          borderColor:     'rgba(100,160,210,0.18)',
          borderWidth:     1,
          titleFont:       { family: "'Outfit'", size: 13, weight: '600' },
          bodyFont:        { family: "'Outfit'", size: 12 },
          padding:         10,
          callbacks: {
            /* The tooltip title shows the full season label, not the short "'92" label */
            title: (items) => seasons[items[0].dataIndex],
            label: (item) => {
              const season = seasons[item.dataIndex];
              if (noData.includes(season)) return '  No data available';
              const rank = computed.ranked.find(r => r.season === season);
              const lines = [`  ${item.raw}"`];
              if (rank) lines.push(`  #${rank.rank} all-time`);
              if (season !== currentSeason) lines.push('  Click to compare');
              return lines;
            }
          }
        }
      },

      /* Clicking a bar sets it as the comparison season */
      onClick: (event, elements) => {
        if (!elements.length) return;
        const season = seasons[elements[0].index];
        if (!noData.includes(season) && season !== currentSeason) {
          setCompare(season);
        }
      },

      scales: {
        x: {
          ticks: {
            color:         '#2e5070',
            font:          { family: "'Outfit'", size: 9 },
            maxTicksLimit: 18,   /* show roughly every 5th label to avoid crowding */
          },
          grid:   { display: false },
          border: { color: 'rgba(74,122,158,0.12)' },
        },
        y: {
          ticks: {
            color:    '#2e5070',
            font:     { family: "'Outfit'", size: 9 },
            callback: v => `${v}"`,
          },
          grid:   { color: 'rgba(74,122,158,0.06)' },
          border: { display: false },
        }
      }
    }
  });

  /* Update the legend text below the chart */
  document.getElementById('bar-legend').innerHTML = `
    <span class="legend-item">
      <span class="legend-swatch" style="background:#64b5f6;border-radius:2px"></span>
      ${currentSeason}
    </span>
    <span class="legend-item">
      <span class="legend-swatch" style="background:#d4956a;border-radius:2px"></span>
      ${compareSeasons}
    </span>
    <span class="legend-item">
      <span class="legend-dash"></span>
      avg (${avg}")
    </span>`;
}

/*
  updateBarColors() — a fast alternative to a full re-render.
  When the user clicks to change the comparison season, we only
  need to swap the bar colors, not rebuild the entire chart.
  Chart.js can update data in-place using chart.update().
*/
function updateBarColors() {
  if (!barChartInst) return;
  const { noData, currentSeason } = computed;
  const seasons = appST.map(([s]) => s);

  barChartInst.data.datasets[0].backgroundColor = seasons.map(s => {
    if (s === currentSeason) return '#64b5f6';
    if (s === compareSeasons) return '#d4956a';
    if (noData.includes(s))  return 'rgba(74,122,158,0.05)';
    return 'rgba(74,122,158,0.22)';
  });

  /* 'none' disables animation for this specific update — feels instant */
  barChartInst.update('none');

  /* Also update the legend text */
  const avg = computed.avg;
  document.getElementById('bar-legend').innerHTML = `
    <span class="legend-item">
      <span class="legend-swatch" style="background:#64b5f6;border-radius:2px"></span>
      ${currentSeason}
    </span>
    <span class="legend-item">
      <span class="legend-swatch" style="background:#d4956a;border-radius:2px"></span>
      ${compareSeasons}
    </span>
    <span class="legend-item">
      <span class="legend-dash"></span>
      avg (${avg}")
    </span>`;
}

/* ── Cumulative Line Chart ───────────────────────────────── */
function renderCumulativeChart() {
  if (cumChartInst) { cumChartInst.destroy(); cumChartInst = null; }

  const { valid, currentSeason } = computed;
  const avgData = getAvgCumulative(valid, appSM);
  const nValid  = valid.length;

  /* Update the subtitle text above the chart */
  const compEntry = computed.ranked.find(r => r.season === compareSeasons);
  const subtitleEl = document.getElementById('cum-subtitle');
  if (showAll) {
    subtitleEl.innerHTML =
      `<span class="accent-blue">${currentSeason}</span> compared to every season on record`;
  } else {
    subtitleEl.innerHTML =
      `<span class="accent-blue">${currentSeason}</span> vs ` +
      `<span class="accent-orange">${compareSeasons} (#${compEntry?.rank})</span>` +
      ` · <span class="muted">Gray band = typical range across all ${nValid} seasons</span>`;
  }

  let datasets;

  if (showAll) {
    /* ── ALL SEASONS MODE ──────────────────────────────────
       Draw every valid season as a faint gray-blue line,
       then overlay the average (dashed) and current season (bold blue).
    */
    datasets = [];

    /* All seasons except the current one — very faint */
    valid.forEach(([season]) => {
      if (season === currentSeason) return;
      const cum = getCumulative(season, appSM);
      datasets.push({
        label:       season,
        data:        cum.map(c => c.value),
        borderColor: 'rgba(120,160,190,0.18)',
        borderWidth: 1,
        pointRadius: 0,
        tension:     0.3,
        fill:        false,
      });
    });

    /* Average line (dashed) */
    datasets.push({
      label:       `${nValid}-season avg`,
      data:        avgData.map(a => a.avg),
      borderColor: '#3a6080',
      borderWidth: 1.5,
      borderDash:  [6, 3],
      pointRadius: 0,
      tension:     0.3,
      fill:        false,
    });

    /* Current season — bold blue, always on top */
    datasets.push({
      label:              currentSeason,
      data:               getCumulative(currentSeason, appSM).map(c => c.value),
      borderColor:        '#64b5f6',
      borderWidth:        3,
      pointRadius:        4,
      pointBackgroundColor: '#64b5f6',
      tension:            0.3,
      fill:               false,
    });

  } else {
    /* ── COMPARE MODE ──────────────────────────────────────
       Show: current season (blue) + comparison season (orange)
             + historical average (dashed)
             + interquartile band (shaded area between p25 and p75)

       The band trick:
         Dataset 0 (p25): invisible line at the bottom of the band
         Dataset 1 (p75): invisible line at the top, with fill:'-1'
           — Chart.js fills the area between this dataset and the
             previous one (p25), creating a shaded band.
    */
    const curCum  = getCumulative(currentSeason, appSM);
    const compCum = getCumulative(compareSeasons, appSM);

    datasets = [
      /* Lower bound of the shaded band (invisible) */
      {
        label:           'p25',
        data:            avgData.map(a => a.p25),
        borderColor:     'transparent',
        backgroundColor: 'transparent',
        pointRadius:     0,
        fill:            false,
      },
      /* Upper bound — fills DOWN to p25, creating the band */
      {
        label:           'p75',
        data:            avgData.map(a => a.p75),
        borderColor:     'transparent',
        backgroundColor: 'rgba(74,122,158,0.14)',
        pointRadius:     0,
        fill:            '-1',   /* '-1' means "fill to the previous dataset" */
      },
      /* Historical average (dashed line) */
      {
        label:       `${nValid}-season avg`,
        data:        avgData.map(a => a.avg),
        borderColor: '#3a6080',
        borderWidth: 1.5,
        borderDash:  [6, 3],
        pointRadius: 0,
        tension:     0.3,
        fill:        false,
      },
      /* Comparison season (orange) */
      {
        label:                compareSeasons,
        data:                 compCum.map(c => c.value),
        borderColor:          '#d4956a',
        borderWidth:          2.5,
        pointRadius:          4,
        pointBackgroundColor: '#d4956a',
        tension:              0.3,
        fill:                 false,
      },
      /* Current season (blue) */
      {
        label:                currentSeason,
        data:                 curCum.map(c => c.value),
        borderColor:          '#64b5f6',
        borderWidth:          2.5,
        pointRadius:          4,
        pointBackgroundColor: '#64b5f6',
        tension:              0.3,
        fill:                 false,
      },
    ];
  }

  cumChartInst = new Chart(document.getElementById('cum-chart'), {
    type: 'line',
    data: { labels: MONTH_NAMES, datasets },
    options: {
      animation:           false,
      maintainAspectRatio: false,
      plugins: {
        legend:  { display: false },
        tooltip: {
          backgroundColor: 'rgba(8,16,28,0.94)',
          titleColor:      '#b8d8f0',
          bodyColor:       '#c0d8ea',
          borderColor:     'rgba(100,160,210,0.18)',
          borderWidth:     1,
          titleFont:       { family: "'Outfit'", size: 13, weight: '600' },
          bodyFont:        { family: "'Outfit'", size: 12 },
          padding:         10,
          mode:            showAll ? 'nearest' : 'index',
          intersect:       false,
          /* Hide the invisible band datasets from the tooltip */
          filter: (item) => !['p25','p75'].includes(item.dataset.label),
          callbacks: {
            label: (item) => item.raw != null ? `  ${item.dataset.label}: ${item.raw}"` : null
          }
        }
      },
      scales: {
        x: {
          ticks:  { color: '#4a7a9e', font: { family: "'Outfit'", size: 12 } },
          grid:   { color: 'rgba(74,122,158,0.07)' },
          border: { color: 'rgba(74,122,158,0.12)' },
        },
        y: {
          ticks: {
            color:    '#2e5070',
            font:     { family: "'Outfit'", size: 10 },
            callback: v => `${v}"`,
          },
          grid:   { color: 'rgba(74,122,158,0.07)' },
          border: { display: false },
        }
      }
    }
  });
}

/* ── Monthly Grouped Bar Chart ──────────────────────────── */
function renderMonthlyChart() {
  if (monthlyChartInst) { monthlyChartInst.destroy(); monthlyChartInst = null; }

  const { currentSeason } = computed;
  const curMonthly  = MONTH_IDX.map(idx => (appSM[currentSeason]  || [])[idx] || 0);
  const compMonthly = MONTH_IDX.map(idx => (appSM[compareSeasons] || [])[idx] || 0);

  document.getElementById('monthly-subtitle').innerHTML =
    `<span class="accent-blue">${currentSeason}</span> vs ` +
    `<span class="accent-orange">${compareSeasons}</span>`;

  monthlyChartInst = new Chart(document.getElementById('monthly-chart'), {
    type: 'bar',
    data: {
      labels: MONTH_NAMES,
      datasets: [
        {
          label:            currentSeason,
          data:             curMonthly,
          backgroundColor: '#64b5f6',
          borderRadius:     3,
          barPercentage:    0.8,
          categoryPercentage: 0.85,
        },
        {
          label:            compareSeasons,
          data:             compMonthly,
          backgroundColor: '#d4956a',
          borderRadius:     3,
          barPercentage:    0.8,
          categoryPercentage: 0.85,
        }
      ]
    },
    options: {
      animation:           false,
      maintainAspectRatio: false,
      plugins: {
        legend:  { display: false },
        avgLine: { enabled: false },   /* no average line on this chart */
        tooltip: {
          backgroundColor: 'rgba(8,16,28,0.94)',
          titleColor:      '#b8d8f0',
          bodyColor:       '#c0d8ea',
          borderColor:     'rgba(100,160,210,0.18)',
          borderWidth:     1,
          titleFont:       { family: "'Outfit'", size: 13, weight: '600' },
          bodyFont:        { family: "'Outfit'", size: 12 },
          padding:         10,
          callbacks: {
            label: item => `  ${item.dataset.label}: ${item.raw}"`
          }
        }
      },
      scales: {
        x: {
          ticks:  { color: '#4a7a9e', font: { family: "'Outfit'", size: 12 } },
          grid:   { display: false },
          border: { color: 'rgba(74,122,158,0.12)' },
        },
        y: {
          ticks: {
            color:    '#2e5070',
            font:     { family: "'Outfit'", size: 10 },
            callback: v => `${v}"`,
          },
          grid:   { color: 'rgba(74,122,158,0.06)' },
          border: { display: false },
        }
      }
    }
  });
}

/* Convenience: re-render everything */
function renderAll() {
  renderStatCards();
  renderBarChart();
  renderCumulativeChart();
  renderMonthlyChart();
  renderRankings();
  renderBigDays();
}


/* ============================================================
   §7 — STATE SETTERS
   ============================================================ */

/*
  setCompare(season) — change which season is highlighted in orange.
  We update the bar colors in-place (fast) and recreate only the
  charts whose data actually changes (cumulative, monthly, rankings).
*/
function setCompare(season) {
  if (season === compareSeasons) return;
  compareSeasons = season;
  updateBarColors();
  renderCumulativeChart();
  renderMonthlyChart();
  renderRankings();
}

/*
  setShowAll(val) — toggle the cumulative chart between
  "Compare" mode and "All Seasons" mode.
*/
function setShowAll(val) {
  showAll = val;
  document.getElementById('btn-compare').classList.toggle('active', !val);
  document.getElementById('btn-all').classList.toggle('active', val);
  renderCumulativeChart();
}


/* ============================================================
   §8 — CSV UPLOAD & PARSING
   ============================================================
   The user can upload a CSV with one row per season.
   Required columns: season, total, oct, nov, dec, jan, feb, mar, apr

   The browser's FileReader API reads the file contents as text,
   then we parse it ourselves — no server involved.
   ============================================================ */

function parseCSV(text) {
  /*
    Split text into lines, handling both Windows (\r\n) and Unix (\n)
    line endings. Then strip empty lines.
  */
  const lines = text.trim().split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) {
    throw new Error('CSV needs at least a header row and one data row.');
  }

  /* Parse header row and normalize to lowercase */
  const headers  = lines[0].split(',').map(h => h.trim().toLowerCase());
  const required = ['season', 'total', 'oct', 'nov', 'dec', 'jan', 'feb', 'mar', 'apr'];

  /* Check that every required column is present */
  const missing = required.filter(col => !headers.includes(col));
  if (missing.length > 0) {
    throw new Error(`Missing required column(s): ${missing.join(', ')}. ` +
      `Expected: season, total, oct, nov, dec, jan, feb, mar, apr`);
  }

  /* Build a lookup table: column name → index in the row array */
  const idx = {};
  required.forEach(col => { idx[col] = headers.indexOf(col); });

  const newST = [];
  const newSM = {};

  for (let i = 1; i < lines.length; i++) {
    const vals = lines[i].split(',').map(v => v.trim());
    const season = vals[idx.season];
    const total  = parseFloat(vals[idx.total]);

    if (!season)    throw new Error(`Row ${i + 1}: season is empty.`);
    if (isNaN(total)) throw new Error(`Row ${i + 1}: total "${vals[idx.total]}" is not a number.`);

    newST.push([season, total]);

    /*
      Reconstruct the 12-element monthly array.
      Only indices 3–9 (Oct–Apr) are used; the rest are 0.
    */
    const monthly = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    monthly[3] = parseFloat(vals[idx.oct]) || 0;
    monthly[4] = parseFloat(vals[idx.nov]) || 0;
    monthly[5] = parseFloat(vals[idx.dec]) || 0;
    monthly[6] = parseFloat(vals[idx.jan]) || 0;
    monthly[7] = parseFloat(vals[idx.feb]) || 0;
    monthly[8] = parseFloat(vals[idx.mar]) || 0;
    monthly[9] = parseFloat(vals[idx.apr]) || 0;
    newSM[season] = monthly;
  }

  if (newST.length === 0) throw new Error('No data rows found in the CSV.');
  return { st: newST, sm: newSM };
}

function showUploadError(message) {
  const el = document.getElementById('upload-error');
  el.textContent = '⚠ ' + message;
  el.style.display = 'block';
}

function hideUploadError() {
  document.getElementById('upload-error').style.display = 'none';
}


/* ============================================================
   §9 — EVENT LISTENERS
   ============================================================ */

/* Upload button → trigger the hidden file picker */
document.getElementById('upload-btn').addEventListener('click', () => {
  document.getElementById('csv-input').click();
});

/*
  File picker "change" event fires when the user selects a file.
  FileReader reads the file contents asynchronously; when done,
  reader.onload fires with the file text.
*/
document.getElementById('csv-input').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const { st, sm } = parseCSV(event.target.result);

      /* Replace the active data with the uploaded data */
      appST = st;
      appSM = sm;
      /* Keep the original Big Days table — it doesn't live in the CSV */

      /* Recompute all derived values from the new data */
      computed = processData(st, sm);

      /*
        Pick a new default comparison season: the highest-ranked season
        that isn't the current season (which is highlighted blue).
      */
      compareSeasons =
        computed.ranked.find(r => r.season !== computed.currentSeason)?.season
        ?? computed.ranked[0].season;

      hideUploadError();
      renderAll();

    } catch (err) {
      showUploadError(err.message);
    }
  };

  reader.readAsText(file);

  /*
    Reset the input value so the user can re-upload the same filename.
    Without this, selecting the same file twice won't trigger "change".
  */
  e.target.value = '';
});

/* Toggle buttons for the cumulative chart */
document.getElementById('btn-compare').addEventListener('click', () => setShowAll(false));
document.getElementById('btn-all').addEventListener('click', () => setShowAll(true));

/*
  Download button — generates a CSV from whatever data is currently displayed
  (either the built-in data or whatever the user uploaded) and triggers a
  browser file download. Nothing is sent to a server.

  How it works:
    1. Build a string in CSV format
    2. Wrap it in a Blob (a browser object that represents raw file data)
    3. Create a temporary invisible <a> link pointing to that Blob
    4. Programmatically click the link to trigger the download
    5. Clean up the temporary URL
*/
document.getElementById('download-btn').addEventListener('click', () => {
  const header = 'season,total,oct,nov,dec,jan,feb,mar,apr';
  const rows = appST.map(([season, total]) => {
    const m = appSM[season] || [0,0,0,0,0,0,0,0,0,0,0,0];
    return [season, total, m[3], m[4], m[5], m[6], m[7], m[8], m[9]].join(',');
  });
  const csvText = [header, ...rows].join('\n');

  const blob = new Blob([csvText], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'syracuse-snowfall.csv';
  a.click();
  URL.revokeObjectURL(url);
});


/* ============================================================
   §10 — INITIAL RENDER
   ============================================================
   Now that all functions and event listeners are wired up,
   draw everything for the first time using the built-in data.
   ============================================================ */
renderAll();
