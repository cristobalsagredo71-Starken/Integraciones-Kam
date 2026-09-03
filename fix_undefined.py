with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\app.js", "r", encoding="utf-8") as f:
    js = f.read()

# Replace ${init.system} with empty string, or remove the div
import re
js = re.sub(r'<div style="font-size: 0\.75rem; color: var\(--text-muted\); font-family: \'JetBrains Mono\', monospace; margin-bottom: 0\.25rem;">\$\{init\.system\}</div>', '', js)

with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\app.js", "w", encoding="utf-8") as f:
    f.write(js)
print("Removed undefined system field")
