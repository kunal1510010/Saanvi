import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Camera, Upload, Check, ArrowRight, Sparkles, UserPlus, TrendingUp, Wallet, ShieldCheck, MapPin, CreditCard, RotateCcw, ChevronDown, X, MessageCircle } from "lucide-react";

/* =========================================================================
   Saanvi — Agentic Home-Buying Assistant (Design Prototype v2)
   Homes by ASBL · Priority Access · RI / Salaried / Loan path
   Voice-wave orb · fetched-value confirmations · name personalisation
   ========================================================================= */

const C = {
  ink: "#211E1A", orange: "#F04E38", orangeDeep: "#D63D28",
  ivory: "#FCFAF6", paper: "#FFFFFF", muted: "#908A82",
  line: "rgba(33,30,26,0.08)", soft: "rgba(240,78,56,0.07)",
};

const HOME_VALUE = 12000000; // ₹1.20 Cr indicative — would come from selected flat

// What the verification services return (simulated)
const FETCH = {
  name: "Adithyan Menon", first: "Adithyan", dob: "14 Aug 1991", gender: "Male",
  address: "C-114, Road No. 16, Green Park Colony, Trivandrum, Kerala — 695015",
  aadhaarMasked: "XXXX XXXX 6123", panMasked: "PSCPS3200R",
};
const INITIALS = "AM";

const VOICES_TE = [
  "నమస్కారం, నేను సాన్వి — మీ డిజిటల్ హోమ్-బయింగ్ అసిస్టెంట్. సుమారు పదిహేను నిమిషాల్లో మీ ప్రయారిటీ యాక్సెస్ సురక్షితం చేస్తాను. మనం ప్రారంభిద్దామా?",
  "మొదట, ఇది నిజంగా మీరే అని నిర్ధారించుకుందాం. మీ రిజిస్టర్డ్ ఫోన్ నంబర్ చెప్పగలరా?",
  "నేను మీ ఫోన్ మరియు వాట్సాప్‌కు నాలుగు అంకెల కోడ్ పంపాను. దయచేసి దిగువన నమోదు చేయండి.",
  "చాలా బాగుంది, మీరు వెరిఫై అయ్యారు. ఇప్పుడు చెప్పండి, మీరు ఎక్కడ నివసిస్తారు మరియు పని చేస్తారు?",
  "మీరు ఎలా సంపాదిస్తారు — ఉద్యోగం చేస్తారా, లేదా స్వంత వ్యాపారం చేస్తారా?",
  "మీరు ఇంటిని ఎలా కొనాలనుకుంటున్నారు — హోమ్ లోన్ ద్వారా, లేదా పూర్తిగా మీ పొదుపుల నుండి?",
  "మీ ప్రొఫైల్‌కు ఒక ఫోటో జోడిద్దాం. ఒక సెల్ఫీ తీయండి — ముఖం స్పష్టంగా కనిపించాలి, మంచి వెలుతురు ఉండాలి, సన్‌గ్లాసెస్ వేసుకోకండి.",
  "మీ గుర్తింపు ధృవీకరించడానికి, ఆధార్ నంబర్ చెప్పండి. నేను యుఐడిఎఐ నుండి ఓటిపి అభ్యర్థిస్తాను.",
  `అన్నీ వెరిఫై అయ్యాయి — మిమ్మల్ని కలిసి సంతోషంగా ఉంది, ${FETCH.first}. ఆధార్ రికార్డులలో ఈ సమాచారం ఉంది. ఇది సరైనదేనా?`,
  `ధన్యవాదాలు, ${FETCH.first}. నేను ఆధార్ నుండి మీ చిరునామా తీసుకున్నాను. అన్ని పత్రాలు ఇక్కడికే పంపించాలా?`,
  "కేవైసీలో చివరి భాగం — మీ పాన్. దీని ద్వారా మీకు సరైన హోమ్ లోన్ ఎంపికలు చూపించగలను.",
  `చాలా బాగుంది, ${FETCH.first}. పాన్ ధృవీకరించబడింది మరియు ఆధార్‌తో సరిపోలింది. మీ కేవైసీ పూర్తయింది.`,
  "మీ అర్హత అర్థం చేసుకోవడానికి నేను సాఫ్ట్ క్రెడిట్ చెక్ చేయగలను. ఇది మీ క్రెడిట్ స్కోర్‌ను ప్రభావితం చేయదు. సరేనా?",
  `దాదాపు అయిపోయింది, ${FETCH.first}. మీ నెలవారీ టేక్-హోమ్ జీతం ఎంత?`,
  "చివరి వివరం — మీ మొత్తం నెలవారీ ఈఎంఐలు డెబ్భై వేల రూపాయలకు పైగా ఉన్నాయా? హోమ్, కార్ మరియు పర్సనల్ లోన్లన్నీ కలిపి చెప్పండి.",
];

const VOICES_HI = [
  "नमस्ते, मैं सांवी हूँ — आपकी डिजिटल होम-बायिंग असिस्टेंट। लगभग पंद्रह मिनट में मैं आपका प्रायोरिटी एक्सेस सुरक्षित करवाऊँगी। क्या हम शुरू करें?",
  "पहले, यह पक्का करते हैं कि यह आप ही हैं। आपका रजिस्टर्ड फोन नंबर क्या है?",
  "मैंने आपके फोन और व्हाट्सएप पर चार अंकों का कोड भेजा है। नीचे दर्ज करें।",
  "बढ़िया, आप वेरिफाई हो गए। अब बताइए, आप कहाँ रहते और काम करते हैं?",
  "और आप कैसे कमाते हैं — क्या आप नौकरी करते हैं, या खुद का काम?",
  "आप अपना घर कैसे खरीदना चाहेंगे — होम लोन से, या पूरी तरह अपनी बचत से?",
  "चलिए आपकी प्रोफाइल में एक फोटो जोड़ते हैं। सेल्फी लें — चेहरा साफ दिखे, रोशनी अच्छी हो, धूप का चश्मा न हो।",
  "अपनी पहचान सत्यापित करने के लिए, आधार नंबर दें। मैं यूआईडीएआई से ओटीपी मँगवाऊँगी।",
  `सब वेरिफाई हो गया — आपसे मिलकर खुशी हुई, ${FETCH.first}। आधार के रिकॉर्ड में यह जानकारी है। क्या यह सही है?`,
  `धन्यवाद, ${FETCH.first}। मैंने आधार से आपका पता लिया है। क्या आप इसी पते पर सभी दस्तावेज़ चाहेंगे?`,
  "केवाईसी का आखिरी हिस्सा — आपका पैन। इससे मैं सही होम लोन विकल्प खोज सकती हूँ।",
  `बहुत बढ़िया, ${FETCH.first}। पैन सत्यापित हो गया और आधार से मेल खाता है। आपकी केवाईसी पूरी हुई।`,
  "मैं एक सॉफ्ट क्रेडिट चेक करके आपकी पात्रता जाँच सकती हूँ। क्रेडिट स्कोर पर कोई असर नहीं पड़ेगा। ठीक है?",
  `बस थोड़ा और, ${FETCH.first}। आपकी मासिक टेक-होम सैलरी कितनी है?`,
  "एक आखिरी बात — क्या आपकी कुल मासिक ईएमआई सत्तर हजार रुपये से ज्यादा है? होम, कार और पर्सनल लोन सब मिलाकर बताएं।",
];

