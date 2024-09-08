// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import axios from "axios";
// import Restaurant from "./src/models/Resturant.model";
// import connectDB from "./src/config/db";
// import {
//   IGuestInfo,
//   IReservation,
//   IRestaurant,
//   ITable,
//   IOpeningHours,
//   IRestaurantMenu,
//   IRestaurantAddress,
//   IRestaurantContactInfo,
// } from "./src/types/types";

// dotenv.config();

// const MONGO_URI = process.env.MONGO_URI;
// const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || "";

// const restaurantAddresses = [
//   {
//     name: "Shila",
//     address: {
//       country: "Israel",
//       city: "Tel Aviv",
//       street: "Ben Yehuda St",
//       number: 182,
//     },
//   },
//   {
//     name: "Ouzeria",
//     address: {
//       country: "Israel",
//       city: "Tel Aviv",
//       street: "Matalon St",
//       number: 44,
//     },
//   },
//   {
//     name: "Taizu",
//     address: {
//       country: "Israel",
//       city: "Tel Aviv",
//       street: "Menachem Begin Rd",
//       number: 23,
//     },
//   },
//   {
//     name: "M25",
//     address: {
//       country: "Israel",
//       city: "Tel Aviv",
//       street: "Simtat HaCarmel",
//       number: 30,
//     },
//   },
//   {
//     name: "North Abraxas",
//     address: {
//       country: "Israel",
//       city: "Tel Aviv",
//       street: "Lilienblum St",
//       number: 40,
//     },
//   },
//   {
//     name: "Port Said",
//     address: {
//       country: "Israel",
//       city: "Tel Aviv",
//       street: "Har Sinai St",
//       number: 5,
//     },
//   },
//   {
//     name: "Olea",
//     address: {
//       country: "Israel",
//       city: "Tel Aviv",
//       street: "Yehuda Halevi St",
//       number: 50,
//     },
//   },
//   {
//     name: "Santa Katarina",
//     address: {
//       country: "Israel",
//       city: "Tel Aviv",
//       street: "Har Sinai St",
//       number: 2,
//     },
//   },
//   {
//     name: "Cafe Noir",
//     address: {
//       country: "Israel",
//       city: "Tel Aviv",
//       street: "Ahad Ha'Am St",
//       number: 43,
//     },
//   },
//   {
//     name: "Brasserie M&R",
//     address: {
//       country: "Israel",
//       city: "Tel Aviv",
//       street: "Ibn Gabirol St",
//       number: 70,
//     },
//   },
//   {
//     name: "Mashya",
//     address: {
//       country: "Israel",
//       city: "Tel Aviv",
//       street: "Mendele Mokher Sfarim St",
//       number: 5,
//     },
//   },

//   {
//     name: "HaSalon",
//     address: {
//       country: "Israel",
//       city: "Tel Aviv",
//       street: "Ma'avar Yabok St",
//       number: 8,
//     },
//   },
//   {
//     name: "Claro",
//     address: {
//       country: "Israel",
//       city: "Tel Aviv",
//       street: "HaArba'a St",
//       number: 23,
//     },
//   },
//   {
//     name: "Benedict",
//     address: {
//       country: "Israel",
//       city: "Tel Aviv",
//       street: "Rothschild Blvd",
//       number: 29,
//     },
//   },
//   {
//     name: "Hotel Montefiore",
//     address: {
//       country: "Israel",
//       city: "Tel Aviv",
//       street: "Montefiore St",
//       number: 36,
//     },
//   },
//   {
//     name: "Popina",
//     address: {
//       country: "Israel",
//       city: "Tel Aviv",
//       street: "Ahad Ha'Am St",
//       number: 3,
//     },
//   },
//   {
//     name: "Basta",
//     address: {
//       country: "Israel",
//       city: "Tel Aviv",
//       street: "HaShomer St",
//       number: 4,
//     },
//   },
//   {
//     name: "OCD",
//     address: {
//       country: "Israel",
//       city: "Tel Aviv",
//       street: "Tirtsa St",
//       number: 17,
//     },
//   },
//   {
//     name: "Cafe Europa",
//     address: {
//       country: "Israel",
//       city: "Tel Aviv",
//       street: "Rothschild Blvd",
//       number: 9,
//     },
//   },
//   {
//     name: "Shila",
//     address: {
//       country: "Israel",
//       city: "Tel Aviv",
//       street: "Ben Yehuda St",
//       number: 182,
//     },
//   },
//   {
//     name: "Carmel Market",
//     address: {
//       country: "Israel",
//       city: "Tel Aviv",
//       street: "HaCarmel St",
//       number: 1,
//     },
//   },
//   {
//     name: "Miznon",
//     address: {
//       country: "Israel",
//       city: "Tel Aviv",
//       street: "Ibn Gabirol St",
//       number: 23,
//     },
//   },

//   {
//     name: "Taqueria",
//     address: {
//       country: "Israel",
//       city: "Tel Aviv",
//       street: "Levontin St",
//       number: 28,
//     },
//   },
// ];

