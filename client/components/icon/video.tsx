export default function Video(props: { on: boolean }) {
    return <>
        {props.on ? (
            <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-label="Video on">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"
                />
            </svg>
        ) : (
            <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-label="Video off">
                <path fillRule="evenodd" clipRule="evenodd" d="M4 6h10.5v12H4z" opacity=".3"/>
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18 14.5V11c0-.55-.45-1-1-1H6.5l4 4-4 4h11c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"
                />
            </svg>
        )}
    </>;
}