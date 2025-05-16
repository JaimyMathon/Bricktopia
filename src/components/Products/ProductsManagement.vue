<script setup lang='ts'>
import { NButton, NDataTable, NIcon, NInput, NLayout, NLayoutContent, NSpace, NSwitch, NText, NTooltip } from 'naive-ui'
import { Delete20Regular as DeleteIcon, Add24Filled as PlusIcon } from '@vicons/fluent'
import { h, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { DataTableColumns, DataTableRowKey } from 'naive-ui'
import type { RowData } from 'naive-ui/es/data-table/src/interface'

const { t } = useI18n()
const router = useRouter()
const message = useMessage()

const products = ref<RowData[]>([])
const isLoading = ref(false)
const checkedRows = ref<DataTableRowKey[]>([])
const options = ref({
  page: 1,
  pageSize: 10,
  query: '',
  sort: null,
  filters: null,
})

async function getItems() {
  isLoading.value = true
  try {
    const res = await fetch('https://bricktopia.jaimymathon.eu/api/products/getProductsList.php')
    const json = await res.json()
    products.value = json.data
  }
  catch (err) {
    console.error(err)
    message.error('Failed to load products.')
  }
  finally {
    isLoading.value = false
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'Draft':
      return 'info'
    case 'Active':
      return 'success'
    case 'NotActive':
      return 'warning'
    default:
      return 'default'
  }
}

function renderPrice(prijs: string | number, currency: string) {
  return h(NText, {}, { default: () => `${currency} ${prijs}` })
}

function renderRate(rate: string | number) {
  return h(NText, {}, { default: () => `${rate} ★` })
}

function renderTag(text: string, color: string) {
  return h('span', { class: `text-${color}` }, text)
}

// function renderProductImage(url: string, name: string) {
//   return h('div', { class: 'flex items-center gap-2' }, [
//     h('img', { src: url, width: 40, height: 40 }),
//     h('span', {}, name),
//   ])
// }

function renderDeleteActionButton(confirmText: string, callback: () => void) {
  return h(NButton, {
    strong: true,
    size: 'small',
    type: 'error',
    onClick: callback,
  }, { default: () => confirmText })
}

function renderProductImage(foto: string, alt: string) {
  return h('img', {
    src: `/api/products/${foto}`,
    alt,
    style: 'width: 50px; height: 50px; object-fit: cover; border-radius: 6px;',
  })
}

const columns: DataTableColumns<RowData> = [
  { type: 'selection', fixed: 'left' },
  {
    title: t('products.image'),
    key: 'foto',
    render: row => renderProductImage(row.foto, row.naam),
  },
  {
    title: t('products.category'),
    key: 'categorie',
    render: row => h(NText, {}, { default: () => row.categorie }),
  },
  {
    title: t('products.rate'),
    key: 'rate',
    render: row => renderRate(row.rate),
  },
  {
    title: t('common.price'),
    key: 'prijs',
    render: row => renderPrice(row.prijs, '€'),
  },
  {
    title: t('common.status'),
    key: 'status',
    render: row => renderTag(row.status, getStatusColor(row.status)),
  },
  {
    title: t('products.stoke'),
    key: 'stoke',
    render: row => h(NSwitch, { value: row.stoke === '1', size: 'small' }),
  },
  {
    title: t('common.actions'),
    key: 'actions',
    width: 110,
    render: row => [
      renderDeleteActionButton(t('common.deleteConfirm'), () => handleDeleteItem(row)),
    ],
  },
]

function rowKey(row: RowData) {
  return row.barcode || row.sku || row.g_code
}

function handleDeleteItem(row: RowData) {
  message.success(`Product "${row.naam}" verwijderd (simulatie)`)
}

function handlePageChange(page: number) {
  options.value.page = page
  getItems()
}

function handleSorterChange() {
  getItems()
}

function handleFiltersChange() {
  getItems()
}

let searchTimerId: any = null
function searchInListDebounced(value: string) {
  clearTimeout(searchTimerId)
  options.value.query = value
  searchTimerId = setTimeout(() => {
    getItems()
  }, 500)
}

function handleCheck(checkedRowKeys: DataTableRowKey[]) {
  checkedRows.value = checkedRowKeys
}

onMounted(getItems)
</script>

<template>
  <NLayout>
    <NLayoutContent>
      <div class="px-3">
        <NSpace justify="space-between" class="mb-3">
          <NInput v-model:value="options.query" :placeholder="t('common.search')" @input="searchInListDebounced" />
          <div>
            <NTooltip v-if="checkedRows.length" trigger="hover">
              <template #trigger>
                <NButton quaternary circle>
                  <template #icon>
                    <NIcon>
                      <DeleteIcon />
                    </NIcon>
                  </template>
                </NButton>
              </template>
              <span>{{ t('common.delete') }}</span>
            </NTooltip>
            <NButton type="primary" @click="router.push('/Products/Create')">
              <template #icon>
                <NIcon>
                  <PlusIcon />
                </NIcon>
              </template>
              {{ t('common.new') }}
            </NButton>
          </div>
        </NSpace>
        <NDataTable
          remote :columns="columns" :data="products" :loading="isLoading"
          :pagination="options" selectable :row-key="rowKey" :scroll-x="1000"
          @update:sorter="handleSorterChange" @update:filters="handleFiltersChange"
          @update:checked-row-keys="handleCheck" @update:page="handlePageChange"
        />
      </div>
    </NLayoutContent>
  </NLayout>
</template>

<style scoped lang='scss'></style>
