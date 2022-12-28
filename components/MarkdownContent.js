import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS } from '@contentful/rich-text-types'
import markdownStyles from './markdown-content.module.css'


const customMarkdownOptions = (content) => ({
    renderNode: {
        // [BLOCKS.EMBEDDED_ASSET]: (node) => (
        //     <RichTextAsset
        //         id={node.data.target.sys.id}
        //         assets={content.links.assets.block}
        //     />
        // ),
        [BLOCKS.PARAGRAPH]: (node, children) => <p>{children}</p>,
    },
})

export default function MarkdownContent ({ content }) {
    return (
        <div className="max-w-2xl mx-auto">
            <div className={markdownStyles['markdown']}>
                {documentToReactComponents(
                    content.json,
                    customMarkdownOptions(content)
                )}
            </div>
        </div>
    )
}
