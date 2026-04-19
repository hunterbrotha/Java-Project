'use strict';

// ── State ──────────────────────────────────────────────────────
let allCompetitions = [];
let allMatches     = [];
let currentCompId  = '';
let currentSeason  = '';
let currentTab     = 'matches';

// Proper display names for competitions (slug → readable)
const COMPETITION_NAMES = {
  'a-league-men':                 'A-League Men',
  'afc-asian-cup':                'AFC Asian Cup',
  'africa-cup-of-nations':        'Africa Cup of Nations',
  'allsvenskan':                  'Allsvenskan',
  'bundesliga':                   'Bundesliga',
  'campeonato-brasileiro-serie-a':'Brasileirão Série A',
  'chance-liga':                  'Chance Liga',
  'copa-america':                 'Copa América',
  'eliteserien':                  'Eliteserien',
  'eredivisie':                   'Eredivisie',
  'j1-league':                    'J1 League',
  'jupiler-pro-league':           'Jupiler Pro League',
  'k-league-1':                   'K League 1',
  'laliga':                       'LaLiga',
  'liga-betplay-dimayor':         'Liga BetPlay Dimayor',
  'liga-mx-clausura':             'Liga MX',
  'liga-portugal':                'Liga Portugal',
  'ligue-1':                      'Ligue 1',
  'major-league-soccer':          'MLS',
  'pko-bp-ekstraklasa':           'Ekstraklasa',
  'premier-league':               'Premier League',
  'premier-liga':                 'Premier Liga',
  'saudi-pro-league':             'Saudi Pro League',
  'scottish-premiership':         'Scottish Premiership',
  'serie-a':                      'Serie A',
  'super-league':                 'Super League',
  'super-league-1':               'Super League 1',
  'super-lig':                    'Süper Lig',
  'super-liga-srbije':            'Super Liga Srbije',
  'superliga':                    'Superliga',
  'supersport-hnl':               'SuperSport HNL',
  'torneo-apertura':              'Torneo Apertura',
  'uefa-euro':                    'UEFA Euro',
  'world-cup':                    'FIFA World Cup',
};

// DEMO MAPPING for Vercel/Offline mode (ID -> SLUG)
const COMPETITION_ID_SLUGS = {
  'GB1': 'premier-league', 'ES1': 'laliga', 'L1': 'bundesliga', 'IT1': 'serie-a', 'FR1': 'ligue-1',
  'CL': 'champions-league', 'EL': 'europa-league', 'ECL': 'conference-league',
  'NL1': 'eredivisie', 'PO1': 'liga-portugal', 'BE1': 'jupiler-pro-league', 'TR1': 'super-lig',
  'BRA1': 'campeonato-brasileiro-serie-a', 'MLS': 'major-league-soccer', 'SA1': 'saudi-pro-league',
  'SC1': 'scottish-premiership', 'GR1': 'super-league-1', 'RU1': 'premier-liga', 'PL1': 'pko-bp-ekstraklasa',
  'SE1': 'allsvenskan', 'NO1': 'eliteserien', 'DK1': 'superliga', 'CZ1': 'chance-liga', 'HR1': 'supersport-hnl',
  'SER1': 'super-liga-srbije', 'SU1': 'super-league', 'AUS1': 'a-league-men', 'JAP1': 'j1-league', 'KOR1': 'k-league-1',
  'AFCN': 'africa-cup-of-nations', 'AFAC': 'afc-asian-cup', 'COPA': 'copa-america', 'EURO': 'uefa-euro', 'WC': 'world-cup'
};

const COMPETITION_FLAGS = {
  AUS1:'🇦🇺', AFAC:'🌏', AFCN:'🌍', SE1:'🇸🇪', A1:'🇦🇹', L1:'🇩🇪',
  BRA1:'🇧🇷', TS1:'🇨🇿', COPA:'🌎', NO1:'🇳🇴', NL1:'🇳🇱', JAP1:'🇯🇵',
  BE1:'🇧🇪', RSK1:'🇰🇷', ES1:'🇪🇸', COL1:'🇨🇴', MEX1:'🇲🇽', PO1:'🇵🇹',
  FR1:'🇫🇷', MLS1:'🇺🇸', PL1:'🇵🇱', GB1:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', RU1:'🇷🇺', UKR1:'🇺🇦',
  SA1:'🇸🇦', SC1:'🏴󠁧󠁢󠁳󠁣󠁴󠁿', IT1:'🇮🇹', C1:'🇨🇭', GR1:'🇬🇷', TR1:'🇹🇷',
  SER1:'🇷🇸', DK1:'🇩🇰', RO1:'🇷🇴', KR1:'🇭🇷', ARG1:'🇦🇷', EURO:'🇪🇺',
  FIWC:'🌍', CL:'⭐', EL:'🟠',
};

