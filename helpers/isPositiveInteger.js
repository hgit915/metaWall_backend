function isPositiveInteger (str) {
  if (typeof str === 'number') {
    if (Number.isInteger(str) && str > 0) { return true }
    return false
  }

  if (typeof str !== 'string') { return false }
  const num = Number(str)

  if (Number.isInteger(num) && num > 0) { return true }
  return false
}

module.exports = isPositiveInteger
