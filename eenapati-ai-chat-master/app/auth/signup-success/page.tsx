import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Sparkles } from "lucide-react"
import Link from "next/link"

export default function SignupSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-accent-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Check your email</h1>
          <p className="text-muted-foreground">We've sent you a verification link</p>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Almost there!</CardTitle>
            <CardDescription>
              Please check your email and click the verification link to complete your registration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-3 h-3 text-accent-foreground" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-foreground mb-1">What's next?</p>
                  <p className="text-muted-foreground">
                    Click the verification link in your email to activate your EENAPATI account and start chatting with
                    AI.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Didn't receive the email? Check your spam folder or try signing up again.
              </p>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/auth/login">Back to Sign In</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
