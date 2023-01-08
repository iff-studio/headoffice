import { getAllByType } from '../../lib/api'
import ErrorPage from 'next/error'
import { useRouter } from 'next/router'
import SideLayout from '../../components/SideLayout'
import Loading from '../../components/Loading'
import ModelSizes from '../../components/ModelSizes'
import NewsSection from '../../components/NewsSection'
import Link from 'next/link'
import ContentfulImage from '../../components/ContentfulImage'
import React from 'react'

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
        modelsComponent = <div className="pt-4">
            <h2 className="mb-8 md:mb-4 md:mt-8 mx-4 text-6xl md:text-7xl font-bold tracking-tighter leading-tight">Models included: </h2>
            <div className="grid"
                 style={{ gridTemplateColumns: `repeat(auto-fit, minmax(300px, 1fr))` }}>
                {models.map(function (model, key) {
                    if (!model.mainImage) {
                        console.log(model)
                    }
                    let { url, width, height } = model.mainImage
                    return <Link href={`/models/${model.slug}`} key={key} className={'relative group pb-[3.5rem]'} >
                        <ContentfulImage {...{ src: url, width, height, alt: '' }}/>
                        <div
                            className="absolute p-4 bottom-0 right-0 left-0 bg-black transition-background text-white">
                            <ModelSizes model={model} className="pb-4 hidden group-hover:block"/>
                            <h4>
                                {model.name}
                            </h4>
                        </div>
                    </Link>

                })}
            </div>
        </div>
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

    const item = all.filter(function (i) {
        return i.slug === params.slug
    })[0] ?? null

    let modelSlugs = item.modelsCollection.items.map(function (model) {
        return model.slug
    })

    let models = await getAllByType('model')

    models = models.filter(function (model) {
        return modelSlugs.includes(model.slug)
    })

    return {
        props: {
            preview,
            item,
            models
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
