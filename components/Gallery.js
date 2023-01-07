import galleryStyles from './gallery.module.css'

function isInt (int) {
    return /^[0-9]+$/.test(int)
}

function Vimeo ({ vimeoId, width, height }) {
    if (!isInt(width)) {
        width = 16
        height = 9
    }
    return <div className={'relative'} style={{ paddingTop: (height / width * 100) + '%' }}>
        <iframe
            className={'w-full h-full top-0 left-0 absolute'}
            src={`//player.vimeo.com/video/${vimeoId}?api=1&amp;title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff`}
            frameBorder="0" webkitallowfullscreen="" mozallowfullscreen=""
            allowFullScreen="">
        </iframe>
    </div>
}

export default function Gallery ({ images = [], galleryLayout = '' }) {

    images = images.slice()
    galleryLayout = '' + galleryLayout

    let lines = galleryLayout.trim().split(/\r?\n/)

    let possibleLineValues = ['1', '2', '3', '4', '5']

    let gallery = lines.map(function (line) {

        if (possibleLineValues.includes(line) && images.length) {
            return { type: 'image', 'image': images.shift(), layout: parseInt(line) }
        }

        if (line.includes('vimeo')) {
            let [link, sizes] = line.split('|')
            let [width, height] = (sizes||'').split('x')
            let vimeoId = link.split('?')[0].split('/').filter(function (path) {
                return isInt(path)
            }).at(-1)

            if (vimeoId) {
                return {
                    type: 'vimeo',
                    vimeoId,
                    size: { width, height },
                    layout: 1,
                }
            }

        }

        return null
    }).filter(x => !!x)

    images.forEach(function (image) {
        gallery.push({ type: 'image', 'image': image, layout: 1 })
    })

    /**
     * w-1/2
     * w-12/12
     * w-1/3
     * w-1/4
     * w-1/5
     * */
    return <div className={'clearfix'}>
        {gallery.length && gallery.map(function (item, key) {
                let content = null
                if (item.type === 'image') {
                    content = <img
                        width={item.image.width}
                        height={item.image.height}
                        className="w-full"
                        alt=""
                        src={item.image.url}/>

                }
                if (item.type === 'vimeo') {
                    content = <Vimeo vimeoId={item.vimeoId} {...item.size}/>
                }
                let className = 'w-full'
                if (item.layout !== 1) {
                    className = `w-1/${item.layout}`
                }
                return <div data={JSON.stringify(item)} key={key} className={'float-left ' + className}>{content}</div>
            }
        )}
    </div>

}
