import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  ReactNode,
} from 'react'

import type {
  ImageFit,
  ImageRadius,
} from '../Image'

import { classNames } from '../../../../Utils'

import './Video.scss'

export type VideoFit = ImageFit

export type VideoRadius = ImageRadius

export interface VideoSource {
  src: string
  type?: string
  media?: string
}

export interface VideoTrack {
  src: string
  kind:
    | 'subtitles'
    | 'captions'
    | 'descriptions'
    | 'chapters'
    | 'metadata'
  srcLang?: string
  label?: string
  default?: boolean
}

export interface VideoProps
  extends Omit<
    ComponentPropsWithoutRef<'video'>,
    'children'
  > {
  sources?: readonly VideoSource[]
  tracks?: readonly VideoTrack[]
  fit?: VideoFit
  radius?: VideoRadius
  aspectRatio?: CSSProperties['aspectRatio']
  fallback?: ReactNode
  wrapperClassName?: string
  wrapperStyle?: CSSProperties
}

export function Video({
  src,
  sources = [],
  tracks = [],
  fit = 'contain',
  radius = 'md',
  aspectRatio = '16 / 9',
  fallback = 'Your browser does not support video playback.',
  controls = true,
  autoPlay = false,
  muted = false,
  loop = false,
  playsInline = true,
  preload = 'metadata',
  wrapperClassName,
  wrapperStyle,
  className,
  ...props
}: VideoProps) {
  return (
    <div
      className={classNames(
        'ui-video',
        `ui-video--${radius}`,
        aspectRatio != null && 'ui-video--ratio',
        wrapperClassName,
      )}
      style={{
        aspectRatio,
        ...wrapperStyle,
      }}
    >
      <video
        {...props}
        src={src}
        controls={controls}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        preload={preload}
        className={classNames(
          'ui-video__element',
          `ui-video__element--${fit}`,
          className,
        )}
      >
        {!src &&
          sources.map(source => (
            <source
              key={source.src + (source.media ?? '')}
              src={source.src}
              type={source.type}
              media={source.media}
            />
          ))}

        {tracks.map(track => (
          <track
            key={
              track.src +
              track.kind +
              (track.srcLang ?? '')
            }
            src={track.src}
            kind={track.kind}
            srcLang={track.srcLang}
            label={track.label}
            default={track.default}
          />
        ))}

        {fallback}
      </video>
    </div>
  )
}
