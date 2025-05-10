<script setup lang="ts">
const message = ref('')

const emit = defineEmits<{
  (e: 'send', message: string): void
  (e: 'model-change', modelId: string): void
}>()

const handleSend = () => {
  if (message.value.trim()) {
    emit('send', message.value)
    message.value = ''
  }
}

const handleEnter = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

const handleModelChange = (modelId: string) => {
  emit('model-change', modelId)
}
</script>

<template>
  <div class="w-full max-w-3xl mx-auto p-4">
    <div class="relative bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div class="flex items-center justify-between px-4 pt-4 pb-2 border-b border-gray-100">
        <ModelSelector @change="handleModelChange" />
      </div>
      <textarea
        v-model="message"
        class="w-full min-h-[100px] p-4 pr-16 border-0 rounded-lg resize-none font-inherit text-base leading-relaxed transition-colors duration-200 focus:outline-none focus:ring-0 placeholder:text-gray-400"
        placeholder="Type your message here..."
        @keydown="handleEnter"
      ></textarea>
      <button
        @click="handleSend"
        class="absolute bottom-3 right-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500 flex items-center gap-2"
        :disabled="!message.trim()"
      >
        <span>Send</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </div>
  </div>
</template>