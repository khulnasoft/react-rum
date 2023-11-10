'use client'
import { useState, useEffect, ReactElement, JSXElementConstructor, FunctionComponent, Component } from 'react'

import { default as Cookies } from 'js-cookie';

import { KengineContext, KengineRumConfig } from './context.tsx';
import { WebVitals } from './web-vitals.ts';
import { DispatchQueue } from './dispatch-queue.ts';
import { KengineErrorBoundary } from './error-boundary.tsx';
import { ErrorBoundaryPropsWithFallback } from 'react-error-boundary';
import { makeUUID } from './utils/uuid.ts';
export { useKengineRum } from './context.tsx';
export { KengineErrorBoundary } from './error-boundary.tsx';

export interface KengineRumProps {
  apiKey: string,
  dataset?: string,
  service?: string,
  namespace?: string,
  url?: string,
  userId?: string,
  sessionId?: string,
  fallback?: ReactElement<unknown, string | FunctionComponent | typeof Component> | null
  fallbackRender?: ErrorBoundaryPropsWithFallback["fallbackRender"]
  pageLoadId?: string,
  enableLocal?: boolean,
  enableWebVitals?: boolean
  children: React.ReactNode
}
export function KengineRum(props: KengineRumProps) {

  const sessionId = Cookies.get('baselime-session-id')

  if (!sessionId) {
    Cookies.set('baselime-session-id', makeUUID())
  }

  const initialData: KengineRumConfig = {
    userId: props.userId,
    sessionId: Cookies.get('baselime-session-id'),
    pageLoadId: makeUUID(),
    namespace: props.namespace,
    apiKey: props.apiKey,
    dataset: props.dataset || "web",
    service: props.service,
    url: props.url || "https://events.kengine.khulnasoft.com/v1",
    enableLocal: props.enableLocal || false,
    enableWebVitals: props.enableWebVitals || false,
  }


  const [config, setConfig] = useState(initialData)

  const [queue, setQueue] = useState(new DispatchQueue({ config }))

  useEffect(() => {
    /** If config changes rebuild the queue */
    setQueue(new DispatchQueue({ config }))
    return () => {
      queue.flush()
    }
  }, [config])

  return (<KengineContext.Provider value={{ config, setConfig, queue }}>
    <KengineErrorBoundary fallback={props.fallback} fallbackRender={props.fallbackRender}>
      <WebVitals>
        {props.children}
      </WebVitals>
    </KengineErrorBoundary>
  </KengineContext.Provider>
  );
}