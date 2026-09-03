with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\index.html", "r", encoding="utf-8") as f:
    html = f.read()

import re
match = re.search(r'<div id="modal-initiative".*?(?=<!-- VISTA CONDUCTOR REGULAR|</body>)', html, re.DOTALL)
if match:
    print(match.group(0)[:500])
    print("...")
    print(match.group(0)[-500:])
else:
    print("modal-initiative block not found")