/* ---------- Voice-wave orb (canvas) ---------- */
function Orb({ state, size = 140 }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr; canvas.height = size * dpr;
    canvas.style.width = size + "px"; canvas.style.height = size + "px";
    const ctx = canvas.getContext("2d"); ctx.scale(dpr, dpr);
    const cfg = ({
      idle:       { amp: 3,  speed: 0.018, jit: 0.3, layers: 2 },
      listening:  { amp: 6,  speed: 0.038, jit: 0.5, layers: 3 },
      speaking:   { amp: 9,  speed: 0.060, jit: 0.7, layers: 3 },
      thinking:   { amp: 5,  speed: 0.085, jit: 0.6, layers: 3 },
      recommends: { amp: 4,  speed: 0.028, jit: 0.4, layers: 3 },
    })[state] || { amp: 3, speed: 0.022, jit: 0.4, layers: 2 };
    const cx = size / 2, cy = size / 2, baseR = size * 0.27;
    let raf, t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      for (let l = 0; l < cfg.layers; l++) {
        const phase = t + l * 1.7;
        const lAmp = cfg.amp * (1 - l * 0.2);
        const op = 0.92 - l * 0.27;
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2 + 0.02; a += 0.035) {
          const r = baseR
            + Math.sin(phase * 1.1) * lAmp * 0.4
            + Math.sin(a * 8  + phase * 1.9) * lAmp * 0.18
            + Math.sin(a * 13 - phase * 2.4) * lAmp * 0.09 * cfg.jit;
          const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
          a === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(240,78,56,${op})`;
        ctx.lineWidth = 2.1; ctx.stroke();
      }
      t += cfg.speed; raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [state, size]);
  return (
    <div style={{ position: "relative", width: size, height: size, display: "grid", placeItems: "center" }}>
      <div style={{ position: "absolute", inset: -8, borderRadius: "50%", background: "radial-gradient(circle, rgba(240,78,56,0.16) 0%, rgba(240,78,56,0) 66%)" }} />
      <canvas ref={ref} />
    </div>
  );
}

const STATE_LABEL = { idle: "", speaking: "Saanvi is speaking", listening: "Listening", thinking: "Thinking", recommends: "Saanvi recommends" };

/* ---------- UI atoms ---------- */
function Chip({ label, sub, selected, onClick, icon: Icon }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ width: "100%", textAlign: "left", cursor: "pointer", background: selected ? C.soft : C.paper,
        border: `1.5px solid ${selected ? C.orange : C.line}`, borderRadius: 16, padding: "15px 16px",
        display: "flex", alignItems: "center", gap: 12, fontFamily: "Mulish, sans-serif",
        boxShadow: h || selected ? "0 6px 18px rgba(33,30,26,0.07)" : "0 1px 2px rgba(33,30,26,0.04)",
        transform: h ? "translateY(-1px)" : "none", transition: "all .18s ease" }}>
      {Icon && <span style={{ display: "grid", placeItems: "center", width: 36, height: 36, borderRadius: 11, background: selected ? C.orange : C.soft, flexShrink: 0 }}><Icon size={18} color={selected ? "#fff" : C.orange} /></span>}
      <span style={{ flex: 1 }}>
        <span style={{ display: "block", fontWeight: 700, fontSize: 15.5, color: C.ink }}>{label}</span>
        {sub && <span style={{ display: "block", fontSize: 12.5, color: C.muted, marginTop: 2 }}>{sub}</span>}
      </span>
      <span style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0, border: `1.5px solid ${selected ? C.orange : C.line}`, background: selected ? C.orange : "transparent", display: "grid", placeItems: "center" }}>{selected && <Check size={12} color="#fff" strokeWidth={3} />}</span>
    </button>
  );
}
function Primary({ children, onClick, disabled }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ width: "100%", cursor: disabled ? "not-allowed" : "pointer", background: disabled ? "#E7E2DB" : `linear-gradient(135deg, ${C.orange}, ${C.orangeDeep})`,
        color: disabled ? C.muted : "#fff", border: "none", borderRadius: 16, padding: "16px", fontWeight: 800, fontSize: 15.5, fontFamily: "Mulish, sans-serif",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        boxShadow: disabled ? "none" : (h ? "0 12px 26px rgba(240,78,56,0.34)" : "0 8px 18px rgba(240,78,56,0.26)"),
        transform: h && !disabled ? "translateY(-1px)" : "none", transition: "all .18s ease" }}>{children}</button>
  );
}
function Ghost({ children, onClick, icon: Icon }) {
  return (
    <button onClick={onClick} style={{ width: "100%", cursor: "pointer", background: C.paper, color: C.ink, border: `1.5px solid ${C.line}`, borderRadius: 16, padding: "14px", fontWeight: 700, fontSize: 14.5, fontFamily: "Mulish, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>{Icon && <Icon size={17} color={C.orange} />}{children}</button>
  );
}
function Field({ value, onChange, placeholder, prefix, maxLength, center }) {
  const [f, setF] = useState(false);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.paper, border: `1.5px solid ${f ? C.orange : C.line}`, borderRadius: 14, padding: "14px 16px", boxShadow: f ? `0 0 0 4px ${C.soft}` : "none", transition: "all .18s ease" }}>
      {prefix && <span style={{ fontWeight: 800, color: C.ink, fontFamily: "Mulish, sans-serif" }}>{prefix}</span>}
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength} onFocus={() => setF(true)} onBlur={() => setF(false)}
        style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 16, fontWeight: 700, color: C.ink, fontFamily: "Mulish, sans-serif", letterSpacing: center ? 2 : 0, textAlign: center ? "center" : "left" }} />
    </div>
  );
}
function OtpBoxes({ length, value, onChange }) {
  const refs = useRef([]);
  const set = (i, v) => {
    const dch = v.replace(/\D/g, "").slice(-1); const arr = value.split(""); arr[i] = dch;
    const nx = arr.join("").slice(0, length); onChange(nx); if (dch && i < length - 1) refs.current[i + 1]?.focus();
  };
  return (
    <div style={{ display: "flex", gap: 9, justifyContent: "center" }}>
      {Array.from({ length }).map((_, i) => (
        <input key={i} ref={(el) => (refs.current[i] = el)} value={value[i] || ""} onChange={(e) => set(i, e.target.value)} inputMode="numeric"
          style={{ width: 46, height: 54, textAlign: "center", fontSize: 22, fontWeight: 800, color: C.ink, fontFamily: "Mulish, sans-serif", borderRadius: 13, border: `1.5px solid ${value[i] ? C.orange : C.line}`, background: value[i] ? C.soft : C.paper, outline: "none", transition: "all .15s ease" }} />
      ))}
    </div>
  );
}
function Dots() {
  return (<span style={{ display: "inline-flex", gap: 3 }}>{[0, 1, 2].map((i) => <span key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: C.orange, animation: `pulseDot 1.1s ${i * 0.18}s ease-in-out infinite` }} />)}</span>);
}

/* ---------- Fetched-data card ---------- */
function DataCard({ title, icon: Icon, rows }) {
  return (
    <div style={{ background: C.paper, border: `1.5px solid ${C.line}`, borderRadius: 18, padding: "16px", boxShadow: "0 6px 18px rgba(33,30,26,0.06)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ width: 30, height: 30, borderRadius: 9, background: C.soft, display: "grid", placeItems: "center" }}><Icon size={16} color={C.orange} /></span>
        <span style={{ fontWeight: 800, fontSize: 13, color: C.ink, fontFamily: "Mulish" }}>{title}</span>
        <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 800, color: "#2E9E5B", background: "rgba(46,158,91,0.1)", padding: "4px 9px", borderRadius: 20 }}><ShieldCheck size={12} /> Verified</span>
      </div>
      <div style={{ display: "grid", gap: 11 }}>
        {rows.map(([label, value], i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
            <span style={{ fontSize: 12.5, color: C.muted, fontFamily: "Mulish", fontWeight: 600, flexShrink: 0 }}>{label}</span>
            <span style={{ fontSize: 13.5, color: C.ink, fontFamily: "Mulish", fontWeight: 700, textAlign: "right" }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Selfie (own state) ---------- */
function SelfieStep({ onDone }) {
  const [shot, setShot] = useState(false);
  if (!shot) return (
    <div style={{ display: "grid", gap: 10 }}>
      <Primary onClick={() => setShot(true)}><Camera size={18} /> Take a selfie</Primary>
      <Ghost icon={Upload} onClick={() => setShot(true)}>Upload from gallery</Ghost>
      <p style={{ fontSize: 11.5, color: C.muted, textAlign: "center", margin: "4px 8px 0", fontFamily: "Mulish" }}>Stored securely — used only for personalisation & verification.</p>
    </div>
  );
  return (
    <div style={{ display: "grid", gap: 12, justifyItems: "center" }}>
      <div style={{ width: 92, height: 92, borderRadius: "50%", background: `linear-gradient(135deg, ${C.orange}, ${C.orangeDeep})`, display: "grid", placeItems: "center", color: "#fff", fontWeight: 800, fontSize: 30, fontFamily: "Fraunces, serif", boxShadow: "0 8px 20px rgba(240,78,56,0.3)" }}>{INITIALS}</div>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 700, color: "#2E9E5B", fontFamily: "Mulish" }}><Check size={14} /> Photo looks good</span>
      <div style={{ display: "flex", gap: 10, width: "100%" }}>
        <div style={{ flex: 1 }}><Ghost icon={RotateCcw} onClick={() => setShot(false)}>Retake</Ghost></div>
        <div style={{ flex: 1 }}><Primary onClick={onDone}>Confirm</Primary></div>
      </div>
    </div>
  );
}

/* ---------- Eligibility engine ---------- */
function computeEligibility({ salary, emiBand, coApplicantIncome = 0, extraIncome = 0, reducedEMI = 0, reducedTarget = 0, perLakhEmiOverride = 0 }) {
  const gross = Number(salary || 0) + coApplicantIncome + extraIncome;
  const existingEmi = Math.max(0, (emiBand === "above" ? 80000 : 32000) - reducedEMI);
  const affordableEmi = Math.max(0, 0.5 * gross - existingEmi);
  const perLakhEmi = perLakhEmiOverride || 868;
  const loanCapacity = (affordableEmi / perLakhEmi) * 100000;
  const bankCap = 0.8 * (HOME_VALUE - reducedTarget);
  const eligibleLoan = Math.min(loanCapacity, bankCap);
  const pct = Math.min(80, Math.max(0, Math.round((eligibleLoan / HOME_VALUE) * 100)));
  return { pct, eligibleLoan, affordableEmi };
}
const fmtCr = (n) => "₹" + (n / 10000000).toFixed(2) + " Cr";
const fmtL = (n) => n >= 10000000 ? "₹" + (n / 10000000).toFixed(2) + " Cr" : "₹" + (n / 100000).toFixed(1) + " L";

/* ---------- Ring gauge ---------- */
function RingGauge({ pct }) {
  const size = 176, r = 66, circ = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#EBE5DC" strokeWidth="12" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.orange} strokeWidth="12" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)} style={{ transition: "stroke-dashoffset 1s cubic-bezier(.2,.8,.2,1)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
        <div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 44, fontWeight: 600, color: C.ink, lineHeight: 1 }}>{pct}%</div>
          <div style={{ fontSize: 10.5, color: C.muted, fontWeight: 700, letterSpacing: 0.5, marginTop: 3, fontFamily: "Mulish" }}>FINANCED</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- FAQs ---------- */
const FAQS = [
  { q: "What is Priority Access?", a: "Priority Access lets you reserve your preferred flat before the property opens to the public — securing first choice of floor, facing, and unit size. It requires completing a quick digital KYC and eligibility check.", kw: ["priority", "access", "reserve", "lock", "queue"] },
  { q: "What documents do I need?", a: "Just three things: your Aadhaar number (identity & address), PAN card (KYC & loan matching), and a recent payslip or income proof. Everything is verified digitally — no physical copies needed.", kw: ["document", "need", "require", "aadhaar", "pan", "payslip", "paper", "kyc"] },
  { q: "Will the credit check affect my CIBIL score?", a: "No. We run a soft inquiry, which is invisible to other lenders and has zero impact on your CIBIL or credit score.", kw: ["credit", "cibil", "score", "impact", "affect", "soft", "inquiry"] },
  { q: "How is my loan eligibility calculated?", a: "Banks look at your net monthly income, subtract existing EMIs, and allow up to 50% of your take-home toward new EMIs. We benchmark ₹868 per ₹1 lakh at a standard rate. Banks finance up to 80% of the home value.", kw: ["eligib", "calculat", "loan", "how much", "amount", "emi"] },
  { q: "Can I add a co-applicant?", a: "Yes — adding a co-applicant (spouse, parent, or income-earning sibling) pools both incomes and can significantly increase your eligible loan amount.", kw: ["co-applicant", "co applicant", "joint", "spouse", "partner", "family", "together"] },
  { q: "What happens after I secure Priority Access?", a: "Our team calls you within 24 hours to schedule a site visit. You'll get a walkthrough of available units, payment plans, and next steps toward booking.", kw: ["after", "next", "happen", "site visit", "call", "team", "book", "then"] },
  { q: "Is my Aadhaar data safe?", a: "Your Aadhaar is verified through the UIDAI gateway. We receive only pre-masked fields (last 4 digits, name, DOB, address) — your full number is never stored on our servers.", kw: ["aadhaar", "safe", "secure", "privacy", "data", "store", "uidai"] },
  { q: "Can NRIs apply?", a: "Yes. NRIs can apply using their OCI card and NRE/NRO bank account. The digital KYC process is the same, though some documents may differ. Our team guides you through the NRI-specific steps.", kw: ["nri", "abroad", "overseas", "foreign", "oci", "non-resident"] },
  { q: "What loan tenures are available?", a: "Home loans typically run 10 to 30 years. A longer tenure lowers your monthly EMI but increases total interest paid. Our eligibility estimate uses a 20-year benchmark.", kw: ["tenure", "years", "duration", "period", "long", "30", "20"] },
  { q: "How long does the entire process take?", a: "The digital KYC and eligibility check takes about 15 minutes. Priority Access is confirmed immediately. The full booking process typically takes 2–3 days.", kw: ["long", "time", "minutes", "quick", "fast", "duration", "how long", "process"] },
  { q: "What is the ₹1.20 Cr home value based on?", a: "₹1.20 Cr is an indicative price for the selected configuration. Actual pricing varies by unit, floor, and facing. You'll see exact pricing during your site visit.", kw: ["1.20", "crore", "price", "cost", "value", "indicative", "1.2"] },
  { q: "Who is ASBL?", a: "ASBL is one of Hyderabad's most trusted real estate developers, with a track record of on-time delivery and quality construction across 50+ projects.", kw: ["asbl", "developer", "builder", "company", "who", "hyderabad"] },
  { q: "What if I'm paying entirely from savings?", a: "If you choose self-funded, you skip the loan eligibility check entirely. Our team will work with you directly on a payment plan that suits your schedule.", kw: ["savings", "self", "fund", "cash", "own", "no loan", "without loan"] },
  { q: "Can I change my unit preference later?", a: "Priority Access locks your spot in the queue, not a specific unit. You make your final unit selection during the site visit — full flexibility to choose based on what's available.", kw: ["change", "unit", "preference", "choice", "later", "flexible", "different"] },
];

function HelpPanel({ onClose }) {
  const [tab, setTab] = useState("faq");
  const [openIdx, setOpenIdx] = useState(null);
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState(null);
  const [asked, setAsked] = useState(false);

  const handleAsk = (q = query) => {
    if (!q.trim()) return;
    const lower = q.toLowerCase();
    const scored = FAQS.map(f => ({ ...f, score: f.kw.filter(k => lower.includes(k)).length }))
      .sort((a, b) => b.score - a.score);
    setAnswer(scored[0].score > 0
      ? scored[0].a
      : "I'll have our team reach out to answer that. You can also call us at 040-4567-8910.");
    setQuery(q);
    setAsked(true);
  };

  const reset = () => { setAsked(false); setQuery(""); setAnswer(null); };

  const SUGGESTIONS = ["Loan eligibility", "Credit check", "Documents needed", "Co-applicant", "After Priority Access"];

  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "78%", background: C.ivory, borderRadius: "22px 22px 0 0", boxShadow: "0 -10px 40px rgba(33,30,26,0.2)", display: "flex", flexDirection: "column", zIndex: 20, animation: "slideUp .28s ease both" }}>
      <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(33,30,26,0.12)" }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 22px 12px" }}>
        <div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 20, fontWeight: 500, color: C.ink, letterSpacing: -0.3 }}>Have a question?</div>
          <div style={{ fontSize: 12, color: C.muted, fontFamily: "Mulish", marginTop: 2 }}>Browse FAQs or ask Saanvi anything</div>
        </div>
        <button onClick={onClose} style={{ background: "transparent", border: `1px solid ${C.line}`, borderRadius: 10, width: 32, height: 32, display: "grid", placeItems: "center", cursor: "pointer" }}>
          <X size={15} color={C.muted} />
        </button>
      </div>

      <div style={{ display: "flex", margin: "0 22px 14px", background: "#EDE8E0", borderRadius: 12, padding: 3, flexShrink: 0 }}>
        {[["faq", "Common Questions"], ["ask", "Ask Saanvi"]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            style={{ flex: 1, border: "none", cursor: "pointer", borderRadius: 10, padding: "8px", fontSize: 13, fontWeight: 700, fontFamily: "Mulish", background: tab === key ? C.paper : "transparent", color: tab === key ? C.ink : C.muted, boxShadow: tab === key ? "0 1px 4px rgba(33,30,26,0.08)" : "none", transition: "all .15s ease" }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 22px 22px" }}>
        {tab === "faq" ? (
          <div style={{ display: "grid", gap: 8 }}>
            {FAQS.map((f, i) => (
              <div key={i} style={{ background: C.paper, border: `1.5px solid ${openIdx === i ? C.orange : C.line}`, borderRadius: 14, overflow: "hidden", transition: "border-color .15s ease" }}>
                <button onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: C.ink, fontFamily: "Mulish", flex: 1, marginRight: 8 }}>{f.q}</span>
                  <ChevronDown size={15} color={C.muted} style={{ flexShrink: 0, transform: openIdx === i ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s ease" }} />
                </button>
                {openIdx === i && (
                  <div style={{ padding: "0 14px 13px", fontSize: 13, color: C.muted, fontFamily: "Mulish", lineHeight: 1.6 }}>{f.a}</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {!asked && (
              <div>
                <p style={{ fontSize: 13, color: C.muted, fontFamily: "Mulish", lineHeight: 1.5, margin: "0 0 12px" }}>Tap a suggestion or type your own question:</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {SUGGESTIONS.map(s => (
                    <button key={s} onClick={() => handleAsk(s)}
                      style={{ fontSize: 12.5, fontWeight: 700, color: C.orange, background: C.soft, border: `1px solid rgba(240,78,56,0.18)`, borderRadius: 20, padding: "7px 13px", cursor: "pointer", fontFamily: "Mulish" }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {asked && answer && (
              <div style={{ background: C.soft, border: `1.5px solid rgba(240,78,56,0.15)`, borderRadius: 16, padding: "14px 16px" }}>
                <div style={{ fontSize: 10.5, fontWeight: 800, color: C.orange, letterSpacing: 1.3, marginBottom: 7, fontFamily: "Mulish" }}>SAANVI</div>
                <p style={{ fontSize: 13.5, color: C.ink, fontFamily: "Mulish", lineHeight: 1.6, margin: 0 }}>{answer}</p>
                <button onClick={reset} style={{ marginTop: 10, fontSize: 12.5, color: C.orange, fontWeight: 700, fontFamily: "Mulish", background: "transparent", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}>Ask another question</button>
              </div>
            )}
            <div style={{ display: "flex", gap: 8, marginTop: asked ? 0 : "auto" }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", background: C.paper, border: `1.5px solid ${C.line}`, borderRadius: 14, padding: "0 14px" }}>
                <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAsk()}
                  placeholder="Ask anything about buying your home…"
                  style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 13.5, fontFamily: "Mulish", color: C.ink, padding: "13px 0" }} />
              </div>
              <button onClick={() => handleAsk()}
                style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(135deg, ${C.orange}, ${C.orangeDeep})`, border: "none", cursor: "pointer", display: "grid", placeItems: "center", flexShrink: 0, alignSelf: "flex-end", boxShadow: "0 4px 12px rgba(240,78,56,0.28)" }}>
                <ArrowRight size={18} color="#fff" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ========================================================================= */
