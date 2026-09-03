with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\app.js", "r", encoding="utf-8") as f:
    js = f.read()

new_get_responsable = """function getResponsable(init) {
    if (init.phase === 'EN_PRODUCCION' || init.phase === 'GO_LIVE') return { who: 'Completado', color: 'var(--success)' };
    
    const owner = (init.owner || '').toUpperCase();
    if (owner === 'CLIENTE') return { who: 'Responsabilidad Cliente', color: 'var(--danger)' };
    if (owner === 'COMERCIAL' || owner === 'KAM') return { who: 'En Negociación', color: 'var(--warning)' };
    if (owner === 'TI' || owner === 'PROYECTOS') return { who: 'Responsabilidad Starken TI', color: 'var(--info)' };
    
    return { who: 'Starken TI', color: 'var(--info)' };
}"""

import re
js = re.sub(r'function getResponsable\(init\) \{.*?\n\}', new_get_responsable, js, flags=re.DOTALL)

with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\app.js", "w", encoding="utf-8") as f:
    f.write(js)
print("getResponsable logic updated")