// ── Supplemental 2024/25 Standings from web (injected if API returns empty)
const SUPPLEMENTAL_STANDINGS = {
  'GB1_2025': [
    {clubName:'Liverpool FC', played:38, won:25, drawn:9, lost:4, goalsFor:86, goalsAgainst:41, goalDifference:45, points:84},
    {clubName:'Arsenal FC', played:38, won:20, drawn:14, lost:6, goalsFor:69, goalsAgainst:34, goalDifference:35, points:74},
    {clubName:'Manchester City', played:38, won:21, drawn:8, lost:9, goalsFor:72, goalsAgainst:44, goalDifference:28, points:71},
    {clubName:'Chelsea FC', played:38, won:20, drawn:9, lost:9, goalsFor:64, goalsAgainst:43, goalDifference:21, points:69},
    {clubName:'Newcastle United', played:38, won:20, drawn:6, lost:12, goalsFor:68, goalsAgainst:47, goalDifference:21, points:66},
    {clubName:'Aston Villa', played:38, won:19, drawn:10, lost:9, goalsFor:58, goalsAgainst:51, goalDifference:7, points:67},
    {clubName:'Nottingham Forest', played:38, won:19, drawn:8, lost:11, goalsFor:58, goalsAgainst:46, goalDifference:12, points:65},
    {clubName:'Brighton & Hove Albion', played:38, won:16, drawn:13, lost:9, goalsFor:66, goalsAgainst:59, goalDifference:7, points:61},
    {clubName:'Bournemouth', played:38, won:15, drawn:11, lost:12, goalsFor:58, goalsAgainst:46, goalDifference:12, points:56},
    {clubName:'Brentford FC', played:38, won:16, drawn:8, lost:14, goalsFor:66, goalsAgainst:57, goalDifference:9, points:56},
    {clubName:'Fulham FC', played:38, won:15, drawn:9, lost:14, goalsFor:54, goalsAgainst:54, goalDifference:0, points:54},
    {clubName:'Crystal Palace', played:38, won:13, drawn:14, lost:11, goalsFor:51, goalsAgainst:51, goalDifference:0, points:53},
    {clubName:'Everton FC', played:38, won:11, drawn:15, lost:12, goalsFor:42, goalsAgainst:44, goalDifference:-2, points:48},
    {clubName:'West Ham United', played:38, won:11, drawn:10, lost:17, goalsFor:46, goalsAgainst:62, goalDifference:-16, points:43},
    {clubName:'Manchester United', played:38, won:11, drawn:9, lost:18, goalsFor:44, goalsAgainst:54, goalDifference:-10, points:42},
    {clubName:'Wolverhampton Wanderers', played:38, won:12, drawn:6, lost:20, goalsFor:54, goalsAgainst:69, goalDifference:-15, points:42},
    {clubName:'Tottenham Hotspur', played:38, won:11, drawn:5, lost:22, goalsFor:64, goalsAgainst:65, goalDifference:-1, points:38},
    {clubName:'Leicester City', played:38, won:6, drawn:7, lost:25, goalsFor:33, goalsAgainst:80, goalDifference:-47, points:25},
    {clubName:'Ipswich Town', played:38, won:4, drawn:10, lost:24, goalsFor:36, goalsAgainst:82, goalDifference:-46, points:22},
    {clubName:'Southampton FC', played:38, won:2, drawn:6, lost:30, goalsFor:26, goalsAgainst:86, goalDifference:-60, points:12},
  ],
  'ES1_2025': [
    {clubName:'FC Barcelona', played:38, won:26, drawn:10, lost:2, goalsFor:99, goalsAgainst:36, goalDifference:63, points:88},
    {clubName:'Real Madrid CF', played:38, won:26, drawn:6, lost:6, goalsFor:84, goalsAgainst:44, goalDifference:40, points:84},
    {clubName:'Atlético de Madrid', played:38, won:21, drawn:9, lost:8, goalsFor:70, goalsAgainst:43, goalDifference:27, points:72},
    {clubName:'Athletic Club', played:38, won:18, drawn:10, lost:10, goalsFor:52, goalsAgainst:38, goalDifference:14, points:64},
    {clubName:'Villarreal CF', played:38, won:16, drawn:12, lost:10, goalsFor:60, goalsAgainst:53, goalDifference:7, points:60},
    {clubName:'Real Sociedad', played:38, won:16, drawn:7, lost:15, goalsFor:52, goalsAgainst:47, goalDifference:5, points:55},
    {clubName:'Betis', played:38, won:14, drawn:9, lost:15, goalsFor:48, goalsAgainst:50, goalDifference:-2, points:51},
    {clubName:'Mallorca', played:38, won:14, drawn:8, lost:16, goalsFor:40, goalsAgainst:51, goalDifference:-11, points:50},
    {clubName:'Celta Vigo', played:38, won:13, drawn:9, lost:16, goalsFor:47, goalsAgainst:55, goalDifference:-8, points:48},
    {clubName:'Girona FC', played:38, won:13, drawn:8, lost:17, goalsFor:54, goalsAgainst:62, goalDifference:-8, points:47},
  ],
  'L1_2025': [
    {clubName:'Bayern Munich', played:34, won:25, drawn:7, lost:2, goalsFor:90, goalsAgainst:38, goalDifference:52, points:82},
    {clubName:'Bayer Leverkusen', played:34, won:20, drawn:9, lost:5, goalsFor:72, goalsAgainst:38, goalDifference:34, points:69},
    {clubName:'Eintracht Frankfurt', played:34, won:18, drawn:6, lost:10, goalsFor:60, goalsAgainst:46, goalDifference:14, points:60},
    {clubName:'Borussia Dortmund', played:34, won:17, drawn:6, lost:11, goalsFor:65, goalsAgainst:55, goalDifference:10, points:57},
    {clubName:'RB Leipzig', played:34, won:16, drawn:5, lost:13, goalsFor:55, goalsAgainst:50, goalDifference:5, points:53},
    {clubName:'Freiburg SC', played:34, won:14, drawn:9, lost:11, goalsFor:54, goalsAgainst:49, goalDifference:5, points:51},
    {clubName:'Werder Bremen', played:34, won:14, drawn:8, lost:12, goalsFor:52, goalsAgainst:53, goalDifference:-1, points:50},
    {clubName:'VfB Stuttgart', played:34, won:14, drawn:7, lost:13, goalsFor:56, goalsAgainst:55, goalDifference:1, points:49},
  ],
  'IT1_2025': [
    {clubName:'SSC Napoli', played:38, won:23, drawn:9, lost:6, goalsFor:72, goalsAgainst:38, goalDifference:34, points:78},
    {clubName:'Inter Milan', played:38, won:22, drawn:10, lost:6, goalsFor:75, goalsAgainst:35, goalDifference:40, points:76},
    {clubName:'Atalanta BC', played:38, won:20, drawn:10, lost:8, goalsFor:68, goalsAgainst:44, goalDifference:24, points:70},
    {clubName:'Juventus FC', played:38, won:19, drawn:11, lost:8, goalsFor:60, goalsAgainst:36, goalDifference:24, points:68},
    {clubName:'Lazio', played:38, won:19, drawn:8, lost:11, goalsFor:57, goalsAgainst:46, goalDifference:11, points:65},
    {clubName:'AC Milan', played:38, won:16, drawn:9, lost:13, goalsFor:60, goalsAgainst:51, goalDifference:9, points:57},
    {clubName:'AS Roma', played:38, won:15, drawn:9, lost:14, goalsFor:55, goalsAgainst:54, goalDifference:1, points:54},
    {clubName:'Fiorentina', played:38, won:15, drawn:8, lost:15, goalsFor:56, goalsAgainst:55, goalDifference:1, points:53},
  ],
  'FR1_2025': [
    {clubName:'Paris Saint-Germain', played:34, won:25, drawn:4, lost:5, goalsFor:84, goalsAgainst:31, goalDifference:53, points:79},
    {clubName:'Olympique Marseille', played:34, won:21, drawn:6, lost:7, goalsFor:65, goalsAgainst:38, goalDifference:27, points:69},
    {clubName:'Monaco', played:34, won:19, drawn:7, lost:8, goalsFor:70, goalsAgainst:41, goalDifference:29, points:64},
    {clubName:'LOSC Lille', played:34, won:17, drawn:8, lost:9, goalsFor:58, goalsAgainst:38, goalDifference:20, points:59},
    {clubName:'OGC Nice', played:34, won:16, drawn:8, lost:10, goalsFor:50, goalsAgainst:38, goalDifference:12, points:56},
    {clubName:'Olympique Lyon', played:34, won:14, drawn:7, lost:13, goalsFor:51, goalsAgainst:47, goalDifference:4, points:49},
  ],
};

