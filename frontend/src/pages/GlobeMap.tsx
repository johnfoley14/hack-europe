import { useState, useMemo, useRef, useEffect } from 'react';
import { useInitiatives } from '@/hooks/useInitiatives';
import type { InitiativeStatus } from '@/lib/types';
import { StatusBadge } from '@/components/StatusBadge';
import { ProgressBar } from '@/components/ProgressBar';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Filter, List, X, Loader2 } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const statusFilters: { label: string; value: 'all' | InitiativeStatus }[] = [
  { label: 'All', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'Funded', value: 'funded' },
  { label: 'Failed', value: 'failed' },
];

const statusColor: Record<string, string> = {
  open: '#e88c30',
  funded: '#22c55e',
  failed: '#ef4444',
};

const GlobeMap = () => {
  const { data: initiatives = [], isLoading } = useInitiatives();
  const [activeFilter, setActiveFilter] = useState<'all' | InitiativeStatus>('all');
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [showList, setShowList] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const filtered = useMemo(() =>
    activeFilter === 'all'
      ? initiatives
      : initiatives.filter((i) => i.status === activeFilter),
    [activeFilter, initiatives]
  );

  const selected = initiatives.find((i) => i.id === selectedPin);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [-3, 53],
      zoom: 4.5,
      projection: 'globe',
      attributionControl: false,
    });

    map.on('style.load', () => {
      map.setFog({
        color: 'rgb(10, 14, 20)',
        'high-color': 'rgb(20, 30, 60)',
        'horizon-blend': 0.08,
        'space-color': 'rgb(8, 10, 18)',
        'star-intensity': 0.6,
      });
    });

    map.on('load', () => {
      setMapReady(true);
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, []);

  // Update markers when filter changes or map becomes ready
  useEffect(() => {
    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (!mapRef.current || !mapReady) return;

    filtered.forEach((initiative) => {
      const color = statusColor[initiative.status] || '#e88c30';

      const wrapper = document.createElement('div');
      wrapper.style.width = '18px';
      wrapper.style.height = '18px';
      wrapper.style.willChange = 'auto';

      const el = document.createElement('div');
      el.style.width = '18px';
      el.style.height = '18px';
      el.style.borderRadius = '50%';
      el.style.background = color;
      el.style.border = '2.5px solid rgba(255,255,255,0.9)';
      el.style.boxShadow = `0 0 8px ${color}, 0 0 16px ${color}44`;
      el.style.cursor = 'pointer';
      el.style.transition = 'transform 0.15s';
      el.title = initiative.title;

      el.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.4)'; });
      el.addEventListener('mouseleave', () => { el.style.transform = 'scale(1)'; });
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        setSelectedPin(initiative.id);
        mapRef.current?.flyTo({
          center: [initiative.location.lng, initiative.location.lat],
          zoom: Math.max(mapRef.current.getZoom(), 6),
          speed: 0.8,
          curve: 1.2,
        });
      });

      wrapper.appendChild(el);

      const marker = new mapboxgl.Marker({ element: wrapper, anchor: 'center' })
        .setLngLat([initiative.location.lng, initiative.location.lat])
        .addTo(mapRef.current!);

      markersRef.current.push(marker);
    });
  }, [filtered, mapReady]);

  return (
    <div className="h-[calc(100vh-4rem)] relative flex" style={{ background: 'hsl(220 25% 6%)' }}>
      <div className="flex-1 relative overflow-hidden">
        <div ref={mapContainer} className="absolute inset-0" />

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        {/* Pin info card */}
        {selected && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-96 rounded-xl bg-card shadow-card-hover border border-border overflow-hidden animate-in fade-in slide-in-from-bottom-2">
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <StatusBadge status={selected.status} />
                  <span className="text-xs text-muted-foreground">{selected.location.address}</span>
                </div>
                <button onClick={() => setSelectedPin(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-bold font-display text-base mb-1.5">{selected.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{selected.description}</p>
              <ProgressBar current={selected.heldAmount} goal={selected.goalAmount} status={selected.status} size="sm" className="mb-3" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{selected.pledgeCount} pledges · {selected.community}</span>
                <Link to={`/initiative/${selected.id}`} className="text-xs text-primary font-semibold hover:underline">
                  View Pool →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Filters overlay */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <div className="flex items-center gap-1 bg-card/90 backdrop-blur rounded-full p-1 shadow-card border border-border">
            <Filter className="w-4 h-4 text-muted-foreground ml-2" />
            {statusFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium transition-all',
                  activeFilter === f.value
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* List toggle */}
        <button
          onClick={() => setShowList(!showList)}
          className="absolute top-4 right-4 z-20 bg-card/90 backdrop-blur rounded-full p-2.5 shadow-card border border-border hover:bg-card transition-colors"
        >
          <List className="w-4 h-4" />
        </button>
      </div>

      {/* Sidebar list */}
      {showList && (
        <div className="w-80 border-l border-border bg-card overflow-y-auto hidden md:block">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold font-display text-sm">{filtered.length} Initiatives</h2>
          </div>
          <div className="divide-y divide-border">
            {filtered.map((i) => (
              <button
                key={i.id}
                className={cn(
                  'block w-full text-left p-4 hover:bg-secondary/50 transition-colors',
                  selectedPin === i.id && 'bg-primary/5'
                )}
                onClick={() => {
                  setSelectedPin(i.id);
                  mapRef.current?.flyTo({
                    center: [i.location.lng, i.location.lat],
                    zoom: Math.max(mapRef.current.getZoom(), 6),
                    speed: 0.8,
                    curve: 1.2,
                  });
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-medium truncate pr-2">{i.title}</h3>
                  <StatusBadge status={i.status} />
                </div>
                <ProgressBar current={i.heldAmount} goal={i.goalAmount} status={i.status} size="sm" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobeMap;
