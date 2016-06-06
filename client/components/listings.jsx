import ListingEntry from './listingEntry.jsx';
import ListingInfo from './listingInfo.jsx';

const Listings = props => {
  let filtered = [];
  console.log('props', props.activeListing);
  //Iterate over all listings and generate filtered population based on activeFilter value
  props.listings.forEach(listing => {
    if (props.activeFilter === 'All' || listing.location === props.activeFilter) {
      filtered.push(listing);
    }
  });
  //Return the filtered population only & show a specific listing's info if it has been clicked
  return (
    <div className="listings">
      {filtered.map(listing => 
        (props.activeListing && props.activeListing === listing.listingId) ? 
        <ListingInfo handleListingInfoClick = {props.handleListingInfoClick} listing={listing} user={props.user} activeListing={props.activeListing} handleContactAuth={props.handleContactAuth}/> : 
        <ListingEntry key={listing.listingId} handleListingEntryClick={props.handleListingEntryClick} listing={listing}/>)
      }
    </div>
  );
};

export default Listings;
