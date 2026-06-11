export default function SectionTitle({ title, subtitle, light }) {
  return (
    <div className="text-center mb-10">
      <h2 className={`text-3xl md:text-4xl font-bold mb-3 ${light ? 'text-white' : ''}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-lg max-w-2xl mx-auto ${light ? 'text-gray-300' : 'text-gray-500'}`}>
          {subtitle}
        </p>
      )}
      <div className="flex justify-center mt-4">
        <span className="inline-block w-16 h-1 bg-[#7c3aed] rounded-full"></span>
      </div>
    </div>
  )
}
