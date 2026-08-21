import AuthIllustration from "./auth-illustration"

interface AuthLayoutProps {
    children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <main className="min-h-screen grid lg:grid-cols-2">
            <AuthIllustration />

            <div className="flex items-center justify-center px-6 py-10">
                {children}
            </div>
        </main>
    )
}