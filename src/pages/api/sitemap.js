import CategoryServices from "@services/CategoryServices";
import ProductServices from "@services/ProductServices";

export default async function handler(req, res) {
  try {
    const baseUrl = 'https://shapirabro.co.il';
    
    // Static pages
    const staticPages = [
      '',
      '/about-us',
      '/contact-us',
      '/offers',
      '/best-sellers',
      '/purchased-products',
      '/faqs',
      '/privacy-policy',
      '/terms-and-conditions',
      '/accessibility-statement',
    ];

    // Get categories
    let categories = [];
    try {
      categories = await CategoryServices.getShowingCategory() || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
    }

    // Get products (limited to avoid timeout)
    let products = [];
    try {
      const productData = await ProductServices.getShowingStoreProducts({ limit: 500 });
      products = productData?.products || [];
    } catch (error) {
      console.error('Error fetching products:', error);
    }

    // Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
  
  ${categories.map(category => `
  <url>
    <loc>${baseUrl}/category/${category.code}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  ${category.children?.map(subCategory => `
  <url>
    <loc>${baseUrl}/category/${category.code}?sub=${subCategory.code}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('') || ''}`).join('')}
  
  ${products.map(product => `
  <url>
    <loc>${baseUrl}/product/${product.ItemCode}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`).join('')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(sitemap);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).json({ error: 'Error generating sitemap' });
  }
} 