// ── Web-sourced Showcase Matches (full lineups & events) ────────
const SUPPLEMENTAL_MATCHES = [
  {
    gameId:'web-ucl-final-2025', competitionId:'CL', season:'2025',
    round:'UCL Final', date:'2025-05-31T18:00:00Z',
    homeClubId:'web-psg', homeClubName:'Paris Saint-Germain',
    awayClubId:'web-inter', awayClubName:'Inter Milan',
    homeClubGoals:5, awayClubGoals:0,
    homeClubFormation:'4-3-3', awayClubFormation:'3-5-2',
    homeClubManagerName:'Luis Enrique', awayClubManagerName:'Simone Inzaghi',
    stadium:'Allianz Arena, Munich', attendance:'64327',
    referee:'István Kovács', competitionType:'Champions League',
    isShowcase:true,
  },
  {
    gameId:'web-ucl-final-2022', competitionId:'CL', season:'2022',
    round:'UCL Final', date:'2022-05-28T19:00:00Z',
    homeClubId:'web-lfc', homeClubName:'Liverpool FC',
    awayClubId:'web-rma', awayClubName:'Real Madrid CF',
    homeClubGoals:0, awayClubGoals:1,
    homeClubFormation:'4-3-3', awayClubFormation:'4-3-3',
    homeClubManagerName:'Jürgen Klopp', awayClubManagerName:'Carlo Ancelotti',
    stadium:'Stade de France, Paris', attendance:'75000',
    referee:'Clément Turpin', competitionType:'Champions League',
    isShowcase:true,
  },
];

const SUPPLEMENTAL_EVENTS = {
  'web-ucl-final-2025': [
    {minute:'12', type:'goals', clubId:'web-psg', playerName:'Achraf Hakimi', description:'Low finish into the bottom left corner'},
    {minute:'20', type:'goals', clubId:'web-psg', playerName:'Désiré Doué', description:'Composed finish inside the box'},
    {minute:'63', type:'goals', clubId:'web-psg', playerName:'Désiré Doué', description:'Header from close range — brace!'},
    {minute:'73', type:'goals', clubId:'web-psg', playerName:'Khvicha Kvaratskhelia', description:'Cut inside, curled into far corner'},
    {minute:'80', type:'substitutions', clubId:'web-psg', playerName:'Ousmane Dembélé', playerInName:'Senny Mayulu', description:''},
    {minute:'86', type:'goals', clubId:'web-psg', playerName:'Senny Mayulu', description:'Late substitute completes the rout'},
    {minute:'70', type:'substitutions', clubId:'web-inter', playerName:'Lautaro Martínez', playerInName:'Marko Arnautović', description:''},
  ],
  'web-ucl-final-2022': [
    {minute:'59', type:'goals', clubId:'web-rma', playerName:'Vinícius Júnior', description:'Tap-in at back post — Valverde assist'},
    {minute:'65', type:'substitutions', clubId:'web-lfc', playerName:'Luis Díaz', playerInName:'Diogo Jota', description:''},
    {minute:'77', type:'substitutions', clubId:'web-lfc', playerName:'Jordan Henderson', playerInName:'Naby Keïta', description:''},
    {minute:'77', type:'substitutions', clubId:'web-lfc', playerName:'Thiago Alcântara', playerInName:'Roberto Firmino', description:''},
    {minute:'86', type:'substitutions', clubId:'web-rma', playerName:'Federico Valverde', playerInName:'Eduardo Camavinga', description:''},
    {minute:'90', type:'substitutions', clubId:'web-rma', playerName:'Luka Modrić', playerInName:'Dani Ceballos', description:''},
  ],
};

