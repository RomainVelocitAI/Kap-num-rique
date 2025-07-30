export default function HeroStatic() {
  return (
    <div className="hero-container relative min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="hero-content relative z-10">
        <div className="hero-title text-[#DC143C]">
          CAPTIVEZ
        </div>
        
        <div className="hero-subtitle text-white">
          <p className="subtitle-line">
            Un site sur mesure qui reflète votre excellence
          </p>
          <p className="subtitle-line">
            Design premium, expérience inoubliable
          </p>
        </div>
      </div>

      <div className="scroll-progress">
        <div className="scroll-text">SCROLL</div>
        <div className="progress-track">
          <div className="progress-fill w-0" />
        </div>
        <div className="section-counter">00 / 02</div>
      </div>
    </div>
  )
}