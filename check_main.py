with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\index.html", "r", encoding="utf-8") as f:
    html = f.read()

print(html[html.find('<main'):html.find('</main>')])
