import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                AgriConnect: <span className="text-green-600">Waste to Worth</span>
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Connecting farmers and industries with waste buyers and recyclers to promote sustainable waste
                management and a circular economy.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  Get Started
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button size="lg" variant="outline">
                  Browse Marketplace
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img
              alt="AgriConnect Platform"
              className="aspect-video overflow-hidden rounded-xl object-cover object-center"
              src="img.png"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
