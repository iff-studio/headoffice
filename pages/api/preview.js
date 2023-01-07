import { getAllByType } from '../../lib/api'

export default async function preview (req, res) {
    const { secret, slug, contentType } = req.query

    if (secret !== process.env.CONTENTFUL_PREVIEW_SECRET || !slug) {
        return res.status(401).json({ message: 'Invalid token' })
    }

    // Enable Preview Mode by setting the cookies
    res.setPreviewData({})

    // Redirect to the path from the fetched post
    // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
    // res.writeHead(307, { Location: `/posts/${post.slug}` })
    let url = null;

    switch (contentType){
        case ('model'):
            url = `/model/${post.slug}`
            break;
        case ('post'):
            url = `/news/${post.slug}`
            break;
        case ('page'):
            url = `/page/${post.slug}`
            break;
    }

    res.setHeader('Content-Type', 'text/html')
    res.write(
        `<!DOCTYPE html><html><head><meta http-equiv="Refresh" content="0; url=${url}" />
    <script>window.location.href = '${url}'</script>
    </head>
    </html>`
    )
    res.end()
}
