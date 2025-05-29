import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Leaf, Recycle, Users, BarChart, Globe } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-green-50 py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    About <span className="text-green-600">AgriConnect</span>
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Transforming agricultural and industrial waste into valuable resources through sustainable
                    connections.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  alt="AgriConnect Team"
                  className="aspect-video overflow-hidden rounded-xl object-cover object-center"
                  src="/placeholder.svg?height=550&width=800"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <Leaf className="h-6 w-6 text-green-600" />
                  </div>
                  <h2 className="mb-4 text-2xl font-bold">Our Mission</h2>
                  <p className="text-gray-500">
                    AgriConnect aims to revolutionize waste management in the agricultural and industrial sectors by
                    creating a seamless marketplace that connects waste generators with potential users. We strive to
                    reduce environmental impact, promote sustainable practices, and create economic opportunities for
                    farmers and businesses alike.
                  </p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <Globe className="h-6 w-6 text-green-600" />
                  </div>
                  <h2 className="mb-4 text-2xl font-bold">Our Vision</h2>
                  <p className="text-gray-500">
                    We envision a future where agricultural and industrial waste is no longer seen as a burden but as a
                    valuable resource in a circular economy. AgriConnect aspires to be the leading platform that
                    facilitates this transformation, creating a world where waste is minimized, resources are optimized,
                    and sustainable practices are the norm.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="bg-green-50 py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold">Our Story</h2>
              <p className="mb-8 text-gray-500">
                AgriConnect was founded in 2023 by a team of agricultural experts, environmental scientists, and
                technology innovators who recognized the immense potential in agricultural waste. What began as a small
                pilot project in rural communities has now grown into a comprehensive platform serving farmers and
                industries across the country.
              </p>
              <p className="mb-8 text-gray-500">
                Our founders witnessed firsthand the challenges farmers faced in disposing of agricultural waste, while
                simultaneously observing industries struggling to find sustainable raw materials. This disconnect
                inspired the creation of AgriConnect – a platform that bridges this gap and transforms waste management
                into a win-win situation for all stakeholders.
              </p>
              <p className="text-gray-500">
                Today, AgriConnect continues to grow, driven by our commitment to sustainability, innovation, and
                community empowerment. We're proud of the positive environmental impact we've made and the economic
                opportunities we've created for our users.
              </p>
            </div>
          </div>
        </section>

        {/* Impact */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold">Our Impact</h2>
              <p className="mx-auto mt-4 max-w-[700px] text-gray-500">
                AgriConnect is making a significant difference in waste management and sustainability efforts.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <Recycle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Environmental Impact</h3>
                  <p className="text-gray-500">
                    Over 10,000 tons of agricultural waste diverted from landfills and repurposed for sustainable use,
                    reducing greenhouse gas emissions and environmental pollution.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Community Impact</h3>
                  <p className="text-gray-500">
                    Supporting over 5,000 farmers and 500 businesses in creating sustainable waste management solutions
                    and additional income streams from previously discarded materials.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <BarChart className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Economic Impact</h3>
                  <p className="text-gray-500">
                    Generated over ₹50 million in additional revenue for farmers and saved industries approximately ₹30
                    million in raw material costs through our waste exchange platform.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="bg-green-50 py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold">Our Team</h2>
              <p className="mx-auto mt-4 max-w-[700px] text-gray-500">
                Meet the dedicated professionals behind AgriConnect who are passionate about sustainable waste
                management.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[
                {
                  name: "Dr. Anita Sharma",
                  role: "Founder & CEO",
                  bio: "Agricultural scientist with 15+ years of experience in sustainable farming practices.",
                },
                {
                  name: "Rajiv Patel",
                  role: "CTO",
                  bio: "Tech innovator with expertise in building scalable platforms for rural communities.",
                },
                {
                  name: "Meera Krishnan",
                  role: "Head of Operations",
                  bio: "Supply chain expert specializing in agricultural logistics and waste management.",
                },
                {
                  name: "Vikram Singh",
                  role: "Environmental Specialist",
                  bio: "Environmental engineer focused on maximizing the sustainable reuse of agricultural waste.",
                },
              ].map((member, index) => (
                <Card key={index}>
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full bg-gray-200">
                      <img
                        src={`/placeholder.svg?height=96&width=96&text=${member.name.charAt(0)}`}
                        alt={member.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <h3 className="mb-1 text-lg font-bold">{member.name}</h3>
                    <p className="mb-2 text-sm text-green-600">{member.role}</p>
                    <p className="text-sm text-gray-500">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Join the AgriConnect Community
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Be part of the solution. Start turning waste into worth today.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    Get Started
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
