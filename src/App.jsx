import { useState, useMemo, useRef } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Cell, Area, AreaChart, ComposedChart
} from "recharts";

/* ─── DATA ─── */
const ST = [["1938-39",99.7],["1939-40",0],["1940-41",88.4],["1941-42",84.6],["1942-43",94.2],["1943-44",66.1],["1944-45",127.7],["1945-46",67.8],["1946-47",110.7],["1947-48",75.5],["1948-49",76.6],["1949-50",118],["1950-51",92.8],["1951-52",100.5],["1952-53",77.5],["1953-54",85.9],["1954-55",101.4],["1955-56",146.8],["1956-57",76.1],["1957-58",141.1],["1958-59",137.2],["1959-60",134.8],["1960-61",130.5],["1961-62",0],["1962-63",116.5],["1963-64",83.8],["1964-65",97.3],["1965-66",118.8],["1966-67",83],["1967-68",81.2],["1968-69",97.9],["1969-70",125.5],["1970-71",157.2],["1971-72",133.7],["1972-73",81.2],["1973-74",123.2],["1974-75",105.5],["1975-76",95.8],["1976-77",145],["1977-78",161.2],["1978-79",0],["1979-80",93.4],["1980-81",79],["1981-82",137.1],["1982-83",66],["1983-84",113.6],["1984-85",116.4],["1985-86",104.9],["1986-87",93.5],["1987-88",111.4],["1988-89",97.8],["1989-90",162],["1990-91",96.9],["1991-92",166.9],["1992-93",192.1],["1993-94",163.8],["1994-95",66.9],["1995-96",170.9],["1996-97",131.1],["1997-98",134.7],["1998-99",98.3],["1999-00",85.8],["2000-01",191.9],["2001-02",59.4],["2002-03",153.2],["2003-04",181.3],["2004-05",136.2],["2005-06",124.6],["2006-07",140.2],["2007-08",109.1],["2008-09",149.6],["2009-10",106.3],["2010-11",179],["2011-12",50.6],["2012-13",115.4],["2013-14",132],["2014-15",119.7],["2015-16",80.3],["2016-17",134.9],["2017-18",153.6],["2018-19",115],["2019-20",87.6],["2020-21",73.3],["2021-22",76],["2022-23",65.6],["2023-24",60.8],["2024-25",115.4],["2025-26",142.8]];

