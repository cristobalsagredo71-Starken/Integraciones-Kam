with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\index.html", "r", encoding="utf-8") as f:
    html = f.read()

html = html.replace('style="width: 300px; font-size: 1.1rem; padding: 0.75rem;"', 'style="width: 320px; font-size: 1rem; padding: 0.6rem 1rem; font-weight: 600; cursor: pointer; border: 1px solid var(--panel-border); border-radius: 8px; background: var(--input-bg); color: var(--text-main); font-family: \'Inter\', sans-serif;"')
html = html.replace('<option value="ALL">Visualizando a todos los KAMs (Ver Todo)</option>', '<option value="ALL">👁️ Visualizar Todos (Sin Filtro)</option>')

with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\index.html", "w", encoding="utf-8") as f:
    f.write(html)


with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\app.js", "r", encoding="utf-8") as f:
    js = f.read()

js = js.replace('<option value="ALL">Visualizando a todos los KAMs (Ver Todo)</option>', '<option value="ALL">👁️ Visualizar Todos (Sin Filtro)</option>')
js = js.replace("opt.textContent = 'KAM: ' + kam;", "opt.textContent = '👤 ' + kam;")

with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\app.js", "w", encoding="utf-8") as f:
    f.write(js)

print("Button improved")
