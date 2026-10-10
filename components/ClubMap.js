'use client';
import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

// OpenStreetMap + Leaflet. Standart marker rasmi o'rniga circleMarker ishlatiladi.
export default function ClubMap({ lat, lng, label }) {
  const ref = useRef(null);
  useEffect(() => {
    let map;
    let cancelled = false;
    (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !ref.current) return;
      map = L.map(ref.current).setView([lat, lng], 14);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(map);
      L.circleMarker([lat, lng], { radius: 10, color: '#2563eb', fillColor: '#22e39a', fillOpacity: 0.9 }).addTo(map).bindPopup(label || 'Klub');
    })();
    return () => { cancelled = true; if (map) map.remove(); };
  }, [lat, lng, label]);
  return <div ref={ref} className="h-72 w-full overflow-hidden rounded-2xl border border-line" role="img" aria-label="Klub joylashuvi xaritasi" />;
}
