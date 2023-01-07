import Layout from './Layout'
import MarkdownContent from './MarkdownContent'
import Head from 'next/head'
import { META_TITLE_SUFFIX } from '../lib/constants'
import Gallery from './Gallery'

export default function SideLayout ({
    preview,
    children,
    images = [],
    metaTitle = null,
    title = '',
    galleryLayout = '',
    content = {},
    bottom = null
}) {

    metaTitle = metaTitle || `${title} ${META_TITLE_SUFFIX}`
    return <>
        {metaTitle &&
            <Head>
                <title>{metaTitle}</title>
            </Head>
        }
        <Layout preview={preview}>
            <div className="sm:flex sm:flex-row-reverse">
                <div className="pt-8 sm:pt-16 px-4 sm:px-8 sm:w-6/12 md:w-5/12 lg:w-5/12 xl:w-4/12 2xl:2/12">
                    {title &&
                        <h1 className="text-6xl  font-bold tracking-tighter leading-tight md:leading-none mb-8">
                            {title}
                        </h1>
                    }
                    {children}
                    {content && <MarkdownContent content={content}></MarkdownContent>}
                </div>
                <div className="flex-1">
                    {images.length && <Gallery images={images} galleryLayout={galleryLayout || ''}></Gallery>}
                </div>

            </div>
            {bottom}
        </Layout>
    </>
}
