"use client";

import Image from "next/image";
import type { MouseEvent, TouchEvent } from "react";
import { useRef, useState } from "react";
import styles from "./ProductImageSlider.module.css";

type ProductImageSliderProps = {
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  alt: string;
  height?: string;
  borderRadius?: string;
};

const isValidImage = (value?: string) =>
  Boolean(value && value.trim() && value.startsWith("http"));

export default function ProductImageSlider({
  image1,
  image2,
  image3,
  image4,
  image5,
  alt,
  height = "280px",
  borderRadius = "10px",
}: ProductImageSliderProps) {
  const images = [image1, image2, image3, image4, image5].filter(
    isValidImage
  ) as string[];
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const currentIndex = activeIndex >= images.length ? 0 : activeIndex;

  if (images.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          height,
          display: "grid",
          placeItems: "center",
          background: "#f3f4f6",
          color: "#64748b",
          borderRadius,
          marginBottom: "12px",
        }}
      >
        No image
      </div>
    );
  }

  const goToSlide = (index: number) => {
    setActiveIndex(((index % images.length) + images.length) % images.length);
    setDragOffset(0);
  };

  const goToPrevious = () => {
    goToSlide(currentIndex - 1);
  };

  const goToNext = () => {
    goToSlide(currentIndex + 1);
  };

  const handleSliderControlClick = (
    event: MouseEvent<HTMLButtonElement>,
    action: () => void
  ) => {
    event.preventDefault();
    event.stopPropagation();
    action();
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (images.length <= 1) {
      return;
    }

    const touch = event.touches[0];

    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
    setIsDragging(true);
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    if (!touchStart.current || images.length <= 1) {
      return;
    }

    const touch = event.touches[0];
    const diffX = touch.clientX - touchStart.current.x;
    const diffY = touch.clientY - touchStart.current.y;

    if (Math.abs(diffY) > Math.abs(diffX)) {
      return;
    }

    setDragOffset(diffX);
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (!touchStart.current || images.length <= 1) {
      touchStart.current = null;
      setIsDragging(false);
      setDragOffset(0);
      return;
    }

    const touch = event.changedTouches[0];
    const diffX = touch.clientX - touchStart.current.x;
    const diffY = touch.clientY - touchStart.current.y;
    const sliderWidth = sliderRef.current?.clientWidth || 0;
    const minimumSwipeDistance = Math.min(80, sliderWidth * 0.22);

    touchStart.current = null;
    setIsDragging(false);
    setDragOffset(0);

    if (
      Math.abs(diffX) < minimumSwipeDistance ||
      Math.abs(diffX) <= Math.abs(diffY)
    ) {
      return;
    }

    if (diffX > 0) {
      goToPrevious();
      return;
    }

    goToNext();
  };

  return (
    <div className={styles.root} style={{ width: "100%", height }}>
      <div
        ref={sliderRef}
        className={styles.viewport}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => {
          touchStart.current = null;
          setIsDragging(false);
          setDragOffset(0);
        }}
        style={{
          height: "100%",
          borderRadius,
        }}
      >
        <div
          className={styles.track}
          style={{
            transform: `translateX(calc(${-currentIndex * 100}% + ${dragOffset}px))`,
            transition: isDragging ? "none" : undefined,
          }}
        >
          {images.map((image, index) => (
            <div className={styles.slide} key={`${image}-${index}`}>
              <Image
                src={image}
                alt={`${alt} ${index + 1}`}
                fill
                sizes="(max-width: 768px) 360px, 540px"
                priority={index === 0}
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(event) => handleSliderControlClick(event, goToPrevious)}
              aria-label="Show previous product image"
              className={`${styles.navButton} ${styles.navButtonLeft}`}
            >
              {"<"}
            </button>
            <button
              type="button"
              onClick={(event) => handleSliderControlClick(event, goToNext)}
              aria-label="Show next product image"
              className={`${styles.navButton} ${styles.navButtonRight}`}
            >
              {">"}
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className={styles.dots}>
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={(event) =>
                handleSliderControlClick(event, () => goToSlide(index))
              }
              aria-label={`Show product image ${index + 1}`}
              aria-pressed={currentIndex === index}
              className={`${styles.dot} ${
                currentIndex === index ? styles.dotActive : ""
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
