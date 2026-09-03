with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\app.js", "r", encoding="utf-8") as f:
    js = f.read()

# Is there any syntax error? Let's check with node -c
import subprocess
try:
    # Actually node isn't installed. Let's just print the code.
    print(js[:500])
except Exception as e:
    pass
