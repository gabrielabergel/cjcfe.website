// Récupère automatiquement, depuis l'API Hebcal (géolocalisée sur Clermont-Ferrand) :
//  - le prochain Shabbat (paracha, allumage des bougies, havdalah)
//  - le prochain événement à venir (yom tov ou jeûne), avec heure de début/fin
// Doc: https://www.hebcal.com/home/195/jewish-calendar-rest-api
//
// Tout est calculé à partir d'un seul appel /hebcal sur une plage de dates explicite.
// (L'ancien appel à /shabbat dépendait de la date "du jour" côté Hebcal et pouvait
// renvoyer la havdalah d'une fête précédente, ex. Sim'hat Torah, comme fin de Shabbat.)

// GeoNames ID de Clermont-Ferrand (Europe/Paris)
const GEONAME_ID = 3024635
// Fenêtre de recherche de la prochaine fête (assez large pour toujours en trouver une,
// le plus long intervalle entre deux yom tov étant ~6 mois)
const FETE_RECHERCHE_JOURS = 400

// Mapping des noms de paracha Hebcal (anglais) -> libellé français utilisé sur le site
const PARACHA_FR: Record<string, string> = {
  Bereshit: 'Bereshit',
  Noach: 'Noah',
  'Lech-Lecha': 'Lekh Lekha',
  Vayera: 'Vayera',
  'Chayei Sara': 'Hayé Sarah',
  Toldot: 'Toledot',
  Vayetzei: 'Vayétsé',
  Vayishlach: 'Vayishlah',
  Vayeshev: 'Vayeshev',
  Miketz: 'Mikkets',
  Vayigash: 'Vayigash',
  Vayechi: 'Vayehi',
  Shemot: 'Shemot',
  Vaera: 'Vaéra',
  Bo: 'Bo',
  Beshalach: 'Beshalah',
  Yitro: 'Yitro',
  Mishpatim: 'Mishpatim',
  Terumah: 'Terouma',
  Tetzaveh: 'Tetsavé',
  'Ki Tisa': 'Ki Tissa',
  Vayakhel: 'Vayakhel',
  Pekudei: 'Pekoudé',
  Vayikra: 'Vayikra',
  Tzav: 'Tsav',
  Shmini: 'Shemini',
  Tazria: 'Tazria',
  Metzora: 'Metsora',
  'Achrei Mot': 'Aharé Mot',
  Kedoshim: 'Kedoshim',
  Emor: 'Emor',
  Behar: 'Behar',
  Bechukotai: 'Behoukotaï',
  Bamidbar: 'Bamidbar',
  Nasso: 'Nasso',
  "Beha'alotcha": 'Behaalotekha',
  "Sh'lach": 'Shelah Lekha',
  Korach: 'Korah',
  Chukat: 'Houkat',
  Balak: 'Balak',
  Pinchas: "Pin'has",
  Matot: 'Matot',
  Masei: 'Massé',
  Devarim: 'Devarim',
  Vaetchanan: "Vaet'hanan",
  Eikev: 'Ekev',
  "Re'eh": 'Reé',
  Shoftim: 'Shoftim',
  'Ki Teitzei': 'Ki Tétsé',
  'Ki Tavo': 'Ki Tavo',
  Nitzavim: 'Nitsavim',
  Vayeilech: 'Vayélekh',
  "Ha'azinu": 'Haazinou',
  'Vezot Haberakhah': 'Vezot Haberakha',
}

// Fêtes juives (yom tov) : détection par mot-clé dans le nom Hebcal -> libellé français
const FETE_FR: Array<[string, string]> = [
  ['Rosh Hashana', 'Roch Hachana'],
  ['Yom Kippur', 'Yom Kippour'],
  ['Sukkot', 'Souccot'],
  ['Shmini Atzeret', 'Chemini Atseret'],
  ['Simchat Torah', "Sim'hat Torah"],
  ['Pesach', 'Pessah'],
  ['Shavuot', 'Chavouot'],
]

