import Image from "next/image"
import { cn } from "@/lib/utils"
import { ReactNode } from "react";

interface SharedLayoutProps {
  children: ReactNode;
  variant?: 'default' | 'blur';
}

const SharedLayout = ({ children, variant = 'default' }: SharedLayoutProps) => {
  const bgContainerClasses = cn(
    "relative h-full w-full",
    variant === 'blur' && "lg:opacity-30"
  )

  const shoeImageClasses = cn(
    "object-contain transform transition-transform duration-500",
    variant === 'default' && "scale-75 -rotate-12 hover:rotate-0 lg:scale-100",
    variant === 'blur' && "scale-75 -rotate-12 lg:scale-100"
  )

  const mainContentClasses = cn(
    "relative z-10",
    variant === 'default' && "w-full flex flex-col lg:max-w-4xl lg:grid lg:grid-cols-2 gap-8 items-start lg:items-center",
    variant === 'blur' && "w-full max-w-5xl mx-auto"
  )

  const imageWrapperClasses = cn(
    variant === 'default' && "relative w-full h-[250px] lg:h-[400px] lg:col-start-1 lg:row-start-1",
    variant === 'blur' && "fixed inset-0 w-full h-full lg:blur-sm pointer-events-none"
  )

  const blurContainerClasses = cn(
    variant === 'blur' && "absolute inset-0 w-full h-full flex items-start lg:items-center justify-center"
  )

  return (
    <div className="min-h-screen bg-gradient-to-tl from-black to-gray-600 flex flex-col items-start lg:items-center justify-start lg:justify-center p-4 pt-6 relative overflow-hidden">
      <div className={mainContentClasses}>
        {/* Image container with controlled sizing */}
        <div className={imageWrapperClasses}>
          {variant === 'blur' ? (
            <div className={blurContainerClasses}>
              <div className="relative w-full max-w-2xl h-[250px] lg:h-[400px]">
                <div className={bgContainerClasses}>
                  <Image
                    src="/shoe.png"
                    alt="Athletic shoe"
                    fill
                    className={shoeImageClasses}
                    priority
                  />
                  <div className="absolute top-0 left-0 transform -translate-x-1/4 -translate-y-1/4 opacity-50">
                    <Image
                      src="/Union.png"
                      alt="Decorative element"
                      width={200}
                      height={200}
                      className="object-contain scale-75 lg:scale-100"
                      priority
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 w-full opacity-60">
                    <Image
                      src="/Elipse.png"
                      alt="Decorative element"
                      width={500}
                      height={80}
                      className="object-contain scale-75 lg:scale-100"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={bgContainerClasses}>
              <Image
                src="/shoe.png"
                alt="Athletic shoe"
                fill
                className={shoeImageClasses}
                priority
              />
              <div className="absolute top-0 left-0 transform -translate-x-1/4 -translate-y-1/4 opacity-50">
                <Image
                  src="/Union.png"
                  alt="Decorative element"
                  width={250}
                  height={250}
                  className="object-contain scale-75 lg:scale-100"
                  priority
                />
              </div>
              <div className="absolute bottom-0 left-0 w-full opacity-60">
                <Image
                  src="/Elipse.png"
                  alt="Decorative element"
                  width={700}
                  height={100}
                  className="object-contain scale-75 lg:scale-100"
                  priority
                />
              </div>
            </div>
          )}
        </div>

        {/* Content container */}
        <div className={cn(
          "relative z-20 w-full",
          variant === 'default' && "lg:col-start-2 lg:row-start-1 p-6 lg:p-9 rounded-lg",
          variant === 'blur' && "w-full"
        )}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default SharedLayout;