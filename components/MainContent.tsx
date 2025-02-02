// MainContent.tsx
"use client";

import { wordsList } from "@/utils/wordsList";
import { TypingArea } from "./TypingArea";
import { useCallback, useEffect, useState } from "react";

const getRandomWords = () => {
    let words = wordsList.split(" ");
    let randomWords = [];
    for (let i = 0; i < 45; i++) {
        randomWords.push(words[Math.floor(Math.random() * words.length)]);
    }
    let joinedWords = randomWords.join(" ");
    return joinedWords.replace("  ", " ");
}

export function MainContent() {
    const totalTime = 30;
    const [done, setDone] = useState(false);
    const [timer, setTimer] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const [textToType, setTextToType] = useState("");
    const [text, setText] = useState<{ letter: string; entered: string }[]>([]);

    // Initialize text
    useEffect(() => {
        const randomWords = getRandomWords();
        setTextToType(randomWords);
        setText(randomWords.split("").map((letter) => ({ letter: letter, entered: "false" })));
    }, []);

    // Timer logic - only runs after first keypress
    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        
        if (hasStarted && !done) {
            intervalId = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer >= totalTime - 1) {
                        setDone(true);
                        return totalTime;
                    }
                    return prevTimer + 1;
                });
            }, 1000);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [hasStarted, done]);

    const resetBox = useCallback(() => {
        const newText = getRandomWords();
        // Reset all states in order
        setDone(false);
        setHasStarted(false);
        setTimer(0);
        setTextToType(newText);
        setText(newText.split("").map((letter) => ({ letter: letter, entered: "false" })));
    }, []);

    // Move Tab key handler to MainContent
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === "Tab") {
                event.preventDefault();
                resetBox();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [resetBox]);

    const calculateWPM = () => {
        let words = 0;
        let correct = true;
        for (let i = 0; i < text.length; i++) {
            if (text[i].entered === "wrong") {
                correct = false;
                continue;
            }
            if (text[i].entered === "false") {
                correct = false;
                continue;
            }
            if (text[i].letter === " ") {
                if (correct) words++;
                correct = true;
            }
        }
        return Math.ceil((words * 60) / totalTime);
    }

    const calculateRawWPM = () => {
        let words = 0;
        let correct = true;
        for (let i = 0; i < text.length; i++) {
            if (text[i].entered === "false") {
                correct = false;
                continue;
            }
            if (text[i].letter === " ") {
                if (correct) words++;
                correct = true;
            }
        }
        return Math.ceil((words * 60) / totalTime);
    }

    const calculateAccuracy = () => {
        let correct = 0;
        let wrong = 0;
        for (const letter of text) {
            if (letter.entered === "wrong") wrong++;
            if (letter.entered === "correct") correct++;
        }
        const accuracy = ((correct / (correct + wrong)) * 100).toFixed(2);
        return isNaN(Number(accuracy)) ? "0" : accuracy;
    }

    return (
        <div className="row-span-1 col-span-6 grid grid-rows-[0.1fr_3fr_1fr] sm:grid-rows-[0.5fr_4fr_1fr] mt-2 mr-4 ml-4 sm:mt-10 sm:mr-20 sm:ml-20">
            <div id="settings" className="row-span-1" />
            {done ? (
                <div id="stats-display" className="flex flex-col items-center justify-center">
                    <div className="text-6xl sm:text-8xl text-center text-gray-100 mb-8">
                        WPM: {calculateWPM()}
                    </div>
                    <div className="text-xl sm:text-2xl text-center mb-8 text-gray-400">
                        Raw WPM: {calculateRawWPM()} | Accuracy: {calculateAccuracy()}%
                    </div>
                    <div className="space-y-2 text-center text-gray-300">
                        <p>WPM indicates the number of correct words typed per minute.</p>
                        <p>Raw WPM indicates the total number of words typed per minute.</p>
                        <p>Accuracy is the percentage of characters correctly entered.</p>
                    </div>
                </div>
            ) : (
                <div id="main-container">
                    <div id="timer">
                        <p className="text-base sm:text-xl text-left mb-6 sm:mb-0 sm:pl-20 text-gray-400 font-bold">
                            {hasStarted ? `Time Remaining: ${totalTime - timer}s` : "Type to start..."}
                        </p>
                    </div>
                    <div id="main-box-container">
                        <TypingArea
                            setTimer={setTimer}
                            text={text}
                            setText={setText}
                            textToType={textToType}
                            setTextToType={setTextToType}
                            getRandomWords={getRandomWords}
                            setHasStarted={setHasStarted}
                            resetBox={resetBox}
                        />
                    </div>
                </div>
            )}
            <div id="instructions" className="row-span-1 flex flex-col mt-6 sm:mt-0 sm:block">
                <button 
                    className="p-3 bg-gray-800 sm:hidden rounded hover:bg-gray-700" 
                    onClick={resetBox}
                >
                    Restart Test
                </button>
                <p className="text-center hidden sm:block">
                    Press <span className="text-gray-200">TAB</span> to restart test.
                </p>
            </div>
        </div>
    );
}