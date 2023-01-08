export default function PreviewAlert ({ preview }) {
    if (!preview) {
        return null
    }
    return (
        <div className="bg-accent-7 border-accent-7 text-white">
            <div className="py-2 text-center text-sm">
                This is page is a preview.&nbsp;
                <a href={`/api/exit-preview?path=${window ? window.location.pathname : '/'}`}
                   className="underline hover:text-cyan duration-200 transition-colors">
                    Click here to exit preview mode.
                </a>
            </div>
        </div>
    )
}
