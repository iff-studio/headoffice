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
import ModelsSection from '../../components/ModelsSection'

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
        modelsComponent = <ModelsSection models={models} title={'Featured models:'}></ModelsSection>
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
