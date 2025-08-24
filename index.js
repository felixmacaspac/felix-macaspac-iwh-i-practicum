const express = require("express");
const axios = require("axios");
const app = express();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = "";

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.
// * Code for Route 1 goes here
app.get("/", async (req, res) => {
  const restaurants =
    "https://api.hubspot.com/crm/v3/objects/2-49094580?properties=resturant_name,restaurant_location,restaurant_age";
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };
  try {
    const resp = await axios.get(restaurants, { headers });
    const data = resp.data.results;

    res.render("homepage", {
      title: "Homepage Custom Objects Restaurants | HubSpot APIs",
      data,
    });
  } catch (error) {
    console.error(error);
  }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.
// * Code for Route 2 goes here
app.get("/update-cobj", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    res.render("update", {
      title: "Add Custom Object Form | Integrating With HubSpot I Practicum.",
      method_type: "add",
      data: {
        properties: {
          resturant_name: "",
          restaurant_location: "",
          restaurant_age: "",
        },
      },
    });
    return;
  }

  const restaurants = `https://api.hubspot.com/crm/v3/objects/2-49094580/${id}?properties=resturant_name,restaurant_location,restaurant_age`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };

  try {
    const resp = await axios.get(restaurants, { headers });
    const data = resp.data;

    res.render("update", {
      title:
        "Update Custom Object Form | Integrating With HubSpot I Practicum.",
      method_type: "update",
      data,
    });
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.
// * Code for Route 3 goes here
app.post("/update-cobj", async (req, res) => {
  const id = req.query.id;

  const restaurantData = {
    properties: {
      resturant_name: req.body.resturant_name,
      restaurant_location: req.body.restaurant_location,
      restaurant_age: req.body.restaurant_age,
    },
  };

  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };

  try {
    if (id) {
      const updateRestaurant = `https://api.hubspot.com/crm/v3/objects/2-49094580/${id}`;
      await axios.patch(updateRestaurant, restaurantData, { headers });
    } else {
      const createRestaurant = `https://api.hubspot.com/crm/v3/objects/2-49094580`;
      await axios.post(createRestaurant, restaurantData, { headers });
    }

    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
});

app.listen(3000, () => console.log("Listening on http://localhost:3000"));
