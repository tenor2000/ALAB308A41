import * as Carousel from "./Carousel.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
const API_KEY = process.env.API_KEY;

const API_URL = "https://api.thecatapi.com/v1";

/**
 * 1. Create an async function "initialLoad" that does the following:
 * - Retrieve a list of breeds from the cat API using fetch().
 * - Create new <options> for each of these breeds, and append them to breedSelect.
 *  - Each option should have a value attribute equal to the id of the breed.
 *  - Each option should display text equal to the name of the breed.
 * This function should execute immediately.
 */

/*
let catData = []; // stored for infoDump

async function initialLoad() {
  const response = await fetch(API_URL + "/breeds");
  const jsonData = await response.json();

  catData = jsonData;

  jsonData.forEach((breed) => {
    const option = document.createElement("option");
    option.value = breed.id;
    option.textContent = breed.name;
    breedSelect.appendChild(option);
  });
}

initialLoad();


*/

/**
 * 2. Create an event handler for breedSelect that does the following:
 * - Retrieve information on the selected breed from the cat API using fetch().
 *  - Make sure your request is receiving multiple array items!
 *  - Check the API documentation if you're only getting a single object.
 * - For each object in the response array, create a new element for the carousel.
 *  - Append each of these new elements to the carousel.
 * - Use the other data you have been given to create an informational section within the infoDump element.
 *  - Be creative with how you create DOM elements and HTML.
 *  - Feel free to edit index.html and styles.css to suit your needs, but be careful!
 *  - Remember that functionality comes first, but user experience and design are important.
 * - Each new selection should clear, re-populate, and restart the Carousel.
 * - Add a call to this function to the end of your initialLoad function above to create the initial carousel.
 */

/*
breedSelect.addEventListener("change", async (e) => {
  const breedId = e.target.value;

  const response = await fetch(
    API_URL + `/images/search?limit=10&breed_ids=${breedId}`
  );
  const jsonData = await response.json();

  console.log(jsonData);
  Carousel.clear();
  jsonData.forEach((image) => {
    const item = Carousel.createCarouselItem(image.url, "cat", image.id);
    Carousel.appendCarousel(item);
  });
  Carousel.start();

  while (infoDump.firstChild) {
    infoDump.removeChild(infoDump.firstChild);
  }

  const infoObj = catData.find((item) => item.id === breedId);
  const title = document.createElement("h2");
  title.textContent = infoObj.name;
  const desc = document.createElement("p");
  desc.textContent = infoObj.description;
  infoDump.appendChild(title);
  infoDump.appendChild(desc);
});

*/

/**
 * 3. Fork your own sandbox, creating a new one named "JavaScript Axios Lab."
 */

/**
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */

let catData = [];

async function initialLoad() {
  const response = await axios.get(API_URL + "/breeds", {
    headers: { "Content-type": "application/json; charset=UTF-8" },
  });

  catData = response.data;

  catData.forEach((breed) => {
    const option = document.createElement("option");
    option.value = breed.id;
    option.textContent = breed.name;
    breedSelect.appendChild(option);
  });
}

breedSelect.addEventListener("change", async (e) => {
  const breedId = e.target.value;

  const response = await axios.get(
    API_URL + `/images/search?limit=10&breed_ids=${breedId}`,
    {
      onDownloadProgress: (progressEvent) => {
        updateProgress(progressEvent);
      },
    }
  );
  const jsonData = response.data;
  const warn = document.createElement("h1");
  warn.style.color = "red";

  Carousel.clear();
  if (jsonData.length > 0) {
    jsonData.forEach((image) => {
      const item = Carousel.createCarouselItem(image.url, "cat", image.id);
      Carousel.appendCarousel(item);
    });
  } else {
    warn.textContent = "There has never been a sighting of this cat.";
  }
  Carousel.start();

  while (infoDump.firstChild) {
    infoDump.removeChild(infoDump.firstChild);
  }
  if (warn.textContent) {
    infoDump.appendChild(warn);
  }
  const infoObj = catData.find((item) => item.id === breedId);
  const title = document.createElement("h2");
  title.textContent = infoObj.name;
  const desc = document.createElement("p");
  desc.textContent = infoObj.description;
  infoDump.appendChild(title);
  infoDump.appendChild(desc);
});

/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */

axios.interceptors.request.use((request) => {
  progressBar.style.width = "0%";
  document.body.style.cursor = "progress";
  console.log("Request sent.");
  console.time("Request/Response time");
  return request;
});

axios.interceptors.response.use(
  (response) => {
    document.body.style.cursor = "";
    console.log("Successful response!");
    console.timeEnd("Request/Response time");
    return response;
  },
  (error) => {
    console.log("Unsuccesful response...");
    throw error;
  }
);

initialLoad();

/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */

function updateProgress(progressEvent) {
  const percentage = (progressEvent.loaded / progressEvent.total) * 100;
  progressBar.style.width = `${percentage}%`;
}

/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */
/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */
export async function favourite(imgId) {
  const userIDexample = "user-123";

  const getResponse = await axios.get(
    API_URL + `/favourites?sub_id=${userIDexample}`,
    {
      headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
    }
  );

  const targetObj = getResponse.data.find((obj) => {
    if (obj.image_id === imgId) {
      return obj;
    }
    return false;
  });

  if (targetObj) {
    // console.log("Favorite found");
    const deleteResponse = await axios.delete(
      API_URL + `/favourites/${targetObj.id}`,
      {
        headers: {
          "x-api-key": API_KEY,
        },
      }
    );
    console.log(deleteResponse.data);
  } else {
    // console.log("fav not found");
    const rawBody = JSON.stringify({
      image_id: imgId,
      sub_id: userIDexample,
    });
    const postResponse = await axios.post(API_URL + "/favourites", rawBody, {
      headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
    });
    // console.log(getResponse.data);
  }
}
/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */

async function getFavourites() {
  const userIDexample = "user-123";

  const getResponse = await axios.get(
    API_URL + `/favourites?sub_id=${userIDexample}`,
    {
      headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
    }
  );
  const jsonData = getResponse.data;

  // CODE is not put in function because 'favourites' endpoint Object is formatted differently than 'image' endpoint
  Carousel.clear();
  jsonData.forEach((image) => {
    const item = Carousel.createCarouselItem(
      image.image.url,
      "cat",
      image.image.id
    );
    Carousel.appendCarousel(item);
  });
  Carousel.start();

  while (infoDump.firstChild) {
    infoDump.removeChild(infoDump.firstChild);
  }
}

getFavouritesBtn.addEventListener("click", getFavourites);

/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */
