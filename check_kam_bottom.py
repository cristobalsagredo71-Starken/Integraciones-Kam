with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\app.js", "r", encoding="utf-8") as f:
    js = f.read()

print("Length of app.js:", len(js))
print("\nLast 300 characters of app.js:")
print(js[-300:])
