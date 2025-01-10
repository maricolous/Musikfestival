const spaceId = localStorage.getItem("space_id"); // Ersätt med ditt Space ID
const accessToken = localStorage.getItem("access_token"); // Ersätt med din Access Token
const urlFestival = `https://cdn.contentful.com/spaces/${spaceId}/entries?access_token=${accessToken}&content_type=artist`;

// Hämta koncertdata
const fetchFestivalData = async () => {
  try {
    const response = await fetch(urlFestival);
    if (!response.ok) {
      throw new Error("Något gick fel");
    }
    const festivalData = await response.json();

    // Mappar datan som hämtas ovan

    const concertsHtml = festivalData.items.map((post) => {
      const genreId = post.fields.genre.sys.id;
      const stageId = post.fields.stage.sys.id;
      const dayId = post.fields.day.sys.id;

      // Mappar genre-datan för att få ut name på genren

      const genre = festivalData.includes.Entry.find(
        (entry) => entry.sys.id === genreId
      );

      // Mappar stage-datan för att få ut name, description och area

      const stage = festivalData.includes.Entry.find(
        (entry) => entry.sys.id === stageId
      );

      const area = stage.fields.area;
      const stageDescription = stage.fields.description;

      // Mappar day-datan för att få ut day och description

      const day = festivalData.includes.Entry.find(
        (entry) => entry.sys.id === dayId
      );

      const dateString = day.fields.date;
      const dateDescription = day.fields.description;

      // Omvandlar datumformatet

      const date = new Date(dateString);

      const formattedDate = date.toLocaleDateString("en-EN", {
        weekday: undefined,
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      // Returnera datan

      return {
        name: post.fields.name,
        description: post.fields.description,
        genre: genre.fields.name,
        genreDescritption: genre.fields.description,
        stage: stage.fields.name,
        day: formattedDate,
        descriptionDate: dateDescription,
        descriptionStage: stageDescription,
        area: area,
      };
    });

    // Skapar array med unika genres

    const genreNames = [...new Set(concertsHtml.map((post) => post.genre))];

    // Skapar dropdownmen för att filtrera på genre

    const genreDropdown = document.getElementById("genre-filter");

    const defaultGenreOption = document.createElement("option");
    defaultGenreOption.value = "all";
    defaultGenreOption.textContent = "All Genres";
    genreDropdown.appendChild(defaultGenreOption);

    genreNames.forEach((genre) => {
      const option = document.createElement("option");
      option.value = genre;
      option.textContent = genre;
      genreDropdown.appendChild(option);
    });

    // Skapar array med unika stages

    const stageNames = [...new Set(concertsHtml.map((post) => post.stage))];

    // Skapar dropdownmen för att filtrera på stage

    const stageDropdown = document.getElementById("stage-filter");

    const defaultStageOption = document.createElement("option");
    defaultStageOption.value = "all";
    defaultStageOption.textContent = "All Stages";
    stageDropdown.appendChild(defaultStageOption);

    stageNames.forEach((stage) => {
      const option = document.createElement("option");
      option.value = stage;
      option.textContent = stage;
      stageDropdown.appendChild(option);
    });

    // Skapar array med unika dagar, formatterar dagarna samt sorterar dem i stigande ordning

    const sortedDayNames = [...new Set(concertsHtml.map((post) => post.day))]
      .map((day) => ({
        formattedDate: day,
        dateObject: new Date(day),
      }))
      .sort((a, b) => a.dateObject - b.dateObject)
      .map((entry) => entry.formattedDate);

    // Skapar dropdownmen för att filtrera på day

    const dayDropdown = document.getElementById("day-filter");

    const defaultDayOption = document.createElement("option");
    defaultDayOption.value = "all";
    defaultDayOption.textContent = "All days";
    dayDropdown.appendChild(defaultDayOption);

    sortedDayNames.forEach((day) => {
      const option = document.createElement("option");
      option.value = day;
      option.textContent = day;
      dayDropdown.appendChild(option);
    });

    // Skapar posts

    const postContainer = document.getElementById("concerts-container");

    const renderPosts = (posts) => {
      const postHTML = posts
        .map((post) => {
          return `<article class="post ${post.genre.replace(
            /[^a-zA-Z0-9]/g,
            ""
          )}" id="${post.name.replace(/[^a-zA-Z0-9]/g, "")}">
                    <div class="overlay">
                        <section class="dateWrap">          
                          <div class="date">
                            <p class="dayName">${post.descriptionDate}</p>
                            <p>${post.day}</p>
                          </div>
                        </section>
                        <section class="koncert-details">
                          <h2>${post.name}</h2>
                          
                          <div class="stage">
                          
                          <div class="stage-name"><p>${
                            post.stage
                          } <span class="info"> ⅈ</span></p>
                          <p class="area"><strong>Area:</strong> ${
                            post.area
                          }</p></div>
                          <div class="stage-info hidden">
                            <p>${post.descriptionStage}</p>
                          </div>
                          </div>
                        
                          <div class="concert-description"> <p>${
                            post.description
                          }</p></div>
                        
                          <p class="genre">GENRE: ${post.genre}</p>
                          

                          </section>
                          </div>
                        
                </article>`;
        })
        .join("");

      postContainer.innerHTML = postHTML;

      const setBackgroundImage = (divID, imageURL) => {
        const div = document.getElementById(divID);
        if (div) {
          div.style.backgroundImage = `url(${imageURL})`;
          div.style.backgroundSize = `cover`;
        }
      };

      setBackgroundImage("BillieEilish", "BillieElish.jpeg");
      setBackgroundImage("ArianaGrande", "ArianaGrande.webp");
      setBackgroundImage("TravisScott", "TravisScott.webp");
      setBackgroundImage("TheWeeknd", "the-weeknd.avif");
      setBackgroundImage("ImagineDragons", "imagine-dragons.jpg");
      setBackgroundImage("Slipknot", "Slipknot.webp");
      setBackgroundImage("Metallica", "Metallica.webp");
      setBackgroundImage("SnarkyPuppy", "snarky-puppy.jpg");
      setBackgroundImage("TheLumineers", "TheLumineers.jpg");
      setBackgroundImage("Drake", "drake.webp");
    };

    // Funktion för att sortera posts efter datum

    const sortPostsByDay = (posts) => {
      return posts.sort((a, b) => {
        const dateA = new Date(a.day);
        const dateB = new Date(b.day);
        return dateA - dateB;
      });
    };

    const sortedAllPosts = sortPostsByDay(concertsHtml);

    // Uppdaterar valda filter

    const updateChosenFilters = (day, genre, stage) => {
      document.getElementById("chosen-day").textContent = `Day: ${day}`;
      document.getElementById("chosen-genre").textContent = `Genre: ${genre}`;
      document.getElementById("chosen-stage").textContent = `Stage: ${stage}`;
    };

    const errorContainer = document.getElementById("error-message");

    // Funktion för att filtrera

    const filterPosts = () => {
      const selectedDay = document.getElementById("day-filter").value;
      const selectedGenre = document.getElementById("genre-filter").value;
      const selectedStage = document.getElementById("stage-filter").value;

      updateChosenFilters(selectedDay, selectedGenre, selectedStage);

      const element = document.getElementById("chosen-filters");
      element.classList.remove("hidden");

      // Filtrera posts efter valda values

      const filteredPosts = concertsHtml.filter((post) => {
        const matchDay = selectedDay === "all" || post.day === selectedDay;
        const matchGenre =
          selectedGenre === "all" || post.genre === selectedGenre;
        const matchStage =
          selectedStage === "all" || post.stage === selectedStage;
        return matchDay && matchGenre && matchStage;
      });

      // Function för att visa "no posts found" meddelande

      if (filteredPosts.length === 0) {
        errorContainer.innerHTML =
          "<strong>Oops!</strong> No Concerts found. Try using a different filter.";
      } else {
        const sortedFilteredPosts = sortPostsByDay(filteredPosts);
        renderPosts(sortedFilteredPosts);
        errorContainer.innerHTML = "";
      }

      const sortedFilteredPosts = sortPostsByDay(filteredPosts);
      renderPosts(sortedFilteredPosts);
    };

    // Funktion för att rensa filter och ta fram alla posts

    const clearFilters = () => {
      document.getElementById("day-filter").value = "all";
      document.getElementById("genre-filter").value = "all";
      document.getElementById("stage-filter").value = "all";

      const element = document.getElementById("chosen-filters");
      element.classList.add("hidden");

      const sortedAllPosts = sortPostsByDay(concertsHtml);
      renderPosts(sortedAllPosts);
      errorContainer.innerHTML = "";
    };

    // Event listeners för knapparna

    document
      .getElementById("filter-button")
      .addEventListener("click", filterPosts);

    document
      .getElementById("clear-button")
      .addEventListener("click", clearFilters);

    // Event listener och funktion för att visa stage info

    postContainer.addEventListener("click", (event) => {
      const infoIcon = event.target.closest(".info");
      if (infoIcon) {
        const stageInfo = infoIcon
          .closest(".post")
          .querySelector(".stage-info");
        stageInfo.classList.toggle("hidden");
      }
    });

    // Event listener och funktion för att visa stage info
    renderPosts(sortedAllPosts);
    updateChosenFilters("All", "All", "All");
  } catch (error) {
    console.error("Ett fel inträffade vid hämtning av data:", error);
  }
};

fetchFestivalData();
