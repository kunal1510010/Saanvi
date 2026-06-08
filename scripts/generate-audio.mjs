/**
 * One-time script — generates all step audio files and saves them to public/audio/.
 * Run once: node scripts/generate-audio.mjs
 * Skips files that already exist so re-runs are safe.
 */

import fs from "fs";
import path from "path";

const API_KEY = "sk_509cjczs_7onKvkhEYPFJaqOdjlsKbFjI";
const OUT_DIR = path.resolve("public/audio");
const FIRST   = "Adithyan"; // matches FETCH.first in App.jsx

const VOICES_EN = [
  "Hi, I'm Saanvi, your digital home-buying assistant. In about fifteen minutes I'll help you secure your Priority Access. Shall we begin?",
  "First, let's make sure it's really you. What's your registered phone number?",
  "I've sent a four-digit code to your phone and WhatsApp. Pop it in below.",
  "Great, you're verified. Now, where do you live and work?",
  "And how do you earn — are you salaried, or self-employed?",
  "How would you like to fund your home — through a home loan, or entirely from your savings?",
  "Let's put a face to your profile. A quick selfie — clear face, good lighting, no sunglasses.",
  "To verify your identity, share your Aadhaar number. I'll request a one-time password from U-I-D-A-I.",
  `All verified. Here's what Aadhaar has on record — pleased to meet you, ${FIRST}. Does this look right?`,
  `Thanks, ${FIRST}. I pulled your address straight from Aadhaar. Is this where you'd like all documents sent?`,
  "Last bit of K-Y-C — your PAN. This lets me match you with the right home-loan options.",
  `Perfect, ${FIRST}. Your PAN checks out and matches your Aadhaar. Your KYC is complete.`,
  "I can run a soft credit check to understand your eligibility. It won't affect your credit score. Is that okay?",
  `Almost there, ${FIRST}. What's your monthly take-home salary?`,
  "One last detail — are your total monthly E-M-Is above seventy thousand rupees? Include home, car and personal loans.",
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
  `सब वेरिफाई हो गया — आपसे मिलकर खुशी हुई, ${FIRST}। आधार के रिकॉर्ड में यह जानकारी है। क्या यह सही है?`,
  `धन्यवाद, ${FIRST}। मैंने आधार से आपका पता लिया है। क्या आप इसी पते पर सभी दस्तावेज़ चाहेंगे?`,
  "केवाईसी का आखिरी हिस्सा — आपका पैन। इससे मैं सही होम लोन विकल्प खोज सकती हूँ।",
  `बहुत बढ़िया, ${FIRST}। पैन सत्यापित हो गया और आधार से मेल खाता है। आपकी केवाईसी पूरी हुई।`,
  "मैं एक सॉफ्ट क्रेडिट चेक करके आपकी पात्रता जाँच सकती हूँ। क्रेडिट स्कोर पर कोई असर नहीं पड़ेगा। ठीक है?",
  `बस थोड़ा और, ${FIRST}। आपकी मासिक टेक-होम सैलरी कितनी है?`,
  "एक आखिरी बात — क्या आपकी कुल मासिक ईएमआई सत्तर हजार रुपये से ज्यादा है? होम, कार और पर्सनल लोन सब मिलाकर बताएं।",
];

async function generateOne(text, langCode, outPath) {
  if (fs.existsSync(outPath)) {
    console.log(`  skip  ${path.basename(outPath)} (already exists)`);
    return;
  }
  const res = await fetch("https://api.sarvam.ai/text-to-speech", {
    method: "POST",
    headers: { "api-subscription-key": API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "bulbul:v3", text, target_language_code: langCode, speaker: "simran" }),
  });
  const data = await res.json();
  if (!data.audios?.[0]) {
    console.error(`  ERROR ${path.basename(outPath)}:`, JSON.stringify(data));
    return;
  }
  fs.writeFileSync(outPath, Buffer.from(data.audios[0], "base64"));
  console.log(`  wrote ${path.basename(outPath)}`);
}

