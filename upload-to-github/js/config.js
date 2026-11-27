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

  // Used to turn a receipt number into a fortune. Change it and every
  // receipt's fortune changes. (Prototype only — not real security.)
  secret: "scoops-spokes-salaya-2026",

  // Placeholder menu — replace with the real items and prices.
  menu: [
    { id: "g1", name: { en: "Gelato · 1 scoop",   th: "เจลาโต้ 1 สกู๊ป" },  price: 79 },
    { id: "g2", name: { en: "Gelato · 2 scoops",  th: "เจลาโต้ 2 สกู๊ป" },  price: 129 },
    { id: "g3", name: { en: "Gelato · 3 scoops",  th: "เจลาโต้ 3 สกู๊ป" },  price: 169 },
    { id: "af", name: { en: "Nitro Affogato",     th: "อัฟโฟกาโต้ไนโตร" }, price: 139 },
    { id: "nc", name: { en: "Nitro Cold Brew",    th: "ไนโตรโคลด์บรูว์" },  price: 99 },
    { id: "mf", name: { en: "Matcha Float",       th: "มัทฉะโฟลต" },       price: 145 },
    { id: "su", name: { en: "Sundae Cup",         th: "ซันเดย์ถ้วย" },       price: 168 },
    { id: "ct", name: { en: "Caramel Toast",      th: "คาราเมลโทสต์" },     price: 119 },
    { id: "wc", name: { en: "Waffle cone add-on", th: "เพิ่มโคนวาฟเฟิล" },   price: 20 }
  ],

  payments: [
    { id: "cash", label: { en: "Cash", th: "เงินสด" } },
    { id: "qr",   label: { en: "PromptPay", th: "พร้อมเพย์" } },
    { id: "card", label: { en: "Card", th: "บัตร" } }
  ],

  // Where the QR code on the receipt points. Leave "" to use the same
  // address the cashier page is open on. Can also be changed on the
  // cashier page under "Settings".
  fortuneBaseUrl: ""
};
