# AIRWATCH — Understanding and Assessing Urban Air Pollution

An academic case-study website for Environmental Studies, Unit IV: *Prediction and Assessment of Impacts on the Air Environment*, focused on Chennai.

## Run it
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

## Stack
React 18 + TypeScript, Vite 6, Tailwind CSS 4, Framer Motion, Recharts, Lucide icons, Leaflet + OpenStreetMap.
Frontend only: no backend or database needed.

## Data
| Panel | Type |
| --- | --- |
| Dashboard concentrations, trend, city comparison | **Live model estimates**: CAMS via the Open-Meteo Air Quality API (no key). These are not CPCB station readings. |
| Indicative AQI | Calculated in the browser from those concentrations using CPCB 2014 breakpoints (24-h means for PM/NO2/SO2, 8-h for CO/O3) |
| Fallback when the API is unreachable | **Simulated** data, labelled with an orange banner |
| Source contribution, hotspot map, simulator | **Illustrative sample values**, labelled on screen |
| NAAQS 2009, AQI categories, WHO 2021 guidelines | Official values (see References section) |

## Structure
```
src/
  App.tsx                 page assembly
  index.css               theme tokens, glass/grid styles, Leaflet dark skin
  components/
    ui.tsx                Section, Card, Tabs, Slider, DataBadge, Expandable…
    Chrome.tsx            sticky navbar, scroll progress, TOC rail, back-to-top
    PlumeLab.tsx          interactive Gaussian plume (Pasquill–Gifford / Briggs)
    HotspotMap.tsx        Leaflet map of Chennai
  lib/
    aqi.ts                CPCB AQI categories, breakpoints, sub-index maths
    airData.ts            Open-Meteo fetch, averaging, simulated fallback
    models.ts             σy/σz, plume equation, box model
    summary.ts            downloadable case-study summary
  sections/               Hero, Science, Assessment, Chennai, Dashboard,
                          Mitigation, Simulator, Laws, Management, Conclusion
```
