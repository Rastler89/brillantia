import { LoginForm } from "../components/login-form"
import { Diamond } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen">
      {/* Imagen y frase inspiradora */}
      <div className="hidden lg:flex lg:w-2/3 relative bg-black">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10"></div>
        <img
          src="/placeholder.svg?height=1080&width=1920"
          alt="Joyería elegante"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="relative z-20 flex flex-col justify-center items-start p-16 w-full">
          <Diamond className="h-16 w-16 text-primary mb-6" />
          <h1 className="text-5xl font-bold text-white mb-6 max-w-xl">Cada joya cuenta una historia única</h1>
          <p className="text-xl text-gray-300 max-w-xl">
            "La verdadera elegancia no es ser notado, es ser recordado."
            <span className="block mt-2 text-primary">— Giorgio Armani</span>
          </p>
        </div>
      </div>

      {/* Formulario de login */}
      <div className="w-full lg:w-1/3 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

