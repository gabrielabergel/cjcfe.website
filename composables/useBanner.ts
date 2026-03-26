// Composable pour gérer l'état du bandeau défilant
export const useBanner = () => {
  const hasBanner = useState('hasBanner', () => false)
  const bannerHeight = 34 // hauteur du bandeau en px

  const setBanner = (value: boolean) => {
    hasBanner.value = value
  }

  return {
    hasBanner,
    bannerHeight,
    setBanner,
  }
}
