'use client';

import { useState, useRef } from 'react';
import { Search, MapPin, Tag, ChevronDown, Navigation } from 'lucide-react';
import clsx from 'clsx';

const PLACE_TYPES = [
    'Dentists', 'Doctors', 'Hospitals', 'Pharmacies', 'Clinics',
    'Restaurants', 'Cafes', 'Bakeries', 'Bars', 'Fast Food',
    'Gyms', 'Yoga Studios', 'Spas', 'Salons', 'Barbershops', 'Gym',
    'Hotels', 'Guest Houses', 'Resorts', 'Real Estate',
    'Schools', 'Colleges', 'Coaching Centers',
    'Banks', 'ATMs', 'Insurance Agents',
    'Lawyers', 'Chartered Accountants',
    'Grocery Stores', 'Supermarkets', 'Clothing Stores',
    'Electricians', 'Plumbers', 'Contractors',
    'Petrol Pumps', 'Car Service Centers', 'Driving Schools',
];

interface Props {
    onSearch: (area: string, type: string, radius?: number, location?: string) => void;
    loading: boolean;
}

export default function SearchForm({ onSearch, loading }: Props) {
    const [area, setArea] = useState('');
    const [type, setType] = useState('');
    const [radius, setRadius] = useState(5);
    const [unit, setUnit] = useState<'km' | 'm'>('km');
    const [userLocation, setUserLocation] = useState<string | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [filtered, setFiltered] = useState(PLACE_TYPES);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchLocation = () => {
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const loc = `${pos.coords.latitude},${pos.coords.longitude}`;
                setUserLocation(loc);
                setArea('Current Location');
                setIsLocating(false);
            },
            (err) => {
                console.error(err);
                alert('Could not fetch location. Please enter area manually.');
                setIsLocating(false);
            }
        );
    };

    const handleTypeInput = (val: string) => {
        setType(val);
        setFiltered(PLACE_TYPES.filter((t) => t.toLowerCase().includes(val.toLowerCase())));
        setShowDropdown(true);
    };

    const selectType = (t: string) => {
        setType(t);
        setShowDropdown(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!area.trim() || !type.trim()) return;
        setShowDropdown(false);

        // Convert radius to meters for Google API
        const radiusInMeters = unit === 'km' ? radius * 1000 : radius;
        onSearch(area.trim(), type.trim(), radiusInMeters, userLocation || undefined);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-3">
            <div className="flex flex-col lg:flex-row gap-3">
                {/* Area Input */}
                <div className="flex-[1.5] relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                        type="text"
                        value={area}
                        onChange={(e) => {
                            setArea(e.target.value);
                            if (userLocation && e.target.value !== 'Current Location') setUserLocation(null);
                        }}
                        placeholder="Area (e.g. Indrapuri C Sector, Bhopal)"
                        className="w-full pl-10 pr-12 py-3 bg-slate-800 border border-slate-700 hover:border-slate-600 focus:border-indigo-500 rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-colors"
                        required
                    />
                    <button
                        type="button"
                        onClick={fetchLocation}
                        className={clsx(
                            "absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors",
                            isLocating ? "text-indigo-400 animate-pulse" : "text-slate-500 hover:text-white hover:bg-slate-700"
                        )}
                        title="Use my current location"
                    >
                        <Navigation className="w-4 h-4" />
                    </button>
                </div>

                {/* Type Input */}
                <div className="flex-[1.5] relative" ref={dropdownRef}>
                    <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />
                    <input
                        type="text"
                        value={type}
                        onChange={(e) => handleTypeInput(e.target.value)}
                        onFocus={() => setShowDropdown(true)}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                        placeholder="Type (e.g. Dentists)"
                        className="w-full pl-10 pr-10 py-3 bg-slate-800 border border-slate-700 hover:border-slate-600 focus:border-indigo-500 rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-colors"
                        required
                    />
                    <ChevronDown className={clsx('absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none transition-transform', showDropdown && 'rotate-180')} />

                    {showDropdown && filtered.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 max-h-52 overflow-y-auto">
                            {filtered.map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onMouseDown={() => selectType(t)}
                                    className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors first:rounded-t-xl last:rounded-b-xl"
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Radius & Search */}
                <div className="flex flex-1 gap-3">
                    <div className="flex-1 flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 h-[46px]">
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-0.5">
                                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Radius</span>
                                <span className="text-[10px] text-indigo-400 font-bold">{radius}{unit}</span>
                            </div>
                            <input
                                type="range"
                                min={unit === 'km' ? 1 : 100}
                                max={unit === 'km' ? 50 : 5000}
                                step={unit === 'km' ? 1 : 100}
                                value={radius}
                                onChange={(e) => setRadius(Number(e.target.value))}
                                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                        </div>
                        <select
                            value={unit}
                            onChange={(e) => {
                                const newUnit = e.target.value as 'km' | 'm';
                                setUnit(newUnit);
                                setRadius(newUnit === 'km' ? 5 : 1000);
                            }}
                            className="bg-transparent text-xs text-slate-400 outline-none border-l border-slate-700 pl-2 py-1 h-full"
                        >
                            <option value="km">km</option>
                            <option value="m">m</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !area.trim() || !type.trim()}
                        className={clsx(
                            'flex items-center justify-center gap-2 px-6 h-[46px] rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap',
                            loading || !area.trim() || !type.trim()
                                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30'
                        )}
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Search className="w-4 h-4" />
                        )}
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </div>
        </form>
    );
}
