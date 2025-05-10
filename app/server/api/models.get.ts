export interface OllamaModel {
  name: string
  model: string
  modified_at: string
  size: number
  digest: string
}

export default defineEventHandler(async () => {
  try {
    const response = await fetch('http://localhost:11434/api/tags')
    const data = await response.json()
    return data as { models: OllamaModel[] }
  } catch (error) {
    console.error('Error fetching Ollama models:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch models from Ollama'
    })
  }
})