export default function SaanviPrototype() {
  const [step, setStep] = useState(0);
  const [voice, setVoice] = useState(false);
  const [photo, setPhoto] = useState(false);
  const [d, setD] = useState({ phone: "", otp: "", residency: "indian", employment: "salaried", funding: "loan", aadhaar: "", pan: "", salary: "", emiBand: "", consent1: false, consent2: false });
  const [thinking, setThinking] = useState(false);
  const [result, setResult] = useState(null);
  const [lang, setLang] = useState("en");
  const [helpOpen, setHelpOpen] = useState(false);

  const upd = (k, v) => setD((s) => ({ ...s, [k]: v }));
  const next = () => setStep((s) => s + 1);
  const ACC = (t) => <span style={{ color: C.orange, fontStyle: "italic" }}>{t}</span>;

  const audioRef = useRef(null);
  const resultAudioCache = useRef(new Map());
  const cancelAudio = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; audioRef.current = null; }
  };

  const playStep = (stepIdx, language) => {
    if (!voice) return;
    cancelAudio();
    const audio = new Audio(`/audio/${language}_${stepIdx}.wav`);
    audioRef.current = audio;
    audio.play().catch(() => {});
  };

  const speakDynamic = async (text) => {
    if (!voice) return;
    cancelAudio();
    try {
      const cacheKey = `${lang}:${text}`;
      let blobUrl = resultAudioCache.current.get(cacheKey);
      if (!blobUrl) {
        const res = await fetch("https://api.sarvam.ai/text-to-speech", {
          method: "POST",
          headers: { "api-subscription-key": "sk_509cjczs_7onKvkhEYPFJaqOdjlsKbFjI", "Content-Type": "application/json" },
          body: JSON.stringify({ model: "bulbul:v3", text, target_language_code: lang === "hi" ? "hi-IN" : lang === "te" ? "te-IN" : "en-IN", speaker: "simran" }),
        });
        const data = await res.json();
        if (!data.audios?.[0]) return;
        const bytes = atob(data.audios[0]);
        const buf = new Uint8Array(bytes.length).map((_, i) => bytes.charCodeAt(i));
        blobUrl = URL.createObjectURL(new Blob([buf], { type: "audio/wav" }));
        resultAudioCache.current.set(cacheKey, blobUrl);
      }
      const audio = new Audio(blobUrl);
      audioRef.current = audio;
      audio.play();
    } catch (e) {}
  };

  const NAME_FROM = 8; // Aadhaar review onward
  const nameKnown = step >= NAME_FROM;

  const steps = [
    { voice: "Hi, I'm Saanvi, your digital home-buying assistant. In about fifteen minutes I'll help you secure your Priority Access. Shall we begin?",
      caption: <>Hi, I'm {ACC("Saanvi")} — your digital home-buying assistant.</>, hint: "I'll guide you through everything, one step at a time. About 15 minutes.", orb: "speaking",
      render: () => <Primary onClick={next}>Let's begin <ArrowRight size={18} /></Primary> },

    { voice: "First, let's make sure it's really you. What's your registered phone number?",
      caption: <>First, let's confirm it's {ACC("you")}.</>, hint: "Share your registered phone number — I'll send a quick code.", orb: "listening",
      render: () => (<><Field value={d.phone} onChange={(v) => upd("phone", v.replace(/\D/g, "").slice(0, 10))} prefix="+91" placeholder="Phone number" maxLength={10} /><div style={{ height: 12 }} /><Primary disabled={d.phone.length !== 10} onClick={next}>Send code</Primary></>) },

    { voice: "I've sent a four-digit code to your phone and WhatsApp. Pop it in below.",
      caption: <>I sent a code over {ACC("SMS & WhatsApp")}.</>, hint: `Enter the 4-digit code sent to +91 ${d.phone || "•••••••••"}.`, orb: "listening",
      render: () => (<><OtpBoxes length={4} value={d.otp} onChange={(v) => upd("otp", v)} /><div style={{ textAlign: "center", marginTop: 14, fontSize: 13, color: C.muted, fontFamily: "Mulish" }}>Resend in 0:20</div><div style={{ height: 12 }} /><Primary disabled={d.otp.length !== 4} onClick={next}>Verify</Primary></>) },

    { voice: "Great, you're verified. Now, where do you live and work?",
      caption: <>You're verified. Where do you {ACC("live & work")}?</>, hint: "This shapes the rest of your journey.", orb: "speaking",
      render: () => (<div style={{ display: "grid", gap: 10 }}>{[["indian", "Indian", "Lives & works in India"], ["nri", "NRI", "Indian, lives & works abroad"], ["foreign", "Foreign National", "Holds an OCI card"]].map(([k, l, s]) => <Chip key={k} label={l} sub={s} selected={d.residency === k} onClick={() => { upd("residency", k); setTimeout(next, 260); }} />)}</div>) },

    { voice: "And how do you earn — are you salaried, or self-employed?",
      caption: <>How do you {ACC("earn")}?</>, hint: "It helps me match the right loan options for you.", orb: "speaking",
      render: () => (<div style={{ display: "grid", gap: 10 }}>{[["salaried", "Salaried", "Monthly income from an employer"], ["self", "Self-employed / Business", "Income from your own work"]].map(([k, l, s]) => <Chip key={k} label={l} sub={s} selected={d.employment === k} onClick={() => { upd("employment", k); setTimeout(next, 260); }} />)}</div>) },

    { voice: "How would you like to fund your home — through a home loan, or entirely from your savings?",
      caption: <>How would you like to {ACC("fund")} your home?</>, hint: "Your next steps depend on this choice.", orb: "speaking",
      render: () => (<div style={{ display: "grid", gap: 10 }}><Chip label="Through a home loan" sub="I'll check your loan readiness" icon={Wallet} selected={d.funding === "loan"} onClick={() => { upd("funding", "loan"); setTimeout(next, 260); }} /><Chip label="Entirely from savings" sub="No loan check needed" icon={Sparkles} selected={d.funding === "savings"} onClick={() => { upd("funding", "savings"); setTimeout(next, 260); }} /></div>) },

    { voice: "Let's put a face to your profile. A quick selfie — clear face, good lighting, no sunglasses.",
      caption: <>Let's put a {ACC("face")} to your profile.</>, hint: "A quick selfie. Clear face, no sunglasses, good light.", orb: "speaking",
      render: () => <SelfieStep onDone={() => { setPhoto(true); next(); }} /> },

    { voice: "To verify your identity, share your Aadhaar number. I'll request a one-time password from U-I-D-A-I.",
      caption: <>Let's verify your identity with {ACC("Aadhaar")}.</>, hint: "I'll request a secure OTP from UIDAI. Used only for verification.", orb: "listening",
      render: () => (<><Field value={d.aadhaar} onChange={(v) => { const x = v.replace(/\D/g, "").slice(0, 12); upd("aadhaar", x.replace(/(.{4})/g, "$1 ").trim()); }} placeholder="1234 5678 9012" /><div style={{ height: 12 }} /><Primary disabled={d.aadhaar.replace(/\s/g, "").length !== 12} onClick={next}>Verify with OTP</Primary><Ghost onClick={next}>Upload Aadhaar instead</Ghost></>) },

    { voice: `All verified. Here's what Aadhaar has on record — pleased to meet you, ${FETCH.first}. Does this look right?`,
      caption: <>All verified — pleased to meet you, {ACC(FETCH.first)}.</>, hint: "Here's what Aadhaar returned. Quick check before we move on.", orb: "recommends",
      render: () => (<div style={{ display: "grid", gap: 14 }}>
        <DataCard title="From Aadhaar" icon={ShieldCheck} rows={[["Name", FETCH.name], ["Date of birth", FETCH.dob], ["Gender", FETCH.gender], ["Aadhaar", FETCH.aadhaarMasked]]} />
        <Primary onClick={next}>That's me <ArrowRight size={17} /></Primary>
      </div>) },

    { voice: `Thanks, ${FETCH.first}. I pulled your address straight from Aadhaar. Is this where you'd like all documents sent?`,
      caption: <>Thanks, {ACC(FETCH.first)} — I pulled your {ACC("address")} from Aadhaar.</>, hint: "This is used for all documentation & communication.", orb: "recommends",
      render: () => (<div style={{ display: "grid", gap: 14 }}>
        <DataCard title="Current address" icon={MapPin} rows={[["Address", FETCH.address]]} />
        <Primary onClick={next}>Looks right <Check size={17} /></Primary>
        <Ghost onClick={next}>Edit address</Ghost>
      </div>) },

    { voice: "Last bit of K-Y-C — your PAN. This lets me match you with the right home-loan options.",
      caption: <>Last KYC step — your {ACC("PAN")}.</>, hint: "So I can match you with the right loan options.", orb: "listening",
      render: () => (<><Field value={d.pan} onChange={(v) => upd("pan", v.toUpperCase().slice(0, 10))} placeholder="ABCDE1234F" center /><div style={{ height: 12 }} /><Primary disabled={d.pan.length !== 10} onClick={next}>Verify PAN</Primary></>) },

    { voice: `Perfect, ${FETCH.first}. Your PAN checks out and matches your Aadhaar. Your KYC is complete.`,
      caption: <>Perfect — your {ACC("PAN")} checks out, {FETCH.first}.</>, hint: "Your KYC is now complete. Next: your loan readiness.", orb: "recommends",
      render: () => (<div style={{ display: "grid", gap: 14 }}>
        <DataCard title="From PAN" icon={CreditCard} rows={[["Name as per PAN", FETCH.name], ["PAN", FETCH.panMasked], ["Status", "Active · matches Aadhaar"]]} />
        <Primary onClick={next}>Check my loan readiness <ArrowRight size={17} /></Primary>
      </div>) },

    { voice: "I can run a soft credit check to understand your eligibility. It won't affect your credit score. Is that okay?",
      caption: <>I'd like to run a {ACC("soft credit check")}.</>, hint: "It won't affect your credit score. I just need your okay.", orb: "recommends",
      render: () => (<div style={{ display: "grid", gap: 10 }}>
        <ConsentRow checked={d.consent1} onClick={() => upd("consent1", !d.consent1)} text="The PAN details belong to me, the primary applicant." />
        <ConsentRow checked={d.consent2} onClick={() => upd("consent2", !d.consent2)} text="I authorise ASBL to securely process my credit report via its bureau partner." />
        <div style={{ height: 4 }} /><Primary disabled={!(d.consent1 && d.consent2)} onClick={next}>Run soft check</Primary>
      </div>) },

    { voice: `Almost there, ${FETCH.first}. What's your monthly take-home salary?`,
      caption: <>Almost there, {ACC(FETCH.first)} — your monthly {ACC("take-home")}?</>, hint: "Or drop your latest payslip — I'll read it for you.", orb: "listening",
      render: () => (<><Field value={d.salary ? Number(d.salary).toLocaleString("en-IN") : ""} onChange={(v) => upd("salary", v.replace(/\D/g, "").slice(0, 9))} prefix="₹" placeholder="2,00,000" /><div style={{ height: 10 }} /><Ghost icon={Upload} onClick={() => upd("salary", d.salary || "200000")}>Upload payslip instead</Ghost><div style={{ height: 10 }} /><Primary disabled={!d.salary} onClick={next}>Continue</Primary></>) },

    { voice: "One last detail — are your total monthly E-M-Is above seventy thousand rupees? Include home, car and personal loans.",
      caption: <>Are your monthly EMIs above {ACC("₹70,000")}?</>, hint: "Include all ongoing EMIs — home, car, personal loans.", orb: "listening",
      render: () => (<div style={{ display: "grid", gap: 10 }}>
        <Chip label="Above ₹70,000" selected={d.emiBand === "above"} onClick={() => { upd("emiBand", "above"); runResult("above"); }} />
        <Chip label="Under ₹70,000" selected={d.emiBand === "under"} onClick={() => { upd("emiBand", "under"); runResult("under"); }} />
      </div>) },
  ];

  const runResult = (band) => {
    next(); setThinking(true); setResult(null);
    const r = computeEligibility({ salary: d.salary, emiBand: band });
    setTimeout(() => { setThinking(false); setResult(r); }, 2200);
  };

  const cur = steps[step];
  useEffect(() => {
    if (step < steps.length) playStep(step, lang);
    /* eslint-disable-next-line */
  }, [step, voice, lang]);
  useEffect(() => {
    if (step >= steps.length && !thinking && result && voice) {
      const low = result.pct < 60;
      const texts = {
        en: low ? `Right now, ${FETCH.first}, this comes to about ${result.pct} percent of your home value. Don't worry — here's how I'd boost it.` : `Good news, ${FETCH.first} — you're eligible for up to ${result.pct} percent financing.`,
        hi: low ? `अभी, ${FETCH.first}, यह आपके घर की कीमत का लगभग ${result.pct} प्रतिशत बनता है। चिंता न करें — मैं बताती हूँ इसे कैसे बढ़ाएं।` : `अच्छी खबर, ${FETCH.first} — आप ${result.pct} प्रतिशत तक फाइनेंसिंग के लिए पात्र हैं।`,
        te: low ? `ప్రస్తుతం, ${FETCH.first}, ఇది మీ ఇంటి విలువలో సుమారు ${result.pct} శాతం. ఆందోళన పడకండి — ఎలా పెంచవచ్చో చెప్తాను.` : `శుభవార్త, ${FETCH.first} — మీరు ${result.pct} శాతం వరకు ఫైనాన్సింగ్‌కు అర్హులు.`,
      };
      speakDynamic(texts[lang] || texts.en);
    } /* eslint-disable-next-line */
  }, [step, result, thinking, lang]);

  const onResult = step >= steps.length;
  const progress = Math.min(1, step / steps.length);

  return (
    <div className="saanvi-outer" style={{ fontFamily: "Mulish, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500;1,9..144,600&family=Mulish:wght@400;600;700;800&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulseDot { 0%,100% { opacity: .3; } 50% { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .saanvi-outer {
          min-height: 100vh;
          background: ${C.ivory};
          display: flex;
          justify-content: center;
        }
        .saanvi-inner {
          width: 100%;
          max-width: 430px;
          background: ${C.ivory};
          position: relative;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        @media (min-width: 600px) {
          .saanvi-outer {
            align-items: center;
            padding: 40px 16px;
            background: #EFEAE2;
          }
          .saanvi-inner {
            min-height: 0;
            height: 800px;
            border-radius: 20px;
            box-shadow: 0 8px 48px rgba(33,30,26,0.13);
            overflow: hidden;
          }
        }
      `}</style>

      <div className="saanvi-inner">
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 60% at 50% -10%, rgba(240,78,56,0.06), rgba(240,78,56,0) 55%)", pointerEvents: "none" }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: "16px 0 6px", zIndex: 2 }}>
          <div style={{ position: "absolute", left: 22, top: 11, display: "flex", alignItems: "center", gap: 7 }}>
            {nameKnown && (
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${C.orange}, ${C.orangeDeep})`, color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 12.5, fontFamily: "Mulish" }}>{INITIALS}</div>
            )}
            <button onClick={() => setHelpOpen(true)} title="Ask Saanvi"
              style={{ background: helpOpen ? C.soft : "transparent", border: `1px solid ${helpOpen ? C.orange : C.line}`, borderRadius: 11, width: 34, height: 34, display: "grid", placeItems: "center", cursor: "pointer" }}>
              <MessageCircle size={16} color={helpOpen ? C.orange : C.muted} />
            </button>
          </div>
          <div style={{ textAlign: "center", lineHeight: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 19, color: C.ink, letterSpacing: -0.3 }}>Homes</div>
            <div style={{ fontSize: 8.5, color: C.muted, letterSpacing: 2, marginTop: 1 }}>by ASBL</div>
          </div>
          <div style={{ position: "absolute", right: 22, top: 11, display: "flex", gap: 6, alignItems: "center" }}>
            <button onClick={() => setLang(l => l === "en" ? "hi" : l === "hi" ? "te" : "en")}
              style={{ cursor: "pointer", background: "transparent", border: `1px solid ${C.line}`, borderRadius: 11, height: 34, padding: "0 10px", display: "flex", alignItems: "center", gap: 5, fontFamily: "Mulish, sans-serif", fontSize: 12, fontWeight: 800 }}>
              <span style={{ color: lang === "en" ? C.orange : C.muted }}>EN</span>
              <span style={{ color: C.line, fontSize: 10 }}>|</span>
              <span style={{ color: lang === "hi" ? C.orange : C.muted }}>हि</span>
              <span style={{ color: C.line, fontSize: 10 }}>|</span>
              <span style={{ color: lang === "te" ? C.orange : C.muted }}>తె</span>
            </button>
            <button onClick={() => { const v = !voice; setVoice(v); if (!v) cancelAudio(); }} title="Toggle Saanvi's voice"
              style={{ background: voice ? C.soft : "transparent", border: `1px solid ${voice ? C.orange : C.line}`, borderRadius: 11, width: 34, height: 34, display: "grid", placeItems: "center", cursor: "pointer" }}>
              {voice ? <Volume2 size={16} color={C.orange} /> : <VolumeX size={16} color={C.muted} />}
            </button>
          </div>
        </div>

        <div style={{ height: 2, background: C.line, margin: "8px 26px 0", borderRadius: 2, overflow: "hidden", zIndex: 2 }}>
          <div style={{ height: "100%", width: `${(onResult ? 1 : progress) * 100}%`, background: C.orange, borderRadius: 2, transition: "width .5s ease" }} />
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 26px", zIndex: 2, overflowY: "auto" }}>
          {!onResult ? (
            <div key={step} style={{ flex: 1, display: "flex", flexDirection: "column", animation: "fadeUp .45s ease both" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 24 }}>
                <Orb state={cur.orb} />
                {cur.orb !== "idle" && <div style={{ marginTop: 10, fontSize: 11, fontWeight: 800, letterSpacing: 1.6, textTransform: "uppercase", color: C.orange, display: "flex", alignItems: "center", gap: 6 }}>{cur.orb === "thinking" && <Dots />}{STATE_LABEL[cur.orb]}</div>}
              </div>
              <div style={{ textAlign: "center", padding: "18px 4px 6px" }}>
                <div style={{ fontFamily: "Fraunces, serif", fontSize: 25, fontWeight: 500, lineHeight: 1.22, color: C.ink, letterSpacing: -0.4 }}>{cur.caption}</div>
                {cur.hint && <p style={{ fontSize: 13.5, color: C.muted, marginTop: 11, lineHeight: 1.5, maxWidth: 300, marginInline: "auto" }}>{cur.hint}</p>}
              </div>
              <div style={{ marginTop: "auto", paddingBottom: 22, paddingTop: 14 }}>{cur.render()}</div>
            </div>
          ) : (
            <ResultScreen thinking={thinking} result={result} data={d} />
          )}
        </div>

        {helpOpen && (
          <>
            <div onClick={() => setHelpOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(33,30,26,0.35)", zIndex: 19 }} />
            <HelpPanel onClose={() => setHelpOpen(false)} />
          </>
        )}
      </div>
    </div>
  );
}

