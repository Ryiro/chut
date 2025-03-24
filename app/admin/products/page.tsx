'use client'

import { useState } from 'react'
import { searchProducts } from './actions'
import AddProduct from './components/AddProduct'
import EditProduct from './components/EditProduct'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

type Product = {
  id: string
  name: string
  sku: string
  description: string
  brand: string
  price: number
  stock: number
  categoryId: string
  createdAt: string
  updatedAt: string
  category: {
    id: string
    name: string
    description?: string | null
    slug: string
    parentId?: string | null
    icon?: string | null
    featured: boolean
    sortOrder: number
  }
}

export default function AdminProducts() {
  const [view, setView] = useState<'add' | 'edit'>('edit')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)

  async function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const query = e.target.value
    setSearchQuery(query)
    setShowResults(true)
    
    if (query.length >= 2) {
      setIsSearching(true)
      try {
        const results = await searchProducts(query)
        setSearchResults(results)
      } catch (error) {
        console.error('Search failed:', error)
      } finally {
        setIsSearching(false)
      }
    } else {
      setSearchResults([])
    }
  }

  function handleSelectProduct(product: Product) {
    setSelectedProductId(product.id)
    setShowResults(false)
    setSearchQuery(product.name)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <div className="space-x-2">
          <Button 
            onClick={() => {
              setView('add')
              setSelectedProductId(null)
              setSearchQuery('')
              setSearchResults([])
              setShowResults(false)
            }}
            variant={view === 'add' ? 'default' : 'secondary'}
          >
            Add Product
          </Button>
          <Button 
            onClick={() => setView('edit')}
            variant={view === 'edit' ? 'default' : 'secondary'}
          >
            Edit Product
          </Button>
        </div>
      </div>

      {view === 'add' ? (
        <AddProduct />
      ) : (
        <div>
          <div className="relative mb-4">
            <Input 
              type="text" 
              placeholder="Search products by name, SKU, or brand..."
              value={searchQuery}
              onChange={handleSearch}
              onFocus={() => setShowResults(true)}
            />

            {/* Dropdown for search results */}
            {showResults && (searchResults.length > 0 || isSearching) && (
              <Card className="absolute z-10 w-full mt-1">
                <ScrollArea className="max-h-[400px]">
                  {isSearching ? (
                    <div className="p-3 text-muted-foreground">Searching...</div>
                  ) : (
                    <div className="divide-y">
                      {searchResults.map((product) => (
                        <Button
                          key={product.id}
                          onClick={() => handleSelectProduct(product)}
                          variant="ghost"
                          className="w-full justify-between h-auto py-3 px-4"
                        >
                          <div className="text-left">
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              SKU: {product.sku} • Brand: {product.brand}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">₹{product.price}</div>
                            <div className="text-sm text-muted-foreground">{product.category.name}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </Card>
            )}
          </div>

          {selectedProductId && (
            <EditProduct productId={selectedProductId} />
          )}
        </div>
      )}
    </div>
  )
}