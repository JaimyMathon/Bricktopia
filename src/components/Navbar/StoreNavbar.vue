<script setup>
import { ref } from 'vue'

const callsToAction = [
  { name: 'Watch demo', href: '#' },
  { name: 'Contact sales', href: '#' },
]

const mobileMenuOpen = ref(false)
const dropdownOpen = ref(false)

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
}
</script>

<template>
  <header class="bg-white">
    <nav class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
      <div class="flex lg:flex-1">
        <a href="#" class="-m-1.5 p-1.5">
          <span class="sr-only">Bricktopia</span>
          <img class="h-8 w-auto" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/LEGO_logo.svg/2048px-LEGO_logo.svg.png" alt="">
        </a>
      </div>
      <div class="flex lg:hidden">
        <button type="button" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = true">
          <span class="sr-only">Open main menu</span>
          ☰ <!-- Hamburger Icon -->
        </button>
      </div>
      <div v-if="!mobileMenuOpen" class="hidden lg:flex lg:gap-x-12">
        <div class="relative">
          <div v-if="dropdownOpen" class="absolute top-full left-0 mt-2 w-40 bg-white shadow-lg rounded-lg">
            <a v-for="item in products" :key="item.name" :href="item.href" class="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100">
              {{ item.name }}
            </a>
          </div>
        </div>

        <a href="https://bricktopia.jaimymathon.eu/" class="text-sm font-semibold text-gray-900">Home</a>
        <a href="https://bricktopia.jaimymathon.eu/shop/products" class="text-sm font-semibold text-gray-900">Shop</a>
      </div>

      <div class="hidden lg:flex lg:flex-1 lg:justify-end">
        <a href="https://bricktopia.jaimymathon.eu/account/login" class="text-sm font-semibold text-gray-900">Log in →</a>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <div v-if="mobileMenuOpen" class="lg:hidden fixed inset-0 z-10 bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
      <div class="flex items-center justify-between">
        <a href="#" class="-m-1.5 p-1.5">
          <span class="sr-only">Bricktopia</span>
          <img class="h-8 w-auto" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/LEGO_logo.svg/2048px-LEGO_logo.svg.png" alt="">
        </a>
        <button type="button" class="-m-2.5 rounded-md ptailwindcss-2.5 text-gray-700" @click="mobileMenuOpen = false">
          <span class="sr-only">Close menu</span>
          ✖ <!-- Close icon -->
        </button>
      </div>
      <div class="mt-6">
        <a v-for="item in [...products, ...callsToAction]" :key="item.name" :href="item.href" class="block py-2 text-base font-semibold text-gray-900 hover:bg-gray-50">
          {{ item.name }}
        </a>
      </div>
    </div>
  </header>
</template>
