import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-rose-50 py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-rose-500 mb-8 text-center">Contact Us</h1>

        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <form className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input id="name" placeholder="Your name" className="rounded-lg" />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input id="email" type="email" placeholder="your.email@example.com" className="rounded-lg" />
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject
              </label>
              <Input id="subject" placeholder="How can we help you?" className="rounded-lg" />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <Textarea id="message" placeholder="Your message..." className="rounded-lg min-h-[150px]" />
            </div>

            <Button type="submit" className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-full py-6">
              Send Message
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Email Us</h3>
                <p className="text-gray-600">contact@gametamin.com</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Visit Us</h3>
                <p className="text-gray-600">
                  123 Game Street
                  <br />
                  Singapore 123456
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/">
              <Button variant="outline" className="text-rose-500 border-rose-500 hover:bg-rose-50 rounded-full">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
