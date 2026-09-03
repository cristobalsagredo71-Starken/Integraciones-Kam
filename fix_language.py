with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\app.js", "r", encoding="utf-8") as f:
    js = f.read()

# Replace "Pelota" with "Responsable"
js = js.replace("getBallInCourt", "getResponsable")
js = js.replace("Pelota en Cliente", "Resp. Cliente")
js = js.replace("Pelota en Starken TI", "Resp. Starken TI")
js = js.replace("PELOTA EN:", "RESPONSABLE:")
js = js.replace("const ball = getResponsable(init);", "const resp = getResponsable(init);")
js = js.replace("ball.color", "resp.color")
js = js.replace("ball.who", "resp.who")

# Add updateStats inside fetchData
update_stats_logic = """
function updateStats() {
    const total = initiativesData.length;
    const blocked = initiativesData.filter(i => i.phase === 'BLOQUEADO').length;
    
    const elTotal = document.getElementById('stat-total-inits');
    const elBlocked = document.getElementById('stat-blocked-inits');
    
    if(elTotal) elTotal.textContent = total;
    if(elBlocked) elBlocked.textContent = blocked;
}
"""

js = update_stats_logic + "\n" + js

# Call it in fetchData
js = js.replace("renderAlertas();", "renderAlertas();\n        updateStats();")

with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\app.js", "w", encoding="utf-8") as f:
    f.write(js)

with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\index.html", "r", encoding="utf-8") as f:
    html = f.read()

html = html.replace("Pelota en Cliente", "Responsabilidad Cliente")
html = html.replace("Pelota en Starken TI", "Responsabilidad Starken TI")

with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\index.html", "w", encoding="utf-8") as f:
    f.write(html)
print("Language and stats updated")
