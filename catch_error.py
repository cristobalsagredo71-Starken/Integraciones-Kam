with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\app.js", "r", encoding="utf-8") as f:
    js = f.read()

js = js.replace('console.error("Error fetching data:", e);', 'console.error("Error fetching data:", e); document.getElementById("view-pedidas").innerHTML = `<p style="color:red">Error JS: ${e.message}</p>`;')

with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\app.js", "w", encoding="utf-8") as f:
    f.write(js)
