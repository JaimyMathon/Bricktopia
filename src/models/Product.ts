import type { Category } from './Category'

export interface Product {
  id: string
  g_code: string // ← was `code`
  naam: string // ← was `name`
  foto: Blob // ← was `image`
  categorie: Category // ← was `category`
  prijs: number // ← was `price`
  bestePrijs: number // ← was `bestPrice`
  status: ProductStatus
  stoke: boolean // ← let op typo vanuit back-end: "stoke"
}

export interface ProductListDto {
  id: string
  g_code: string // ← was `code`
  naam: string // ← was `name`
  foto: string // ← was `image`
  categorie: Category // ← was `category`
  bestePrijs: string // ← was `bestPrice`
  prijs: string // ← was `price`
  rate: number
  status: ProductStatus
  stoke: boolean // ← was `stock`
}

export enum ProductStatus {
  NotActive,
  Active,
  Draft,
}

export interface ProductCreateModel {
  id: string
  g_code: string
  naam: string
  foto: Blob
  categorie: Category
  prijs: number
  bestePrijs: number
  rate: number
  status: ProductStatus
  stoke: boolean
  omschrijving: string // ← was `description`
  categorieId: string | number
  brandId: string | number
  tags: Array<string>
  sku: string
  barcode: string
  kortingPrijs: number // ← was `discountedPrice`
  opVoorraad: boolean // ← was `inStock`
}
