# Agenten-Info (Repo-lokal)

- **Agent-Name:** (z. B. copilot | cursor | aider | continue | qodo | replit | codex-legacy)
- **Agent-Version/Build:** (n.v.)
- **Repo-Zweck:** Dieses Repository gehört ausschließlich zu obigem Agent und dient der isolierten Evaluation.
- **Datenablage:** Alle Evaluationsartefakte werden in `eval/` gespeichert:
  - `RUNLOG.md` – menschliches Protokoll (eine Zeile pro Run)
  - `metrics.json` – strukturierte Runs (Array)
  - `junit.xml` – Testergebnisse (überschrieben)
  - `coverage.xml` – Coverage (überschrieben)
  - `diff.patch` – optionaler Diff des aktuellen Runs

**Verbindliche Konventionen**
1. Es werden **nur** Dateien in `eval/` geschrieben/verändert.
2. `metrics.json` wird **append-only** gepflegt (neue Runs ans Ende).
3. Zeitangaben in ISO-8601 (UTC).
4. Felder ohne Wert als `(n.v.)` markieren.
5. `agent.name` in `metrics.json` muss dem hier dokumentierten Agent-Namen entsprechen.

