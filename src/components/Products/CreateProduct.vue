<script setup lang='ts'>
import type { UploadFileInfo } from 'naive-ui/es/upload'
import type { TreeSelectOption } from 'naive-ui/es/tree-select/src/interface'
import { storeToRefs } from 'pinia'
import {
  Add24Filled as PlusIcon,
} from '@vicons/fluent'
import type { Category } from '~/models/Category'
import type { ProductCreateModel } from '~/models/Product'
import type { Brand } from '~/models/Brand'

const { t } = useI18n()
const previewImageUrl = ref('')
const showModal = ref(false)
const showModalRef = ref(false)
const previewImageUrlRef = ref('')
const productItem = ref<ProductCreateModel>({
  naam: '',
  sku: '',
  barcode: '',
  description: '',
  prijs: '',
  discountedPrice: '',
  inStock: false,
  categoryId: '',
  brandId: '',
  tags: [],
  image: '',
  kleur: '',
  rate: '',
  status: '',
  g_code: '',
})

const categoryStore = useCategoryStore()
const brandStore = useBrandStore()
const { categories } = storeToRefs(categoryStore)
const { brands } = storeToRefs(brandStore)
const categoryOptions = ref([])
const brandOptions = ref([])

onMounted(async () => {
  await categoryStore.getCategories()
  await brandStore.getBrands()
  categoryOptions.value = categories.value.map(mapCategoryToOptions)
  brandOptions.value = brands.value.map(mapBrandToOptions)
})

function mapCategoryToOptions(item: Category): TreeSelectOption {
  return {
    key: item.id,
    label: item.name,
    children: item.children?.map(mapCategoryToOptions),
  }
}

function mapBrandToOptions(item: Brand) {
  return {
    value: item.id,
    label: item.name,
  }
}

function handlePreview(file: UploadFileInfo) {
  const { url } = file
  previewImageUrlRef.value = url as string
  showModalRef.value = true
}

async function submitForm() {
  const formData = new FormData()

  formData.append('naam', productItem.value.naam || '')
  formData.append('categorie', productItem.value.categorie || '')
  formData.append('kleur', productItem.value.kleur || '')
  formData.append('rate', productItem.value.rate || '')
  formData.append('prijs', productItem.value.prijs || '')
  formData.append('status', productItem.value.status || '')
  formData.append('stoke', productItem.value.inStock ? '1' : '0')
  formData.append('foto', productItem.value.foto || '')
  formData.append('omschrijving', productItem.value.description || '')
  formData.append('g_code', productItem.value.g_code || '')
  formData.append('sku', productItem.value.sku || '')
  formData.append('barcode', productItem.value.barcode || '')

  try {
    const res = await fetch('https://bricktopia.jaimymathon.eu/api/products/saveProduct.php', {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()

    if (data.status === 'success')
      window.$message.success('Product succesvol toegevoegd!')
    else
      window.$message.error(`Fout: ${data.message}`)
  }
  catch (err) {
    console.error(err)
    window.$message.error('Verbinding met server mislukt.')
  }
}
</script>

<template>
  <n-form>
    <n-layout has-sider sider-placement="right">
      <n-layout-content px-2>
        <n-card size="small" :title="t('products.create.productInformation')" class="mb-3">
          <n-form-item path="name" :label="t('products.create.name')">
            <n-input v-model:value="productItem.naam" :placeholder="t('products.create.name')" size="large" />
          </n-form-item>

          <n-space justify="start">
            <n-form-item path="sku" :label="t('products.create.sku')">
              <n-input v-model:value="productItem.sku" :placeholder="t('products.create.sku')" size="large" />
            </n-form-item>

            <n-form-item path="barcode" :label="t('products.create.barcode')">
              <n-input v-model:value="productItem.barcode" :placeholder="t('products.create.barcode')" size="large" />
            </n-form-item>
          </n-space>

          <n-form-item path="description">
            <Editor v-model="productItem.description" />
          </n-form-item>
        </n-card>

        <n-card size="small" title="Media">
          <n-form-item class="mb-5" path="images" :label="t('brands.create.image')">
            <n-upload
              list-type="image-card"
              accept="image/png, image/jpeg"
              :max="1"
              @preview="handlePreview"
              @change="file => productItem.foto = file.file?.name || ''"
            />
            <n-modal v-model:show="showModal" preset="card" style="width: 600px" :title="t('products.create.imageName')">
              <img :src="previewImageUrl" style="width: 100%">
            </n-modal>
          </n-form-item>
        </n-card>
      </n-layout-content>

      <n-layout-sider :width="380">
        <n-card size="small" :title="t('products.create.pricing')" class="mb-2">
          <n-space vertical>
            <n-form-item path="price" :label="t('products.create.price')">
              <n-input v-model:value="productItem.prijs" size="large" :placeholder="t('products.create.price')" />
            </n-form-item>
            <n-form-item path="discountedPrice" :label="t('products.create.discountedPrice')">
              <n-input v-model:value="productItem.discountedPrice" size="large" :placeholder="t('products.create.discountedPrice')" />
            </n-form-item>
            <hr>
            <n-space p-1 justify="space-between">
              {{ t('products.create.inStock') }}
              <n-switch v-model:value="productItem.inStock" />
            </n-space>
          </n-space>
        </n-card>

        <n-card size="small" title="Category">
          <n-space vertical>
            <n-form-item path="category" :label="t('products.create.category')">
              <n-tree-select
                v-model:value="productItem.categorie"
                key-field="key"
                :options="categoryOptions"
                :placeholder="t('products.create.category')"
              />
            </n-form-item>
            <n-form-item path="brand" :label="t('products.create.brand')">
              <n-select v-model:value="productItem.brandId" :options="brandOptions" />
            </n-form-item>
            <n-form-item path="keywords" :label="t('products.create.keywords')">
              <n-dynamic-tags v-model:value="productItem.tags" :max="10">
                <template #trigger="{ activate, disabled }">
                  <n-button size="small" type="primary" dashed :disabled="disabled" @click="activate()">
                    <template #icon>
                      <n-icon>
                        <PlusIcon />
                      </n-icon>
                    </template>
                    {{ t('products.create.newKeyword') }}
                  </n-button>
                </template>
              </n-dynamic-tags>
            </n-form-item>
          </n-space>
        </n-card>

        <n-button type="primary" block size="large" class="mt-4" @click="submitForm">
          {{ t('products.create.saveProduct') }}
        </n-button>
      </n-layout-sider>
    </n-layout>
  </n-form>
</template>

<style lang='scss'>
.n-card > .n-card-header .n-card-header__main {
  font-weight: bold;
}
</style>
