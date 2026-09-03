with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\index.html", "r", encoding="utf-8") as f:
    html = f.read()

import re
# Simply replace everything from <div id="modal-initiative" to the end of the file with the correct modal and closing tags.
match = re.search(r'<div id="modal-initiative".*?</html>', html, re.DOTALL)
if match:
    new_tail = """<div id="modal-initiative" class="modal-overlay">
          <div class="modal-content" style="max-width: 700px;">
              <header class="header" style="justify-content: space-between; border-bottom: 1px solid var(--panel-border); margin-bottom: 1rem;">
                  <h2 id="modal-init-title" style="font-family: 'Playfair Display', serif; margin: 0;">Detalle de Iniciativa</h2>
                  <button type="button" class="btn-icon" id="btn-close-init-modal" style="border:none; background:transparent; font-size:1.5rem; cursor:pointer;">&times;</button>
              </header>
              <div class="form-section">
                  <div style="background: rgba(0,0,0,0.02); padding: 1rem; border-radius: 4px; border: 1px solid var(--panel-border); margin-bottom: 1.5rem;">
                      <p style="font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">ESTADO ACTUAL (Definido por PMO):</p>
                      <h3 id="kam-init-phase" style="margin: 0 0 0.5rem 0; color: var(--text-main);"></h3>
                      <p id="kam-init-bottleneck" style="color: var(--danger); margin: 0; font-size: 0.95rem;"></p>
                  </div>
                  
                  <h3 style="margin-top: 2rem; border-bottom: 1px solid var(--panel-border); padding-bottom: 0.5rem;">Bitácora Comercial / PMO</h3>
                  <div id="logs-container" style="max-height: 250px; overflow-y: auto; background: rgba(0,0,0,0.02); border: 1px solid var(--panel-border); border-radius: var(--radius); padding: 1rem; margin-top: 1rem; margin-bottom: 1rem; display: flex; flex-direction: column; gap: 0.75rem;">
                      <!-- Logs -->
                  </div>
                  
                  <div style="display: flex; gap: 10px; margin-top: 1rem;">
                      <input type="text" id="input-log-text" class="form-control" placeholder="Añadir respuesta, estado de negociación o update al PMO..." style="flex:1;">
                      <button type="button" id="btn-add-log" class="btn-primary" style="padding: 0.5rem 1rem;">Añadir Update</button>
                  </div>
              </div>
          </div>
      </div>
      <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
      <script src="app.js"></script>
</body>
</html>"""
    
    html = html[:match.start()] + new_tail
    with open(r"C:\Users\cristobal.sagredo\Desktop\Obsidian\10 Proyectos\maestro-integraciones-kam\index.html", "w", encoding="utf-8") as f:
        f.write(html)
    print("Modal successfully replaced")
else:
    print("modal-initiative not found for replacement")
