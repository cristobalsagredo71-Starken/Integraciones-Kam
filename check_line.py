with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\app.js", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i in range(max(0, 215-5), min(len(lines), 215+5)):
    print(f"{i+1}: {lines[i].strip()}")
