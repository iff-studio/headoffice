let CACHE = {}
let CACHE_AWAITS = {}
const CONTENT = `
content {
  json
  links {
    assets {
      block {
        sys {
          id
        }
        url
        description
      }
    }
  }
}`

const IMAGE = `
    url
    height
    width
`
const SCHEMAS = {
    'post': `
slug
title
coverImage {
${IMAGE}
}
date
excerpt
modelsCollection {
    items {
        slug
    }
}
imagesCollection {
    items { ${IMAGE} }
}
galleryLayout
${CONTENT}
`,
    'model': `
name
gender
bio {
  json
}
slug
mainImage {
${IMAGE}
}
imagesCollection {
    items { ${IMAGE} }
}
galleryLayout
heightFeet
heightInches
shoe
waist
chest
hips
city { name }
    `,
    'page': `
title 
slug
image {
    ${IMAGE}
}
${CONTENT}
`
}

const QUERIES = {
    'post': `limit: 40, order: [date_DESC]`,
    'model': `limit: 100, order: [name_ASC]`,
    'page': `limit: 100, order: [sys_firstPublishedAt_DESC]`
}

async function getCache (key, fun) {
    if (typeof CACHE[key] !== 'undefined') {
        return CACHE[key].slice()
    }

    if (CACHE_AWAITS[key]) {
        return new Promise(function (res) {
            if (!CACHE_AWAITS[key]) {
                CACHE_AWAITS[key] = []
            }
            CACHE_AWAITS[key].push(res)
        })
    }

    let val = await fun()
    CACHE[key] = val

    if (CACHE_AWAITS[key]) {
        CACHE_AWAITS[key].forEach(function (fn) {
            fn(val)
        })
    }

    return CACHE[key]
}

function getQuery (key, preview) {
    return `query { ${key}Collection (${QUERIES[key]}${preview ? ', preview: true' : ''}){ items { ${SCHEMAS[key]} } } }`
}

export async function getAllByType (key, preview = false) {

    if (process.env.DISABLE_CACHE === 'true') {
        let res = await fetchGraphQL(getQuery(key, preview), true)
        return res[key + 'Collection']?.items || []
    }

    return getCache(`${key}${preview ? '-prev' : ''}`, async function () {
        let res = await fetchGraphQL(getQuery(key, preview), true)
        return res[key + 'Collection']?.items  || []
    })

}

async function fetchGraphQL (query, preview = false) {

    let res = await fetch(
        `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${
                    preview
                        ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
                        : process.env.CONTENTFUL_ACCESS_TOKEN
                }`,
            },
            body: JSON.stringify({ query }),
        }
    ).then((response) => response.json())

    if (!res.data) {
        throw new Error(`query failed: ${query}`)
    }

    return res.data

}
