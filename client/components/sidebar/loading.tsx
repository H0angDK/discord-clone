const Loading = () => {
    return (
        <ul className="flex flex-col p-2">
            {Array.from({length: 15}).map((_, index) => (
                <li key={index} className="animate-pulse">
                    <div className="block px-2 py-1 rounded-lg border-l-4 border-transparent">
                        <div className="h-10 bg-surface-400 rounded w-full"></div>
                    </div>
                </li>
            ))}
        </ul>
    )
}

export {Loading}