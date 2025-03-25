export default function access(path: string, object: any) {
  return path.split('.').reduce((o, i) => o[i], object)
}
