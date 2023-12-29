import Layout from './Layout'
import MarkdownContent from './MarkdownContent'
import Head from 'next/head'
import { META_TITLE_SUFFIX } from '../lib/constants'
import Gallery from './Gallery'
import DateComponent from './DateComponent'

export default function SideLayout ({
    preview,
    children,
    images = [],
    metaTitle = null,
    title = '',
    galleryLayout = '',
    content = {},
    bottom = null,
    date = null
}) {

    metaTitle = metaTitle || `${title} ${META_TITLE_SUFFIX}`
    return <>
        {metaTitle &&
            <Head>
                <title>{metaTitle}</title>
            </Head>
        }
        <Layout preview={preview}>
            <div className="sm:flex sm:flex-row-reverse sm:items-stretch">
                <div className="sm:w-1/2 md:w-1/3 lg:w-1/3 px-4 pt-8 pb-4 bg-white">
                    {date &&
                        <div className="text-sm">
                            <DateComponent dateString={date}/>
                        </div>
                    }
                    {title &&
                        <h1 className="text-3xl leading-tight mb-8 tracking-normal">
                            {title}
                        </h1>
                    }
                    {children}
                    {content && <MarkdownContent content={content}></MarkdownContent>}
                </div>
                <div className={'flex-1 px-4'}>
                    {images.length && <Gallery images={images} galleryLayout={galleryLayout || ''}></Gallery>}
                </div>

            </div>
            {bottom}
        </Layout>
    </>
}
