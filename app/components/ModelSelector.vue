<script setup lang="ts">
const models = [
  { id: 'gpt-4', name: 'GPT-4', description: 'Most capable model' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and efficient' },
  { id: 'claude-3', name: 'Claude 3', description: 'Anthropic\'s latest' },
  { id: 'gemini-pro', name: 'Gemini Pro', description: 'Google\'s AI model' }
]

const selectedModel = ref(models[0].id)

const emit = defineEmits<{
  (e: 'change', modelId: string): void
}>()

const handleModelChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  selectedModel.value = target.value
  emit('change', target.value)
}
</script>

<template>
  <div class="relative">
    <select
      id="model-select"
      v-model="selectedModel"
      @change="handleModelChange"
      class="appearance-none block w-48 rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer hover:border-gray-300 transition-colors duration-200"
    >
      <option v-for="model in models" :key="model.id" :value="model.id" class="py-1">
        {{ model.name }}
      </option>
    </select>
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</template> 