const SM = {"1938-39":[0,0,0,0,8.0,32.7,30.7,15.3,13.0,0,0,0],"1939-40":[0,0,0,0,0,0,0,0,0,0,0,0],"1940-41":[0,0,0,0.3,9.3,8.6,21.7,15.7,32.4,0.4,0,0],"1941-42":[0,0,0,0,0.5,19.0,9.4,33.2,14.8,7.7,0,0],"1942-43":[0,0,0,1.5,7.5,13.4,29.2,27.4,8.6,6.1,0.5,0],"1943-44":[0,0,0,0,7.4,9.7,16.3,18.6,12.6,1.5,0,0],"1944-45":[0,0,0,0,24.4,46.1,39.8,14.7,1.5,0.2,1,0],"1945-46":[0,0,0,0,7.8,7.7,26.3,22.2,1.4,2.4,0,0],"1946-47":[0,0,0,0.6,0.9,25.8,11.1,26.6,38.6,5.4,1.7,0],"1947-48":[0,0,0,0,6.6,21.1,21.3,13.4,12.5,0.6,0,0],"1948-49":[0,0,0,0,1.8,23.1,22.2,12.5,17.0,0,0,0],"1949-50":[0,0,0,0,6.5,8.9,20.2,44.1,33.9,4.4,0,0],"1950-51":[0,0,0,0,8.1,33.8,21.2,17.5,12.2,0,0,0],"1951-52":[0,0,0,0,15.2,38.2,14.5,21.0,11.6,0,0,0],"1952-53":[0,0,0,4.4,4.2,11.1,17.5,31.0,9.2,0.1,0,0],"1953-54":[0,0,0,0,7.0,15.4,22.3,19.2,18.4,3.6,0,0],"1954-55":[0,0,0,0.1,6.9,20.0,20.0,26.8,27.5,0.1,0,0],"1955-56":[0,0,0,0.8,7.8,38.2,26.2,31.6,36.0,6.2,0,0],"1956-57":[0,0,0,0,7.7,16.8,25.2,6.7,12.7,7.0,0,0],"1957-58":[0,0,0,0,5.0,13.5,35.6,72.6,12.5,1.9,0,0],"1958-59":[0,0,0,0,22.1,22.5,48.8,17.8,26.0,0,0,0],"1959-60":[0,0,0,0,16.6,11.6,31.6,50.5,22.9,1.6,0,0],"1960-61":[0,0,0,2,2.7,27.8,37.3,25.8,26.5,8.4,0,0],"1961-62":[0,0,0,0,0,0,0,0,0,0,0,0],"1962-63":[0,0,0,2.8,11.0,33.8,22.2,28.3,15.8,1.8,0.8,0],"1963-64":[0,0,0,0,4.0,28.4,18.8,16.1,15.2,1.3,0,0],"1964-65":[0,0,0,0.3,4.0,18.3,31.8,24.9,13.3,4.7,0,0],"1965-66":[0,0,0,1.8,2.7,7.1,71.0,27.0,7.8,0.5,0.9,0],"1966-67":[0,0,0,0,0,33.0,18.3,21.0,10.4,0.3,0,0],"1967-68":[0,0,0,0,14.4,14.4,18.5,23.2,10.7,0,0,0],"1968-69":[0,0,0,0.8,16.5,25.4,24.5,21.3,9.4,0,0,0],"1969-70":[0,0,0,1.7,9.7,52.5,21.7,25.8,12.7,1.2,0.2,0],"1970-71":[0,0,0,0.8,7.0,51.9,30.3,25.2,37.2,4.8,0,0],"1971-72":[0,0,0,0,16.7,18.3,18.2,50.0,22.7,7.8,0,0],"1972-73":[0,0,0,0.3,15.8,29.8,11.9,13.3,3.6,5.3,1.2,0],"1973-74":[0,0,0,0,20.6,24.4,15.5,23.7,31.2,7.8,0,0],"1974-75":[0,0,0,2.8,4.8,26.2,11.8,27.3,20.6,12.0,0,0],"1975-76":[0,0,0,0,2.8,27.0,35.8,12.7,16.6,0.9,0,0],"1976-77":[0,0,0,0.3,25.9,25.7,52.3,24.4,13.5,1.9,1,0],"1977-78":[0,0,0,0,11.3,40.1,72.2,26.1,11.1,0.4,0,0],"1978-79":[0,0,0,0,0,0,0,0,0,0,0,0],"1979-80":[0,0,0,0.1,1.5,13.8,24.5,32.8,20.5,0.2,0,0],"1980-81":[0,0,0,0,7.3,28.8,23.4,8.5,10.6,0.4,0,0],"1981-82":[0,0,0,0.5,12.1,37.3,48.2,11.6,14.4,13.0,0,0],"1982-83":[0,0,0,0,1.9,10.9,20.3,8.2,8.3,16.4,0,0],"1983-84":[0,0,0,0,7.6,24.2,21.8,19.7,40.3,0,0,0],"1984-85":[0,0,0,0,5.0,23.4,57.3,21.6,7.1,2.0,0,0],"1985-86":[0,0,0,0,8.0,28.2,29.9,26.1,11.0,1.7,0,0],"1986-87":[0,0,0,0,16.1,8.8,49.2,15.1,3.0,1.3,0,0],"1987-88":[0,0,0,0,10.8,20.7,18.0,46.1,10.2,5.6,0,0],"1988-89":[0,0,0,5.7,0.2,34.4,19.4,21.7,9.9,6.5,0,0],"1989-90":[0,0,0,0,12.9,64.6,27.4,33.3,15.2,8.6,0,0],"1990-91":[0,0,0,0.2,7.8,24.5,30.9,27.7,2.8,3.0,0,0],"1991-92":[0,0,0,0,5.5,37.9,50.5,27.6,41.3,4.1,0,0],"1992-93":[0,0,0,1.4,10.1,19.8,42.9,51.3,54.4,12.2,0,0],"1993-94":[0,0,0,1.0,17.1,29.0,57.0,30.7,25.3,3.7,0,0],"1994-95":[0,0,0,0,3.5,5.9,13.4,32.3,7.1,4.7,0,0],"1995-96":[0,0,0,0,34.2,45.1,36.0,16.5,32.2,4.8,2.1,0],"1996-97":[0,0,0,0,25.9,21.2,38.7,19.1,23.4,2.8,0,0],"1997-98":[0,0,0,1.2,19.3,47.8,31.8,14.7,19.9,0,0,0],"1998-99":[0,0,0,0,0,13.5,50.7,5.7,28.4,0,0,0],"1999-00":[0,0,0,0,3.8,15.7,29.9,27.4,7.1,1.9,0,0],"2000-01":[0,0,0,0,20.2,70.3,28.4,27.8,45.0,0.2,0,0],"2001-02":[0,0,0,0.2,0.5,7.3,21.2,13.5,14.1,2.6,0,0],"2002-03":[0,0,0,0,17.2,40.0,44.2,37.1,11.7,3.0,0,0],"2003-04":[0,0,0,0,10.5,48.5,78.1,19.4,20.5,4.3,0,0],"2004-05":[0,0,0,0,2.6,19.0,44.5,42.0,28.1,0,0,0],"2005-06":[0,0,0,0,8.4,53.0,12.1,34.8,16.3,0,0,0],"2006-07":[0,0,0,0,0.1,12.1,37.9,59.5,19.9,10.7,0,0],"2007-08":[0,0,0,0,6.8,49.8,10.1,29.5,12.9,0,0,0],"2008-09":[0,0,0,0.6,16.1,57.3,49.8,24.2,0.9,0.7,0,0],"2009-10":[0,0,0,0,0.3,22.2,45.5,38.1,0,0,0.2,0],"2010-11":[0,0,0,0,0.8,72.8,43.2,43.3,18.5,0.4,0,0],"2011-12":[0,0,0,0,0.6,6.6,24.6,11.6,7.2,0,0,0],"2012-13":[0,0,0,0,2.8,32.4,11.6,36.4,20.2,12.0,0,0],"2013-14":[0,0,0,0,14.3,29.0,25.3,41.3,21.7,0.4,0,0],"2014-15":[0,0,0,0,11.0,17.5,18.3,60.0,12.3,0.6,0,0],"2015-16":[0,0,0,0.4,0.4,2.1,38.8,25.1,5.4,8.1,0,0],"2016-17":[0,0,0,0.2,25.2,37.2,8.4,32.7,30.9,0.3,0,0],"2017-18":[0,0,0,0,5.2,34.2,44.5,23.6,43.6,2.5,0,0],"2018-19":[0,0,0,0,22.8,14.7,33.0,27.2,14.8,2.5,0,0],"2019-20":[0,0,0,0,6.6,23.5,16.2,29.8,7.1,4.1,0.3,0],"2020-21":[0,0,0,0,1.6,13.2,22.7,26.9,4.6,4.3,0,0],"2021-22":[0,0,0,0,4.2,9.5,23.5,20.9,15.9,2.0,0,0],"2022-23":[0,0,0,0,3.7,16.4,10.2,21.6,13.7,0,0,0],"2023-24":[0,0,0,0,5.5,4.8,17.6,17.7,14.6,0.6,0,0],"2024-25":[0,0,0,0,0.2,20.8,42.3,41.7,7.1,3.3,0,0],"2025-26":[0,0,0,0,17.7,60.8,35.2,19.8,7.7,1.6,0,0]};

