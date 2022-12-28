
import Layout from '../components/layout'
import Head from 'next/head'
import { CMS_NAME } from '../lib/constants'

export default function Index ({ preview }) {

    const title = `Next.js Blog Example with ${CMS_NAME}`
    return (
        <>
            <Layout preview={preview}>
                <Head>
                    <title>{title}</title>
                </Head>

            </Layout>
        </>
    )
}

export async function getStaticProps ({ preview = false }) {
    return {
        props: { preview },
    }
}
