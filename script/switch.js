  const darkSwitch = document.getElementById("darkSwitch");
  const body = document.body;

  // load saved theme
  if(localStorage.getItem("theme") === "dark"){
    body.classList.add("dark");
    darkSwitch.checked = true;
  }

  darkSwitch.addEventListener("change", () => {
    if(darkSwitch.checked){
      body.classList.add("dark");
      localStorage.setItem("theme","dark");
    } else {
      body.classList.remove("dark");
      localStorage.setItem("theme","light");
    }
  });