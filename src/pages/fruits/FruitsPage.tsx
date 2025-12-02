import React, { useState, useEffect, useCallback, KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import './FruitsPage.css'

interface FruitNutrition {
  calories?: number
  carbohydrates?: number
  protein?: number
  fat?: number
  sugar?: number
}

interface Fruit {
  id?: number
  name: string
  family?: string
  genus?: string
  order?: string
  nutritions?: FruitNutrition
}

const FruitsPage: React.FC = () => {
  const [fruits, setFruits] = useState<Fruit[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchText, setSearchText] = useState<string>('')
  const [filteredFruits, setFilteredFruits] = useState<Fruit[]>([])

  const PROXY_URL = 'https://api.allorigins.win/raw?url='
  const BASE_URL = 'https://www.fruityvice.com/api/fruit'

  const loadAllFruits = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const url = PROXY_URL + encodeURIComponent(BASE_URL + '/all')
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setFruits(data)
      setFilteredFruits(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  const searchFruits = useCallback(async () => {
    if (!searchText.trim()) {
      setFilteredFruits(fruits)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const url = PROXY_URL + encodeURIComponent(BASE_URL + '/all')
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const allFruits = await response.json()
      const foundFruits = allFruits.filter((fruit: Fruit) =>
        fruit.name.toLowerCase().includes(searchText.toLowerCase())
      )

      if (foundFruits.length === 0) {
        setError('No such fruit')
        setFilteredFruits([])
      } else {
        setFilteredFruits(foundFruits)
        setError(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      setFilteredFruits([])
    } finally {
      setLoading(false)
    }
  }, [searchText, fruits])

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      searchFruits()
    }
  }

  useEffect(() => {
    loadAllFruits()
  }, [loadAllFruits])

  const renderFruits = () => {
    if (loading) {
      return <div className="fruit_loading">Loading...</div>
    }

    if (error) {
      return <div className="fruit_error">{error}</div>
    }

    if (filteredFruits.length === 0) {
      return <div className="fruit_error">No fruits found</div>
    }

    return filteredFruits.map((fruit, index) => (
      <div key={fruit.id || index} className="fruit_card">
        <h2 className="fruit_name">{fruit.name || 'Unknown'}</h2>
        <p><strong>Family: </strong>{fruit.family || 'Unknown'}</p>
        <p><strong>Genus: </strong>{fruit.genus || 'Unknown'}</p>
        <p><strong>Order: </strong>{fruit.order || 'Unknown'}</p>
        
        {fruit.nutritions && (
          <>
            <p><strong>Calories: </strong>{fruit.nutritions.calories || 'Unknown'}</p>
            <p><strong>Carpohydrates: </strong>{fruit.nutritions.carbohydrates || 'Unknown'}</p>
            <p><strong>Proteins: </strong>{fruit.nutritions.protein || 'Unknown'}</p>
            <p><strong>Fats: </strong>{fruit.nutritions.fat || 'Unknown'}</p>
            <p><strong>Sugar: </strong>{fruit.nutritions.sugar || 'Unknown'}</p>
          </>
        )}
      </div>
    ))
  }

  return (
    <div className="fruits-page">
      <nav className="fruit_navigation">
        <Link to="/">Back to the main page</Link>
      </nav>

      <div className="fruit-start">
        <h1>🍎 Information about fruits</h1>
        
        <div className="search_fruit">
          <input
            type="text"
            id="search_input_fruit"
            placeholder="Enter fruit name..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button id="searchFruit" onClick={searchFruits}>
            Search
          </button>
          <button id="allFruits" onClick={loadAllFruits}>
            All fruits
          </button>
        </div>
        
        <div id="fruit_container" className="fruit_container">
          {renderFruits()}
        </div>
      </div>
    </div>
  )
}

export default FruitsPage