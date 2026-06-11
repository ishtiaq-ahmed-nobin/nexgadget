import { Link } from 'react-router-dom'

export default function HeroBanner({ title, subtitle, btnText, btnLink, image, height = 'h-[400px]' }) {
  return (
    <section className={`relative ${height} flex items-center overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-r from-[#2e1c2b] via-[#4a1942] to-[#7c3aed] opacity-90"></div>
      {image && (
        <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30" />
      )}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
            {title}
          </h1>
          {subtitle && <p className="text-lg md:text-xl text-gray-200 mb-8">{subtitle}</p>}
          {btnText && btnLink && (
            <Link
              to={btnLink}
              className="inline-block px-8 py-3 bg-white text-[#2e1c2b] font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              {btnText}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
