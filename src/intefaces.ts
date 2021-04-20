import { Store } from 'redux'
import { NextPageContext } from 'next'
import { Request, Response } from 'express'
import { LayoutType } from './components/Layout'

// RebateOnline application config -----------------

export interface Config {
  env: string
  authKey: string
  envSecure: boolean
  port?: string
  api: {
    backEnd: string
    frontEnd: string
  }
  [key: string]: any
}

export interface PublicRuntime { // This interface ref from {@root}/next.config.js
  env: string,
  appVersion: string,
  adfs: {
    signoutUrl: string,
    signoutTarget: string
  }
}

// RebateOnline application inteface -----------------

export interface AppPageProps {
  [name: string]: any
  layout: LayoutType
}

export interface WebAppContext extends NextPageContext { // override req & res from module `http` to `express`
  req?: Request
  res?: Response
  store: Store
  isServer: boolean
}

// Request api ---------------------

export interface RequestApiResponse<T = any> {
  data: T
  isSuccess: boolean
  statusCode: number
  error: RequestApiError
}

export interface RequestApiError {
  code?: string
  message?: string
}