import ContentfulImage from './ContentfulImage'
import Link from 'next/link'
import cn from 'classnames'
import { PLACEHOLDER } from '../lib/placeholder'

export default function CoverImage({ title, url = PLACEHOLDER, slug }) {
  const image = (
    <ContentfulImage
      width={2000}
      height={1000}
      alt={`Cover Image for ${title}`}
      src={url}
    />
  )

  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link href={`/news/${slug}`} aria-label={title}>
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  )
}