function ConsentRow({ checked, onClick, text }) {
  return (
    <button onClick={onClick} style={{ display: "flex", gap: 11, alignItems: "flex-start", textAlign: "left", cursor: "pointer", background: C.paper, border: `1.5px solid ${checked ? C.orange : C.line}`, borderRadius: 14, padding: "13px 14px", fontFamily: "Mulish", transition: "all .15s ease" }}>
      <span style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1, border: `1.5px solid ${checked ? C.orange : C.line}`, background: checked ? C.orange : "transparent", display: "grid", placeItems: "center" }}>{checked && <Check size={13} color="#fff" strokeWidth={3} />}</span>
      <span style={{ fontSize: 13, color: C.ink, lineHeight: 1.45, fontWeight: 600 }}>{text}</span>
    </button>
  );
}

/* ---------- Foresight scenarios ---------- */
const SCENARIOS = [
  { key: "co",         icon: UserPlus,   title: "Add a co-applicant",      sub: "Income-contributing family member",    params: { coApplicantIncome: 90000 } },
  { key: "income",     icon: TrendingUp,  title: "Declare extra income",    sub: "Rent, freelance or bonus income",      params: { extraIncome: 45000 } },
  { key: "close_loan", icon: CreditCard,  title: "Close a running loan",    sub: "Removes ₹20k/mo from EMI burden",      params: { reducedEMI: 20000 } },
  { key: "down",       icon: Wallet,      title: "Increase down payment",   sub: "Contribute ₹15L more from savings",    params: { reducedTarget: 1500000 } },
  { key: "tenure",     icon: RotateCcw,   title: "Extend loan tenure",      sub: "30 years instead of 20 years",         params: { perLakhEmiOverride: 733 } },
  { key: "stepup",     icon: Sparkles,    title: "Step-up loan product",    sub: "Start low, increase as salary grows",  params: { perLakhEmiOverride: 810 } },
];

