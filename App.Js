import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Modal, Dimensions, StatusBar
} from 'react-native';


const AsyncStorage = {
  getItem: async (key) => { try { return null; } catch(e) { return null; } },
  setItem: async (key, value) => { try {} catch(e) {} },
  removeItem: async (key) => { try {} catch(e) {} },
};

// â”€â”€â”€ PART 1: CORE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// ALTERZEN â€” PART 1: CORE  (Theme Â· Constants Â· Data)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// â”€â”€ THEME â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const T = {
  bg:'#080d0f', surf:'#0e1a1f', card:'#142028', bord:'#1e3040',
  brown:'#a0785a', brownS:'#c49a7a',
  teal:'#5a7a8a',  tealS:'#7fa3b5',
  gold:'#c49a4a',  mint:'#5dbf8a',
  txt:'#d8e8e0',   muted:'#6a8a8a',
  danger:'#c05050',
  green:'#4a7a5a', greenS:'#6db88a',
  // Diary card colours
  dBg:'#0f1b2d', dBord:'#1c3050', dTxt:'#a8c4e2',
  dLine:'#1c3050', dName:'#b8d0ee', dDate:'#4a6a9a',
  // Sanctuary / Aria
  aria:'#7a5a9a', ariaS:'#a07ac8',
  // Limbo â€” nature / deep forest theme
  limbo:'#080f0a', limboMid:'#1a2e1a',
  limboAccent:'#3a6b3a', limboS:'#7ab87a',
  limboGold:'#8a9a4a', limboMoss:'#4a6a2a',
  // Encounter
  encounter:'#0e1a2a', encounterAccent:'#3a6a9a',
  // Gender icon colors (high contrast on dark)
  genderFemale:'#f4a8c8', genderMale:'#7ab8f4', genderNonbinary:'#c8a8f4',
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// ARIA ICON â€” Custom SVG crescent moon + star
// Use <AriaIcon size={N} /> anywhere Aria's avatar appears.
// Requires: react-native-svg  (already used for sprout badge)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ARIA_ICON_SVG = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Soft glow halo -->
  <circle cx="15" cy="17" r="11" fill="#7a5a9a" opacity="0.13"/>
  <!-- Crescent moon -->
  <path d="M21.5 10.5C18.5 9.5 13 11.5 12 17.5C11 23 15.5 27 20.5 26C16 25.5 11.5 21.5 13 16C14 11.5 19 9.5 21.5 10.5Z" fill="#a07ac8" opacity="0.95"/>
  <path d="M22 9C18.5 8 12.5 10.5 11 17C9.5 23 14 27.5 20 27C15 26.5 10 22 11.5 16C13 10.5 19 8.5 22 9Z" fill="#c8a0f0" opacity="0.6"/>
  <!-- Primary star -->
  <path d="M23 8 L23.6 9.8 L25.5 9.8 L24 11 L24.6 12.8 L23 11.7 L21.4 12.8 L22 11 L20.5 9.8 L22.4 9.8 Z" fill="#e0c8ff" opacity="0.95"/>
  <!-- Tiny accent star -->
  <path d="M26 16 L26.35 17 L27.4 17 L26.55 17.65 L26.9 18.65 L26 18.05 L25.1 18.65 L25.45 17.65 L24.6 17 L25.65 17 Z" fill="#c8a0f0" opacity="0.7"/>
  <!-- Tiny dot star -->
  <circle cx="19" cy="9" r="0.9" fill="#e0c8ff" opacity="0.8"/>
