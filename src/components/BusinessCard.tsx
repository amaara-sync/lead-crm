'use client';

import { motion } from 'framer-motion';
import { Star, Phone, Globe, MapPin, ChevronRight, Clock, DollarSign, ExternalLink, CheckCircle2 } from 'lucide-react';
import { PlaceSummary, LeadData } from '@/types';
import clsx from 'clsx';

interface Props {
    place: PlaceSummary;
    onViewDetails: (place: PlaceSummary) => void;
    getPhotoUrl: (ref: string, maxwidth?: number) => string;
    index: number;
    viewMode?: 'grid' | 'list';
    leadData?: LeadData;
}

export default function BusinessCard({ place, onViewDetails, getPhotoUrl, index, viewMode = 'grid', leadData }: Props) {
    const photo = place.photos?.[0];
    const isOpen = place.opening_hours?.open_now;

    const statusColor: Record<string, string> = {
        OPERATIONAL: 'bg-emerald-500',
        CLOSED_TEMPORARILY: 'bg-yellow-500',
        CLOSED_PERMANENTLY: 'bg-red-500',
    };

    const leadStatusColors: Record<string, string> = {
        New: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
        Attempted: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        Contacted: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        Qualified: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        Unqualified: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
        Won: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
        Lost: 'bg-red-500/20 text-red-400 border-red-500/30',
    };

    if (viewMode === 'list') {
        return (
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03, duration: 0.2 }}
                className="group bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/50 hover:border-indigo-500/40 rounded-xl overflow-hidden transition-all duration-200 flex items-center p-3 gap-4"
            >
                {/* Small Photo or Icon */}
                <div className="w-16 h-16 rounded-lg bg-slate-700 flex-shrink-0 overflow-hidden">
                    {photo ? (
                        <img src={getPhotoUrl(photo.photo_reference, 200)} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-30">
                            <MapPin className="w-6 h-6" />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-semibold text-white text-sm truncate">{place.name}</h3>
                        {leadData && (
                            <span className={clsx("text-[10px] px-1.5 py-0.5 rounded-full border font-medium", leadStatusColors[leadData.status])}>
                                {leadData.status}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                        {place.rating && (
                            <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                <span className="text-amber-400">{place.rating.toFixed(1)}</span>
                            </div>
                        )}
                        <p className="truncate max-w-[200px]">{place.vicinity || place.formatted_address}</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    {place.formatted_phone_number && (
                        <a
                            href={`tel:${place.formatted_phone_number}`}
                            className="p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:text-white hover:bg-indigo-600 transition-colors"
                            title="Call Lead"
                        >
                            <Phone className="w-4 h-4" />
                        </a>
                    )}
                    <button
                        onClick={() => onViewDetails(place)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/30 rounded-lg text-xs font-medium transition-all"
                    >
                        View
                        <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </motion.div>
        );
    }

    // Grid View (Default)
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.3 }}
            className="group bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-indigo-500/40 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/5 flex flex-col"
        >
            {/* Photo */}
            <div className="relative h-40 bg-slate-700 flex-shrink-0">
                {photo ? (
                    <img
                        src={getPhotoUrl(photo.photo_reference, 600)}
                        alt={place.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        {place.icon ? (
                            <img src={place.icon} alt="" className="w-12 h-12 opacity-30" />
                        ) : (
                            <MapPin className="w-10 h-10 text-slate-600" />
                        )}
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

                {/* Status dot */}
                {place.business_status && (
                    <div className="absolute top-3 left-3">
                        <div className={clsx('w-2.5 h-2.5 rounded-full', statusColor[place.business_status] || 'bg-slate-500')} />
                    </div>
                )}

                {/* Lead Status Badge */}
                {leadData && (
                    <div className="absolute top-3 left-8 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1 bg-white text-slate-900">
                        <CheckCircle2 className="w-2.5 h-2.5 text-indigo-500" />
                        {leadData.status.toUpperCase()}
                    </div>
                )}

                {/* Open/Closed badge */}
                {isOpen !== undefined && (
                    <div className={clsx('absolute top-3 right-3 text-xs font-medium px-2 py-0.5 rounded-full', isOpen ? 'bg-emerald-500/90 text-white' : 'bg-slate-700/90 text-slate-300')}>
                        {isOpen ? 'Open' : 'Closed'}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-white text-sm leading-tight mb-1 line-clamp-2">{place.name}</h3>

                {/* Rating */}
                {place.rating && (
                    <div className="flex items-center gap-1.5 mb-2">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-amber-400 text-sm font-medium">{place.rating.toFixed(1)}</span>
                        {place.user_ratings_total && (
                            <span className="text-slate-500 text-xs text-nowrap truncate max-w-[60px]">({place.user_ratings_total.toLocaleString()})</span>
                        )}
                        <div className="flex-1" />
                        {leadData && <span className="text-[10px] text-indigo-400 italic">Interacted</span>}
                    </div>
                )}

                {/* Address */}
                {(place.vicinity || place.formatted_address) && (
                    <div className="flex items-start gap-1.5 mb-3">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
                        <p className="text-slate-400 text-xs line-clamp-2">{place.vicinity || place.formatted_address}</p>
                    </div>
                )}

                <div className="mt-auto space-y-2">
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        {place.formatted_phone_number && (
                            <a
                                href={`tel:${place.formatted_phone_number}`}
                                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
                            >
                                <Phone className="w-3.5 h-3.5" />
                                Call
                            </a>
                        )}
                        {place.website && (
                            <a
                                href={place.website}
                                target="_blank"
                                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
                            >
                                <Globe className="w-3.5 h-3.5" />
                                Web
                            </a>
                        )}
                    </div>
                    <button
                        onClick={() => onViewDetails(place)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 hover:border-indigo-500 text-indigo-400 hover:text-white text-sm font-medium rounded-xl transition-all duration-200 group/btn"
                    >
                        View Full Profile
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