const SUPPLEMENTAL_LINEUPS = {
  'web-ucl-final-2025': [
    {clubId:'web-psg', jerseyNumber:'1',  playerName:'Gianluigi Donnarumma'},
    {clubId:'web-psg', jerseyNumber:'2',  playerName:'Achraf Hakimi'},
    {clubId:'web-psg', jerseyNumber:'5',  playerName:'Marquinhos (C)'},
    {clubId:'web-psg', jerseyNumber:'22', playerName:'Lucas Hernández'},
    {clubId:'web-psg', jerseyNumber:'25', playerName:'Nuno Mendes'},
    {clubId:'web-psg', jerseyNumber:'8',  playerName:'Fabian Ruiz'},
    {clubId:'web-psg', jerseyNumber:'6',  playerName:'Warren Zaïre-Emery'},
    {clubId:'web-psg', jerseyNumber:'29', playerName:'Bradley Barcola'},
    {clubId:'web-psg', jerseyNumber:'11', playerName:'Ousmane Dembélé'},
    {clubId:'web-psg', jerseyNumber:'77', playerName:'Khvicha Kvaratskhelia'},
    {clubId:'web-psg', jerseyNumber:'10', playerName:'Désiré Doué'},
    {clubId:'web-inter', jerseyNumber:'1',  playerName:'Yann Sommer'},
    {clubId:'web-inter', jerseyNumber:'36', playerName:'Matteo Darmian'},
    {clubId:'web-inter', jerseyNumber:'6',  playerName:'Stefan de Vrij'},
    {clubId:'web-inter', jerseyNumber:'95', playerName:'Alessandro Bastoni'},
    {clubId:'web-inter', jerseyNumber:'8',  playerName:'Carlos Augusto'},
    {clubId:'web-inter', jerseyNumber:'23', playerName:'Nicolò Barella'},
    {clubId:'web-inter', jerseyNumber:'77', playerName:'Marcelo Brozović'},
    {clubId:'web-inter', jerseyNumber:'20', playerName:'Hakan Çalhanoğlu (C)'},
    {clubId:'web-inter', jerseyNumber:'2',  playerName:'Denzel Dumfries'},
    {clubId:'web-inter', jerseyNumber:'9',  playerName:'Marcus Thuram'},
    {clubId:'web-inter', jerseyNumber:'10', playerName:'Lautaro Martínez'},
  ],
  'web-ucl-final-2022': [
    {clubId:'web-lfc', jerseyNumber:'1',  playerName:'Alisson Becker'},
    {clubId:'web-lfc', jerseyNumber:'66', playerName:'Trent Alexander-Arnold'},
    {clubId:'web-lfc', jerseyNumber:'5',  playerName:'Ibrahima Konaté'},
    {clubId:'web-lfc', jerseyNumber:'4',  playerName:'Virgil van Dijk'},
    {clubId:'web-lfc', jerseyNumber:'26', playerName:'Andrew Robertson'},
    {clubId:'web-lfc', jerseyNumber:'14', playerName:'Jordan Henderson (C)'},
    {clubId:'web-lfc', jerseyNumber:'3',  playerName:'Fabinho'},
    {clubId:'web-lfc', jerseyNumber:'6',  playerName:'Thiago Alcântara'},
    {clubId:'web-lfc', jerseyNumber:'11', playerName:'Mohamed Salah'},
    {clubId:'web-lfc', jerseyNumber:'10', playerName:'Sadio Mané'},
    {clubId:'web-lfc', jerseyNumber:'23', playerName:'Luis Díaz'},
    {clubId:'web-rma', jerseyNumber:'1',  playerName:'Thibaut Courtois'},
    {clubId:'web-rma', jerseyNumber:'2',  playerName:'Dani Carvajal'},
    {clubId:'web-rma', jerseyNumber:'3',  playerName:'Éder Militão'},
    {clubId:'web-rma', jerseyNumber:'4',  playerName:'David Alaba'},
    {clubId:'web-rma', jerseyNumber:'23', playerName:'Ferland Mendy'},
    {clubId:'web-rma', jerseyNumber:'10', playerName:'Luka Modrić'},
    {clubId:'web-rma', jerseyNumber:'14', playerName:'Casemiro'},
    {clubId:'web-rma', jerseyNumber:'8',  playerName:'Toni Kroos'},
    {clubId:'web-rma', jerseyNumber:'15', playerName:'Federico Valverde'},
    {clubId:'web-rma', jerseyNumber:'9',  playerName:'Karim Benzema (C)'},
    {clubId:'web-rma', jerseyNumber:'20', playerName:'Vinícius Júnior'},
  ],
};

const QUOTES = [
  '"Quality without results is pointless. Results without quality is boring." — Johan Cruyff',
  '"Success is no accident. It is hard work, perseverance, learning, studying, sacrifice." — Pelé',
  '"The best teams are the ones that can adapt. Data helps you adapt faster." — Arsène Wenger',
  '"In football, the result is what matters. Everything else is just noise." — José Mourinho',
];

// ── Bootstrap ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  rotateQuotes();
  initScrollObserver();
  checkStatus();
  setInterval(checkStatus, 8000);
  loadCompetitions();
  // Trigger unbox on welcome quote
  setTimeout(() => {
    document.querySelector('.welcome-quote-box')?.classList.add('unboxed');
  }, 600);
});

// ── Animation Engine ───────────────────────────────────────────
let scrollObserver;

function initScrollObserver() {
  scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Once revealed, no need to keep observing
        scrollObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
}