// // Convert to 24-hour time function
// function convertTo24HourTime(timeString: string): [number, number] {
//   if (!timeString) {
//     throw new Error(`Invalid time string: ${timeString}`);
//   }

//   const timeParts = timeString.trim().match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
//   if (!timeParts) {
//     throw new Error(`Invalid time format: ${timeString}`);
//   }

//   let [_, hoursStr, minutesStr, period] = timeParts;
//   let hours = parseInt(hoursStr);
//   let minutes = parseInt(minutesStr);

//   if (period) {
//     if (period.toUpperCase() === "PM" && hours < 12) {
//       hours += 12;
//     } else if (period.toUpperCase() === "AM" && hours === 12) {
//       hours = 0;
//     }
//   } else if (hours === 12) {
//     hours = 0; // Handle 12:00 AM as 00:00
//   }
//   return [hours, minutes];
// }

// async function getCorrectPlaceId(restaurant: {
//   name: string;
//   address: IRestaurantAddress;
// }) {
//   try {
//     const textSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${restaurant.name.replace(
//       / /g,
//       "+"
//     )}+${restaurant.address.street}+${
//       restaurant.address.number
//     }&key=${GOOGLE_MAPS_API_KEY}`;
//     const textSearchResponse = await axios.get(textSearchUrl);

//     if (
//       !textSearchResponse.data.results ||
//       textSearchResponse.data.results.length === 0
//     ) {
//       throw new Error(
//         `No results found for ${restaurant.name} at ${restaurant.address.street} ${restaurant.address.number}`
//       );
//     }

//     const placeId = textSearchResponse.data.results[0].place_id;
//     // console.log(`Correct Place ID for ${restaurant.name}: ${placeId}`);
//     return placeId;
//   } catch (error) {
//     console.error(
//       `Error fetching correct place ID for ${restaurant.name}:`,
//       error
//     );
//     return null;
//   }
// }

// function parseOpeningHoursString(openingHours: string[]): IOpeningHours[] {
//   return openingHours.map((hoursString: string) => {
//     const [day, hours] = hoursString.split(": ");
//     let [open, close] = hours.split("–").map((time) => time.trim());

//     if (!close) {
//       close = "11:00 PM"; // Default closing time
//     }

//     return { day, open, close };
//   });
// }

// async function getRestaurantData(restaurant: {
//   name: string;
//   address: IRestaurantAddress;
// }) {
//   try {
//     // console.log(restaurant);
//     const placeId = await getCorrectPlaceId(restaurant);

//     if (!placeId) {
//       throw new Error(`Failed to get correct place ID for ${restaurant.name}`);
//     }

//     const placeDetailsURL = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos,name,formatted_address,geometry,opening_hours,place_id,types,price_level,rating,user_ratings_total&key=${GOOGLE_MAPS_API_KEY}`;
//     // console.log("Place Details URL: ", placeDetailsURL);

//     const placeDetailsResponse = await axios.get(placeDetailsURL);
//     const placeDetails = placeDetailsResponse.data.result;

//     let photoUrl = "https://source.unsplash.com/random/800x600?restaurant"; // Default photo
//     let photoArray: string[] = [];

//     if (placeDetails.photos && placeDetails.photos.length > 0) {
//       // Generate the URLs for all photos
//       photoArray = placeDetails.photos.map(
//         (photo: { photo_reference: string }) =>
//           `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GOOGLE_MAPS_API_KEY}`
//       );

//       // Set the first photo as the main photo
//       photoUrl = photoArray[0];
//     } else {
//       console.warn(`No photos found for ${restaurant.name}`);
//     }

//     const contactInfo: IRestaurantContactInfo = {
//       phoneNumber:
//         placeDetails.formatted_phone_number ||
//         `+972-3-${Math.floor(1000000 + Math.random() * 9000000)}`,
//       websiteURL:
//         placeDetails.website ||
//         `http://${restaurant.name.toLowerCase().replace(/ /g, "-")}.com`,
//     };

//     let openingHours = placeDetails.opening_hours?.weekday_text || [];
//     if (typeof openingHours[0] === "string") {
//       openingHours = parseOpeningHoursString(openingHours);
//     }

//     const categories = placeDetails.types || ["restaurant"];

//     return {
//       lat: placeDetails.geometry.location.lat,
//       lng: placeDetails.geometry.location.lng,
//       mainPhoto: photoUrl,
//       contactInfo,
//       categories,
//       openingHours,
//       about: {
//         longDescription:
//           "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel turpis vel mi consectetur placerat. Duis vel turpis vel mi consectetur placerat. Sed vel turpis vel mi consectetur placerat.",
//         menus: [
//           { title: "Menu 1", menuUrl: "https://example.com/menu1" },
//           { title: "Menu 2", menuUrl: "https://example.com/menu2" },
//         ],
//         photos: photoArray,
//       },
//       shortDescription: "Lorem ipsum dolor sit amet, consectet",
//     };
//   } catch (error) {
//     console.error(`Error fetching data for ${restaurant.name}:`, error);
//   }
// }

