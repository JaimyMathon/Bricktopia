<script setup lang="ts">
import Navbar from '@/components/Navbar/StoreNavbar.vue'
</script>

<route lang="yaml">
meta:
  title: Home
  layout: false
  </route>

<template>
  <Navbar />
  <div class="relative overflow-hidden bg-white">
    <div class="pt-16 pb-80 sm:pt-24 sm:pb-40 lg:pt-40 lg:pb-48">
      <div class="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
        <div class="sm:max-w-lg">
          <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Discover the world of LEGO
          </h1>
          <p class="mt-4 text-xl text-gray-500">
            Explore our latest LEGO sets — from cityscapes to galaxies far, far away. Start building your adventure today!
          </p>
        </div>
        <div>
          <div class="mt-10">
            <!-- Decorative image grid -->
            <div aria-hidden="true" class="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl">
              <div class="absolute transform sm:top-0 sm:left-1/2 sm:translate-x-8 lg:top-1/2 lg:left-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                <div class="flex items-center space-x-6 lg:space-x-8" />
              </div>
            </div>

            <a href="/shop/products" class="inline-block rounded-md border border-transparent bg-yellow-500 px-8 py-3 text-center font-medium text-black hover:bg-yellow-600">
              Shop LEGO blocks
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
