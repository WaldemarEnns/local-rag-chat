export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { message, model } = body

  if (!message) {
    throw createError({
      statusCode: 400,
      message: 'Message is required'
    })
  }

  if (!model) {
    throw createError({
      statusCode: 400,
      message: 'Model is required'
    })
  }

  try {
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'user',
            content: message
          }
        ],
        stream: true
      })
    })

    if (!response.ok) {
      throw new Error(`Ollama API responded with status: ${response.status}`)
    }

    // Set up streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        if (!reader) {
          controller.close()
          return
        }

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            controller.enqueue(value)
          }
        } catch (error) {
          console.error('Error reading stream:', error)
          controller.error(error)
        } finally {
          reader.releaseLock()
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    })
  } catch (error) {
    console.error('Error in chat endpoint:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to process chat request'
    })
  }
}) 