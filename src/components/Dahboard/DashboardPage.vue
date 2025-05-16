<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Cart16Regular as BasketIcon,
  Box16Regular as BoxIcon,
  DataTrending16Regular as StatIcon,
  People16Regular as UserIcon,
} from '@vicons/fluent'

// import { useLayoutStore } from '~/stores/layout'
// import { useNotifyStore } from '~/stores/notify'

const { t } = useI18n()
const layout = useLayoutStore()
const notify = useNotifyStore()

const isLoading = ref(true)

const productsData = ref({ count: 0, progress: 0, progressFlow: [] })
const registersData = ref({ count: 0, progress: 0, progressFlow: [] })
const sellsData = ref({ count: 0, progress: 0, progressFlow: [] })
const visitsData = ref({ count: 0, progress: 0, progressFlow: [] })

async function fetchProductsData() {
  isLoading.value = true
  try {
    const response = await fetch('/api/products/getProducts.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ summary: true }), // stuur data als JSON
    })

    if (!response.ok)
      throw new Error('Fout bij ophalen productdata')

    const data = await response.json()
    productsData.value = data
  }
  catch (err) {
    console.error('Fout bij ophalen productdata:', err)
  }
  finally {
    isLoading.value = false
  }
}

async function fetchUsersData() {
  isLoading.value = true
  try {
    const response = await fetch('/api/users/getUsers.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ all: true }), // stuur de aanvraag voor alle gebruikers
    })

    if (!response.ok)
      throw new Error('Fout bij ophalen gebruikersdata')

    const data = await response.json()
    registersData.value = data
    // Voeg hier het aantal gebruikers toe
    const userCount = data.length
    registersData.value.count = userCount // Voeg het aantal gebruikers toe aan registersData
  }
  catch (err) {
    console.error('Fout bij ophalen gebruikersdata:', err)
  }
  finally {
    isLoading.value = false
  }
}

function fetchOtherData() {
  sellsData.value = {
    count: 87,
    progress: -3,
    progressFlow: [9, 7, 6, 4],
  }

  visitsData.value = {
    count: 312,
    progress: 12,
    progressFlow: [15, 25, 20, 30],
  }
}

onMounted(() => {
  fetchProductsData()
  fetchOtherData()
  fetchUsersData()

  if (!layout.isWelcomeShown) {
    setTimeout(() => {
      notify.notify({ body: t('notify.welcome'), type: 'success', duration: 10000 })
      layout.showWelcome()
    }, 2000)
  }
})
</script>

<template>
  <div>
    <div class="margin-outside flex flex-wrap pb-3">
      <SummaryStatCard :loading="false" :data="registersData" :title="t('dashboard.registers')" :icon="UserIcon" />
      <SummaryStatCard :loading="false" :data="productsData" :title="t('dashboard.products')" :icon="BoxIcon" />
      <SummaryStatCard :loading="false" :data="sellsData" :title="t('dashboard.sells')" :icon="BasketIcon" />
      <SummaryStatCard :loading="false" :data="visitsData" :title="t('dashboard.visits')" :icon="StatIcon" />
    </div>

    <div class="flex flex-col lg:flex-row margin-outside pb-3">
      <div class="flex flex-col w-full lg:w-1/3">
        <Card class="p-2" :title="t('dashboard.summary')">
          <LineChart />
        </Card>
        <Card class="p-2" :title="t('dashboard.summary')">
          <DonutChart />
        </Card>
      </div>
      <div class="w-full lg:w-2/3 p-2">
        <Card :title="t('dashboard.summary')">
          <BarChart />
        </Card>
      </div>
    </div>

    <div class="flex flex-wrap margin-outside">
      <div class="w-full lg:w-1/2 px-2">
        <Card :title="t('dashboard.recentOrders')">
          <RecentOrders />
        </Card>
      </div>
      <div class="w-full lg:w-1/2 px-2">
        <Card :title="t('dashboard.trendingProducts')">
          <TrendingProducts />
        </Card>
      </div>
    </div>
  </div>
</template>
