with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\app.js", "r", encoding="utf-8") as f:
    js = f.read()

# Replace button text in cards
js = js.replace('Ver Detalles / Responder PMO', 'Ver Detalles y Bitácora')

# Replace button text in alerts
js = js.replace('Responder a PMO', 'Ver Detalles')

with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\app.js", "w", encoding="utf-8") as f:
    f.write(js)
print("Button texts updated")
