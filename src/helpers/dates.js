import { NativeDateService } from "@ui-kitten/components"
import React, { useState, useEffect } from "react"

const i18n = {
  dayNames: {
    short: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
    long: [
      "Segunda-Feira",
      "Terça-Feira",
      "Quarta-Feira",
      "Quinta-Feira",
      "Sexta-Feira",
      "Sábado",
      "Domingo",
    ],
  },
  monthNames: {
    short: [
      "Jan",
      "Fev",
      "Març",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ],
    long: [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ],
  },
}

export const localeDateService = new NativeDateService("pt", {
  i18n,
  startDayOfWeek: 1,
})

export const useDatepickerState = (initialDate = null) => {
  const [date, setDate] = useState(initialDate)
  return { date, onSelect: setDate }
}

export const getFullYears = (count = 20) => {
  let years = []
  // let count = 20;
  for (let i = 0; i <= count; i++) {
    years[i] = (new Date().getFullYear() - i).toString()
  }
  return years
}

export const getFullYears2 = (count = 20) => {
  let years = []
  // let count = 20;
  for (let i = 0; i <= count; i++) {
    years[i] = { key: i, value: (new Date().getFullYear() - i).toString() }
  }
  return years
}

export const months = {
  0: "Janeiro",
  1: "Fevereiro",
  2: "Março",
  3: "Abril",
  4: "Maio",
  5: "Junho",
  6: "Julho",
  7: "Agosto",
  8: "Setembro",
  9: "Outubro",
  10: "Novembro",
  11: "Dezembro",
}

export function calculateAge(dateOfBirth) {
  const dob = new Date(dateOfBirth)
  const today = new Date()

  const yearsDiff = today.getFullYear() - dob.getFullYear()
  const monthsDiff = today.getMonth() - dob.getMonth()
  const daysDiff = today.getDate() - dob.getDate()

  if (monthsDiff < 0 || (monthsDiff === 0 && daysDiff < 0)) {
    return yearsDiff - 1
  } else {
    return yearsDiff
  }
}
