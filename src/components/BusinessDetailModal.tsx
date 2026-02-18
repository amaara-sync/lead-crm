'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    X, Star, MapPin, Globe, Phone, Clock, Info,
    ChevronLeft, ChevronRight, Image, Truck, ShoppingBag,
    Coffee, Utensils, CheckCircle2, Navigation, ExternalLink,
    MessageSquare, Calendar, Accessibility, Wine
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlaceDetail, PlaceSummary, LeadData, LeadStatus, InteractionLog } from '@/types';
import LeadInteractionForm from '@/components/LeadInteractionForm';
import clsx from 'clsx';

interface Props {
    place: PlaceSummary | null;
    onClose: () => void;
    getPhotoUrl: (ref: string, maxwidth?: number) => string;
    leadData?: LeadData;
    onUpdateLeadStatus: (status: LeadStatus) => void;
    onAddLeadNote: (text: string) => void;
    onLogInteraction: (type: InteractionLog['type'], details: string) => void;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function BusinessDetailModal({
    place: summary, onClose, getPhotoUrl, leadData,
    onUpdateLeadStatus, onAddLeadNote, onLogInteraction
}: Props) {
    const [place, setPlace] = useState<PlaceDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);
    const [activeTab, setActiveTab] = useState<'info' | 'crm' | 'hours' | 'reviews' | 'photos'>('info');

    useEffect(() => {
        if (summary) {
            fetchDetails(summary.place_id);
            setActiveTab('info');
            setPhotoIndex(0);
        }
    }, [summary]);

