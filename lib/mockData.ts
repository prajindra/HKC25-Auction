
export interface AuctionItem {
  id: string;
  title: string;
  description: string;
  image: string;
  startingBid: number;
  currentBid: number;
  bidIncrement: number;
  totalBids: number;
  isActive: boolean;
  endTime?: Date;
  bids: Bid[];
}

export interface Bid {
  id: string;
  amount: number;
  bidderName: string;
  bidderEmail: string;
  bidderPhone: string;
  timestamp: Date;
}

export const mockAuctionItems: AuctionItem[] = [
  {
    id: '1',
    title: 'Sacred Bhagavad Gita Collection',
    description: 'A beautiful hand-crafted collection of Bhagavad Gita with golden binding and Sanskrit verses. This spiritual treasure includes commentary by revered teachers and is perfect for daily study and meditation.',
    image: 'https://readdy.ai/api/search-image?query=Beautiful%20ornate%20golden%20Bhagavad%20Gita%20book%20collection%20with%20Sanskrit%20verses%20and%20spiritual%20decorations%20on%20wooden%20table%20with%20soft%20lighting%20and%20flowers%20around%20it%20creating%20peaceful%20atmosphere&width=800&height=600&seq=gita1&orientation=landscape',
    startingBid: 250,
    currentBid: 250,
    bidIncrement: 25,
    totalBids: 0,
    isActive: true,
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    bids: []
  },
  {
    id: '2',
    title: 'Handcrafted Krishna Deity Murti',
    description: 'Exquisite handcrafted Krishna deity statue made from premium marble with intricate details. Perfect for home altar or temple worship. Blessed by senior devotees and radiates divine energy.',
    image: 'https://readdy.ai/api/search-image?query=Beautiful%20handcrafted%20marble%20Krishna%20deity%20statue%20with%20intricate%20carvings%20and%20divine%20features%20placed%20on%20decorated%20altar%20with%20flowers%20and%20oil%20lamps%20in%20temple%20setting&width=800&height=600&seq=murti1&orientation=landscape',
    startingBid: 500,
    currentBid: 500,
    bidIncrement: 50,
    totalBids: 0,
    isActive: true,
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
    bids: []
  },
  {
    id: '3',
    title: 'Spiritual Meditation Mala Beads',
    description: 'Sacred 108-bead tulsi mala handcrafted by senior devotees. Each bead is blessed with mantras and perfect for japa meditation. Comes with beautiful silk pouch and meditation guide.',
    image: 'https://readdy.ai/api/search-image?query=Sacred%20tulsi%20mala%20beads%20with%20108%20beads%20arranged%20beautifully%20on%20silk%20cloth%20with%20spiritual%20books%20and%20candles%20in%20peaceful%20meditation%20setting%20with%20soft%20golden%20light&width=800&height=600&seq=mala1&orientation=landscape',
    startingBid: 75,
    currentBid: 75,
    bidIncrement: 10,
    totalBids: 0,
    isActive: true,
    endTime: new Date(Date.now() + 1 * 60 * 60 * 1000),
    bids: []
  },
  {
    id: '4',
    title: 'Temple Prasadam Cooking Set',
    description: 'Complete set of copper vessels and utensils used for preparing sacred prasadam. Includes traditional pots, serving bowls, and blessed spoons. Perfect for devotional cooking at home.',
    image: 'https://readdy.ai/api/search-image?query=Traditional%20copper%20cooking%20vessels%20and%20utensils%20set%20arranged%20on%20wooden%20surface%20with%20herbs%20and%20spices%20around%20creating%20authentic%20temple%20kitchen%20atmosphere%20with%20warm%20lighting&width=800&height=600&seq=cooking1&orientation=landscape',
    startingBid: 200,
    currentBid: 200,
    bidIncrement: 25,
    totalBids: 0,
    isActive: false,
    bids: []
  },
  {
    id: '5',
    title: 'Limited Edition Kirtan Harmonium',
    description: 'Professional-grade harmonium perfect for kirtan and bhajan sessions. Handcrafted with premium wood and includes tuning tools. Used by renowned kirtan leaders and produces divine sound quality.',
    image: 'https://readdy.ai/api/search-image?query=Beautiful%20wooden%20harmonium%20with%20intricate%20carvings%20and%20golden%20details%20placed%20in%20temple%20setting%20with%20flowers%20and%20spiritual%20instruments%20around%20creating%20musical%20atmosphere&width=800&height=600&seq=harmonium1&orientation=landscape',
    startingBid: 800,
    currentBid: 800,
    bidIncrement: 100,
    totalBids: 0,
    isActive: true,
    endTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
    bids: []
  },
  {
    id: '6',
    title: 'Sacred Tulsi Plant with Ornate Pot',
    description: 'Holy Tulsi plant in beautifully decorated brass pot. This sacred plant is considered very auspicious and brings spiritual blessings to the home. Includes care instructions and daily prayer guide.',
    image: 'https://readdy.ai/api/search-image?query=Sacred%20tulsi%20plant%20in%20ornate%20brass%20pot%20with%20decorative%20patterns%20placed%20in%20peaceful%20garden%20setting%20with%20flowers%20and%20spiritual%20symbols%20creating%20blessed%20atmosphere&width=800&height=600&seq=tulsi1&orientation=landscape',
    startingBid: 150,
    currentBid: 150,
    bidIncrement: 15,
    totalBids: 0,
    isActive: true,
    endTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
    bids: []
  }
];