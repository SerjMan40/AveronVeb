import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  ReactNode,
} from 'react'

import { Image } from '../Image'

import type {
  ImageProps,
  ImageFit,
  ImageRadius,
} from '../Image'

import { Grid } from '../../Layout/Grid'
import type { GridGap } from '../../Layout/Grid'

import { classNames } from '../../../../Utils'

import './ImageGallery.scss'

export interface ImageGalleryItem {
  id: string
  src: string
  alt: string
  srcSet?: string
  sizes?: string
  fallbackSrc?: string
  caption?: ReactNode
}

export interface ImageGalleryProps
  extends Omit<
    ComponentPropsWithoutRef<'div'>,
    'children'
  > {
  items: readonly ImageGalleryItem[]
  columns?: number
  minColumnWidth?: CSSProperties['width']
  gap?: GridGap
  aspectRatio?: CSSProperties['aspectRatio']
  fit?: ImageFit
  radius?: ImageRadius
  showCaptions?: boolean
  loading?: ImageProps['loading']
  emptyContent?: ReactNode
  getItemLabel?: (
    item: ImageGalleryItem,
    index: number,
  ) => string
  onImageClick?: (
    item: ImageGalleryItem,
    index: number,
  ) => void
}

export function ImageGallery({
  items,
  columns,
  minColumnWidth,
  gap = 'md',
  aspectRatio = '4 / 3',
  fit = 'cover',
  radius = 'md',
  showCaptions = true,
  loading = 'lazy',
  emptyContent,
  getItemLabel,
  onImageClick,
  className,
  ...props
}: ImageGalleryProps) {
  if (items.length === 0) {
    return (
      <div
        {...props}
        className={classNames(
          'ui-image-gallery',
          'ui-image-gallery--empty',
          className,
        )}
      >
        {emptyContent}
      </div>
    )
  }

  return (
    <Grid
      {...props}
      columns={columns ?? 1}
      minColumnWidth={
        minColumnWidth ??
        (columns === undefined ? '16rem' : undefined)
      }
      gap={gap}
      fullWidth
      className={classNames(
        'ui-image-gallery',
        className,
      )}
    >
      {items.map((item, index) => {
        const image = (
          <Image
            src={item.src}
            alt={item.alt}
            srcSet={item.srcSet}
            sizes={item.sizes}
            fallbackSrc={item.fallbackSrc}
            aspectRatio={aspectRatio}
            fit={fit}
            radius={radius}
            loading={loading}
          />
        )

        return (
          <figure
            key={item.id}
            className="ui-image-gallery__item"
          >
            {onImageClick ? (
              <button
                type="button"
                className="ui-image-gallery__trigger"
                aria-label={
                  getItemLabel?.(item, index) ??
                  (item.alt || 'Image ' + (index + 1))
                }
                onClick={() => onImageClick(item, index)}
              >
                {image}
              </button>
            ) : (
              image
            )}

            {showCaptions && item.caption != null && (
              <figcaption
                className="ui-image-gallery__caption"
              >
                {item.caption}
              </figcaption>
            )}
          </figure>
        )
      })}
    </Grid>
  )
}
