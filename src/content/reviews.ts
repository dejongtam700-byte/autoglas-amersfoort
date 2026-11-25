/**
 * Echte, verifieerbare klantbeoordelingen.
 *
 * Voeg hier ALLEEN reviews toe die letterlijk zo op een openbaar platform staan (bijv. het Google Bedrijfsprofiel)
 * en waarvan de klant toestemming heeft gegeven of die openbaar zijn geplaatst. Verzin nooit namen, citaten of scores.
 * Zolang deze lijst leeg is, toont de reviewsectie een link naar het Google-profiel.
 */
export interface Review {
  quote: string;
  author: string;
  source: "Google";
  /** Link naar de review of het profiel, voor verificatie. */
  url: string;
  date?: string;
}

export const reviews: Review[] = [];
