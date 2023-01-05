import Layout from '../components/layout'
import { getAllByType } from '../lib/api'
import Head from 'next/head'
import { META_TITLE_SUFFIX } from '../lib/constants'
import Link from 'next/link'
import ContentfulImage from '../components/ContentfulImage'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { each, map, mapObjectToArray } from '../lib/helpers'
import ModelSizes from '../components/ModelSizes'
import Loading from '../components/Loading'

function generateEqualFunction (name, value) {
    return function (model) {
        return typeof model[name] !== 'undefined' && model[name] === value
    }
}

const SINGLE = 'single'
const MULTIPLE = 'multiple'
const FILTER_BEHAVIOUR = { gender: SINGLE }
const FILTER_OPTIONS = {
    gender: [

        {
            value: 1,
            label: 'He',
            filter: generateEqualFunction('gender', 'He'),
        },
        {
            value: 2,
            label: 'She',
            filter: generateEqualFunction('gender', 'She'),
        },
        {
            value: 3,
            label: 'They',
            filter: generateEqualFunction('gender', 'They'),
        }
    ]
}

/**
 * Kind of like URlSearchParams but removes empties
 */
function renderUrl (query) {

    let parts = []
    Object.keys(query).forEach(function (varName) {
        if (query[varName] === null) {
            return
        }
        if (Array.isArray(query[varName])) {
            if (query[varName].length) {
                return
            }
            query[varName].forEach(function (val) {
                parts.push(`${varName}[]=${val}`)
            })
            return
        }
        parts.push(`${varName}=${query[varName]}`)
    })

    return `?${parts.join('&')}`
}

function castQuery (query) {
    const filteredQuery = {}

    Object.keys(query).forEach(function (key) {
        const val = query[key]

        if (FILTER_BEHAVIOUR[key] === SINGLE) {
            const parsed = parseInt(val)
            if (parsed) {
                filteredQuery[key] = parsed
            }
        }
        if (FILTER_BEHAVIOUR[key] === MULTIPLE && Array.isArray(val)) {
            const parsed = val.map(x => parseInt(x)).filter(x => Number.isInteger(x))
            if (parsed.length) {
                filteredQuery[key] = parsed
            }
        }
    })
    return filteredQuery
}

export default function Index ({ preview, models }) {

    const title = `News ${META_TITLE_SUFFIX}`
    const router = useRouter()
    const currentFilters = Object.assign({ gender: null }, castQuery(router.query))

    if (router.isFallback) {
        return <Loading/>
    }

    models = models.slice()

    function getLinkAndState (filterName, value) {
        let type = FILTER_BEHAVIOUR[filterName]
        let active = false
        let newQuery = Object.assign({}, currentFilters)

        if (type === SINGLE) {
            active = currentFilters[filterName] === value
            newQuery[filterName] = active ? null : value
        }
        if (type === MULTIPLE) {
            active = currentFilters[filterName].includes(value)
            if (active) {
                newQuery[filterName] = currentFilters[filterName].filter(x => x !== value)
            } else {
                newQuery[filterName].push(value)
            }
        }
        return [renderUrl(newQuery), active]
    }

    /**
     * Add links and active states
     */
    let filters = map(FILTER_OPTIONS, (options, filterName) => {
        return options.map(function (option) {
            let [link, active] = getLinkAndState(filterName, option.value)
            return {
                ...option,
                ...{ link, active }
            }
        })
    })
    /**
     * filter models
     */
    each(filters, function (options, filterName) {
        if (FILTER_BEHAVIOUR[filterName] === SINGLE) {
            for (let option of options) {
                if (option.active) {
                    models = models.filter(option.filter)
                    return
                }
            }
        } else {
            let func = []
            options.forEach(function (option) {
                if (option.active) {
                    func.push(option.filter)
                }
            })

            models.filter(function (model) {
                for (let filter of func) {
                    if (filter(model)) {
                        return true
                    }
                }
                return false
            })
        }

    })

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <Layout preview={preview}>
                <div className={'sm:flex'}>
                    <div className={'sm:w-[16rem]'}>
                        {mapObjectToArray(filters, (options, filterName) => {
                            return <div key={filterName} className="p-4">

                                {options.map(function (option) {

                                    return <div className={option.active ? 'font-bold' : ''}
                                                key={filterName + option.value}>
                                        <Link href={option.link}>
                                            - {option.label + (option.active ? ' ×' : '')}
                                        </Link><br/>
                                    </div>
                                })}
                            </div>
                        })}

                    </div>
                    <div className={'sm:flex-1'}>
                        <div className="grid"
                             style={{ gridTemplateColumns: `repeat(auto-fit, minmax(300px, 1fr))` }}>
                            {models.map(function (model, key) {
                                if (!model.mainImage) {
                                    console.log(model)
                                }
                                let { url, width, height } = model.mainImage
                                return <Link href={`/models/${model.slug}`} key={key} className={'relative group'}>
                                    <ContentfulImage {...{ src: url, width, height, alt: '' }}/>
                                    <h4 className="absolute p-4 bottom-0 right-0 left-0 bg-white/[.5] group-hover:bg-white/[.75]">
                                        <ModelSizes model={model} className="pb-4 hidden group-hover:block"/>
                                        {model.name}
                                    </h4>
                                </Link>

                            })}
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export async function getStaticProps ({ preview = false }) {
    const models = await getAllByType('model', preview)
    return {
        props: { models, preview: preview },
    }
}
