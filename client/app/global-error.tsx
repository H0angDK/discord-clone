'use client'

import {useEffect} from "react";

interface ErrorProps {
    error: Error & { digest?: string },
    reset: () => void
}

export default function GlobalError({error, reset,}: ErrorProps) {

    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <html>
        <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
        </body>
        </html>
    )
}