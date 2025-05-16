<route lang="yaml">
meta:
  title: Product Details
  layout: false
  </route>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar/StoreNavbar.vue'

const route = useRoute()
const productId = route.params.id

const product = ref(null)
const isLoading = ref(true)
const error = ref(null)
const showCartPopup = ref(false) // Controleer of de popup getoond moet worden
const isPaymentSuccessful = ref(false) // Controleer of de betaling succesvol was

onMounted(async () => {
  try {
    const res = await fetch('https://bricktopia.jaimymathon.eu/api/products/getProduct.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: productId }),
    })

    const data = await res.json()

    if (data && data.id)
      product.value = data
    else
      error.value = data.message || 'Product niet gevonden'
  }
  catch (err) {
    console.error(err)
    error.value = 'Fout bij het laden van het product'
  }
  finally {
    isLoading.value = false
  }
})

function toggleCartPopup() {
  showCartPopup.value = !showCartPopup.value
}

function handlePayment() {
  isPaymentSuccessful.value = true

  // API-aanroep om de betaling te verwerken
  fetch('https://bricktopia.jaimymathon.eu/api/printer/api.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productId: product.value.id, // Verstuur het product ID
      price: product.value.prijs, // Verstuur de prijs van het product
      quantity: 1, // Stel het aantal in op 1, of wijzig dit naar wens
    }),
  })
    .then(response => response.json())
    .then((data) => {
      console.log('Payment processed:', data)
      isPaymentSuccessful.value = true // Succesvolle betaling
      setTimeout(() => {
        isPaymentSuccessful.value = false
        toggleCartPopup() // Sluit de popup na "betalingssucces"
      }, 2000) // Simuleer een betaling met een vertraging van 2 seconden
    })
    .catch((err) => {
      console.error('Payment failed:', err)
      isPaymentSuccessful.value = false // Fout bij betaling
    })
}
</script>

<template>
  <Navbar />
  <div class="bg-white">
    <div v-if="isLoading" class="p-6 text-lg">
      Product aan het laden...
    </div>
    <div v-else-if="error" class="p-6 text-red-500 text-lg">
      {{ error }}
    </div>
    <div v-else class="pt-6">
      <!-- Breadcrumb -->
      <nav v-if="product.breadcrumbs" aria-label="Breadcrumb">
        <ol role="list" class="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <li v-for="breadcrumb in product.breadcrumbs" :key="breadcrumb.id">
            <div class="flex items-center">
              <a :href="breadcrumb.href" class="mr-2 text-sm font-medium text-gray-900">{{ breadcrumb.name }}</a>
              <svg width="16" height="20" fill="currentColor" aria-hidden="true" class="h-5 w-4 text-gray-300">
                <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
              </svg>
            </div>
          </li>
          <li class="text-sm">
            <a :href="product.href" aria-current="page" class="font-medium text-gray-500 hover:text-gray-600">{{ product.naam }}</a>
          </li>
        </ol>
      </nav>

      <div class="mx-auto mt-6 max-w-md sm:px-6 lg:px-8">
        <img
          :src="`/api/products/${product.foto}` || product.images?.[0]?.src"
          :alt="product.naam"
          class="w-full max-h-96 object-cover rounded-lg mx-auto"
        >
      </div>

      <!-- Product info -->
      <div class="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto_auto_1fr] lg:gap-x-8 lg:px-8 lg:pt-16 lg:pb-24">
        <div class="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
          <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {{ product.naam }}
          </h1>
        </div>

        <!-- Sidebar -->
        <div class="mt-4 lg:row-span-3 lg:mt-0">
          <h2 class="sr-only">
            Product informatie
          </h2>
          <p class="text-3xl tracking-tight text-gray-900">
            €{{ parseFloat(product.prijs).toFixed(2) }}
          </p>

          <div class="mt-6">
            <p class="text-sm font-medium text-gray-900">
              Kleur:
            </p>
            <p class="text-base text-gray-600 capitalize">
              {{ product.kleur || 'Onbekend' }}
            </p>
          </div>

          <button class="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-green-500 px-8 py-3 text-base font-medium text-white hover:bg-green-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" @click="toggleCartPopup">
            Buy Now
          </button>

          <div v-if="showCartPopup" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div class="bg-white p-8 rounded-lg max-w-sm w-full">
              <h3 class="text-lg font-semibold">
                Shopping cart
              </h3>
              <p class="mt-2 text-gray-600">
                Product: {{ product.naam }}
              </p>
              <p class="mt-2 text-gray-600">
                Prijs: €{{ parseFloat(product.prijs).toFixed(2) }}
              </p>

              <div v-if="isPaymentSuccessful" class="mt-4 text-green-600">
                Payment Succes! Thank you for buying.
              </div>

              <div v-else>
                <button class="mt-6 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600" @click="handlePayment">
                  Buy now
                </button>
              </div>

              <button class="mt-4 w-full text-center text-sm text-gray-500" @click="toggleCartPopup">
                Close
              </button>
            </div>
          </div>

          <div class="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pr-8 lg:pb-16">
            <!-- Description and details -->
            <div>
              <h3 class="text-sm font-medium text-gray-900">
                description
              </h3>
              <p class="mt-2 text-sm text-gray-600">
                {{ product.omschrijving || 'Geen beschrijving beschikbaar.' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
