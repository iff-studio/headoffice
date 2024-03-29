import { getAllByType } from '../lib/api'
import ErrorPage from 'next/error'
import { useRouter } from 'next/router'
import SideLayout from '../components/SideLayout'
import Loading from '../components/Loading'

export default function Index ({ preview, item }) {

    const router = useRouter()

    if (router.isFallback) {
        return <Loading/>
    }

    if (!item) {
        return <ErrorPage statusCode={404}/>
    }

    return <SideLayout preview={preview}
                       images={[item.image]}
                       galleryLayout={'1'}
                       title={item.title}
                       content={item.content}/>

}

export async function getStaticProps ({ params, preview = false }) {

    let all = await getAllByType('page', preview)

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
    const all = await getAllByType('page')
    return {
        paths: all?.map(({ slug }) => `/${slug}`) ?? [],
        fallback: true,
    }
}
