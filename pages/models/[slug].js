import { getAllByType } from '../../lib/api'
import ErrorPage from 'next/error'
import { useRouter } from 'next/router'
import SideLayout from '../../components/SideLayout'
import ModelSizes from '../../components/ModelSizes'
import Loading from '../../components/Loading'
import NewsSection from '../../components/NewsSection'
import SectionTitle from '../../components/SectionTitle'

export default function Model ({ preview, item, news }) {

    const router = useRouter()

    if (router.isFallback) {
        return <Loading/>
    }

    if (!item) {
        return <ErrorPage statusCode={404}/>
    }

    return <SideLayout preview={preview}
                       images={item.imagesCollection.items}
                       galleryLayout={item.galleryLayout}
                       title={item.name}
                       content={item.bio}
                       bottom={news.length > 0 && <div><SectionTitle>Featured In: </SectionTitle><NewsSection news={news}/></div>}>
        <ModelSizes className={'pb-4'} model={item}></ModelSizes>
    </SideLayout>

}

export async function getStaticProps ({ params, preview = false }) {

    const all = await getAllByType('model', preview)
    const posts = await getAllByType('post')

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
            return model?.slug ?? false
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
