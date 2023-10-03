export const getPercentage = (num1, num2) => {
  const newNum1 = parseInt(num1)
  const newNum2 = parseInt(num2)
  if (newNum1 > 0 && newNum2 === 0) {
    return `${newNum1}`
  }
  const percent = (newNum1 / num2) * 100
  return Number.isNaN(percent) ? 0 : `${percent.toFixed(2)} %`
}
