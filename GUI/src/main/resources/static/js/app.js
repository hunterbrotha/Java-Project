/* ══════════════════════════════════════════════════════════════
   FootballHub — Sofascore-style App Logic
   ══════════════════════════════════════════════════════════════ */

const API = '';
let allCompetitions = [];
let currentCompId = '';
let currentSeason = '';
let currentTab = 'matches';
let activeMatchCard = null;

const QUOTES = [
  '"Quality without results is pointless. Results without quality is boring." — Johan Cruyff',
  '"Success is no accident. It is hard work, perseverance, learning, studying, sacrifice." — Pelé',
  '"Some think football is life and death. I assure you, it is much more serious than that." — Bill Shankly',
  '"I am not a perfectionist, but I like to feel that things are done well." — Cristiano Ronaldo',
  '"The more difficult the victory, the greater the happiness in winning." — Pelé',
  '"Every disadvantage has its advantage." — Johan Cruyff'
];

// ── Country flags map ──────────────────────────────────────────
const FLAGS = {
  'Germany': '🇩🇪', 'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Spain': '🇪🇸', 'Italy': '🇮🇹',
  'France': '🇫🇷', 'Netherlands': '🇳🇱', 'Portugal': '🇵🇹', 'Belgium': '🇧🇪',
  'Turkey': '🇹🇷', 'Russia': '🇷🇺', 'Brazil': '🇧🇷', 'Argentina': '🇦🇷',
  'Mexico': '🇲🇽', 'USA': '🇺🇸', 'China': '🇨🇳', 'Japan': '🇯🇵',
  'Australia': '🇦🇺', 'South Korea': '🇰🇷', 'Saudi Arabia': '🇸🇦',
  'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'Austria': '🇦🇹', 'Switzerland': '🇨🇭',
  'Greece': '🇬🇷', 'Denmark': '🇩🇰', 'Sweden': '🇸🇪', 'Norway': '🇳🇴',
  'Poland': '🇵🇱', 'Czech Republic': '🇨🇿', 'Croatia': '🇭🇷',
  'Romania': '🇷🇴', 'Serbia': '🇷🇸', 'Ukraine': '🇺🇦', 'Hungary': '🇭🇺',
  'Slovakia': '🇸🇰', 'Slovenia': '🇸🇮', 'Finland': '🇫🇮', 'Ireland': '🇮🇪',
  'Israel': '🇮🇱', 'Cyprus': '🇨🇾', 'Bulgaria': '🇧🇬', 'Belarus': '🇧🇾',
  'Kazakhstan': '🇰🇿', 'Colombia': '🇨🇴', 'Chile': '🇨🇱', 'Peru': '🇵🇪',
  'Uruguay': '🇺🇾', 'Paraguay': '🇵🇾', 'Bolivia': '🇧🇴', 'Ecuador': '🇪🇨',
  'Venezuela': '🇻🇪', 'Egypt': '🇪🇬', 'Morocco': '🇲🇦', 'Nigeria': '🇳🇬',
  'South Africa': '🇿🇦', 'Cameroon': '🇨🇲', 'Ivory Coast': '🇨🇮',
  'Ghana': '🇬🇭', 'Senegal': '🇸🇳', 'Tunisia': '🇹🇳', 'Algeria': '🇩🇿',
  'Iran': '🇮🇷', 'Qatar': '🇶🇦', 'UAE': '🇦🇪', 'Kuwait': '🇰🇼',
  'India': '🇮🇳', 'Indonesia': '🇮🇩', 'Thailand': '🇹🇭', 'Malaysia': '🇲🇾',
  'Canada': '🇨🇦', 'Costa Rica': '🇨🇷', 'Jamaica': '🇯🇲', 'Honduras': '🇭🇳',
  'Guatemala': '🇬🇹', 'Panama': '🇵🇦', 'New Zealand': '🇳🇿',
  'Luxembourg': '🇱🇺', 'Malta': '🇲🇹', 'Albania': '🇦🇱',
  'Moldova': '🇲🇩', 'Lithuania': '🇱🇹', 'Latvia': '🇱🇻', 'Estonia': '🇪🇪',
  'Bosnia-Herzegovina': '🇧🇦', 'Montenegro': '🇲🇪', 'Macedonia': '🇲🇰',
  'Kosovo': '🇽🇰', 'Georgia': '🇬🇪', 'Armenia': '🇦🇲', 'Azerbaijan': '🇦🇿',
};

