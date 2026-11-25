export function throttle<T extends unknown[]>(
  callback: (...args: T) => void,
  delay = 200,
) {
  let lastExecution: number | undefined

  const throttled = (...args: T): void => {
    const now = performance.now()

    if (
      lastExecution !== undefined &&
      now - lastExecution < delay
    ) {
      return
    }

    lastExecution = now
    callback(...args)
  }

  throttled.cancel = (): void => {
    lastExecution = undefined
  }

  return throttled
}