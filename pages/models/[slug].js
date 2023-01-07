import { getAllByType } from '../../lib/api'
import ErrorPage from 'next/error'
import { useRouter } from 'next/router'
import SideLayout from '../../components/SideLayout'
import ModelSizes from '../../components/ModelSizes'
import Loading from '../../components/Loading'
import NewsSection from '../../components/NewsSection'

export default function Model ({ preview, item, news }) {

    const router = useRouter()

    if (router.isFallback) {
        return <Loading/>
    }

    if (!item) {
        return <ErrorPage statusCode={404}/>
    }

    let newsComponent = null

    if (news.length) {
        newsComponent = <div className='pt-4'><NewsSection news={news} title="Included In:"/></div>
    }

    return <SideLayout preview={preview}
                       images={item.imagesCollection.items}
                       galleryLayout={item.galleryLayout}
                       title={item.name}
                       content={item.bio}
                       bottom={newsComponent}>
        <ModelSizes className={'border border-black p-4'} model={item}></ModelSizes>
    </SideLayout>

}

export async function getStaticProps ({ params, preview = false }) {

    const all = await getAllByType('model', preview)
    const posts = await getAllByType('post', preview)

    const item = all.filter(function (i) {
        return i.slug === params.slug
    })[0] ?? null

    if (item === null) {
        return {
            props: {
                slug: params.slug,
                preview,
                item
            }
        }
    }

    const news = posts.filter(function (post) {
        if (!post.modelsCollection) {
            return false
        }

        return post.modelsCollection.items.map(function (model) {
            return model.slug
        }).includes(params.slug)
    })

    return {
        props: {
            slug: params.slug,
            preview,
            item,
            news
        },
    }
}

export async function getStaticPaths () {
    const all = await getAllByType('model')

    return {
        paths: all?.map(({ slug }) => `/models/${slug}`) ?? [],
        fallback: true,
    }
}
