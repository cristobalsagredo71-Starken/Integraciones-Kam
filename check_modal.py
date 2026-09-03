with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\index.html", "r", encoding="utf-8") as f:
    html = f.read()

print("HTML Length:", len(html))
if "modal-initiative" in html:
    print("Found modal-initiative")
else:
    print("NO modal-initiative")
