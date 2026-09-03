with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\app.js", "r", encoding="utf-8") as f:
    js = f.read()

import re
# Remove ESTADO ACTUAL from cards
js = re.sub(r'<div style="font-size: 0\.75rem; color: var\(--text-muted\); margin-bottom: 0\.25rem; font-weight: bold;">ESTADO ACTUAL: \$\{init\.phase\}</div>\s*', '', js)

# Remove ESTADO ACTUAL from modal assignment
js = re.sub(r"document\.getElementById\('kam-init-phase'\)\.textContent = currentEditingInit\.phase;\s*", '', js)

with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\app.js", "w", encoding="utf-8") as f:
    f.write(js)


with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Remove from Modal HTML
html = re.sub(r'<p style="font-family: \'JetBrains Mono\', monospace; font-size: 0\.85rem; color: var\(--text-muted\); margin-bottom: 0\.5rem;">ESTADO ACTUAL \(Definido por PMO\):</p>\s*', '', html)
html = re.sub(r'<h3 id="kam-init-phase" style="margin: 0 0 0\.5rem 0; color: var\(--text-main\);"></h3>\s*', '', html)

with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\index.html", "w", encoding="utf-8") as f:
    f.write(html)
print("Removed technical phase info")