const BIG_DAYS = [["2025-12-30",24.2,"2025-26"],["1993-03-13",22.1,"1992-93"],["1966-01-31",22,"1965-66"],["1961-02-04",20.8,"1960-61"],["1944-11-30",20.1,"1944-45"],["1993-03-14",19.9,"1992-93"],["1992-01-18",19.8,"1991-92"],["2017-03-14",18.9,"2016-17"],["1997-12-30",18.6,"1997-98"],["2016-11-21",18.3,"2016-17"]];

const NO_DATA = ["1939-40", "1961-62", "1978-79"];
const VALID = ST.filter(([s]) => !NO_DATA.includes(s));
const AVG = Math.round(VALID.reduce((a, [, t]) => a + t, 0) / VALID.length * 10) / 10;
const MONTH_IDX = [3, 4, 5, 6, 7, 8, 9];
const MONTH_NAMES = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];
const RANKED = [...VALID].sort((a, b) => b[1] - a[1]).map(([s, t], i) => ({ rank: i + 1, season: s, total: t }));
const CURRENT_RANK = RANKED.find(r => r.season === "2025-26")?.rank;

function getCumulative(season) {
  const m = SM[season];
  if (!m) return [];
  let cum = 0;
  return MONTH_IDX.map((idx, i) => { cum += m[idx]; return { month: MONTH_NAMES[i], value: Math.round(cum * 10) / 10 }; });
}

function getAvgCumulative() {
  let cums = MONTH_IDX.map(() => []);
  VALID.forEach(([s]) => {
    const m = SM[s]; let cum = 0;
    MONTH_IDX.forEach((idx, i) => { cum += m[idx]; cums[i].push(cum); });
  });
  return MONTH_IDX.map((_, i) => {
    const sorted = [...cums[i]].sort((a, b) => a - b);
    return {
      month: MONTH_NAMES[i],
      avg: Math.round(sorted.reduce((a, b) => a + b, 0) / sorted.length * 10) / 10,
      p25: Math.round(sorted[Math.floor(sorted.length * 0.25)] * 10) / 10,
      p75: Math.round(sorted[Math.floor(sorted.length * 0.75)] * 10) / 10,
    };
  });
}

