import Image from "next/image";

interface AuthLayoutProps {
    children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <main className="min-h-screen flex justify-between items-center">
            <section className="hidden flex-1 lg:flex items-center justify-center">
                <Image
                    src="/assets/images/ChatGPTGenerateIllustration.png"
                    alt=""
                    width={600}
                    height={600}
                />
            </section>

            <section className="flex flex-1 items-center justify-center py-10">
                {children}
            </section>
        </main>
    );
}