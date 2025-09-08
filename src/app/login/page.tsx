import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CakeSlice } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center">
            <Link href="/" className="flex items-center gap-2 mb-4">
                <CakeSlice className="h-10 w-10 text-primary" />
            </Link>
            <h1 className="font-headline text-3xl font-bold">Welcome Back!</h1>
            <p className="text-muted-foreground">Enter your credentials to access your courses.</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <form className="grid gap-4">
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
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm text-muted-foreground hover:text-primary underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full mt-2">
                Login
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline text-primary font-medium">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
