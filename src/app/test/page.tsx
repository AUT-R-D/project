"use client";
import { useState } from 'react'

function reverseWords(sentence: string) {
    const words = sentence.split(' ')
    const reversedWords = words.reverse()
    const reversedSentence = reversedWords.join(' ')
    return reversedSentence;
}

function ReverseWords() {
    const [sentence, setSentence] = useState('')
    const [reversedSentence, setReversedSentence] = useState('')

    const handleSubmit = (event: any) => {
        event.preventDefault()
        const reversed = reverseWords(sentence)
        setReversedSentence(reversed)
    }

    const handleInputChange = (event: any) => {
        setSentence(event.target.value)
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Enter a sentence:
                    <input type="text" value={sentence} onChange={handleInputChange} />
                </label>
                <button type="submit">Reverse words</button>
            </form>
            {reversedSentence && <p>Reversed sentence: {reversedSentence}</p>}
        </div>
    )
}

export default ReverseWords