    const fetchDetails = async (id: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/place-details?place_id=${id}`);
            const data = await res.json();
            if (data.result) setPlace(data.result);
        } catch (err) {
            console.error('Failed to fetch details:', err);
        } finally {
            setLoading(false);
        }
    };

    const serviceOptions = [
        { key: 'delivery', label: 'Delivery', icon: <Truck className="w-4 h-4" /> },
        { key: 'takeout', label: 'Takeout', icon: <ShoppingBag className="w-4 h-4" /> },
        { key: 'dine_in', label: 'Dine In', icon: <Utensils className="w-4 h-4" /> },
        { key: 'curbside_pickup', label: 'Curbside Pickup', icon: <Navigation className="w-4 h-4" /> },
        { key: 'serves_breakfast', label: 'Breakfast', icon: <Coffee className="w-4 h-4" /> },
        { key: 'serves_lunch', label: 'Lunch', icon: <Utensils className="w-4 h-4" /> },
        { key: 'serves_dinner', label: 'Dinner', icon: <Utensils className="w-4 h-4" /> },
        { key: 'serves_brunch', label: 'Brunch', icon: <Coffee className="w-4 h-4" /> },
        { key: 'serves_beer', label: 'Beer', icon: <Wine className="w-4 h-4" /> },
        { key: 'serves_wine', label: 'Wine', icon: <Wine className="w-4 h-4" /> },
        { key: 'serves_vegetarian_food', label: 'Vegetarian', icon: <Utensils className="w-4 h-4" /> },
        { key: 'reservable', label: 'Reservations', icon: <Calendar className="w-4 h-4" /> },
        { key: 'wheelchair_accessible_entrance', label: 'Wheelchair Access', icon: <Accessibility className="w-4 h-4" /> },
    ] as const;

    const activeServices = useMemo(() => {
        if (!place) return [];
        return serviceOptions.filter(
            (opt) => (place as unknown as Record<string, unknown>)[opt.key] === true
        );
    }, [place]);

    const tabs = [
        { id: 'info', label: 'Info', icon: Info },
        { id: 'crm', label: 'CRM Leads', icon: CheckCircle2 },
        { id: 'hours', label: 'Hours', icon: Clock },
        { id: 'reviews', label: 'Reviews', icon: Star },
        { id: 'photos', label: 'Photos', icon: Image },
    ] as const;

    if (!summary) return null;

    const photos = place?.photos || summary.photos || [];
    const reviews = place?.reviews || [];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ y: 50, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 50, opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700/50 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header Photo Section */}
                    <div className="relative h-48 sm:h-64 bg-slate-800 flex-shrink-0">
                        {photos.length > 0 ? (
                            <>
                                <img
                                    src={getPhotoUrl(photos[photoIndex].photo_reference, 1200)}
                                    alt=""
                                    className="w-full h-full object-cover transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />

                                {photos.length > 1 && (
                                    <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => setPhotoIndex((i) => (i - 1 + photos.length) % photos.length)} className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60"><ChevronLeft /></button>
                                        <button onClick={() => setPhotoIndex((i) => (i + 1) % photos.length)} className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60"><ChevronRight /></button>
                                    </div>
                                )}
                                <div className="absolute bottom-4 right-4 text-[10px] bg-black/60 text-white px-2 py-1 rounded-full font-bold">
                                    PHOTO {photoIndex + 1} / {photos.length}
                                </div>
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center opacity-20">
                                <Image className="w-16 h-16" />
                            </div>
                        )}

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Nav Tabs */}
                    <div className="flex border-b border-slate-700/50 bg-slate-900/50 px-4 flex-shrink-0 overflow-x-auto no-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={clsx(
                                    "flex items-center gap-2 px-4 py-4 text-sm font-semibold transition-all whitespace-nowrap border-b-2",
                                    activeTab === tab.id ? "text-indigo-400 border-indigo-500" : "text-slate-500 border-transparent hover:text-slate-300"
                                )}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                        {loading ? (
                            <div className="space-y-6 animate-pulse">
                                <div className="h-8 w-1/3 bg-slate-800 rounded-lg" />
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="h-24 bg-slate-800 rounded-2xl" />
                                    <div className="h-24 bg-slate-800 rounded-2xl" />
                                </div>
                                <div className="h-40 bg-slate-800 rounded-2xl" />
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {activeTab === 'info' && (
                                    <div className="space-y-8 slide-up">
                                        <header>
                                            <h2 className="text-3xl font-bold text-white mb-2">{place?.name || summary.name}</h2>
                                            <div className="flex items-center gap-4 text-slate-400">
                                                {(place?.rating || summary.rating) && (
                                                    <div className="flex items-center gap-1.5">
                                                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                                        <span className="text-amber-400 font-bold">{(place?.rating || summary.rating)?.toFixed(1)}</span>
                                                        <span className="text-slate-500 text-xs">({(place?.user_ratings_total || summary.user_ratings_total)?.toLocaleString()} reviews)</span>
                                                    </div>
                                                )}
                                                {place?.price_level !== undefined && (
                                                    <span className="text-emerald-400 font-bold">{'$'.repeat(place.price_level)}</span>
                                                )}
                                                <span className={clsx("text-xs font-bold px-2 py-0.5 rounded-full", place?.opening_hours?.open_now ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400")}>
                                                    {place?.opening_hours?.open_now ? 'OPEN' : 'CLOSED'}
                                                </span>
                                            </div>
                                        </header>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 space-y-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 flex-shrink-0"><MapPin className="w-4 h-4" /></div>
                                                    <p className="text-sm text-slate-300 leading-relaxed font-medium">{place?.formatted_address || summary.vicinity}</p>
                                                </div>
                                                {place?.formatted_phone_number && (
                                                    <a href={`tel:${place.formatted_phone_number}`} className="flex items-center gap-4 group">
                                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors"><Phone className="w-4 h-4" /></div>
                                                        <span className="text-sm text-slate-300 font-medium group-hover:text-white">{place.formatted_phone_number}</span>
                                                    </a>
                                                )}
                                                {place?.website && (
                                                    <a href={place.website} target="_blank" className="flex items-center gap-4 group">
                                                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 flex-shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-colors"><Globe className="w-4 h-4" /></div>
                                                        <span className="text-sm text-slate-300 font-medium group-hover:text-white truncate">{place.website.replace(/^https?:\/\//, '')}</span>
                                                    </a>
                                                )}
                                            </div>

                                            {activeServices.length > 0 && (
                                                <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50">
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-4 px-1">Services & Amenities</p>
                                                    <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                                                        {activeServices.map((s) => (
                                                            <div key={s.key} className="flex items-center gap-2 text-xs text-slate-400">
                                                                <div className="text-indigo-400">{s.icon}</div>
                                                                <span className="font-medium">{s.label}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'crm' && (
                                    <div className="space-y-6 slide-up">
                                        <div className="flex items-center justify-between bg-indigo-600/10 border border-indigo-500/20 p-5 rounded-2xl">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white"><CheckCircle2 className="w-6 h-6" /></div>
                                                <div>
                                                    <h3 className="font-bold text-white">Lead Workspace</h3>
                                                    <p className="text-xs text-slate-400">Manage interaction history and conversion status.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <LeadInteractionForm
                                            placeId={summary.place_id}
                                            leadData={leadData}
                                            onUpdateStatus={onUpdateLeadStatus}
                                            onAddNote={onAddLeadNote}
                                            onLogInteraction={onLogInteraction}
                                        />
                                    </div>
                                )}

                                {activeTab === 'hours' && (
                                    <div className="space-y-6 slide-up">
                                        {place?.opening_hours?.weekday_text ? (
                                            <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden">
                                                <div className="p-4 bg-slate-800 border-b border-slate-700/50 flex items-center gap-3">
                                                    <Clock className="w-4 h-4 text-indigo-400" />
                                                    <span className="font-bold text-sm text-white">Weekly Schedule</span>
                                                </div>
                                                <div className="p-2 space-y-1">
                                                    {place.opening_hours.weekday_text.map((text, i) => {
                                                        const isToday = i === (new Date().getDay() + 6) % 7;
                                                        return (
                                                            <div key={i} className={clsx("flex justify-between px-4 py-3 rounded-xl text-sm transition-colors", isToday ? "bg-indigo-500 text-white font-bold" : "text-slate-400 hover:text-slate-200")}>
                                                                <span>{text.split(': ')[0]}</span>
                                                                <span>{text.split(': ').slice(1).join(': ')}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-20 text-slate-600">
                                                <Clock className="w-12 h-12 mx-auto mb-4 opacity-10" />
                                                <p className="text-sm">Hours info not provided.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'reviews' && (
                                    <div className="space-y-4 slide-up">
                                        {reviews.length > 0 ? (
                                            reviews.map((rev, i) => (
                                                <div key={i} className="bg-slate-800/30 p-5 rounded-2xl border border-slate-700/30 space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <img src={rev.profile_photo_url} alt="" className="w-10 h-10 rounded-full border border-slate-700" />
                                                            <div>
                                                                <p className="text-sm font-bold text-white">{rev.author_name}</p>
                                                                <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{rev.relative_time_description}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1 bg-amber-400/10 px-2 py-1 rounded-lg">
                                                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                                            <span className="text-sm font-bold text-amber-400">{rev.rating}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-slate-400 leading-relaxed italic">"{rev.text}"</p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-20 text-slate-600">
                                                <Star className="w-12 h-12 mx-auto mb-4 opacity-10" />
                                                <p className="text-sm">No reviews yet.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'photos' && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 slide-up">
                                        {photos.map((p, i) => (
                                            <button
                                                key={i}
                                                onClick={() => { setPhotoIndex(i); setActiveTab('info'); }}
                                                className={clsx("relative aspect-square rounded-2xl overflow-hidden border-2 transition-all hover:scale-[1.02]", photoIndex === i ? "border-indigo-500 ring-2 ring-indigo-500/20" : "border-transparent opacity-60 hover:opacity-100")}
                                            >
                                                <img src={getPhotoUrl(p.photo_reference, 600)} alt="" className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Direct CTA Footer */}
                    <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-2 text-slate-500 text-[10px] sm:text-xs">
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Contact info synced with Google Maps</span>
                        </div>
                        {place?.url && (
                            <a href={place.url} target="_blank" className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all">
                                Get Directions <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