function observeElements(selector, root) {
  const els = (root || document).querySelectorAll(selector);
  els.forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.04}s`;
    scrollObserver?.observe(el);
  });
}

// ── Welcome Screen ─────────────────────────────────────────────
function enterDashboard() {
  const el = document.getElementById('view-welcome');
  el.classList.add('fade-out');
  setTimeout(() => el.style.display = 'none', 500);
}

// ── Performance Utilities ──────────────────────────────────────
/**
 * A fast fetch that times out after ms (default 1500)
 * Essential for Vercel speed when the backend is offline.
 */
async function fastFetch(url, ms = 1500) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ms);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

function rotateQuotes() {
  const el = document.getElementById('welcome-quote');
  if (!el) return;
  let i = 0;
  setInterval(() => {
    i = (i + 1) % QUOTES.length;
    el.style.transition = 'opacity 0.4s';
    el.style.opacity = 0;
    setTimeout(() => { el.textContent = QUOTES[i]; el.style.opacity = 1; }, 400);
  }, 7000);
}

// ── Status ─────────────────────────────────────────────────────
async function checkStatus() {
  const pill = document.getElementById('sync-status');
  const text = document.getElementById('sync-text');

  try {
    const r = await fastFetch('/api/status');
    const d = await r.json();
    if (d.eventsReady) {
      pill.classList.add('ready');
      text.textContent = 'Live';
    } else {
      pill.classList.remove('ready');
      text.textContent = 'Syncing...';
    }
  } catch (_) {
    pill.classList.add('ready');
    pill.style.background = 'var(--text-muted)';
    text.textContent = 'DEMO MODE';
  }
}

// ── Competitions ───────────────────────────────────────────────
async function loadCompetitions() {
  try {
    const r = await fastFetch('/api/competitions');
    if (!r.ok) throw new Error();
    allCompetitions = await r.json();
    if (!allCompetitions.length) throw new Error();
  } catch (e) {
    // Instant Demo Fallback
    allCompetitions = Object.keys(COMPETITION_ID_SLUGS).map(id => ({
      competitionId: id,
      competitionSlug: COMPETITION_ID_SLUGS[id],
      competitionName: COMPETITION_NAMES[COMPETITION_ID_SLUGS[id]] || id
    }));
  }

  renderCompetitions(allCompetitions);
  const major = allCompetitions.find(c => ['GB1','ES1','L1','IT1','FR1'].includes(c.competitionId));
  if (major) selectCompetition(major);
  else selectCompetition(null);
}

function renderCompetitions(list) {
  const el = document.getElementById('competition-list');
  let html = `
    <div class="comp-item anim-in ${currentCompId === '' ? 'active' : ''}" onclick="selectCompetition(null)">
      <span class="comp-flag">🌍</span>
      <div class="comp-info">
        <div class="comp-name">All Competitions</div>
        <div class="comp-country">Global</div>
      </div>
    </div>`;
  list.forEach(c => {
    const flag = COMPETITION_FLAGS[c.competitionId] || '🏆';
    const displayName = COMPETITION_NAMES[c.name] || c.name
      .split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    html += `
      <div class="comp-item anim-in ${currentCompId === c.competitionId ? 'active' : ''}"
           onclick="selectCompetitionById('${esc(c.competitionId)}')">
        <span class="comp-flag">${flag}</span>
        <div class="comp-info">
          <div class="comp-name">${esc(displayName)}</div>
          <div class="comp-country">${esc(c.countryName || 'International')}</div>
        </div>
      </div>`;
  });
  el.innerHTML = html;
  // Stagger-animate sidebar items
  observeElements('.comp-item.anim-in', el);
}

function filterCompetitions() {
  const q = document.getElementById('comp-search').value.toLowerCase();
  const filtered = allCompetitions.filter(c =>
    c.name.toLowerCase().includes(q) ||
    (c.countryName || '').toLowerCase().includes(q)
  );
  renderCompetitions(filtered);
}

function selectCompetitionById(id) {
  const c = allCompetitions.find(x => x.competitionId === id);
  if (c) selectCompetition(c);
}

async function selectCompetition(comp) {
  currentCompId = comp ? comp.competitionId : '';
  currentSeason = '';

  // Show proper display name, not raw slug
  const rawName = comp ? comp.name : '';
  const displayName = comp
    ? (COMPETITION_NAMES[rawName] || rawName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))
    : 'All Competitions';
  document.getElementById('comp-title').textContent = displayName;

  renderCompetitions(allCompetitions); // refresh active state

  // Load seasons for this competition
  const sel = document.getElementById('season-select');
  sel.innerHTML = '<option value="">All Seasons</option>';
  if (currentCompId) {
    try {
      const r = await fetch(`/api/seasons?competitionId=${encodeURIComponent(currentCompId)}`);
      const seasons = await r.json();
      seasons.forEach(s => {
        const o = document.createElement('option');
        o.value = s; o.textContent = s;
        sel.appendChild(o);
      });
      // Default to most recent season
      if (seasons.length) { sel.value = seasons[0]; currentSeason = seasons[0]; }
    } catch (_) {}
  }
  // Respect current tab — don't always go to matches
  if (currentTab === 'standings') loadStandings();
  else if (currentTab === 'market') loadMarket();
  else loadMatches();
}

// ── Matches ────────────────────────────────────────────────────
async function loadMatches() {
  closeDetail();
  const container = document.getElementById('match-list');
  container.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Loading matches...</p></div>';

  currentSeason = document.getElementById('season-select').value;

  try {
    let url = '/api/matches?';
    if (currentCompId) url += `competitionId=${encodeURIComponent(currentCompId)}&`;
    if (currentSeason)  url += `season=${encodeURIComponent(currentSeason)}&`;

    const r = await fastFetch(url);
    if (!r.ok) throw new Error();
    allMatches = await r.json();
    renderMatchList(allMatches);
  } catch (_) {
    // Demo Mode: Use bundled local data
    if (typeof DEMO_DATASET !== 'undefined') {
      allMatches = DEMO_DATASET.filter(m => {
        const matchComp = !currentCompId || m.competitionId === currentCompId;
        const matchSeason = !currentSeason || String(m.season) === String(currentSeason);
        return matchComp && matchSeason;
      });
      renderMatchList(allMatches);
    } else {
      container.innerHTML = '<div class="empty-state"><div class="empty-icon">⚠️</div><p>Failed to load matches.</p></div>';
    }
  }
}

function handleSearch() {
  const q = document.getElementById('global-search').value.toLowerCase().trim();
  if (!q) { renderMatchList(allMatches); return; }
  const filtered = allMatches.filter(m =>
    (m.homeClubName || '').toLowerCase().includes(q) ||
    (m.awayClubName || '').toLowerCase().includes(q) ||
    (m.stadium      || '').toLowerCase().includes(q) ||
    (m.round        || '').toLowerCase().includes(q)
  );
  renderMatchList(filtered);
}

function renderMatchList(matches) {
  const container = document.getElementById('match-list');

  // Always inject showcase matches at the top (pinned section)
  const showcaseHtml = `
    <div class="date-label unbox" style="color:var(--accent);border-color:var(--accent)">⭐ Featured Showcase Matches</div>
    ${SUPPLEMENTAL_MATCHES.map(m => renderMatchCard(m)).join('')}
    <div class="date-label unbox" style="margin-top:16px">Dataset Matches</div>`;

  if (!matches.length) {
    container.innerHTML = showcaseHtml + '<div class="empty-state"><div class="empty-icon">⚽</div><p>No dataset matches for this filter</p><p style="font-size:11px;margin-top:4px">Try a different competition or season</p></div>';
    observeElements('.match-card-v2.reveal', container);
    observeElements('.date-label.unbox', container);
    return;
  }

  // Group by date
  const groups = {};
  matches.forEach(m => {
    const day = m.date ? m.date.split('T')[0] : 'Unknown';
    if (!groups[day]) groups[day] = [];
    groups[day].push(m);
  });

  let html = showcaseHtml;
  Object.keys(groups).sort().reverse().forEach(day => {
    const label = day === 'Unknown' ? '' : formatDateLabel(day);
    if (label) html += `<div class="date-label unbox">${label}</div>`;
    groups[day].forEach(m => { html += renderMatchCard(m); });
  });

  container.innerHTML = html;
  observeElements('.match-card-v2.reveal', container);
  observeElements('.date-label.unbox', container);
}

function renderMatchCard(m) {
  const hg = parseInt(m.homeClubGoals) || 0;
  const ag = parseInt(m.awayClubGoals) || 0;
  const homeWins = hg > ag, awayWins = ag > hg;

  const resultClass = homeWins ? 'home-win' : awayWins ? 'away-win' : 'draw';
  const resultLabel = homeWins ? 'HW' : awayWins ? 'AW' : 'D';

  return `
    <div class="match-card-v2 reveal" onclick="openMatchDetail('${esc(String(m.gameId))}', this)">
      <div class="match-top">
        <span>${esc(m.round || '')}</span>
        <span style="margin-left:auto">${esc(m.competitionType || '')}</span>
      </div>
      <div class="match-teams">
        <div class="team-home">
          <span class="team-name ${homeWins ? 'winner' : ''}">${esc(m.homeClubName)}</span>
          ${m.homeClubFormation ? `<span class="team-formation">${esc(m.homeClubFormation)}</span>` : ''}
        </div>
        <div class="score-block">
          <div class="score-display">
            <span class="score-num">${hg}</span>
            <span class="score-sep">:</span>
            <span class="score-num">${ag}</span>
          </div>
        </div>
        <div class="team-away">
          <span class="team-name ${awayWins ? 'winner' : ''}">${esc(m.awayClubName)}</span>
          ${m.awayClubFormation ? `<span class="team-formation">${esc(m.awayClubFormation)}</span>` : ''}
        </div>
      </div>
      <div class="match-footer">
        <span>${m.stadium ? '🏟 ' + esc(m.stadium) : ''}</span>
        ${m.attendance ? `<span>${Number(m.attendance).toLocaleString()} att.</span>` : ''}
        <span class="result-badge ${resultClass}">${resultLabel}</span>
      </div>
    </div>`;
}

// ── Match Detail ───────────────────────────────────────────────
async function openMatchDetail(gameId, el) {
  // Highlight card
  document.querySelectorAll('.match-card-v2').forEach(c => c.classList.remove('active'));
  el.classList.add('active');

  const panel = document.getElementById('detail-panel');
  const layout = document.getElementById('app-layout');
  panel.classList.remove('hidden');
  layout.classList.add('panel-open');

  const body = document.getElementById('detail-body');
  body.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Loading match data...</p></div>';

  // Serve supplemental data for web-sourced showcase matches
  if (String(gameId).startsWith('web-')) {
    const match   = SUPPLEMENTAL_MATCHES.find(m => m.gameId === gameId);
    const events  = SUPPLEMENTAL_EVENTS[gameId]  || [];
    const lineups = SUPPLEMENTAL_LINEUPS[gameId] || [];
    if (!match) { body.innerHTML = '<div class="empty-state"><p>Match not found</p></div>'; return; }
    document.getElementById('detail-comp').textContent =
      'Champions League · ' + match.season + ' · WEB SOURCED';
    body.innerHTML = renderDetailBody(match, events, lineups);
    activateDetailTab('events');
    body.querySelectorAll('.hero-score-num').forEach((el, i) => {
      el.style.animationDelay = `${0.1 + i * 0.12}s`;
      el.classList.add('score-num-anim');
    });
    observeElements('.event-item', body);
    return;
  }

  try {
    const [matchR, eventsR, lineupsR] = await Promise.all([
      fetch(`/api/matches/${gameId}`),
      fetch(`/api/matches/${gameId}/events`),
      fetch(`/api/matches/${gameId}/lineups`),
    ]);
    const match   = await matchR.json();
    const events  = await eventsR.json();
    const lineups = await lineupsR.json();

    document.getElementById('detail-comp').textContent =
      (match.competitionId || '') + (match.season ? ' · ' + match.season : '');

    body.innerHTML = renderDetailBody(match, events, lineups);
    activateDetailTab('events');

    // Animate score numbers
    body.querySelectorAll('.hero-score-num').forEach((el, i) => {
      el.style.animationDelay = `${0.1 + i * 0.12}s`;
      el.classList.add('score-num-anim');
    });
    // Reveal event items
    observeElements('.event-item', body);
  } catch (_) {
    body.innerHTML = '<div class="empty-state"><p>Failed to load match details</p></div>';
  }
}

function renderDetailBody(match, events, lineups) {
  const hg = parseInt(match.homeClubGoals) || 0;
  const ag = parseInt(match.awayClubGoals) || 0;

  return `
    <div class="score-hero">
      <div class="hero-team-home">
        <div class="hero-team-name">${esc(match.homeClubName)}</div>
        ${match.homeClubFormation ? `<div class="hero-formation">${esc(match.homeClubFormation)}</div>` : ''}
        ${match.homeClubManagerName ? `<div style="font-size:11px;color:var(--text-muted);margin-top:2px">${esc(match.homeClubManagerName)}</div>` : ''}
      </div>
      <div class="hero-score">
        <span class="hero-score-num" style="color:${hg>ag?'var(--win)':'var(--text-white)'}">${hg}</span>
        <span class="hero-score-sep">:</span>
        <span class="hero-score-num" style="color:${ag>hg?'var(--win)':'var(--text-white)'}">${ag}</span>
      </div>
      <div class="hero-team-away">
        <div class="hero-team-name">${esc(match.awayClubName)}</div>
        ${match.awayClubFormation ? `<div class="hero-formation">${esc(match.awayClubFormation)}</div>` : ''}
        ${match.awayClubManagerName ? `<div style="font-size:11px;color:var(--text-muted);margin-top:2px">${esc(match.awayClubManagerName)}</div>` : ''}
      </div>
    </div>
    ${match.stadium ? `<div style="padding:8px 16px;font-size:11px;color:var(--text-muted);border-bottom:1px solid var(--border)">🏟 ${esc(match.stadium)}${match.attendance ? ' · ' + Number(match.attendance).toLocaleString() + ' att.' : ''}${match.referee ? ' · Ref: ' + esc(match.referee) : ''}</div>` : ''}

    <div class="detail-tabs">
      <button class="detail-tab active" id="dtab-events"   onclick="activateDetailTab('events')">Events</button>
      <button class="detail-tab"        id="dtab-lineups"  onclick="activateDetailTab('lineups')">Lineups</button>
    </div>

    <div id="detail-events">${renderEvents(events, match)}</div>
    <div id="detail-lineups" class="hidden">${renderLineups(lineups, match)}</div>`;
}

function activateDetailTab(name) {
  ['events','lineups'].forEach(t => {
    document.getElementById(`dtab-${t}`)?.classList?.toggle('active', t === name);
    document.getElementById(`detail-${t}`)?.classList?.toggle('hidden', t !== name);
  });
}

function renderEvents(events, match) {
  if (!events.length) return '<div class="empty-state" style="padding:40px"><p>No events recorded</p></div>';

  const homeId = match.homeClubId;
  const sorted = [...events].sort((a, b) => (parseInt(a.minute)||0) - (parseInt(b.minute)||0));

  const half1 = sorted.filter(e => (parseInt(e.minute)||0) <= 45);
  const half2 = sorted.filter(e => (parseInt(e.minute)||0) > 45);

  const renderHalf = (evs) => evs.map(ev => {
    const isHome = String(ev.clubId) === String(homeId);
    const iconMap = {
      'goals':         { icon: '⚽', cls: 'goal' },
      'own-goals':     { icon: '⚽', cls: 'goal' },
      'yellow-cards':  { icon: '🟨', cls: 'yellow-card' },
      'red-cards':     { icon: '🟥', cls: 'red-card' },
      'substitutions': { icon: '🔄', cls: '' },
    };
    const evType = (ev.type || '').toLowerCase().replace(/ /g, '-');
    const { icon = '•', cls = '' } = Object.entries(iconMap).find(([k]) => evType.includes(k))?.[1] ?? {};

    const subIn = ev.playerInName ? `<div style="font-size:11px;color:var(--win)">↑ ${esc(ev.playerInName)}</div>` : '';

    return `<div class="event-item reveal ${isHome ? 'home-event' : 'away-event'}">
      <span class="event-minute">${esc(String(ev.minute || ''))}'</span>
      <div class="event-icon ${cls}">${icon}</div>
      <div>
        <div class="event-player">${esc(ev.playerName || ev.playerId || '—')}</div>
        ${subIn}
        ${ev.description ? `<div class="event-detail">${esc(ev.description)}</div>` : ''}
      </div>
    </div>`;
  }).join('');

  return `<div class="events-section">
    ${half1.length ? renderHalf(half1) : ''}
    <div class="event-divider">Half Time</div>
    ${half2.length ? renderHalf(half2) : ''}
  </div>`;
}

function renderLineups(lineups, match) {
  if (!lineups.length) return '<div class="empty-state" style="padding:40px"><p>No lineup data available</p></div>';

  const homePlayers = lineups.filter(p => String(p.clubId) === String(match.homeClubId));
  const awayPlayers = lineups.filter(p => String(p.clubId) === String(match.awayClubId));

  const renderCol = (players) => players.slice(0, 20).map(p =>
    `<div class="lineup-player">
      <span class="lineup-number">${esc(String(p.jerseyNumber || ''))}</span>
      <span>${esc(p.playerName || p.playerId || '—')}</span>
    </div>`
  ).join('');

  return `<div class="lineups-section">
    <div class="lineup-grid">
      <div class="lineup-col">
        <div class="lineup-header">${esc(match.homeClubName)}</div>
        ${renderCol(homePlayers)}
      </div>
      <div class="lineup-col">
        <div class="lineup-header">${esc(match.awayClubName)}</div>
        ${renderCol(awayPlayers)}
      </div>
    </div>
  </div>`;
}

function closeDetail() {
  document.getElementById('detail-panel').classList.add('hidden');
  document.getElementById('app-layout').classList.remove('panel-open');
  document.querySelectorAll('.match-card-v2').forEach(c => c.classList.remove('active'));
}

// ── Tab Switching ──────────────────────────────────────────────
function switchTab(tab) {
  currentTab = tab;
  ['matches','standings','market'].forEach(t => {
    document.getElementById(`tab-${t}`)?.classList?.toggle('active', t === tab);
    document.getElementById(`view-${t}`)?.classList?.toggle('hidden', t !== tab);
  });
  closeDetail();
  if (tab === 'standings') loadStandings();
  else if (tab === 'market') loadMarket();
  else loadMatches();
}

// ── Standings ──────────────────────────────────────────────────
async function loadStandings() {
  const el = document.getElementById('standings-container');
  if (!currentCompId || !currentSeason) {
    el.innerHTML = '<div class="empty-state"><p>Select a competition and season to view standings</p></div>';
    return;
  }
  el.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Building table...</p></div>';
  try {
    const r = await fetch(`/api/standings?competitionId=${encodeURIComponent(currentCompId)}&season=${encodeURIComponent(currentSeason)}`);
    let rows = await r.json();

    // If API has no data, try supplemental web-sourced data
    let isSupplemental = false;
    if (!rows.length) {
      const key = `${currentCompId}_${currentSeason}`;
      rows = SUPPLEMENTAL_STANDINGS[key] || [];
      isSupplemental = rows.length > 0;
    }

    if (!rows.length) {
      el.innerHTML = '<div class="empty-state"><p>No standings data available for this competition</p><p style="font-size:11px;color:var(--text-muted);margin-top:8px">Try the Premier League, LaLiga, Bundesliga, Serie A or Ligue 1 for 2025</p></div>';
      return;
    }

    const title = document.getElementById('comp-title').textContent;
    const sourceTag = isSupplemental
      ? `<span style="font-size:10px;font-weight:600;padding:2px 8px;border-radius:3px;background:rgba(76,175,125,0.12);color:var(--win);margin-left:8px;">WEB SOURCED</span>`
      : '';

    el.innerHTML = `
      <div class="standings-card">
        <div class="standings-title">${esc(title)} — ${esc(currentSeason)} ${sourceTag}</div>
        <table class="standings-table">
          <thead><tr>
            <th>#</th><th>Club</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th>
          </tr></thead>
          <tbody>
            ${rows.map((s, i) => `<tr>
              <td class="standing-pos">${i+1}</td>
              <td class="standing-team">${esc(s.clubName)}</td>
              <td>${s.played}</td><td>${s.won}</td><td>${s.drawn}</td><td>${s.lost}</td>
              <td>${s.goalsFor}</td><td>${s.goalsAgainst}</td>
              <td style="color:${s.goalDifference >= 0 ? 'var(--win)' : 'var(--loss)'}">${s.goalDifference >= 0 ? '+' : ''}${s.goalDifference}</td>
              <td class="standing-pts">${s.points}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>`;
    // Stagger-animate table rows
    observeElements('.standings-table tbody tr', el);
  } catch (_) {
    el.innerHTML = '<div class="empty-state"><p>Failed to load standings</p></div>';
  }
}

