import Image from "next/image";

interface AuthLayoutProps {
    children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <main className="min-h-screen flex bg-background px-20 py-5">
            <section className="hidden flex-1 lg:flex justify-center">
                <div className="w-3/4 flex flex-col space-y-6">
                    <div className="flex items-center">
                        <Image
                            src="/assets/images/ChatGPTGenerateFLogo.png"
                            alt=""
                            width={40}
                            height={40}
                        />
                        <span className="
                        origin-left
                        bg-gradient-to-r
                        from-[var(--brand-gradient-start)]
                        to-[var(--brand-gradient-end)]
                        bg-clip-text
                        text-transparent
                        text-lg font-bold
                    ">
                            FilesManage
                        </span>
                    </div>
                    <div className="flex flex-col pl-2 gap-3">
                        <span className="text-4xl font-bold">
                            All your file,
                        </span>
                        <span className="
                    text-4xl font-bold
                    bg-gradient-to-r
                    from-[var(--brand-gradient-start)]
                    via-[var(--brand-gradient-middle)]
                    to-[var(--brand-gradient-end)]
                    bg-clip-text
                    text-transparent
                    "
                        >
                            organize & secure
                        </span>
                        <span className="text-sm">
                            Store, manage and access your file <br /> anytime, anywhere. Simple, fast and safe.
                        </span>
                    </div>
                    <Image
                        src="/assets/images/ChatGPTGenerateIllustration.png"
                        alt=""
                        width={600}
                        height={600}
                    />
                </div>
            </section>

            <section className="flex flex-1 items-center justify-center">
                <div className="w-2/3 bg-card p-8 shadow-[0_2px_12px_2px_rgba(0,0,0,0.08)] rounded-lg">
                    {children}
                </div>
            </section>
        </main>
    );
}