const getFlag = (country) => FLAGS[country] || '🏳️';

// ── Event type maps ─────────────────────────────────────────────
const EVENT_ICONS = {
  'Goals': '⚽', 'Cards': '🟨', 'Substitutions': '🔄',
  'Goal': '⚽', 'Yellow Card': '🟨', 'Red Card': '🟥',
  'Substitution': '🔄', 'Penalty': '⚽', 'Own Goal': '⚽'
};

const getEventIcon = (type, desc) => {
  if (!type) return '📌';
  const t = type.toLowerCase();
  if (t.includes('goal')) return '⚽';
  if (t.includes('card')) {
    if (desc && desc.toLowerCase().includes('red')) return '🟥';
    return '🟨';
  }
  if (t.includes('sub')) return '🔄';
  return '📌';
};

const getEventIconClass = (type, desc) => {
  if (!type) return '';
  const t = type.toLowerCase();
  if (t.includes('goal')) return 'goal';
  if (t.includes('card')) {
    if (desc && desc.toLowerCase().includes('red')) return 'red-card';
    return 'yellow-card';
  }
  if (t.includes('sub')) return 'substitution';
  return '';
};

// ── Init ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadCompetitions();
  checkStatus();
  setInterval(checkStatus, 5000);
});

async function checkStatus() {
  try {
    const res = await fetch('/api/status');
    const data = await res.json();
    const pill = document.getElementById('sync-status');
    const text = document.getElementById('sync-text');
    
    if (data.eventsReady && data.lineupsReady) {
      pill.classList.add('ready');
      text.textContent = 'Live Sync Active';
    } else {
      pill.classList.remove('ready');
      text.textContent = 'Indexing...';
    }
  } catch (e) {}
}

function enterDashboard() {
  const welcome = document.getElementById('view-welcome');
  welcome.classList.add('fade-out');
  setTimeout(() => {
    welcome.style.display = 'none';
  }, 800);
}

function rotateQuotes() {
  const qBox = document.querySelector('.welcome-quote-box');
  let i = 0;
  setInterval(() => {
    i = (i + 1) % QUOTES.length;
    qBox.innerHTML = `<p class="welcome-quote">${QUOTES[i]}</p>`;
  }, 12000);
}
document.addEventListener('DOMContentLoaded', rotateQuotes);

// ── Competitions ──────────────────────────────────────────────────
async function loadCompetitions() {
  try {
    const res = await fetch(`${API}/api/competitions`);
    allCompetitions = await res.json();
    renderCompetitions(allCompetitions);
    // auto-load first domestic league
    const firstLeague = allCompetitions.find(c => c.type === 'domestic_league');
    if (firstLeague) selectCompetition(firstLeague);
    else loadMatches();
  } catch (e) {
    showToast('⚠️ Failed to load competitions');
    document.getElementById('competition-list').innerHTML =
      '<div class="empty-state"><span class="emoji">⚠️</span><h3>Connection Error</h3><p>Is the server running?</p></div>';
  }
}

