<script setup lang="ts">
import type { OllamaModel } from '~/server/api/models.get'

defineProps<{
  models: OllamaModel[]
  selectedModel: string
  isLoading: boolean
  error: string | null
}>()

const emit = defineEmits<{
  (e: 'update:selectedModel', modelId: string): void
}>()

const handleModelChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:selectedModel', target.value)
}
</script>

<template>
  <div class="relative">
    <select
      id="model-select"
      :value="selectedModel"
      class="appearance-none block w-48 rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer hover:border-gray-300 transition-colors duration-200"
      :disabled="isLoading"
      @change="handleModelChange"
    >
      <option v-if="isLoading" value="" disabled>Loading models...</option>
      <option v-else-if="error" value="" disabled>Error loading models</option>
      <option v-else-if="models.length === 0" value="" disabled>No models available</option>
      <option v-for="model in models" :key="model.name" :value="model.name" class="py-1">
        {{ model.name }}
      </option>
    </select>
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
      <svg v-if="isLoading" class="h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</template> 