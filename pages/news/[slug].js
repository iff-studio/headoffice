import { getAllByType } from '../../lib/api'
import ErrorPage from 'next/error'
import { useRouter } from 'next/router'
import SideLayout from '../../components/SideLayout'
import Loading from '../../components/Loading'
import ModelSizes from '../../components/ModelSizes'
import NewsSection from '../../components/NewsSection'

export default function News ({ preview = false, item = null, models = [] }) {

    const router = useRouter()

    if (router.isFallback) {
        return <Loading/>
    }

    if (!item) {
        return <ErrorPage statusCode={404}/>
    }
    let modelsComponent = null
    if (models.length) {
        modelsComponent = <div className="pt-4"><NewsSection news={news} title="Included In:"/></div>
    }

    return <SideLayout preview={preview}
                       images={item.imagesCollection.items}
                       galleryLayout={item.galleryLayout}
                       title={item.title}
                       content={item.content}
                       bottom={modelsComponent}/>

}

export async function getStaticProps ({ params, preview = false }) {

    let all = await getAllByType('post', preview)
    let models = await getAllByType('model')
    const item = all.filter(function (i) {
        return i.slug === params.slug
    })[0] ?? null

    return {
        props: {
            preview,
            item
        },
    }
}

export async function getStaticPaths () {
    const all = await getAllByType('post')
    return {
        paths: all?.map(({ slug }) => {return { params: { slug: slug } }}) ?? [],
        fallback: true,
    }
}
