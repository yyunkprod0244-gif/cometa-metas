import { useRef } from 'react'

// Cena 3D feita só com CSS: planeta, anéis em órbita e um cometa.
// O ponteiro gira levemente a cena (paralaxe).
export function CenaCometa() {
  const cenaRef = useRef(null)

  function girar(evento) {
    const cena = cenaRef.current
    if (!cena) return
    const caixa = cena.getBoundingClientRect()
    const x = (evento.clientX - caixa.left) / caixa.width - 0.5
    const y = (evento.clientY - caixa.top) / caixa.height - 0.5
    cena.style.setProperty('--px', `${x * 24}deg`)
    cena.style.setProperty('--py', `${y * -18}deg`)
  }

  return (
    <div className="cena" ref={cenaRef} onPointerMove={girar} aria-hidden="true">
      <div className="cena__mundo">
        <div className="cena__planeta" />
        <div className="cena__orbita cena__orbita--1">
          <span className="cena__lua" />
        </div>
        <div className="cena__orbita cena__orbita--2">
          <span className="cena__lua cena__lua--pequena" />
        </div>
        <div className="cena__cometa">
          <span className="cena__cauda" />
          <span className="cena__nucleo" />
        </div>
      </div>
    </div>
  )
}
