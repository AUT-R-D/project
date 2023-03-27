import { useState } from 'react'

export default function ExampleComponent() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/reverse-words', {
        method: 'POST',
        body: JSON.stringify({ inputText }),
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      setOutputText(data.outputText)
      setIsLoading(false)
    } catch (error) {
      setError(error)
      setIsLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Enter some text:
          <input type="text" value={inputText} onChange={(event) => setInputText(event.target.value)} />
        </label>
        <button type="submit">Submit</button>
      </form>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {outputText && <div>Output: {outputText}</div>}
    </div>
  )
}
