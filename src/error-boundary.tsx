'use client'
import { ErrorInfo } from "react";
import { ErrorBoundary, ErrorBoundaryProps } from "react-error-boundary";
import { useKengineRum } from "./context.tsx";

/**
 * KengineErrorBoundary is a wrapper for ErrorBoundary that will send errors to Kengine.
 * 
 */
export function KengineErrorBoundary(props: ErrorBoundaryProps) {
    const { captureException } = useKengineRum();
    function handlerError(error: Error, info: ErrorInfo) {
        try {
            captureException(error, info);
        } catch (e) {
        }
        props.onError?.(error, info)
    }
    return (
        <ErrorBoundary {...props} onError={handlerError}>
            {props.children}
        </ErrorBoundary>
    )
}