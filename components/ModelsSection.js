import SideTitle from './SideTitle'
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
    return <div className="border border-transparent position relative clearfix -mt-0.5">
        <SideTitle>{title}</SideTitle>
        {intro}
        {models.map(function (model, key) {
            let { url = PLACEHOLDER, width, height } = model.mainImage
            return <Link href={`/models/${model.slug}`} key={key}
                         className={itemClasses + ' pb-[3.5rem] border border-black border-fix'}>

                <ContentfulImage {...{ src: url, width, height, alt: '' }}/>
                <div
                    className="absolute p-4 bottom-0 right-0 left-0 bg-black transition-background text-white">
                    <ModelSizes model={model} className="pb-4 hidden group-hover:block"/>
                    <h4 className={'uppercase font-bold'}>
                        {model.name}
                    </h4>
                </div>
            </Link>
        })}
    </div>
}
