// Inventory API service: the CRM's listings for the home page's Inventory
// section. WO-4.42.
//
// The contract is docs/integration/PENNJETS-SITE.md §5 on the CRM's main
// (WO-0.10, 2026-10-05):
//
//   GET /api/public/inventory          no auth, no parameters
//   -> 200 { listings: [ { id, slug, year, make, model, variant, serial,
//                          hours, config, askingPrice, headline, images[],
//                          updatedAt } ] }
//
// LISTED rows only; the CRM's Approve action is the only thing that lists an
// aircraft, and nothing here can. An empty inventory is { listings: [] }.
// The route writes nothing (no view counter, no analytics row).
//
// The contract has no `pagination` field today, so there is nothing to page:
// the one request is the whole inventory. If the CRM ever adds one, this is
// where the blogPaging.js loop would go.

import { safeImage } from '../seo/siteMeta';

const CRM_API_URL = import.meta.env.VITE_CRM_API_URL || 'https://www.pennforce.pennjets.com';

const isNumber = (v) => typeof v === 'number' && Number.isFinite(v);

/**
 * One listing as the card reads it. Only what the route sent: no field is
 * invented, and a missing year, make, model, serial, hours or config means
 * the listing is dropped rather than shown incomplete (Home.jsx's rule:
 * every entry carries all five). The first image on the CRM's store is the
 * card's image; an image on any other host is dropped by safeImage
 * (WO-4.39), and the card then renders without one.
 * @param {object} raw - a listing exactly as the CRM returned it
 * @returns {object|null}
 */
export function toCardListing(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const { id, slug, year, make, model, serial, hours, config } = raw;
  if (!slug || !isNumber(year) || !make || !model || !serial || !isNumber(hours) || !config) return null;
  const images = Array.isArray(raw.images) ? raw.images.map(safeImage).filter(Boolean) : [];
  return {
    id: id || slug,
    slug,
    year,
    make,
    model,
    variant: raw.variant || null,
    serial,
    hours,
    config,
    headline: raw.headline || null,
    // A number in USD, or null when Joseph has not set one. Shown only when
    // it is a number; never a placeholder.
    askingPrice: isNumber(raw.askingPrice) ? raw.askingPrice : null,
    image: images[0] || null,
    images,
    url: `/aircraft/${slug}`,
    updatedAt: raw.updatedAt || null,
  };
}

export const inventoryApi = {
  /**
   * Every LISTED aircraft, as cards. [] on any failure, including the 404
   * the route answers until it exists (WO-3.39), so the section simply
   * renders nothing.
   * @returns {Promise<Array>}
   */
  async getListings() {
    try {
      const response = await fetch(`${CRM_API_URL}/api/public/inventory`);
      if (!response.ok) throw new Error(`inventory route returned ${response.status}`);
      const data = await response.json();
      const listings = Array.isArray(data?.listings) ? data.listings : [];
      return listings.map(toCardListing).filter(Boolean);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      return [];
    }
  },

  /**
   * One listing by its slug, or null. Used by /aircraft/<slug>.
   * @param {string} slug
   * @returns {Promise<object|null>}
   */
  async getListing(slug) {
    if (!slug) return null;
    const all = await this.getListings();
    return all.find((l) => l.slug === slug) || null;
  },
};
