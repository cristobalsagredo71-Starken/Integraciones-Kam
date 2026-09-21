// Theme Logic
window.toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
};
document.documentElement.setAttribute('data-theme', localStorage.getItem('theme') || 'dark');

// Tabs
window.switchTab = (tab) => {
    document.getElementById('view-pedidas').style.display = tab === 'pedidas' ? 'block' : 'none';
    document.getElementById('view-kit').style.display = tab === 'kit' ? 'block' : 'none';
    document.getElementById('tab-btn-pedidas').classList.toggle('active', tab === 'pedidas');
    document.getElementById('tab-btn-kit').classList.toggle('active', tab === 'kit');
};

const SUPABASE_URL = 'https://dzmsfxnvfardckddvzjt.supabase.co';
const SUPABASE_KEY = 'sb_publishable_J0eJ5rRXzERV8RxiYk95sg_NTd8JWYN';
const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let initiativesData = [];
let kamsList = new Set();
let selectedKam = 'ALL';

function normalizeKamName(name) {
    return name ? name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim() : '';
}
function toTitleCase(str) {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

async function fetchData() {
    try {
        const { data: resInits, error } = await client
            .from('initiatives')
            .select('*, clients(*)')
            .is('deleted_at', null)
            .order('priority', { ascending: false });
        if (error) throw error;
        
        initiativesData = resInits || [];
        kamsList.clear();
        initiativesData.forEach(i => {
            if (i.clients && i.clients.sponsor) kamsList.add(normalizeKamName(i.clients.sponsor));
        });
        
        renderKamSelector();
        updateView();
    } catch (e) {
        console.error(e);
        document.getElementById('pedidas-container').innerHTML = `<p style="color:var(--danger)">Error: ${e.message}</p>`;
    }
}

function renderKamSelector() {
    const sel = document.getElementById('kam-selector');
    sel.innerHTML = '<option value="ALL">👁️ Visualizar Todas (Sin Filtro de KAM)</option>';
    [...kamsList].sort().forEach(kam => {
        sel.innerHTML += `<option value="${kam}">👤 ${toTitleCase(kam)}</option>`;
    });
    sel.value = selectedKam;
    sel.addEventListener('change', (e) => {
        selectedKam = e.target.value;
        updateView();
    });
}

function renderPhaseProgress(phaseStr, isBlocked) {
    const phases = ['Discovery', 'Diseño', 'Desarrollo', 'QA', 'Go Live'];
    const pMapping = {
        'EVALUACION': 0, 'DISCOVERY': 0,
        'DISENO': 1, 'IMPLEMENTACION': 2,
        'QA': 3, 'GO_LIVE': 4, 'EN_PRODUCCION': 4
    };
    
    let currentIndex = pMapping[phaseStr];
    if (currentIndex === undefined) currentIndex = -1;
    if (phaseStr === 'STANDBY' || isBlocked) {
        // Find the last known phase or just highlight all up to current? Standby is a phase but usually they were in another phase before.
        // If it's just standby, we'll mark the first one as blocked or leave it grey.
        if (currentIndex === -1) currentIndex = 0; // Default to blocked at discovery
    }

    let html = '<div class="phase-progress">';
    for (let i = 0; i < 5; i++) {
        let classes = 'step';
        if (isBlocked && i === currentIndex) {
            classes += ' current blocked';
        } else if (i < currentIndex || phaseStr === 'GO_LIVE' || phaseStr === 'EN_PRODUCCION') {
            classes += ' done';
        } else if (i === currentIndex) {
            classes += ' current';
        }
        
        const style = (isBlocked && i === currentIndex) ? 'style="background:var(--danger)"' : '';
        html += `<div class="${classes}" ${style}></div>`;
    }
    html += '</div><div class="phase-labels">';
    phases.forEach((p, i) => {
        const isActive = (i === currentIndex);
        html += `<span class="${isActive ? 'active-label' : ''}" ${isBlocked && isActive ? 'style="color:var(--danger)"' : ''}>${p}</span>`;
    });
    html += '</div>';
    return html;
}

function updateView() {
    const filtered = selectedKam === 'ALL' 
        ? initiativesData 
        : initiativesData.filter(i => i.clients && normalizeKamName(i.clients.sponsor) === selectedKam);

    // KPIs
    const total = filtered.length;
    const blocked = filtered.filter(i => i.phase === 'STANDBY' || i.bottleneck).length;
    const done = filtered.filter(i => i.phase === 'GO_LIVE' || i.phase === 'EN_PRODUCCION').length;
    const active = total - blocked - done;
    
    document.getElementById('kpi-total').textContent = total;
    document.getElementById('kpi-active').textContent = active;
    document.getElementById('kpi-blocked').textContent = blocked;
    document.getElementById('kpi-done').textContent = done;

    // Alertas
    const alertas = [];
    filtered.forEach(init => {
        if(init.logs) {
            init.logs.forEach(log => {
                if(log.text.includes('ALERTA COMERCIAL')) {
                    alertas.push({ init, log });
                }
            });
        }
    });
    
    const banner = document.getElementById('alerts-banner');
    const alertsContainer = document.getElementById('alerts-container');
    if (alertas.length > 0) {
        banner.style.display = 'block';
        alertsContainer.innerHTML = alertas.sort((a,b) => b.log.date.localeCompare(a.log.date)).map(al => `
            <div class="alert-item">
                <div class="alert-meta">${al.log.date} — <b>${al.init.clients?.name} (${al.init.name})</b></div>
                <div>${al.log.text}</div>
                <button onclick="openModal('${al.init.id}')" style="margin-top: 6px; background:none; border:none; color:var(--danger); text-decoration:underline; cursor:pointer; font-size:0.8rem; padding:0;">Ver Detalles</button>
            </div>
        `).join('');
    } else {
        banner.style.display = 'none';
    }

    // Tarjetas
    const container = document.getElementById('pedidas-container');
    container.innerHTML = '';
    
    if (filtered.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted); grid-column: 1/-1;">No hay integraciones que coincidan con el filtro.</p>';
        return;
    }

    filtered.forEach(init => {
        const isBlocked = init.phase === 'STANDBY' || !!init.bottleneck;
        
        let displayOwner = (init.owner || 'POR DEFINIR').toUpperCase();
        let ownerColorClass = 'owner-ti';
        if (init.phase === 'GO_LIVE' || init.phase === 'EN_PRODUCCION') { displayOwner = 'COMPLETADO'; ownerColorClass = 'owner-done'; }
        else if (displayOwner === 'CLIENTE') ownerColorClass = 'owner-cliente';
        else if (displayOwner === 'COMERCIAL') ownerColorClass = 'owner-comercial';
        else if (displayOwner === 'TI' || displayOwner === 'PROYECTOS') ownerColorClass = 'owner-ti';

        container.innerHTML += `
            <div class="init-card ${isBlocked ? 'has-alert' : ''}">
                <div class="init-card-header">
                    <div>
                        <h3>${init.name}</h3>
                        <div class="client-name">${init.clients?.name || 'Sin Cliente'}</div>
                    </div>
                    <div class="owner-pill ${ownerColorClass}">${displayOwner}</div>
                </div>
                
                <div style="margin-top: 0.5rem; margin-bottom: 0.5rem;">
                    ${renderPhaseProgress(init.phase, isBlocked)}
                </div>
                
                ${isBlocked ? `<div class="bottleneck-text">${init.bottleneck || 'Iniciativa en Standby'}</div>` : ''}

                <div class="init-info-row">
                    <span>Estimación Go Live:</span>
                    <span class="go-live" style="color: ${init.estimated_date ? 'var(--info)' : 'var(--text-muted)'}">${init.estimated_date || 'Por definir'}</span>
                </div>
                
                <button class="card-cta" onclick="openModal('${init.id}')">Ver Detalle y Bitácora</button>
            </div>
        `;
    });
}

const modal = document.getElementById('modal-initiative');
window.openModal = (id) => {
    const init = initiativesData.find(i => i.id == id);
    if (!init) return;

    document.getElementById('modal-init-title').textContent = init.name;
    document.getElementById('modal-init-client').textContent = init.clients?.name || '';
    
    const bn = document.getElementById('modal-bottleneck');
    if (init.bottleneck || init.phase === 'STANDBY') {
        bn.style.display = 'block';
        bn.textContent = `🛑 Bloqueo actual: ${init.bottleneck || 'Iniciativa en Standby'}`;
    } else {
        bn.style.display = 'none';
    }

    const logsContainer = document.getElementById('logs-container');
    const logs = init.logs || [];
    if (logs.length === 0) {
        logsContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem;">No hay registros en la bitácora.</p>';
    } else {
        logsContainer.innerHTML = logs.map(log => `
            <div class="log-entry">
                <div class="log-meta">${log.date} — <b>${log.author || 'Sistema'}</b></div>
                <div class="log-text">${log.text}</div>
            </div>
        `).join('');
    }

    modal.classList.add('active');
};

document.getElementById('btn-close-init-modal').addEventListener('click', () => modal.classList.remove('active'));
window.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

// Init
fetchData();
