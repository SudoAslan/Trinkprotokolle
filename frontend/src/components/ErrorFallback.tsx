
export function ErrorFallback({error}: {error: Error}) {
    return(
        <div>
            <h1>Something went wrong:</h1>
            <pre>Error: {error.message}</pre>
            <pre>Errorstack: {error.stack}</pre>
        </div>
    )
}