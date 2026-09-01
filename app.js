(function(){

  const COLORS = {
    lavender: 'var(--c-lavender)', sage: 'var(--c-sage)', clay: 'var(--c-clay)',
    denim: 'var(--c-denim)', berry: 'var(--c-berry)', olive: 'var(--c-olive)'
  };
  const COLOR_KEYS = Object.keys(COLORS);
  const EMOJIS = ['💪','🏃','🧘','💻','📚','🎨','🎵','🥗','😴','🚭','💧','✍️'];
  const WEEKS_SHOWN = 26;

  const CHECK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
  const BACK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>';
  const CHEV_L = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>';
  const CHEV_R = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';
  const TRASH_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path></svg>';
  const SHARE_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>';
  const PLUS_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>';
  const SUN_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
  const MOON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
  const USER_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
  const FLAME_SVG = '<svg viewBox="0 0 90 106" xmlns="http://www.w3.org/2000/svg"><path d="M45 4C40 20 20 28 20 54c0 20 14 36 25 36s25-16 25-36c0-10-4-16-8-21 1 8-3 13-7 13-5 0-6-5-4-11-8 5-11 14-11 22 0 8 5 14 11 15-8 1-17-8-17-22C34 30 45 18 45 4z" fill="url(#flameGrad)"/><defs><linearGradient id="flameGrad" x1="45" y1="4" x2="45" y2="90" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="var(--flame-1)"/><stop offset="1" stop-color="var(--flame-2)"/></linearGradient></defs></svg>';

  const DOW_LETTERS = ['S','M','T','W','T','F','S'];
  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  function pad(n){ return n < 10 ? '0'+n : ''+n; }
  function keyOf(d){ return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()); }
  function startOfDay(d){ const n = new Date(d); n.setHours(0,0,0,0); return n; }
  function addDays(d, n){ const c = new Date(d); c.setDate(c.getDate()+n); return c; }
  function today(){ return startOfDay(new Date()); }

  let habits = [];
  let profile = null;
  let theme = 'light';
  let activeHabitId = null;
  let calMonthOffset = 0;
  let activityYear = new Date().getFullYear();
  let pendingEmoji = EMOJIS[0];
  let pendingColor = COLOR_KEYS[0];
  const HABITS_KEY = 'habits-v1';
  const SETTINGS_KEY = 'settings-v1';

  function computeStreak(habit){
    const dates = Array.from(new Set(habit.dates || [])).filter(Boolean).sort();
    if(dates.length === 0) return 0;

    const set = new Set(dates);
    let streak = 1;
    let cursor = startOfDay(new Date(dates[dates.length - 1] + 'T00:00:00'));
    cursor = addDays(cursor, -1);

    while(set.has(keyOf(cursor))){
      streak++;
      cursor = addDays(cursor, -1);
    }
    return streak;
  }
  function isDoneToday(habit){ return habit.dates.includes(keyOf(today())); }

  // Use the host's window.storage when available, with localStorage as a normal-browser fallback.
  // This keeps the app usable on Vercel and in VS Code Live Server / Live Preview.
  const storageAdapter = {
    async get(key){
      if(window.storage && typeof window.storage.get === 'function'){
        return await window.storage.get(key, false);
      }
      const value = localStorage.getItem(key);
      return value === null ? null : { value };
    },
    async set(key, value){
      if(window.storage && typeof window.storage.set === 'function'){
        return await window.storage.set(key, value, false);
      }
      localStorage.setItem(key, value);
    }
  };

  async function loadAll(){
    try{
      const res = await storageAdapter.get(HABITS_KEY);
      habits = (res && res.value) ? JSON.parse(res.value) : [];
    }catch(e){ habits = []; }

    try{
      const res = await storageAdapter.get(SETTINGS_KEY);
      const settings = (res && res.value) ? JSON.parse(res.value) : {};
      profile = settings.name ? { name: settings.name } : null;
      theme = settings.theme === 'dark' ? 'dark' : (settings.theme === 'light' ? 'light' :
        (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
    }catch(e){
      theme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    }
  }

  async function saveHabits(){
    try{ await storageAdapter.set(HABITS_KEY, JSON.stringify(habits)); }
    catch(e){ showToast("Couldn't save — changes may not persist"); }
  }
  async function saveSettings(){
    try{ await storageAdapter.set(SETTINGS_KEY, JSON.stringify({ name: profile ? profile.name : null, theme })); }
    catch(e){ /* non-critical */ }
  }

  let toastTimer = null;
  function showToast(msg){
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=> el.classList.remove('show'), 2200);
  }

  function applyTheme(){
    document.documentElement.setAttribute('data-theme', theme);
  }

  function renderShell(){
    applyTheme();
    const shell = document.getElementById('appShell');
    shell.innerHTML = `
      <div class="screen active" id="homeScreen"></div>
      <div class="screen" id="detailScreen"></div>
      <footer class="credit-footer" aria-label="About the creator">
        <div class="credit-copy">
          <p class="credit-label">Made by</p>
          <p class="credit-name">Shirsho Tarafdar</p>
        </div>
        <div class="social-links">
          <a class="social-link" href="https://github.com/5hir-shoT" target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .7a11.3 11.3 0 0 0-3.57 22.02c.57.1.78-.25.78-.55v-2.02c-3.17.69-3.84-1.34-3.84-1.34-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.67 1.25 3.32.95.1-.74.4-1.25.72-1.54-2.53-.29-5.18-1.27-5.18-5.66 0-1.25.45-2.26 1.18-3.06-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.12 1.17A10.8 10.8 0 0 1 12 5.95c.97 0 1.94.13 2.85.4 2.16-1.48 3.12-1.17 3.12-1.17.62 1.57.23 2.73.11 3.02.73.8 1.18 1.81 1.18 3.06 0 4.4-2.66 5.36-5.2 5.64.41.36.77 1.07.77 2.16v3.21c0 .3.21.66.79.55A11.3 11.3 0 0 0 12 .7Z"/></svg>
          </a>
          <a class="social-link linkedin" href="https://www.linkedin.com/in/shirsho-tarafdar/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.45 20.45h-3.56v-5.58c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.68H9.34V8.99h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.29ZM5.32 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM3.54 8.99H7.1v11.46H3.54V8.99ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46C23.21 24 24 23.23 24 22.27V1.73C24 .77 23.21 0 22.23 0Z"/></svg>
          </a>
        </div>
      </footer>
      <div class="modal-overlay" id="modalOverlay">
        <div class="modal-sheet" id="modalSheet"></div>
      </div>
    `;
    document.getElementById('modalOverlay').addEventListener('click', (e)=>{
      if(e.target.id === 'modalOverlay') closeModal();
    });
    renderHome();
  }

  function renderHome(){
    const el = document.getElementById('homeScreen');
    const activeCount = habits.filter(h => computeStreak(h) > 0).length;
    const dateStr = new Date().toLocaleDateString(undefined, { weekday:'long', month:'long', day:'numeric' });
    const greeting = profile && profile.name ? `Hi, ${escapeHtml(profile.name)}` : 'Your habits';

    let listHtml;
    if(habits.length === 0){
      listHtml = `
        <div class="empty-state">
          <button class="add-card empty-add" id="addBtnEmpty" aria-label="Add a habit">
            <span class="add-card-box">${PLUS_SVG}</span>
            <span>Add habit</span>
          </button>
          <p>No habits yet. Add your first one to start a streak.</p>
        </div>
      `;
    }else{
      listHtml = `<div class="habit-list">` +
        habits.map(h => habitCardHtml(h)).join('') +
        `<button class="add-card" id="addBtn" aria-label="Add a habit">
          <span class="add-card-box">${PLUS_SVG}</span>
          <span>Add habit</span>
        </button>` +
        `<div class="activity-year-control">
          <button class="year-nav" id="yearPrev" title="Previous year">${CHEV_L}</button>
          <div class="activity-year">${activityYear}</div>
          <button class="year-nav ${activityYear >= new Date().getFullYear() ? 'disabled' : ''}" id="yearNext" title="Next year">${CHEV_R}</button>
        </div>` +
        `</div>`;
    }

    el.innerHTML = `
      <div class="home-header">
        <div>
          <h1>${greeting}</h1>
          <p>${dateStr}</p>
        </div>
        <div class="header-right">
          <div class="header-icons">
            <button class="icon-btn" id="themeBtn" title="Toggle theme">${theme === 'dark' ? SUN_SVG : MOON_SVG}</button>
            <button class="icon-btn" id="accountBtn" title="Account">${USER_SVG}</button>
          </div>
          ${habits.length ? `<div class="header-flame"><span class="mini-flame">🔥</span> ${activeCount} active</div>` : ''}
        </div>
      </div>
      ${listHtml}
    `;

    const addBtn = document.getElementById('addBtn') || document.getElementById('addBtnEmpty');
    if(addBtn) addBtn.addEventListener('click', openAddModal);
    const yearPrev = document.getElementById('yearPrev');
    const yearNext = document.getElementById('yearNext');
    if(yearPrev) yearPrev.addEventListener('click', ()=>{ activityYear--; renderHome(); });
    if(yearNext) yearNext.addEventListener('click', ()=>{ if(activityYear < new Date().getFullYear()){ activityYear++; renderHome(); } });
    document.getElementById('themeBtn').addEventListener('click', toggleTheme);
    document.getElementById('accountBtn').addEventListener('click', openAccountModal);

    habits.forEach(h => {
      const card = document.getElementById('card-'+h.id);
      if(card) card.addEventListener('click', (e)=>{
        if(e.target.closest('.check-btn') || e.target.closest('.habit-delete')) return;
        openDetail(h.id);
      });

      const del = document.getElementById('delete-'+h.id);
      if(del) del.addEventListener('click', (e)=>{
        e.stopPropagation();
        deleteHabit(h.id);
      });

      const check = document.getElementById('check-'+h.id);
      if(check) check.addEventListener('click', (e)=>{
        e.stopPropagation();
        toggleToday(h.id);
      });
    });

    positionActivityGrids();
  }

  function habitCardHtml(h){
    const streak = computeStreak(h);
    const done = isDoneToday(h);
    const color = COLORS[h.color];
    return `
      <div class="habit-card" id="card-${h.id}">
        <div class="habit-top">
          <div class="habit-icon" style="background:${color}22;">${h.emoji}</div>
          <div class="habit-meta">
            <p class="habit-name">${escapeHtml(h.name)}</p>
            <div class="habit-streak"><span class="mini-flame ${done ? '' : 'dull'}" id="flame-${h.id}">🔥</span> ${streak} day${streak===1?'':'s'}</div>
          </div>
          <div class="habit-actions">
            <button class="habit-delete" id="delete-${h.id}" title="Delete habit" aria-label="Delete ${escapeHtml(h.name)}">
              ${TRASH_SVG}
            </button>
            <button class="check-btn ${done ? 'done':''}" id="check-${h.id}" style="--habit-color:${color};" title="Mark today complete" aria-label="Mark today complete">
              ${CHECK_SVG}
            </button>
          </div>
        </div>
        ${heatGridHtml(h)}
      </div>
    `;
  }

  function heatGridHtml(h){
    const set = new Set(h.dates);
    const color = COLORS[h.color];
    const year = activityYear;
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31);
    const gridStart = addDays(yearStart, -yearStart.getDay());
    const gridEnd = addDays(yearEnd, 6 - yearEnd.getDay());
    const weeks = Math.ceil((gridEnd - gridStart) / (7 * 24 * 60 * 60 * 1000));

    let cells = '';
    for(let i = 0; i < weeks * 7; i++){
      const d = addDays(gridStart, i);
      const inYear = d >= yearStart && d <= yearEnd;
      const on = inYear && set.has(keyOf(d));
      cells += `<div class="activity-cell${inYear ? '' : ' outside-year'}" title="${keyOf(d)}" style="${on ? `background:${color};` : ''}"></div>`;
    }

    let labels = '';
    for(let month = 0; month < 12; month++){
      const monthStart = new Date(year, month, 1);
      const nextMonthStart = new Date(year, month + 1, 1);
      const startWeek = Math.floor((monthStart - gridStart) / (7 * 24 * 60 * 60 * 1000));
      const nextWeek = month === 11 ? weeks : Math.floor((nextMonthStart - gridStart) / (7 * 24 * 60 * 60 * 1000));
      const span = Math.max(1, nextWeek - startWeek);
      labels += `<span class="activity-month" style="grid-column:${startWeek + 1} / span ${span}">${MONTH_NAMES[month].slice(0,3)}</span>`;
    }

    return `
      <div class="activity-wrap" data-habit-id="${h.id}">
        <div class="activity-grid" style="grid-template-columns:repeat(${weeks},10px);">${cells}</div>
        <div class="activity-months" style="grid-template-columns:repeat(${weeks},13px);">${labels}</div>
      </div>
    `;
  }

  function getLatestLoggedDateInYear(habit, year){
    const dates = (habit.dates || []).filter(k => k && k.slice(0,4) === String(year)).sort();
    return dates.length ? dates[dates.length - 1] : null;
  }

  function scrollActivityGridToDate(habit, dateKey){
    const wrap = document.querySelector(`.activity-wrap[data-habit-id="${habit.id}"]`);
    if(!wrap || !dateKey) return;

    const d = new Date(dateKey + 'T00:00:00');
    const yearStart = new Date(activityYear, 0, 1);
    const gridStart = addDays(yearStart, -yearStart.getDay());
    const weekIndex = Math.floor((startOfDay(d) - gridStart) / (7 * 24 * 60 * 60 * 1000));
    const step = 13; // 10px cell + 3px gap
    const target = Math.max(0, weekIndex * step - step * 4);
    const maxScroll = Math.max(0, wrap.scrollWidth - wrap.clientWidth);
    wrap.scrollLeft = Math.min(target, maxScroll);
  }

  function positionActivityGrids(){
    requestAnimationFrame(()=>{
      habits.forEach(h => {
        const latest = getLatestLoggedDateInYear(h, activityYear);
        if(latest) scrollActivityGridToDate(h, latest);
      });
    });
  }

  function toggleTheme(){
    theme = theme === 'dark' ? 'light' : 'dark';
    applyTheme();
    saveSettings();
    renderHome();
    if(activeHabitId){ document.getElementById('detailScreen').classList.add('active'); document.getElementById('homeScreen').classList.remove('active'); renderDetail(); }
  }

  function toggleToday(id){
    const h = habits.find(x => x.id === id);
    if(!h) return;
    const k = keyOf(today());
    const wasOn = h.dates.includes(k);
    if(wasOn) h.dates.splice(h.dates.indexOf(k), 1);
    else h.dates.push(k);
    saveHabits();
    renderHome();
    const btn = document.getElementById('check-'+id);
    if(btn){ btn.classList.add('pulse'); setTimeout(()=>btn.classList.remove('pulse'), 320); }
    if(!wasOn){
      const flame = document.getElementById('flame-'+id);
      if(flame){
        flame.classList.add('flare');
        flame.addEventListener('animationend', function h1(){ flame.classList.remove('flare'); flame.removeEventListener('animationend', h1); });
      }
    }
  }

  function escapeHtml(s){
    return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  /* ---------- Detail ---------- */
  function openDetail(id){
    activeHabitId = id;
    calMonthOffset = 0;
    document.getElementById('homeScreen').classList.remove('active');
    document.getElementById('detailScreen').classList.add('active');
    renderDetail();
  }
  function closeDetail(){
    activeHabitId = null;
    document.getElementById('detailScreen').classList.remove('active');
    document.getElementById('homeScreen').classList.add('active');
    renderHome();
  }

  function renderDetail(){
    const h = habits.find(x => x.id === activeHabitId);
    if(!h) return closeDetail();
    const el = document.getElementById('detailScreen');
    const streak = computeStreak(h);
    const color = COLORS[h.color];

    el.innerHTML = `
      <div class="detail-top">
        <div class="icon-btn" id="backBtn">${BACK_SVG}</div>
        <div class="icon-btn" id="deleteBtn">${TRASH_SVG}</div>
      </div>
      <div class="detail-habit-title">
        <span class="emoji">${h.emoji}</span>
        <span class="name">${escapeHtml(h.name)}</span>
      </div>
      <div class="hero">
        <div class="flame-icon ${isDoneToday(h) ? '' : 'dull'}" id="heroFlame">${FLAME_SVG}</div>
        <p class="hero-number">${streak}</p>
        <p class="hero-label">DAY${streak===1?'':'S'} CONSISTENT</p>
      </div>
      <div class="section-card" id="calSection">
        <p class="section-label">STREAK CALENDAR — tap a day to log it</p>
        ${calendarHtml(h)}
      </div>
      <div class="detail-actions">
        <button class="ghost-btn" id="shareBtn">${SHARE_SVG} Share</button>
      </div>
    `;

    document.getElementById('backBtn').addEventListener('click', closeDetail);
    document.getElementById('deleteBtn').addEventListener('click', ()=> deleteHabit(h.id));
    document.getElementById('shareBtn').addEventListener('click', ()=> shareHabit(h, streak));
    const prevBtn = document.getElementById('calPrev');
    const nextBtn = document.getElementById('calNext');
    if(prevBtn) prevBtn.addEventListener('click', ()=>{ calMonthOffset--; renderDetail(); });
    if(nextBtn) nextBtn.addEventListener('click', ()=>{ if(calMonthOffset < 0){ calMonthOffset++; renderDetail(); } });

    document.querySelectorAll('#detailScreen .cal-day[data-date]').forEach(elm=>{
      elm.addEventListener('click', ()=> handleDayToggle(elm.dataset.date));
    });
  }

  function handleDayToggle(dateKey){
    const h = habits.find(x => x.id === activeHabitId);
    if(!h) return;
    const wasOn = h.dates.includes(dateKey);
    if(wasOn) h.dates.splice(h.dates.indexOf(dateKey), 1);
    else h.dates.push(dateKey);
    saveHabits();
    const isToday = dateKey === keyOf(today());
    renderDetail();
    if(!wasOn && isToday){
      const flame = document.getElementById('heroFlame');
      if(flame){
        flame.classList.add('flare');
        flame.addEventListener('animationend', function h1(){ flame.classList.remove('flare'); flame.removeEventListener('animationend', h1); });
      }
    }
  }

  function calendarHtml(h){
    const set = new Set(h.dates);
    const color = COLORS[h.color];
    const t = today();
    const viewDate = new Date(t.getFullYear(), t.getMonth() + calMonthOffset, 1);
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDow = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let dowRow = DOW_LETTERS.map(l => `<div class="cal-dow">${l}</div>`).join('');
    let dayCells = '';
    for(let i = 0; i < firstDow; i++) dayCells += `<div class="cal-day empty"></div>`;
    for(let day = 1; day <= daysInMonth; day++){
      const d = new Date(year, month, day);
      const k = keyOf(d);
      const on = set.has(k);
      const isToday = k === keyOf(t);
      const isFuture = d > t;
      let classes = 'cal-day';
      if(on) classes += ' filled';
      if(isToday) classes += ' today-outline';
      if(isFuture) classes += ' future';
      dayCells += `<div class="${classes}" ${isFuture ? '' : `data-date="${k}"`} style="${on ? `--habit-color:${color};` : ''}">${day}</div>`;
    }

    const canGoNext = calMonthOffset < 0;
    return `
      <div class="cal-header">
        <div class="cal-nav" id="calPrev">${CHEV_L}</div>
        <div class="cal-title">${MONTH_NAMES[month].toUpperCase()} ${year}</div>
        <div class="cal-nav ${canGoNext ? '' : 'disabled'}" id="calNext">${CHEV_R}</div>
      </div>
      <div class="cal-grid">${dowRow}${dayCells}</div>
    `;
  }

  function openConfirmModal({ title, message, confirmLabel, onConfirm }){
    const overlay = document.getElementById('modalOverlay');
    const sheet = document.getElementById('modalSheet');
    sheet.innerHTML = `
      <h2>${title}</h2>
      <p class="modal-sub">${message}</p>
      <div class="modal-btns">
        <button class="btn-secondary" id="confirmCancelBtn">Cancel</button>
        <button class="btn-primary btn-danger" id="confirmOkBtn">${confirmLabel}</button>
      </div>
    `;
    overlay.classList.add('open');
    document.getElementById('confirmCancelBtn').addEventListener('click', closeModal);
    document.getElementById('confirmOkBtn').addEventListener('click', onConfirm);
  }

  function deleteHabit(id){
    const h = habits.find(x => x.id === id);
    if(!h) return;
    openConfirmModal({
      title: 'Delete habit?',
      message: `This removes "${escapeHtml(h.name)}" and all of its history. This can't be undone.`,
      confirmLabel: 'Delete',
      onConfirm: ()=>{
        habits = habits.filter(x => x.id !== id);
        saveHabits();
        closeModal();
        closeDetail();
        showToast('Habit deleted');
      }
    });
  }

  function clearAllHabits(){
    if(habits.length === 0){ showToast('Nothing to clear'); return; }
    openConfirmModal({
      title: 'Clear all habits?',
      message: `This deletes every habit and all history so you can start fresh. This can't be undone.`,
      confirmLabel: 'Clear all',
      onConfirm: ()=>{
        habits = [];
        saveHabits();
        closeModal();
        renderHome();
        showToast('All habits cleared');
      }
    });
  }

  function shareHabit(h, streak){
    const text = `🔥 ${streak} day${streak===1?'':'s'} consistent with ${h.name}!`;
    try{
      if(navigator.share){ navigator.share({ text }).catch(()=> showToast(text)); }
      else if(navigator.clipboard){ navigator.clipboard.writeText(text).then(()=> showToast('Copied to clipboard')).catch(()=> showToast(text)); }
      else{ showToast(text); }
    }catch(e){ showToast(text); }
  }

  /* ---------- Add habit modal ---------- */
  function openAddModal(){
    pendingEmoji = EMOJIS[0];
    pendingColor = COLOR_KEYS[0];
    const overlay = document.getElementById('modalOverlay');
    const sheet = document.getElementById('modalSheet');
    sheet.innerHTML = `
      <h2>New habit</h2>
      <span class="field-label">Name</span>
      <input class="name-input" id="habitNameInput" placeholder="e.g. Read 10 pages" maxlength="30" />
      <span class="field-label">Icon</span>
      <div class="emoji-row" id="emojiRow">
        ${EMOJIS.map((e,i) => `<div class="emoji-opt ${i===0?'selected':''}" data-emoji="${e}">${e}</div>`).join('')}
      </div>
      <span class="field-label">Color</span>
      <div class="color-row" id="colorRow">
        ${COLOR_KEYS.map((c,i) => `<div class="color-opt ${i===0?'selected':''}" data-color="${c}" style="background:${COLORS[c]};"></div>`).join('')}
      </div>
      <div class="modal-btns">
        <button class="btn-secondary" id="cancelBtn">Cancel</button>
        <button class="btn-primary" id="createBtn" disabled>Add habit</button>
      </div>
    `;
    overlay.classList.add('open');

    const nameInput = document.getElementById('habitNameInput');
    const createBtn = document.getElementById('createBtn');
    nameInput.addEventListener('input', ()=>{ createBtn.disabled = nameInput.value.trim().length === 0; });
    document.getElementById('emojiRow').addEventListener('click', (e)=>{
      const opt = e.target.closest('.emoji-opt'); if(!opt) return;
      pendingEmoji = opt.dataset.emoji;
      document.querySelectorAll('.emoji-opt').forEach(x => x.classList.remove('selected'));
      opt.classList.add('selected');
    });
    document.getElementById('colorRow').addEventListener('click', (e)=>{
      const opt = e.target.closest('.color-opt'); if(!opt) return;
      pendingColor = opt.dataset.color;
      document.querySelectorAll('.color-opt').forEach(x => x.classList.remove('selected'));
      opt.classList.add('selected');
    });
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    document.getElementById('createBtn').addEventListener('click', ()=>{
      const name = nameInput.value.trim();
      if(!name) return;
      habits.push({ id: 'h'+Date.now(), name, emoji: pendingEmoji, color: pendingColor, dates: [] });
      saveHabits();
      closeModal();
      renderHome();
      showToast('Habit added');
    });
    setTimeout(()=> nameInput.focus(), 200);
  }

  /* ---------- Account modal (optional, local personalization only) ---------- */
  function openAccountModal(){
    const overlay = document.getElementById('modalOverlay');
    const sheet = document.getElementById('modalSheet');

    if(profile && profile.name){
      sheet.innerHTML = `
        <h2>Account</h2>
        <p class="modal-sub">This is a local personalization only — there's no real account system here.</p>
        <div class="account-row">
          <div class="avatar-circle">${escapeHtml(profile.name.trim()[0] || '?').toUpperCase()}</div>
          <div>
            <p style="margin:0;font-weight:600;font-size:15px;">${escapeHtml(profile.name)}</p>
            <p style="margin:0;font-size:12.5px;color:var(--ink-muted);">Signed in on this device</p>
          </div>
        </div>
        <div class="modal-btns">
          <button class="btn-secondary" id="signOutBtn">Sign out</button>
          <button class="btn-primary" id="doneBtn">Done</button>
        </div>
        <hr class="modal-divider">
        <button class="danger-link" id="clearDataBtn">Clear all habit data</button>
      `;
      overlay.classList.add('open');
      document.getElementById('doneBtn').addEventListener('click', closeModal);
      document.getElementById('signOutBtn').addEventListener('click', ()=>{
        profile = null;
        saveSettings();
        closeModal();
        renderHome();
        showToast('Signed out');
      });
      document.getElementById('clearDataBtn').addEventListener('click', clearAllHabits);
    }else{
      sheet.innerHTML = `
        <h2>Personalize (optional)</h2>
        <p class="modal-sub">Add your name for a personal greeting. Streaks works fully without this — no account is required.</p>
        <span class="field-label">Your name</span>
        <input class="name-input" id="profileNameInput" placeholder="e.g. Alex" maxlength="24" />
        <div class="modal-btns">
          <button class="btn-secondary" id="laterBtn">Maybe later</button>
          <button class="btn-primary" id="saveNameBtn" disabled>Save</button>
        </div>
        <hr class="modal-divider">
        <button class="danger-link" id="clearDataBtn">Clear all habit data</button>
      `;
      overlay.classList.add('open');
      const nameInput = document.getElementById('profileNameInput');
      const saveBtn = document.getElementById('saveNameBtn');
      nameInput.addEventListener('input', ()=>{ saveBtn.disabled = nameInput.value.trim().length === 0; });
      document.getElementById('laterBtn').addEventListener('click', closeModal);
      document.getElementById('clearDataBtn').addEventListener('click', clearAllHabits);
      document.getElementById('saveNameBtn').addEventListener('click', ()=>{
        const name = nameInput.value.trim();
        if(!name) return;
        profile = { name };
        saveSettings();
        closeModal();
        renderHome();
        showToast(`Welcome, ${name}`);
      });
      setTimeout(()=> nameInput.focus(), 200);
    }
  }

  function closeModal(){ document.getElementById('modalOverlay').classList.remove('open'); }

  async function init(){
    await loadAll();
    renderShell();
  }
  init();

})();
