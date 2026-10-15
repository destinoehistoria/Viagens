import { tripPath } from '../components/TripLink'

/** Link absoluto para uma rota do app (HashRouter), pronto para compartilhar. */
export function shareUrl(route: string): string {
  return `${window.location.href.split('#')[0].split('?')[0]}#${tripPath(route)}`
}
