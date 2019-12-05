const faker = require('faker');
const mysql = require('db');
const restaurantsList = require('./restaurantList.js');
const restaurants = restaurantsList.restaurants;
const numUsers = 1000;
const numReviews = 20000;
const numRestaurants = restaurants.length;
const foodPics = 'https://yelpfoodpics.s3-us-west-1.amazonaws.com/';


const connection = mysql.createConnection({
  user: 'root',
  password: 'Derty321$',
  database: 'yelp'
});

connection.connect();

let db = {

  querySQL: function(query) {
    let result = new Promise((resolve, reject) => {
      connection.query(query, function(err, data) {
        if(err) {
          reject(err);
        } else {
          resolve(data);
        }
      })
    });
    return result;
  },

  seedRestaurants: async function() {

    let query = `INSERT INTO restaurants (name) VALUES `;
    for (let i = 0; i < restaurants.length; i++) {
      if(i === restaurants.length - 1) {
        query += `('${restaurants[i]}');`;
      } else {
        query += `('${restaurants[i]}'),`;
      }
    }
    return await db.querySQL(query);
  },

  seedUsers: async function() {

    let query = `INSERT INTO users (name, location, friends, elite, picture) VALUES `;
    for (let i = 0; i < numUsers; i++) {
      let firstName = faker.name.firstName();
      let lastInitial = String.fromCharCode(Math.floor((Math.random() * 26) + 65)) + '.';
      let name = `${firstName} ${lastInitial}`;
      let location = `${faker.address.city()}, ${faker.address.stateAbbr()}`;
      let friends = Math.floor(Math.random() * 200);
      let chanceOfElite = Math.floor(Math.random() * 9);
      let elite = 0;
      let picture = faker.image.avatar();
  
      //10% chance of elite status
      if(chanceOfElite < 1) {
        elite = 1;
      }
      if(i === numUsers - 1) {
        query += `("${name}", "${location}", ${friends}, ${elite}, '${picture}');`;
      } else {
        query += `("${name}", "${location}", ${friends}, ${elite}, '${picture}'),`;
      }
    }
    return await db.querySQL(query);
  },

  seedReviews: async function() {
    
    //select random restaurant and user
    for(let i = 0; i < numReviews; i++) {
      let date = faker.date.recent(1600).toISOString().split('T')[0]
      let review = faker.lorem.paragraph();
      let stars = Math.floor(Math.random() * 4) + 1;
      let restaurantId = Math.floor(Math.random() * numRestaurants) + 1;
      let userId = Math.floor(Math.random() * numUsers) + 1;
      let query = `INSERT INTO reviews(date, review, stars, user_id, restaurant_id) VALUES `;
      let chanceOfPics = Math.floor(Math.random() * 9);
      let numFoodPics = Math.floor(Math.random() * 7);
      let links = [];
      
      //20% chance of adding picture to review
      if(chanceOfPics < 2) {
        for(let i = 0; i < numFoodPics; i++) {
          let foodPicNum = Math.floor(Math.random() * 60);
          links.push(foodPics + foodPicNum + '.jpg' );
        }
      }

      query += `('${date}', '${review}', ${stars}, ${userId}, ${restaurantId}); `;  

      let reviewResult = await db.querySQL(query)
      if(links.length > 0) {
        let lastInsertId = reviewResult.insertId;
        let reviewPicQuery = `INSERT INTO reviewpictures (links, review_id) VALUES ('${links}', ${lastInsertId});`;
        let reviewPics = await db.querySQL(reviewPicQuery);
        let updateUserQuery =  `UPDATE users SET numReviews = numReviews + 1, numPics = numPics + ${links.length} WHERE id = ${userId};`
        await db.querySQL(updateUserQuery);
      }
    }
    connection.end();
  }
}


db.seedUsers()
.then(() => db.seedRestaurants())
.then(() => db.seedReviews())
.catch(err => {console.log('err')});
