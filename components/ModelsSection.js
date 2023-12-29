import Link from 'next/link'
import ContentfulImage from './ContentfulImage'
import ModelSizes from './ModelSizes'
import React from 'react'
import { PLACEHOLDER } from '../lib/placeholder'

export default function ModelsSection ({ title, models = [], intro = null }) {
    let itemClasses = 'relative group md:w-1/3 lg:w-1/4 float-left '
    if (intro) {
        intro = <div className={itemClasses}>
            {intro}
        </div>
    }
    return <div className="position relative clearfix px-4">

        {intro}
        {models.length > 0 ?
            models.map(function (model, key) {
                let { url = null } = model.mainImage ?? {}

                if (url === null) {
                    return null
                }

                return <Link href={`/models/${model.slug}`} key={key}
                             className={itemClasses + ' pb-[3.5rem] '}>

                    <ContentfulImage {...{ src: url ?? PLACEHOLDER, width: 1600, height: 2000, alt: '' }}/>
                    <div
                        className="absolute p-4 bottom-0 right-0 left-0 bg-black transition-background text-white">
                        <ModelSizes model={model} className="pb-4 hidden group-hover:block"/>
                        <h4 className={'uppercase font-bold'}>
                            {model.name}
                        </h4>
                    </div>
                </Link>
            }) :
            <div className={'p-4'}>
                No Results. <Link href={'/'} className={'underline'}>Clear Filters</Link>
            </div>
        }
    </div>
}
