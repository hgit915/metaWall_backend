function checkValueCanSort (value) {
  if (!value) return false
  value = value.toString()
  if (value === '1') return true
  if (value === '-1') return true
  if (value === 'asc') return true
  if (value === 'desc') return true
  if (value === 'ascending') return true
  if (value === 'descending') return true
  return false
}

module.exports = checkValueCanSort
