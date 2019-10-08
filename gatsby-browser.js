import wrapWithProvider from './src/redux/store'
export const wrapRootElement = wrapWithProvider

export const onClientEntry = async () => {
  if (typeof IntersectionObserver === `undefined`) {
    await import(`intersection-observer`);
  }
}