function ForesightTile({ scenario, basePct, data, selected, onSelect }) {
  const [h, setH] = useState(false);
  const projected = computeEligibility({ salary: data.salary, emiBand: data.emiBand, ...scenario.params });
  const delta = projected.pct - basePct;
  const Icon = scenario.icon;
  return (
    <button onClick={() => onSelect(scenario.key)} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ textAlign: "left", cursor: "pointer", background: selected ? C.soft : C.paper,
        border: `1.5px solid ${selected ? C.orange : h ? "rgba(240,78,56,0.35)" : C.line}`,
        borderRadius: 18, padding: "14px 13px", display: "flex", flexDirection: "column", gap: 9,
        fontFamily: "Mulish", transition: "all .18s ease",
        boxShadow: selected ? `0 0 0 3px ${C.soft}, 0 4px 14px rgba(240,78,56,0.1)` : h ? "0 6px 16px rgba(33,30,26,0.08)" : "0 1px 3px rgba(33,30,26,0.05)",
        transform: h && !selected ? "translateY(-1px)" : "none" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ width: 36, height: 36, borderRadius: 11, background: selected ? C.orange : C.soft, display: "grid", placeItems: "center", flexShrink: 0, transition: "all .18s ease" }}>
          <Icon size={17} color={selected ? "#fff" : C.orange} />
        </span>
        {selected && <span style={{ width: 20, height: 20, borderRadius: "50%", background: C.orange, display: "grid", placeItems: "center", flexShrink: 0 }}><Check size={11} color="#fff" strokeWidth={3} /></span>}
      </div>
      <div>
        <div style={{ fontWeight: 800, fontSize: 13, color: C.ink, lineHeight: 1.3 }}>{scenario.title}</div>
        <div style={{ fontSize: 11, color: C.muted, marginTop: 2, lineHeight: 1.35 }}>{scenario.sub}</div>
      </div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 3, background: delta > 0 ? "rgba(46,158,91,0.1)" : "rgba(33,30,26,0.06)", color: delta > 0 ? "#2E9E5B" : C.muted, padding: "4px 8px", borderRadius: 20, fontSize: 11.5, fontWeight: 800, alignSelf: "flex-start" }}>
        {delta > 0 ? `+${delta}%` : `${delta}%`} → {projected.pct}%
      </div>
    </button>
  );
}

