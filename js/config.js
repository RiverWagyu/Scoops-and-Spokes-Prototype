/* ============================================================
   Scoops & Spokes — prototype settings
   Edit this file to change the menu, odds, prizes and shop info.
   ============================================================ */
window.SS_CONFIG = {
  shop: {
    name: "Scoops & Spokes",
    branch: { en: "Salaya", th: "ศาลายา" },
    address: {
      en: "66 Salaya 26, Phutthamonthon, Nakhon Pathom 73170",
      th: "66 ศาลายา 26 อ.พุทธมณฑล จ.นครปฐม 73170"
    },
    instagram: "scoopsandspokes_th"
  },

  // The shop mascot (dino with a cone on its head), cut out from the logo.
  mascotSrc: "assets/mascot.png",

  // Chance that a receipt is "lucky" and can spin the wheel (0.25 = 25%).
  luckyChance: 0.25,

  // Wheel prizes. "weight" = how likely each prize is, relative to the others.
  // 45 + 30 + 15 + 10 = 100, so these read as percentages of lucky customers.
  prizes: [
    { id: "P10", weight: 45, label: { en: "10% OFF", th: "ลด 10%" }, color: "#E8B840", text: "#506840" },
    { id: "P15", weight: 30, label: { en: "15% OFF", th: "ลด 15%" }, color: "#506840", text: "#F7F1E1" },
    { id: "P20", weight: 15, label: { en: "20% OFF", th: "ลด 20%" }, color: "#E07B39", text: "#FFFDF7" },
    { id: "UPS", weight: 10, label: { en: "FREE UPSIZE", th: "อัปไซซ์ฟรี" }, color: "#A9BC6E", text: "#506840" }
  ],

  // How many days a coupon stays valid after the receipt date.
  couponValidDays: 14,

  // Free scoop for posting the receipt on social media: the customer shows their
  // post + receipt number on the next visit. Days it stays valid:
  shareValidDays: 30,

  // Used to turn a receipt number into a fortune. Change it and every
  // receipt's fortune changes. (Prototype only — not real security.)
  secret: "scoops-spokes-salaya-2026",

  // Menu, from the shop's ice cream + drinks boards.
  //   float: price with a gelato float on top   cone: extra for a freshly made cone
  menuCategories: [
    { id: "icecream", name: { en: "Ice Cream",                   th: "ไอศกรีม" } },
    { id: "soda",     name: { en: "Soda",                        th: "โซดา" } },
    { id: "tea",      name: { en: "Tea",                         th: "ชา" } },
    { id: "nitro",    name: { en: "Coffee · Nitro (no ice)",     th: "กาแฟไนโตร ไม่ใส่น้ำแข็ง" } },
    { id: "coldbrew", name: { en: "Coffee · Cold Brew on Ice",   th: "กาแฟสกัดเย็น" } }
  ],
  menu: [
    // Ice cream (cup, or freshly made cone +25)
    { id: "classic", cat: "icecream", name: { en: "Classic Cup O' Scoop + tiny scoop", th: "ถ้วยคลาสสิก 1 สกู๊ป + สกู๊ปจิ๋ว" }, price: 88,  cone: 25 },
    { id: "junior2", cat: "icecream", name: { en: "2 Junior Scoops + tiny scoop",      th: "2 สกู๊ปจูเนียร์ + สกู๊ปจิ๋ว" },    price: 138, cone: 25 },
    { id: "full2",   cat: "icecream", name: { en: "2 Full Scoops + tiny scoop",        th: "2 สกู๊ปเต็ม + สกู๊ปจิ๋ว" },       price: 158, cone: 25 },
    { id: "home",    cat: "icecream", name: { en: "Classic Cup O' Home (take-home, lidded)", th: "ถ้วยปิดฝากลับบ้าน" },     price: 88 },
    { id: "shake",   cat: "icecream", name: { en: "Milk Shake",                         th: "มิลค์เชค" },                      price: 188 },
    // Soda
    { id: "melon", cat: "soda", name: { en: "Melon Soda",  th: "เมล่อนโซดา" },    price: 89, float: 118 },
    { id: "peach", cat: "soda", name: { en: "Peach Soda",  th: "พีชโซดา" },       price: 89, float: 118 },
    { id: "yuzu",  cat: "soda", name: { en: "Yuzu Soda",   th: "ยูสุโซดา" },       price: 89, float: 118 },
    { id: "cola",  cat: "soda", name: { en: "Cola / Root Beer", th: "โคล่า/รูทเบียร์" }, price: 45, float: 85 },
    // Tea (float +40)
    { id: "mlatte", cat: "tea", name: { en: "Matcha Latte",   th: "มัจฉะลาเต้" },         price: 98, float: 138 },
    { id: "mcoco",  cat: "tea", name: { en: "Matcha Coconut", th: "มัจฉะน้ำมะพร้าวสด" },  price: 98, float: 138 },
    { id: "mclear", cat: "tea", name: { en: "Clear Matcha",   th: "มัจฉะใส" },            price: 78, float: 118 },
    { id: "thai",   cat: "tea", name: { en: "Thai Tea Fresh Milk Coconut", th: "ชาไทยมะพร้าวนมสด" }, price: 78, float: 118 },
    // Coffee – Nitro, no ice (float +40)
    { id: "nlatte", cat: "nitro", name: { en: "Nitro Latte",     th: "ไนโตรลาเต้" },              price: 148, float: 188 },
    { id: "ncoco",  cat: "nitro", name: { en: "Nitro Coconut",   th: "กาแฟน้ำมะพร้าวสดไนโตร" },  price: 148, float: 188 },
    { id: "ncold",  cat: "nitro", name: { en: "Nitro Cold Brew", th: "กาแฟไนโตร สกัดเย็น" },      price: 128, float: 168 },
    // Coffee – Cold brew on ice (float +40)
    { id: "clight", cat: "coldbrew", name: { en: "Light Roast",       th: "กาแฟสกัดเย็น คั่วอ่อน" },      price: 98, float: 138 },
    { id: "cmdark", cat: "coldbrew", name: { en: "Medium-Dark Roast", th: "กาแฟสกัดเย็น คั่วกลาง-เข้ม" }, price: 78, float: 118 },
    { id: "cmed",   cat: "coldbrew", name: { en: "Medium Roast",      th: "กาแฟสกัดเย็น คั่วกลาง" },      price: 78, float: 118 }
  ],

  payments: [
    { id: "cash", label: { en: "Cash", th: "เงินสด" } },
    { id: "qr",   label: { en: "PromptPay", th: "พร้อมเพย์" } },
    { id: "card", label: { en: "Card", th: "บัตร" } }
  ],

  // Online gallery (Firebase Firestore). Paste your Firebase web-app config
  // here to share photo strips across every device, e.g.
  //   firebase: { apiKey: "...", authDomain: "...", projectId: "...", appId: "..." },
  // Leave as null to keep photos on this device only.
  firebase: {
    apiKey: "AIzaSyC_lZHnkVFcPyDnvEWFtpSwcPb3AgqGvt8",
    authDomain: "scoops-and-spookes.firebaseapp.com",
    projectId: "scoops-and-spookes",
    storageBucket: "scoops-and-spookes.firebasestorage.app",
    messagingSenderId: "67226430431",
    appId: "1:67226430431:web:475ba4d067e2e629d9b26a"
  },

  // Is "Share to the online gallery" ticked by default in the photo booth?
  shareOnlineDefault: true,

  // Where the QR code on the receipt points. Leave "" to use the same
  // address the cashier page is open on. Can also be changed on the
  // cashier page under "Settings".
  fortuneBaseUrl: ""
};
