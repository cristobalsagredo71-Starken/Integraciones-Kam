with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\app.js", "r", encoding="utf-8") as f:
    js = f.read()

# Add a global error listener to see ALL errors
global_handler = """
window.addEventListener('error', function(e) {
    document.body.innerHTML = `<div style="background:red; color:white; padding:20px; z-index:9999; position:absolute; top:0; left:0; width:100%;"><b>Global Error:</b> ${e.message}<br>${e.filename}:${e.lineno}</div>` + document.body.innerHTML;
});
window.addEventListener('unhandledrejection', function(e) {
    document.body.innerHTML = `<div style="background:red; color:white; padding:20px; z-index:9999; position:absolute; top:0; left:0; width:100%;"><b>Unhandled Promise Rejection:</b> ${e.reason}</div>` + document.body.innerHTML;
});
"""

if "window.addEventListener('error'" not in js:
    js = global_handler + "\n" + js
    with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\app.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("Global error handler injected")
else:
    print("Already injected")
