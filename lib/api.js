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

export async function getAllByType (key, preview = false) {

    return getCache(`${key}${preview ? '-prev' : ''}`, async function () {
        let res = await fetchGraphQL(`
query {
    ${key}Collection (limit: 100){
        items {
          ${SCHEMAS[key]}
        }
    }
}
`)
        return res.data[key + 'Collection']['items']
    })
}

async function fetchGraphQL (query, preview = false) {
    return fetch(
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
}
