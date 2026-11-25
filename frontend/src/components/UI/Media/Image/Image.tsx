import { useState } from 'react'

import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  ReactNode,
} from 'react'

import { classNames } from '../../../../Utils'

import './Image.scss'

export type ImageFit =
  | 'cover'
  | 'contain'
  | 'fill'
  | 'none'
  | 'scale-down'

export type ImageRadius =
  | 'none'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'full'

export interface ImageProps
  extends Omit<
    ComponentPropsWithoutRef<'img'>,
    'children' | 'src' | 'alt'
  > {
  src: string
  alt: string
  fit?: ImageFit
  radius?: ImageRadius
  aspectRatio?: CSSProperties['aspectRatio']
  fallbackSrc?: string
  fallback?: ReactNode
  fallbackLabel?: string
  wrapperClassName?: string
  wrapperStyle?: CSSProperties
}

export function Image({
  src,
  alt,
  fit = 'cover',
  radius = 'none',
  aspectRatio,
  fallbackSrc,
  fallback,
  fallbackLabel = 'Image unavailable',
  loading = 'lazy',
  decoding = 'async',
  srcSet,
  sizes,
  wrapperClassName,
  wrapperStyle,
  className,
  onError,
  ...props
}: ImageProps) {
  const [failedSources, setFailedSources] =
    useState<readonly string[]>([])

  const primaryFailed =
    !src || failedSources.includes(src)

  const activeSrc = primaryFailed
    ? fallbackSrc
    : src

  const unavailable =
    !activeSrc ||
    failedSources.includes(activeSrc)

  return (
    <span
      className={classNames(
        'ui-image',
        `ui-image--${radius}`,
        aspectRatio != null && 'ui-image--ratio',
        wrapperClassName,
      )}
      style={{
        aspectRatio,
        ...wrapperStyle,
      }}
    >
      {unavailable ? (
        <span
          className="ui-image__fallback"
          role={alt ? 'img' : undefined}
          aria-label={
            alt ? fallbackLabel + ': ' + alt : undefined
          }
          aria-hidden={!alt || undefined}
        >
          {fallback ?? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="2"
              />

              <circle cx="8.5" cy="8.5" r="1.5" />

              <path d="m3 17 5-5 4 4 4-5 5 6" />
            </svg>
          )}
        </span>
      ) : (
        <img
          {...props}
          key={activeSrc}
          src={activeSrc}
          srcSet={primaryFailed ? undefined : srcSet}
          sizes={primaryFailed ? undefined : sizes}
          alt={alt}
          loading={loading}
          decoding={decoding}
          className={classNames(
            'ui-image__element',
            `ui-image__element--${fit}`,
            className,
          )}
          onError={(event) => {
            setFailedSources(previous =>
              previous.includes(activeSrc)
                ? previous
                : [...previous, activeSrc],
            )

            onError?.(event)
          }}
        />
      )}
    </span>
  )
}
