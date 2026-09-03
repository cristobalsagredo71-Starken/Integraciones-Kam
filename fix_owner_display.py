with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\app.js", "r", encoding="utf-8") as f:
    js = f.read()

new_get_responsable = """function getResponsable(init) {
    if (init.phase === 'EN_PRODUCCION' || init.phase === 'GO_LIVE') return { who: 'Completado', color: 'var(--success)' };
    
    const owner = (init.owner || '').toUpperCase();
    if (owner === 'CLIENTE') return { who: 'Cliente', color: 'var(--danger)' };
    if (owner === 'COMERCIAL') return { who: 'Comercial', color: 'var(--warning)' };
    if (owner === 'TI') return { who: 'TI', color: 'var(--info)' };
    if (owner === 'PROYECTOS') return { who: 'Proyectos', color: 'var(--info)' };
    
    return { who: 'Por definir', color: 'var(--text-muted)' };
}"""

import re
js = re.sub(r'function getResponsable\(init\) \{.*?\n\}', new_get_responsable, js, flags=re.DOTALL)

with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\app.js", "w", encoding="utf-8") as f:
    f.write(js)

with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\index.html", "r", encoding="utf-8") as f:
    html = f.read()

html = html.replace("Responsabilidad Cliente", "Cliente")
html = html.replace("En Negociación", "Comercial")
html = html.replace("Responsabilidad Starken TI", "TI / Proyectos")

with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\index.html", "w", encoding="utf-8") as f:
    f.write(html)
print("Owner display logic fixed")
