#!/usr/bin/env node
/**
 * Fills theme locale keys that were copied in English when the key was added (user 2026-11-25:
 * German / French storefront still showed "Home", "Product type", "Hurry! Only …").
 *   node scripts/locales-fill.js            write de.json + fr.json
 *   node scripts/locales-fill.js --check    list keys still equal to English (all locales)
 * Only a key whose value is still the English text is replaced, so real translations are kept.
 */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'locales');
const LANGS = ['de', 'fr'];

// key → [de, fr]
const TR = {
  'general.breadcrumb.home': ['Startseite', 'Accueil'],
  'general.pagination.label': ['Seitennummerierung', 'Pagination'],
  'general.pagination.page': ['Seite {{ number }}', 'Page {{ number }}'],
  'general.share.share_url': ['Link', 'Lien'],
  'general.slider.load_slide': ['Folie laden', 'Charger la diapositive'],
  'general.slider.name': ['Slider', 'Carrousel'],
  'blogs.article.name': ['Name', 'Nom'],
  'onboarding.blog_title': ['Titel deines Blogbeitrags', 'Titre de votre article'],
  'products.product.wishlist': ['Auf die Wunschliste', 'Ajouter aux envies'],
  'products.product.in_stock': ['Auf Lager', 'En stock'],
  'products.product.description': ['Beschreibung', 'Description'],
  'products.product.on_sale': ['Sale', 'Promo'],
  'products.facets.filter_by_label': ['Filtern:', 'Filtrer :'],
  'products.facets.filter_button': ['Filtern', 'Filtrer'],
  'templates.search.page': ['Seite', 'Page'],
  'templates.search.results_suggestions_with_count.one': ['{{ count }} Vorschlag', '{{ count }} suggestion'],
  'templates.search.results_suggestions_with_count.other': ['{{ count }} Vorschläge', '{{ count }} suggestions'],
  'templates.search.suggestions': ['Vorschläge', 'Suggestions'],
  'templates.search.pages': ['Seiten', 'Pages'],
  'templates.contact.form.name': ['Name', 'Nom'],
  'sections.mini_cart.save': ['Speichern', 'Enregistrer'],
  'sections.mini_cart.calculate': ['Berechnen', 'Calculer'],
  'sections.mini_cart.view_cart': ['Warenkorb ansehen', 'Voir le panier'],
  'sections.mini_cart.added': ['Zum Warenkorb hinzugefügt', 'Ajouté au panier'],
  'sections.mini_cart.compare_added': ['Zum Vergleich hinzugefügt', 'Ajouté au comparateur'],
  'sections.mini_cart.compare_removed': ['Aus dem Vergleich entfernt', 'Retiré du comparateur'],
  'sections.collection_toolbar.view': ['Produktansicht', 'Affichage des produits'],
  'sections.collection_toolbar.grid_3': ['3 Spalten', '3 colonnes'],
  'sections.collection_toolbar.grid_4': ['4 Spalten', '4 colonnes'],
  'sections.collection_toolbar.list': ['Liste', 'Liste'],
  'sections.quick_view.reviews': ['({{ count }} Bewertungen)', '({{ count }} avis)'],
  'sections.quick_view.vendor': ['Anbieter', 'Marque'],
  'sections.quick_view.type': ['Produkttyp', 'Type de produit'],
  'sections.quick_view.wishlist': ['Auf die Wunschliste', 'Ajouter aux envies'],
  'sections.quick_view.view_details': ['Alle Details ansehen', 'Voir tous les détails'],
  'sections.navigation.categories_more': ['Mehr', 'Plus'],
  'sections.navigation.categories_less': ['Weniger', 'Moins'],
  'sections.navigation.categories_demo_note': ['Demo-Kategorien – weise unter Navigation → Kategorienmenü ein Menü zu.', 'Catégories de démo — choisissez un menu dans Navigation → Menu des catégories.'],
  'sections.navigation.categories_demo_list': [
    'Damen,Herren,Kleidung,Schuhe,Accessoires,Taschen,Uhren,Schmuck,Saisonmode,Gesundheit & Beauty,Elektronik,Haus & Küche,Sport & Outdoor',
    'Femme,Homme,Vêtements,Chaussures,Accessoires,Sacs,Montres,Bijoux,Mode de saison,Santé & beauté,Électronique,Maison & cuisine,Sport & plein air',
  ],
  'sections.navigation.demo_product_title': ['Beutel mit Nieten', 'Sac à cordon clouté'],
  'sections.navigation.demo_group_1_title': ['Damenmode', 'Mode femme'],
  'sections.navigation.demo_group_1_links': [
    'Kleider,T-Shirts,Blusen & Hemden,Hoodies & Sweatshirts,Damen-Sets,Anzüge & Blazer,Tops & Jacken,Pullover',
    'Robes,T-shirts,Blouses & chemises,Sweats & hoodies,Ensembles femme,Tailleurs & blazers,Débardeurs & vestes,Pulls',
  ],
  'sections.navigation.demo_group_2_title': ['Bademode', 'Maillots de bain'],
  'sections.navigation.demo_group_2_links': ['Bikini-Sets,Strandkleider', 'Bikinis,Paréos'],
  'sections.navigation.demo_group_3_title': ['Hosen & Röcke', 'Bas'],
  'sections.navigation.demo_group_3_links': ['Leggings,Röcke,Shorts,Jeans,Hosen & Caprihosen,Gürtel', 'Leggings,Jupes,Shorts,Jeans,Pantalons & corsaires,Ceintures'],
  'sections.navigation.demo_group_4_title': ['Hochzeiten & Events', 'Mariages & événements'],
  'sections.navigation.demo_group_4_links': ['Brautkleider,Ballkleider,Abendmode,Kostüme', 'Robes de mariée,Robes de bal,Tenues de soirée,Déguisements'],
  'sections.navigation.demo_group_5_title': ['Damenwäsche', 'Lingerie'],
  'sections.navigation.demo_group_5_links': ['Pyjama-Sets,BHs,Slips,Damensocken,BH-Sets,Shapewear', 'Pyjamas,Soutiens-gorge,Culottes,Chaussettes,Ensembles,Gainants'],
  'sections.navigation.demo_group_6_title': ['Accessoires', 'Accessoires'],
  'sections.navigation.demo_group_6_links': ['Haarschmuck,Sonnenbrillen,Blaulichtfilter-Brillen,Baseballkappen', 'Accessoires cheveux,Lunettes de soleil,Lunettes anti-lumière bleue,Casquettes'],
  'sections.navigation.demo_group_7_title': ['Shop-Layouts', 'Mises en page boutique'],
  'sections.navigation.demo_group_7_links': [
    'Volle Breite – 3 Spalten,Volle Breite – 4 Spalten,Volle Breite – 5 Spalten,Sidebar – 3 Spalten,Sidebar – 4 Spalten,Sidebar – Liste,Mehr laden – Kollektion',
    'Pleine largeur – 3 colonnes,Pleine largeur – 4 colonnes,Pleine largeur – 5 colonnes,Barre latérale – 3 colonnes,Barre latérale – 4 colonnes,Barre latérale – liste,Charger plus – collection',
  ],
  'sections.navigation.demo_group_8_title': ['Produkt', 'Produit'],
  'sections.navigation.demo_group_8_links': [
    'Standardprodukt,Sale-Produkt,Ausverkauft,Produkt mit Varianten,Akkordeon-Produkt,Beschreibung volle Breite,Beschreibung vertikal',
    'Produit standard,Produit en promo,Rupture de stock,Produit à variantes,Produit en accordéon,Description pleine largeur,Description verticale',
  ],
  'sections.navigation.demo_group_9_title': ['Produkt-Features', 'Fonctions produit'],
  'sections.navigation.demo_group_9_links': [
    'Magic Zoom,Countdown,Sticky Warenkorb-Button,Thumbnails links,Thumbnails rechts,Thumbnails unten,Thumbnail-Raster',
    'Magic Zoom,Compte à rebours,Ajout au panier fixe,Miniatures à gauche,Miniatures à droite,Miniatures en bas,Grille de miniatures',
  ],
  'sections.navigation.demo_group_10_title': ['Weitere Seiten', 'Autres pages'],
  'sections.navigation.demo_group_10_links': ['Warenkorb,Kasse,Bestellstatus,Anmelden/Registrieren,Wunschliste,Mein Konto', 'Panier,Paiement,Suivi de commande,Connexion/Inscription,Liste d’envies,Mon compte'],
  'sections.navigation.demo_card_titles': ['Sommer-Sale,Strand-Look,Schlafen & Lounge', 'Soldes d’été,Style plage,Nuit & détente'],
  'sections.navigation.featured_product_empty': ['Wähle im Block „Mega menu style 1“ ein Produkt aus.', 'Choisissez un produit dans le bloc « Mega menu style 1 ».'],
  'sections.navigation.color': ['Farbe', 'Couleur'],
  'sections.navigation.megamenu_empty': ['Füge dem Kategorienmenü Unterlinks hinzu und weise jeder Kategorie einen Mega-Menü-Block zu.', 'Ajoutez des sous-liens au menu des catégories et associez un bloc méga menu à chaque catégorie.'],
  'sections.navigation.featured_heading': ['Ausgewählte Produkte', 'Produits phares'],
  'sections.navigation.select_options': ['Optionen wählen', 'Choisir les options'],
  'sections.header.menu': ['Menü', 'Menu'],
  'sections.header.utility_navigation': ['Shop-Navigation', 'Navigation de la boutique'],
  'sections.cart_page.checkout': ['Zur Kasse', 'Passer au paiement'],
  'sections.cart_page.breadcrumb': ['Warenkorb', 'Panier'],
  'sections.cart_page.price': ['Preis', 'Prix'],
  'sections.cart_page.remove': ['Entfernen', 'Supprimer'],
  'sections.cart_page.edit': ['Bearbeiten', 'Modifier'],
  'sections.cart_page.free_shipping_remaining_html': ['Noch <strong>{{ amount }}</strong> bis zum <strong>KOSTENLOSEN Versand</strong>', 'Plus que <strong>{{ amount }}</strong> pour la <strong>livraison OFFERTE</strong>'],
  'sections.cart_page.subtotal': ['Zwischensumme', 'Sous-total'],
  'sections.cart_page.tax_note': ['Steuern und Versand werden an der Kasse berechnet', 'Taxes et frais de port calculés au paiement'],
  'sections.cart_page.terms_prefix': ['Ich stimme den', 'J’accepte les'],
  'sections.cart_page.terms_link': ['AGB zu', 'conditions générales'],
  'sections.cart_page.gift_wrap_html': ['Geschenkverpackung gewünscht? Nur <strong>{{ price }}</strong>', 'Un emballage cadeau ? Seulement <strong>{{ price }}</strong>'],
  'sections.cart_page.gift_wrap_added': ['Hinzugefügt', 'Ajouté'],
  'sections.cart_page.gift_wrap_add': ['Hinzufügen', 'Ajouter'],
  'sections.cart_page.note': ['Bestellnotiz hinzufügen', 'Ajouter une note'],
  'sections.cart_page.coupon': ['Gutscheincode', 'Code promo'],
  'sections.cart_page.coupon_hint': ['Der Gutscheincode wird an der Kasse angewendet', 'Le code promo s’applique à l’étape du paiement'],
  'sections.cart_page.estimate': ['Versand schätzen', 'Estimer la livraison'],
  'sections.cart_page.country': ['Land', 'Pays'],
  'sections.cart_page.province': ['Bundesland', 'Région'],
  'sections.cart_page.zip': ['Postleitzahl', 'Code postal'],
  'sections.cart_page.calculate': ['Versand berechnen', 'Calculer la livraison'],
  'sections.cart.headings.total': ['Gesamt', 'Total'],
  'sections.footer.rights': ['Alle Rechte vorbehalten.', 'Tous droits réservés.'],
  'sections.home_new_products.title': ['Neue Produkte', 'Nouveaux produits'],
  'sections.home_new_products.view_all': ['+ ALLE PRODUKTE', '+ VOIR TOUS LES PRODUITS'],
  'sections.home_flash_deals.countdown.days': ['TAGE', 'JOURS'],
  'sections.home_flash_deals.countdown.hours': ['STD', 'HEURES'],
  'sections.home_flash_deals.countdown.mins': ['MIN', 'MIN'],
  'sections.home_flash_deals.countdown.secs': ['SEK', 'SEC'],
  'sections.home_new_arrivals.script_text': ['Neu', 'Nouveautés'],
  'sections.home_new_arrivals.bold_text': ['eingetroffen', 'du moment'],
  'sections.home_new_arrivals.button_label': ['+ GANZE KOLLEKTION', '+ VOIR TOUTE LA COLLECTION'],
  'sections.home_trending_row.title': ['Top-Trends', 'Top tendances'],
  'sections.home_trending_row.feature_eyebrow_men': ['DAS BESTE FÜR HERREN', 'LE MEILLEUR HOMME'],
  'sections.home_trending_row.feature_eyebrow_women': ['DAS BESTE FÜR DAMEN', 'LE MEILLEUR FEMME'],
  'sections.home_trending_row.feature_eyebrow_shoes': ['DIE BESTEN SCHUHE', 'LE MEILLEUR CHAUSSURES'],
  'sections.home_trending_row.button_label': ['JETZT SHOPPEN', 'DÉCOUVRIR'],
  'sections.home_cta_banner.eyebrow': ['Herbst-Winter-Schlussverkauf', 'Soldes automne-hiver'],
  'sections.home_cta_banner.title_main': ['BIS ZU', 'JUSQU’À'],
  'sections.home_cta_banner.title_highlight': ['50 % RABATT', '−50 %'],
  'sections.home_script_banner.eyebrow_script': ['Frühjahr - Sommer 2021', 'Printemps - été 2021'],
  'sections.home_script_banner.title_bold': ['FLASH-SALE', 'VENTE FLASH'],
  'sections.home_dual_banner.sale30_eyebrow': ['Frühjahrskollektion', 'Journée collection printemps'],
  'sections.home_dual_banner.sale30_title': ['SALE 30 %', 'SOLDES −30 %'],
  'sections.home_dual_banner.trend2021_title': ['Damen', 'Femme'],
  'sections.home_brand_logos.title': ['Beliebte Marken', 'Marques populaires'],
  'sections.home_brand_logos.default_alt': ['Markenlogo', 'Logo de marque'],
  'sections.home_latest_news.title': ['Neuigkeiten', 'Actualités'],
  'sections.home_latest_news.read_more': ['Weiterlesen', 'Lire la suite'],
  'sections.home_latest_news.placeholder_title': ['Titel des neuesten Artikels', 'Titre du dernier article'],
  'sections.home_latest_news.placeholder_excerpt': ['Hier erscheint eine kurze Zusammenfassung deines neuesten Blogbeitrags. Füge dem gewählten Blog Artikel hinzu, um diesen Bereich zu füllen.', 'Un court résumé de votre dernier article apparaîtra ici. Ajoutez des articles au blog sélectionné pour remplir cette section.'],
  'sections.home_instagram.title': ['Folge uns auf Instagram', 'Suivez-nous sur Instagram'],
  'sections.home_instagram.view_on_instagram': ['Auf Instagram ansehen', 'Voir sur Instagram'],
  'sections.home_instagram.default_alt': ['Instagram-Foto', 'Photo Instagram'],
  'sections.home_services_bar.shipping_title': ['Kostenloser Versand', 'Livraison offerte'],
  'sections.home_services_bar.shipping_subtitle': ['Ab $20 Bestellwert', 'Dès $20 d’achat'],
  'sections.home_services_bar.return_title': ['15 Tage Rückgabe', 'Retours sous 15 jours'],
  'sections.home_services_bar.return_subtitle': ['Geld-zurück-Garantie', 'Satisfaite ou remboursée'],
  'sections.home_services_bar.support_title': ['Support-Team', 'Service client'],
  'sections.home_services_bar.support_subtitle': ['Live-Support rund um die Uhr', 'Assistance 24h/24, 7j/7'],
  'sections.home_services_bar.customer_title': ['Kundin werden', 'Devenir cliente'],
  'sections.home_services_bar.customer_subtitle': ['Werde Teil unserer Community', 'Rejoignez notre communauté'],
  'sections.collection_template.title': ['Kollektion', 'Collection'],
  'sections.collection_template.categories': ['Kategorien', 'Catégories'],
  'sections.collection_template.popular_products': ['Beliebte Produkte', 'Produits populaires'],
  'sections.product_bundle.question': ['Frage', 'Question'],
  'sections.main_product.product_type': ['Produkttyp', 'Type de produit'],
  'sections.main_product.live_viewers_html': ['<strong>{{ count }}</strong> Personen sehen sich das gerade an', '<strong>{{ count }}</strong> personnes regardent ce produit'],
  'sections.main_product.left_in_stock': ['Noch {{ count }} auf Lager', 'Plus que {{ count }} en stock'],
  'sections.main_product.hurry_left_html': ['<strong>Schnell sein!</strong> Nur noch <strong>{{ count }} Stück</strong> auf Lager.', '<strong>Vite !</strong> Plus que <strong>{{ count }} articles</strong> en stock.'],
  'sections.main_product.stock_remaining': ['Restbestand', 'Stock restant'],
  'sections.main_product.purchase_options': ['Kaufoptionen', 'Options d’achat'],
  'sections.main_product.one_time_purchase': ['Einmalkauf', 'Achat unique'],
  'sections.main_product.compare_added_label': ['Zum Vergleich hinzugefügt', 'Ajouté au comparateur'],
  'sections.main_product.agree_terms': ['Bitte stimme den AGB zu, um fortzufahren.', 'Veuillez accepter les conditions générales pour continuer.'],
  'sections.main_product.submit_error': ['Senden fehlgeschlagen. Bitte versuche es erneut.', 'Envoi impossible. Veuillez réessayer.'],
  'sections.main_product.accepted_payments': ['Akzeptierte Zahlungsarten', 'Moyens de paiement acceptés'],
  'sections.main_product.breadcrumb': ['Brotkrümelnavigation', 'Fil d’Ariane'],
  'sections.main_product.size_chart.size': ['Größe', 'Taille'],
  'sections.main_product.size_chart.chest': ['Brust', 'Poitrine'],
  'sections.main_product.size_chart.waist': ['Taille', 'Tour de taille'],
  'sections.main_product.size_chart.hips': ['Hüfte', 'Hanches'],
  'sections.main_product.restock_field_link': ['Link', 'Lien'],
  'sections.free_shipping.reached': ['🎉 Du erhältst kostenlosen Versand!', '🎉 La livraison est offerte !'],
  'sections.free_shipping.remaining_html': ['Noch {{ amount }} bis zum <strong>kostenlosen Versand</strong>', 'Plus que {{ amount }} pour la <strong>livraison offerte</strong>'],
  'sections.free_shipping.progress': ['Fortschritt bis zum kostenlosen Versand', 'Progression vers la livraison offerte'],
  'sections.product_reviews.summary_html': ['<strong>{{ rating }}</strong> / 5 aus <strong>{{ count }}</strong> Bewertungen', '<strong>{{ rating }}</strong> / 5 sur <strong>{{ count }}</strong> avis'],
  'sections.product_reviews.verified_buyer': ['Verifizierte Käuferin', 'Achat vérifié'],
  'sections.product_reviews.verified': ['Verifiziert', 'Vérifié'],
  'sections.product_reviews.anonymous': ['Anonym', 'Anonyme'],
  'sections.card.sale_off': ['Sale, {{ percent }} % Rabatt', 'Promo, −{{ percent }} %'],
  'sections.comparison.feature': ['Merkmal', 'Caractéristique'],
  'sections.comparison.yes': ['Ja', 'Oui'],
  'sections.cookie.label': ['Cookie-Einwilligung', 'Consentement aux cookies'],
  'sections.trust_strip.label': ['Darum bei uns einkaufen', 'Pourquoi acheter chez nous'],
  'sections.mc_collection_hero.collections': ['Kollektionen', 'Collections'],
  'localization.currency_label': ['Währung', 'Devise'],
  'customer.account_nav.dashboard': ['Übersicht', 'Tableau de bord'],
  'customer.account_nav.details': ['Kontodaten', 'Détails du compte'],
  'customer.account_nav.add_address': ['Adresse hinzufügen', 'Ajouter une adresse'],
  'customer.account_nav.hello': ['Hallo,', 'Bonjour,'],
  'customer.account_nav.orders': ['Bestellungen', 'Commandes'],
  'customer.account_nav.addresses': ['Adressen', 'Adresses'],
  'customer.account_nav.wishlist': ['Wunschliste', 'Liste d’envies'],
  'customer.addresses.province': ['Bundesland', 'Région'],
  'customer.login_page.title': ['Anmelden', 'Connexion'],
  'customer.order.total': ['Gesamt', 'Total'],
  'customer.orders.date': ['Datum', 'Date'],
  'customer.orders.total': ['Gesamt', 'Total'],
  'recipient.form.name': ['Name', 'Nom'],
  'recipient.form.message': ['Nachricht', 'Message'],
};

