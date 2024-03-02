
# [todaybakewhat](https://todaybakewhat.onrender.com)
Developed with the objective to support users in their search for The Bake Recipe of the day, this app brings together recipes thoughtfully created by the todaybakewhat community and data aggregated from third party APIs, overlayed with features like note taking to record bake observations and comments, track pantry inventory and curate shopping lists, as well as customisable price trackers to enable the smart user to compare prices of the ingredients required for the bake, all from the convenience of one app.

## Screenshots
Landing page for the enthusiastic baker, with recipe contributions from the todaybakewhat community and data aggregated from third party APIs to enrich the repetoire  
<img width="796" alt="image" src="https://github.com/jx0906/proj4_frontend/assets/142247158/ed325b52-bc20-41c4-9847-877e055687d3">  

Complete recipe information with options for users to share recipes through a link, and for logged on users, to bookmark recipes for future reference, edit self-created recipes and append notes.  
<img width="520" alt="image" src="https://github.com/jx0906/proj4_frontend/assets/142247158/e44e4ac9-5882-4785-843b-f62f095b52a7">  

Recipe Management - conveniently search, create, edit, and record your baking adventures all in one platform  
<img width="751" alt="image" src="https://github.com/jx0906/proj4_frontend/assets/142247158/c6fcafdc-3aa9-40f0-a994-1f12e8f8270b">
 
<img width="747" alt="image" src="https://github.com/jx0906/proj4_frontend/assets/142247158/982b69f1-b1e1-45f7-b9c1-cb21be249de4">

<img width="523" alt="image" src="https://github.com/jx0906/proj4_frontend/assets/142247158/b081ca40-9bd7-45d0-b9b6-4aca6a58e206">

<img width="835" alt="image" src="https://github.com/jx0906/proj4_frontend/assets/142247158/0238d7cd-0508-449c-80f0-23a893c9e2d7">

Separate permissions for admin and users  
<img width="682" alt="image" src="https://github.com/jx0906/proj4_frontend/assets/142247158/e03c585f-1b52-4d94-9c55-3164b509b6a5">

## Technologies Used

- Javascript, HTML, CSS

### Backend API/DB ([Source Repository](https://github.com/jx0906/proj4-backend))

- [Mongo DB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Express](https://expressjs.com/)

### Frontend Application

- [React](https://react.dev/)
- [React router dom](https://reactrouter.com/en/main) -Routing system
- [Mantine](https://mantine.dev/) -UI Library
- [Mantine form](https://mantine.dev/form/use-form/) -Form validation
- [dayjs](https://www.npmjs.com/package/dayjs) - Date formatting
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - User Authentication and Sign in
- [Tabler icons](https://tabler.io/icons)
- [Embla Carousel](https://www.embla-carousel.com/)

### PaaS

- [Render](https://render.com/)

## Product Design Documentations

- [User Stories](https://trello.com/b/MXpNhZVq/todaybakewhat)
- [Wireframe](https://www.figma.com/file/W64GG2WStSC9YhuQr7aYYS/today-bake-what%3F?type=design&node-id=1848-2927&mode=design)
- [Brandboard](https://drive.google.com/file/d/1QS5OU1KiXaRBT_Ld9ah4mofdfDTLS_80/view?usp=sharing)
- [Data model ERD](https://app.diagrams.net/#Hjx0906%2Fproj4-backend%2Fmain%2FERD.drawio)
- [Overview of API](https://docs.google.com/spreadsheets/d/1onAcolqETuYnLY4E1aEvDwoeBZb6KpkL_CIPehhYmws/edit?pli=1#gid=1899189910)
- [Frontend page structure](https://docs.google.com/spreadsheets/d/1onAcolqETuYnLY4E1aEvDwoeBZb6KpkL_CIPehhYmws/edit?pli=1#gid=0)

## Key Challenges/takeaways

- I had always been curious about how a team could work together to develop an app so am particuarly thankful for the experience this round to work on one from start to "end" all by myself. Through the process, I experienced first hand and gleaned insights on the expected roles and responsibilities of various actors in the team, and how these would have shaped their perpsectives in the app development process. As I stepped in the shoes of each role to develop the app (eg, backend dev, UI/UX designer, product manager), I also gained greater awareness of my strengths and weaknesses, as well as my interests in specific software engineering functions. 

- On the technical front, I gained more confidence in my coding skills - evident in my reduced apprehension to self-debug and troubleshoot, and had my first dips in the creation of my own "hook" to fetch and process the external data for the app operations, as well as enabling keyword search through indexing.

### Creation of "fetchEdamama" hook to facilitate fetch of external recipe data
- Besides enabling me to streamline multiple operations which I would have to repeatedly define and call throughout the development of the app, the sense of satisfaction also came from knowing that a fellow SE could benefit from the hook for efficiency gains.  
```
function useEdamam() {
  const sendEdamamRequest = async (url) => {
    try {
      const res = await fetch(url);
      const edamamData = await res.json();
      if (!res.ok) {
        throw new Error(
          edamamData.errorMsg ? edamamData.errorMsg : "Something went wrong"
        );
      }
      return edamamData;
    } catch (err) {
      console.error("Error fetching Edamam list:", err);
    }
  };

  // no info on lvl of diff, so mapping manually by own standards
  const derivedLevelofDiff = (ingredientLines) => {
    const ingredientCount = ingredientLines.length;
    return ingredientCount >= 5 && ingredientCount <= 10
      ? "Intermediate"
      : ingredientCount > 10
      ? "Advanced"
      : "Easy";
  };

  const formattedCategories = (dishCat) => {
    return dishCat === "biscuits and cookies" ? "Biscuits" : "Bread";
  };

  const edamamRecpUri = (str) => {
    const apiUrl = "https://api.edamam.com/api/recipes/v2/";
    let startIdx = apiUrl.lastIndexOf("/");
    return str.substring(startIdx + 1, startIdx + 33);
  };

  return {
    sendEdamamRequest,
    derivedLevelofDiff,
    formattedCategories,
    edamamRecpUri,
  };
}

export default useEdamam;

```

### Enabling keyword search through indexing and regex searches
- This first hand experience demystified the keyword searches I frequently performed as a user. Of particular surprise was the simplicity of its implementation.
```
util/textIndexes.js
...
// Apply the text search plugin to the data schemas
Recipe.schema.plugin(require("mongoose-text-search"));
User.schema.plugin(require("mongoose-text-search"));

// Create text indexes
Recipe.schema.index({
  name: "text",
  description: "text",
  "ingredients.name": "text",
});

User.schema.index({
  name: "text",
  email: "text",
});

...

```

recipeModel.jsx
```
async function getByKeyword(searchTerm) {
  // use regex to match the search term against intended database fields.
  const searchTermRegex = new RegExp(searchTerm, "i"); // 'i' for case-insensitive search

  const data = await recipeDao
    .find({
      $or: [
        { name: { $regex: searchTermRegex } }, // 'i' flag for case-insensitive search
        { description: { $regex: searchTermRegex } },
        { "ingredients.name": { $regex: searchTermRegex } },
        { instructions: { $regex: searchTermRegex } },
      ],
    })
    .sort({ name: 1 }); // ascending order

  return data;
}

```

## Next Steps

- Refine media upload feature
- Enhance recipe CRUD operations to complement the app function (filters, notes, highlight/comments)
- Consider responsive design to enhance user experience

## References and Inspirations

- [Food Network](https://www.foodnetwork.com/) - UI/UX for app
