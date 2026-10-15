import { forwardRef } from 'react'
import { Link as RLink, NavLink as RNavLink, Navigate as RNavigate, type LinkProps, type NavLinkProps, type NavigateProps, type To } from 'react-router-dom'
import { activeTrip } from '../data/active'

/**
 * As páginas de uma viagem usam caminhos "absolutos" como "/roteiro".
 * Estes wrappers os colocam dentro da viagem ativa: "/v/<slug>/roteiro".
 */
export function tripPath(to: string): string {
  if (!activeTrip || !to.startsWith('/') || to.startsWith('/v/')) return to
  return `/v/${activeTrip.slug}${to === '/' ? '' : to}`
}

/** Mesmo que tripPath, para href de âncoras (HashRouter): "#/v/<slug>/…". */
export const tripHref = (to: string) => `#${tripPath(to)}`

const fix = (to: To): To => (typeof to === 'string' ? tripPath(to) : to.pathname ? { ...to, pathname: tripPath(to.pathname) } : to)

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({ to, ...rest }, ref) {
  return <RLink ref={ref} to={fix(to)} {...rest} />
})

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLink({ to, ...rest }, ref) {
  return <RNavLink ref={ref} to={fix(to)} {...rest} />
})

export function Navigate({ to, ...rest }: NavigateProps) {
  return <RNavigate to={fix(to)} {...rest} />
}