const VOICES_TE = [
  "నమస్కారం, నేను సాన్వి — మీ డిజిటల్ హోమ్-బయింగ్ అసిస్టెంట్. సుమారు పదిహేను నిమిషాల్లో మీ ప్రయారిటీ యాక్సెస్ సురక్షితం చేస్తాను. మనం ప్రారంభిద్దామా?",
  "మొదట, ఇది నిజంగా మీరే అని నిర్ధారించుకుందాం. మీ రిజిస్టర్డ్ ఫోన్ నంబర్ చెప్పగలరా?",
  "నేను మీ ఫోన్ మరియు వాట్సాప్‌కు నాలుగు అంకెల కోడ్ పంపాను. దయచేసి దిగువన నమోదు చేయండి.",
  "చాలా బాగుంది, మీరు వెరిఫై అయ్యారు. ఇప్పుడు చెప్పండి, మీరు ఎక్కడ నివసిస్తారు మరియు పని చేస్తారు?",
  "మీరు ఎలా సంపాదిస్తారు — ఉద్యోగం చేస్తారా, లేదా స్వంత వ్యాపారం చేస్తారా?",
  "మీరు ఇంటిని ఎలా కొనాలనుకుంటున్నారు — హోమ్ లోన్ ద్వారా, లేదా పూర్తిగా మీ పొదుపుల నుండి?",
  "మీ ప్రొఫైల్‌కు ఒక ఫోటో జోడిద్దాం. ఒక సెల్ఫీ తీయండి — ముఖం స్పష్టంగా కనిపించాలి, మంచి వెలుతురు ఉండాలి, సన్‌గ్లాసెస్ వేసుకోకండి.",
  "మీ గుర్తింపు ధృవీకరించడానికి, ఆధార్ నంబర్ చెప్పండి. నేను యుఐడిఎఐ నుండి ఓటిపి అభ్యర్థిస్తాను.",
  `అన్నీ వెరిఫై అయ్యాయి — మిమ్మల్ని కలిసి సంతోషంగా ఉంది, ${FIRST}. ఆధార్ రికార్డులలో ఈ సమాచారం ఉంది. ఇది సరైనదేనా?`,
  `ధన్యవాదాలు, ${FIRST}. నేను ఆధార్ నుండి మీ చిరునామా తీసుకున్నాను. అన్ని పత్రాలు ఇక్కడికే పంపించాలా?`,
  "కేవైసీలో చివరి భాగం — మీ పాన్. దీని ద్వారా మీకు సరైన హోమ్ లోన్ ఎంపికలు చూపించగలను.",
  `చాలా బాగుంది, ${FIRST}. పాన్ ధృవీకరించబడింది మరియు ఆధార్‌తో సరిపోలింది. మీ కేవైసీ పూర్తయింది.`,
  "మీ అర్హత అర్థం చేసుకోవడానికి నేను సాఫ్ట్ క్రెడిట్ చెక్ చేయగలను. ఇది మీ క్రెడిట్ స్కోర్‌ను ప్రభావితం చేయదు. సరేనా?",
  `దాదాపు అయిపోయింది, ${FIRST}. మీ నెలవారీ టేక్-హోమ్ జీతం ఎంత?`,
  "చివరి వివరం — మీ మొత్తం నెలవారీ ఈఎంఐలు డెబ్భై వేల రూపాయలకు పైగా ఉన్నాయా? హోమ్, కార్ మరియు పర్సనల్ లోన్లన్నీ కలిపి చెప్పండి.",
];

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log("\n── English ──");
  for (let i = 0; i < VOICES_EN.length; i++) {
    await generateOne(VOICES_EN[i], "en-IN", path.join(OUT_DIR, `en_${i}.wav`));
  }

  console.log("\n── Hindi ──");
  for (let i = 0; i < VOICES_HI.length; i++) {
    await generateOne(VOICES_HI[i], "hi-IN", path.join(OUT_DIR, `hi_${i}.wav`));
  }

  console.log("\n── Telugu ──");
  for (let i = 0; i < VOICES_TE.length; i++) {
    await generateOne(VOICES_TE[i], "te-IN", path.join(OUT_DIR, `te_${i}.wav`));
  }

  console.log("\nDone. 45 files in public/audio/\n");
}

main().catch(console.error);
