# WorkHub Scanner-Integration — Phasenplan

## Ziel
Technische Zeichnungen per Handy-Kamera scannen, relevante Felder per OCR auslesen
und direkt als Auftrag in WorkHub übernehmen. Persönliche Übersicht für den Arbeitsalltag.

## Phase 1: Auftragsbereich stabilisieren ✅
- Duplikate entfernt (useOrderStore.ts, useMaterialStore.ts)
- Tote Metallgruppen-Page entfernt
- Material-Speicherbug bereits gefixt

## Phase 2: Auftragsdatenmodell für Scan erweitert ✅
- Order-Interface erweitert: images, extracted (ExtractedFields)
- Bildquellen: drawingImage, jobSheetImage
- ExtractedField mit rawText, value, confirmed, sourceImage, selectionRect
- Säge-Felder: sawMeasure, overmeasure, sawInstruction, diameterOrRawSize
- Factory-Funktionen, Labels, Feld-Gruppierung

## Phase 3: Auftrag aus Zeichnungsscan starten ✅
- ScanStartButton: Kamera/Datei → Auftrag direkt aus Bild erzeugen
- createOrderFromScan() im Storage
- Auftrag startet mit Zeichnung, leeren Feldern, status=open
- Detail-Ansicht öffnet sich automatisch nach Scan

## Phase 4: Klickbare Felderfassung ✅
- OrderFieldPanel mit klickbaren Zielfeldern
- Feldzustände: leer, befüllt, aktiv ausgewählt, bestätigt
- Feld-Klick → Zeichnungsansicht mit aktivem Zielfeld

## Phase 5: Zeichnungsansicht mit Markierungsrechteck ✅
- DrawingViewer: Vollbild-Zeichnungsansicht
- Flexibles Rechteck per Touch/Maus ziehen
- Bestätigung speichert selectionRect + sourceImage
- Bereits gesetzte Markierungen erneut bearbeitbar

## Phase 6: OCR-Übernahme ✅ (Platzhalter)
- FieldConfirmDialog: Rohtext anzeigen, korrigieren, bestätigen
- rawText und value getrennt gespeichert
- Neu-Markieren oder manuell eingeben möglich
- OCR-Engine als Platzhalter vorbereitet (manuell tippen)

## Phase 7: Säge-relevante Werte priorisiert ✅
- Sägeblock visuell hervorgehoben in OrderFieldPanel
- sawMeasure, overmeasure, sawInstruction, material, diameterOrRawSize, quantity oben
- Allgemeine Felder (article) nachrangig
- OrderCard zeigt Säge-Preview + Fortschrittsbalken

## Phase 8: Statuslogik vereinfacht ✅
- Neues Modell: open → in_progress → done
- Migration alter Statuswerte automatisch
- Klare Buttons: Starten / Erledigt
- Filterbar nach allen drei Zuständen

## Phase 9: Werkstattauftrag-Rückseite ergänzen
_(noch offen — jobSheetImage Felder vorbereitet)_

## Phase 10: Alltagstest und Praxisanpassung
_(noch offen)_
