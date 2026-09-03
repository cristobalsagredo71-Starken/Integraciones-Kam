
function updateStats() {
    const total = initiativesData.length;
    const blocked = initiativesData.filter(i => i.phase === 'BLOQUEADO').length;
    
    const elTotal = document.getElementById('stat-total-inits');
    const elBlocked = document.getElementById('stat-blocked-inits');
    
    if(elTotal) elTotal.textContent = total;
    if(elBlocked) elBlocked.textContent = blocked;
}


const SUPABASE_URL = 'https://dzmsfxnvfardckddvzjt.supabase.co';
const SUPABASE_KEY = 'sb_publishable_J0eJ5rRXzERV8RxiYk95sg_NTd8JWYN';
const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let initiativesData = [];
let clientsData = [];
let kamsList = new Set();
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
                kamsList.add(c.sponsor.trim());
            }
        });
        renderKamSelector();
        renderKamCards();
        renderAlertas();
        updateStats();
    } catch (e) {
        console.error("Error fetching data:", e); document.getElementById("view-pedidas").innerHTML = `<p style="color:red">Error JS: ${e.message}</p>`;
    }
}

function renderKamSelector() {
    const sel = document.getElementById('kam-selector');
    sel.innerHTML = '<option value="ALL">Visualizando a todos los KAMs (Ver Todo)</option>';
    [...kamsList].sort().forEach(kam => {
        const opt = document.createElement('option');
        opt.value = kam;
        opt.textContent = 'KAM: ' + kam;
        sel.appendChild(opt);
    });
    sel.value = selectedKam;
    sel.addEventListener('change', (e) => {
        selectedKam = e.target.value;
        renderKamCards();
        renderAlertas();
        updateStats();
    });
}

function getResponsable(init) {
    if (init.phase === 'EN_PRODUCCION') return { who: 'Completado', color: 'var(--success)' };
    if (!init.bottleneck) return { who: 'Starken TI', color: 'var(--info)' };
    
    const b = init.bottleneck.toLowerCase();
    if (b.includes('cliente') || b.includes('proveedor')) return { who: 'Cliente / Proveedor', color: 'var(--danger)' };
    if (b.includes('comercial') || b.includes('kam')) return { who: 'KAM (Negociación)', color: 'var(--warning)' };
    return { who: 'Starken TI', color: 'var(--info)' };
}

function renderKamCards() {
    const container = document.getElementById('view-pedidas');
    container.innerHTML = '';
    
    const filtered = selectedKam === 'ALL' 
        ? initiativesData 
        : initiativesData.filter(i => i.clients && i.clients.sponsor === selectedKam);
        
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
                    <div style="font-size: 0.75rem; color: var(--text-muted); font-family: 'JetBrains Mono', monospace; margin-bottom: 0.25rem;">${init.system}</div>
                    <h3 style="margin: 0; font-family: 'Playfair Display', serif; color: var(--text-main); font-size: 1.3rem;">${init.name}</h3>
                    <div style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.25rem;">${init.clients ? init.clients.name : 'Sin Cliente'}</div>
                </div>
                <div style="background: ${resp.color}22; color: ${resp.color}; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: bold; border: 1px solid ${resp.color}; text-align: center; line-height: 1.2;">
                    RESPONSABLE:<br/>${resp.who}
                </div>
            </div>
            
            <div style="background: rgba(0,0,0,0.02); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--panel-border);">
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.25rem; font-weight: bold;">ESTADO ACTUAL: ${init.phase}</div>
                <div style="font-size: 0.9rem; color: ${init.bottleneck ? 'var(--danger)' : 'var(--text-main)'};">${init.bottleneck || 'Avanzando según SLA interno.'}</div>
            </div>
            
            <button class="btn" style="margin-top: auto; width: 100%; justify-content: center;" onclick="openKamModal('${init.id}')">
                Ver Detalles / Responder PMO
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
        : initiativesData.filter(i => i.clients && i.clients.sponsor === selectedKam);
        
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
                Responder a PMO
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
    document.getElementById('kam-init-phase').textContent = currentEditingInit.phase;
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

document.getElementById('btn-add-log').addEventListener('click', async () => {
    const input = document.getElementById('input-log-text');
    if(!input.value.trim() || !currentEditingInit) return;
    
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0] + ' ' + now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    const newLog = {
        date: dateStr,
        author: 'KAM (' + (selectedKam !== 'ALL' ? selectedKam : 'General') + ')',
        text: input.value.trim()
    };
    
    const updatedLogs = [newLog, ...(currentEditingInit.logs || [])];
    
    try {
        const { error } = await client.from('initiatives').update({ logs: updatedLogs }).eq('id', currentEditingInit.id);
        if (error) throw error;
        
        currentEditingInit.logs = updatedLogs;
        input.value = '';
        renderModalLogs();
        renderAlertas();
        updateStats(); // refresh alerts in case they answered one
    } catch (e) {
        alert("Error guardando el comentario: " + e.message);
    }
});

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