function renderCompetitions(comps) {
  const list = document.getElementById('competition-list');
  if (!comps.length) {
    list.innerHTML = '<div class="empty-state"><span class="emoji">🏆</span><p>No competitions found</p></div>';
    return;
  }

  // Group by country
  const grouped = {};
  comps.forEach(c => {
    const key = c.countryName || 'International';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(c);
  });

  let html = '';
  // Show "All" option
  html += `<div class="comp-item ${currentCompId === '' ? 'active' : ''}" 
               id="comp-all" onclick="selectCompetition(null)">
    <span class="comp-flag">🌍</span>
    <div class="comp-info">
      <div class="comp-name">All Competitions</div>
      <div class="comp-country">Global</div>
    </div>
  </div>`;

  // Sort countries: major leagues first
  const majorLeagues = ['England','Germany','Spain','Italy','France'];
  const sortedKeys = [
    ...majorLeagues.filter(k => grouped[k]),
    ...Object.keys(grouped).filter(k => !majorLeagues.includes(k)).sort()
  ];

  sortedKeys.forEach(country => {
    grouped[country].forEach(c => {
      html += `<div class="comp-item ${currentCompId === c.competitionId ? 'active' : ''}"
                   id="comp-${c.competitionId}"
                   onclick="selectCompetitionById('${c.competitionId}')">
        <span class="comp-flag">${getFlag(c.countryName)}</span>
        <div class="comp-info">
          <div class="comp-name">${escHtml(c.name)}</div>
          <div class="comp-country">${escHtml(c.countryName || 'International')}</div>
        </div>
        ${c.totalClubs ? `<span class="comp-badge">${c.totalClubs}</span>` : ''}
      </div>`;
    });
  });

  list.innerHTML = html;
}

function filterCompetitions() {
  const q = document.getElementById('comp-search').value.toLowerCase();
  const filtered = allCompetitions.filter(c =>
    c.name.toLowerCase().includes(q) || (c.countryName || '').toLowerCase().includes(q)
  );
  renderCompetitions(filtered);
}

function selectCompetitionById(id) {
  const comp = id ? allCompetitions.find(c => c.competitionId === id) : null;
  selectCompetition(comp);
}

function selectCompetition(comp) {
  currentCompId = comp ? comp.competitionId : '';
  currentSeason = '';

  // Update sidebar highlight
  document.querySelectorAll('.comp-item').forEach(el => el.classList.remove('active'));
  const el = document.getElementById(comp ? `comp-${comp.competitionId}` : 'comp-all');
  if (el) el.classList.add('active');

  // Update title
  document.getElementById('comp-title').textContent = comp ? comp.name : 'All Competitions';

  // Load seasons for this comp
  loadSeasons();
}

async function loadSeasons() {
  const sel = document.getElementById('season-select');
  sel.innerHTML = '<option value="">All Seasons</option>';
  try {
    const url = currentCompId ? `/api/seasons?competitionId=${currentCompId}` : '/api/seasons';
    const res = await fetch(url);
    const seasons = await res.json();
    seasons.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s;
      opt.textContent = s;
      sel.appendChild(opt);
    });
    // Select most recent
    if (seasons.length > 0) {
      sel.value = seasons[0];
      currentSeason = seasons[0];
    }
  } catch(e) {}
  
  if (currentTab === 'standings') loadStandings();
  else if (currentTab === 'market') loadMarketView();
  else loadMatches();
}

// ── Matches ───────────────────────────────────────────────────────
async function loadMatches() {
  currentSeason = document.getElementById('season-select').value;
  closeDetail();

  const container = document.getElementById('match-list');
  container.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Loading matches...</p></div>';

  try {
    let url = `/api/matches?`;
    if (currentCompId) url += `competitionId=${encodeURIComponent(currentCompId)}&`;
    if (currentSeason) url += `season=${encodeURIComponent(currentSeason)}`;

    const res = await fetch(url);
    const matches = await res.json();
    renderMatchList(matches);
  } catch (e) {
    container.innerHTML = '<div class="empty-state"><span class="emoji">❌</span><h3>Failed to load matches</h3></div>';
  }
}

