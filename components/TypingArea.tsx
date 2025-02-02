"use client";

import { useCallback, useEffect, useState, useRef } from "react";

const isLetter = (str: string) => {
  if (str === "Space") return " ";
  if (str.length === 4 && str.startsWith("Key")) return str[3].toLowerCase();
  return false;
};

interface TypingAreaProps {
  setTimer: React.Dispatch<React.SetStateAction<number>>;
  text: { letter: string; entered: string }[];
  setText: React.Dispatch<React.SetStateAction<{ letter: string; entered: string }[]>>;
  textToType: string;
  setTextToType: React.Dispatch<React.SetStateAction<string>>;
  getRandomWords: () => string;
  setHasStarted: React.Dispatch<React.SetStateAction<boolean>>;
  resetBox: () => void;
}

export function TypingArea({
  setTimer,
  text,
  setText,
  textToType,
  setTextToType,
  getRandomWords,
  setHasStarted,
  resetBox,
}: TypingAreaProps) {
  const [currentLetter, setCurrentLetter] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Ensure input stays focused
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addLetter = useCallback(
    (letter: string) => {
      if (currentLetter >= textToType.length) return;

      // Start timer on first character
      setHasStarted(true);

      letter = letter.toLowerCase();
      const correct = textToType[currentLetter] === letter;

      setText((prevText) =>
        prevText.map((data, index) =>
          index === currentLetter
            ? { ...data, entered: correct ? "correct" : "wrong" }
            : data
        )
      );

      setCurrentLetter((prev) => prev + 1);
    },
    [currentLetter, textToType, setText]
  );

  const deleteLetter = useCallback(() => {
    if (currentLetter === 0) return;

    setText((prevText) =>
      prevText.map((data, index) =>
        index === currentLetter - 1
          ? { ...data, entered: "false" }
          : data
      )
    );

    setCurrentLetter((prev) => prev - 1);
  }, [currentLetter, setText]);

  const keyDownHandler = useCallback(
    (event: KeyboardEvent) => {
      if (event.code === "Backspace") {
        deleteLetter();
        return;
      }

      if (event.code === "Space") {
        event.preventDefault();
        addLetter(" ");
        return;
      }

      const letter = isLetter(event.code);
      if (letter) {
        addLetter(letter);
      }
    },
    [deleteLetter, addLetter]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyDownHandler);
    return () => document.removeEventListener("keydown", keyDownHandler);
  }, [keyDownHandler]);

  // Reset cursor position when text changes
  useEffect(() => {
    setCurrentLetter(0);
    inputRef.current?.focus();
  }, [textToType]);

  return (
    <div
      id="typing-area"
      className="w-full h-full bg-inherit pt-40 text-lg sm:text-3xl sm:pl-20 sm:pr-20 relative"
    >
      <input
        ref={inputRef}
        type="text"
        className="opacity-0 absolute top-0 left-0 h-0 w-0"
        autoFocus
      />
      {text.map((data, i) => (
  <span
    key={i}
    className={`
      ${i === currentLetter ? "bg-gray-500/30 " : ""}
      ${data.letter === " " ? "mr-[0.3rem]" : "mr-[0.05rem]"}
      ${data.entered === "false"
        ? "text-gray-400"
        : data.entered === "wrong"
        ? "text-red-500"
        : "text-gray-100"}
    `}
    style={{ fontSize: "44px" }}  // Set your desired font size here
  >
    {data.letter}
  </span>
))}

    </div>
  );
}