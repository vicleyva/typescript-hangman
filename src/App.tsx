import { useCallback, useEffect, useState } from "react"
import words from "./wordList.json"
import { HangmanDrawing } from "./components/HangmanDrawing"
import { HangmanWord } from "./components/HangmanWord"
import { Keyboard } from "./components/Keyboard"

const chooseRandomWord = () => {
  return words[Math.floor(Math.random() * words.length)]
}

function App() {
  const [wordToGuess, setWordToGuess] = useState(chooseRandomWord)
  const [guessedLetters, setGuessedLetters] = useState<string[]>([])
  const inCorrectLetters = guessedLetters.filter(letter => !wordToGuess.includes(letter))

  const isLoser = inCorrectLetters.length >= 6
  const isWinner = wordToGuess.split("").every(letter => guessedLetters.includes(letter))

  const addGuessedLetter = useCallback((letter: string) => {
    if (guessedLetters.includes(letter) || isLoser || isLoser) return

    setGuessedLetters(currentLetters => [...currentLetters, letter])
  }, [guessedLetters])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key

      if (!key.match(/^[a-z]/)) return

      e.preventDefault()
      addGuessedLetter(key)
    }
    document.addEventListener('keypress', handler)

    return () => document.removeEventListener('keypress', handler)
  }, [guessedLetters, isLoser, isWinner]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key
      if (key === 'Enter') {
        setWordToGuess(chooseRandomWord)
        setGuessedLetters([])
      }
    }
    window.addEventListener('keypress', handler)
    return () => window.removeEventListener('keypress', handler)
  }, [isLoser, isWinner])

  return (
    <div style={{
      maxWidth: '800px',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      margin: '0 auto',
      alignItems: 'center'
    }}>
      <div style={{
        fontSize: '2rem',
        textAlign: 'center'
      }}>
        {isWinner && "Winer - Hit enter to try again"}
        {isLoser && "Nice try - Hit enter to try again"}
      </div>
      <HangmanDrawing numberOfGuesses={inCorrectLetters.length} />
      <HangmanWord
        reveal={isLoser}
        guessedLetters={guessedLetters}
        wordToGuess={wordToGuess}
      />
      <div style={{
        alignSelf: 'stretch'
      }}>
        <Keyboard
          activeLetters={guessedLetters.filter(letter => wordToGuess.includes(letter))}
          inactiveLetters={inCorrectLetters}
          addGuessedLetter={addGuessedLetter}
          disabled={isLoser || isWinner}
        />
      </div>
    </div>
  )
}

export default App
