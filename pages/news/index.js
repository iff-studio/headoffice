import Layout from '../../components/Layout'
import { getAllByType } from '../../lib/api'
import Head from 'next/head'
import { META_TITLE_SUFFIX } from '../../lib/constants'
import Link from 'next/link'
import ContentfulImage from '../../components/ContentfulImage'
import NewsSection from '../../components/NewsSection'

export default function Index ({ preview, posts }) {

    const title = `News ${META_TITLE_SUFFIX}`
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <Layout preview={preview}>
                <NewsSection news={posts} title={null}></NewsSection>
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
