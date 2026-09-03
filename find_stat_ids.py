with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\index.html", "r", encoding="utf-8") as f:
    html = f.read()

import re
matches = re.finditer(r'id="stat-.*?"', html)
for m in matches:
    print(m.group(0))
