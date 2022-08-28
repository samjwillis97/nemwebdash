export const defaultEndDate = new Date()
export const defaultStartDate = new Date()
defaultStartDate.setDate(defaultEndDate.getDate() - 7)
export const defaultWindowNumber = 20
export const defaultWindowSelection = {
    label: 'min',
    value: 'm',
}
export const defaultAggregateFn = "mean"

export const baseURL = 'https://api.aemodash.com'