// ── Market ─────────────────────────────────────────────────────
async function loadMarket() {
  const el = document.getElementById('market-container');
  el.innerHTML = '<div class="loading-state" style="grid-column:1/-1"><div class="spinner"></div><p>Loading market data...</p></div>';
  try {
    const [playersR, clubsR] = await Promise.all([
      fetch('/api/analytics/top-players?limit=15'),
      fetch('/api/analytics/top-clubs?limit=15'),
    ]);
    const players = await playersR.json();
    const clubs   = await clubsR.json();

    const maxPVal = Math.max(...players.map(p => parseInt(p.marketValueInEur) || 0), 1);
    const maxCVal = Math.max(...clubs.map(c => parseInt(c.totalMarketValue?.replace?.(/[^0-9]/g,'')) || 0), 1);

    const playerRows = players.map((p, i) => {
      const val = parseInt(p.marketValueInEur) || 0;
      const pct = (val / maxPVal * 100).toFixed(1);
      return `<div class="analytics-row">
        <div class="analytics-rank">${i+1}</div>
        <div class="analytics-item-info">
          <div class="analytics-item-name">${esc(p.name)}</div>
          <div class="analytics-item-sub">${esc(p.position || '')} · ${esc(p.currentClubName || '')}</div>
          <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
        </div>
        <div class="analytics-value">${fmtVal(val)}</div>
      </div>`;
    }).join('');

    const clubRows = clubs.map((c, i) => {
      const raw = String(c.totalMarketValue || '').replace(/[^0-9]/g, '');
      const val = parseInt(raw) || 0;
      const pct = (val / maxCVal * 100).toFixed(1);
      return `<div class="analytics-row">
        <div class="analytics-rank">${i+1}</div>
        <div class="analytics-item-info">
          <div class="analytics-item-name">${esc(c.name)}</div>
          <div class="analytics-item-sub">${esc(c.domesticCompetitionId || '')} · ${esc(c.squadSize ? c.squadSize + ' players' : '')}</div>
          <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
        </div>
        <div class="analytics-value">${fmtVal(val)}</div>
      </div>`;
    }).join('');

    el.innerHTML = `
      <div class="analytics-card">
        <div class="analytics-card-header"><span class="analytics-card-title">Top Players by Value</span></div>
        <div class="analytics-card-body">${playerRows}</div>
      </div>
      <div class="analytics-card">
        <div class="analytics-card-header"><span class="analytics-card-title">Top Clubs by Value</span></div>
        <div class="analytics-card-body">${clubRows}</div>
      </div>`;
    // Stagger-animate analytics rows
    observeElements('.analytics-row', el);
  } catch (_) {
    el.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><p>Failed to load market data</p></div>';
  }
}

// ── Utilities ──────────────────────────────────────────────────
function esc(s) {
  if (!s) return '';
  return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

function formatDateLabel(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      weekday: 'short', day: 'numeric', month: 'long', year: 'numeric'
    });
  } catch (_) { return dateStr; }
}

function fmtVal(v) {
  if (!v) return '—';
  if (v >= 1e9) return '€' + (v/1e9).toFixed(2) + 'B';
  if (v >= 1e6) return '€' + (v/1e6).toFixed(1) + 'M';
  if (v >= 1e3) return '€' + (v/1e3).toFixed(0) + 'K';
  return '€' + v;
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}