// Traduit un nom de paracha Hebcal en français (gère les parachot doubles "Matot-Masei")
function translateParacha(name: string | undefined): string | null {
  if (!name) return null
  return name
    .split('-')
    .map((part) => PARACHA_FR[part.trim()] || part.trim())
    .join('-')
}

// Déduit le libellé français d'une fête à partir du mémo Hebcal (ex. "Erev Rosh Hashana")
function feteName(memo: string | undefined): string {
  if (!memo) return 'Fête'
  for (const [en, fr] of FETE_FR) {
    if (memo.includes(en)) return fr
  }
  return memo.replace(/^Erev\s+/, '').replace(/\s+\d.*$/, '')
}

// Jeûnes juives : détection par mot-clé dans le mémo Hebcal -> libellé français
const JEUNE_FR: Array<[string, string]> = [
  ['Gedaliah', 'Jeûne de Guedalia'],
  ['Tevet', 'Jeûne du 10 Tévet'],
  ['Esther', "Jeûne d'Esther"],
  ['Tammuz', 'Jeûne du 17 Tamouz'],
  ["B'Av", 'Tisha BeAv'],
]

// Déduit le libellé français d'un jeûne. Renvoie null pour Yom Kippour
// (déjà géré comme yom tov) ou un jeûne non reconnu.
function jeuneName(memo: string | undefined): string | null {
  if (!memo) return null
  const m = memo.replace(/[’']/g, "'") // normalise les apostrophes courbes/droites
  if (m.includes('Yom Kippur')) return null
  for (const [key, fr] of JEUNE_FR) {
    if (m.includes(key)) return fr
  }
  return null
}

// Extrait la date (YYYY-MM-DD) et l'heure locale (HH:MM) d'un ISO Hebcal
// ex: "2026-07-03T21:12:00+02:00" -> { date: "2026-07-03", heure: "21:12" }
function splitDateTime(iso: string | undefined): { date: string | null; heure: string | null } {
  if (!iso) return { date: null, heure: null }
  const [datePart, timePart] = iso.split('T')
  const heure = timePart ? timePart.slice(0, 5) : null
  return { date: datePart || null, heure }
}

interface HebcalItem {
  title: string
  date: string
  category: string
  memo?: string
  hebrew?: string
}

// Date du jour (YYYY-MM-DD) à Paris
function todayParis(now: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(now)
}

// Ajoute n jours à une date YYYY-MM-DD
function addDays(date: string, n: number): string {
  const d = new Date(date + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

// Samedi de la semaine en cours (aujourd'hui si on est samedi)
function nextSaturday(date: string): string {
  const day = new Date(date + 'T00:00:00Z').getUTCDay() // 0 = dimanche, 6 = samedi
  return addDays(date, (6 - day + 7) % 7)
}

export default defineEventHandler(async () => {
  // Prochain événement à venir : yom tov (bougies → havdalah) OU jeûne (début → fin).
  // On démarre quelques jours avant aujourd'hui pour capter le 1er soir d'un événement
  // déjà en cours (sinon on raterait le début du premier jour).
  const now = new Date()
  const start = new Date(now.getTime() - 4 * 86400000).toISOString().slice(0, 10)
  const end = new Date(now.getTime() + FETE_RECHERCHE_JOURS * 86400000)
    .toISOString()
    .slice(0, 10)

  const cal = await $fetch<{ items: HebcalItem[] }>('https://www.hebcal.com/hebcal', {
    query: {
      v: 1,
      cfg: 'json',
      geonameid: GEONAME_ID,
      maj: 'on', // fêtes majeures + Tisha B'Av / Yom Kippour
      mf: 'on', // jeûnes mineurs (Guedalia, 10 Tévet, Esther, 17 Tamouz)
      s: 'on', // ajoute la paracha en mémo des bougies de Shabbat (pour les distinguer)
      min: 'off',
      mod: 'off',
      nx: 'off',
      ss: 'off',
      c: 'on',
      b: 18,
      M: 'on',
      start,
      end,
    },
  })

  const items = (cal?.items ?? []).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )
  const after = (ref: string) => (h: HebcalItem) => new Date(h.date).getTime() > new Date(ref).getTime()

  // On liste tous les événements candidats (début → fin, avec libellé français)
  type Evenement = { debut: string; fin: string; nom: string }
  const evenements: Evenement[] = []

  // Yom tovim : allumage de bougies "hors Shabbat" (mémo ≠ Parashat) → havdalah
  for (const item of items) {
    if (item.category !== 'candles' || item.memo?.startsWith('Parashat')) continue
    const closing = items.find((h) => h.category === 'havdalah' && after(item.date)(h))
    if (closing) evenements.push({ debut: item.date, fin: closing.date, nom: feteName(item.memo) })
  }

  // Jeûnes : "Fast begins" → "Fast ends" (Yom Kippour exclu, déjà yom tov)
  for (const item of items) {
    if (item.category !== 'zmanim' || item.title !== 'Fast begins') continue
    const closing = items.find((h) => h.category === 'zmanim' && h.title === 'Fast ends' && after(item.date)(h))
    if (!closing) continue
    const nom = jeuneName(closing.memo)
    if (nom) evenements.push({ debut: item.date, fin: closing.date, nom })
  }

  // On garde l'événement encore à venir (fin ≥ maintenant) au début le plus proche
  const prochain = evenements
    .filter((e) => new Date(e.fin).getTime() >= now.getTime())
    .sort((a, b) => new Date(a.debut).getTime() - new Date(b.debut).getTime())[0]

  // Prochain Shabbat : bougies du vendredi -> havdalah du samedi.
  // Le samedi soir après la havdalah, on passe au Shabbat suivant.
  const today = todayParis(now)
  const findShabbat = (samedi: string) => {
    const vendredi = addDays(samedi, -1)
    const candles = items.find((i) => i.category === 'candles' && i.date.startsWith(vendredi))
    // Si un yom tov commence samedi soir, Hebcal donne un allumage au lieu d'une havdalah
    const finItem =
      items.find((i) => i.category === 'havdalah' && i.date.startsWith(samedi)) ??
      items.find((i) => i.category === 'candles' && i.date.startsWith(samedi))
    const parashat = items.find((i) => i.category === 'parashat' && i.date === samedi)
    // Shabbat pendant une fête (pas de paracha) : on affiche le nom de la fête
    const fete = parashat ? null : items.find((i) => i.category === 'holiday' && i.date === samedi)
    return { candles, finItem, parashat, fete }
  }
  let samedi = nextSaturday(today)
  let sh = findShabbat(samedi)
  if (sh.finItem && new Date(sh.finItem.date).getTime() < now.getTime()) {
    samedi = addDays(samedi, 7)
    sh = findShabbat(samedi)
  }

  const debut = splitDateTime(sh.candles?.date)
  const fin = splitDateTime(sh.finItem?.date)
  const parachaName = sh.parashat?.title?.replace(/^Parashat\s+/i, '')
  // Nom hébreu (ex. "פרשת פינחס" -> "פינחס")
  const parachaHe = sh.parashat?.hebrew?.replace(/^פרשת\s+/, '') ?? sh.fete?.hebrew ?? null
  const parachaFr = translateParacha(parachaName) ?? (sh.fete ? feteName(sh.fete.title) : null)

  const fd = splitDateTime(prochain?.debut)
  const ff = splitDateTime(prochain?.fin)
  const fete = {
    fetesActiver: !!prochain,
    fetesNom: prochain?.nom ?? null,
    fetesDebutDate: fd.date,
    fetesDebutHeure: fd.heure,
    fetesFinDate: ff.date,
    fetesFinHeure: ff.heure,
  }

  return {
    shabbatParacha: parachaFr,
    shabbatParachaHe: parachaHe,
    shabbatDebutDate: debut.date,
    shabbatDebutHeure: debut.heure,
    shabbatFinDate: fin.date,
    shabbatFinHeure: fin.heure,
    ...fete,
  }
})
