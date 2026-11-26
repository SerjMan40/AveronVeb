const defaultPhone = '+380 98 125 62 84'
const configuredPhone = import.meta.env.VITE_PUBLIC_CONTACT_PHONE?.trim() ?? ''
const configuredNumber = configuredPhone.replace(/[^+\d]/g, '')

export const contactPhone = /^\+?\d{7,15}$/.test(configuredNumber) ? configuredPhone : defaultPhone
export const contactPhoneHref = `tel:${contactPhone.replace(/[^+\d]/g, '')}`
