import clsx from "@/features/clsx";

export default function Loading() {
    return (
        <div className="flex min-h-screen">
            <aside
                className={clsx("bg-surface-200 h-screen transition-all duration-300 overflow-hidden border-r-2 border-border-medium scroll-smooth w-1/6")}>
                <div className="animate-pulse">
                    <div className="h-12 bg-surface-300 rounded-lg mb-4"></div>
                </div>
                <ul className="flex flex-col p-2">
                    {Array.from({length: 15}).map((_, index) => (
                        <li key={index} className="animate-pulse">
                            <div className="block px-2 py-1 rounded-lg border-l-4 border-transparent">
                                <div className="h-10 bg-surface-400 rounded w-full"></div>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="animate-pulse">
                    <div className="h-14 bg-surface-300 rounded-lg mb-4"></div>
                </div>
            </aside>

            <main className="w-full p-3">
                <div className="block px-2 py-1 rounded-lg border-l-4 border-transparent w-full h-full">
                    <div className="h-full bg-surface-400 rounded w-full animate-pulse"></div>
                </div>
            </main>
        </div>
    )
};