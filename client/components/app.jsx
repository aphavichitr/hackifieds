import Nav from './nav.jsx';
import Filter from './filter.jsx';
import Listings from './listings.jsx';
import ListingInfo from './listingInfo.jsx';
import NewListing from './newListing.jsx';
import helpers from '../lib/helpers.js';
import { Grid, Row, Col } from 'react-bootstrap';

class App extends React.Component {

  constructor (props) {
    super(props);

    this.state = {
      categories: [],
      listings: [],
      navCategory: 'Rent',  //Default listings category to show
      activeFilter: 'All',  //Default filter to show All
      activeListing: null,  //Default to not show Listing Info component
      currentUser: {},
      currentView: 'listingsView'
    };
  }

  componentWillMount () {
    helpers.userAuth((user) => this.setSession(user));
    this.retrieveCategories();
    this.retrieveListings(this.state.navCategory);
  }

  retrieveCategories () {
    helpers.getCategories( data => this.setState({categories: data}) );
  }

  retrieveListings (category) {
    helpers.getListings( category, data => this.setState({listings: data}) );
  }

  sendListing (newListing) {
    helpers.postListing(newListing, data => {
      let newCategory = this.state.categories.filter(cat => cat.categoryId === newListing.categoryId);
      this.handleNavClick(newCategory[0].categoryName);
    });
  }

  handleNavClick (value) {
    this.setState({ currentView: 'listingsView', navCategory: value, activeFilter: 'All' });
    this.retrieveListings(value);
  }

  handleFilterItemClick (event) {
    //Set the current activeFilter value
    this.setState({ activeFilter: event.currentTarget.id });
  }

  handleListingEntryClick (event) {
    //Set the current activeListing
    this.setState({ activeListing: Number(event.currentTarget.id) });
  }

  handleListingInfoClick (event) {
    //Set the current activeListing to null / close the Listing Info component
    this.setState({ activeListing: null });
  }

  setSession (user) {
    this.setState({ currentUser: user, activeListing: user.activeListing || null });
  }

  logOut () {
    helpers.logout( data => this.setState({currentUser: {}}) );
  }

  handleContactAuth(event) {
    helpers.contactAuth(event.currentTarget.id, (data) => {
      console.log('response from contactAuth', data);
      $.ajax({
        url: '/auth/github',
        method: 'GET',
        success: data => console.log( 'Contact Auth response: ', data),
        error: err => console.log( 'Error connecting to GitHub.', err)
      });

    });
  }

  render () {
    let viewLogic;
    let loginLogic;

    if ( this.state.currentView === 'listingsView' ) {
      viewLogic =
        <Row className="show-grid">
          <Col xs={2} md={2} lg={2}>
            <Filter handleFilterItemClick={this.handleFilterItemClick.bind(this)}
                    listings={this.state.listings}/>
          </Col>
          <Col xs={10} md={10} lg={10}>
            <Listings handleListingEntryClick={this.handleListingEntryClick.bind(this)}
                      handleListingInfoClick={this.handleListingInfoClick.bind(this)}
                      activeFilter={this.state.activeFilter}
                      activeListing={this.state.activeListing}
                      listings={this.state.listings}
                      user={this.state.currentUser}
                      handleContactAuth={this.handleContactAuth.bind(this)}/>
          </Col>
        </Row>;
    } else if (this.state.currentView === 'newListingView' ) {
      viewLogic =
        <Row className="show-grid">
          <Col xs={12} md={12} lg={12}>
            <NewListing categories={this.state.categories}
                        navCategory={this.state.navCategory}
                        user={this.state.currentUser}
                        clickHandler={this.sendListing.bind(this)}/>
          </Col>
        </Row>;
    }

    if (Object.keys(this.state.currentUser).length === 0) {
      loginLogic =
        <a href="/auth/github">Login with GitHub</a>;
    } else {
      loginLogic =
        <a href='/' onClick={this.logOut.bind(this)}>Logout</a>;
    }

    return (
      <div className="app">
        <input type="button"
               value="Create New Listing"
               onClick={ () => this.setState({currentView: 'newListingView'}) }/>
        {loginLogic}
        <Nav handleNavClick={this.handleNavClick.bind(this)}/>
        <Grid>
            {viewLogic}
        </Grid>
      </div>
    );
  }

}

export default App;

