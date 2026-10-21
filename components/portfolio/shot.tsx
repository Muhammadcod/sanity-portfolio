import Image from "next/image"
import s from "./portfolio.module.css"

interface ShotProps {
  src?: string
  alt: string
  /** Shown in the empty state until a real image is supplied. */
  label: string
  /** Use the darker label colour when the slot sits on a paper background. */
  light?: boolean
  sizes?: string
}

export function Shot({ src, alt, label, light, sizes = "100vw" }: ShotProps) {
  if (src) {
    return (
      <div className={s.shot}>
        <Image src={src} alt={alt} fill sizes={sizes} />
      </div>
    )
  }
  return (
    <div className={`${s.shot} ${s.shotEmpty} ${light ? s.shotEmptyLight : ""}`} role="img" aria-label={alt}>
      {label}
    </div>
  )
}
