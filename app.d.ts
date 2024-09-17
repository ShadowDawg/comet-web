import { NextPage } from 'next'
import { ComponentType, ReactElement, ReactNode } from 'react'

declare module 'next' {
  export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode
    layout?: ComponentType
  }
}