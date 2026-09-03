with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\index.html", "r", encoding="utf-8") as f:
    html = f.read()

ids_to_check = ['view-pedidas', 'kam-selector', 'alertas-container', 'logs-container']
for i in ids_to_check:
    if f'id="{i}"' in html:
        print(f"Found {i}")
    else:
        print(f"MISSING {i}")
