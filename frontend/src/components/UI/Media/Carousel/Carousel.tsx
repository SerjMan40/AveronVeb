import { Children, isValidElement, useId, useState } from 'react'
import type { ReactNode } from 'react'
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5'
import { Button, ButtonGroup, IconButton } from '../../Buttons'
import { Flex, Stack } from '../../Layout'
import { Text } from '../../Typography'

import './Carousel.scss'

export interface CarouselProps {
  children: ReactNode
  label: string
  previousLabel?: string
  nextLabel?: string
  pagination?: boolean
  transitionDuration?: number
}

export function Carousel({
  children,
  label,
  previousLabel = 'Previous slide',
  nextLabel = 'Next slide',
  pagination = false,
  transitionDuration,
}: CarouselProps) {
  const slides = Children.toArray(children)
  const [index, setIndex] = useState(0)
  const viewportId = useId()

  if (slides.length === 0) return null

  const lastIndex = slides.length - 1
  const activeIndex = Math.min(index, lastIndex)

  function moveBy(offset: number) {
    setIndex(current => Math.max(0, Math.min(lastIndex, Math.min(current, lastIndex) + offset)))
  }

  return (
    <Stack className="ui-carousel" gap="md" role="region" aria-label={label}>
      <div
        id={viewportId}
        className="ui-carousel__viewport"
        onDragStart={event => event.preventDefault()}
      >
        {slides.map((slide, index) => (
          <div
            key={isValidElement(slide) ? slide.key : index}
            className="ui-carousel__slide"
            inert={index !== activeIndex}
            style={{ transitionDuration: transitionDuration == null ? undefined : `${transitionDuration}ms` }}
            role="group"
            aria-label={`${index + 1} / ${slides.length}`}
          >
            {slide}
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <Flex className="ui-carousel__controls" justify="between" align="center" gap="sm">
          <Text className={pagination ? 'ui-carousel__status' : undefined} size="sm" weight="semibold" tabular aria-live="polite">
            {activeIndex + 1} / {slides.length}
          </Text>
          {pagination && (
            <Flex className="ui-carousel__pagination" gap="2xs">
              {slides.map((_, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="ui-carousel__page"
                  aria-label={`${label} · ${index + 1} / ${slides.length}`}
                  aria-controls={viewportId}
                  aria-current={index === activeIndex ? 'true' : undefined}
                  onClick={() => setIndex(index)}
                />
              ))}
            </Flex>
          )}
          <ButtonGroup>
            <IconButton
              variant="outline"
              icon={<IoChevronBackOutline />}
              aria-label={previousLabel}
              aria-controls={viewportId}
              disabled={activeIndex === 0}
              onClick={() => moveBy(-1)}
            />
            <IconButton
              variant="outline"
              icon={<IoChevronForwardOutline />}
              aria-label={nextLabel}
              aria-controls={viewportId}
              disabled={activeIndex === lastIndex}
              onClick={() => moveBy(1)}
            />
          </ButtonGroup>
        </Flex>
      )}
    </Stack>
  )
}
