<route lang="yaml">
meta:
  title: Products
  layout: false
</route>

<script setup>
import { onMounted, ref } from 'vue'
import Navbar from '@/components/Navbar/StoreNavbar.vue'

const products = ref([])
const isLoading = ref(true)
const error = ref(null)

// API ophalen bij starten
onMounted(async () => {
  try {
    const res = await fetch('https://bricktopia.jaimymathon.eu/api/products/getProducts.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ all: true }),
    })
    const data = await res.json()
    if (Array.isArray(data))
      products.value = data
    else
      error.value = data.message || 'Onbekende fout'
  }
  catch (err) {
    console.error(err)
    error.value = 'Kan geen producten ophalen'
  }
  finally {
    isLoading.value = false
  }
})

async function handleClick(productId) {
  // voorbeeldfunctie voor klik
  console.log(`Klik op product met ID: ${productId}`)
}
</script>

<template>
  <Navbar />
  <div class="bg-white">
    <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <h2 class="text-2xl font-bold tracking-tight text-gray-900">
        Lego Producten
      </h2>

      <div v-if="isLoading" class="text-gray-500 mt-4">
        Producten laden...
      </div>
      <div v-if="error" class="text-red-500 mt-4">
        {{ error }}
      </div>

      <div
        v-if="!isLoading && products.length"
        class="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"
      >
        <div v-for="product in products" :key="product.id" class="group relative">
          <img
            :src="`/api/products/${product.foto}`"
            :alt="product.naam"
            class="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
            @click="handleClick(product.id)"
          >
          <div class="mt-4 flex justify-between">
            <div>
              <h3 class="text-sm text-gray-700">
                <a :href="`/shop/product/${product.id}`">
                  <span aria-hidden="true" class="absolute inset-0" />
                  {{ product.naam }}
                </a>
              </h3>
              <p class="mt-1 text-sm text-gray-500">
                {{ product.kleur }}
              </p>
            </div>
            <p class="text-sm font-medium text-gray-900">
              €{{ parseFloat(product.prijs).toFixed(2) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
