export default function LoadingSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-40 bg-slate-700/50" />
                    <div className="p-4 space-y-3">
                        <div className="h-4 bg-slate-700/50 rounded-lg w-3/4" />
                        <div className="h-3 bg-slate-700/50 rounded-lg w-1/2" />
                        <div className="h-3 bg-slate-700/50 rounded-lg w-full" />
                        <div className="h-3 bg-slate-700/50 rounded-lg w-2/3" />
                        <div className="h-9 bg-slate-700/50 rounded-xl mt-4" />
                    </div>
                </div>
            ))}
        </div>
    );
}
