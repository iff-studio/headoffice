import { getAllByType } from '../../lib/api'
import ErrorPage from 'next/error'
import { useRouter } from 'next/router'
import SideLayout from '../../components/SideLayout'
import ModelSizes from '../../components/ModelSizes'
import Loading from '../../components/Loading'

export default function Model ({ preview, item }) {

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
                       content={item.bio}>
        <ModelSizes className={'border border-black p-4'} model={item}></ModelSizes>
    </SideLayout>

}

export async function getStaticProps ({ params, preview = false }) {

    let all = await getAllByType('model', preview)

    const item = all.filter(function (i) {
        return i.slug === params.slug
    })[0] ?? null

    return {
        props: {
            slug: params.slug,
            preview,
            item
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
