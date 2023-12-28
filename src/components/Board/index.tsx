import { createSignal, onCleanup, onMount } from "solid-js";
import styles from "./styles.module.css";

const defaultClickedPosition = {
  x: -1,
  y: -1,
};

export function Board() {
  let boardWrapperRef: HTMLDivElement | undefined;
  let boardRef: HTMLDivElement | undefined;

  const [isGrabbing, setIsGrabbing] = createSignal(false);
  const [scale, setScale] = createSignal(1);
  const [clickedPosition, setClickedPosition] = createSignal(
    defaultClickedPosition
  );

  onMount(() => {
    if (boardRef) {
      const wheelHandler = (event: WheelEvent) => {
        setScale((prevScale) => {
          const newScale = prevScale + event.deltaY * -0.005;
          return Math.min(Math.max(1, newScale), 2);
        });

        requestAnimationFrame(() => {
          if (boardRef) {
            boardRef.style.transform = `scale(${scale()})`;
            boardRef.style.marginTop = `${(scale() - 1) * 50}vh`;
            boardRef.style.marginLeft = `${(scale() - 1) * 50}vw`;
          }
        });
      };

      boardRef.addEventListener("wheel", wheelHandler, { passive: true });

      onCleanup(() => {
        if (boardRef) {
          boardRef.removeEventListener("wheel", wheelHandler);
        }
      });
    }
  });

  const handleMouseDown = (event: MouseEvent) => {
    setIsGrabbing(true);
    setClickedPosition({
      x: event.x,
      y: event.y,
    });
  };

  const handleMouseUp = (event: MouseEvent) => {
    setIsGrabbing(false);
    setClickedPosition(defaultClickedPosition);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (clickedPosition().x >= 0 && clickedPosition().y >= 0) {
      const deltaX = event.x - clickedPosition().x;
      const deltaY = event.y - clickedPosition().y;

      if (boardWrapperRef) {
        boardWrapperRef.scrollBy(-deltaX, -deltaY);
        setClickedPosition({
          x: event.x,
          y: event.y,
        });
      }
    }
  };

  return (
    <div ref={boardWrapperRef} class={styles.wrapper}>
      <div
        ref={boardRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        class={`${styles.board} ${isGrabbing() && "is-grabbing"}`}
      />
    </div>
  );
}
