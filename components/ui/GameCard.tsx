import Image from "next/image"

interface GameCardProps {
  imageSrc: string
  name: string
  description: string
  alt?: string
}

export default function GameCard({ imageSrc, name, description, alt }: GameCardProps) {
  return (
    <div className="flex-shrink-0 w-64">
      <div className="game-card-bg rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
        <div className="w-20 h-20 mx-auto mb-4 rounded-xl overflow-hidden bg-gray-100">
          <Image
            src={imageSrc}
            alt={alt || name}
            width={80}
            height={80}
            className="object-cover w-full h-full"
          />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{name}</h3>
        <p className="text-sm text-gray-100">{description}</p>
      </div>
    </div>
  )
} 