</svg>`;

// Pre-sized variant strings for convenience
const ARIA_ICON_SVG_SM  = ARIA_ICON_SVG.replace('width="32" height="32"', 'width="16" height="16"');
const ARIA_ICON_SVG_MD  = ARIA_ICON_SVG; // 32Ã—32
const ARIA_ICON_SVG_LG  = ARIA_ICON_SVG.replace('width="32" height="32"', 'width="48" height="48"');


// Display rule: show EMOJI ICON ONLY next to username â€” no text label.
// Premium (â˜˜ï¸) is a paid flag, independent of rep tier.
const BADGES = {
  sprout: { icon:'ðŸŒ±', label:'Sprout',  range:'0â€“200',   minRep:0    },
  leaf:   { icon:'ðŸƒ', label:'Leaf',    range:'200â€“500', minRep:200  },
  tree:   { icon:'ðŸŒ³', label:'Grove',   range:'500â€“1k',  minRep:500  },
  pine:   { icon:'ðŸŽ„', label:'Elder',   range:'1000+',   minRep:1000 },
  clover: { icon:'â˜˜ï¸', label:'Premium', range:'Premium', minRep:null },
};

function getBadgeTier(rep, isPremium) {
  if (isPremium)   return 'clover';
  if (rep >= 1000) return 'pine';
  if (rep >= 500)  return 'tree';
  if (rep >= 200)  return 'leaf';
  return 'sprout';
}
const getBadgeIcon = (key) => BADGES[key]?.icon ?? '';

// â”€â”€ ZODIAC â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ZODIAC_SIGNS = [
  { id:'aries',       name:'Aries',       glyph:'â™ˆ', dates:'Mar 21â€“Apr 19', element:'Fire',  stone:'Carnelian',   elColor:'#c4603a' },
  { id:'taurus',      name:'Taurus',      glyph:'â™‰', dates:'Apr 20â€“May 20', element:'Earth', stone:'Rose Quartz', elColor:'#7a9a5a' },
  { id:'gemini',      name:'Gemini',      glyph:'â™Š', dates:'May 21â€“Jun 20', element:'Air',   stone:'Agate',       elColor:'#7aaabb' },
  { id:'cancer',      name:'Cancer',      glyph:'â™‹', dates:'Jun 21â€“Jul 22', element:'Water', stone:'Moonstone',   elColor:'#4a6a9f' },
  { id:'leo',         name:'Leo',         glyph:'â™Œ', dates:'Jul 23â€“Aug 22', element:'Fire',  stone:'Tiger Eye',   elColor:'#c49a4a' },
  { id:'virgo',       name:'Virgo',       glyph:'â™', dates:'Aug 23â€“Sep 22', element:'Earth', stone:'Peridot',     elColor:'#7a9a5a' },
  { id:'libra',       name:'Libra',       glyph:'â™Ž', dates:'Sep 23â€“Oct 22', element:'Air',   stone:'Opal',        elColor:'#c49a7a' },
  { id:'scorpio',     name:'Scorpio',     glyph:'â™', dates:'Oct 23â€“Nov 21', element:'Water', stone:'Obsidian',    elColor:'#8a4a8a' },
  { id:'sagittarius', name:'Sagittarius', glyph:'â™', dates:'Nov 22â€“Dec 21', element:'Fire',  stone:'Turquoise',   elColor:'#c4603a' },
  { id:'capricorn',   name:'Capricorn',   glyph:'â™‘', dates:'Dec 22â€“Jan 19', element:'Earth', stone:'Garnet',      elColor:'#7a6a5a' },
  { id:'aquarius',    name:'Aquarius',    glyph:'â™’', dates:'Jan 20â€“Feb 18', element:'Air',   stone:'Amethyst',    elColor:'#5a7aaa' },
  { id:'pisces',      name:'Pisces',      glyph:'â™“', dates:'Feb 19â€“Mar 20', element:'Water', stone:'Aquamarine',  elColor:'#4a7a9a' },
];

const ZODIAC_READINGS = {
  aries:       { overall:"The stars are charging your confidence today. Step into the spotlight â€” it's yours.",           mood:'Bold',        energy:'High',    love:'Spark alive',     career:'Take the lead',   lucky:7,  lcolor:'#c4603a', prompt:"What's one brave thing you've been putting off?" },
  taurus:      { overall:'Slow, steady energy grounds you. A quiet moment today holds more meaning than it seems.',       mood:'Grounded',    energy:'Steady',  love:'Deepen roots',    career:'Trust process',   lucky:4,  lcolor:'#7a9a5a', prompt:'What simple thing brought you peace today?' },
  gemini:      { overall:'Your mind is a constellation right now â€” ideas everywhere. Write them down before they drift.', mood:'Curious',     energy:'Restless',love:'Playful',         career:'Communicate',     lucky:11, lcolor:'#7aaabb', prompt:'What thought keeps circling your mind lately?' },
  cancer:      { overall:'Emotions run deep and soft today. Let yourself feel without judgment.',                         mood:'Tender',      energy:'Low',     love:'Open heart',      career:'Nurture others',  lucky:2,  lcolor:'#4a6a9f', prompt:'What are you holding on to that you could gently release?' },
  leo:         { overall:"Your warmth is a gift others need. Let your light out â€” don't dim it for anyone.",              mood:'Radiant',     energy:'High',    love:'Be generous',     career:'Own the room',    lucky:1,  lcolor:'#c49a4a', prompt:'Who deserves your appreciation today?' },
  virgo:       { overall:'Details you overlooked are speaking to you. Pause and listen to the small things.',             mood:'Analytical',  energy:'Medium',  love:'Be patient',      career:'Refine work',     lucky:5,  lcolor:'#7a9a5a', prompt:"What's one thing you could do better tomorrow?" },
  libra:       { overall:"Balance is the art today. You don't have to choose â€” find the middle way.",                    mood:'Harmonious',  energy:'Gentle',  love:'Seek connection', career:'Collaborate',     lucky:6,  lcolor:'#c49a7a', prompt:'Where in your life do you feel most out of balance?' },
  scorpio:     { overall:'Something beneath the surface is ready to rise. Trust what you feel, even if it scares you.',  mood:'Intense',     energy:'Deep',    love:'Vulnerable',      career:'Dig deeper',      lucky:8,  lcolor:'#8a4a8a', prompt:'What truth have you been afraid to face?' },
  sagittarius: { overall:'The horizon is calling. Even a small step toward something new restores your spirit.',          mood:'Adventurous', energy:'High',    love:'Be open',         career:'Expand view',     lucky:3,  lcolor:'#c4603a', prompt:'If you could go anywhere tomorrow, where and why?' },
  capricorn:   { overall:"Your patience is building something lasting. The mountain doesn't rush.",                       mood:'Determined',  energy:'Steady',  love:'Loyal & true',    career:'Stay the course', lucky:10, lcolor:'#7a6a5a', prompt:'What long-term goal are you quietly working toward?' },
  aquarius:    { overall:'You see things others miss. That vision is your gift â€” share it without apology.',              mood:'Visionary',   energy:'Electric',love:'Unconventional',  career:'Innovate',        lucky:9,  lcolor:'#5a7aaa', prompt:'What idea feels too strange to say out loud?' },
  pisces:      { overall:'Dreams are data today. What your imagination shows you is worth writing down.',                 mood:'Dreamy',      energy:'Soft',    love:'Surrender gently',career:'Trust intuition', lucky:12, lcolor:'#4a7a9a', prompt:'What did you dream about recently?' },
};

function getSignFromDOB(dateStr) {
  const d = new Date(dateStr), m = d.getMonth()+1, day = d.getDate();
  if ((m===3&&day>=21)||(m===4&&day<=19)) return 'aries';
  if ((m===4&&day>=20)||(m===5&&day<=20)) return 'taurus';
  if ((m===5&&day>=21)||(m===6&&day<=20)) return 'gemini';
  if ((m===6&&day>=21)||(m===7&&day<=22)) return 'cancer';
  if ((m===7&&day>=23)||(m===8&&day<=22)) return 'leo';
  if ((m===8&&day>=23)||(m===9&&day<=22)) return 'virgo';
  if ((m===9&&day>=23)||(m===10&&day<=22)) return 'libra';
  if ((m===10&&day>=23)||(m===11&&day<=21)) return 'scorpio';
  if ((m===11&&day>=22)||(m===12&&day<=21)) return 'sagittarius';
  if ((m===12&&day>=22)||(m===1&&day<=19)) return 'capricorn';
  if ((m===1&&day>=20)||(m===2&&day<=18)) return 'aquarius';
  return 'pisces';
}

// â”€â”€ MOODS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const MOODS = [
  {emoji:'ðŸ˜Š',label:'Happy'},{emoji:'ðŸ˜”',label:'Sad'},{emoji:'ðŸ˜°',label:'Anxious'},
  {emoji:'ðŸ˜Œ',label:'Peaceful'},{emoji:'ðŸ˜¤',label:'Frustrated'},{emoji:'ðŸ¥º',label:'Lonely'},
  {emoji:'ðŸ˜´',label:'Tired'},{emoji:'ðŸ¤©',label:'Excited'},
];

// â”€â”€ TONIGHT PROMPTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const TONIGHT_PROMPTS = [
  "What's weighing on your heart tonight?",
  'Describe the last moment you felt at peace.',
  'What would you tell yourself from a year ago?',
  'What emotion have you been avoiding lately?',
  'What small thing made today worth living?',
];

// â”€â”€ USER STATS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const userStats = {
  reputation:148, isPremium:false, posts:23, reactions:312, coins:45,
  friends:12, streak:5, activeStatus:true, lockProfile:false,
  accountAge:10, emailVerified:true, email:'yourname@email.com',
  birthdate:'2000-01-15', coinsEarnedToday:0, reactionsThisHour:0,
  voicelogsToday:0, deviceId:'device_abc123', country:'ðŸ‡µðŸ‡­ Philippines',
  lastDailyClaimDate:null,
  zodiacSign:null,        // null â†’ shows DOB onboarding on first horoscope open
  horoscopeSeenToday:null,
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// PREMIUM FEATURE GATES
// isPremium() â€” checks userStats.isPremium
// PREMIUM_FEATURES â€” defines what each feature locks/unlocks
// canUse(featureKey) â€” call before rendering a gated feature
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PREMIUM_FEATURES = {
  reflect_prompts: {
    label:    'Full Prompt Library',
    desc:     'Free users get 1 prompt/day. Premium unlocks all 8 prompts for your mood, any time.',
    freeLimit: 1,
    icon:     'ðŸŒ¿',
  },
  horoscope_prompt: {
    label:    'Cosmic Prompt',
    desc:     'Daily journaling prompt powered by your sign. Premium only.',
    freeLimit: 0,
    icon:     'âœ¨',
  },
  encounter_filter: {
    label:    'Encounter Filters',
    desc:     'Filter Encounters by mood, gender, or country. Premium only.',
    freeLimit: 0,
    icon:     'ðŸŒŠ',
  },
  open_book_custom: {
    label:    'Open Book Themes',
    desc:     'Custom diary themes and fonts. Premium only.',
    freeLimit: 0,
    icon:     'ðŸ““',
  },
  limbo_full: {
    label:    'Full Limbo Access',
    desc:     'Free users see 2 Flash Cards/day. Premium unlocks all 5 + Mind Benders.',
    freeLimit: 2,
    icon:     'ðŸŒ¿',
  },
  profile_badge: {
    label:    'Clover Badge',
    desc:     'Exclusive â˜˜ï¸ badge displayed next to your name.',
    freeLimit: 0,
    icon:     'â˜˜ï¸',
  },
};

// Returns true if the user can access the feature
function canUse(featureKey) {
  if (userStats.isPremium) return true;
  const f = PREMIUM_FEATURES[featureKey];
  if (!f) return true; // unknown feature = open
  return f.freeLimit > 0; // has a free tier
}

// Returns remaining free uses for a metered feature
// Pass currentCount (e.g. messages sent today) to check
function freeUsesLeft(featureKey, currentCount = 0) {
  if (userStats.isPremium) return Infinity;
  const f = PREMIUM_FEATURES[featureKey];
  if (!f || f.freeLimit === 0) return 0;
  return Math.max(0, f.freeLimit - currentCount);
}

const SAMPLE_POSTS = {
  friends:[
    {id:'p1',type:'diary',    user:'Aria S.',av:'A',col:'#a0785a',flag:'ðŸ‡µðŸ‡­',badge:'clover',posts:41, rep:1240,friends:28, date:'March 11, 2026',
      text:"Had the most peaceful evening in weeks. Just me, tea, and my journal. No notifications. No noise. Just this quiet that felt like a gift.",
      reactions:{'â¤ï¸':12,'ðŸ¤—':8},comments:4},

    {id:'p2',type:'voicelog', user:'Kai R.', av:'K',col:'#5dbf8a',flag:'ðŸ‡¦ðŸ‡º',badge:'sprout',posts:7,  rep:88,  friends:5,  date:'March 11, 2026',
      title:'Voicelog #12 â€” Letting go',
      // Seeded waveform: array of bar heights (1â€“10) simulating a real recording
      waveform:[3,5,8,6,9,7,4,8,5,9,6,3,7,5,8,4,9,6,5,7,3,8,6,4,9,5,7,3,6,8],
      duration:'1:24', durationSecs:84,
      reactions:{'ðŸ¤—':22,'â¤ï¸':18},comments:5},

    {id:'p3',type:'story',    user:'Mira K.',av:'M',col:'#c49a4a',flag:'ðŸ‡¯ðŸ‡µ',badge:'tree',  posts:19, rep:612, friends:14, date:'March 11, 2026',
      text:"Evening walk. Took a different route and ended up somewhere I'd never been before.",
      // Seeded story: gradient photo placeholder with scene description
      storyScene:{ emoji:'ðŸŒ†', label:'Evening walk', gradient:['#1a1a2e','#2d1b4e','#1a2a4a'], caption:'A different route' },
      reactions:{'â¤ï¸':31,'ðŸ˜®':14},comments:8},

    {id:'p4',type:'diary',    user:'Nora V.',av:'N',col:'#c49a7a',flag:'ðŸ‡°ðŸ‡·',badge:'leaf',  posts:12, rep:310, friends:9,  date:'March 10, 2026',
      text:"My therapist asked me what I'd tell my younger self. I said: none of this is your fault. Then I cried for twenty minutes and felt lighter than I have in years.",
      reactions:{'ðŸ¤—':47,'â¤ï¸':39,'âœ¨':18},comments:21},
  ],
  following:[
    {id:'f1',type:'diary',  user:'Lyra J.',av:'L',col:'#c49a4a',flag:'ðŸ‡¬ðŸ‡§',badge:'pine',  posts:53, rep:1480,friends:37, date:'March 11, 2026',
      text:"Three months ago I couldn't get out of bed. Today I cooked a full meal. Pasta from scratch. Nobody saw it but me and I was so proud.",
      reactions:{'âœ¨':88,'â¤ï¸':52},comments:19},

    {id:'f2',type:'story',  user:'Zoe M.', av:'Z',col:'#7fa3b5',flag:'ðŸ‡¦ðŸ‡º',badge:'sprout',posts:4,  rep:55,  friends:3,  date:'March 11, 2026',
      text:'Golden hour from my rooftop. Not everything is broken.',
      storyScene:{ emoji:'ðŸŒ…', label:'Golden hour', gradient:['#2a1a0a','#4a2a0a','#6a3a1a'], caption:'Rooftop, 5:47pm' },
      reactions:{'ðŸ˜®':55,'â¤ï¸':41},comments:17},

    {id:'f3',type:'diary',  user:'Sam E.', av:'S',col:'#7a6a9a',flag:'ðŸ‡ºðŸ‡¸',badge:'leaf',  posts:15, rep:290, friends:11, date:'March 10, 2026',
      text:"I wrote a letter to someone I'll never send it to. Felt like putting down a bag I'd been carrying for two years.",
      reactions:{'ðŸ¤—':84,'â¤ï¸':66},comments:37},
  ],
  discover:[
    {id:'d1',type:'diary',    user:'Mira K.',av:'M',col:'#a0785a',flag:'ðŸ‡¯ðŸ‡µ',badge:'tree',  posts:19, rep:612, friends:14, date:'March 11, 2026',
      text:'Today I realized that the quiet after rain is the closest thing to peace I felt in weeks.',
      reactions:{'â¤ï¸':24,'ðŸ¤—':18,'âœ¨':9},comments:7},

    {id:'d2',type:'voicelog', user:'Nora V.',av:'N',col:'#c49a7a',flag:'ðŸ‡°ðŸ‡·',badge:'leaf',  posts:12, rep:310, friends:9,  date:'March 10, 2026',
      title:'Voicelog #18 â€” Learning to receive kindness',
      waveform:[5,7,4,9,6,8,3,7,5,9,4,8,6,5,9,3,7,6,8,4,9,5,7,3,8,6,4,9,5,7],
      duration:'1:37', durationSecs:97,
      reactions:{'ðŸ¤—':67,'â¤ï¸':53},comments:32},

    {id:'d3',type:'story',    user:'Kai R.', av:'K',col:'#5dbf8a',flag:'ðŸ‡¦ðŸ‡º',badge:'sprout',posts:7,  rep:88,  friends:5,  date:'March 10, 2026',
      text:"Sat by the water for an hour. Didn't check my phone once.",
      storyScene:{ emoji:'ðŸŒŠ', label:'By the water', gradient:['#0a1a2a','#0a2a3a','#0a1a4a'], caption:'One hour, no phone' },
      reactions:{'â¤ï¸':33,'ðŸ˜®':27},comments:11},
  ],
};

// â”€â”€ SAMPLE DMs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const SAMPLE_DMS = [
  {name:'Encounter',av:'?',col:'#c49a4a',flag:'ðŸ‡µðŸ‡­',badge:'',      online:true, last:'You both wrote about loneliness tonight.',time:'3h',       unread:1},
  {name:'Kai R.',   av:'K',col:'#5dbf8a',flag:'ðŸ‡¦ðŸ‡º',badge:'sprout',online:true, last:'Thank you for that voicelog ðŸ¤',          time:'5h',       unread:0},
  {name:'Mira K.',  av:'M',col:'#c49a4a',flag:'ðŸ‡¯ðŸ‡µ',badge:'tree',  online:false,last:'Same. I hope tomorrow is easier.',        time:'Yesterday',unread:2},
  {name:'Nora V.',  av:'N',col:'#c49a7a',flag:'ðŸ‡°ðŸ‡·',badge:'leaf',  online:false,last:'Thank you for listening',                 time:'Yesterday',unread:0},
];

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// REFLECT TAB â€” MOOD-MATCHED JOURNAL PROMPTS
//
// 8 moods Ã— 8 prompts each = 64 prompts total.
// Free users get 1 prompt/day (today's index).
// Premium users can cycle through all 8 for their mood.
//
// getMoodPrompt(mood, index) â€” returns one prompt object
// getTodayPromptIndex() â€” returns today's date-seeded index (0â€“7)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const MOOD_PROMPTS = {
  Happy: [
    { q: "What made today feel light?",                         follow: "Try to name the exact moment it shifted." },
    { q: "Who deserves your gratitude right now?",              follow: "What would you say if you told them?" },
    { q: "What simple thing brought you joy today?",            follow: "Why do you think that particular thing?" },
    { q: "What are you looking forward to this week?",          follow: "What would make it even better?" },
    { q: "Describe your happiness today as a place.",           follow: "What does it look like? What's the weather?" },
    { q: "What felt easy today that used to feel hard?",        follow: "Notice how far you've come." },
    { q: "What's something you want to remember about today?",  follow: "Write it in enough detail that future-you can feel it." },
    { q: "Who or what is making your life better right now?",   follow: "Have you told them?" },
  ],
  Sad: [
    { q: "What are you grieving right now, even if it seems small?",     follow: "Small losses are still losses." },
    { q: "Where in your body does the sadness live?",                    follow: "Describe the sensation without judging it." },
    { q: "What do you wish someone would say to you right now?",         follow: "Can you say it to yourself?" },
    { q: "What's one thing that felt heavy today?",                      follow: "You don't have to fix it â€” just name it." },
    { q: "Write a letter to your sadness as if it were a visitor.",      follow: "What does it need from you?" },
    { q: "What's the kindest thing you could do for yourself tonight?",  follow: "Is there anything stopping you?" },
    { q: "What would you tell a friend who felt exactly as you do now?", follow: "You deserve that too." },
    { q: "What memory brings you warmth when things feel cold?",         follow: "Sit with it for a moment." },
  ],
  Anxious: [
    { q: "What is the worst thing you're imagining right now?",           follow: "Is it certain, or is it fear?" },
    { q: "What's actually in your control today?",                        follow: "Write only that list. Nothing else." },
    { q: "When did the anxiety start? Was there a trigger?",              follow: "Naming it takes some of its power." },
    { q: "What does your anxiety want to protect you from?",              follow: "Is that threat real, or a story?" },
    { q: "What would 'good enough' look like today?",                     follow: "Not perfect. Just good enough." },
    { q: "Write down every worry. Then mark each: real or imagined.",     follow: "How many were real?" },
    { q: "What's one thing you can do in the next five minutes?",         follow: "Small actions break the loop." },
    { q: "Who in your life makes you feel safer?",                        follow: "Could you reach out to them tonight?" },
  ],
  Peaceful: [
    { q: "What brought you to this quiet place?",                        follow: "What had to settle for peace to arrive?" },
    { q: "Describe exactly where you are right now â€” all five senses.",  follow: "Peace lives in the details." },
    { q: "What does this peace feel like in your chest?",                follow: "Try to hold onto the description." },
    { q: "What are you grateful for in this stillness?",                 follow: "Let the list be long." },
    { q: "What truth becomes clearer when the noise is gone?",           follow: "What has the quiet been trying to tell you?" },
    { q: "What does a peaceful future version of you look like?",        follow: "What does she/he/they do differently?" },
    { q: "What would you lose if you stayed in this feeling forever?",   follow: "Sometimes peace asks us to examine comfort." },
    { q: "What good thing happened recently that you haven't honoured?", follow: "Write it down. It deserves space." },
  ],
  Frustrated: [
    { q: "What are you most frustrated with right now â€” be specific.",        follow: "Vague frustration festers. Name it exactly." },
    { q: "Is this frustration about today, or does it go deeper?",            follow: "What's the older story underneath it?" },
    { q: "What do you wish had gone differently?",                            follow: "What was in your control? What wasn't?" },
    { q: "Write a letter you'll never send to whoever or whatever frustrated you.", follow: "Don't edit. Let it out." },
    { q: "What does your frustration need â€” to be heard, or to act?",         follow: "Which one are you avoiding?" },
    { q: "What boundary is being crossed that's causing this feeling?",       follow: "Is it yours to enforce?" },
    { q: "What would you say if you knew there were no consequences?",        follow: "You don't have to send it. Just write it." },
    { q: "What's one thing about this situation you can actually change?",    follow: "Start there." },
  ],
  Lonely: [
    { q: "What kind of connection are you missing right now?",               follow: "Physical presence, being understood, or something else?" },
    { q: "Write about a time you felt truly seen by someone.",               follow: "What made it feel that way?" },
    { q: "Who haven't you reached out to in too long?",                      follow: "What's stopping you?" },
    { q: "What does your loneliness want you to know?",                      follow: "Listen to it like a message, not a flaw." },
    { q: "Describe the person you most want to talk to right now.",          follow: "What would you say?" },
    { q: "Are you lonely for others, or lonely for a version of yourself?",  follow: "Both are real. Which is it tonight?" },
    { q: "What would you do tonight if loneliness weren't a factor?",        follow: "Can you do any part of that alone?" },
    { q: "Write a note to yourself from someone who loves you.",             follow: "What would they want you to hear?" },
  ],
  Tired: [
    { q: "What kind of tired are you â€” body, mind, or soul?",              follow: "They need different things." },
    { q: "What have you been carrying that you weren't built to carry?",   follow: "Is any of it yours to put down?" },
    { q: "When did you last feel truly rested?",                           follow: "What was different then?" },
    { q: "What's draining you most right now?",                            follow: "Is it a person, a situation, or a thought pattern?" },
    { q: "What would you do tomorrow if rest was the only goal?",          follow: "Could you allow yourself even part of that?" },
    { q: "What are you exhausted of pretending?",                          follow: "You don't have to pretend here." },
    { q: "If your tiredness could speak, what would it ask for?",          follow: "Can you give it even a fraction of that?" },
    { q: "What's one thing you can release tonight â€” just for tonight?",   follow: "It will still be there tomorrow if you need it." },
  ],
  Excited: [
    { q: "What are you excited about? Write it without holding back.",     follow: "Let the enthusiasm take up space." },
    { q: "What's driving this feeling â€” hope, anticipation, or something new?", follow: "Trace it to its root." },
    { q: "Who would you most want to share this excitement with?",         follow: "Have you told them yet?" },
    { q: "What's the best possible version of what you're excited about?", follow: "Describe it fully." },
    { q: "What would make you even more excited about this?",              follow: "What small step could you take today?" },
    { q: "What fear lives underneath the excitement?",                     follow: "Both can be true at the same time." },
    { q: "Write a letter to yourself for the day this comes true.",        follow: "What do you want to remember feeling right now?" },
    { q: "What does this excitement tell you about what you actually want?", follow: "Listen to it â€” it knows things." },
  ],
};

// Returns a prompt for a mood by index. Index wraps around (0â€“7).
function getMoodPrompt(mood, index = 0) {
  const prompts = MOOD_PROMPTS[mood];
  if (!prompts) return null;
  return prompts[index % prompts.length];
}

// Returns today's date-seeded prompt index (0â€“7).
// Same index all day so the prompt feels intentional, not random.
function getTodayPromptIndex() {
  const d = new Date();
  return (d.getFullYear() * 365 + d.getMonth() * 31 + d.getDate()) % 8;
}

// â”€â”€ COUNTRIES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const COUNTRIES = [
  'ðŸŒ Worldwide','ðŸ‡µðŸ‡­ Philippines','ðŸ‡¸ðŸ‡¬ Singapore','ðŸ‡²ðŸ‡¾ Malaysia',
  'ðŸ‡®ðŸ‡© Indonesia','ðŸ‡»ðŸ‡³ Vietnam','ðŸ‡¯ðŸ‡µ Japan','ðŸ‡°ðŸ‡· South Korea',
  'ðŸ‡¦ðŸ‡º Australia','ðŸ‡ºðŸ‡¸ United States','ðŸ‡¬ðŸ‡§ United Kingdom','ðŸ‡®ðŸ‡³ India',
];

// â”€â”€ ALTERME â€” ENCOUNTER DATA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Expanded seed pool â€” matching algorithm picks top 3
const ENCOUNTER_SEEDS = [
  {id:'e1',name:'Anonymous Leaf',  av:'?',col:'#5dbf8a',flag:'ðŸ‡µðŸ‡­',gender:'female',   genderIcon:'â™€',badge:'leaf',
    moods:['Peaceful','Tired','Sad'],
    themes:['quiet','evening','silence','rest','alone'],
    excerpt:'"I sat with the silence for a long time. It didn\'t feel empty anymore."'},
  {id:'e2',name:'Anonymous Sprout',av:'?',col:'#7fa3b5',flag:'ðŸ‡¯ðŸ‡µ',gender:'male',     genderIcon:'â™‚',badge:'sprout',
    moods:['Peaceful','Happy','Tired'],
    themes:['rain','window','soft','gentle','night'],
    excerpt:'"The rain sounded like someone tapping gently on a window, asking to come in."'},
  {id:'e3',name:'Anonymous Grove', av:'?',col:'#c49a4a',flag:'ðŸ‡°ðŸ‡·',gender:'nonbinary',genderIcon:'âš§',badge:'tree',
    moods:['Lonely','Sad','Anxious'],
    themes:['lonely','alone','exist','nobody','company'],
    excerpt:'"I don\'t need company. I just need someone to know I exist tonight."'},
  {id:'e4',name:'Anonymous Elder', av:'?',col:'#c49a7a',flag:'ðŸ‡¸ðŸ‡¬',gender:'female',   genderIcon:'â™€',badge:'pine',
    moods:['Anxious','Frustrated','Overwhelmed'],
    themes:['overwhelmed','heavy','carrying','weight','tired'],
    excerpt:'"Some days I wonder if carrying this much is just what life feels like now."'},
  {id:'e5',name:'Anonymous Sprout',av:'?',col:'#7a6a9a',flag:'ðŸ‡²ðŸ‡¾',gender:'male',     genderIcon:'â™‚',badge:'sprout',
    moods:['Excited','Happy','Peaceful'],
    themes:['hope','tomorrow','better','light','forward'],
    excerpt:'"I don\'t know what\'s coming. But tonight, for the first time in a while, I\'m okay with that."'},
  {id:'e6',name:'Anonymous Leaf',  av:'?',col:'#a07ac8',flag:'ðŸ‡®ðŸ‡©',gender:'nonbinary',genderIcon:'âš§',badge:'leaf',
    moods:['Sad','Lonely','Tired'],
    themes:['miss','loss','grief','gone','remember'],
    excerpt:'"I keep reaching for my phone to tell them something, then remembering."'},
];

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// ENCOUNTER MATCHING ALGORITHM
// Scores each seed against the user's current mood and
// any text they've written (diary / tonight prompt).
// Returns top 3 seeds sorted by match score descending.
//
// Scoring:
//   +30  exact mood match
//   +10  per theme keyword found in userText
//   +5   same country flag
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function matchEncounters(userMood = '', userText = '', userFlag = '') {
  const txt = (userText || '').toLowerCase();

  const scored = ENCOUNTER_SEEDS.map(seed => {
    let score = 0;

    // Mood match
    if (userMood && seed.moods.includes(userMood)) score += 30;

    // Theme keyword match
    seed.themes.forEach(kw => { if (txt.includes(kw)) score += 10; });

    // Same country bonus
    if (userFlag && seed.flag === userFlag) score += 5;

    // Small random variance so results feel organic, not mechanical
    score += Math.random() * 8;

    return { ...seed, score };
  });

  // Sort descending, return top 3
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => ({
      ...s,
      // Generate a human-readable match reason
      reason: s.moods.includes(userMood)
        ? `You both logged "${userMood}" tonight`
        : s.score > 20
        ? 'Similar feelings in your writing tonight'
        : 'Both online and open to connection',
    }));
}

// â”€â”€ ALTERME â€” LIMBO DAILY CONTENT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Daily counts: Flash Cards=5, Emoji Polls=3, Mind Benders=2, Alter Humor=5
const LIMBO_FLASH_CARDS = [
  {id:'fc1',q:"What's one feeling you've been carrying this week that you haven't named yet?",a:"Sometimes naming a feeling is the first step to setting it down. Take a breath. What is it?"},
  {id:'fc2',q:"When did you last feel completely like yourself?",a:"Not performing. Not adjusting. Just fully, quietly you. What were you doing?"},
  {id:'fc3',q:"What's something you're pretending is fine?",a:"We all carry things we tell ourselves don't matter. But they do. What's yours?"},
  {id:'fc4',q:"If your current mood were weather, what would it look like outside right now?",a:"A storm? A grey drizzle? Unexpected sunshine breaking through? Sit with that image."},
  {id:'fc5',q:"What's one small thing that made today bearable?",a:"Even the hardest days have something. It might be tiny. That's okay. It still counts."},
];

// Returns the correct number of flash cards based on premium status.
// Free: 2 cards. Premium: all 5.
// Use this instead of LIMBO_FLASH_CARDS directly when rendering.
function getLimboFlashCards(isPremium) {
  const limit = isPremium ? LIMBO_FLASH_CARDS.length : PREMIUM_FEATURES.limbo_full.freeLimit;
  return {
    cards:   LIMBO_FLASH_CARDS.slice(0, limit),
    locked:  LIMBO_FLASH_CARDS.slice(limit),
    isGated: !isPremium && LIMBO_FLASH_CARDS.length > limit,
  };
}

const LIMBO_EMOJI_POLLS = [
  {id:'ep1',q:"How did today actually feel, not how you said it felt?",opts:[{e:'ðŸ˜®â€ðŸ’¨',l:'Exhausted',v:34},{e:'ðŸ˜Œ',l:'Okay',v:21},{e:'ðŸ¥º',l:'Tender',v:18},{e:'ðŸ˜¤',l:'Frustrated',v:12}]},
  {id:'ep2',q:"What do you need most right now?",opts:[{e:'ðŸ¤«',l:'Silence',v:45},{e:'ðŸ¤—',l:'A hug',v:38},{e:'ðŸ˜´',l:'Rest',v:29},{e:'âœï¸',l:'To write',v:22}]},
  {id:'ep3',q:"Which feeling lives in your chest tonight?",opts:[{e:'ðŸ’™',l:'Longing',v:51},{e:'ðŸŒ«ï¸',l:'Numb',v:27},{e:'ðŸŒ±',l:'Hopeful',v:33},{e:'ðŸ”¥',l:'Restless',v:19}]},
];

const LIMBO_MIND_BENDERS = [
  {id:'mb1',q:"If the version of you from five years ago could see you now â€” what would surprise them most?",a:"Not the big things. The small ones. The way you've learned to be gentle with yourself, or the way you haven't."},
  {id:'mb2',q:"Is the life you're living the one you chose, or the one that happened while you were waiting?",a:"Most lives are a mix. The question isn't which one â€” it's whether you're awake to the difference."},
];

// Returns mind benders for premium users only.
// MUST be declared after LIMBO_MIND_BENDERS above.
function getLimboMindBenders(isPremium) {
  return isPremium ? LIMBO_MIND_BENDERS : [];
}

const LIMBO_ALTER_HUMOR = [
  {id:'ah1',emoji:'ðŸ˜¶â€ðŸŒ«ï¸',setup:"Me: I should journal my feelings.\nAlso me at 2am:",punchline:"*opens journal* *writes 'I don't know'* *closes journal* *achieves enlightenment*"},
  {id:'ah2',emoji:'ðŸŒ±',setup:"My therapist: And how does that make you feel?\nMe:",punchline:"*opens AlterZen* *selects all 8 moods simultaneously* *submits*"},
  {id:'ah3',emoji:'ðŸŒ™',setup:"Normal people before bed: reads a book, drinks tea, sleeps.",punchline:"Me: *re-reads every diary entry I've written since 2019 to find out where it all went wrong*"},
  {id:'ah4',emoji:'ðŸ¥º',setup:"Stages of journaling:\n1. I'll write just one entry\n2. I'll write a quick entry\n3.",punchline:"Day 847. The pen has become an extension of my soul. I have forgotten what silence feels like."},
  {id:'ah5',emoji:'ðŸ˜Œ',setup:"Me: I'm fine.\nMy Open Book followers reading entry #34:",punchline:"\"they are NOT fine and haven't been since March 2024\""},
];

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// FIX 1 â€” CRISIS DETECTION KEYWORDS
// Used by: Sanctuary (Aria chat), Limbo comments, any user text input
// Import and call isCrisisText(str) before processing user messages
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CRISIS_KEYWORDS = [
  'want to die','wanna die','kill myself','end my life','suicide','suicidal',
  'self harm','self-harm','cut myself','hurt myself','not worth living',
  "can't go on",'cannot go on','give up on life','no reason to live',
  'better off dead','nobody would miss me','disappear forever','overdose',
];

function isCrisisText(text) {
  const t = (text || '').toLowerCase();
  // Uses CRISIS_KEYWORDS_EXTENDED â€” includes EN, Filipino, Japanese, Korean
  return CRISIS_KEYWORDS_EXTENDED.some(kw => t.includes(kw));
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// CRISIS RESOURCES â€” mapped by country flag prefix
// getCrisisResources(country) returns 2â€“3 local lines
// + always appends the global Befrienders fallback
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CRISIS_BY_COUNTRY = {
  'ðŸ‡µðŸ‡­': [
    { icon:'ðŸ“ž', name:'Hopeline Philippines',          detail:'Call / text 2919 (free, 24/7)' },
    { icon:'ðŸ“ž', name:'iCare (In Touch)',               detail:'(02) 8893-7603 Â· Manila-based' },
    { icon:'ðŸ’¬', name:'NCMH Crisis Hotline',            detail:'1553 Â· National Center for Mental Health' },
  ],
  'ðŸ‡ºðŸ‡¸': [
    { icon:'ðŸ“ž', name:'988 Suicide & Crisis Lifeline',  detail:'Call or text 988 Â· 24/7' },
    { icon:'ðŸ’¬', name:'Crisis Text Line',               detail:'Text HOME to 741741' },
  ],
  'ðŸ‡¬ðŸ‡§': [
    { icon:'ðŸ“ž', name:'Samaritans',                     detail:'116 123 Â· free, 24/7' },
    { icon:'ðŸ’¬', name:'Crisis Text Line UK',            detail:'Text SHOUT to 85258' },
  ],
  'ðŸ‡¦ðŸ‡º': [
    { icon:'ðŸ“ž', name:'Lifeline Australia',             detail:'13 11 14 Â· 24/7' },
    { icon:'ðŸ’¬', name:'Beyond Blue',                    detail:'1300 22 4636 Â· chat at beyondblue.org.au' },
  ],
  'ðŸ‡¯ðŸ‡µ': [
    { icon:'ðŸ“ž', name:'ã„ã®ã¡ã®é›»è©± (Inochi no Denwa)',  detail:'0120-783-556 Â· free, 24/7' },
    { icon:'ðŸ“ž', name:'ã‚ˆã‚Šãã„ãƒ›ãƒƒãƒˆãƒ©ã‚¤ãƒ³',            detail:'0120-279-338 Â· 24/7' },
  ],
  'ðŸ‡°ðŸ‡·': [
    { icon:'ðŸ“ž', name:'ìžì‚´ì˜ˆë°©ìƒë‹´ì „í™”',               detail:'1393 Â· 24/7 (Suicide Prevention Hotline)' },
    { icon:'ðŸ“ž', name:'ì •ì‹ ê±´ê°• ìœ„ê¸°ìƒë‹´ì „í™”',           detail:'1577-0199 Â· 24/7' },
  ],
  'ðŸ‡¸ðŸ‡¬': [
    { icon:'ðŸ“ž', name:'Samaritans of Singapore (SOS)',  detail:'1-767 Â· 24/7' },
    { icon:'ðŸ’¬', name:'IMH Emergency',                  detail:'6389-2222 Â· Institute of Mental Health' },
  ],
  'ðŸ‡²ðŸ‡¾': [
    { icon:'ðŸ“ž', name:'Befrienders KL',                 detail:'03-7627 2929 Â· 24/7' },
    { icon:'ðŸ“ž', name:'MIASA Helpline',                 detail:'03-2780 6803' },
  ],
  'ðŸ‡®ðŸ‡©': [
    { icon:'ðŸ“ž', name:'Into The Light Indonesia',       detail:'119 ext 8 Â· 24/7' },
    { icon:'ðŸ“ž', name:'Yayasan Pulih',                  detail:'(021) 788-42580' },
  ],
  'ðŸ‡»ðŸ‡³': [
    { icon:'ðŸ“ž', name:'ÄÆ°á»ng dÃ¢y há»— trá»£ sá»©c khá»e tÃ¢m tháº§n', detail:'1800 599 920 Â· free' },
  ],
  'ðŸ‡®ðŸ‡³': [
    { icon:'ðŸ“ž', name:'iCall',                          detail:'9152987821 Â· Monâ€“Sat 8amâ€“10pm' },
    { icon:'ðŸ“ž', name:'Vandrevala Foundation',          detail:'1860-2662-345 Â· 24/7' },
  ],
};

const CRISIS_GLOBAL_FALLBACK = [
  { icon:'ðŸŒ', name:'Befrienders Worldwide',            detail:'befrienders.org â€” find support in your language' },
  { icon:'ðŸ“ž', name:'IASP Crisis Centres',              detail:'iasp.info/resources/Crisis_Centres/' },
];

// Returns localised resources for the user's country + global fallback
function getCrisisResources(country = '') {
  const flag = (country || '').split(' ')[0]; // e.g. 'ðŸ‡µðŸ‡­'
  const local = CRISIS_BY_COUNTRY[flag] ?? [];
  // Deduplicate: if local already has 3 entries, skip global to avoid clutter
  const extras = local.length >= 3 ? [CRISIS_GLOBAL_FALLBACK[0]] : CRISIS_GLOBAL_FALLBACK;
  return [...local, ...extras];
}

// Legacy static export kept for backward compat
const CRISIS_RESOURCES = CRISIS_GLOBAL_FALLBACK;

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// FIX 2 â€” ONBOARDING SLIDES DATA
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ONBOARDING_SLIDES = [
  {
    art:'ðŸ““',
    eyebrow:'WELCOME TO ALTERZEN',
    heading:'A quiet place to be honest with yourself',
    body:'Write diaries. Share stories. Log your voice. AlterZen is built for the feelings you haven\'t found words for yet.',
  },
  {
    art:'ðŸŒŠ',
    eyebrow:'ENCOUNTER',
    heading:'Meet someone who felt what you felt tonight',
    body:'Anonymous, gentle connections. When two people write about the same feeling, AlterZen quietly introduces them.',
  },
  {
    art:'ðŸŒ¿',
    eyebrow:'LIMBO',
    heading:'Where the strange and soft things live',
    body:'Flash Cards. Mind Benders. Emoji Polls. Open Book diaries. Daily prompts designed to move something inside you.',
  },
  {
    art:'â˜½',
    eyebrow:'ARIA Â· YOUR SANCTUARY',
    heading:'A safe space that listens without judgment',
    body:'Aria is here whenever you need to say something out loud. Your Sanctuary is always open, always quiet.',
  },
];

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// FIX 5 â€” OPEN BOOK PRIVACY OPTIONS
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PRIVACY_OPTIONS = [
  { key:'pub', icon:'ðŸŒ¿', name:'Public',         desc:'Anyone on AlterZen can follow and read' },
  { key:'fol', icon:'ðŸŒ±', name:'Followers only', desc:'Only people who follow you can read' },
  { key:'prv', icon:'ðŸªµ', name:'Private',        desc:'Only you â€” not listed in Open Book' },
];

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// OPEN BOOK â€” DIARY THEMES
// Free users get the default forest theme only.
// Premium users unlock all 5 themes.
// Each theme defines a background, text, and accent colour.
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const OPEN_BOOK_THEMES = [
  { id:'forest',  name:'Forest',    premium:false, bg:'#0f1b2d', txt:'#a8c4e2', accent:'#5a7a8a', bord:'#1c3050', icon:'ðŸŒ²' },
  { id:'embers',  name:'Embers',    premium:true,  bg:'#1a0e0a', txt:'#e2b898', accent:'#a0785a', bord:'#3a1e10', icon:'ðŸ”¥' },
  { id:'twilight',name:'Twilight',  premium:true,  bg:'#0d0a1a', txt:'#c8a8f4', accent:'#7a5a9a', bord:'#1e1030', icon:'ðŸŒ™' },
  { id:'mist',    name:'Mist',      premium:true,  bg:'#0e1a1a', txt:'#b8d8d8', accent:'#4a7a7a', bord:'#1a3a3a', icon:'ðŸŒ«ï¸' },
  { id:'blossom', name:'Blossom',   premium:true,  bg:'#1a0e14', txt:'#f4a8c8', accent:'#8a4a6a', bord:'#3a1a28', icon:'ðŸŒ¸' },
];

// Returns available themes for the user.
// Free: only the default 'forest' theme.
// Premium: all themes.
function getAvailableThemes(isPremium) {
  if (isPremium) return OPEN_BOOK_THEMES;
  return OPEN_BOOK_THEMES.filter(t => !t.premium);
}

// Returns the current active theme object (defaults to forest).
function getActiveTheme(themeId = 'forest', isPremium = false) {
  const available = getAvailableThemes(isPremium);
  return available.find(t => t.id === themeId) ?? OPEN_BOOK_THEMES[0];
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// MULTILINGUAL CRISIS KEYWORDS (EN + Filipino + Japanese + Korean)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CRISIS_KEYWORDS_EXTENDED = [
  'want to die','wanna die','kill myself','end my life','suicide','suicidal',
  'self harm','self-harm','cut myself','hurt myself','not worth living',
  "can't go on",'cannot go on','give up on life','no reason to live',
  'better off dead','nobody would miss me','disappear forever','overdose',
  'gusto ko mamatay','gustong mamatay','patayin ang sarili','magpakamatay',
  'wala nang dahilan para mabuhay','ayaw ko nang mabuhay','sawa na sa buhay',
  'gusto kong mawala','hindi ko na kaya','saktan ang sarili',
  'æ­»ã«ãŸã„','è‡ªæ®º','æ¶ˆãˆãŸã„','æ¶ˆãˆã¦ã—ã¾ã„ãŸã„','æ­»ã‚“ã§ã—ã¾ã„ãŸã„',
  'ã‚‚ã†ç”ŸããŸããªã„','è‡ªåˆ†ã‚’å‚·ã¤ã‘','å¸Œæ­»å¿µæ…®',
  'ì£½ê³  ì‹¶ì–´','ìžì‚´','ì‚¬ë¼ì§€ê³  ì‹¶ì–´','ì‚´ê¸° ì‹«ì–´','ìŠ¤ìŠ¤ë¡œë¥¼ í•´ì¹˜','ì£½ì–´ë²„ë¦¬ê³  ì‹¶ì–´',
  'ë” ì´ìƒ ì‚´ê³  ì‹¶ì§€ ì•Šì•„','ì—†ì–´ì§€ê³  ì‹¶ì–´',
];

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// REP / BADGE TIER SYSTEM
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const REP_TIERS = [
  { key:'sprout', icon:'ðŸŒ±', label:'Sprout', range:'0â€“200',   min:0,    max:199,      next:'Leaf'  },
  { key:'leaf',   icon:'ðŸƒ', label:'Leaf',   range:'200â€“500', min:200,  max:499,      next:'Grove' },
  { key:'tree',   icon:'ðŸŒ³', label:'Grove',  range:'500â€“1k',  min:500,  max:999,      next:'Elder' },
  { key:'pine',   icon:'ðŸŽ„', label:'Elder',  range:'1000+',   min:1000, max:Infinity, next:null    },
  { key:'clover', icon:'â˜˜ï¸', label:'Premium',range:'Premium', min:null, max:null,     next:null    },
];

const REP_ACTIONS = {
  post_diary:    { pts:15, label:'ðŸ““ Diary posted'        },
  post_story:    { pts:10, label:'ðŸ“¸ Story posted'        },
  post_voicelog: { pts:20, label:'ðŸŽ™ Voicelog posted'     },
  comment:       { pts:5,  label:'ðŸ’¬ Comment posted'      },
  reaction:      { pts:2,  label:'â¤ï¸ Reaction given'      },
  ob_follow:     { pts:3,  label:'ðŸ“– Followed a diary'    },
  encounter:     { pts:8,  label:'ðŸŒŠ Encounter connected' },
  daily_login:   { pts:5,  label:'â˜€ï¸ Daily login'         },
};
// Mood persistence key â€” stores { mood, date } so HomeScreen restores today's mood
// and matchEncounters can read it from anywhere
const MOOD_STORAGE_KEY = 'az_daily_mood';


// â”€â”€â”€ PART 2: COMPONENTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// ALTERZEN â€” PART 2: COMPONENTS
// BadgeIcon Â· AvatarView Â· PostTypeBadge Â· ReactionBar
// DiaryCard Â· StoryCard Â· VoicelogCard Â· PostCard
// ProfileSheet Â· PremiumGate Â· DisclaimerBar
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// PREMIUM GATE COMPONENT
// Wraps any screen section behind a premium paywall.
// Usage:
//   <PremiumGate featureKey="limbo_full" isPremium={userStats.isPremium}>
//     {/* actual content */}
//   </PremiumGate>
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function PremiumGate({ featureKey, isPremium, children }) {
  if (isPremium) return <>{children}</>;
  const f = PREMIUM_FEATURES[featureKey];
  if (!f || f.freeLimit > 0) return <>{children}</>; // partially free â€” don't gate
  return (
    <View style={pg.wrap}>
      <Text style={pg.icon}>{f.icon}</Text>
      <Text style={pg.title}>{f.label}</Text>
      <Text style={pg.desc}>{f.desc}</Text>
      <TouchableOpacity style={pg.btn} activeOpacity={0.85}>
        <Text style={pg.btnTxt}>Unlock with Premium â˜˜ï¸</Text>
      </TouchableOpacity>
    </View>
  );
}

const pg = StyleSheet.create({
  wrap:  { backgroundColor:T.card, borderWidth:1, borderColor:T.bord, borderRadius:14, padding:20, alignItems:'center', margin:4, marginBottom:12 },
  icon:  { fontSize:28, marginBottom:8 },
  title: { fontSize:14, fontWeight:'700', color:T.txt, marginBottom:5 },
  desc:  { fontSize:12, color:T.muted, textAlign:'center', lineHeight:18, marginBottom:14 },
  btn:   { backgroundColor:T.brown, borderRadius:22, paddingHorizontal:22, paddingVertical:9 },
  btnTxt:{ fontSize:12, color:'#fff', fontWeight:'700' },
});

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// DISCLAIMER BAR â€” horoscope screen only
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function DisclaimerBar() {
  return (
    <View style={db.wrap}>
      <Text style={db.txt}>âœ¨  Horoscope readings are for entertainment and reflection only. They are not predictions, medical advice, or professional guidance.</Text>
    </View>
  );
}

const db = StyleSheet.create({
  wrap: { backgroundColor:T.surf, borderTopWidth:1, borderColor:T.bord, paddingHorizontal:14, paddingVertical:9 },
  txt:  { fontSize:10, color:T.muted, lineHeight:15 },
});

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// BADGE ICON
// Shows badge emoji icon next to username.
// All tiers are now emoji â€” no SVG dependency required.
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function BadgeIcon({ badge, size = 14 }) {
  if (!badge || !BADGES[badge]) return null;
  return (
    <Text style={{ fontSize: size, lineHeight: size + 2, marginLeft: 3 }}>
      {BADGES[badge].icon}
    </Text>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// AVATAR VIEW
// Circle with coloured initial + country flag overlay (lower-right).
// No badge on avatar â€” badge lives next to the name only.
// Tapping opens the user's profile sheet.
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function AvatarView({ user, onPress, size = 38 }) {
  const fs = Math.round(size * 0.38);
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75} style={{ position:'relative', width:size+8, height:size+4 }}>
      <View style={[cs.av, { width:size, height:size, borderRadius:size/2, backgroundColor:user.col+'33', borderColor:user.col+'88' }]}>
        <Text style={{ fontSize:fs, color:user.col, fontWeight:'700' }}>{user.av}</Text>
      </View>
      {/* Country flag â€” lower-right of avatar */}
      <Text style={cs.avFlag}>{user.flag}</Text>
    </TouchableOpacity>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// POST TYPE BADGE  (icon only: ðŸ““ ðŸ“¸ ðŸŽ™)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const POST_TYPE = {
  diary:    { icon:'ðŸ““', color:'#a0785a' },
  story:    { icon:'ðŸ“¸', color:'#c49a4a' },
  voicelog: { icon:'ðŸŽ™', color:'#5a7a8a' },
};
function PostTypeBadge({ type }) {
  const m = POST_TYPE[type] ?? POST_TYPE.diary;
  return (
    <View style={[cs.typeBadge, { borderColor:m.color+'44', backgroundColor:m.color+'18' }]}>
      <Text style={{ fontSize:10, color:m.color }}>{m.icon}</Text>
    </View>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// CARD HEADER  (shared)
// Layout: Avatar | Name + BadgeIcon + TypeBadge / Date
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function CardHeader({ post, onAvatarPress }) {
  return (
    <View style={cs.cardHdr}>
      <AvatarView user={post} onPress={onAvatarPress} />
      <View style={{ flex:1, marginLeft:9 }}>
        <View style={cs.nameRow}>
          <Text style={cs.cname}>{post.user}</Text>
          <BadgeIcon badge={post.badge} />        {/* icon only */}
          <PostTypeBadge type={post.type} />
        </View>
        <Text style={cs.cdate}>{post.date}</Text>
      </View>
    </View>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// REACTION BAR
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ReactionBar({ postId, reactions, comments, tapped, onTap }) {
  return (
    <View style={cs.rxRow}>
      <View style={cs.rxBtns}>
        {Object.entries(reactions).map(([emoji, count]) => {
          const on = !!tapped[postId + emoji];
          return (
            <TouchableOpacity key={emoji} style={[cs.rxBtn, on && cs.rxBtnOn]} onPress={() => onTap(postId, emoji)} activeOpacity={0.75}>
              <Text style={{ fontSize:12 }}>{emoji}</Text>
              <Text style={[cs.rxCount, on && cs.rxCountOn]}>{on ? count+1 : count}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={cs.cmtTxt}>ðŸ’¬ {comments}</Text>
    </View>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// DIARY CARD
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function DiaryCard({ post, tappedRxns, onTap, onAvatarPress }) {
  const LINE_H   = 24;
  const [lineCount, setLineCount] = useState(
    // Safe initial estimate: avg ~55 chars per line at 13.5px serif on 320px body
    Math.max(3, Math.ceil(post.text.length / 55) + 1)
  );

  // Recalculate once the Text block is actually measured on screen
  const handleTextLayout = (e) => {
    const measured = Math.ceil(e.nativeEvent.layout.height / LINE_H) + 1;
    if (measured !== lineCount) setLineCount(measured);
  };
  return (
    <View style={cs.diaryCard}>
      {/* Header */}
      <View style={cs.diaryHdr}>
        <AvatarView user={post} onPress={onAvatarPress} />
        <View style={{ flex:1, marginLeft:9 }}>
          <View style={cs.nameRow}>
            <Text style={cs.dcName}>{post.user}</Text>
            <BadgeIcon badge={post.badge} />
            <PostTypeBadge type={post.type} />
          </View>
          <Text style={cs.dcDate}>{post.date}</Text>
        </View>
      </View>

      {/* Thin divider â€” above body only */}
      <View style={cs.dcDivider} />

      {/* Body: ruled lines sit ONLY behind the text content */}
      <View style={cs.dcBody}>
        {Array.from({ length: lineCount }, (_, i) => (
          <View key={i} style={[cs.rline, { top: (i + 1) * LINE_H }]} />
        ))}
        <Text style={cs.dcTxt} onLayout={handleTextLayout}>{post.text}</Text>
      </View>

      {/* Footer â€” completely clean, no lines, no dividers */}
      <View style={cs.dcFooter}>
        <ReactionBar postId={post.id} reactions={post.reactions} comments={post.comments} tapped={tappedRxns} onTap={onTap} />
      </View>
    </View>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// STORY CARD
// Renders a seeded gradient scene when storyScene is present.
// Falls back to a clean placeholder when no scene data exists.
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function StoryCard({ post, tappedRxns, onTap, onAvatarPress }) {
  const scene = post.storyScene;
  return (
    <View style={cs.storyCard}>
      <CardHeader post={post} onAvatarPress={onAvatarPress} />

      {/* Seeded scene photo â€” gradient + emoji + caption */}
      {scene ? (
        <View style={[cs.sceneBox, { backgroundColor: scene.gradient[0] }]}>
          {/* Layered gradient simulation using opacity strips */}
          <View style={[cs.sceneLayer, { backgroundColor: scene.gradient[1], opacity:0.55, top:'30%' }]} />
          <View style={[cs.sceneLayer, { backgroundColor: scene.gradient[2], opacity:0.35, top:'60%' }]} />
          <View style={cs.sceneContent}>
            <Text style={{ fontSize:38, marginBottom:6 }}>{scene.emoji}</Text>
            <Text style={cs.sceneLabel}>{scene.label}</Text>
            <View style={cs.sceneCaptionRow}>
              <Text style={cs.sceneCaption}>{scene.caption}</Text>
            </View>
          </View>
          {/* "Photo" tag top-right */}
          <View style={cs.sceneTag}>
            <Text style={cs.sceneTagTxt}>ðŸ“¸ Story</Text>
          </View>
        </View>
      ) : (
        <View style={cs.photoPh}>
          <Text style={{ fontSize:28 }}>ðŸ“¸</Text>
          <Text style={cs.photoLbl}>Photo</Text>
        </View>
      )}

      <Text style={cs.cbody}>{post.text}</Text>
      <ReactionBar postId={post.id} reactions={post.reactions} comments={post.comments} tapped={tappedRxns} onTap={onTap} />
    </View>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// VOICELOG CARD
// Uses post.waveform array for a unique waveform per post.
// Simulates play/pause state with animated progress bar.
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function VoicelogCard({ post, tappedRxns, onTap, onAvatarPress }) {
  const [playing,  setPlaying]  = useState(false);
  const [progress, setProgress] = useState(0); // 0â€“1
  const timerRef = useRef(null);

  // Seeded waveform â€” fall back to generic if not present
  const waveform = post.waveform ?? [4,7,5,9,6,8,4,7,5,6,4,8,6,5,7];
  const totalSecs = post.durationSecs ?? 90;

  const togglePlay = () => {
    if (playing) {
      clearInterval(timerRef.current);
      setPlaying(false);
    } else {
      setPlaying(true);
      const step = 1 / (totalSecs * 10); // update 10x/sec
      timerRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 1) {
            clearInterval(timerRef.current);
            setPlaying(false);
            return 0;
          }
          return p + step;
        });
      }, 100);
    }
  };

  // Cleanup on unmount
  useEffect(() => () => clearInterval(timerRef.current), []);

  // Format seconds as M:SS
  const fmt = (secs) => `${Math.floor(secs/60)}:${String(Math.floor(secs%60)).padStart(2,'0')}`;
  const elapsed = fmt(progress * totalSecs);

  // How many bars are "played" based on progress
  const playedBars = Math.floor(progress * waveform.length);

  return (
    <View style={cs.voiceCard}>
      <CardHeader post={post} onAvatarPress={onAvatarPress} />
      <Text style={cs.cbodyItalic}>{post.title ?? 'Voicelog'}</Text>
      <View style={cs.vbar}>
        {/* Play / Pause button */}
        <TouchableOpacity style={cs.playBtn} onPress={togglePlay} activeOpacity={0.8}>
          <Text style={{ fontSize:9, color:'#fff' }}>{playing ? 'â¸' : 'â–¶'}</Text>
        </TouchableOpacity>

        {/* Seeded waveform bars â€” played bars brighter */}
        {waveform.map((h, i) => (
          <View key={i} style={[
            cs.waveBar,
            { height: h * 2.5, opacity: i <= playedBars ? 0.95 : 0.28 },
            i <= playedBars && { backgroundColor: T.tealS },
          ]} />
        ))}

        {/* Elapsed / total */}
        <Text style={cs.durTxt}>{playing ? elapsed : post.duration ?? '0:00'}</Text>
      </View>

      {/* Progress bar */}
      <View style={cs.progressTrack}>
        <View style={[cs.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <ReactionBar postId={post.id} reactions={post.reactions} comments={post.comments} tapped={tappedRxns} onTap={onTap} />
    </View>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// POST CARD  (dispatcher)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function PostCard({ post, tappedRxns, onTap, onAvatarPress }) {
  const p = { post, tappedRxns, onTap, onAvatarPress };
  if (post.type === 'diary')    return <DiaryCard    {...p} />;
  if (post.type === 'story')    return <StoryCard    {...p} />;
  if (post.type === 'voicelog') return <VoicelogCard {...p} />;
  return null;
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// REP BAR
// Progress bar showing current tier + all 5 tier icons below.
// Matches the screenshot design: tier name + pts on top row,
// green gradient bar, then icon + range labels beneath.
// Usage: <RepBar rep={user.rep} />
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function RepBar({ rep = 0 }) {
  const tierKey  = getBadgeTier(rep, false);
  const tierInfo = BADGES[tierKey];

  // Progress % within the current rep tier (capped at 100)
  const repTiers = REP_TIERS.filter(t => t.min !== null); // exclude Premium
  const curr     = repTiers.find(t => t.key === tierKey) ?? repTiers[0];
  const next     = repTiers[repTiers.indexOf(curr) + 1];
  const pct      = next
    ? Math.min(100, ((rep - curr.min) / (next.min - curr.min)) * 100)
    : 100; // Elder tier = always full

  return (
    <View style={rb.wrap}>
      {/* Top row: current tier name + pts */}
      <View style={rb.topRow}>
        <Text style={rb.tierName}>
          {tierInfo.icon}{'  '}{tierInfo.label}
        </Text>
        <Text style={rb.pts}>{rep} pts</Text>
      </View>

      {/* Progress bar */}
      <View style={rb.track}>
        <View style={[rb.fill, { width: `${pct}%` }]} />
      </View>

      {/* Tier icons row */}
      <View style={rb.tiersRow}>
        {REP_TIERS.map(t => {
          const reached = t.min === null || rep >= t.min;
          const active  = t.key === tierKey;
          return (
            <View key={t.key} style={rb.tierItem}>
              <Text style={[rb.tierIcon, active && rb.tierIconActive]}>
                {t.icon}
              </Text>
              <Text style={[rb.tierRange, active && rb.tierRangeActive]}>
                {t.range}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const rb = StyleSheet.create({
  wrap:           { backgroundColor:'#0e1a2a', borderWidth:1, borderColor:'#1e3040', borderRadius:16, padding:16, marginHorizontal:20, marginBottom:16 },
  topRow:         { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:12 },
  tierName:       { fontSize:16, fontWeight:'700', color:T.txt },
  pts:            { fontSize:14, fontWeight:'700', color:T.tealS },
  track:          { height:10, backgroundColor:'#1e3040', borderRadius:99, overflow:'hidden', marginBottom:14 },
  fill:           { height:'100%', borderRadius:99, backgroundColor:'#5dbf8a',
                    // Gradient approximated with a solid â€” LinearGradient needs expo-linear-gradient
                    // Swap the backgroundColor line below if you add that dep:
                    // background: 'linear-gradient(90deg, #5dbf8a, #7fd4a0)'
                  },
  tiersRow:       { flexDirection:'row', justifyContent:'space-between' },
  tierItem:       { alignItems:'center', gap:4, flex:1 },
  tierIcon:       { fontSize:22, opacity:0.35 },
  tierIconActive: { opacity:1 },
  tierRange:      { fontSize:9, color:T.muted, fontWeight:'400' },
  tierRangeActive:{ color:'#7fd4a0', fontWeight:'700' },
});

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// PROFILE SHEET  (bottom sheet on avatar tap)
// Shows badge emoji + badge tier name as subtitle
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ProfileSheet({ user, visible, onClose }) {
  if (!user) return null;
  const badgeInfo = user.badge ? BADGES[user.badge] : null;
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={{ flex:1 }} activeOpacity={1} onPress={onClose} />
      <View style={cs.profileSheet}>
        <View style={cs.sheetHandle} />
        <View style={cs.profileTop}>
          <View style={{ position:'relative' }}>
            <View style={[cs.profileAv, { backgroundColor:(user.col||'#a0785a')+'33', borderColor:(user.col||'#a0785a')+'88' }]}>
              <Text style={{ fontSize:28, color:user.col||'#a0785a', fontWeight:'700' }}>{user.av}</Text>
            </View>
            <Text style={cs.profileFlag}>{user.flag}</Text>
          </View>
          <View style={{ flex:1, marginLeft:14 }}>
            <View style={{ flexDirection:'row', alignItems:'center', gap:6, flexWrap:'wrap' }}>
              <Text style={cs.profileName}>{user.user || user.name}</Text>
              {badgeInfo && <BadgeIcon badge={user.badge} size={18} />}
            </View>
            <Text style={cs.profileHandle}>
              @{(user.user||user.name).toLowerCase().replace(/[^a-z]/g,'')} Â· {badgeInfo?.label ?? 'Member'}
            </Text>
          </View>
        </View>

        {/* Rep progress bar */}
        <RepBar rep={user.rep ?? user.reputation ?? 0} />

        {/* Stats */}
        <View style={cs.profileStats}>
          {[
            [String(user.posts                          ?? 'â€”'), 'POSTS'  ],
            [String(user.rep ?? user.reputation         ?? 'â€”'), 'REP'    ],
            [String(user.friends                        ?? 'â€”'), 'FRIENDS'],
          ].map(([n,l]) => (
            <View key={l} style={cs.statBox}>
              <Text style={cs.statNum}>{n}</Text>
              <Text style={cs.statLbl}>{l}</Text>
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={cs.profileActions}>
          <TouchableOpacity style={cs.followBtn}><Text style={cs.followBtnTxt}>Follow</Text></TouchableOpacity>
          <TouchableOpacity style={cs.closeBtn} onPress={onClose}><Text style={cs.closeBtnTxt}>Close</Text></TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// â”€â”€ COMPONENT STYLES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const cs = StyleSheet.create({
  // Avatar
  av:            { alignItems:'center', justifyContent:'center', borderWidth:1.5 },
  avFlag:        { position:'absolute', bottom:-2, right:-5, fontSize:12, lineHeight:14 },
  // Name row
  nameRow:       { flexDirection:'row', alignItems:'center', flexWrap:'wrap', gap:4 },
  cname:         { fontSize:13, fontWeight:'700', color:T.txt },
  cdate:         { fontSize:10, color:T.muted, marginTop:1 },
  // Card header
  cardHdr:       { flexDirection:'row', alignItems:'center', marginBottom:10 },
  // Type badge
  typeBadge:     { borderRadius:5, borderWidth:1, paddingHorizontal:4, paddingVertical:2 },
  // Reactions
  rxRow:         { flexDirection:'row', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:5 },
  rxBtns:        { flexDirection:'row', gap:6 },
  rxBtn:         { flexDirection:'row', alignItems:'center', gap:3, backgroundColor:T.surf, borderWidth:1, borderColor:T.bord, borderRadius:20, paddingHorizontal:8, paddingVertical:4 },
  rxBtnOn:       { backgroundColor:T.brown+'22', borderColor:T.brown+'66' },
  rxCount:       { fontSize:11, color:T.muted },
  rxCountOn:     { color:T.brownS },
  cmtTxt:        { fontSize:11, color:T.muted },
  // Diary
  diaryCard:     { backgroundColor:'#0f1b2d', borderRadius:14, borderWidth:1, borderColor:'#1c3050', borderLeftWidth:3, borderLeftColor:T.brown, marginBottom:11, overflow:'hidden' },
  diaryHdr:      { flexDirection:'row', alignItems:'center', padding:12 },
  dcName:        { fontSize:13, fontWeight:'700', color:'#b8d0ee' },
  dcDate:        { fontSize:10, color:'#4a6a9a', fontStyle:'italic', marginTop:1 },
  dcDivider:     { height:1, backgroundColor:'#1c305088', marginHorizontal:14 },
  dcBody:        { position:'relative', marginHorizontal:14, marginTop:9, marginBottom:11 },
  rline:         { position:'absolute', left:-2, right:-2, height:1, backgroundColor:'#1c3050', opacity:0.5 },
  dcTxt:         { fontFamily:'serif', fontStyle:'italic', fontSize:13.5, lineHeight:24, color:'#a8c4e2', position:'relative', zIndex:1, paddingVertical:3 },
  dcFooter:      { paddingHorizontal:14, paddingBottom:11 },
  // Story
  storyCard:     { backgroundColor:T.card, borderRadius:14, borderWidth:1, borderColor:T.bord, borderLeftWidth:3, borderLeftColor:T.gold, padding:13, marginBottom:11 },
  photoPh:       { borderRadius:10, height:128, backgroundColor:T.surf, borderWidth:1, borderColor:T.bord, alignItems:'center', justifyContent:'center', marginBottom:10 },
  photoLbl:      { fontSize:10, color:T.muted, marginTop:4 },
  // Seeded story scene
  sceneBox:      { borderRadius:12, height:148, overflow:'hidden', marginBottom:10, position:'relative' },
  sceneLayer:    { position:'absolute', left:0, right:0, bottom:0, height:'60%', borderRadius:12 },
  sceneContent:  { flex:1, alignItems:'center', justifyContent:'center', padding:14 },
  sceneLabel:    { fontSize:13, fontWeight:'700', color:'rgba(255,255,255,0.9)', marginBottom:4 },
  sceneCaptionRow:{ backgroundColor:'rgba(0,0,0,0.3)', borderRadius:8, paddingHorizontal:10, paddingVertical:3 },
  sceneCaption:  { fontSize:10, color:'rgba(255,255,255,0.7)', fontStyle:'italic' },
  sceneTag:      { position:'absolute', top:8, right:8, backgroundColor:'rgba(0,0,0,0.45)', borderRadius:8, paddingHorizontal:7, paddingVertical:3 },
  sceneTagTxt:   { fontSize:9, color:'rgba(255,255,255,0.8)', fontWeight:'700' },
  // Voicelog progress bar
  progressTrack: { height:2, backgroundColor:T.bord, borderRadius:1, marginHorizontal:0, marginBottom:10 },
  progressFill:  { height:2, backgroundColor:T.teal, borderRadius:1 },
  cbody:         { fontFamily:'serif', fontSize:13.5, lineHeight:22, color:T.txt, marginBottom:10 },
  // Voice
  voiceCard:     { backgroundColor:T.card, borderRadius:14, borderWidth:1, borderColor:T.bord, borderLeftWidth:3, borderLeftColor:T.teal, padding:13, marginBottom:11 },
  cbodyItalic:   { fontFamily:'serif', fontStyle:'italic', fontSize:13.5, lineHeight:22, color:T.txt, marginBottom:10 },
  vbar:          { flexDirection:'row', alignItems:'center', gap:4, backgroundColor:T.teal+'1a', borderRadius:20, paddingHorizontal:10, paddingVertical:7, marginBottom:10 },
  playBtn:       { width:22, height:22, borderRadius:11, backgroundColor:T.teal, alignItems:'center', justifyContent:'center' },
  waveBar:       { width:2.5, borderRadius:2, backgroundColor:T.teal },
  durTxt:        { fontSize:11, color:T.muted, marginLeft:3 },
  // Profile sheet
  profileSheet:  { backgroundColor:'#0b1520', borderTopLeftRadius:24, borderTopRightRadius:24, borderWidth:1, borderColor:T.bord, borderBottomWidth:0, paddingBottom:40 },
  sheetHandle:   { width:40, height:4, backgroundColor:T.bord, borderRadius:2, alignSelf:'center', marginTop:14, marginBottom:16 },
  profileTop:    { flexDirection:'row', alignItems:'center', paddingHorizontal:20, paddingBottom:18 },
  profileAv:     { width:72, height:72, borderRadius:36, borderWidth:2, alignItems:'center', justifyContent:'center' },
  profileFlag:   { position:'absolute', bottom:-2, right:-5, fontSize:14 },
  profileName:   { fontSize:18, fontWeight:'700', color:T.txt },
  profileHandle: { fontSize:12, color:T.muted, marginTop:3 },
  profileStats:  { flexDirection:'row', gap:10, paddingHorizontal:20, marginBottom:18 },
  statBox:       { flex:1, backgroundColor:T.surf, borderWidth:1, borderColor:T.bord, borderRadius:12, padding:10, alignItems:'center' },
  statNum:       { fontSize:16, fontWeight:'700', color:T.txt },
  statLbl:       { fontSize:9, color:T.muted, fontWeight:'700', letterSpacing:0.8, marginTop:2 },
  profileActions:{ flexDirection:'row', gap:10, paddingHorizontal:20 },
  followBtn:     { flex:1, backgroundColor:T.brown, borderRadius:12, paddingVertical:11, alignItems:'center' },
  followBtnTxt:  { fontSize:13, color:'#fff', fontWeight:'700' },
  closeBtn:      { flex:1, backgroundColor:T.surf, borderWidth:1, borderColor:T.bord, borderRadius:12, paddingVertical:11, alignItems:'center' },
  closeBtnTxt:   { fontSize:13, color:T.txt, fontWeight:'600' },
});


// â”€â”€â”€ PART 3: SCREENS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// ALTERZEN â€” PART 3: SCREENS
// HomeScreen Â· ChatScreen Â· ReflectScreen Â· HoroscopeScreen
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// ASYNC STORAGE KEY
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const REACTIONS_KEY = 'az_tapped_reactions';

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// HOME SCREEN
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function HomeScreen() {
  const [feedTab,    setFeedTab]    = useState(0);
  const [filter,     setFilter]     = useState('all');
  const [country,    setCountry]    = useState('ðŸŒ Worldwide');
  const [mood,       setMood]       = useState(null);
  const [tappedRxns, setTappedRxns] = useState({});
  const [typeDDOpen, setTypeDDOpen] = useState(false);
  const [cDDOpen,    setCDDOpen]    = useState(false);
  const [profUser,   setProfUser]   = useState(null);
  const [encounters, setEncounters] = useState([]); // matched encounters from mood

  // â”€â”€ Load persisted reactions on mount â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    AsyncStorage.getItem(REACTIONS_KEY)
      .then(raw => { if (raw) setTappedRxns(JSON.parse(raw)); })
      .catch(() => {});
  }, []);

  // â”€â”€ Load today's saved mood on mount â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    AsyncStorage.getItem(MOOD_STORAGE_KEY)
      .then(raw => {
        if (!raw) return;
        const { mood: saved, date } = JSON.parse(raw);
        const today = new Date().toISOString().slice(0, 10);
        // FIX 5: restore mood â€” the useEffect below will populate encounters
        if (date === today && saved) setMood(saved);
      })
      .catch(() => {});
  }, []);

  // FIX 4: selectMood only toggles state â€” no side effects inside the updater.
  // All side-effects (encounters, persistence) live in the useEffect below.
  const selectMood = useCallback((label) => {
    setMood(prev => (prev === label ? null : label));
  }, []);

  // â”€â”€ Sync encounters + persist whenever mood changes â”€â”€â”€â”€â”€
  // Runs on mount restore AND on every user tap â€” single source of truth.
  useEffect(() => {
    if (mood) {
      setEncounters(matchEncounters(mood, '', userStats.country));
      const today = new Date().toISOString().slice(0, 10);
      AsyncStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify({ mood, date: today })).catch(() => {});
    } else {
      setEncounters([]);
      AsyncStorage.removeItem(MOOD_STORAGE_KEY).catch(() => {});
    }
  }, [mood]);

  // â”€â”€ Persist reactions on every change â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const tapRxn = useCallback((pid, e) => {
    setTappedRxns(prev => {
      const next = { ...prev, [pid+e]: !prev[pid+e] };
      AsyncStorage.setItem(REACTIONS_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const TABS     = ['Friends','Following','Discover'];
  const KEYS     = ['friends','following','discover'];
  const FILTERS  = [{id:'all',lbl:'All'},{id:'diary',lbl:'ðŸ““ Diary'},{id:'story',lbl:'ðŸ“¸ Story'},{id:'voicelog',lbl:'ðŸŽ™ Voicelog'}];
  const FLT_ICON = {all:'â–¾',diary:'ðŸ““',story:'ðŸ“¸',voicelog:'ðŸŽ™'};

  const todayQ = TONIGHT_PROMPTS[new Date().getDay() % TONIGHT_PROMPTS.length];
  let posts = SAMPLE_POSTS[KEYS[feedTab]] ?? [];
  if (filter !== 'all') posts = posts.filter(p => p.type === filter);

  return (
    <View style={{ flex:1, backgroundColor:T.bg }}>
      {/* â”€â”€ Feed tab strip â”€â”€ */}
      <View style={ss.tabRow}>
        <View style={ss.tabPill}>
          {TABS.map((lbl,i) => (
            <TouchableOpacity key={lbl} style={[ss.ftab, feedTab===i && ss.ftabOn]}
              onPress={() => { setFeedTab(i); setFilter('all'); setTypeDDOpen(false); setCDDOpen(false); }}>
              <Text style={[ss.ftabTxt, feedTab===i && ss.ftabTxtOn]}>{lbl}</Text>
            </TouchableOpacity>
          ))}
          <View style={ss.tsep} />
          {/* Type filter */}
          <TouchableOpacity
            style={[ss.fltBtn, filter!=='all' && ss.fltBtnOn, typeDDOpen && filter==='all' && ss.fltBtnOpen]}
            onPress={() => { setTypeDDOpen(p=>!p); setCDDOpen(false); }}>
            <Text style={{ fontSize:18, color: filter!=='all' ? '#fff' : T.muted }}>{FLT_ICON[filter]??'â–¾'}</Text>
            {filter !== 'all' && <View style={ss.filterDot} />}
          </TouchableOpacity>
          <View style={ss.tsep} />
          {/* Country filter */}
          <TouchableOpacity
            style={[ss.glbBtn, country!=='ðŸŒ Worldwide' && ss.glbBtnOn]}
            onPress={() => { setCDDOpen(p=>!p); setTypeDDOpen(false); }}>
            <Text style={{ fontSize:15 }}>{country==='ðŸŒ Worldwide' ? 'ðŸŒ' : country.split(' ')[0]}</Text>
            {country !== 'ðŸŒ Worldwide' && <View style={ss.glbDot} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* Type dropdown */}
      {typeDDOpen && (
        <View style={ss.dropdown}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap:8, padding:12 }}>
            {FILTERS.map(f => (
              <TouchableOpacity key={f.id} style={[ss.tpill, filter===f.id && ss.tpillOn]}
                onPress={() => { setFilter(f.id); setTypeDDOpen(false); }}>
                <Text style={[ss.tpillTxt, filter===f.id && { color:'#fff', fontWeight:'700' }]}>{f.lbl}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Country dropdown */}
      {cDDOpen && (
        <View style={[ss.dropdown, { maxHeight:240 }]}>
          <ScrollView>
            {COUNTRIES.map(c => (
              <TouchableOpacity key={c} style={[ss.citem, country===c && ss.citemSel]}
                onPress={() => { setCountry(c); setCDDOpen(false); }}>
                <Text style={[ss.citemTxt, country===c && { color:T.brownS, fontWeight:'600' }]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Feed */}
      <ScrollView style={{ flex:1 }} contentContainerStyle={{ padding:14, paddingBottom:110 }}>
        {/* Tonight's Thought */}
        <View style={ss.tonight}>
          <Text style={ss.eyebrow}>ðŸ”¥ TONIGHT'S THOUGHT</Text>
          <Text style={ss.tonightQ}>"{todayQ}"</Text>
          <TouchableOpacity style={ss.tonightBtn}>
            <Text style={ss.tonightBtnTxt}>Write about this ðŸ““</Text>
          </TouchableOpacity>
        </View>

        {/* Mood picker */}
        <View style={ss.moodCard}>
          <Text style={ss.secLbl}>HOW ARE YOU FEELING?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap:8 }}>
            {MOODS.map(m => (
              <TouchableOpacity key={m.label} style={[ss.moodBtn, mood===m.label && ss.moodBtnOn]}
                onPress={() => selectMood(m.label)}>
                <Text style={{ fontSize:20 }}>{m.emoji}</Text>
                <Text style={[ss.moodLbl, mood===m.label && { color:T.brownS }]}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Encounter preview â€” appears after mood is selected */}
        {mood && encounters.length > 0 && (
          <View style={ss.encounterPreview}>
            <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:2 }}>
              <Text style={ss.encounterEyebrow}>ðŸŒŠ ENCOUNTER â€” PEOPLE WHO FEEL LIKE YOU</Text>
              {/* Filter button â€” Premium only */}
              {canUse('encounter_filter') ? (
                <TouchableOpacity style={{ paddingHorizontal:9, paddingVertical:4, backgroundColor:T.encounterAccent+'22', borderRadius:10, borderWidth:1, borderColor:T.encounterAccent+'55' }}>
                  <Text style={{ fontSize:9, color:T.tealS, fontWeight:'700' }}>Filter â–¾</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={{ paddingHorizontal:9, paddingVertical:4, backgroundColor:T.aria+'15', borderRadius:10, borderWidth:1, borderColor:T.aria+'33' }}>
                  <Text style={{ fontSize:9, color:T.ariaS, fontWeight:'700' }}>Filter â˜˜ï¸</Text>
                </TouchableOpacity>
              )}
            </View>
            {encounters.map(e => (
              <View key={e.id} style={ss.encounterRow}>
                <View style={[ss.encounterAv, { backgroundColor: e.col+'33', borderColor: e.col+'88' }]}>
                  <Text style={{ fontSize:14, color:e.col, fontWeight:'700' }}>?</Text>
                </View>
                <View style={{ flex:1, marginLeft:10 }}>
                  <View style={{ flexDirection:'row', alignItems:'center', gap:6 }}>
                    <Text style={ss.encounterName}>{e.name}</Text>
                    <Text style={{ fontSize:11 }}>{e.flag}</Text>
                    <Text style={{ fontSize:11, color: e.gender==='female' ? T.genderFemale : e.gender==='male' ? T.genderMale : T.genderNonbinary }}>{e.genderIcon}</Text>
                  </View>
                  <Text style={ss.encounterReason}>{e.reason}</Text>
                  <Text style={ss.encounterExcerpt}>{e.excerpt}</Text>
                </View>
                <TouchableOpacity style={ss.encounterBtn}>
                  <Text style={ss.encounterBtnTxt}>Connect</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Posts */}
        {posts.length === 0
          ? <View style={{ alignItems:'center', paddingVertical:48 }}><Text style={{ fontSize:36, marginBottom:10 }}>ðŸŒ™</Text><Text style={{ color:T.muted }}>No posts found</Text></View>
          : posts.map(p => <PostCard key={p.id} post={p} tappedRxns={tappedRxns} onTap={tapRxn} onAvatarPress={() => setProfUser(p)} />)
        }
      </ScrollView>

      <ProfileSheet user={profUser} visible={!!profUser} onClose={() => setProfUser(null)} />
    </View>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// CHAT SCREEN  â€” DM list, Aria pinned at top
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ChatScreen() {
  const [profUser, setProfUser] = useState(null);

  return (
    <View style={{ flex:1, backgroundColor:T.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom:110 }}>

        {/* DM list */}
        <Text style={ss.dmDivider}>MESSAGES</Text>
        {SAMPLE_DMS.map((dm, i) => (
          <TouchableOpacity key={i} style={ss.dmItem} activeOpacity={0.8}
            onPress={() => setProfUser({ ...dm, user:dm.name })}>
            <View style={{ position:'relative' }}>
              <View style={[ss.dmAv, { backgroundColor:dm.col+'33', borderColor:dm.col+'88' }]}>
                <Text style={{ fontSize:16, color:dm.col, fontWeight:'700' }}>{dm.av}</Text>
              </View>
              <Text style={ss.dmFlag}>{dm.flag}</Text>
              {dm.online && <View style={ss.dmOnline} />}
            </View>
            <View style={{ flex:1, marginLeft:11, minWidth:0 }}>
              <View style={{ flexDirection:'row', alignItems:'center', gap:5 }}>
                <Text style={ss.dmName}>{dm.name}</Text>
                {dm.badge && BADGES[dm.badge] && (
                  <Text style={{ fontSize:13 }}>{BADGES[dm.badge].icon}</Text>
                )}
              </View>
              <Text style={ss.dmLast} numberOfLines={1}>{dm.last}</Text>
            </View>
            <View style={ss.dmMeta}>
              <Text style={ss.dmTime}>{dm.time}</Text>
              {dm.unread > 0 && <View style={ss.dmUnread}><Text style={ss.dmUnreadTxt}>{dm.unread}</Text></View>}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ProfileSheet user={profUser} visible={!!profUser} onClose={() => setProfUser(null)} />
    </View>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// REFLECT SCREEN
// Daily emotional ritual â€” replaces Sanctuary/Aria.
// Layout:
//   1. Mood-matched journal prompt (top card)
//   2. Limbo Flash Cards (daily reflection)
//   3. Limbo Emoji Poll (community mood)
//   4. Mind Bender (premium) + Alter Humor
//
// Premium gate: free users get today's 1 prompt only.
//   Premium unlocks all 8 prompts for their mood.
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ReflectScreen({ mood }) {
  const isPremium    = userStats.isPremium;
  const todayIndex   = getTodayPromptIndex();
  const [promptIdx,  setPromptIdx]  = useState(todayIndex);
  const [pollVoted,  setPollVoted]  = useState(null); // voted option id
  const [flashIdx,   setFlashIdx]   = useState(0);    // current flash card
  const [flipped,    setFlipped]    = useState(false); // card flipped?
  const [writingFor, setWritingFor] = useState(null);  // prompt q being written
  const [draft,      setDraft]      = useState('');

  const activeMood   = mood || 'Peaceful';
  const prompt       = getMoodPrompt(activeMood, promptIdx);
  const { cards: flashCards, locked: flashLocked, isGated } = getLimboFlashCards(isPremium);
  const mindBenders  = getLimboMindBenders(isPremium);
  const poll         = LIMBO_EMOJI_POLLS[0]; // today's poll
  const humor        = LIMBO_ALTER_HUMOR[todayIndex % LIMBO_ALTER_HUMOR.length];

  const canCyclePrompts = isPremium;
  const totalPrompts    = MOOD_PROMPTS[activeMood]?.length ?? 8;

  function nextPrompt() {
    setPromptIdx(i => (i + 1) % totalPrompts);
    setWritingFor(null);
    setDraft('');
  }
  function prevPrompt() {
    setPromptIdx(i => (i - 1 + totalPrompts) % totalPrompts);
    setWritingFor(null);
    setDraft('');
  }

  return (
    <ScrollView style={{ flex:1, backgroundColor:T.bg }}
      contentContainerStyle={{ padding:14, paddingBottom:110 }}>

      {/* â”€â”€ Header â”€â”€ */}
      <View style={ss.rfHdr}>
        <Text style={ss.rfTitle}>Reflect ðŸŒ¿</Text>
        <Text style={ss.rfSub}>
          {mood ? `You're feeling ${mood.toLowerCase()} today` : 'Log a mood to get a personal prompt'}
        </Text>
      </View>

      {/* â”€â”€ Mood-matched prompt card â”€â”€ */}
      {prompt ? (
        <View style={ss.promptCard}>
          {/* Prompt counter + cycle controls */}
          <View style={ss.promptNav}>
            <Text style={ss.promptMood}>{activeMood}</Text>
            <View style={{ flexDirection:'row', alignItems:'center', gap:8 }}>
              {canCyclePrompts && (
                <TouchableOpacity onPress={prevPrompt} style={ss.promptNavBtn}>
                  <Text style={ss.promptNavTxt}>â€¹</Text>
                </TouchableOpacity>
              )}
              <Text style={ss.promptCount}>
                {canCyclePrompts ? `${promptIdx + 1} / ${totalPrompts}` : 'Today\'s prompt'}
              </Text>
              {canCyclePrompts && (
                <TouchableOpacity onPress={nextPrompt} style={ss.promptNavBtn}>
                  <Text style={ss.promptNavTxt}>â€º</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* The question */}
          <Text style={ss.promptQ}>{prompt.q}</Text>
          <Text style={ss.promptFollow}>{prompt.follow}</Text>

          {/* Write / Done toggle */}
          {writingFor === prompt.q ? (
            <View style={ss.promptWriteBox}>
              <TextInput
                style={ss.promptInput}
                value={draft}
                onChangeText={setDraft}
                placeholder="Write freely â€” this stays with youâ€¦"
                placeholderTextColor={T.muted}
                multiline
                autoFocus
              />
              <TouchableOpacity style={ss.promptDoneBtn} onPress={() => { setWritingFor(null); setDraft(''); }}>
                <Text style={ss.promptDoneTxt}>Done âœ“</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={ss.promptWriteBtn} onPress={() => setWritingFor(prompt.q)}>
              <Text style={ss.promptWriteBtnTxt}>âœï¸  Write about this</Text>
            </TouchableOpacity>
          )}

          {/* Premium upsell if free */}
          {!canCyclePrompts && (
            <View style={ss.promptGate}>
              <Text style={ss.promptGateTxt}>
                ðŸŒ¿  <Text style={{ color:T.mint, fontWeight:'700' }}>Premium</Text> unlocks all 8 prompts for your mood
              </Text>
            </View>
          )}
        </View>
      ) : (
        /* No mood selected yet */
        <View style={ss.promptEmpty}>
          <Text style={ss.promptEmptyIcon}>ðŸƒ</Text>
          <Text style={ss.promptEmptyTxt}>Log how you're feeling on the Home tab to unlock your personal prompt.</Text>
        </View>
      )}

      {/* â”€â”€ Flash Cards â”€â”€ */}
      <Text style={ss.rfSection}>Daily Reflection</Text>
      {flashCards.length > 0 && (
        <View style={ss.flashCard}>
          <Text style={ss.flashQ}>{flashCards[flashIdx].q}</Text>
          {flipped && (
            <View style={ss.flashAnswer}>
              <Text style={ss.flashA}>{flashCards[flashIdx].a}</Text>
            </View>
          )}
          <View style={ss.flashRow}>
            <TouchableOpacity style={ss.flashBtn} onPress={() => setFlipped(f => !f)}>
              <Text style={ss.flashBtnTxt}>{flipped ? 'Hide reflection' : 'Show reflection'}</Text>
            </TouchableOpacity>
            {flashCards.length > 1 && (
              <TouchableOpacity style={ss.flashNextBtn}
                onPress={() => { setFlashIdx(i => (i + 1) % flashCards.length); setFlipped(false); }}>
                <Text style={ss.flashBtnTxt}>Next â†’</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={ss.flashCount}>{flashIdx + 1} / {flashCards.length}</Text>
        </View>
      )}
      {isGated && (
        <View style={ss.limboGate}>
          <Text style={ss.limboGateTxt}>ðŸ”’  {flashLocked.length} more cards in Premium</Text>
        </View>
      )}

      {/* â”€â”€ Emoji Poll â”€â”€ */}
      <Text style={ss.rfSection}>How is everyone feeling tonight?</Text>
      <View style={ss.pollCard}>
        <Text style={ss.pollQ}>{poll.q}</Text>
        <View style={ss.pollRow}>
          {poll.opts.map(opt => (
            <TouchableOpacity
              key={opt.l}
              style={[ss.pollOpt, pollVoted === opt.l && ss.pollOptActive]}
              onPress={() => setPollVoted(opt.l)}
              activeOpacity={0.8}>
              <Text style={ss.pollEmoji}>{opt.e}</Text>
              <Text style={ss.pollLabel}>{opt.l}</Text>
              {pollVoted && (
                <Text style={ss.pollVotes}>{pollVoted === opt.l ? opt.v + 1 : opt.v}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* â”€â”€ Mind Bender (premium only) â”€â”€ */}
      {mindBenders.length > 0 && (
        <>
          <Text style={ss.rfSection}>Mind Bender âœ¦</Text>
          <View style={ss.mbCard}>
            <Text style={ss.mbQ}>{mindBenders[todayIndex % mindBenders.length].q}</Text>
            <Text style={ss.mbA}>{mindBenders[todayIndex % mindBenders.length].a}</Text>
          </View>
        </>
      )}
      {!isPremium && (
        <View style={ss.limboGate}>
          <Text style={ss.limboGateTxt}>ðŸ”’  Mind Benders are Premium-only</Text>
        </View>
      )}

      {/* â”€â”€ Alter Humor â”€â”€ */}
      <Text style={ss.rfSection}>Alter Humor ðŸ˜¶â€ðŸŒ«ï¸</Text>
      <View style={ss.humorCard}>
        <Text style={ss.humorEmoji}>{humor.emoji}</Text>
        <Text style={ss.humorSetup}>{humor.setup}</Text>
        <View style={ss.humorDivider} />
        <Text style={ss.humorPunch}>{humor.punchline}</Text>
      </View>

    </ScrollView>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// HOROSCOPE SCREEN
// Fetches LIVE daily readings from freehoroscopeapi.com
// â€” no API key required, completely free.
// Caches today's readings in AsyncStorage so the API is
// only called ONCE per day per sign (not on every open).
//
// Fallback: if fetch fails, shows static ZODIAC_READINGS
// so the screen never breaks even offline.
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const HOROSCOPE_CACHE_KEY = 'az_horoscope_cache'; // { date:'YYYY-MM-DD', readings:{aries:{...}, ...} }
const HOROSCOPE_API       = 'https://freehoroscopeapi.com/api/v1/get-horoscope/daily?sign=';

// Fetch one sign from the API â€” 8s timeout via AbortController
async function fetchLiveReading(sign) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res  = await fetch(`${HOROSCOPE_API}${sign}`, { signal: controller.signal });
    const json = await res.json();
    return json?.data?.horoscope ?? null;
  } finally {
    clearTimeout(timer);
  }
}

function HoroscopeScreen({ userSign, onClose }) {
  const [selSign,    setSelSign]    = useState(null);
  const [liveText,   setLiveText]   = useState(null);   // today's reading for userSign
  const [gridLive,   setGridLive]   = useState({});     // { aries: "...", taurus: "..." }
  const [loading,    setLoading]    = useState(true);
  const [loadingGrid,setLoadingGrid]= useState(false);

  const z  = ZODIAC_SIGNS.find(s => s.id === userSign) ?? ZODIAC_SIGNS[4];
  const r  = ZODIAC_READINGS[userSign] ?? ZODIAC_READINGS.leo; // static fallback data

  const todayStr = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'

  // â”€â”€ On mount: load user's own sign reading â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    (async () => {
      try {
        // Check cache first
        const raw   = await AsyncStorage.getItem(HOROSCOPE_CACHE_KEY).catch(() => null);
        const cache = raw ? JSON.parse(raw) : {};

        if (cache.date === todayStr && cache.readings?.[userSign]) {
          // Cache hit â€” no network call needed
          setLiveText(cache.readings[userSign]);
          setGridLive(cache.readings);
        } else {
          // Fetch user sign first (fastest visible update)
          const text = await fetchLiveReading(userSign);
          if (text) {
            setLiveText(text);
            // Merge into cache
            const updated = {
              date: todayStr,
              readings: { ...(cache.date === todayStr ? cache.readings : {}), [userSign]: text },
            };
            await AsyncStorage.setItem(HOROSCOPE_CACHE_KEY, JSON.stringify(updated)).catch(() => {});
          }
        }
      } catch (_) {
        // Silently fall back to static reading
      } finally {
        setLoading(false);
      }
    })();
  }, [userSign]);

  // â”€â”€ Lazy-load ALL 12 signs when grid becomes visible â”€â”€â”€â”€
  const fetchAllSigns = useCallback(async () => {
    if (loadingGrid || Object.keys(gridLive).length >= 12) return;
    setLoadingGrid(true);
    try {
      const raw   = await AsyncStorage.getItem(HOROSCOPE_CACHE_KEY).catch(() => null);
      const cache = raw ? JSON.parse(raw) : {};
      if (cache.date === todayStr && Object.keys(cache.readings ?? {}).length >= 12) {
        setGridLive(cache.readings);
        return;
      }
      // Fetch remaining signs (skip ones already cached)
      const existing = cache.date === todayStr ? (cache.readings ?? {}) : {};
      const toFetch  = ZODIAC_SIGNS.map(s => s.id).filter(id => !existing[id]);
      const results  = await Promise.allSettled(
        toFetch.map(async id => ({ id, text: await fetchLiveReading(id) }))
      );
      const fresh = { ...existing };
      results.forEach(r => { if (r.status === 'fulfilled' && r.value.text) fresh[r.value.id] = r.value.text; });
      setGridLive(fresh);
      await AsyncStorage.setItem(HOROSCOPE_CACHE_KEY, JSON.stringify({ date:todayStr, readings:fresh })).catch(() => {});
    } catch (_) {
      // Fall through â€” grid uses static data
    } finally {
      setLoadingGrid(false);
    }
  }, [loadingGrid, gridLive, todayStr]);

  // Reading text: live if available, static fallback otherwise
  const displayText = liveText ?? r.overall;

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor:T.bg, zIndex:850 }]}>
      {/* Header */}
      <View style={ss.hsHdr}>
        <TouchableOpacity style={ss.backBtn} onPress={onClose}>
          <Text style={{ fontSize:18, color:T.txt }}>â†</Text>
        </TouchableOpacity>
        <Text style={ss.hsTitle}>Your Stars âœ¨</Text>
        {/* Live indicator */}
        <View style={ss.livePill}>
          <View style={[ss.liveDot, { backgroundColor: liveText ? T.mint : T.muted }]} />
          <Text style={[ss.liveTxt, { color: liveText ? T.mint : T.muted }]}>
            {loading ? 'Loadingâ€¦' : liveText ? 'Live' : 'Offline'}
          </Text>
        </View>
      </View>

      {/* FIX 6: Disclaimer pinned below header â€” always visible, never buried in scroll */}
      <DisclaimerBar type="horoscope" />

      <ScrollView
        contentContainerStyle={{ padding:14, paddingBottom:40 }}
        onScrollBeginDrag={fetchAllSigns} // load all 12 when user starts scrolling
      >
        {/* â”€â”€ My reading card â”€â”€ */}
        <View style={[ss.myReading, { borderColor:z.elColor+'55' }]}>
          <View style={ss.myTop}>
            <View style={[ss.myCircle, { backgroundColor:z.elColor+'22', borderColor:z.elColor+'77' }]}>
              <Text style={{ fontSize:34, color:z.elColor }}>{z.glyph}</Text>
            </View>
            <View style={{ flex:1, marginLeft:14 }}>
              <Text style={ss.mySignName}>{z.name}</Text>
              <Text style={[ss.myEl, { color:z.elColor }]}>{z.element.toUpperCase()} Â· {z.stone}</Text>
              <Text style={ss.myDates}>{z.dates}</Text>
            </View>
          </View>

          {/* Loading shimmer while fetching */}
          {loading ? (
            <View style={[ss.shimmer, { marginBottom:14 }]}>
              <Text style={{ color:T.muted, fontStyle:'italic', fontSize:13 }}>Consulting the starsâ€¦</Text>
            </View>
          ) : (
            <Text style={ss.myReadingTxt}>"{displayText}"</Text>
          )}

          <View style={ss.myStats}>
            {[['Mood',r.mood],['Energy',r.energy],['Love',r.love],['Career',r.career]].map(([l,v]) => (
              <View key={l} style={ss.mstat}>
                <Text style={ss.mstatL}>{l}</Text>
                <Text style={ss.mstatV}>{v}</Text>
              </View>
            ))}
          </View>
          <View style={ss.myLucky}>
            <View style={[ss.lp, { backgroundColor:z.elColor+'18', borderColor:z.elColor+'44' }]}>
              <Text style={[ss.lpTxt, { color:z.elColor }]}>âœ¨ Lucky #{r.lucky}</Text>
            </View>
            <View style={[ss.lp, { backgroundColor:r.lcolor+'18', borderColor:r.lcolor+'44' }]}>
              <View style={{ width:10, height:10, borderRadius:5, backgroundColor:r.lcolor, marginRight:5 }} />
              <Text style={[ss.lpTxt, { color:'#b8d0f0' }]}>Lucky Color</Text>
            </View>
          </View>
          <View style={[ss.myPrompt, { backgroundColor:z.elColor+'12', borderColor:z.elColor+'33' }]}>
            <Text style={[ss.mpLbl, { color:z.elColor }]}>TODAY'S COSMIC PROMPT</Text>
            {canUse('horoscope_prompt') ? (
              <>
                <Text style={ss.mpTxt}>{r.prompt}</Text>
                <TouchableOpacity style={[ss.mpBtn, { backgroundColor:z.elColor }]}>
                  <Text style={ss.mpBtnTxt}>Write about this âœï¸</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={ss.premiumLock}>
                <Text style={ss.premiumLockIcon}>âœ¨</Text>
                <Text style={ss.premiumLockTitle}>Premium Feature</Text>
                <Text style={ss.premiumLockDesc}>Upgrade to unlock your daily Cosmic Prompt â€” a journaling question crafted for your sign.</Text>
                <TouchableOpacity style={ss.premiumLockBtn}>
                  <Text style={ss.premiumLockBtnTxt}>Unlock with Premium â˜˜ï¸</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* â”€â”€ All 12 signs grid â”€â”€ */}
        <Text style={ss.allSignsLbl}>ALL SIGNS â€” TAP TO EXPLORE</Text>
        {loadingGrid && (
          <Text style={{ color:T.muted, fontSize:11, marginBottom:8, fontStyle:'italic' }}>
            Fetching all readingsâ€¦
          </Text>
        )}
        <View style={ss.signsGrid}>
          {ZODIAC_SIGNS.map(zz => {
            const mine    = zz.id === userSign;
            const open    = selSign?.id === zz.id;
            const sr      = ZODIAC_READINGS[zz.id];
            const liveStr = gridLive[zz.id]; // live text if available

            return (
              <View key={zz.id} style={{ width:'30.5%' }}>
                <TouchableOpacity
                  style={[ss.signCard, mine && { borderColor:zz.elColor, borderWidth:2 }]}
                  onPress={() => {
                    setSelSign(open ? null : zz);
                    if (!open) fetchAllSigns(); // trigger fetch when any sign is tapped
                  }}
                  activeOpacity={0.75}>
                  {mine && (
                    <View style={[ss.mineTag, { backgroundColor:zz.elColor }]}>
                      <Text style={{ fontSize:8, color:'#fff', fontWeight:'700' }}>YOU</Text>
                    </View>
                  )}
                  <Text style={{ fontSize:24, color:zz.elColor }}>{zz.glyph}</Text>
                  <Text style={ss.sgName}>{zz.name}</Text>
                  <Text style={ss.sgDates}>{zz.dates}</Text>
                  <Text style={[ss.sgEl, { color:zz.elColor }]}>{zz.element}</Text>
                </TouchableOpacity>

                {/* Inline detail â€” live text preferred, static fallback */}
                {open && (
                  <View style={[ss.signDetail, { borderColor:zz.elColor+'55' }]}>
                    <Text style={ss.sdReadingTxt}>
                      "{liveStr ?? sr.overall}"
                    </Text>
                    {liveStr && (
                      <Text style={{ fontSize:9, color:T.mint, marginTop:4 }}>âœ¦ Live reading</Text>
                    )}
                    <View style={[ss.myStats, { marginTop:10 }]}>
                      {[['Mood',sr.mood],['Energy',sr.energy],['Love',sr.love],['Career',sr.career]].map(([l,v]) => (
                        <View key={l} style={ss.mstat}>
                          <Text style={ss.mstatL}>{l}</Text>
                          <Text style={ss.mstatV}>{v}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>

      </ScrollView>
    </View>
  );
}

// â”€â”€ SCREEN STYLES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ss = StyleSheet.create({
  // Feed tabs
  tabRow:       { paddingHorizontal:14, paddingBottom:10 },
  tabPill:      { flexDirection:'row', backgroundColor:T.surf, borderRadius:13, padding:4, borderWidth:1, borderColor:T.bord, alignItems:'center' },
  ftab:         { flex:1, paddingVertical:7, borderRadius:9, alignItems:'center' },
  ftabOn:       { backgroundColor:T.brown },
  ftabTxt:      { fontSize:11.5, color:T.muted },
  ftabTxtOn:    { color:'#fff', fontWeight:'700' },
  tsep:         { width:1, height:20, backgroundColor:T.bord, marginHorizontal:1 },
  fltBtn:       { paddingVertical:7, paddingHorizontal:10, borderRadius:9, alignItems:'center', justifyContent:'center', position:'relative' },
  fltBtnOn:     { backgroundColor:T.brown },
  fltBtnOpen:   { backgroundColor:T.surf },
  filterDot:    { position:'absolute', top:4, right:4, width:5, height:5, borderRadius:3, backgroundColor:'#fff' },
  glbBtn:       { paddingVertical:7, paddingHorizontal:9, borderRadius:9, alignItems:'center', justifyContent:'center', position:'relative' },
  glbBtnOn:     { backgroundColor:T.card },
  glbDot:       { position:'absolute', top:4, right:3, width:5, height:5, borderRadius:3, backgroundColor:T.brown },
  dropdown:     { backgroundColor:T.surf, borderBottomWidth:1, borderColor:T.bord },
  tpill:        { paddingHorizontal:14, paddingVertical:6, borderRadius:20, backgroundColor:T.card, borderWidth:1, borderColor:T.bord },
  tpillOn:      { backgroundColor:T.teal, borderColor:T.teal },
  tpillTxt:     { fontSize:12, color:T.muted },
  citem:        { paddingHorizontal:14, paddingVertical:9, borderBottomWidth:1, borderColor:T.bord+'22' },
  citemSel:     { backgroundColor:T.brown+'18' },
  citemTxt:     { fontSize:13, color:T.txt },
  // Tonight
  tonight:      { backgroundColor:T.brown+'18', borderWidth:1, borderColor:T.brown+'55', borderLeftWidth:3, borderLeftColor:T.brown, borderRadius:14, padding:14, marginBottom:11 },
  eyebrow:      { fontSize:9, color:T.brownS, fontWeight:'700', letterSpacing:1.5, marginBottom:5 },
  tonightQ:     { fontFamily:'serif', fontStyle:'italic', fontSize:14, color:T.txt, lineHeight:23, marginBottom:11 },
  tonightBtn:   { backgroundColor:T.brown, borderRadius:10, paddingVertical:9, alignItems:'center' },
  tonightBtnTxt:{ fontSize:12, color:'#fff', fontWeight:'700' },
  // Mood
  moodCard:     { backgroundColor:T.card, borderWidth:1, borderColor:T.bord, borderRadius:14, padding:12, marginBottom:11 },
  secLbl:       { fontSize:9, color:T.muted, fontWeight:'700', letterSpacing:1.2, marginBottom:9 },
  moodBtn:      { alignItems:'center', gap:3, paddingHorizontal:9, paddingVertical:7, borderRadius:10, backgroundColor:T.surf, borderWidth:1, borderColor:T.bord },
  moodBtnOn:    { backgroundColor:T.brown+'33', borderColor:T.brown },
  moodLbl:      { fontSize:9, color:T.muted },
  // Encounter preview (home feed, post mood selection)
  encounterPreview:  { backgroundColor:'#080e18', borderWidth:1, borderColor:T.encounterAccent+'55', borderLeftWidth:3, borderLeftColor:T.encounterAccent, borderRadius:14, padding:13, marginBottom:11 },
  encounterEyebrow:  { fontSize:9, color:T.tealS, fontWeight:'700', letterSpacing:1.2, marginBottom:10 },
  encounterRow:      { flexDirection:'row', alignItems:'flex-start', paddingVertical:9, borderTopWidth:1, borderColor:T.bord+'33' },
  encounterAv:       { width:36, height:36, borderRadius:18, borderWidth:1.5, alignItems:'center', justifyContent:'center', marginTop:2 },
  encounterName:     { fontSize:12, fontWeight:'700', color:T.txt },
  encounterReason:   { fontSize:11, color:T.teal, marginTop:2, marginBottom:4 },
  encounterExcerpt:  { fontFamily:'serif', fontStyle:'italic', fontSize:12, color:T.muted, lineHeight:18 },
  encounterBtn:      { paddingHorizontal:12, paddingVertical:6, borderRadius:20, backgroundColor:T.encounterAccent+'33', borderWidth:1, borderColor:T.encounterAccent+'88', marginLeft:8, marginTop:2 },
  encounterBtnTxt:   { fontSize:11, color:T.tealS, fontWeight:'700' },
  // Premium lock overlay (for gated features)
  premiumLock:       { backgroundColor:T.surf, borderWidth:1, borderColor:T.bord, borderRadius:13, padding:16, alignItems:'center', margin:4 },
  premiumLockIcon:   { fontSize:26, marginBottom:6 },
  premiumLockTitle:  { fontSize:13, fontWeight:'700', color:T.txt, marginBottom:4 },
  premiumLockDesc:   { fontSize:12, color:T.muted, textAlign:'center', lineHeight:18, marginBottom:12 },
  premiumLockBtn:    { backgroundColor:T.brown, borderRadius:20, paddingHorizontal:20, paddingVertical:8 },
  premiumLockBtnTxt: { fontSize:12, color:'#fff', fontWeight:'700' },
  // Chat tab
  dmDivider:    { fontSize:9, color:T.muted, fontWeight:'700', letterSpacing:1.2, paddingHorizontal:14, paddingTop:10, paddingBottom:6 },
  dmItem:       { flexDirection:'row', alignItems:'center', paddingHorizontal:14, paddingVertical:11, borderBottomWidth:1, borderColor:T.bord+'33' },
  dmAv:         { width:42, height:42, borderRadius:21, borderWidth:1.5, alignItems:'center', justifyContent:'center' },
  dmFlag:       { position:'absolute', bottom:-2, right:-5, fontSize:12 },
  dmOnline:     { position:'absolute', bottom:0, right:0, width:9, height:9, borderRadius:5, backgroundColor:T.mint, borderWidth:2, borderColor:T.bg },
  dmName:       { fontSize:13, fontWeight:'700', color:T.txt },
  dmLast:       { fontSize:12, color:T.muted, marginTop:2 },
  dmMeta:       { alignItems:'flex-end', gap:4 },
  dmTime:       { fontSize:10, color:T.muted },
  dmUnread:     { width:18, height:18, borderRadius:9, backgroundColor:T.brown, alignItems:'center', justifyContent:'center' },
  dmUnreadTxt:  { fontSize:10, color:'#fff', fontWeight:'700' },
  // Reflect screen
  rfHdr:        { marginBottom:18 },
  rfTitle:      { fontSize:22, fontWeight:'700', color:T.txt, marginBottom:4 },
  rfSub:        { fontSize:13, color:T.muted },
  rfSection:    { fontSize:10, color:T.muted, fontWeight:'700', letterSpacing:1.2, marginTop:22, marginBottom:10 },
  // Prompt card
  promptCard:   { backgroundColor:T.surf, borderWidth:1, borderColor:T.bord, borderRadius:18, padding:18, marginBottom:4 },
  promptNav:    { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:14 },
  promptMood:   { fontSize:11, color:T.mint, fontWeight:'700', letterSpacing:0.8 },
  promptCount:  { fontSize:11, color:T.muted },
  promptNavBtn: { width:28, height:28, borderRadius:14, backgroundColor:T.bg, alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:T.bord },
  promptNavTxt: { fontSize:16, color:T.txt, lineHeight:22 },
  promptQ:      { fontSize:16, fontWeight:'700', color:T.txt, lineHeight:24, marginBottom:8, fontFamily:'serif', fontStyle:'italic' },
  promptFollow: { fontSize:13, color:T.muted, lineHeight:19, marginBottom:16 },
  promptWriteBtn:    { backgroundColor:T.bg, borderWidth:1, borderColor:T.bord, borderRadius:24, paddingHorizontal:16, paddingVertical:9, alignSelf:'flex-start' },
  promptWriteBtnTxt: { fontSize:13, color:T.txt },
  promptWriteBox:    { backgroundColor:T.bg, borderWidth:1, borderColor:T.bord, borderRadius:14, padding:12, marginBottom:4 },
  promptInput:       { color:T.txt, fontSize:13.5, lineHeight:21, minHeight:80 },
  promptDoneBtn:     { alignSelf:'flex-end', marginTop:8, backgroundColor:T.mint+'22', borderRadius:20, paddingHorizontal:14, paddingVertical:6 },
  promptDoneTxt:     { fontSize:12, color:T.mint, fontWeight:'700' },
  promptGate:        { marginTop:14, paddingTop:12, borderTopWidth:1, borderColor:T.bord+'55' },
  promptGateTxt:     { fontSize:11, color:T.muted },
  promptEmpty:       { backgroundColor:T.surf, borderRadius:18, padding:28, alignItems:'center', marginBottom:4 },
  promptEmptyIcon:   { fontSize:32, marginBottom:10 },
  promptEmptyTxt:    { fontSize:13, color:T.muted, textAlign:'center', lineHeight:20 },
  // Flash cards
  flashCard:    { backgroundColor:T.surf, borderWidth:1, borderColor:T.bord, borderRadius:16, padding:16, marginBottom:4 },
  flashQ:       { fontSize:14, color:T.txt, lineHeight:22, fontFamily:'serif', fontStyle:'italic', marginBottom:10 },
  flashAnswer:  { backgroundColor:T.bg, borderRadius:10, padding:12, marginBottom:12 },
  flashA:       { fontSize:13, color:T.muted, lineHeight:20 },
  flashRow:     { flexDirection:'row', gap:10, marginTop:4 },
  flashBtn:     { backgroundColor:T.bg, borderWidth:1, borderColor:T.bord, borderRadius:20, paddingHorizontal:14, paddingVertical:7 },
  flashNextBtn: { backgroundColor:T.bg, borderWidth:1, borderColor:T.bord, borderRadius:20, paddingHorizontal:14, paddingVertical:7 },
  flashBtnTxt:  { fontSize:12, color:T.muted },
  flashCount:   { fontSize:10, color:T.muted, marginTop:10, textAlign:'right' },
  limboGate:    { backgroundColor:T.surf, borderRadius:12, padding:12, marginBottom:4, alignItems:'center' },
  limboGateTxt: { fontSize:12, color:T.muted },
  // Emoji poll
  pollCard:     { backgroundColor:T.surf, borderWidth:1, borderColor:T.bord, borderRadius:16, padding:16, marginBottom:4 },
  pollQ:        { fontSize:13, color:T.txt, fontWeight:'600', marginBottom:14 },
  pollRow:      { flexDirection:'row', flexWrap:'wrap', gap:8 },
  pollOpt:      { flex:1, minWidth:70, backgroundColor:T.bg, borderWidth:1, borderColor:T.bord, borderRadius:14, padding:10, alignItems:'center', gap:4 },
  pollOptActive:{ borderColor:T.mint, backgroundColor:T.mint+'15' },
  pollEmoji:    { fontSize:22 },
  pollLabel:    { fontSize:11, color:T.muted, textAlign:'center' },
  pollVotes:    { fontSize:10, color:T.mint, fontWeight:'700' },
  // Mind bender
  mbCard:       { backgroundColor:T.surf, borderWidth:1, borderColor:T.bord, borderRadius:16, padding:16, marginBottom:4 },
  mbQ:          { fontSize:14, color:T.txt, lineHeight:22, fontFamily:'serif', fontStyle:'italic', marginBottom:10 },
  mbA:          { fontSize:13, color:T.muted, lineHeight:20 },
  // Alter humor
  humorCard:    { backgroundColor:T.surf, borderWidth:1, borderColor:T.bord, borderRadius:16, padding:16, marginBottom:4 },
  humorEmoji:   { fontSize:28, marginBottom:10 },
  humorSetup:   { fontSize:13, color:T.txt, lineHeight:20, marginBottom:10 },
  humorDivider: { height:1, backgroundColor:T.bord, marginBottom:10 },
  humorPunch:   { fontSize:13, color:T.mint, lineHeight:20, fontStyle:'italic' },
  backBtn:      { width:34, height:34, borderRadius:17, backgroundColor:T.surf, borderWidth:1, borderColor:T.bord, alignItems:'center', justifyContent:'center' },
  // Horoscope
  hsHdr:        { flexDirection:'row', alignItems:'center', gap:10, paddingTop:48, paddingHorizontal:16, paddingBottom:14, borderBottomWidth:1, borderColor:T.bord, backgroundColor:'#060810' },
  hsTitle:      { fontFamily:'serif', fontSize:18, color:T.txt, flex:1 },
  myReading:    { backgroundColor:'#0b1522', borderWidth:1, borderRadius:18, padding:18, marginBottom:20 },
  myTop:        { flexDirection:'row', alignItems:'center', marginBottom:14 },
  myCircle:     { width:66, height:66, borderRadius:33, borderWidth:2, alignItems:'center', justifyContent:'center' },
  mySignName:   { fontFamily:'serif', fontSize:23, color:'#c8ddf4' },
  myEl:         { fontSize:10, fontWeight:'700', letterSpacing:1.5, marginTop:2 },
  myDates:      { fontSize:10, color:'#3a5a8a', marginTop:2 },
  myReadingTxt: { fontFamily:'serif', fontStyle:'italic', fontSize:13, color:'#96b4cc', lineHeight:22, marginBottom:14 },
  myStats:      { flexDirection:'row', gap:8, marginBottom:12 },
  mstat:        { flex:1, backgroundColor:'#0e1a2a', borderWidth:1, borderColor:'#1e3050', borderRadius:10, paddingVertical:7, paddingHorizontal:8, alignItems:'center' },
  mstatL:       { fontSize:8, color:'#3a5a8a', fontWeight:'700', letterSpacing:0.8, marginBottom:2 },
  mstatV:       { fontSize:11, color:'#7aaabb', fontWeight:'600' },
  myLucky:      { flexDirection:'row', gap:8, marginBottom:14 },
  lp:           { flexDirection:'row', alignItems:'center', borderRadius:20, paddingHorizontal:12, paddingVertical:5, borderWidth:1 },
  lpTxt:        { fontSize:11, fontWeight:'700' },
  myPrompt:     { borderRadius:13, padding:13, borderWidth:1 },
  mpLbl:        { fontSize:9, fontWeight:'700', letterSpacing:1, marginBottom:5 },
  mpTxt:        { fontFamily:'serif', fontStyle:'italic', fontSize:13, color:'#b0c8e0', lineHeight:21 },
  mpBtn:        { borderRadius:10, paddingVertical:9, alignItems:'center', marginTop:10 },
  mpBtnTxt:     { fontSize:12, color:'#fff', fontWeight:'700' },
  allSignsLbl:  { fontSize:9, color:T.muted, fontWeight:'700', letterSpacing:1.5, marginBottom:10 },
  signsGrid:    { flexDirection:'row', flexWrap:'wrap', gap:9, marginBottom:14 },
  signCard:     { backgroundColor:T.card, borderWidth:1, borderColor:T.bord, borderRadius:14, paddingVertical:13, paddingHorizontal:10, alignItems:'center', gap:4, position:'relative' },
  mineTag:      { position:'absolute', top:6, right:6, borderRadius:4, paddingHorizontal:4, paddingVertical:1 },
  sgName:       { fontSize:12, color:T.txt, fontWeight:'700' },
  sgDates:      { fontSize:8.5, color:T.muted },
  sgEl:         { fontSize:8.5, fontWeight:'700', letterSpacing:0.6 },
  signDetail:   { backgroundColor:'#0b1522', borderWidth:1, borderRadius:12, padding:12, marginTop:6 },
  sdReadingTxt: { fontFamily:'serif', fontStyle:'italic', fontSize:13, color:'#b0c8e0', lineHeight:21, marginBottom:6 },
  // Live horoscope indicator
  livePill:     { flexDirection:'row', alignItems:'center', gap:5, backgroundColor:T.surf, borderWidth:1, borderColor:T.bord, borderRadius:20, paddingHorizontal:10, paddingVertical:4 },
  liveDot:      { width:6, height:6, borderRadius:3 },
  liveTxt:      { fontSize:10, fontWeight:'700' },
  // Loading shimmer
  shimmer:      { backgroundColor:T.surf, borderRadius:10, paddingVertical:18, paddingHorizontal:14, alignItems:'center', borderWidth:1, borderColor:T.bord },
});


// â”€â”€â”€ ROOT APP COMPONENT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function App() {
  const [activeTab, setActiveTab] = React.useState('home');
  const [userSign, setUserSign] = React.useState(null);
  const [showHoroscope, setShowHoroscope] = React.useState(false);

  const TAB_CONFIG = [
    { key: 'home',      icon: 'ðŸ ', label: 'Home'    },
    { key: 'chat',      icon: 'ðŸ’¬', label: 'Chat'    },
    { key: 'reflect',  icon: 'ðŸŒ¿', label: 'Reflect' },
    { key: 'horoscope',icon: 'âœ¨', label: 'Stars'   },
  ];

  const renderScreen = () => {
    switch(activeTab) {
      case 'home':      return <HomeScreen />;
      case 'chat':      return <ChatScreen />;
      case 'reflect':   return <ReflectScreen mood={null} />;
      case 'horoscope':
        if (!userSign) {
          return (
            <View style={{ flex:1, backgroundColor:T.bg, justifyContent:'center', alignItems:'center', padding:24 }}>
              <Text style={{ fontSize:32, marginBottom:16 }}>âœ¨</Text>
              <Text style={{ fontSize:20, fontWeight:'700', color:T.txt, marginBottom:8, textAlign:'center' }}>What's your sign?</Text>
              <Text style={{ fontSize:13, color:T.muted, marginBottom:24, textAlign:'center' }}>Select your zodiac sign to unlock your personal daily reading</Text>
              <ScrollView style={{ width:'100%' }} contentContainerStyle={{ flexDirection:'row', flexWrap:'wrap', gap:10, justifyContent:'center' }}>
                {ZODIAC_SIGNS.map(z => (
                  <TouchableOpacity
                    key={z.id}
                    onPress={() => setUserSign(z.id)}
                    style={{ width:90, backgroundColor:T.card, borderWidth:1, borderColor:T.bord, borderRadius:14, padding:12, alignItems:'center', gap:4 }}
                  >
                    <Text style={{ fontSize:24, color:z.elColor }}>{z.glyph}</Text>
                    <Text style={{ fontSize:12, fontWeight:'700', color:T.txt }}>{z.name}</Text>
                    <Text style={{ fontSize:9, color:T.muted }}>{z.element}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          );
        }
        return <HoroscopeScreen userSign={userSign} onClose={() => setActiveTab('home')} />;
      default: return <HomeScreen />;
    }
  };

  return (
    <View style={{ flex:1, backgroundColor:T.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={T.bg} />
      <View style={{ flex:1 }}>
        {renderScreen()}
      </View>
      {/* Bottom Tab Bar */}
      <View style={{
        flexDirection:'row',
        backgroundColor:T.surf,
        borderTopWidth:1,
        borderTopColor:T.bord,
        paddingBottom:20,
        paddingTop:8,
      }}>
        {TAB_CONFIG.map(tab => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={{ flex:1, alignItems:'center', gap:3 }}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize:22 }}>{tab.icon}</Text>
            <Text style={{
              fontSize:9,
              fontWeight:'700',
              color: activeTab === tab.key ? T.brownS : T.muted,
              letterSpacing:0.5,
            }}>{tab.label.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
