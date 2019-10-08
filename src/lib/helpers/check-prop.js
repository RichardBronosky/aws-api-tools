export const checkProp = (prop, noProp, value) => {
  return prop ? (prop && noProp ? null : prop) : !noProp ? value || prop : null
}
