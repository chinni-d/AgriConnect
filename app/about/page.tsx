"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Leaf, Recycle, Users, BarChart, Globe } from "lucide-react"
import { motion } from "framer-motion";

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
                  <p className="max-w-[600px] text-gray-500 md:text-base/relaxed lg:text-base/relaxed xl:text-base/relaxed">
                    Transforming agricultural and industrial waste into valuable resources through sustainable
                    connections.
                  </p>
                </div>
              </div>
              {/* <div className="flex items-center justify-center">
                <img
                  alt="AgriConnect Team"
                  className="aspect-video overflow-hidden rounded-xl object-cover object-center"
                  src="/placeholder.svg?height=550&width=800"
                />
              </div> */}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <motion.div
                className="overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.8 }}
              >
                <Card>
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
              </motion.div>
              <motion.div
                className="overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.8 }}
              >
                <Card>
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
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="bg-green-50 py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold">Our Story</h2>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.6 }}
              >
                <p className="mb-8 text-gray-500">
                  AgriConnect was founded in 2023 by a team of agricultural experts, environmental scientists, and
                  technology innovators who recognized the immense potential in agricultural waste. What began as a small
                  pilot project in rural communities has now grown into a comprehensive platform serving farmers and
                  industries across the country.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <p className="mb-8 text-gray-500">
                  Our founders witnessed firsthand the challenges farmers faced in disposing of agricultural waste, while
                  simultaneously observing industries struggling to find sustainable raw materials. This disconnect
                  inspired the creation of AgriConnect – a platform that bridges this gap and transforms waste management
                  into a win-win situation for all stakeholders.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <p className="text-gray-500">
                  Today, AgriConnect continues to grow, driven by our commitment to sustainability, innovation, and
                  community empowerment. We're proud of the positive environmental impact we've made and the economic
                  opportunities we've created for our users.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

     

        {/* Team */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold">Our Team</h2>
              <p className="mx-auto mt-4 max-w-[700px] text-gray-500">
                Meet the dedicated professionals behind AgriConnect who are passionate about sustainable waste
                management.
              </p>
            </div>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {[
                {
                  name: "Renuka Darapureddy",
                  role: "Data Science & AI Developer",
                  bio: "Enthusiast in Data Science and Artificial Intelligence with a passion for learning and innovation. Keen on exploring data-driven solutions and intelligent technologies to solve real-world problems.",
                  image: "renu.png",
                },
                {
                  name: "Garlapati Priya sri",
                  role: "Web Developer",
                  bio: "Passionate about Web Development with a focus on creating responsive and user-friendly websites. Interested in building dynamic web applications using modern tools and technologies.",
                  image: "priya.jpg",
                },
                {
                  name: "G.Pujitha",
                  role: "Cloud Computing Developer",
                  bio: "Enthusiastic about Cloud Computing and its role in scalable, on-demand technology solutions. Interested in learning cloud platforms and deploying efficient, secure cloud-based applications.",
                  image: "pujitha.jpg",
                },
                {
                  name: "Madakam Bindu Madhavi",
                  role: "Full Stack Developer",
                  bio: "Passionate about Web Development and Data Science, with a drive to build intelligent, data-driven web applications.",
                  image: "bindu.jpg",
                },
                {
                  name: "Gangavarapu Jaya Sri Durga",
                  role: "Data Analytics Developer",
                  bio: "Interested in Data Analytics with a passion for uncovering insights through data exploration and visualization.",
                  image: "jaya.jpg",
                },
              ].map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  whileHover={{ scale: 1.03, rotate: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.2 }}
                  className="group"
                >
                  <Card className="h-[400px] max-w-full overflow-hidden bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6 text-center h-full flex flex-col">
                      {/* Profile Image */}
                      <div className="mx-auto mb-4 flex-shrink-0">
                        <div className="h-20 w-20 overflow-hidden rounded-full bg-gray-100 ring-2 ring-gray-200 group-hover:ring-green-400 transition-all duration-300">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.svg?height=80&width=80';
                            }}
                          />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 break-words">
                          {member.name}
                        </h3>
                        
                        <div className="mb-3">
                          <span className="inline-block px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                            {member.role}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 leading-relaxed flex-1">
                          {member.bio}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Join the AgriConnect Community
                </h2>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-base/relaxed lg:text-base/relaxed xl:text-base/relaxed">
                  Be part of the solution. Start turning waste into worth today.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
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
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
