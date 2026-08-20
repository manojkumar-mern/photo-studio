/**
 * Configuration mapping for Photography Portfolios and Quotations
 * based on Photography Category and Package Tier.
 * 
 * Safe local development placeholders are provided as default values,
 * which can be overridden via environment variables.
 */

export const PORTFOLIO_RESOURCES = {
  'Wedding Documentary': {
    Standard: process.env.PORTFOLIO_WEDDING_STANDARD || 'https://photo-studio-1-7fjw.onrender.com/portfolios/wedding-standard.pdf',
    Premium: process.env.PORTFOLIO_WEDDING_PREMIUM || 'https://photo-studio-1-7fjw.onrender.com/portfolios/wedding-premium.pdf',
    Elite: process.env.PORTFOLIO_WEDDING_ELITE || 'https://photo-studio-1-7fjw.onrender.com/portfolios/wedding-elite.pdf'
  },
  'Pre-Wedding Shoot': {
    Standard: process.env.PORTFOLIO_PRE_WEDDING_STANDARD || 'https://photo-studio-1-7fjw.onrender.com/portfolios/pre-wedding-standard.pdf',
    Premium: process.env.PORTFOLIO_PRE_WEDDING_PREMIUM || 'https://photo-studio-1-7fjw.onrender.com/portfolios/pre-wedding-premium.pdf',
    Elite: process.env.PORTFOLIO_PRE_WEDDING_ELITE || 'https://photo-studio-1-7fjw.onrender.com/portfolios/pre-wedding-elite.pdf'
  },
  'Fine Art Portraiture': {
    Standard: process.env.PORTFOLIO_PORTRAIT_STANDARD || 'https://photo-studio-1-7fjw.onrender.com/portfolios/portrait-standard.pdf',
    Premium: process.env.PORTFOLIO_PORTRAIT_PREMIUM || 'https://photo-studio-1-7fjw.onrender.com/portfolios/portrait-premium.pdf',
    Elite: process.env.PORTFOLIO_PORTRAIT_ELITE || 'https://photo-studio-1-7fjw.onrender.com/portfolios/portrait-elite.pdf'
  },
  'Commercial Event': {
    Standard: process.env.PORTFOLIO_EVENT_STANDARD || 'https://photo-studio-1-7fjw.onrender.com/portfolios/event-standard.pdf',
    Premium: process.env.PORTFOLIO_EVENT_PREMIUM || 'https://photo-studio-1-7fjw.onrender.com/portfolios/event-premium.pdf',
    Elite: process.env.PORTFOLIO_EVENT_ELITE || 'https://photo-studio-1-7fjw.onrender.com/portfolios/event-elite.pdf'
  },
  'Fashion & Editorial': {
    Standard: process.env.PORTFOLIO_FASHION_STANDARD || 'https://photo-studio-1-7fjw.onrender.com/portfolios/fashion-standard.pdf',
    Premium: process.env.PORTFOLIO_FASHION_PREMIUM || 'https://photo-studio-1-7fjw.onrender.com/portfolios/fashion-premium.pdf',
    Elite: process.env.PORTFOLIO_FASHION_ELITE || 'https://photo-studio-1-7fjw.onrender.com/portfolios/fashion-elite.pdf'
  }
};

export const QUOTATION_RESOURCES = {
  'Wedding Documentary': {
    Standard: process.env.QUOTE_WEDDING_STANDARD || 'https://photo-studio-1-7fjw.onrender.com/quotations/wedding-standard.pdf',
    Premium: process.env.QUOTE_WEDDING_PREMIUM || 'https://photo-studio-1-7fjw.onrender.com/quotations/wedding-premium.pdf',
    Elite: process.env.QUOTE_WEDDING_ELITE || 'https://photo-studio-1-7fjw.onrender.com/quotations/wedding-elite.pdf'
  },
  'Pre-Wedding Shoot': {
    Standard: process.env.QUOTE_PRE_WEDDING_STANDARD || 'https://photo-studio-1-7fjw.onrender.com/quotations/pre-wedding-standard.pdf',
    Premium: process.env.QUOTE_PRE_WEDDING_PREMIUM || 'https://photo-studio-1-7fjw.onrender.com/quotations/pre-wedding-premium.pdf',
    Elite: process.env.QUOTE_PRE_WEDDING_ELITE || 'https://photo-studio-1-7fjw.onrender.com/quotations/pre-wedding-elite.pdf'
  },
  'Fine Art Portraiture': {
    Standard: process.env.QUOTE_PORTRAIT_STANDARD || 'https://photo-studio-1-7fjw.onrender.com/quotations/portrait-standard.pdf',
    Premium: process.env.QUOTE_PORTRAIT_PREMIUM || 'https://photo-studio-1-7fjw.onrender.com/quotations/portrait-premium.pdf',
    Elite: process.env.QUOTE_PORTRAIT_ELITE || 'https://photo-studio-1-7fjw.onrender.com/quotations/portrait-elite.pdf'
  },
  'Commercial Event': {
    Standard: process.env.QUOTE_EVENT_STANDARD || 'https://photo-studio-1-7fjw.onrender.com/quotations/event-standard.pdf',
    Premium: process.env.QUOTE_EVENT_PREMIUM || 'https://photo-studio-1-7fjw.onrender.com/quotations/event-premium.pdf',
    Elite: process.env.QUOTE_EVENT_ELITE || 'https://photo-studio-1-7fjw.onrender.com/quotations/event-elite.pdf'
  },
  'Fashion & Editorial': {
    Standard: process.env.QUOTE_FASHION_STANDARD || 'https://photo-studio-1-7fjw.onrender.com/quotations/fashion-standard.pdf',
    Premium: process.env.QUOTE_FASHION_PREMIUM || 'https://photo-studio-1-7fjw.onrender.com/quotations/fashion-premium.pdf',
    Elite: process.env.QUOTE_FASHION_ELITE || 'https://photo-studio-1-7fjw.onrender.com/quotations/fashion-elite.pdf'
  }
};

export const DEFAULT_PORTFOLIO = process.env.PORTFOLIO_DEFAULT || 'https://photo-studio-1-7fjw.onrender.com/portfolios/general.pdf';
export const DEFAULT_QUOTATION = process.env.QUOTE_DEFAULT || 'https://photo-studio-1-7fjw.onrender.com/quotations/general.pdf';

/**
 * Resolves the portfolio URL based on category and package tier
 */
export const getPortfolioUrl = (category, packageTier) => {
  const normalizedCategory = category || '';
  const normalizedTier = packageTier || 'Standard';
  const catMapping = PORTFOLIO_RESOURCES[normalizedCategory];
  if (catMapping) {
    return catMapping[normalizedTier] || catMapping['Standard'] || DEFAULT_PORTFOLIO;
  }
  return DEFAULT_PORTFOLIO;
};

/**
 * Resolves the quotation URL based on category and package tier
 */
export const getQuotationUrl = (category, packageTier) => {
  const normalizedCategory = category || '';
  const normalizedTier = packageTier || 'Standard';
  const catMapping = QUOTATION_RESOURCES[normalizedCategory];
  if (catMapping) {
    return catMapping[normalizedTier] || catMapping['Standard'] || DEFAULT_QUOTATION;
  }
  return DEFAULT_QUOTATION;
};