const ttBase = {
  background: "rgba(8, 16, 28, 0.94)", border: "1px solid rgba(100,160,210,0.18)",
  borderRadius: 6, padding: "8px 12px", color: "#c0d8ea", fontSize: 13,
  backdropFilter: "blur(10px)", boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
};

const CustomBarTooltip = ({ active, payload }) => {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  if (d.noData) return (<div style={ttBase}><span style={{ color: "#6a8ca8" }}>{d.season}</span><br /><span style={{ fontSize: 11, color: "#4a6a84" }}>No data available</span></div>);
  const rank = RANKED.find(r => r.season === d.season);
  return (
    <div style={ttBase}>
      <span style={{ color: "#b8d8f0", fontWeight: 600, fontFamily: "'Outfit'" }}>{d.season}</span><br />
      <span style={{ fontSize: 20, fontWeight: 700, color: "#e0f0ff", fontFamily: "'Outfit'" }}>{d.total}"</span>
      {rank && <span style={{ fontSize: 11, color: "#5a8aa8", marginLeft: 6, fontFamily: "'Outfit'" }}>#{rank.rank} all-time</span>}
      <br /><span style={{ fontSize: 10, color: "#3a6080", fontFamily: "'Outfit'" }}>Click to compare</span>
    </div>
  );
};

const CumTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={ttBase}>
      <div style={{ fontWeight: 600, marginBottom: 4, color: "#b8d8f0", fontFamily: "'Outfit'" }}>{label}</div>
      {payload.filter(p => p.value != null && p.dataKey !== "p25" && p.dataKey !== "p75" && p.dataKey !== "band").map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, marginBottom: 2, fontFamily: "'Outfit'" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.stroke || p.fill || p.color, flexShrink: 0 }} />
          <span style={{ color: "#7a9ab5" }}>{p.name}:</span>
          <span style={{ fontWeight: 600, color: "#e0f0ff" }}>{p.value}"</span>
        </div>
      ))}
    </div>
  );
};

