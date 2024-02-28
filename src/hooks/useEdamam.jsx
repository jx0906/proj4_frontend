function useEdamam() {
  const sendEdamamRequest = async (url) => {
    try {
      const res = await fetch(url);
      const edamamData = await res.json();
      if (!res.ok) {
        throw new Error(data.errorMsg ? data.errorMsg : "Something went wrong");
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
      ? "Difficult"
      : "Easy";
  };

  const formattedCategories = (dishCat) => {
    return dishCat === "biscuits and cookies" ? "Biscuits" : "Bread";
  };

  const edamamRecpUri = (str) => {
    const apiUrl = "https://api.edamam.com/api/recipes/v2/";
    let startIdx = apiUrl.lastIndexOf("/");
    return str.substring(startIdx + 1, startIdx + 32);
  };

  return {
    sendEdamamRequest,
    derivedLevelofDiff,
    formattedCategories,
    edamamRecpUri,
  };
}

export default useEdamam;
