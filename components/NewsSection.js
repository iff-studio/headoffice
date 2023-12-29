import CoverImage from './CoverImage'
import Link from 'next/link'
import DateComponent from './DateComponent'
import SideTitle from './SideTitle'
import { PLACEHOLDER } from '../lib/placeholder'

export default function NewsSection ({ news = [], title = 'News', hasLeading = true }) {

    if (!news.length) {
        return null
    }

    return <section className={'relative -mt-0.5 border border-transparent clearfix'}>
        <SideTitle>{title}</SideTitle>
        {news.map((post, key) => {
            return (
                <div key={post.slug}
                     className={`border border-transparent border-fix float-left w-full md:flex md:items-stretch`}>
                    <div className="md:w-1/2 md:float-left py-4 md:py-12">
                        <div className="md:w-8/12 mx-auto">
                            <CoverImage title={post.title} slug={post.slug} url={post.coverImage?.url ?? PLACEHOLDER}
                                        alt=""/>
                        </div>
                    </div>
                    <div className="md:w-1/2 md:float-left">
                        <div className="md:w-8/12 mx-auto h-full md:flex">
                            <h3 className="text-3xl mb-1 leading-snug">
                                <Link href={`/news/${post.slug}`} className="hover:underline">
                                    {post.title}
                                </Link>
                            </h3>
                            <div className="text-lg mb-6">
                                <DateComponent dateString={post.date}/>
                            </div>
                            <p className="text-lg leading-relaxed">{post.excerpt}</p>
                        </div>
                    </div>
                </div>
            )
        })}
    </section>
}