function renderMatchList(matches) {
  const container = document.getElementById('match-list');
  if (!matches || matches.length === 0) {
    container.innerHTML = '<div class="empty-state"><span class="emoji">🏟️</span><h3>No matches found</h3><p>Try a different competition or season</p></div>';
    return;
  }

  // Group by date
  const grouped = {};
  matches.forEach(m => {
    const d = m.date ? m.date.split('T')[0].split(' ')[0] : 'Unknown';
    if (!grouped[d]) grouped[d] = [];
    grouped[d].push(m);
  });

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
  let html = '';

  sortedDates.forEach(date => {
    const label = formatDate(date);
    html += `<div class="date-group">
      <div class="date-label">${label}</div>`;

    grouped[date].forEach(m => {
      const hg = m.homeClubGoals ?? 0;
      const ag = m.awayClubGoals ?? 0;
      let result = hg > ag ? 'home-win' : hg < ag ? 'away-win' : 'draw';
      let resultLabel = hg > ag ? 'HW' : hg < ag ? 'AW' : 'D';

      html += `<div class="match-card" id="match-card-${m.gameId}" 
                    onclick="openMatchDetail('${m.gameId}', this)">
        <div class="match-top">
          <span class="match-round">${escHtml(m.round || '')}</span>
          <span class="match-time">${formatTime(m.date)}</span>
        </div>
        <div class="match-teams">
          <div class="team-home">
            <div class="team-name">${escHtml(m.homeClubName || 'Home Team')}</div>
            ${m.homeClubFormation ? `<div class="team-formation">${escHtml(m.homeClubFormation)}</div>` : ''}
          </div>
          <div class="score-block">
            <div class="score-display">
              <span class="score-num">${hg}</span>
              <span class="score-sep">:</span>
              <span class="score-num">${ag}</span>
            </div>
            ${m.aggregate ? `<div class="score-agg">Agg: ${escHtml(m.aggregate)}</div>` : ''}
          </div>
          <div class="team-away">
            <div class="team-name">${escHtml(m.awayClubName || 'Away Team')}</div>
            ${m.awayClubFormation ? `<div class="team-formation">${escHtml(m.awayClubFormation)}</div>` : ''}
          </div>
        </div>
        <div class="match-footer">
          <span class="match-stadium">🏟 ${escHtml(m.stadium || 'Unknown Stadium')}</span>
          ${m.attendance ? `<span class="match-attendance">👥 ${formatNumber(m.attendance)}</span>` : ''}
          <span class="result-badge ${result}">${resultLabel}</span>
        </div>
      </div>`;
    });
    html += '</div>';
  });

  container.innerHTML = html;
}

// ── Match Detail ─────────────────────────────────────────────────
async function openMatchDetail(gameId, cardEl) {
  // Highlight card
  if (activeMatchCard) activeMatchCard.classList.remove('active');
  activeMatchCard = cardEl;
  cardEl.classList.add('active');

  // Show panel
  const panel = document.getElementById('detail-panel');
  panel.classList.remove('hidden');
  document.querySelector('.app-layout').classList.add('panel-open');
  document.getElementById('detail-body').innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Loading match details...</p></div>';

  try {
    const [matchRes, eventsRes, lineupsRes] = await Promise.all([
      fetch(`/api/matches/${gameId}`),
      fetch(`/api/matches/${gameId}/events`),
      fetch(`/api/matches/${gameId}/lineups`)
    ]);

    const match = await matchRes.json();
    const events = await eventsRes.json();
    const lineups = await lineupsRes.json();

    document.getElementById('detail-comp').textContent =
      (match.competitionId || '') + (match.season ? '  •  ' + match.season : '');

    renderMatchDetail(match, events, lineups);
  } catch (e) {
    document.getElementById('detail-body').innerHTML =
      '<div class="empty-state"><span class="emoji">❌</span><h3>Failed to load details</h3></div>';
  }
}

