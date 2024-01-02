import CoverImage from './CoverImage'
import Link from 'next/link'
import DateComponent from './DateComponent'
import { PLACEHOLDER } from '../lib/placeholder'

export default function NewsSection ({ news = [], title = 'News', hasLeading = true }) {

    if (!news.length) {
        return null
    }

    return <section className={'relative clearfix'}>

        {news.map((post, key) => {
            return (
                <div key={post.slug}
                     className={` w-full md:flex md:items-stretch ${key % 2 ? 'md:flex-row-reverse' : ''}`}>
                    <div className={`md:w-1/2 ${key % 2 === 0 ? 'md:float-left' : 'md:float-right'}`}>
                        <div className={key % 2 ? 'md:pr-4':'md:pl-4'}>
                            <CoverImage title={post.title} slug={post.slug} url={post.coverImage?.url ?? PLACEHOLDER}
                                        alt=""/>
                        </div>
                    </div>
                    <div className={`md:w-1/2 ${key % 2 === 0 ? 'md:float-left' : 'md:float-right'}`}>
                        <div className="lg:w-8/12 mx-auto h-full md:flex md:flex-col justify-center p-4">
                            <div className="text-sm">
                                <DateComponent dateString={post.date}/>
                            </div>
                            <h3 className="text-3xl leading-tight mb-6 tracking-normal">
                                <Link href={`/news/${post.slug}`} className="hover:underline">
                                    {post.title}
                                </Link>
                            </h3>

                            <p className="text-lg leading-relaxed">{post.excerpt}</p>
                        </div>
                    </div>
                </div>
            )
        })}
    </section>
}
