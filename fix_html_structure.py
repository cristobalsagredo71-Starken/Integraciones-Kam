with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\index.html", "r", encoding="utf-8") as f:
    html = f.read()

main_content = """
<main class="main-content">
      <div class="toolbar" style="display: flex; gap: 1rem; align-items: center; padding: 1.5rem 2rem; background: var(--panel-bg); border-bottom: var(--border-width) solid var(--panel-border);">
          <div style="flex: 1;">
              <select id="kam-selector" class="form-control" style="width: 300px; font-size: 1.1rem; padding: 0.75rem;">
                  <option value="ALL">Visualizando a todos los KAMs (Ver Todo)</option>
              </select>
          </div>
          <div style="font-size: 0.9rem; color: var(--text-muted); display: flex; gap: 1rem;">
              <span style="display: flex; align-items: center; gap: 4px;"><span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: var(--danger);"></span> Responsabilidad Cliente</span>
              <span style="display: flex; align-items: center; gap: 4px;"><span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: var(--warning);"></span> En Negociación</span>
              <span style="display: flex; align-items: center; gap: 4px;"><span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: var(--info);"></span> Responsabilidad Starken TI</span>
          </div>
      </div>

      <div id="view-alertas" style="padding: 2rem 2rem 0 2rem; display: none;">
          <h2 style="font-family: 'Playfair Display', serif; color: var(--danger); margin-bottom: 1rem; border-bottom: 1px solid var(--danger); padding-bottom: 0.5rem;">🔥 Alertas Comerciales Urgentes</h2>
          <div id="alertas-container" style="display: flex; flex-direction: column; gap: 1rem;"></div>
      </div>
      
      <div id="view-pedidas" style="padding: 2rem; display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 1.5rem;">
          <!-- Tarjetas KAM generadas por JS -->
      </div>
</main>
"""

# Replace everything from <main class="main-content"> to </main>
start = html.find('<main class="main-content">')
end = html.find('</main>') + len('</main>')

if start != -1 and end != -1:
    html = html[:start] + main_content + html[end:]
    with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\index.html", "w", encoding="utf-8") as f:
        f.write(html)
    print("Fixed HTML structure")
else:
    print("Could not find <main>")