function renderMatchDetail(match, events, lineups) {
  const hg = match.homeClubGoals ?? 0;
  const ag = match.awayClubGoals ?? 0;

  let html = '';

  // Score Hero
  html += `<div class="score-hero">
    <div class="hero-date">${formatDateFull(match.date)}</div>
    <div class="hero-teams">
      <div class="hero-team-home">
        <div class="hero-team-name">${escHtml(match.homeClubName || 'Home')}</div>
        ${match.homeClubFormation ? `<div class="hero-formation">${escHtml(match.homeClubFormation)}</div>` : ''}
      </div>
      <div class="hero-score">
        <span class="hero-score-num" style="color: ${hg > ag ? 'var(--win-color)' : hg === ag ? 'var(--text-primary)' : 'var(--text-secondary)'}">${hg}</span>
        <span class="hero-score-sep">:</span>
        <span class="hero-score-num" style="color: ${ag > hg ? 'var(--win-color)' : ag === hg ? 'var(--text-primary)' : 'var(--text-secondary)'}">${ag}</span>
      </div>
      <div class="hero-team-away">
        <div class="hero-team-name">${escHtml(match.awayClubName || 'Away')}</div>
        ${match.awayClubFormation ? `<div class="hero-formation">${escHtml(match.awayClubFormation)}</div>` : ''}
      </div>
    </div>
    <div class="hero-meta">
      ${match.stadium ? `<span class="hero-meta-item"><span>🏟</span><span>${escHtml(match.stadium)}</span></span>` : ''}
      ${match.attendance ? `<span class="hero-meta-item"><span>👥</span><span>${formatNumber(match.attendance)}</span></span>` : ''}
      ${match.referee ? `<span class="hero-meta-item"><span>🧑‍⚖️</span><span>${escHtml(match.referee)}</span></span>` : ''}
    </div>
  </div>`;

  // Tabs
  html += `<div class="detail-tabs">
    <button class="detail-tab active" id="dtab-events" onclick="switchDetailTab('events')">Timeline</button>
    <button class="detail-tab" id="dtab-lineups" onclick="switchDetailTab('lineups')">Lineups</button>
    <button class="detail-tab" id="dtab-info" onclick="switchDetailTab('info')">Info</button>
  </div>`;

  // Events Tab
  html += `<div id="detail-events" class="events-section">`;
  if (!events || events.length === 0) {
    html += '<div class="empty-state" style="padding:30px"><span class="emoji">📋</span><p>No events recorded</p></div>';
  } else {
    html += `<div class="section-title">Match Timeline</div>`;
    html += `<div class="event-divider">KICK OFF</div>`;

    const homeId = match.homeClubId;
    let htShown = false;

    events.forEach(ev => {
      const min = parseInt(ev.minute) || 0;
      if (!htShown && min > 45) {
        html += `<div class="event-divider">HALF TIME</div>`;
        htShown = true;
      }

      const isHome = ev.clubId === homeId;
      const icon = getEventIcon(ev.type, ev.description);
      const iconClass = getEventIconClass(ev.type, ev.description);

      const playerName = ev.playerName || ev.playerId || 'Unknown';
      const isSub = ev.type && ev.type.toLowerCase().includes('sub');
      const subInLine = isSub && ev.playerInName
        ? `<div class="event-detail" style="color:var(--win-color)">↑ ${escHtml(ev.playerInName)}</div>`
        : '';

      html += `<div class="event-item ${isHome ? 'home-event' : 'away-event'}">
        <span class="event-minute">${ev.minute}'</span>
        <div class="event-icon ${iconClass}">${icon}</div>
        <div class="event-desc">
          <div class="event-player">${escHtml(playerName)}</div>
          ${subInLine}
        </div>
      </div>`;
    });

    html += `<div class="event-divider">FULL TIME</div>`;
  }
  html += '</div>';

  // Lineups Tab
  html += `<div id="detail-lineups" class="lineup-section hidden">`;
  if (!lineups || lineups.length === 0) {
    html += '<div class="empty-state" style="padding:30px"><span class="emoji">👕</span><p>No lineup data</p></div>';
  } else {
    // Split by club
    const clubGroups = {};
    lineups.forEach(p => {
      if (!clubGroups[p.clubId]) clubGroups[p.clubId] = { starting: [], subs: [] };
      if (p.type === 'starting_lineup') clubGroups[p.clubId].starting.push(p);
      else clubGroups[p.clubId].subs.push(p);
    });

    const clubIds = Object.keys(clubGroups);
    clubIds.forEach(cid => {
      const group = clubGroups[cid];
      const teamName = cid === match.homeClubId ? match.homeClubName
                     : cid === match.awayClubId ? match.awayClubName
                     : 'Team';
      const formation = cid === match.homeClubId ? match.homeClubFormation
                      : cid === match.awayClubId ? match.awayClubFormation : '';

      html += `<div class="lineup-team">
        <div class="lineup-team-header">
          <span class="lineup-team-name">${escHtml(teamName)}</span>
          ${formation ? `<span class="lineup-formation-badge">${escHtml(formation)}</span>` : ''}
        </div>`;

      group.starting.sort((a,b) => parseInt(a.number||99) - parseInt(b.number||99))
        .forEach(p => { html += renderPlayerRow(p); });

      if (group.subs.length > 0) {
        html += `<div class="lineup-sub-label">Substitutes</div>`;
        group.subs.forEach(p => { html += renderPlayerRow(p); });
      }

      html += '</div>';
    });
  }
  html += '</div>';

  // Info Tab
  html += `<div id="detail-info" class="events-section hidden">
    <div class="section-title">Match Information</div>
    <div style="display: grid; gap: 10px;">
      ${infoRow('🏆 Competition', match.competitionId)}
      ${infoRow('📅 Season', match.season)}
      ${infoRow('🔄 Round', match.round)}
      ${infoRow('📅 Date', formatDateFull(match.date))}
      ${infoRow('🏟 Stadium', match.stadium)}
      ${infoRow('👥 Attendance', match.attendance ? formatNumber(match.attendance) : '')}
      ${infoRow('🧑‍⚖️ Referee', match.referee)}
      ${infoRow('🏠 Home Manager', match.homeClubManagerName)}
      ${infoRow('✈️ Away Manager', match.awayClubManagerName)}
      ${infoRow('⚽ Aggregate', match.aggregate)}
    </div>
  </div>`;

  document.getElementById('detail-body').innerHTML = html;
}

