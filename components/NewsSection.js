import CoverImage from './CoverImage'
import Link from 'next/link'
import DateComponent from './DateComponent'

export default function NewsSection ({ news = [], title = 'News' }) {

    if (!news.length) {
        return null
    }

    let titleComponent = title ?
        <h2 className="mb-8 md:mb-4 md:mt-8 mx-4 text-6xl md:text-7xl font-bold tracking-tighter leading-tight">{title}</h2> :
        null

    return <section>
        {titleComponent}
        <div>
            <div className="mb-4 md:mb-8">
                <CoverImage title={news[0].title} slug={news[0].slug} url={news[0].coverImage.url}/>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-x-8 sm:mb-8 md:mb-12 px-4 pb-4 sm:pb-0">
                <div>
                    <h3 className="mb-4 text-4xl lg:text-6xl leading-tight">
                        <Link href={`/news/${news[0].slug}`} className="hover:underline">
                            {news[0].title}
                        </Link>
                    </h3>
                    <div className="mb-4 md:mb-0 text-lg">
                        <DateComponent dateString={news[0].date}/>
                    </div>

                </div>
                <p className="text-lg leading-relaxed">{news[0].excerpt}</p>
            </div>
        </div>
        <div
            className="grid grid-cols-1 md:grid-cols-2 md:col-gap-16 lg:col-gap-32 row-gap-20 md:row-gap-32 sm:p-2">
            {news.map((post, key) => {
                if (key === 0) {
                    return null
                }
                return <div key={post.slug} className="sm:p-2 pb-4">
                    <div className="mb-5">
                        <CoverImage title={post.title} slug={post.slug} url={post.coverImage.url} alt=""/>
                    </div>
                    <div className="px-4 sm:px-0">
                        <h3 className="text-3xl mb-3 leading-snug">
                            <Link href={`/news/${post.slug}`} className="hover:underline">
                                {post.title}
                            </Link>
                        </h3>
                        <div className="text-lg mb-4">
                            <DateComponent dateString={post.date}/>
                        </div>
                        <p className="text-lg leading-relaxed mb-4">{post.excerpt}</p>
                    </div>
                </div>
            })}
        </div>
    </section>
}
