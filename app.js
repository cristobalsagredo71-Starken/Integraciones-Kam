
window.addEventListener('error', function(e) {
    document.body.innerHTML = `<div style="background:red; color:white; padding:20px; z-index:9999; position:absolute; top:0; left:0; width:100%;"><b>Global Error:</b> ${e.message}<br>${e.filename}:${e.lineno}</div>` + document.body.innerHTML;
});
window.addEventListener('unhandledrejection', function(e) {
    document.body.innerHTML = `<div style="background:red; color:white; padding:20px; z-index:9999; position:absolute; top:0; left:0; width:100%;"><b>Unhandled Promise Rejection:</b> ${e.reason}</div>` + document.body.innerHTML;
});


function updateStats(filteredData) {
    const total = filteredData.length;
    const blocked = filteredData.filter(i => i.phase === 'STANDBY' || i.phase === 'BLOQUEADO').length;
    
    const elTotal = document.getElementById('total-integrations');
    const elBlocked = document.getElementById('total-blocked');
    
    if(elTotal) elTotal.textContent = total;
    if(elBlocked) elBlocked.textContent = blocked;
}


const SUPABASE_URL = 'https://dzmsfxnvfardckddvzjt.supabase.co';
const SUPABASE_KEY = 'sb_publishable_J0eJ5rRXzERV8RxiYk95sg_NTd8JWYN';
const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let initiativesData = [];
let clientsData = [];
let kamsList = new Set();

function normalizeKamName(name) {
    if (!name) return '';
    // Elimina tildes y pasa a mayuscula para normalizar
    return name.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase().trim();
}

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

let selectedKam = 'ALL';

async function fetchData() {
    try {
        const [resInits, resClients] = await Promise.all([
            client.from('initiatives').select('*, clients(*)').is('deleted_at', null).order('priority', { ascending: false }),
            client.from('clients').select('*').is('deleted_at', null)
        ]);
        
        if (resInits.error) throw resInits.error;
        if (resClients.error) throw resClients.error;
        
        initiativesData = resInits.data || [];
        clientsData = resClients.data || [];
        
        // Extract KAMs
        kamsList.clear();
        clientsData.forEach(c => {
            if (c.sponsor && c.sponsor.trim() !== '') {
                kamsList.add(normalizeKamName(c.sponsor));
            }
        });
        renderKamSelector();
        renderKamCards();
        renderAlertas();
    } catch (e) {
        console.error("Error fetching data:", e); document.getElementById("view-pedidas").innerHTML = `<p style="color:red">Error JS: ${e.message}</p>`;
    }
}

function renderKamSelector() {
    const sel = document.getElementById('kam-selector');
    sel.innerHTML = '<option value="ALL">👁️ Visualizar Todos (Sin Filtro)</option>';
    [...kamsList].sort().forEach(kam => {
        const opt = document.createElement('option');
        opt.value = kam;
        opt.textContent = '👤 ' + toTitleCase(kam);
        sel.appendChild(opt);
    });
    sel.value = selectedKam;
    sel.addEventListener('change', (e) => {
        selectedKam = e.target.value;
        renderKamCards();
        renderAlertas();
    });
}

function getResponsable(init) {
    if (init.phase === 'EN_PRODUCCION' || init.phase === 'GO_LIVE') return { who: 'Completado', color: 'var(--success)' };
    
    const owner = (init.owner || '').toUpperCase();
    if (owner === 'CLIENTE') return { who: 'Responsabilidad Cliente', color: 'var(--danger)' };
    if (owner === 'COMERCIAL' || owner === 'KAM') return { who: 'En Negociación', color: 'var(--warning)' };
    if (owner === 'TI' || owner === 'PROYECTOS') return { who: 'Responsabilidad Starken TI', color: 'var(--info)' };
    
    return { who: 'Starken TI', color: 'var(--info)' };
}

