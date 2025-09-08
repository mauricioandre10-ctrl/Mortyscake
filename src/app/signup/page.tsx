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
import { CakeSlice } from "lucide-react"

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center py-12 px-4">
       <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center">
            <Link href="/" className="flex items-center gap-2 mb-4">
                <CakeSlice className="h-10 w-10 text-primary" />
            </Link>
            <h1 className="font-headline text-3xl font-bold">Create an Account</h1>
            <p className="text-muted-foreground">Join our community of passionate bakers.</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <form className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input id="full-name" placeholder="Morty Smith" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full mt-2">
                Create account
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline text-primary font-medium">
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
