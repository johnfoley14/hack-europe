import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Info, Globe, Lock, Copy, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LocationAutocomplete, type LocationResult } from '@/components/LocationAutocomplete';
import { useCreateInitiative } from '@/hooks/useInitiatives';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

// Small map preview component
const MapPreview = ({ mapContainer, mapRef, selectedLocation }: {
  mapContainer: React.RefObject<HTMLDivElement>;
  mapRef: React.MutableRefObject<mapboxgl.Map | null>;
  selectedLocation: LocationResult | null;
}) => {
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [-3, 53],
      zoom: 4,
      interactive: true,
      attributionControl: false,
    });
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  return (
    <div className="h-48 rounded-xl overflow-hidden border border-border relative">
      {!selectedLocation && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-secondary/80 pointer-events-none">
          <div className="text-center">
            <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Search above to see map preview</p>
          </div>
        </div>
      )}
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

const VisibilitySection = ({ visibility, setVisibility }: {
  visibility: 'public' | 'private';
  setVisibility: (v: 'public' | 'private') => void;
}) => {
  const [copied, setCopied] = useState(false);
  const shareLink = useMemo(() => {
    const token = Math.random().toString(36).substring(2, 10);
    return `${window.location.origin}/invite/${token}`;
  }, []);

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold font-display">Visibility</h2>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setVisibility('public')}
          className={cn(
            'rounded-xl border p-4 text-left transition-all',
            visibility === 'public'
              ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
              : 'border-border hover:border-primary/30'
          )}
        >
          <Globe className="w-5 h-5 text-primary mb-2" />
          <p className="text-sm font-medium">Public</p>
          <p className="text-xs text-muted-foreground mt-0.5">Visible to everyone on the platform</p>
        </button>
        <button
          type="button"
          onClick={() => setVisibility('private')}
          className={cn(
            'rounded-xl border p-4 text-left transition-all',
            visibility === 'private'
              ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
              : 'border-border hover:border-primary/30'
          )}
        >
          <Lock className="w-5 h-5 text-primary mb-2" />
          <p className="text-sm font-medium">Private</p>
          <p className="text-xs text-muted-foreground mt-0.5">Only people with the link can view</p>
        </button>
      </div>

      {visibility === 'private' && (
        <div className="rounded-xl border border-border bg-secondary/30 p-4 animate-fade-in">
          <p className="text-xs text-muted-foreground mb-2">Share this link to give people access:</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-background rounded-lg border border-border px-3 py-2 text-sm font-mono text-foreground truncate">
              {shareLink}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={copyLink} className="shrink-0 gap-1.5">
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

const CreateInitiative = () => {
  const navigate = useNavigate();
  const createInitiative = useCreateInitiative();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');
  const [deadline, setDeadline] = useState('');
  const [address, setAddress] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<LocationResult | null>(null);
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  const maxDate = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
  const today = new Date().toISOString().split('T')[0];

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'Title is required';
    if (!description.trim()) e.description = 'Description is required';
    if (!goal || parseFloat(goal) <= 0) e.goal = 'Enter a valid goal amount';
    if (!deadline) e.deadline = 'Deadline is required';
    if (!address.trim()) e.address = 'Location is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const result = await createInitiative.mutateAsync({
        title,
        description,
        goal_amount: parseFloat(goal),
        deadline: new Date(deadline).toISOString(),
        address,
        latitude: selectedLocation?.lat || 0,
        longitude: selectedLocation?.lng || 0,
        visibility,
      });
      navigate(`/initiative/${result.id}`);
    } catch (error) {
      console.error('Failed to create initiative:', error);
      setErrors({ submit: 'Failed to create initiative. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container max-w-2xl py-8">
        <h1 className="text-3xl font-bold font-display mb-1">Create Initiative</h1>
        <p className="text-muted-foreground mb-8">Start a new funding pool for your community</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold font-display flex items-center gap-2">
              Basic Info
              <span className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center cursor-help" title="Core details about your initiative">
                <Info className="w-3 h-3 text-muted-foreground" />
              </span>
            </h2>

            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Community Garden Renovation" className="mt-1" />
              {errors.title && <p className="text-xs text-destructive mt-1">{errors.title}</p>}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your initiative, its goals, and how the funds will be used…"
                rows={4}
                className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="goal" className="flex items-center gap-1">
                  Goal Amount
                  <span className="w-4 h-4 rounded-full bg-secondary flex items-center justify-center cursor-help" title="The total amount you want to raise">
                    <Info className="w-2.5 h-2.5 text-muted-foreground" />
                  </span>
                </Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                  <Input id="goal" type="number" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="5,000" className="pl-7" min={1} />
                </div>
                {errors.goal && <p className="text-xs text-destructive mt-1">{errors.goal}</p>}
              </div>

              <div>
                <Label htmlFor="deadline" className="flex items-center gap-1">
                  Deadline
                  <span className="w-4 h-4 rounded-full bg-secondary flex items-center justify-center cursor-help" title="Maximum 7 days from today">
                    <Info className="w-2.5 h-2.5 text-muted-foreground" />
                  </span>
                </Label>
                <Input id="deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="mt-1" min={today} max={maxDate} />
                {errors.deadline && <p className="text-xs text-destructive mt-1">{errors.deadline}</p>}
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold font-display">Location</h2>
            <div>
              <Label htmlFor="address">Address</Label>
              <LocationAutocomplete
                value={address}
                onChange={setAddress}
                onSelect={(loc) => {
                  setSelectedLocation(loc);
                  // Fly map to selected location
                  if (mapRef.current) {
                    mapRef.current.flyTo({ center: [loc.lng, loc.lat], zoom: 13, speed: 0.8 });
                    if (markerRef.current) markerRef.current.remove();
                    markerRef.current = new mapboxgl.Marker({ color: '#e88c30' })
                      .setLngLat([loc.lng, loc.lat])
                      .addTo(mapRef.current);
                  }
                }}
                error={errors.address}
                className="mt-1"
              />
            </div>

            {/* Map preview */}
            <MapPreview mapContainer={mapContainer} mapRef={mapRef} selectedLocation={selectedLocation} />
          </section>

          {/* Visibility */}
          <VisibilitySection visibility={visibility} setVisibility={setVisibility} />

          {errors.submit && (
            <p className="text-sm text-destructive text-center">{errors.submit}</p>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={createInitiative.isPending}>
            {createInitiative.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Initiative'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateInitiative;
