import { createSignal, onCleanup, onMount } from "solid-js";
import styles from "./styles.module.css";

export function Board() {
  let boardWrapperRef;
  let boardRef: HTMLDivElement | undefined;

  const [isGrabbing, setIsGrabbing] = createSignal(false);
  const [scale, setScale] = createSignal(1);

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

  const handleMouseDown = () => {};

  const handleMouseUp = () => {};

  const handleMouseMove = () => {};

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
