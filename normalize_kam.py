with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\app.js", "r", encoding="utf-8") as f:
    js = f.read()

normalize_func = """
function normalizeKamName(name) {
    if (!name) return '';
    // Elimina tildes y pasa a mayuscula para normalizar
    return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim();
}

function toTitleCase(str) {
    return str.replace(
        /\\w\\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}
"""

js = js.replace('let selectedKam = \'ALL\';', normalize_func + '\nlet selectedKam = \'ALL\';')

# Update extraction
js = js.replace("""        kamsList.clear();
        clientsData.forEach(c => {
            if (c.sponsor && c.sponsor.trim() !== '') {
                kamsList.add(c.sponsor.trim());
            }
        });""", """        kamsList.clear();
        clientsData.forEach(c => {
            if (c.sponsor && c.sponsor.trim() !== '') {
                kamsList.add(normalizeKamName(c.sponsor));
            }
        });""")

# Update rendering selector (to show nice title case)
js = js.replace("opt.textContent = '👤 ' + kam;", "opt.textContent = '👤 ' + toTitleCase(kam);")

# Update filtering in cards
js = js.replace("const filtered = selectedKam === 'ALL' \n        ? initiativesData \n        : initiativesData.filter(i => i.clients && i.clients.sponsor === selectedKam);",
"""const filtered = selectedKam === 'ALL' 
        ? initiativesData 
        : initiativesData.filter(i => i.clients && normalizeKamName(i.clients.sponsor) === selectedKam);""")

# Update filtering in alertas
js = js.replace("const filtered = selectedKam === 'ALL' \n        ? initiativesData \n        : initiativesData.filter(i => i.clients && i.clients.sponsor === selectedKam);",
"""const filtered = selectedKam === 'ALL' 
        ? initiativesData 
        : initiativesData.filter(i => i.clients && normalizeKamName(i.clients.sponsor) === selectedKam);""")

# When adding log, we want to save the Title Case version so it looks nice in the DB
js = js.replace("author: 'KAM (' + (selectedKam !== 'ALL' ? selectedKam : 'General') + ')',",
"author: 'KAM (' + (selectedKam !== 'ALL' ? toTitleCase(selectedKam) : 'General') + ')',")

with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\app.js", "w", encoding="utf-8") as f:
    f.write(js)
print("Normalization added")
