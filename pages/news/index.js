import Layout from '../../components/layout'
import { getAllByType } from '../../lib/api'
import Head from 'next/head'
import { META_TITLE_SUFFIX } from '../../lib/constants'
import Link from 'next/link'
import ContentfulImage from '../../components/ContentfulImage'

export default function Index ({ preview, posts }) {

    const title = `News ${META_TITLE_SUFFIX}`
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <Layout preview={preview}>
                <div className="grid font-bold p-2"
                     style={{ gridTemplateColumns: `repeat(auto-fill, minmax(400px, 600px))` }}>
                    {posts.map(function (post, key) {
                        let { url, width, height } = post.coverImage;

                        return <Link href={`/news/${post.slug}`} className='p-2' key={key}>
                            <ContentfulImage {...{ src: url, width, height }}/>
                            <h4 className="pt-2">
                                {post.title}
                            </h4>

                        </Link>

                    })}
                </div>
            </Layout>
        </>
    )
}

export async function getStaticProps ({ preview = false }) {
    const posts = await getAllByType('post', preview)
    return {
        props: { posts },
    }
}
