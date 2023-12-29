import Layout from '../components/Layout'
import { getAllByType } from '../lib/api'
import Head from 'next/head'
import { META_TITLE_SUFFIX } from '../lib/constants'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { each, map, mapObjectToArray } from '../lib/helpers'
import ModelsSection from '../components/ModelsSection'
import Fuse from 'fuse.js'
import debounce from '../lib/debounce'

function generateEqualFunction (name, value) {
    return function (model) {
        return typeof model[name] !== 'undefined' && model[name] === value
    }
}

function generateCityFunction (value) {
    return function (model) {
        return typeof model.city.name !== 'undefined' && model.city.name === value
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
const SEARCH = 'search'
const FILTER_BEHAVIOUR = { search: SEARCH, gender: SINGLE, city: SINGLE }

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

    return `${location.pathname}?${parts.join('&')}`
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

        if (FILTER_BEHAVIOUR[key] === SEARCH) {
            filteredQuery[key] = val
        }
    })
    return filteredQuery
}

export default function Index ({ preview, models }) {

    models = models.slice(0)

    const title = `Models ${META_TITLE_SUFFIX}`
    const router = useRouter()

    const currentFilters = Object.assign({
        gender: null,
        search: '',
        city: null
    }, castQuery(router.query))

    const setCurrentFilters = function (query) {
        router.push(
            {
                pathname: location.pathname,
                query: query,
            },
            renderUrl(query),
            {shallow:true}
        )
    }
    const cities = [...new Set(models.map(function (m) {
        return m?.city?.name ?? null
    }))].filter((r) => !!r)

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
                filter: null,
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
        ],
        city: [
            {
                value: null,
                label: 'All',
                filter: null,
            },
            ...cities.map(function (city, i) {
                return {
                    value: i + 1,
                    label: city,
                    filter: generateCityFunction(city),
                }
            })
        ]
    }

    /**
     * Add links and active states
     */
    let filters = map(FILTER_OPTIONS, (options, type) => {
        return options.map(function (option) {
            return { ...option, active: currentFilters[type] === option.value }
        })
    })
    /**
     * filter models
     */
    each(filters, function (options, filterName) {

        if (FILTER_BEHAVIOUR[filterName] === SINGLE) {
            for (let option of options) {
                if (option.active && option.filter) {
                    models = models.filter(option.filter)
                    return
                }
            }
        }

        if (FILTER_BEHAVIOUR[filterName] === SEARCH) {
            models = models.filter(options[0].filter)
        }

    })

    let debouncedSearchChange = debounce(function (e) {
        setCurrentFilters({ ...currentFilters, search: e.target.value })
    }, 200)
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

                                if (filterName === 'search') {
                                    return <div className={'relative'} key={filterName + 'search'}>
                                        <input key={currentFilters.search === '' ? 'empty' : 'search'}
                                               autoFocus={true}
                                               className={'2xl:pl-0 px-4 pb-2 pt-2 outline-none w-full'}
                                               placeholder={'Type name'}
                                               defaultValue={currentFilters.search}
                                               onChange={debouncedSearchChange}/>
                                        {currentFilters.search !== '' ?
                                            <button
                                                className={'w-16 absolute top-0 right-0 bottom-0 border-l-2 border-transparent'}
                                                onClick={() => {
                                                    setCurrentFilters({ ...currentFilters, search: '' })
                                                }}>X</button> :
                                            null
                                        }
                                    </div>
                                }

                                return <div className={'2xl:pl-0 px-4 py-2'} key={filterName}>
                                    {options.map(function (option, index) {
                                        return <span
                                            key={filterName + option.value}
                                            className={'pr-1'}>
                                            <button
                                                className={`inline-block pr-1 relative ${option.active ? 'underline' : ''}`}
                                                onClick={() => {
                                                    setCurrentFilters({ ...currentFilters, [filterName]: option.value })
                                                }}>
                                            {option.label}
                                        </button>
                                            {index !== options.length - 1 ? '/' : ''}
                                        </span>
                                    })}
                                </div>

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
