import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image";

export default function SignupPage() {
  return (
    <div className="w-full flex justify-center items-center py-12 px-4 md:px-6">
       <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center">
            <Link href="/" className="flex items-center gap-2 mb-4">
                 <Image src="/image/Logo_mortys_cake.webp" alt="Pastelería de Morty" width={180} height={64} className="object-contain" />
            </Link>
            <h1 className="font-headline text-3xl font-bold">Crear una Cuenta</h1>
            <p className="text-muted-foreground">Únete a nuestra comunidad de apasionados reposteros.</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <form className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="full-name">Nombre Completo</Label>
                <Input id="full-name" placeholder="Morty Smith" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@ejemplo.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full mt-2">
                Crear cuenta
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="underline text-primary font-medium">
                Iniciar Sesión
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
