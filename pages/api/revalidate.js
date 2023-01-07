// pages/api/revalidate.js

export default async function handler (req, res) {
    // should be secret, custom header coming in from Contentful
    let inboundRevalToken = req.headers['x-vercel-reval-key']

    // Check for secret to confirm this is a valid request
    if (!inboundRevalToken) {
        return res
            .status(401)
            .json({ message: 'x-vercel-reval-key header not defined' })
    } else if (inboundRevalToken !== process.env.CONTENTFUL_REVALIDATE_SECRET) {
        return res.status(401).json({ message: 'Invalid token' })
    }

    try {

        // Note: if this fails to parse you may have forgot to set the
        // "content-type" header correctly as mentioned here https://github.com/vercel/next.js/blob/canary/examples/cms-contentful/README.md#step-9-try-using-on-demand-revalidation
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

        let promises = urls.map(() => {
            return res.revalidate(`/${postSlug}`)
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
