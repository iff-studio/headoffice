import { useEffect } from 'react'

export default function PreviewAlert ({ preview }) {
    let $a = null

    if (!preview) {
        return null
    }

    useEffect(function () {
        if (window) {
            $a.setAttribute('href', `/api/exit-preview?path=${window ? window.location.pathname : '/'}`)
        }
    })

    return (
        <div className="bg-accent-7 border-accent-7 text-white">
            <div className="py-2 text-center text-sm">
                This is page is a preview.&nbsp;
                <a ref={(el) => $a = el} href="/api/exit-preview"
                   className="underline hover:text-cyan duration-200 transition-colors">
                    Click here to exit preview mode.
                </a>
            </div>
        </div>
    )
}
