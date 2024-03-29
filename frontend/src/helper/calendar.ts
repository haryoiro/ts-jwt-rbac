import { array, array2d, Maybe } from "./util"

function zeller(year: number, month: number, day: number): number {
  const a = year % 100
  const b = year % 400 === 0 ? 0 : year % 4 === 0 ? 1 : 2
  return (13 * month + 1) / 5 + a + a / 4 + b + b / 4 + day - 2 * b
}

const WEEK_NAME_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const WEEK_NAME_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
type WeekNameShortTuple = typeof WEEK_NAME_SHORT
type WeekNameLongTuple = typeof WEEK_NAME_LONG
type WeekNameShort = WeekNameShortTuple[number]
type WeekNameLong = WeekNameLongTuple[number]

const MONTH_NAME_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTH_NAME_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
type MonthNameShortTuple = typeof MONTH_NAME_SHORT
type MonthNameLongTuple = typeof MONTH_NAME_LONG
type MonthNameShort = MonthNameShortTuple[number]
type MonthNameLong = MonthNameLongTuple[number]

export type DayDetail = { year: number, month: number, day: number }

export class Calendar {

  constructor() { }

  public getMonth = () => {
    const month = new Date().getMonth() + 1
    return month
  }

  /**
   * @param year {number}
   * @param month {number}
   * @returns {number[][]}
   */
  public genCalendar = (year: number, month: number) => {
    const mo =  (month >= 13) ? 1 : month
    const firstDay = new Date(year, mo - 1, 1).getDay()
    const lastDays = new Date(year, mo - 1, 0).getDate()
    const cdays = new Date(year, month, 0).getDate()
    const days = array2d<number>(6, 7, 0)
    let day = 1
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          days[i][j] = lastDays - firstDay + j + 1
        } else if (day <= cdays) {
          days[i][j] = day
          day++
        } else {
          days[i][j] = day - cdays
          day++
        }
      }
    }
    return days
  }

  public genDetailedCalendar: (year: number, month: number) => DayDetail[][] = (year, month) => {
    const firstDay = new Date(year, month - 1, 1).getDay()
    const lastDays = new Date(year, month - 1, 0).getDate()
    const curDays = new Date(year, month, 0).getDate()
    const days = array2d<DayDetail>(6, 7, { year, month, day: 0 })
    let day = 1
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          days[i][j] = {
            year: month == 1 ? year - 1 : year,
            month: month == 1 ? 12 : month - 1 ,
            day: lastDays - firstDay + j + 1
          }
        } else if (day <= curDays) {
          days[i][j] = {
            year,
            month,
            day
          }
          day++
        } else {
          days[i][j] = {
            year: month == 12 ? year + 1 : year,
            month: month == 12 ? 1 : month + 1,
            day:day - curDays
          }
          day++
        }
      }
    }

    return days
  }

  /**
   * 
   * @param year {number}
   * @returns {number[][]}
   * 
   */
  public getYearCalendar = (year: number) => {
    const calendar = array2d<number[]>(12, 6, array<number>(7, 0))
    for (let i = 0; i < 12; i++) {
      calendar[i] = this.genCalendar(year, i + 1)
    }
    return {
      year,
      calendar
    }
  }

  /**
   * @param month {number}
   * @param short {boolean}
   * @returns {string}
   */
  public getMonthName = (month: Maybe<number>, short: boolean = false): MonthNameShort | MonthNameLong => {
    if (month) {
      return short ? MONTH_NAME_SHORT[month - 1] : MONTH_NAME_LONG[month - 1]
    } else {
      return short ? MONTH_NAME_SHORT[this.getMonth() - 1] : MONTH_NAME_LONG[this.getMonth() - 1]
    }
  }

  /**
   * @description 週の名前を取得する。
   * 
   * @param short {boolean} @description ショートハンドを取得するかどうか
   * @returns　(WeekNameShort | WeekNameLong)[]　@description 週の名前の配列
   */
  public getWeekName = (short: boolean = false): (WeekNameShort | WeekNameLong)[] => {
    return short ? WEEK_NAME_SHORT : WEEK_NAME_LONG
  }

  /**
   * @description 現在の日付を取得する
   * 
   * @returns {DayDetail}
   */
  public getToday = (): DayDetail => {
    const today = new Date()
    return {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate()
    }
  }

  /**
   * @description 引数に渡されたデータが今日かどうかを判定する
   *
   * @param target {DayDetail}
   * @returns {boolean}
   */
  public isToday = (target: DayDetail): boolean => {
    const today = this.getToday()
    return (
      target.day == today.day &&
      target.month == today.month &&
      target.year == today.year
    )
  }


  public isWeekend = (target: DayDetail): boolean => {
    const day = new Date(target.year, target.month - 1, target.day).getDay()
    return day === 0 || day === 6
  }
}