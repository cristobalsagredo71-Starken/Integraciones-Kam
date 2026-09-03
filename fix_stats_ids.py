with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\app.js", "r", encoding="utf-8") as f:
    js = f.read()

# Replace the updateStats function with a new one that relies on filtered data, and call it in renderKamCards
js = js.replace("""function updateStats() {
    const total = initiativesData.length;
    const blocked = initiativesData.filter(i => i.phase === 'BLOQUEADO').length;
    
    const elTotal = document.getElementById('stat-total-inits');
    const elBlocked = document.getElementById('stat-blocked-inits');
    
    if(elTotal) elTotal.textContent = total;
    if(elBlocked) elBlocked.textContent = blocked;
}""", """function updateStats(filteredData) {
    const total = filteredData.length;
    const blocked = filteredData.filter(i => i.phase === 'STANDBY' || i.phase === 'BLOQUEADO').length;
    
    const elTotal = document.getElementById('total-integrations');
    const elBlocked = document.getElementById('total-blocked');
    
    if(elTotal) elTotal.textContent = total;
    if(elBlocked) elBlocked.textContent = blocked;
}""")

# Call it in renderKamCards
js = js.replace("""if (filtered.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted);">No hay integraciones activas para este KAM.</p>';
        return;
    }""", """updateStats(filtered);
    if (filtered.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted);">No hay integraciones activas para este KAM.</p>';
        return;
    }""")

with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\app.js", "w", encoding="utf-8") as f:
    f.write(js)
print("Stats updated correctly")