function renderKamCards() {
    const container = document.getElementById('view-pedidas');
    container.innerHTML = '';
    
    const filtered = selectedKam === 'ALL' 
        ? initiativesData 
        : initiativesData.filter(i => i.clients && normalizeKamName(i.clients.sponsor) === selectedKam);
        
    updateStats(filtered);
    if (filtered.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted);">No hay integraciones activas para este KAM.</p>';
        return;
    }
    
    filtered.forEach(init => {
        const resp = getResponsable(init);
        const hasAlert = init.logs && init.logs.some(l => l.text.includes('ALERTA COMERCIAL'));
        const alertBorder = hasAlert ? 'border: 2px solid var(--danger);' : 'border: 1px solid var(--panel-border);';
        
        const card = document.createElement('div');
        card.style = `background: var(--panel-bg); border-radius: var(--radius); padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; position: relative; ${alertBorder}`;
        
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    
                    <h3 style="margin: 0; font-family: 'Playfair Display', serif; color: var(--text-main); font-size: 1.3rem;">${init.name}</h3>
                    <div style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.25rem;">${init.clients ? init.clients.name : 'Sin Cliente'}</div>
                </div>
                <div style="background: ${resp.color}22; color: ${resp.color}; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: bold; border: 1px solid ${resp.color}; text-align: center; line-height: 1.2;">
                    RESPONSABLE:<br/>${resp.who}
                </div>
            </div>
            
            <div style="background: rgba(0,0,0,0.02); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--panel-border);">
                <div style="font-size: 0.9rem; color: ${init.bottleneck ? 'var(--danger)' : 'var(--text-main)'};">${init.bottleneck || 'Avanzando según SLA interno.'}</div>
            </div>
            
            <button class="btn" style="margin-top: auto; width: 100%; justify-content: center;" onclick="openKamModal('${init.id}')">
                Ver Detalles y Bitácora
            </button>
        `;
        container.appendChild(card);
    });
}

function renderAlertas() {
    const viewAlertas = document.getElementById('view-alertas');
    const container = document.getElementById('alertas-container');
    container.innerHTML = '';
    
    const filtered = selectedKam === 'ALL' 
        ? initiativesData 
        : initiativesData.filter(i => i.clients && normalizeKamName(i.clients.sponsor) === selectedKam);
        
    const alertas = [];
    filtered.forEach(init => {
        if(init.logs) {
            init.logs.forEach(log => {
                if(log.text.includes('ALERTA COMERCIAL')) {
                    alertas.push({ initName: init.name, clientName: init.clients ? init.clients.name : '', log: log, initId: init.id });
                }
            });
        }
    });
    
    if (alertas.length === 0) {
        viewAlertas.style.display = 'none';
        return;
    }
    
    viewAlertas.style.display = 'block';
    // Sort by date desc (naive string sort works for ISO-like dates)
    alertas.sort((a,b) => b.log.date.localeCompare(a.log.date)).forEach(al => {
        const el = document.createElement('div');
        el.style = "background: var(--danger)22; border-left: 4px solid var(--danger); padding: 1rem; border-radius: 0 4px 4px 0;";
        el.innerHTML = `
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem;">${al.log.date} - <b>${al.clientName} (${al.initName})</b></div>
            <div style="color: var(--text-main);">${al.log.text}</div>
            <button class="btn-icon tooltip-container" style="margin-top: 0.5rem; border:1px solid var(--danger); padding:4px 8px; border-radius:4px; font-size:0.8rem; color:var(--danger);" onclick="openKamModal('${al.initId}')">
                Ver Detalles
            </button>
        `;
        container.appendChild(el);
    });
}

// Modal Logic
let currentEditingInit = null;
const modal = document.getElementById('modal-initiative');
const btnClose = document.getElementById('btn-close-init-modal');

btnClose.addEventListener('click', () => { modal.style.display = 'none'; });
window.onclick = (e) => { if(e.target == modal) modal.style.display = 'none'; };

window.openKamModal = (initId) => {
    currentEditingInit = initiativesData.find(i => i.id === initId);
    if(!currentEditingInit) return;
    
    document.getElementById('modal-init-title').textContent = currentEditingInit.name + ' (' + (currentEditingInit.clients ? currentEditingInit.clients.name : '') + ')';
    document.getElementById('kam-init-bottleneck').textContent = currentEditingInit.bottleneck || 'Sin trabas reportadas por PMO.';
    
    renderModalLogs();
    modal.style.display = 'flex';
};

function renderModalLogs() {
    const container = document.getElementById('logs-container');
    const logs = currentEditingInit.logs || [];
    if(logs.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem; text-align: center;">No hay registros en la bitácora.</p>';
        return;
    }
    
    container.innerHTML = logs.map((log) => {
        const isKam = log.author && log.author.includes('KAM');
        const bg = isKam ? 'rgba(29, 78, 216, 0.05)' : 'transparent';
        const border = isKam ? 'border-left: 2px solid var(--info);' : 'border-left: 2px solid var(--panel-border);';
        return `
        <div style="position: relative; padding: 0.5rem; background: ${bg}; ${border} border-radius: 0 4px 4px 0;">
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.25rem;">${log.date} — <b>${log.author || 'Sistema'}</b></div>
            <div style="font-size: 0.9rem; color: var(--text-main);">${log.text}</div>
        </div>
    `}).join('');
}



// Theme Logic
window.toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
};

// Boot
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
fetchData();
