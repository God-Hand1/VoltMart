/* =========================================================================
   Sample data — FICTIONAL. Every number below is made up for UI testing.
   These are not real offers and no money moves anywhere.
   ========================================================================= */

const BRAND = {
  name: "VoltMart",
  tagline: "Demo storefront",
};

/* Sample "plan" cards. Values are deliberately modest and labelled as
   sample data in the UI. Nothing here is a real financial product. */
const PLANS = {
  fixed: [
    { id:"f1", price:500,  title:"Sample Plan · Starter", days:30, daily:22,  limit:"1× per account" },
    { id:"f2", price:1200, title:"Sample Plan · Plus",    days:45, daily:34,  limit:"1× per account" },
    { id:"f3", price:2500, title:"Sample Plan · Pro",     days:60, daily:58,  limit:"2× per account" },
    { id:"f4", price:4000, title:"Sample Plan · Max",     days:60, daily:88,  limit:"2× per account" },
    { id:"f5", price:7500, title:"Sample Plan · Elite",   days:90, daily:140, limit:"3× per account" },
    { id:"f6", price:9900, title:"Sample Plan · Studio",  days:90, daily:185, limit:"3× per account" },
  ],
  welfare: [
    { id:"w1", price:300,  title:"Sample Tier · Bronze", days:20, daily:18,  limit:"1× per account" },
    { id:"w2", price:800,  title:"Sample Tier · Silver", days:30, daily:31,  limit:"1× per account" },
    { id:"w3", price:1800, title:"Sample Tier · Gold",   days:45, daily:52,  limit:"2× per account" },
    { id:"w4", price:3200, title:"Sample Tier · Platinum",days:60,daily:76,  limit:"2× per account" },
  ],
  activity: [
    { id:"a1", price:1500, title:"Sample Event · Seasonal", days:30, daily:60, limit:"Once" },
  ],
};

const PLAN_TABS = [
  { key:"fixed",    label:"Fixed" },
  { key:"welfare",  label:"Welfare" },
  { key:"activity", label:"Activity" },
];

const TRANSACTIONS = [
  { id:"t1", kind:"credit",  title:"Sample credit",  note:"Demo entry",   amount:500,  when:"Today · 10:42" },
  { id:"t2", kind:"debit",   title:"Sample debit",   note:"Demo entry",   amount:120,  when:"Today · 09:15" },
  { id:"t3", kind:"credit",  title:"Sample credit",  note:"Demo entry",   amount:260,  when:"Yesterday · 18:03" },
  { id:"t4", kind:"credit",  title:"Sample credit",  note:"Demo entry",   amount:90,   when:"Yesterday · 11:27" },
  { id:"t5", kind:"debit",   title:"Sample debit",   note:"Demo entry",   amount:45,   when:"2 days ago · 16:50" },
  { id:"t6", kind:"credit",  title:"Sample credit",  note:"Demo entry",   amount:1300, when:"3 days ago · 08:11" },
];

const ACTIVITY_FEED = [
  { code:"87",  masked:"875***9841", amount:500,  when:"just now" },
  { code:"97",  masked:"979***1242", amount:662,  when:"just now" },
  { code:"95",  masked:"950***6213", amount:1040, when:"2 min ago" },
  { code:"82",  masked:"825***0858", amount:470,  when:"4 min ago" },
  { code:"64",  masked:"641***7730", amount:300,  when:"6 min ago" },
];

const TEAM_LEVELS = [
  { level:"L1", name:"Direct team", members:0, commission:"10%", recharge:0 },
  { level:"L2", name:"Level 2",     members:0, commission:"3%",  recharge:0 },
  { level:"L3", name:"Level 3",     members:0, commission:"1%",  recharge:0 },
];

/* Demo account state — persisted locally so the UI feels alive between
   page loads. No server is involved. */
const ACCOUNT = {
  name: "Demo User",
  phone: "9000000000",
  tier: "DEMO",
  balance: 1250,
  depositWallet: 400,
  productIncome: 0,
  referralCode: "100200",
};

/* Session state that the router writes to. */
const state = {
  lang: "en",
  loggedIn: false,
  planTab: "fixed",
  activePlans: 0,
  todayIncome: 0,
  showPassword: false,
};
