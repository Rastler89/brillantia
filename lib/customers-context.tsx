"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type Customer = {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  notes?: string
  createdAt: string
  lastPurchase?: string // Fecha de la última compra
  totalPurchases: number // Total de compras realizadas
}

type CustomersContextType = {
  customers: Customer[]
  addCustomer: (customer: Omit<Customer, "id" | "createdAt" | "totalPurchases">) => void
  updateCustomer: (id: string, customer: Partial<Customer>) => void
  removeCustomer: (id: string) => void
  getCustomerById: (id: string) => Customer | undefined
  updateCustomerPurchase: (id: string, purchaseDate: string) => void
}

const CustomersContext = createContext<CustomersContextType | undefined>(undefined)

// Datos iniciales de ejemplo
const initialCustomers: Customer[] = [
  {
    id: "1",
    name: "María García",
    email: "maria@example.com",
    phone: "600123456",
    address: "Calle Principal 123, Madrid",
    notes: "Cliente habitual",
    createdAt: "2023-01-15T10:30:00Z",
    lastPurchase: "2023-05-15T10:30:00Z",
    totalPurchases: 3,
  },
  {
    id: "2",
    name: "Juan Rodríguez",
    email: "juan@example.com",
    phone: "611234567",
    createdAt: "2023-02-20T14:45:00Z",
    lastPurchase: "2023-04-10T15:20:00Z",
    totalPurchases: 1,
  },
  {
    id: "3",
    name: "Ana Martínez",
    phone: "622345678",
    address: "Avenida Central 45, Barcelona",
    createdAt: "2023-03-10T09:15:00Z",
    totalPurchases: 0,
  },
]

export function CustomersProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers)

  const addCustomer = (customer: Omit<Customer, "id" | "createdAt" | "totalPurchases">) => {
    const newCustomer: Customer = {
      ...customer,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      totalPurchases: 0,
    }
    setCustomers((prev) => [...prev, newCustomer])
  }

  const updateCustomer = (id: string, updatedCustomer: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((customer) => (customer.id === id ? { ...customer, ...updatedCustomer } : customer)),
    )
  }

  const removeCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((customer) => customer.id !== id))
  }

  const getCustomerById = (id: string) => {
    return customers.find((customer) => customer.id === id)
  }

  const updateCustomerPurchase = (id: string, purchaseDate: string) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === id
          ? {
              ...customer,
              lastPurchase: purchaseDate,
              totalPurchases: customer.totalPurchases + 1,
            }
          : customer,
      ),
    )
  }

  return (
    <CustomersContext.Provider
      value={{
        customers,
        addCustomer,
        updateCustomer,
        removeCustomer,
        getCustomerById,
        updateCustomerPurchase,
      }}
    >
      {children}
    </CustomersContext.Provider>
  )
}

export function useCustomers() {
  const context = useContext(CustomersContext)
  if (context === undefined) {
    throw new Error("useCustomers must be used within a CustomersProvider")
  }
  return context
}

