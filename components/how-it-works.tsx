export function HowItWorks() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-600">Process</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How AgriConnect Works</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform makes it easy to connect waste generators with waste users in just a few simple steps.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
          <div className="flex flex-col items-center space-y-2 rounded-lg border bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl font-bold text-green-600">
              1
            </div>
            <h3 className="text-xl font-bold">Register & Create Profile</h3>
            <p className="text-center text-gray-500">
              Sign up as a farmer/seller or buyer/industry and set up your profile with relevant details.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl font-bold text-green-600">
              2
            </div>
            <h3 className="text-xl font-bold">List or Browse Waste</h3>
            <p className="text-center text-gray-500">
              Sellers can list available waste with details, while buyers can browse and filter listings.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl font-bold text-green-600">
              3
            </div>
            <h3 className="text-xl font-bold">Express Interest & Connect</h3>
            <p className="text-center text-gray-500">
              Buyers express interest, and once mutual interest is established, contact details are shared.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border bg-white p-6 shadow-sm md:col-span-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl font-bold text-green-600">
              4
            </div>
            <h3 className="text-xl font-bold">Complete Transaction</h3>
            <p className="text-center text-gray-500">
              Finalize the transaction offline, and sellers can mark listings as sold once completed.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
