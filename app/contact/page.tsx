"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Mail, MapPin, Phone, MessageSquare, CheckCircle } from "lucide-react"
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient"

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    inquiryType: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormState((prev) => ({ ...prev, inquiryType: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.from("contact_messages").insert([
        {
          full_name: formState.name,
          email: formState.email,
          inquiry_type: formState.inquiryType,
          subject: formState.subject,
          message: formState.message,
        },
      ]);

      if (error) {
        console.error("Error inserting data:", error);
        alert("Failed to submit the form. Please try again.");
      } else {
        console.log("Data inserted successfully:", data);
        setIsSubmitted(true);
        setFormState({
          name: "",
          email: "",
          subject: "",
          message: "",
          inquiryType: "",
        });
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-green-50 py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Contact Us</h1>
              <p className="mt-4 text-gray-500 md:text-base">
                Have questions about AgriConnect? We're here to help. Reach out to our team for support, feedback, or
                partnership inquiries.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-3">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="mb-4 rounded-full bg-green-100 p-3">
                      <Phone className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="mb-2">Phone</CardTitle>
                    <CardDescription>You can contact us at</CardDescription>
                    <p className="mt-2 font-medium">+91 9182417917</p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, rotate: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="mb-4 rounded-full bg-green-100 p-3">
                      <Mail className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="mb-2">Email</CardTitle>
                    <CardDescription>We'll respond within 24 hours</CardDescription>
                    <p className="mt-2 font-medium">renukadarapureddy123@gmail.com </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, rotate: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="mb-4 rounded-full bg-green-100 p-3">
                      <MapPin className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="mb-2">College</CardTitle>
                    <CardDescription>Come say hello at our college</CardDescription>
                    <p className="mt-2 font-medium">Bhimavaram, Andhra Pradesh, India</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="bg-green-50 py-16">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Send us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="mb-4 rounded-full bg-green-100 p-3">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="mb-2 text-xl font-bold">Message Sent Successfully!</h3>
                      <p className="mb-6 text-gray-500">
                        Thank you for reaching out. We'll get back to you as soon as possible.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setIsSubmitted(false)}
                        className="bg-white hover:bg-gray-50"
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            name="name"
                            placeholder="Enter your full name"
                            value={formState.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email address"
                            value={formState.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="inquiryType">Inquiry Type</Label>
                        <Select value={formState.inquiryType} onValueChange={handleSelectChange} required>
                          <SelectTrigger id="inquiryType">
                            <SelectValue placeholder="Select inquiry type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="support">Technical Support</SelectItem>
                            <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          name="subject"
                          placeholder="How can we help you?"
                          value={formState.subject}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Please provide details about your inquiry..."
                          rows={5}
                          value={formState.message}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl">
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
                <p className="mt-4 text-gray-500">
                  Find answers to common questions about AgriConnect and our services.
                </p>
              </div>
              <div className="space-y-6">
                {[
                  {
                    question: "How does AgriConnect work?",
                    answer:
                      "AgriConnect is a platform that connects farmers and waste generators with buyers and recyclers. Sellers can list their agricultural or industrial waste, and buyers can browse and express interest in these listings. Once mutual interest is established, contact information is shared to facilitate the transaction.",
                  },
                  {
                    question: "Is there a fee to use AgriConnect?",
                    answer:
                      "Basic registration and listing on AgriConnect is free. We may offer premium features and services for a fee in the future, but our core functionality will always remain accessible to all users.",
                  },
                  {
                    question: "How is the quality of waste listings ensured?",
                    answer:
                      "Sellers are required to provide detailed information and images of their waste listings. We also have a rating and review system that allows buyers to share their experiences, helping to maintain quality standards across the platform.",
                  },
                  {
                    question: "Can I use AgriConnect on my mobile device?",
                    answer:
                      "Yes, AgriConnect is fully responsive and works on all devices, including smartphones and tablets. We're also developing a dedicated mobile app for an even better experience on mobile devices.",
                  },
                  {
                    question: "How can I become a partner with AgriConnect?",
                    answer:
                      "We're always open to partnerships that align with our mission of sustainable waste management. Please reach out to us through the contact form with details about your organization and partnership ideas.",
                  },
                ].map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="mt-1 rounded-full bg-green-100 p-1">
                            <MessageSquare className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <h3 className="mb-2 font-bold">{faq.question}</h3>
                            <p className="text-gray-500">{faq.answer}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-green-50 py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Get Started?</h2>
                <p className="mx-auto max-w-[700px] text-gray-500">
                  Join AgriConnect today and be part of the sustainable waste management revolution.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    Sign Up Now
                  </Button>
                </Link>
                <Link href="/marketplace">
                  <Button size="lg" variant="outline">
                    Browse Marketplace
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
