export const checkNumber = val => /^[0-9]*$/.test(val)

export const convertValueOfPercent = (numericComparison: number, percent: number) =>
  numericComparison * (percent / 100)

export const convertPercentOfValue = (numericComparison: number, value) =>
  (value / numericComparison) * 100

export const setDropDownItemsIdName = (data: { id: number, name: string }) => ({
  key: data.id,
  value: data.id,
  text: `${data.id} - ${data.name}`
})

export const setDropDownItemsName = (data: { id: number, name: string }) => ({
  key: data.id,
  value: data.id,
  text: data.name
})

export const maxNumber = (val: number, numMax: number) => {
  let maximum = ''

  for (let i = 0; i < numMax; i++) {
    maximum = maximum + 9
  }

  return parseInt(val.toFixed(0)) <= parseFloat(maximum)
}

export const maxDecimal = (val: number, decimalMax: number) => {
  const [, decimal] = val.toString().split('.')
  return !decimal
    ? true : decimalMax < 0
      ? true : decimal.length <= decimalMax
}