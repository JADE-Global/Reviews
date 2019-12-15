import React from 'react';
import styles from '../ReviewEntry.css';
import Stars from './Stars.jsx';
import ReviewPictures from './ReviewPictures.jsx'
import UserInfo from './UserInfo.jsx';

class ReviewEntry extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hover: false,
      user: {},
      review: {},
    }
  }

  hoverChange() {
    this.setState({
      hover: !this.state.hover
    });
  };

  
  showPictures() {
    if(this.props.review.links !== null) {
      return <ReviewPictures links={this.props.review.links}/>
    }
  }

  render() {
    let data = this.props.review;
    let userInfo = {
      name: data.name,
      location: data.location,
      elite: data.elite,
      friend: data.friends,
      numPics: data.numPics,
      picture: data.picture,
      reviews: data.numReviews,
      date: data.date.split('T')[0],
    };
    return (
      
      <div className={styles.reviewEntry_container} onMouseEnter={this.hoverChange.bind(this)} onMouseLeave={this.hoverChange.bind(this)}>
        <UserInfo userInfo={userInfo} hover={this.state.hover}/>
        <div className={styles.review}>
          <div className={styles.starDate}>
            <div>
              <Stars stars={this.props.review.stars}/> 
            </div>
            <div>
              {userInfo.date}
            </div>
          </div>
          <div>{this.props.review.review}</div>
          <br/>
          {this.showPictures()}
        </div>
      </div>
  )}
}

export default ReviewEntry;