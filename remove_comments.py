import re

with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Remove the div containing the input and button
target_div = r'<div style="display: flex; gap: 10px; margin-top: 1rem;">\s*<input type="text" id="input-log-text".*?>\s*<button type="button" id="btn-add-log".*?>.*?</button>\s*</div>'
html = re.sub(target_div, '', html, flags=re.DOTALL)

with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\index.html", "w", encoding="utf-8") as f:
    f.write(html)

with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\app.js", "r", encoding="utf-8") as f:
    js = f.read()

# Remove the event listener for btn-add-log
target_js = r"document\.getElementById\('btn-add-log'\)\.addEventListener\('click', async \(\) => \{.*?\n\}\);"
js = re.sub(target_js, '', js, flags=re.DOTALL)

with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\app.js", "w", encoding="utf-8") as f:
    f.write(js)

print("Comments removed")
