export function Testimonials() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-600">Testimonials</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Success Stories from Our Community
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Hear from farmers and businesses who have transformed waste into worth with AgriConnect.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col justify-between space-y-4 rounded-lg border p-6 shadow-sm">
            <div className="space-y-2">
              <p className="text-gray-500">
                "AgriConnect has transformed how we handle agricultural waste. We now earn additional income from what
                we used to discard."
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-gray-100 p-1">
                <div className="h-8 w-8 rounded-full bg-gray-300" />
              </div>
              <div>
                <p className="text-sm font-medium">Rajesh Kumar</p>
                <p className="text-xs text-gray-500">Organic Farmer, Karnataka</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between space-y-4 rounded-lg border p-6 shadow-sm">
            <div className="space-y-2">
              <p className="text-gray-500">
                "As a paper manufacturer, finding consistent sources of agricultural waste was challenging until we
                discovered AgriConnect."
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-gray-100 p-1">
                <div className="h-8 w-8 rounded-full bg-gray-300" />
              </div>
              <div>
                <p className="text-sm font-medium">Priya Sharma</p>
                <p className="text-xs text-gray-500">EcoPaper Industries, Delhi</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between space-y-4 rounded-lg border p-6 shadow-sm">
            <div className="space-y-2">
              <p className="text-gray-500">
                "The platform's map feature helps us find nearby waste sources, significantly reducing our
                transportation costs and carbon footprint."
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-gray-100 p-1">
                <div className="h-8 w-8 rounded-full bg-gray-300" />
              </div>
              <div>
                <p className="text-sm font-medium">Anand Patel</p>
                <p className="text-xs text-gray-500">GreenFuel Biogas, Gujarat</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
