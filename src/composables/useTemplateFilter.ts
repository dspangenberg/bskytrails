import de from 'numbro/languages/de-DE'
import numbro from 'numbro'
import { marked } from 'marked'
import { partial } from 'filesize'

numbro.registerLanguage(de, true)
numbro.setLanguage('de-DE')

export function useTemplateFilter () {
  const toMd = (value: string) => {
    return marked.parse(value)
  }

  const formatAccounId = (value: number) => {
    if (!value) return
    return numbro(value).format({ thousandSeparated: true })
  }

  const formatFileSize = (value: number) => {
    value = value * 1000
    const size = partial({ base: 2, standard: 'jedec', separator: ',', round: 2 })

    return size(value)
  }

  const formatCurrency = (value = 0) => {
    return numbro(value).formatCurrency({ mantissa: 2, thousandSeparated: true, spaceSeparated: true })
  }

  const formatFloat = (value: number | string, unit = '') => {
    return (numbro(value).format({ mantissa: 2, thousandSeparated: true }) + ' ' + unit).trim()
  }

  const formatInt = (value: number | string, unit = '') => {
    if (!value) return 0
    return (numbro(value).format({ thousandSeparated: true }) + ' ' + unit).trim()
  }

  function getImageUrl (name: string) {
    return new URL(`/${name}`, import.meta.env.VITE_APP_ASSETS).href
  }

  const formatBytes = (value: number | string) => {
    if (!value) return
    return numbro(value).format({
      output: 'byte',
      spaceSeparated: true,
      base: 'binary',
      mantissa: 1
    }).replace('KiB', 'KB')
  }

  const nl2br = (str: string, isXHTML = true) => {
    if (typeof str === 'undefined' || str === null) {
      return ''
    }
    const breakTag = (isXHTML || typeof isXHTML === 'undefined') ? '<br />' : '<br>'
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2')
  }

  return { toMd, formatFileSize, formatAccounId, formatCurrency, getImageUrl, formatFloat, formatBytes, formatInt, nl2br }
}
