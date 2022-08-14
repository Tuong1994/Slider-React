import React from "react";
import classes from "./carousel.module.css";

const widthSpan = 100;

const Carousel = (props) => {
  const { children, infinite, timer, stopOnManual } = props;

  let interval;

  const [sliderPos, setSliderPos] = React.useState(0);

  const [touchStartPos, setTouchStartPos] = React.useState(0);
  const [touchEndPos, setTouchEndPos] = React.useState(0);
  const [touched, setTouched] = React.useState(false);
  const [swiped, setSwiped] = React.useState(false);

  const [mouseStartPos, setMouseStartPos] = React.useState(0);
  const [mouseEndPos, setMouseEndPos] = React.useState(0);
  const [mouseClicked, setMouseClicked] = React.useState(false);
  const [mouseSwiped, setMouseSwiped] = React.useState(false);

  const [autoAdvance, setAutoAdvance] = React.useState(timer !== undefined);

  React.useEffect(() => {
    window.addEventListener("keydown", keyPressHanlder);
    if (autoAdvance && !mouseClicked && !touched) {
      interval = setInterval(() => {
        nextSlideHandler();
      }, timer);
    }
    return () => {
      window.removeEventListener("keydown", keyPressHanlder);
      clearInterval(interval);
    };
  });

  const displayItems = React.Children.map(children, (child, index) => (
    <div className={classes.CarouselItem} id={`carousel${index}`}>
      {child}
    </div>
  ));

  const displayDots = React.Children.map(children, (child, index) => (
    <div
      className={
        sliderPos === index
          ? classes.DotsItem.concat(" " + classes.CurrentDots)
          : classes.DotsItem
      }
      onClick={() => jumpToSlide(index)}
    ></div>
  ));

  //   Function xử lý logic chuyển slide
  const translateFullSlide = (newPos) => {
    let toTranslate = -widthSpan * newPos;
    for (let i = 0; i < (children.length || 1); i++) {
      let el = document.getElementById(`carousel${i}`);
      el.style.transform = `translateX(${toTranslate}%)`;
    }
  };

  const translatePartialSlides = (toTranslate) => {
    const currentTranslation = -sliderPos * widthSpan;
    const totalTranslation = currentTranslation + toTranslate;
    for (let i = 0; i < (children.length || 1); i++) {
      let el = document.getElementById(`carousel${i}`);
      el.style.transform = `translateX(${totalTranslation}%)`;
    }
  };

  const manageTimer = () => {
    clearInterval(interval);
    if (stopOnManual) {
      setAutoAdvance(false);
    }
  };

  const speedUpAnimation = () => {
    for (
      let i = Math.max(0, sliderPos - 2);
      i < (Math.min(children.length, sliderPos + 3) || 1);
      i++
    ) {
      let el = document.getElementById(`carousel${i}`);
      el.classList.add(classes.FastTrasition);
    }
  };

  const slowDownAnimation = () => {
    for (
      let i = Math.max(0, sliderPos - 2);
      i < (Math.min(children.length, sliderPos + 3) || 1);
      i++
    ) {
      let el = document.getElementById(`carousel${i}`);
      el.classList.remove(classes.FastTrasition);
    }
  };

  const prevSlideHandler = () => {
    let newPos = sliderPos;
    if (newPos > 0) {
      newPos = newPos - 1;
    } else if (infinite) {
      newPos = children.length - 1 || 0;
    }
    translateFullSlide(newPos);
    setSliderPos(newPos);
  };

  const nextSlideHandler = () => {
    let newPos = sliderPos;
    if (newPos < children.length - 1) {
      newPos = newPos + 1;
    } else if (infinite) {
      newPos = 0;
    }
    translateFullSlide(newPos);
    setSliderPos(newPos);
  };

  const jumpToSlide = (pos) => {
    let toTranslate = pos;
    translateFullSlide(toTranslate);
    setSliderPos(pos);
  };

  //   Function sự kiện xử lý chuyển slide
  //     CLICK EVENT
  const prevClickHandler = () => {
    manageTimer();
    prevSlideHandler();
  };

  const nextClickHandler = () => {
    manageTimer();
    nextSlideHandler();
  };

  //   PRESS EVENT
  const keyPressHanlder = (e) => {
    manageTimer();
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      e.stopPropagation();
      prevSlideHandler();
      return;
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      e.stopPropagation();
      nextSlideHandler();
      return;
    }
    if (49 <= e.keyCode && e.keyCode <= 57) {
      const arrPos = e.keyCode - 49;
      if (arrPos < children.length) {
        jumpToSlide(arrPos);
      }
      return;
    }
    if (e.keyCode === 48) {
      if (children.length >= 10) {
        jumpToSlide(9);
      }
      return;
    }
  };

  //   TOUCH EVENT
  const touchStartHandler = (e) => {
    manageTimer();
    speedUpAnimation();
    setTouchStartPos(e.targetTouches[0].clientX);
    setTouchEndPos(e.targetTouches[0].clientX);
    setTouched(true);
  };

  const touchMoveHandler = (e) => {
    setTouchEndPos(e.targetTouches[0].clientX);
    const frameWidth = document.getElementById("displayFrame").offsetWidth;
    const translateDist = ((touchEndPos - touchStartPos) / frameWidth) * 100;
    translatePartialSlides(translateDist);
    if (touched) {
      setSwiped(true);
    }
  };

  const touchEndHandler = (e) => {
    if (swiped) {
      slowDownAnimation();
      if (touchEndPos - touchStartPos > 75) {
        prevSlideHandler();
      } else if (touchEndPos - touchStartPos < -75) {
        nextSlideHandler();
      } else {
        jumpToSlide(sliderPos);
      }
    }
    setTouched(false);
    setSwiped(false);
  };

  //   DRAG EVENT
  const mouseStartHandler = (e) => {
    manageTimer();
    e.preventDefault();
    speedUpAnimation();
    setMouseStartPos(e.clientX);
    setMouseEndPos(e.clientX);
    setMouseClicked(true);
  };

  const mouseMoveHandler = (e) => {
    e.preventDefault();
    let frameWidth = document.getElementById("displayFrame").offsetWidth;
    if (mouseClicked) {
      setMouseEndPos(e.clientX);
      const translateDist = ((mouseEndPos - mouseStartPos) / frameWidth) * 100;
      translatePartialSlides(translateDist);
      setMouseSwiped(true);
    }
  };

  const mouseEndHandler = (e) => {
    slowDownAnimation();
    if (mouseSwiped) {
      if (mouseEndPos - mouseStartPos > 100) {
        prevSlideHandler();
      } else if (mouseEndPos - mouseStartPos < -100) {
        nextSlideHandler();
      } else {
        jumpToSlide(sliderPos);
      }
    }
    setMouseSwiped(false);
    setMouseClicked(false);
  };

  return (
    <div>
      <div className={classes.Container}>
        <button className={classes.LeftArrow} onClick={prevClickHandler}>
          &#10094;
        </button>

        <div
          className={classes.DisplayFrame}
          id="displayFrame"
          onTouchStart={(e) => touchStartHandler(e)}
          onTouchEnd={(e) => touchEndHandler(e)}
          onTouchMove={(e) => touchMoveHandler(e)}
          onMouseDown={(e) => mouseStartHandler(e)}
          onMouseMove={(e) => mouseMoveHandler(e)}
          onMouseUp={(e) => mouseEndHandler(e)}
          onMouseLeave={(e) => mouseEndHandler(e)}
        >
          {displayItems}
        </div>

        <button className={classes.RightArrow} onClick={nextClickHandler}>
          &#10095;
        </button>
        <div className={classes.DotsNav}>{displayDots}</div>
      </div>
    </div>
  );
};

export default Carousel;
