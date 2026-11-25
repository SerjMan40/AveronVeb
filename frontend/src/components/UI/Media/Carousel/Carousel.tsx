import { Children, isValidElement, useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperInstance } from 'swiper'
import { EffectFade } from 'swiper/modules'
import { Button, ButtonGroup, IconButton } from '../../Buttons'
import { Flex, Stack } from '../../Layout'
import { Text } from '../../Typography'

import 'swiper/css'
import 'swiper/css/effect-fade'
import './Carousel.scss'

export interface CarouselProps {
  children: ReactNode
  label: string
  previousLabel?: string
  nextLabel?: string
  pagination?: boolean
  transitionDuration?: number
  effect?: 'slide' | 'fade'
}

export function Carousel({
  children,
  label,
  previousLabel = 'Previous slide',
  nextLabel = 'Next slide',
  pagination = false,
  transitionDuration,
  effect = 'slide',
}: CarouselProps) {
  const slides = Children.toArray(children)
  const swiper = useRef<SwiperInstance | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const viewportId = useId()

  if (slides.length === 0) return null

  return (
    <Stack className="ui-carousel" gap="md" role="region" aria-label={label}>
      <Swiper
        id={viewportId}
        className="ui-carousel__viewport"
        modules={[EffectFade]}
        effect={effect}
        fadeEffect={{ mode: 'cross-fade' }}
        speed={transitionDuration}
        onSwiper={instance => { swiper.current = instance }}
        onSlideChange={instance => setActiveIndex(instance.activeIndex)}
      >
        {slides.map((slide, index) => (
          <SwiperSlide
            key={isValidElement(slide) ? slide.key : index}
            role="group"
            aria-label={`${index + 1} / ${slides.length}`}
          >
            <div inert={index !== activeIndex}>
              {slide}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

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
                  onClick={() => swiper.current?.slideTo(index)}
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
              onClick={() => swiper.current?.slidePrev()}
            />
            <IconButton
              variant="outline"
              icon={<IoChevronForwardOutline />}
              aria-label={nextLabel}
              aria-controls={viewportId}
              disabled={activeIndex >= slides.length - 1}
              onClick={() => swiper.current?.slideNext()}
            />
          </ButtonGroup>
        </Flex>
      )}
    </Stack>
  )
}
