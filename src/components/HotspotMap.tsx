import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet'
import { useState } from 'react'
import { categoryFor } from '../lib/aqi'
import { DataBadge } from './ui'

/** Illustrative hotspot index — NOT measured values. Chosen to reflect qualitative source context. */
const HOTSPOTS = [
  { name: 'Manali', lat: 13.1662, lon: 80.2588, idx: 165, type: 'Industrial', note: 'Petrochemical & refinery cluster; SO₂, VOCs and PM from industry and heavy trucks.' },
  { name: 'Ennore', lat: 13.2146, lon: 80.3203, idx: 150, type: 'Industrial / port', note: 'Thermal power, port and fly-ash handling; NOx, SO₂ and PM.' },
  { name: 'Kodungaiyur', lat: 13.1376, lon: 80.2478, idx: 140, type: 'Waste', note: 'Large dumpsite; risk of smouldering fires and smoke episodes.' },
  { name: 'Guindy', lat: 13.0067, lon: 80.2206, idx: 120, type: 'Traffic / industrial estate', note: 'Kathipara junction traffic, industrial estate and metro works.' },
  { name: 'Alandur', lat: 12.9975, lon: 80.2006, idx: 115, type: 'Traffic', note: 'Major bus depot, GST Road and airport-area traffic.' },
  { name: 'Perungudi', lat: 12.9654, lon: 80.2461, idx: 125, type: 'Waste / traffic', note: 'Perungudi dumpsite (biomining) and OMR IT-corridor traffic.' },
  { name: 'Velachery', lat: 12.9815, lon: 80.218, idx: 95, type: 'Residential / commercial', note: 'Dense residential area with busy commercial roads.' },
  { name: 'Anna Nagar', lat: 13.085, lon: 80.2101, idx: 85, type: 'Residential', note: 'Planned residential area; traffic on arterial roads, more green cover.' },
  { name: 'T. Nagar', lat: 13.0418, lon: 80.2341, idx: 110, type: 'Commercial', note: 'Shopping district; congestion and pedestrian exposure.' },
]

export function HotspotMap() {
  const [filter, setFilter] = useState<string>('All')
  const types = ['All', 'Industrial', 'Traffic', 'Waste', 'Residential']
  const shown = HOTSPOTS.filter(h => filter === 'All' || h.type.toLowerCase().includes(filter.toLowerCase()))
  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 p-4 sm:p-5">
        <div>
          <div className="font-display text-lg font-semibold text-white">Chennai pollution hotspot map</div>
          <div className="text-xs text-mist/60">Markers sized and coloured by an illustrative pressure index (AQI-style scale)</div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {types.map(t => (
            <button key={t} onClick={() => setFilter(t)} className={`rounded-full px-3 py-1 text-xs transition ${filter === t ? 'bg-leaf-400 text-ink-950' : 'bg-ink-900 text-mist/70 hover:text-white'}`}>{t}</button>
          ))}
          <DataBadge kind="sample" label="Illustrative – not monitoring data" />
        </div>
      </div>
      <div className="h-[460px]">
        <MapContainer center={[13.09, 80.24]} zoom={11} scrollWheelZoom={false} className="h-full w-full">
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {shown.map(h => {
            const cat = categoryFor(h.idx)
            return (
              <CircleMarker key={h.name} center={[h.lat, h.lon]} radius={8 + h.idx / 14} pathOptions={{ color: cat.color, fillColor: cat.color, fillOpacity: 0.35, weight: 2 }}>
                <Tooltip direction="top" offset={[0, -6]}>{h.name}</Tooltip>
                <Popup>
                  <div className="space-y-1">
                    <div className="text-base font-semibold">{h.name}</div>
                    <div className="text-xs opacity-70">{h.type}</div>
                    <div>Illustrative index: <b style={{ color: cat.color }}>{h.idx}</b> ({cat.name})</div>
                    <div className="text-xs">{h.note}</div>
                    <div className="text-[10px] uppercase tracking-wider text-amber-300">Demonstration value only</div>
                  </div>
                </Popup>
              </CircleMarker>
            )
          })}
        </MapContainer>
      </div>
    </div>
  )
}