/* ---------- Result screen ---------- */
function ResultScreen({ thinking, result, data }) {
  const [selected, setSelected] = useState(null);
  const [boostedResult, setBoostedResult] = useState(null);

  const handleSelect = (key) => {
    if (selected === key) { setSelected(null); setBoostedResult(null); return; }
    setSelected(key);
    const s = SCENARIOS.find(sc => sc.key === key);
    setBoostedResult(computeEligibility({ salary: data.salary, emiBand: data.emiBand, ...s.params }));
  };

  if (thinking && !result) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", animation: "fadeUp .4s ease both" }}>
        <Orb state="thinking" />
        <div style={{ marginTop: 14, fontSize: 11, fontWeight: 800, letterSpacing: 1.6, textTransform: "uppercase", color: C.orange, display: "flex", gap: 6, alignItems: "center" }}><Dots /> Thinking</div>
        <p style={{ fontFamily: "Fraunces, serif", fontSize: 22, color: C.ink, marginTop: 18, textAlign: "center", maxWidth: 280, lineHeight: 1.3 }}>Crunching your numbers, {FETCH.first}…</p>
        <p style={{ fontSize: 13, color: C.muted, marginTop: 8 }}>Income · EMIs · soft credit signal</p>
      </div>
    );
  }
  if (!result) return null;

  const active = boostedResult || result;
  const contributionPct = 100 - active.pct;
  const delta = boostedResult ? boostedResult.pct - result.pct : 0;
  const selectedScenario = SCENARIOS.find(s => s.key === selected);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingTop: 16, paddingBottom: 28, animation: "fadeUp .45s ease both" }}>

      {/* header */}
      <div style={{ textAlign: "center", marginBottom: 4 }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.6, textTransform: "uppercase", color: C.orange, marginBottom: 6 }}>
          {boostedResult ? "Updated estimate" : `You're set, ${FETCH.first}`}
        </div>
        <div style={{ fontFamily: "Fraunces, serif", fontSize: 18, fontWeight: 500, color: C.ink, lineHeight: 1.28, letterSpacing: -0.2, maxWidth: 270, margin: "0 auto" }}>
          {boostedResult
            ? <>Eligibility moves to <span style={{ color: C.orange, fontStyle: "italic" }}>{active.pct}%</span> with this change</>
            : <>You can finance up to <span style={{ color: C.orange, fontStyle: "italic" }}>{active.pct}%</span> of your home</>}
        </div>
        {boostedResult && delta > 0 && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 8, background: "rgba(46,158,91,0.1)", color: "#2E9E5B", padding: "5px 12px", borderRadius: 20, fontSize: 12.5, fontWeight: 800 }}>
            <TrendingUp size={13} /> +{delta}% boost · was {result.pct}%
          </div>
        )}
      </div>

      <RingGauge pct={active.pct} />

      {/* breakdown */}
      <div style={{ background: C.paper, border: `1.5px solid ${C.line}`, borderRadius: 16, padding: "13px 15px", margin: "14px 0 0", display: "grid", gap: 9 }}>
        {[["Indicative home value", fmtCr(HOME_VALUE)], ["Eligible loan", fmtL(active.eligibleLoan)], [`Your contribution (${contributionPct}%)`, fmtL(HOME_VALUE - active.eligibleLoan)]].map(([l, v], i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", paddingTop: i ? 9 : 0, borderTop: i ? `1px solid ${C.line}` : "none" }}>
            <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 600 }}>{l}</span>
            <span style={{ fontSize: 13.5, color: i === 1 ? C.orange : C.ink, fontWeight: 800 }}>{v}</span>
          </div>
        ))}
      </div>

      {/* basis tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10, justifyContent: "center" }}>
        {[`₹${Number(data.salary || 0).toLocaleString("en-IN")}/mo`, data.emiBand === "above" ? "EMIs > ₹70k" : "EMIs < ₹70k", "KYC verified"].map((t, i) => (
          <span key={i} style={{ fontSize: 11, fontWeight: 700, color: C.muted, background: "#F1ECE4", padding: "4px 9px", borderRadius: 20 }}>{t}</span>
        ))}
      </div>

      {/* foresight grid */}
      <div style={{ marginTop: 22 }}>
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.8, textTransform: "uppercase", color: C.muted }}>Make a choice · see where it takes you</div>
          <div style={{ fontSize: 12.5, color: C.muted, marginTop: 3 }}>Tap a tile to see your projected eligibility</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {SCENARIOS.map(s => (
            <ForesightTile key={s.key} scenario={s} basePct={result.pct} data={data} selected={selected === s.key} onSelect={handleSelect} />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ marginTop: 20 }}>
        {selected && (
          <div style={{ background: C.soft, border: `1px solid rgba(240,78,56,0.18)`, borderRadius: 14, padding: "12px 14px", marginBottom: 12 }}>
            <p style={{ fontSize: 12.5, color: C.ink, lineHeight: 1.5, fontWeight: 600, margin: 0 }}>
              <Check size={13} color={C.orange} style={{ verticalAlign: -2, marginRight: 5 }} />
              <b>{selectedScenario.title}</b> moves your eligibility from {result.pct}% to <b style={{ color: C.orange }}>{active.pct}%</b>.
            </p>
          </div>
        )}
        <p style={{ fontSize: 11.5, color: C.muted, textAlign: "center", marginBottom: 12 }}>Indicative estimate · not a loan sanction.</p>
        <Primary onClick={() => {}}>Confirm & secure Priority Access <Check size={17} /></Primary>
      </div>
    </div>
  );
}
