import moment from 'moment'
import normalize, { normalizeDiacritics } from 'normalize-text'
import { getDateFormat, replace } from './helpers'
import { is, isDate } from './validators'

/**
 * Obtém a quantidade de anos a partir da data.
 * @example ```
 * ('21-12-2006') => 10
 * ('2000-12-21') => 16
 * ('Abacaxi') => null
 * ```
 * @param {String} date
 * @returns {Number}
 */
export const toYears = (date) => {
  const format = getDateFormat(date)
  const from = format ? moment(date, format) : null
  const diff = from ? moment().diff(from, 'years') : null
  const years = is(diff, 'Number') && !isNaN(diff) ? diff : null
  return years
}

/**
 * Formata para o formato de dias.
 * @example ```
 * (2) => '2 dias'
 * (1) => '1 dia'
 * (0) => '0 dias'
 * ```
 * @param {Number} quantity
 * @returns {String}
 */
export const toDays = (quantity) => {
  const isValid = is(quantity, 'Number') && Number.isFinite(quantity)
  const days = (quantity === 1) ? '1 dia' : `${isValid ? ~~(quantity) : 0} dias`
  return days
}


/**
 * Usa a formatação de datas para retornar um intervalo.
 * @example ```
 * ({ start: '21-12-2006', end: '31-12-2006' }) => '21/12/2006 a 31/12/2006'
 * ```
 * @param {{ start: String, end: String }} dates
 * @param {{ from: String, to: String }} [options]
 * @returns {String}
 */
export const toInterval = (dates, options = {}) => {
  const { start, end } = dates
  const interval = `${toDate(start, options)} a ${toDate(end, options)}`
  return interval
}

/**
 * Faz uma verificação simples e coloca o caractere para vazio caso o valor seja
 * vazio (null, undefined, '').
 * @param {*} value
 * @param {String} char
 * @returns {String}
 */
export const toEmpty = (value, char = '-') => value || char

/**
 * Formata um valor para o formato de telefone.
 * @param {String} value
 * @returns {String}
 */
export const toPhone = (value) => {
  const isValid = is(value, 'String')
  const formatted = !isValid ? null : replace(value, [
    [/\D/g, ''],
    [/(\d{1,2})/, '($1'],
    [/(\(\d{2})(\d{1,4})/, '$1) $2'],
    [/( \d{4})(\d{1,4})/, '$1-$2'],
    [/( \d{4})(?:-)(\d{1})(\d{4})/, '$1$2-$3']
  ])
  return formatted
}

/**
 * Formata o texto removendo seus acentos.
 * @example ```
 * ('Vítor') => 'Vitor'
 * ('Olá, tudo bem com você?') => 'Ola, tudo bem com voce?'
 * ```
 * @param {String} value
 * @returns {String}
 */
export const toClean = (value) => {
  const isValid = is(value, 'String')
  const formatted = !isValid ? null : normalizeDiacritics(value)
  return formatted
}

/**
 * Formata um texto o transformando em _kebab-case_.
 * @param {String} value
 * @returns {String}
 */
export const toSlug = (value) => {
  if (!is(value, 'String')) { // Short-circuit to handle all non-string values
    return null               // and return null.
  }
  const formatted = replace(normalize(value), [
    [/&/g, '-e-'],
    [/\W/g, '-'],
    [/--+/g, '-'],
    [/(^-+)|(-+$)/, '']
  ])
  return formatted
}
