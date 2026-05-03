"use client";

import Image from "next/image";
import type { MouseEvent, TouchEvent } from "react";
import { useRef, useState } from "react";

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

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
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
    const touch = event.touches[0];

    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (!touchStart.current || images.length <= 1) {
      touchStart.current = null;
      return;
    }

    const touch = event.changedTouches[0];
    const diffX = touch.clientX - touchStart.current.x;
    const diffY = touch.clientY - touchStart.current.y;
    const minimumSwipeDistance = 50;

    touchStart.current = null;

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
    <div style={{ marginBottom: "12px" }}>
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          position: "relative",
          width: "100%",
          height,
          overflow: "hidden",
          borderRadius,
          background: "#f8fafc",
          touchAction: "pan-y",
        }}
      >
        <Image
          src={images[currentIndex]}
          alt={`${alt} ${currentIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          style={{
            objectFit: "cover",
          }}
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(event) => handleSliderControlClick(event, goToPrevious)}
              aria-label="Show previous product image"
              style={navButtonStyle("left")}
            >
              {"<"}
            </button>
            <button
              type="button"
              onClick={(event) => handleSliderControlClick(event, goToNext)}
              aria-label="Show next product image"
              style={navButtonStyle("right")}
            >
              {">"}
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            marginTop: "10px",
          }}
        >
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={(event) =>
                handleSliderControlClick(event, () => setActiveIndex(index))
              }
              aria-label={`Show product image ${index + 1}`}
              aria-pressed={currentIndex === index}
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "999px",
                border: "none",
                padding: 0,
                background: currentIndex === index ? "#0f172a" : "#cbd5e1",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const navButtonStyle = (side: "left" | "right") => ({
  position: "absolute" as const,
  top: "50%",
  [side]: "12px",
  transform: "translateY(-50%)",
  width: "36px",
  height: "36px",
  borderRadius: "999px",
  border: "none",
  background: "rgba(15, 23, 42, 0.72)",
  color: "#fff",
  fontSize: "1.1rem",
  fontWeight: 700,
  lineHeight: 1,
  cursor: "pointer",
  display: "grid",
  placeItems: "center",
  zIndex: 1,
});