const AllSeasonsTooltip = ({ active, payload, label, coordinate }) => {
  if (!active || !payload?.length) return null;
  const current = payload.find(p => p.dataKey === "2025-26");
  const avg = payload.find(p => p.dataKey === "avg");
  const others = payload.filter(p => p.dataKey !== "2025-26" && p.dataKey !== "avg" && p.value != null);
  let nearest = null;
  if (others.length > 0 && coordinate) {
    const allVals = payload.filter(p => p.value != null).map(p => p.value);
    const yMax = Math.max(...allVals);
    const yRatio = Math.max(0, Math.min(1, (coordinate.y - 10) / 250));
    const cursorVal = yMax * (1 - yRatio);
    nearest = others.reduce((best, p) =>
      Math.abs(p.value - cursorVal) < Math.abs(best.value - cursorVal) ? p : best
    );
  }
  const items = [current, nearest, avg].filter(Boolean);
  return (
    <div style={ttBase}>
      <div style={{ fontWeight: 600, marginBottom: 4, color: "#b8d8f0", fontFamily: "'Outfit'" }}>{label}</div>
      {items.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, marginBottom: 2, fontFamily: "'Outfit'" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.stroke || p.fill || p.color || "#78a0be", flexShrink: 0 }} />
          <span style={{ color: "#7a9ab5" }}>{p.name || p.dataKey}:</span>
          <span style={{ fontWeight: 600, color: "#e0f0ff" }}>{p.value}"</span>
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [compare, setCompare] = useState("1992-93");
  const [showAll, setShowAll] = useState(false);

  const barData = ST.map(([s, t]) => ({
    season: s, total: t, noData: NO_DATA.includes(s),
    label: "'" + s.slice(2, 4),
  }));

  const cumData = useMemo(() => {
    const current = getCumulative("2025-26");
    const comp = getCumulative(compare);
    const avgD = getAvgCumulative();
    return current.map((c, i) => ({
      month: c.month,
      "2025-26": c.value,
      [compare]: comp[i]?.value,
      avg: avgD[i].avg,
      band: avgD[i].p75 - avgD[i].p25,
      p25: avgD[i].p25,
    }));
  }, [compare]);

  const allCumData = useMemo(() => {
    const avgD = getAvgCumulative();
    const result = MONTH_NAMES.map((month, i) => ({ month, avg: avgD[i].avg }));
    VALID.forEach(([season]) => {
      const cum = getCumulative(season);
      cum.forEach((c, i) => { result[i][season] = c.value; });
    });
    return result;
  }, []);

  const otherSeasons = useMemo(() => VALID.map(([s]) => s).filter(s => s !== "2025-26"), []);

  const monthlyComp = useMemo(() => {
    const cur = SM["2025-26"];
    const comp = SM[compare];
    if (!cur || !comp) return [];
    return MONTH_IDX.map((idx, i) => ({ month: MONTH_NAMES[i], "2025-26": cur[idx], [compare]: comp[idx] }));
  }, [compare]);

  const handleBarClick = (data) => {
    if (data?.season && !NO_DATA.includes(data.season) && data.season !== "2025-26") setCompare(data.season);
  };

  const formatDate = (d) => {
    const dt = new Date(d + "T12:00:00");
    return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const compData = RANKED.find(r => r.season === compare);

  return (
    <div style={{
      fontFamily: "'Crimson Pro', Georgia, serif",
      background: "linear-gradient(175deg, #0a1520 0%, #08111c 50%, #0d1825 100%)",
      color: "#b0c8dc",
      minHeight: "100vh",
      padding: "32px 24px 48px",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(74,122,158,0.3); border-radius: 4px; }
        *:focus { outline: none; }
        *:focus-visible { outline: none; }
      `}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* ═══ HEADER ═══ */}
        <div style={{ marginBottom: 28, borderBottom: "1px solid rgba(74,122,158,0.18)", paddingBottom: 22 }}>
          <p style={{
            fontFamily: "'Outfit'", fontSize: 11, fontWeight: 500,
            textTransform: "uppercase", letterSpacing: "3px", color: "#3a6080",
            margin: "0 0 8px 1px",
          }}>Syracuse Hancock Intl Airport</p>
          <h1 style={{ fontSize: 42, fontWeight: 300, margin: 0, color: "#e4f0fa", letterSpacing: "-1px", lineHeight: 1.05 }}>
            88 Winters of Syracuse Snowfall
          </h1>
          <p style={{ fontFamily: "'Outfit'", fontSize: 12, color: "#3a6080", margin: "8px 0 0 1px", fontWeight: 400 }}>
            NOAA Station USW00014771 &middot; Season = July–June &middot; 1938 to present
          </p>
        </div>

        {/* ═══ STAT CARDS ═══ */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 10, marginBottom: 24, alignItems: "start" }}>
          {[
            { label: "Current Season", value: "142.8\"", sub: "2025–26", hl: true },
            { label: "All-Time Rank", value: `#${CURRENT_RANK}`, sub: `of ${VALID.length} seasons`, hl: true },
            { label: "Historical Avg", value: `${AVG}"`, sub: "per season" },
            { label: "Snowiest", value: "192.1\"", sub: "1992–93" },
            { label: "Lightest", value: "50.6\"", sub: "2011–12" },
          ].map((s, i) => (
            <div key={i} style={{
              background: s.hl ? "rgba(70, 130, 180, 0.08)" : "rgba(30, 55, 80, 0.06)",
              border: `1px solid ${s.hl ? "rgba(100,181,246,0.18)" : "rgba(74,122,158,0.1)"}`,
              borderRadius: 8, padding: "14px 16px",
            }}>
              <div style={{ fontFamily: "'Outfit'", fontSize: 10, color: "#3a6a8a", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 5 }}>{s.label}</div>
              <div style={{ fontFamily: "'Outfit'", fontSize: 28, fontWeight: 700, color: s.hl ? "#64b5f6" : "#8ab8d8", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontFamily: "'Outfit'", fontSize: 11, color: "#2e5070", marginTop: 4 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ═══ BAR CHART: SEASON TOTALS ═══ */}
        <div style={{
          background: "rgba(20, 40, 60, 0.14)",
          border: "1px solid rgba(74,122,158,0.22)",
          borderRadius: 10, padding: "20px 14px 14px", marginBottom: 18,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "0 6px", marginBottom: 14 }}>
            <h2 style={{ fontFamily: "'Outfit'", fontSize: 15, fontWeight: 600, margin: 0, color: "#7aaccc" }}>Total Snowfall by Season</h2>
            <p style={{ fontFamily: "'Outfit'", fontSize: 11, color: "#4a7a9e", margin: 0 }}>Click any bar to compare with 2025-26 below</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData} margin={{ top: 0, right: 4, left: -22, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,122,158,0.06)" vertical={false} />
              <XAxis dataKey="label" interval={4} tick={{ fill: "#2e5070", fontSize: 9, fontFamily: "'Outfit'" }} axisLine={{ stroke: "rgba(74,122,158,0.12)" }} tickLine={false} />
              <YAxis tick={{ fill: "#2e5070", fontSize: 9, fontFamily: "'Outfit'" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}"`} />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "rgba(100,181,246,0.04)" }} />
              <ReferenceLine y={AVG} stroke="#3a6080" strokeDasharray="6 3" strokeWidth={1} />
              <Bar dataKey="total" radius={[2, 2, 0, 0]} cursor="pointer" onClick={handleBarClick}>
                {barData.map((e, i) => {
                  const isCur = e.season === "2025-26", isCmp = e.season === compare;
                  return <Cell key={i}
                    fill={isCur ? "#64b5f6" : isCmp ? "#d4956a" : e.noData ? "rgba(74,122,158,0.05)" : "rgba(74,122,158,0.22)"}
                    stroke={isCur ? "#90caf9" : isCmp ? "#e8b89c" : "transparent"}
                    strokeWidth={isCur || isCmp ? 1.5 : 0}
                  />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 18, padding: "10px 6px 0", fontFamily: "'Outfit'", fontSize: 11, color: "#4a7a9e" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: "#64b5f6" }} /> 2025-26</span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: "#d4956a" }} /> {compare}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 14, borderTop: "1.5px dashed #3a6080" }} /> avg ({AVG}")</span>
          </div>
        </div>

        {/* ═══ COMPARISON ROW ═══ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 240px", gap: 14, marginBottom: 14 }}>

          {/* Cumulative Chart */}
          <div style={{
            background: "rgba(20, 40, 60, 0.14)",
            border: "1px solid rgba(74,122,158,0.22)",
            borderRadius: 10, padding: "20px 14px 14px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0 0 2px 6px" }}>
              <h2 style={{ fontFamily: "'Outfit'", fontSize: 15, fontWeight: 600, margin: 0, color: "#7aaccc" }}>
                Season Pace — Cumulative Snowfall
              </h2>
              <div style={{
                display: "flex", background: "rgba(20, 40, 60, 0.4)", borderRadius: 6, padding: 2,
                border: "1px solid rgba(74,122,158,0.15)",
              }}>
                <button onClick={() => setShowAll(false)} style={{
                  fontFamily: "'Outfit'", fontSize: 11, fontWeight: showAll ? 400 : 600,
                  padding: "4px 12px", borderRadius: 4, border: "none", cursor: "pointer",
                  background: !showAll ? "rgba(100,181,246,0.15)" : "transparent",
                  color: !showAll ? "#64b5f6" : "#4a7a9e",
                  transition: "all 0.15s", outline: "none",
                }}>Compare</button>
                <button onClick={() => setShowAll(true)} style={{
                  fontFamily: "'Outfit'", fontSize: 11, fontWeight: showAll ? 600 : 400,
                  padding: "4px 12px", borderRadius: 4, border: "none", cursor: "pointer",
                  background: showAll ? "rgba(100,181,246,0.15)" : "transparent",
                  color: showAll ? "#64b5f6" : "#4a7a9e",
                  transition: "all 0.15s", outline: "none",
                }}>All Seasons</button>
              </div>
            </div>
            <p style={{ fontFamily: "'Outfit'", fontSize: 11, color: "#2e5070", margin: "0 0 14px 6px", textAlign: "left" }}>
              {showAll ? (
                <><span style={{ color: "#64b5f6", fontWeight: 600 }}>2025-26</span>{" compared to every season on record"}</>
              ) : (
                <><span style={{ color: "#64b5f6", fontWeight: 600 }}>2025-26</span>{" vs "}
                <span style={{ color: "#d4956a", fontWeight: 600 }}>{compare} (#{compData?.rank})</span>
                {" · "}<span style={{ color: "#3a6080" }}>Gray band shows the typical range across all 85 seasons</span></>
              )}
            </p>
            {showAll ? (
              <ResponsiveContainer width="100%" height={270}>
                <ComposedChart data={allCumData} margin={{ top: 5, right: 12, left: -8, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,122,158,0.07)" />
                  <XAxis dataKey="month" tick={{ fill: "#4a7a9e", fontSize: 12, fontFamily: "'Outfit'" }} axisLine={{ stroke: "rgba(74,122,158,0.12)" }} tickLine={false} />
                  <YAxis tick={{ fill: "#2e5070", fontSize: 10, fontFamily: "'Outfit'" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}"`} />
                  <Tooltip content={<AllSeasonsTooltip />} />
                  {otherSeasons.map(s => (
                    <Line key={s} type="monotone" dataKey={s} stroke="rgba(120,160,190,0.18)" strokeWidth={1} dot={false} activeDot={false} name={s} />
                  ))}
                  <Line type="monotone" dataKey="avg" stroke="#3a6080" strokeWidth={1.5} strokeDasharray="6 3" dot={false} name="88-season avg" />
                  <Line type="monotone" dataKey="2025-26" stroke="#64b5f6" strokeWidth={3} dot={{ r: 4, fill: "#64b5f6", strokeWidth: 0 }} activeDot={{ r: 6 }} name="2025-26" />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height={270}>
                <ComposedChart data={cumData} margin={{ top: 5, right: 12, left: -8, bottom: 5 }}>
                  <defs>
                    <linearGradient id="gBand" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4a7a9e" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#4a7a9e" stopOpacity={0.08} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,122,158,0.07)" />
                  <XAxis dataKey="month" tick={{ fill: "#4a7a9e", fontSize: 12, fontFamily: "'Outfit'" }} axisLine={{ stroke: "rgba(74,122,158,0.12)" }} tickLine={false} />
                  <YAxis tick={{ fill: "#2e5070", fontSize: 10, fontFamily: "'Outfit'" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}"`} />
                  <Tooltip content={<CumTooltip />} />
                  <Area type="monotone" dataKey="p25" stackId="1" stroke="none" fill="transparent" />
                  <Area type="monotone" dataKey="band" stackId="1" stroke="none" fill="url(#gBand)" name="Middle 50%" />
                  <Line type="monotone" dataKey="avg" stroke="#3a6080" strokeWidth={1.5} strokeDasharray="6 3" dot={false} name="88-season avg" />
                  <Line type="monotone" dataKey={compare} stroke="#d4956a" strokeWidth={2.5} dot={{ r: 4, fill: "#d4956a", strokeWidth: 0 }} activeDot={{ r: 6 }} name={compare} />
                  <Line type="monotone" dataKey="2025-26" stroke="#64b5f6" strokeWidth={2.5} dot={{ r: 4, fill: "#64b5f6", strokeWidth: 0 }} activeDot={{ r: 6 }} name="2025-26" />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Rankings */}
          <div style={{
            background: "rgba(20, 40, 60, 0.14)",
            border: "1px solid rgba(74,122,158,0.22)",
            borderRadius: 10, padding: "16px 12px",
            display: "flex", flexDirection: "column", maxHeight: 360,
          }}>
            <h2 style={{ fontFamily: "'Outfit'", fontSize: 15, fontWeight: 600, margin: "0 0 10px 2px", color: "#7aaccc" }}>All-Time Top 20</h2>
            <div style={{ flex: 1, overflowY: "auto", paddingRight: 2 }}>
              {RANKED.slice(0, 20).map((r) => {
                const isCur = r.season === "2025-26", isCmp = r.season === compare;
                return (
                  <div key={r.season} onClick={() => { if (!isCur) setCompare(r.season); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "5px 8px", marginBottom: 1, borderRadius: 4,
                      cursor: isCur ? "default" : "pointer",
                      background: isCur ? "rgba(100,181,246,0.08)" : isCmp ? "rgba(212,149,106,0.06)" : "transparent",
                      borderLeft: isCur ? "3px solid #64b5f6" : isCmp ? "3px solid #d4956a" : "3px solid transparent",
                      transition: "background 0.12s",
                    }}
                    onMouseEnter={e => { if (!isCur && !isCmp) e.currentTarget.style.background = "rgba(74,122,158,0.06)"; }}
                    onMouseLeave={e => { if (!isCur && !isCmp) e.currentTarget.style.background = "transparent"; }}
                  >
                    <span style={{ fontFamily: "'Outfit'", fontSize: 11, fontWeight: 600, color: r.rank <= 3 ? "#6aaccc" : "#2e5070", width: 20, textAlign: "right", flexShrink: 0 }}>{r.rank}</span>
                    <span style={{ fontFamily: "'Outfit'", fontSize: 12, fontWeight: isCur || isCmp ? 600 : 400, color: isCur ? "#64b5f6" : isCmp ? "#d4956a" : "#7a9ab5", flex: 1 }}>{r.season}</span>
                    <span style={{ fontFamily: "'Outfit'", fontSize: 12, fontWeight: 600, color: isCur ? "#64b5f6" : isCmp ? "#d4956a" : "#4a7a9e" }}>{r.total.toFixed(1)}"</span>
                  </div>
                );
              })}
              {CURRENT_RANK > 20 && (
                <>
                  <div style={{ textAlign: "center", color: "#2e5070", fontSize: 11, padding: "3px 0", fontFamily: "'Outfit'" }}>···</div>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "5px 8px", borderRadius: 4,
                    background: "rgba(100,181,246,0.08)",
                    borderLeft: "3px solid #64b5f6",
                  }}>
                    <span style={{ fontFamily: "'Outfit'", fontSize: 11, fontWeight: 600, color: "#64b5f6", width: 20, textAlign: "right" }}>{CURRENT_RANK}</span>
                    <span style={{ fontFamily: "'Outfit'", fontSize: 12, fontWeight: 600, color: "#64b5f6", flex: 1 }}>2025-26</span>
                    <span style={{ fontFamily: "'Outfit'", fontSize: 12, fontWeight: 600, color: "#64b5f6" }}>142.8"</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ═══ BOTTOM ROW ═══ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 240px", gap: 14 }}>

          {/* Monthly Comparison */}
          <div style={{
            background: "rgba(20, 40, 60, 0.14)",
            border: "1px solid rgba(74,122,158,0.22)",
            borderRadius: 10, padding: "20px 14px 14px",
          }}>
            <h2 style={{ fontFamily: "'Outfit'", fontSize: 15, fontWeight: 600, margin: "0 0 2px 6px", color: "#7aaccc" }}>Month-by-Month Breakdown</h2>
            <p style={{ fontFamily: "'Outfit'", fontSize: 11, color: "#2e5070", margin: "0 0 14px 6px" }}>
              <span style={{ color: "#64b5f6", fontWeight: 600 }}>2025-26</span>{" vs "}
              <span style={{ color: "#d4956a", fontWeight: 600 }}>{compare}</span>
            </p>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyComp} margin={{ top: 5, right: 10, left: -8, bottom: 5 }} barGap={3}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,122,158,0.06)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#4a7a9e", fontSize: 12, fontFamily: "'Outfit'" }} axisLine={{ stroke: "rgba(74,122,158,0.12)" }} tickLine={false} />
                <YAxis tick={{ fill: "#2e5070", fontSize: 10, fontFamily: "'Outfit'" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}"`} />
                <Tooltip content={<CumTooltip />} cursor={{ fill: "rgba(100,181,246,0.03)" }} />
                <Bar dataKey="2025-26" fill="#64b5f6" radius={[3, 3, 0, 0]} barSize={24} name="2025-26" />
                <Bar dataKey={compare} fill="#d4956a" radius={[3, 3, 0, 0]} barSize={24} name={compare} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Notable Events */}
          <div style={{
            background: "rgba(20, 40, 60, 0.14)",
            border: "1px solid rgba(74,122,158,0.22)",
            borderRadius: 10, padding: "16px 12px",
          }}>
            <h2 style={{ fontFamily: "'Outfit'", fontSize: 15, fontWeight: 600, margin: "0 0 3px 2px", color: "#7aaccc" }}>Biggest Single Days</h2>
            <p style={{ fontFamily: "'Outfit'", fontSize: 9, color: "#2e5070", margin: "0 0 10px 2px", textTransform: "uppercase", letterSpacing: "1px" }}>88-year record</p>
            {BIG_DAYS.map(([date, snow, season], i) => {
              const isCur = season === "2025-26";
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "6px 8px", marginBottom: 2, borderRadius: 4,
                  background: isCur ? "rgba(100,181,246,0.06)" : "transparent",
                  borderLeft: i === 0 ? "3px solid #64b5f6" : "3px solid transparent",
                }}>
                  <span style={{
                    fontFamily: "'Outfit'", fontSize: 18, fontWeight: 700,
                    color: isCur ? "#64b5f6" : i < 3 ? "#7aaccc" : "#4a7a9e",
                    minWidth: 46, textAlign: "right",
                  }}>{snow.toFixed(1)}"</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Outfit'", fontSize: 11, color: isCur ? "#90caf9" : "#7a9ab5" }}>{formatDate(date)}</div>
                    <div style={{ fontFamily: "'Outfit'", fontSize: 10, color: "#2e5070" }}>{season}</div>
                  </div>
                  {i === 0 && (
                    <span style={{
                      fontFamily: "'Outfit'", fontSize: 8, fontWeight: 700,
                      textTransform: "uppercase", letterSpacing: "1px", color: "#64b5f6",
                      background: "rgba(100,181,246,0.1)", padding: "2px 5px", borderRadius: 3,
                    }}>Record</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ═══ FOOTER ═══ */}
        <p style={{ fontFamily: "'Outfit'", fontSize: 10, color: "#1e3a52", textAlign: "center", margin: "24px 0 0", letterSpacing: "0.5px" }}>
          Source: NOAA National Centers for Environmental Information &middot; Updated weekly via automated pipeline &middot; 3 seasons excluded due to missing data
        </p>
      </div>
    </div>
  );
}
