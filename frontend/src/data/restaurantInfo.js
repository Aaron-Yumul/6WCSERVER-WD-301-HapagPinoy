import diningHall from '../assets/about/dining-hall.webp'
import filipinoSpread from '../assets/about/filipino-spread.webp'
import filipinoFeast from '../assets/about/filipino-feast.webp'

// SAMPLE DETAILS - replace these with the real restaurant information.
// Opening hours live in src/data/schedule.js.
export const restaurantInfo = {
  name: 'HapagPinoy',
  address: '123 Sample Street, Sample Barangay, Sample City, Philippines',
  phone: '+63 900 000 0000',
  email: 'hello@hapagpinoy.example',
  // Add real URLs here later (e.g. 'https://facebook.com/yourpage'). Empty ones are not shown.
  socialLinks: [
    { label: 'Facebook', url: '' },
    { label: 'Instagram', url: '' },
  ],
  // Replace these with your own dining-area photos. If a photo cannot load, a placeholder is shown.
  spacePhotos: [
    {
      src: diningHall,
      alt: 'Open-air dining hall with bamboo roof, colorful bunting, white drapes and set tables at night',
      caption: 'Main dining room',
      art: 'main',
    },
    {
      src: filipinoSpread,
      alt: 'Table spread of lumpia, grilled shrimp skewers, ube pie and refreshing drinks',
      caption: 'Made for sharing',
      art: 'coffee',
    },
    {
      src: filipinoFeast,
      alt: 'Filipino dishes on the table: crispy fried fish, roast pork, sisig and rich stews',
      caption: 'Dinner at the hapag',
      art: 'pasta',
    },
  ],
}
