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
            <div className="sm:flex sm:flex-row-reverse border border-black sm:items-stretch -mt-0.5">
                <div className="sm:w-1/2 md:w-1/3 lg:w-1/2 p-4 border border-black border-fix bg-white">
                    {title &&
                        <h1 className="text-6xl  font-bold tracking-tighter leading-tight md:leading-none pb-4 pt-2">
                            {title}
                        </h1>
                    }
                    {children}
                    {content && <MarkdownContent content={content}></MarkdownContent>}
                </div>
                <div className={'flex-1 border border-black  border-fix'}>
                    {images.length && <Gallery images={images} galleryLayout={galleryLayout || ''}></Gallery>}
                </div>

            </div>
            {bottom}
        </Layout>
    </>
}
