import { RichText, AppBskyRichtextFacet } from '@atproto/api'
import { marked } from 'marked'

export function useRichText () {
  const render = (text: string, facets: AppBskyRichtextFacet.Main[] | undefined) => {
    const rt = new RichText({
      text,
      facets
    })

    let markdown = ''
    for (const segment of rt.segments()) {
      if (segment.isLink()) {
        markdown += `<a href="${segment.link?.uri}" target="_blank">${segment.text}</a>`
      } else if (segment.isMention()) {
        markdown += `[${segment.text}](/profile/${segment.mention?.did})`
      } else if (segment.isTag()) {
        markdown += `[${segment.text}](https://my-bsky-app.com/user/${segment.mention?.did})`
      } else {
        markdown += segment.text
      }
    }
    return marked(markdown)
  }

  return {
    render
  }
}
