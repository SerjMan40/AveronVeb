import './ProjectPreview.scss'

export function ProjectPreview({ kind, large = false }: { kind: string; large?: boolean }) {
  return (
    <div className={`project-art project-art--${kind}${large ? ' project-art--large' : ''}`} aria-hidden="true">
      <div className="project-art__browser"><i /><i /><i /><span>averon / concept</span></div>
      <div className="project-art__canvas">
        {kind === 'stay' && <><div className="project-art__sun" /><div className="project-art__headline">SLOW<br />DOWN</div><div className="project-art__landscape"><b /><i /></div><div className="project-art__pill" /></>}
        {kind === 'studio' && <><div className="project-art__studio-mark">ST<span>+</span></div><div className="project-art__studio-copy"><i /><i /><i /></div><div className="project-art__studio-block"><b /><i /></div></>}
        {kind === 'shop' && <><div className="project-art__shop-top"><i /><i /><i /></div><div className="project-art__shop-title" /><div className="project-art__products"><i /><i /><i /></div></>}
      </div>
    </div>
  )
}
