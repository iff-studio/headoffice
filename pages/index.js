import Layout from '../components/Layout'
import { getAllByType } from '../lib/api'
import Head from 'next/head'
import { META_TITLE_SUFFIX } from '../lib/constants'
import Link from 'next/link'
import ContentfulImage from '../components/ContentfulImage'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { each, map, mapObjectToArray } from '../lib/helpers'
import Loading from '../components/Loading'
import ModelsSection from '../components/ModelsSection'
import Fuse from 'fuse.js'
import debounce from '../lib/debounce'

function generateEqualFunction (name, value) {
    return function (model) {
        if (Array.isArray(value)) {
            return typeof model[name] !== 'undefined' && value.includes(model[name])
        }
        return typeof model[name] !== 'undefined' && model[name] === value
    }
}

function generateSearchFunction (models, query) {

    if (query === null || query.trim() === '') {

        return function () {
            return true
        }
    }

    let fuse = new Fuse(models, { keys: ['name'] })
    let results = fuse.search(query).map(function ({ item }) {
        return item.slug
    })

    return function (model) {
        return results.includes(model.slug)
    }
}

const SINGLE = 'single'
const MULTIPLE = 'multiple'
const SEARCH = 'search'
const FILTER_BEHAVIOUR = { search: SEARCH, gender: SINGLE }

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
        if (FILTER_BEHAVIOUR[key] === SEARCH) {
            filteredQuery[key] = val
        }
    })
    return filteredQuery
}

export default function Index ({ preview, models }) {

    const title = `News ${META_TITLE_SUFFIX}`
    const router = useRouter()
    const currentFilters = Object.assign({ gender: null, search: '' }, castQuery(router.query))

    const FILTER_OPTIONS = {
        search: [
            {
                value: null,
                type: 'search',
                label: 'Search',
                filter: generateSearchFunction(models, currentFilters.search)
            }
        ],
        gender: [
            {
                value: null,
                label: 'All',
                filter: generateEqualFunction('gender', ['He', 'She', 'They']),
            },
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

        if (type === SEARCH) {
            active = currentFilters[SEARCH] === value
            newQuery[filterName] = value
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
        }

        if (FILTER_BEHAVIOUR[filterName] === MULTIPLE) {
            let func = []

            options.forEach(function (option) {
                if (option.active) {
                    func.push(option.filter)
                }
            })

            models = models.filter(function (model) {
                for (let filter of func) {
                    return filter(model)
                }
                return false
            })
        }

        if (FILTER_BEHAVIOUR[filterName] === SEARCH) {
            models = models.filter(options[0].filter)
        }

    })

    let debouncedSearchChange = debounce(function (e) {
        router.push(getLinkAndState('search', e.target.value)[0])
    }, 100)

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <Layout preview={preview}>
                <div>
                    <ModelsSection intro={
                        <div className={'clearfix bg-white'}>
                            {mapObjectToArray(filters, (options, filterName) => {
                                return options.map(function (option) {
                                    let itemClasses = 'border border-black block border-fix'
                                    if (option.type === 'search') {
                                        return <div className={itemClasses + ' relative'} key={filterName + 'search'}>
                                            <input key={currentFilters.search === '' ? 'empty' : 'search'}
                                                   autoFocus={true}
                                                   className={'p-4 outline-none w-full'}
                                                   placeholder={'Type name'}
                                                   defaultValue={currentFilters.search}
                                                   onChange={debouncedSearchChange}/>
                                            {currentFilters.search !== '' ?
                                                <button
                                                    className={'w-8 absolute top-0 right-0 bottom-0 border-l-2 border-black'}
                                                    onClick={() => {
                                                        router.push(getLinkAndState('search', '')[0])
                                                    }}>X</button> :
                                                null
                                            }
                                        </div>
                                    }
                                    return <div
                                        className={itemClasses + (option.active ? ' bg-black text-white' : '')}
                                        key={filterName + option.value}>
                                        <Link className={'p-4 block'} href={option.link}>
                                            {option.label}
                                        </Link>
                                    </div>
                                })
                            })}
                        </div>
                    } models={models}></ModelsSection>

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
