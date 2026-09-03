with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\index.html", "r", encoding="utf-8") as f:
    html = f.read()

import re
match = re.search(r'<header class="header">.*?</header>', html, re.DOTALL)
if match:
    print(match.group(0))
