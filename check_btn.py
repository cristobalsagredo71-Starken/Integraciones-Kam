with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\index.html", "r", encoding="utf-8") as f:
    html = f.read()

if "btn-add-log" in html:
    print("Found btn-add-log")
else:
    print("Not found")
