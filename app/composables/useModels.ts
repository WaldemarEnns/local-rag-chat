import { ref } from 'vue'
import type { OllamaModel } from '~/server/api/models.get'

export function useModels() {
  const models = ref<OllamaModel[]>([])
  const selectedModel = ref('')
  const isLoading = ref(true)
  const error = ref<string | null>(null)

  const fetchModels = async () => {
    try {
      isLoading.value = true
      error.value = null
      const response = await useFetch('/api/models')
      if (response.error.value) {
        throw new Error('Failed to fetch models')
      }
      models.value = response.data.value?.models || []
      if (models.value.length > 0) {
        selectedModel.value = models.value[0].name
      }
    } catch (err) {
      error.value = 'Failed to load models'
      console.error('Error fetching models:', err)
    } finally {
      isLoading.value = false
    }
  }

  const setSelectedModel = (modelName: string) => {
    selectedModel.value = modelName
  }

  return {
    models,
    selectedModel,
    isLoading,
    error,
    fetchModels,
    setSelectedModel
  }
} 