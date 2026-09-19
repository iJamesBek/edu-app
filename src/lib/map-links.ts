/** Every outbound map / taxi URL for one point, shared by pages, components and JSON-LD. */
export function mapLinks(geo: { lat: number; lng: number }) {
  const { lat, lng } = geo;
  return {
    // Yandex map widget takes "lon,lat"
    yandexEmbed: `https://yandex.uz/map-widget/v1/?ll=${lng}%2C${lat}&z=16&pt=${lng}%2C${lat}%2Cpm2rdm`,
    googleEmbed: `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`,
    // Yandex Go deep link (AppMetrica redirect from Yandex's docs): opens the app, or taxi.yandex in a browser
    taxi: `https://3.redirect.appmetrica.yandex.com/route?end-lat=${lat}&end-lon=${lng}&ref=itshaharcha&appmetrica_tracking_id=1178268795219780156`,
    routeYandex: `https://yandex.uz/maps/?rtext=~${lat}%2C${lng}&rtt=auto`,
    routeGoogle: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
    googlePlace: `https://www.google.com/maps?q=${lat},${lng}`,
  };
}