// function createReservation(
//   openingTime: string,
//   closingTime: string
// ): Date | null {
//   if (
//     !openingTime ||
//     !closingTime ||
//     openingTime === "Closed" ||
//     closingTime === "Closed"
//   ) {
//     console.error(
//       "Generated reservation time is not valid - restaurant is closed."
//     );
//     return null;
//   }

//   if (openingTime === "Open 24 hours" || closingTime === "Open 24 hours") {
//     openingTime = "00:00 AM";
//     closingTime = "11:59 PM";
//   }

//   const [openHour, openMinute] = convertTo24HourTime(openingTime);
//   const [closeHour, closeMinute] = convertTo24HourTime(closingTime);
//   const openDate = new Date();
//   openDate.setHours(openHour, openMinute, 0, 0);

//   const closeDate = new Date();
//   closeDate.setHours(closeHour, closeMinute, 0, 0);

//   if (closeDate <= openDate) {
//     closeDate.setDate(closeDate.getDate() + 1);
//   }

//   const randomReservationTime = new Date(
//     openDate.getTime() +
//       Math.random() * (closeDate.getTime() - openDate.getTime())
//   );

//   if (randomReservationTime >= openDate && randomReservationTime <= closeDate) {
//     return randomReservationTime;
//   } else {
//     console.error("Generated reservation time is outside operating hours.");
//     return null;
//   }
// }

// function createTablesAndReservations(
//   tables: number,
//   reservationsPerTable: number,
//   restaurantOpeningHours: IOpeningHours[]
// ) {
//   const tablesData: ITable[] = [];

//   for (let i = 1; i <= tables; i++) {
//     const table: ITable = {
//       position: `Table ${i}`,
//       partySize: 0,
//       reservations: [],
//     };

//     for (let j = 1; j <= reservationsPerTable; j++) {
//       const currentDate = new Date();
//       const dayOfWeek = currentDate.getDay(); // Sunday = 0, Monday = 1, etc.

//       let dayHours = restaurantOpeningHours.find((hours) => {
//         return hours.day.includes(getDayName(dayOfWeek));
//       });

//       if (
//         !dayHours ||
//         dayHours.open === "Closed" ||
//         dayHours.close === "Closed"
//       ) {
//         dayHours = {
//           day: dayHours?.day || getDayName(dayOfWeek),
//           open: "00:00 AM",
//           close: "00:00 PM",
//         };
//       }

//       const reservationTime = createReservation(dayHours.open, dayHours.close);

//       if (reservationTime) {
//         table.reservations.push({
//           partySize: Math.floor(Math.random() * 4) + 1,
//           guestInfo: {
//             guestFirstName: `FirstName${j}`,
//             guestLastName: `LastName${j}`,
//             phoneNumber: `+972-3-${Math.floor(
//               1000000 + Math.random() * 9000000
//             )}`,
//             email: `guest${j}@example.com`,
//           },
//           reservationTime,
//           position: `Table ${i} - Slot ${j}`,
//           notes: `Special request ${j}`,
//         });
//       }
//       console.log(table.reservations.length);
//     }

//     tablesData.push(table);
//   }

//   return tablesData;
// }

// // Helper function to get the day of the week as a string
// function getDayName(dayOfWeek: number): string {
//   const daysOfWeek = [
//     "Sunday",
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//   ];
//   return daysOfWeek[dayOfWeek];
// }

// async function seed() {
//   try {
//     await connectDB();
//     console.log("Connected to MongoDB");

//     // Clear existing data
//     await Restaurant.deleteMany({});
//     console.log("Existing data deleted.");

//     const restaurantPromises = restaurantAddresses.map((address) =>
//       getRestaurantData(address)
//     );

//     const restaurants = await Promise.all(restaurantPromises);

//     if (!restaurants) {
//       throw new Error("Failed to fetch restaurant data.");
//     }

//     const tablePromises = restaurants.map(async (restaurantData, index) => {
//       if (!restaurantData || restaurantData.openingHours.length === 0)
//         return null;

//       const restaurant: IRestaurant = {
//         name: restaurantAddresses[index].name,
//         address: restaurantAddresses[index].address,
//         categories: restaurantData.categories,
//         shortDescription: restaurantData.shortDescription,
//         mainPhoto: restaurantData.mainPhoto,
//         contactInfo: restaurantData.contactInfo,
//         location: {
//           lat: restaurantData.lat,
//           lng: restaurantData.lng,
//         },
//         about: restaurantData.about,
//         openingHours: restaurantData.openingHours,
//         tables: createTablesAndReservations(5, 10, restaurantData.openingHours),
//       };

//       return await Restaurant.create(restaurant);
//     });

//     await Promise.all(tablePromises);
//     console.log("Seed data successfully inserted.");
//   } catch (error) {
//     console.error("Error seeding data:", error);
//   } finally {
//     mongoose.connection.close();
//   }
// }

// seed();