function infoRow(label, value) {
  if (!value) return '';
  return `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 8px;background:var(--bg-surface);border-radius:6px;font-size:12px;">
    <span style="color:var(--text-muted)">${label}</span>
    <span style="font-weight:600;text-align:right;max-width:60%">${escHtml(String(value))}</span>
  </div>`;
}

function renderPlayerRow(p) {
  const initials = (p.playerName || 'P').split(' ').map(x => x[0]).join('').substring(0, 2).toUpperCase();
  return `<div class="player-row">
    <span class="player-number">${p.number || '-'}</span>
    <div class="player-avatar">${initials}</div>
    <div class="player-info">
      <div class="player-name-row">${escHtml(p.playerName || 'Unknown Player')}</div>
      <div class="player-pos">${escHtml(p.position || '')}</div>
    </div>
    ${p.teamCaptain === '1' ? '<span class="captain-badge">© C</span>' : ''}
  </div>`;
}

function switchDetailTab(tab) {
  ['events', 'lineups', 'info'].forEach(t => {
    document.getElementById(`detail-${t}`)?.classList.toggle('hidden', t !== tab);
    document.getElementById(`dtab-${t}`)?.classList.toggle('active', t === tab);
  });
}

function closeDetail() {
  document.getElementById('detail-panel').classList.add('hidden');
  document.querySelector('.app-layout').classList.remove('panel-open');
  if (activeMatchCard) {
    activeMatchCard.classList.remove('active');
    activeMatchCard = null;
  }
}

