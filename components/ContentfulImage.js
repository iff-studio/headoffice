import Image from 'next/image'

const contentfulLoader = ({ src, width, quality }) => {

  return `${src}?w=${width}&q=${quality || 85}`
}

const ContentfulImage = (props) => {

  return <Image loader={contentfulLoader} {...props} />
}

export default ContentfulImage
