export function map (ob, fun) {
    let newOb = {}
    Object.keys(ob).forEach(key => {
        newOb[key] = fun(ob[key], key)
    })
    return newOb
}

export function each (ob, fun) {
    map(ob, fun)
}

export function mapObjectToArray (ob, fun) {
    return Object.keys(ob).map(key => {
        return fun(ob[key], key)
    })
}