// ── Standings ─────────────────────────────────────────────────────
async function loadStandings() {
  const container = document.getElementById('standings-container');
  container.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Building league table...</p></div>';

  if (!currentCompId || !currentSeason) {
    container.innerHTML = '<div class="empty-state"><span class="emoji">📊</span><h3>Select a Competition & Season</h3><p>Choose from the sidebar to view standings</p></div>';
    return;
  }

  try {
    const res = await fetch(`/api/standings?competitionId=${encodeURIComponent(currentCompId)}&season=${encodeURIComponent(currentSeason)}`);
    const standings = await res.json();
    renderStandings(standings);
  } catch (e) {
    container.innerHTML = '<div class="empty-state"><span class="emoji">❌</span><h3>Failed to load standings</h3></div>';
  }
}

function renderStandings(standings) {
  const container = document.getElementById('standings-container');
  if (!standings || standings.length === 0) {
    container.innerHTML = '<div class="empty-state"><span class="emoji">📊</span><h3>No standings data available</h3><p>This competition may not have domestic league format</p></div>';
    return;
  }

  let html = `<table class="standings-table">
    <thead>
      <tr>
        <th>#</th>
        <th>Club</th>
        <th>P</th>
        <th>W</th>
        <th>D</th>
        <th>L</th>
        <th>GF</th>
        <th>GA</th>
        <th>GD</th>
        <th>Pts</th>
      </tr>
    </thead>
    <tbody>`;

  standings.forEach((s, i) => {
    const pos = i + 1;
    let rowClass = '';
    if (pos <= 4) rowClass = 'promotion-zone';
    else if (pos <= 6) rowClass = 'europa-zone';
    else if (pos >= standings.length - 2) rowClass = 'relegation-zone';

    const gdStr = s.goalDifference > 0 ? `+${s.goalDifference}` : String(s.goalDifference);
    const gdClass = s.goalDifference > 0 ? 'positive' : s.goalDifference < 0 ? 'negative' : '';

    html += `<tr class="${rowClass}">
      <td>${pos}</td>
      <td>${escHtml(s.clubName || 'Unknown')}</td>
      <td>${s.played}</td>
      <td>${s.won}</td>
      <td>${s.drawn}</td>
      <td>${s.lost}</td>
      <td>${s.goalsFor}</td>
      <td>${s.goalsAgainst}</td>
      <td class="standing-gd ${gdClass}">${gdStr}</td>
      <td class="standing-pts">${s.points}</td>
    </tr>`;
  });

  html += '</tbody></table>';

  // Legend
  html += `<div style="display:flex;gap:16px;margin-top:14px;flex-wrap:wrap;font-size:11px;color:var(--text-muted);padding:4px 8px;">
    <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;background:var(--win-color);border-radius:2px;display:inline-block"></span>Champions League</span>
    <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;background:var(--draw-color);border-radius:2px;display:inline-block"></span>Europa League</span>
    <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;background:var(--loss-color);border-radius:2px;display:inline-block"></span>Relegation</span>
  </div>`;

  container.innerHTML = html;
}

// ── Tab Switching ─────────────────────────────────────────────────
function switchTab(tab) {
  currentTab = tab;
  document.getElementById('view-matches').classList.toggle('hidden', tab !== 'matches');
  document.getElementById('view-standings').classList.toggle('hidden', tab !== 'standings');
  document.getElementById('view-market').classList.toggle('hidden', tab !== 'market');
  
  // Hide season filter bar on Market tab
  document.getElementById('filter-bar').style.display = (tab === 'market') ? 'none' : 'flex';

  document.getElementById('tab-matches').classList.toggle('active', tab === 'matches');
  document.getElementById('tab-standings').classList.toggle('active', tab === 'standings');
  document.getElementById('tab-market').classList.toggle('active', tab === 'market');

  if (tab === 'standings') loadStandings();
  else if (tab === 'market') loadMarketView();
  else loadMatches();
}

