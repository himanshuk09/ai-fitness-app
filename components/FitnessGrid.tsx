import Image from "next/image";
export function FitnessGrid({ section }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {section.items.map((item: any) => (
        <div
          key={item.name}
          className="relative h-60 overflow-hidden rounded-lg shadow-lg group"
        >
          {/* Image Wrapper with Proper Fill */}
          <div className="relative w-full h-full">
            <Image
              src={item.img} // Use dynamic image path
              alt={item.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover grayscale-0 transition-all duration-300 transform scale-100 group-hover:scale-110 group-hover:grayscale-0"
            />
          </div>

          {/* Overlay with Text */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 bg-opacity-60 text-white text-xl font-semibold">
            {item.name}
          </div>
        </div>
      ))}
    </div>
  );
}
