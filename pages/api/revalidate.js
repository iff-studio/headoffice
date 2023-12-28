
export default async function handler (req, res) {
    let inboundRevalToken = req.headers['x-vercel-reval-key']


    if (!inboundRevalToken) {
        return res
            .status(401)
            .json({ message: 'x-vercel-reval-key header not defined' })
    } else if (inboundRevalToken !== process.env.CONTENTFUL_REVALIDATE_SECRET) {
        return res.status(401).json({ message: 'Invalid token' })
    }

    try {

        const postSlug = req.body.fields.slug['en-US']
        const postType = req.body.sys.contentType.sys.id
        let urls = []

        if (postType === 'model') {
            urls.push(`/models/${postSlug}`)
            urls.push(`/`)
        }

        if (postType === 'post') {
            urls.push(`/news/${postSlug}`)
            urls.push(`/news`)
        }

        if (postType === 'page') {
            urls.push(`/${postSlug}`)
        }

        let promises = urls.map((url) => {
            return res.revalidate(url)
        })

        let results = await Promise.all(promises)

        return res.json({ revalidated: true, postSlug, postType, urls, results })
    } catch (err) {
        console.log(err)
        // If there was an error, Next.js will continue
        // to show the last successfully generated page
        return res.status(500).send('Error revalidating: ' + err.toString())
    }
}
