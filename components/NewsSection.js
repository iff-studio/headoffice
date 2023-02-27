import CoverImage from './CoverImage'
import Link from 'next/link'
import DateComponent from './DateComponent'
import SideTitle from './SideTitle'

export default function NewsSection ({ news = [], title = 'News' }) {

    if (!news.length) {
        return null
    }

    return <section className={'relative -mt-0.5 border border-white border-l-black border-t-black clearfix'}>
        <SideTitle>{title}</SideTitle>
        {news.map((post, key) => {
            return <div key={post.slug} className="border border-fix border-black md:w-1/2 float-left">
                <CoverImage title={post.title} slug={post.slug} url={post.coverImage.url} alt=""/>
                <div className="p-4 bg-white">
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
        })}
    </section>
}
