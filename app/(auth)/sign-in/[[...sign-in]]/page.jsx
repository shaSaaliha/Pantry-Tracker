import { SignIn } from "@clerk/nextjs";
import Image from 'next/image'

export default function Page() {
  return (

    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">

          <Image
            alt=""
            src="https://png.pngtree.com/background/20230614/original/pngtree-an-illustration-of-a-pantry-with-pots-and-dishes-picture-image_3491498.jpg"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0"
          />

        </aside>

        <main
          className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
        >
          <div className="max-w-xl lg:max-w-3xl">
            <a className="block text-blue-600" href="#">
              <span className="sr-only">Home</span>
              <svg
                id="logo-15"
                width="49"
                height="48"
                viewBox="0 0 49 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M24.5 12.75C24.5 18.9632 19.4632 24 13.25 24H2V12.75C2 6.53679 7.03679 1.5 13.25 1.5C19.4632 1.5 24.5 6.53679 24.5 12.75Z" class="ccustom" fill="#17CF97"></path> <path d="M24.5 35.25C24.5 29.0368 29.5368 24 35.75 24H47V35.25C47 41.4632 41.9632 46.5 35.75 46.5C29.5368 46.5 24.5 41.4632 24.5 35.25Z"
                  class="ccustom"
                  fill="#17CF97">
                </path>
                <path d="M2 35.25C2 41.4632 7.03679 46.5 13.25 46.5H24.5V35.25C24.5 29.0368 19.4632 24 13.25 24C7.03679 24 2 29.0368 2 35.25Z" class="ccustom" fill="#17CF97"></path> <path d="M47 12.75C47 6.53679 41.9632 1.5 35.75 1.5H24.5V12.75C24.5 18.9632 29.5368 24 35.75 24C41.9632 24 47 18.9632 47 12.75Z" class="ccustom" fill="#17CF97"></path>
              </svg>
            </a>

            <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
              Welcome to Pantry Tracker
            </h1>

            <p className="mt-4 leading-relaxed text-gray-500">

            </p>
            <SignIn />
          </div>
        </main>
      </div>
    </section>
  )
}