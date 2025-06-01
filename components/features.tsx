"use client"
import { Leaf, Recycle, MapPin, ShoppingCart, Users } from "lucide-react"
import { motion } from "framer-motion";

export function Features() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-600">Features</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Everything You Need for Sustainable Waste Management
            </h2>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <motion.div
            className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            whileHover={{ scale: 1.05, rotate: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="rounded-full bg-green-100 p-3">
              <Leaf className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold">Waste Upload System</h3>
            <p className="text-center text-gray-500">
              Easily upload waste details including type, quantity, photos, and location with our intuitive interface.
            </p>
          </motion.div>
          <motion.div
            className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            whileHover={{ scale: 1.05, rotate: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="rounded-full bg-green-100 p-3">
              <Recycle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold">Smart Browsing & Filtering</h3>
            <p className="text-center text-gray-500">
              Find exactly what you need with advanced filters for waste type, quantity, and location.
            </p>
          </motion.div>
          <motion.div
            className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            whileHover={{ scale: 1.05, rotate: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="rounded-full bg-green-100 p-3">
              <MapPin className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold">Location Mapping</h3>
            <p className="text-center text-gray-500">
              Integrated Google Maps API shows the distance between buyers and sellers for efficient logistics.
            </p>
          </motion.div>
          <motion.div
            className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            whileHover={{ scale: 1.05, rotate: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="rounded-full bg-green-100 p-3">
              <ShoppingCart className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold">Interest Tracker</h3>
            <p className="text-center text-gray-500">
              Express interest in listings and track real-time interest counts on your own waste listings.
            </p>
          </motion.div>
          <motion.div
            className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            whileHover={{ scale: 1.05, rotate: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="rounded-full bg-green-100 p-3">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold">Role-Based Access</h3>
            <p className="text-center text-gray-500">
              Customized dashboards and features for farmers/sellers and buyers/industries.
            </p>
          </motion.div>
          <motion.div
            className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            whileHover={{ scale: 1.05, rotate: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="rounded-full bg-green-100 p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-green-600"
              >
                <path d="M17 18a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v12Z" />
                <path d="M12 9v4" />
                <path d="M10 11h4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold">Direct Contact Module</h3>
            <p className="text-center text-gray-500">
              Contact information is revealed only after mutual interest is established between parties.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