const strip = (s) => s.replace(/^﻿/, '');
const split = (text) => { const m = text.match(/^(\s*\/\*[\s\S]*?\*\/\s*)/); return m ? [m[1], text.slice(m[1].length)] : ['', text]; };
const flat = (o, p = '', r = {}) => { for (const [k, v] of Object.entries(o)) { if (v && typeof v === 'object') flat(v, `${p}${k}.`, r); else r[p + k] = v; } return r; };
const read = (f) => { const [head, body] = split(strip(fs.readFileSync(path.join(DIR, f), 'utf8'))); return { head, json: JSON.parse(body) }; };
const en = flat(read('en.default.json').json);

if (process.argv.includes('--check')) {
  for (const f of fs.readdirSync(DIR).filter((x) => !x.includes('schema') && !x.startsWith('en'))) {
    const l = flat(read(f).json);
    const same = Object.keys(en).filter((k) => l[k] === en[k] && /[a-z]{3}/i.test(en[k]) && !(TR[k] && TR[k][0] === en[k]));
    console.log(`${f}: ${same.length} keys still in English`);
  }
  process.exit(0);
}

for (const [li, lang] of LANGS.entries()) {
  const file = `${lang}.json`;
  const raw = fs.readFileSync(path.join(DIR, file), 'utf8');
  const crlf = raw.includes('\r\n');
  const { head, json } = read(file);
  let n = 0;
  for (const [key, vals] of Object.entries(TR)) {
    const parts = key.split('.');
    let node = json;
    for (const p of parts.slice(0, -1)) node = node && node[p];
    const last = parts[parts.length - 1];
    if (!node || node[last] !== en[key]) continue; // missing, or already translated
    node[last] = vals[li];
    n++;
  }
  let out = head + JSON.stringify(json, null, 2) + '\n';
  if (crlf) out = out.replace(/\r?\n/g, '\r\n');
  fs.writeFileSync(path.join(DIR, file), out);
  console.log(`✔ ${file}: ${n} keys translated`);
}
