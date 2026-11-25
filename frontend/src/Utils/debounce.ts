export function debounce<T extends unknown[]>(
  callback: (...args: T) => void,
  delay = 300,
) {
  let timer: ReturnType<typeof setTimeout> | undefined

  const debounced = (...args: T): void => {
    if (timer !== undefined) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      timer = undefined
      callback(...args)
    }, delay)
  }

  debounced.cancel = (): void => {
    if (timer !== undefined) {
      clearTimeout(timer)
      timer = undefined
    }
  }

  return debounced
}