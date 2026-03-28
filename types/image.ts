/**
 * Structure d'image simple retournée par file.resize() de Kirby.
 * Contient l'URL, la largeur et la hauteur de l'image redimensionnée.
 */
export type CMS_Image = {
  url: string
  width: number
  height: number
}

/**
 * Structure d'image avec variantes multiples (technique mssavocates).
 * Chaque variante est générée côté serveur via file.resize().
 *
 * Variantes :
 * - tiny: 50px, qualité 10 (placeholder ultra-léger ~1-3KB)
 * - small: 500px
 * - reg: 1280px (taille par défaut)
 * - large: 1920px (HD)
 * - xxl: 2500px (4K)
 *
 * Le focus point est récupéré via file.focus et peut être utilisé
 * directement avec object-position CSS (ex: "50% 30%")
 */
export type CMS_ImageObject = {
  alt: string | null
  tiny: CMS_Image
  small: CMS_Image
  reg: CMS_Image
  large: CMS_Image
  xxl: CMS_Image
  focus?: string | null
}

/**
 * Helper de type guard : vérifie si une valeur est un CMS_ImageObject
 */
export function isCMSImageObject(value: unknown): value is CMS_ImageObject {
  return (
    typeof value === 'object' &&
    value !== null &&
    'reg' in value &&
    typeof (value as CMS_ImageObject).reg?.url === 'string'
  )
}

/**
 * Extrait l'URL d'une image CMS_ImageObject (utilise la variante reg par défaut)
 */
export function getCMSImageSrc(image: CMS_ImageObject | null | undefined, variant: 'tiny' | 'small' | 'reg' | 'large' | 'xxl' = 'reg'): string {
  if (!image) return ''
  return image[variant]?.url ?? ''
}

/**
 * Structure d'image responsive retournée par le plugin Kirby historia/images.
 * @deprecated Utiliser CMS_ImageObject à la place
 *
 * Le backend ne sert JAMAIS l'URL originale du fichier brut (souvent 5–12 Mo).
 * À la place, chaque image passe par $file->historiaImage($preset) qui génère :
 *   - un fallback (jpeg/png) au format max du preset + srcset multi-largeurs
 *   - un srcset WebP (meilleure compression, supporté partout)
 *
 * Le composant <ResponsivePicture> consomme ce type directement.
 */
export type ResponsiveImage = {
  /** Texte alternatif de l'image */
  alt?: string

  /** Attribut sizes par défaut (peut être surchargé côté composant) */
  sizes?: string

  /** Métadonnées de l'image originale (debug / calcul ratio) */
  original?: {
    width?: number
    height?: number
    mime?: string
  }

  /** Fallback JPEG/PNG : src unique + srcset multi-largeurs */
  fallback: {
    src: string
    srcset?: string
    width?: number
    height?: number
  }

  /** Source WebP (meilleure compression, ~95 % de support navigateurs) */
  webp?: {
    srcset?: string
  }
}

/**
 * Helper de type guard : vérifie si une valeur est un objet ResponsiveImage
 * plutôt qu'une simple string URL (rétrocompatibilité).
 */
export function isResponsiveImage(value: unknown): value is ResponsiveImage {
  return (
    typeof value === 'object' &&
    value !== null &&
    'fallback' in value &&
    typeof (value as ResponsiveImage).fallback?.src === 'string'
  )
}

/**
 * Extrait l'URL de fallback d'une image, qu'elle soit au format
 * ResponsiveImage ou une simple string (rétrocompatibilité).
 */
export function getImageSrc(image: ResponsiveImage | string | null | undefined): string {
  if (!image) return ''
  if (typeof image === 'string') return image
  return image.fallback?.src ?? ''
}