// ── Market / Analytics ─────────────────────────────────────────────
async function loadMarketView() {
  const container = document.getElementById('market-container');
  container.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Analyzing financial data...</p></div>';

  try {
    const [playersRes, clubsRes] = await Promise.all([
      fetch('/api/analytics/top-players?limit=15'),
      fetch('/api/analytics/top-clubs?limit=15')
    ]);

    const players = await playersRes.json();
    const clubs = await clubsRes.json();

    renderMarketView(players, clubs);
  } catch (e) {
    container.innerHTML = '<div class="empty-state"><span class="emoji">📉</span><h3>Analysis Failed</h3></div>';
  }
}

function renderMarketView(players, clubs) {
  const container = document.getElementById('market-container');
  let html = '';

  // Top Players Card
  html += `<div class="analytics-card">
    <div class="analytics-card-header">
      <span class="analytics-card-title">Valuable Players</span>
      <span class="analytics-value-sub">Market Value</span>
    </div>
    <div class="analytics-card-body">`;
  
  const maxPlayerVal = players[0]?.marketValueInEur || 1;
  players.forEach((p, i) => {
    const val = parseInt(p.marketValueInEur);
    const pct = (val / maxPlayerVal) * 100;
    html += `<div class="analytics-row">
      <div class="analytics-rank">${i+1}</div>
      <div class="analytics-item-info">
        <div class="analytics-item-name">${escHtml(p.name)}</div>
        <div class="analytics-item-sub">${escHtml(p.currentClubName || 'Unknown')}</div>
        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${pct}%"></div></div>
      </div>
      <div class="analytics-value-box">
        <div class="analytics-value">${formatCurrency(p.marketValueInEur)}</div>
        <div class="analytics-value-sub">Peak: ${formatCurrency(p.highestMarketValueInEur)}</div>
      </div>
    </div>`;
  });
  html += `</div></div>`;

  // Top Clubs Card
  html += `<div class="analytics-card">
    <div class="analytics-card-header">
      <span class="analytics-card-title">Top Club Valuations</span>
      <span class="analytics-value-sub">Total Squad Value</span>
    </div>
    <div class="analytics-card-body">`;

  const maxClubVal = parseInt(clubs[0]?.totalMarketValue) || 1;
  clubs.forEach((c, i) => {
    const val = parseInt(c.totalMarketValue);
    const pct = (val / maxClubVal) * 100;
    html += `<div class="analytics-row">
      <div class="analytics-rank">${i+1}</div>
      <div class="analytics-item-info">
        <div class="analytics-item-name">${escHtml(c.name)}</div>
        <div class="analytics-item-sub">${c.squadSize || '-'} players • Avg age ${c.averageAge || '-'}</div>
        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${pct}%"></div></div>
      </div>
      <div class="analytics-value-box">
        <div class="analytics-value">${formatCurrency(c.totalMarketValue)}</div>
        <div class="analytics-value-sub">EUR</div>
      </div>
    </div>`;
  });
  html += `</div></div>`;

  container.innerHTML = html;
}

// ── Utilities ─────────────────────────────────────────────────────
function escHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function formatDate(dateStr) {
  if (!dateStr || dateStr === 'Unknown') return 'Unknown Date';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  } catch(e) { return dateStr; }
}

function formatDateFull(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' });
  } catch(e) { return dateStr; }
}

function formatTime(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    const h = d.getHours(), m = d.getMinutes();
    if (h === 0 && m === 0) return '';
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  } catch(e) { return ''; }
}

function formatNumber(n) {
  if (!n) return '';
  return parseInt(n, 10).toLocaleString('en-GB');
}

function formatCurrency(n) {
  if (!n) return '-';
  const val = parseInt(n);
  if (val >= 1000000000) return '€' + (val / 1000000000).toFixed(1) + 'B';
  if (val >= 1000000) return '€' + (val / 1000000).toFixed(1) + 'M';
  if (val >= 1000) return '€' + (val / 1000).toFixed(0) + 'K';
  return '€' + val.toLocaleString();
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}
