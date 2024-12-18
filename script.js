document.addEventListener("DOMContentLoaded", () => {
    fetch("https://raw.githubusercontent.com/And-reyya/scumtools/main/scumdata.json")
        .then((response) => response.json())
        .then((data) => {
            let weaponsData = data.scumjancsi;
            let otherData = data.scumbela;
            let searchInput = document.querySelector(".search-input");
            let ammoDropdown = document.querySelector("#pontdrop");
            let categoryDropdown = document.querySelector("#marikadrop");
            let weaponDropdown = document.querySelector("#tundedrop");
            let magazineDropdown = document.querySelector("#dropmonika");
            let otherDropdown = document.querySelector("#vikidrop");

            let selectedAmmoIndex = -1;
            let selectedCategoryIndex = -1;
            let selectedWeaponIndex = -1;
            let selectedMagazineIndex = -1;
            let selectedOtherIndex = -1;

            function highlightSelection(items, index) {
                items.forEach((item, i) => {
                    item.classList.remove("selected");
                    if (i === index) {
                        item.classList.add("selected");
                        item.scrollIntoView({ block: "nearest", behavior: "smooth" });
                    }
                });
            }

            function populateCategoryDropdown() {
                let categories = ["WEAPON", "MAGAZINE"];
                categoryDropdown.innerHTML = "";
                categories.forEach((category) => {
                    let div = document.createElement("div");
                    div.textContent = category;
                    div.classList.add("dropdown-item");
                    categoryDropdown.appendChild(div);
                    div.addEventListener("click", () => {
                        handleCategorySelection(category);
                        categoryDropdown.style.display = "none";
                    });
                });
                if (categories.length > 0) {
                    categoryDropdown.style.display = "block";
                    categoryDropdown.classList.add("show");
                    categoryDropdown.setAttribute("tabindex", "0");
                    categoryDropdown.focus();
                }
            }

            function handleCategorySelection(category) {
                if (category === "MAGAZINE") {
                    showMagazines();
                } else {
                    let matchingWeapons =
                        weaponsData
                            .find((item) => item.ammo.replace(".", "") === searchInput.value.replace(".", ""))
                            ?.weapon || [];
                    weaponDropdown.innerHTML = "";
                    matchingWeapons.forEach((weapon) => {
                        let div = document.createElement("div");
                        div.textContent = weapon;
                        div.classList.add("dropdown-item");
                        weaponDropdown.appendChild(div);
                        div.addEventListener("click", () => {
                            searchInput.value += searchInput.value ? `; ${weapon}` : weapon;
                            searchInput.focus();
                            weaponDropdown.style.display = "none";
                            categoryDropdown.style.display = "none";
                        });
                    });
                    if (matchingWeapons.length > 0) {
                        weaponDropdown.style.display = "block";
                        weaponDropdown.classList.add("show");
                        weaponDropdown.setAttribute("tabindex", "0");
                        weaponDropdown.focus();
                    }
                }
            }

            function showMagazines() {
                fetch("https://raw.githubusercontent.com/And-reyya/scummonika/main/scummonika.json")
                    .then((response) => response.json())
                    .then((magazineData) => {
                        let magazines = [];
                        if (searchInput.value) {
                            const selectedAmmo = magazineData.scummonika.find(
                                (item) => item.ammo.replace(".", "") === searchInput.value.replace(".", "")
                            );
                            magazines = selectedAmmo ? selectedAmmo.magazine : [];
                        }
                        magazineDropdown.innerHTML = "";
                        magazines.forEach((magazine) => {
                            let div = document.createElement("div");
                            div.textContent = magazine;
                            div.classList.add("dropdown-item");
                            magazineDropdown.appendChild(div);
                            div.addEventListener("click", () => {
                                searchInput.value += searchInput.value ? `; ${magazine}` : magazine;
                                searchInput.focus();
                                magazineDropdown.style.display = "none";
                                categoryDropdown.style.display = "none";
                            });
                        });
                        if (magazines.length > 0) {
                            magazineDropdown.style.display = "block";
                            magazineDropdown.classList.add("show");
                            magazineDropdown.setAttribute("tabindex", "0");
                            magazineDropdown.focus();
                        } else {
                            magazineDropdown.style.display = "none";
                        }
                    })
                    .catch((error) => {
                        console.error("Error loading magazine JSON:", error);
                    });
            }

            function filterWeapons(inputValue) {
                let filteredWeapons = otherData.filter((weapon) =>
                    weapon.toLowerCase().startsWith(inputValue.toLowerCase())
                );
                otherDropdown.innerHTML = "";
                filteredWeapons.forEach((weapon) => {
                    let div = document.createElement("div");
                    div.textContent = weapon;
                    div.classList.add("dropdown-item");
                    otherDropdown.appendChild(div);
                    div.addEventListener("click", () => {
                        searchInput.value = weapon;
                        otherDropdown.style.display = "none";
                    });
                });
                if (filteredWeapons.length > 0) {
                    otherDropdown.style.display = "block";
                    otherDropdown.classList.add("show");
                } else {
                    otherDropdown.style.display = "none";
                }
            }

            searchInput.addEventListener("input", () => {
                let inputValue = searchInput.value.toLowerCase().replace(".", "");
                selectedAmmoIndex = -1;
                let filteredAmmo;
                if (searchInput.value.startsWith(".")) {
                    filteredAmmo = weaponsData.filter((item) =>
                        item.ammo.replace(".", "").startsWith(inputValue)
                    );
                } else if (inputValue === "") {
                    ammoDropdown.style.display = "none";
                    otherDropdown.style.display = "none";
                    return;
                } else {
                    filteredAmmo = weaponsData.filter((item) =>
                        item.ammo.replace(".", "").toLowerCase().startsWith(inputValue)
                    );
                }
                ammoDropdown.innerHTML = "";
                filteredAmmo.forEach((ammo) => {
                    let div = document.createElement("div");
                    div.textContent = ammo.ammo;
                    div.classList.add("dropdown-item");
                    ammoDropdown.appendChild(div);
                    div.addEventListener("click", () => {
                        searchInput.value = ammo.ammo;
                        ammoDropdown.style.display = "none";
                        populateCategoryDropdown();
                    });
                });
                if (filteredAmmo.length > 0) {
                    ammoDropdown.style.display = "block";
                    ammoDropdown.classList.add("show");
                } else {
                    ammoDropdown.style.display = "none";
                    ammoDropdown.classList.remove("show");
                }
                filterWeapons(searchInput.value);
            });

            searchInput.addEventListener("keydown", (event) => {
                let ammoItems = ammoDropdown.querySelectorAll(".dropdown-item");
                let categoryItems = categoryDropdown.querySelectorAll(".dropdown-item");
                let weaponItems = weaponDropdown.querySelectorAll(".dropdown-item");

                if (ammoDropdown.style.display === "block" && ammoItems.length > 0) {
                    if (event.key === "ArrowDown") {
                        event.preventDefault();
                        selectedAmmoIndex = (selectedAmmoIndex + 1) % ammoItems.length;
                        highlightSelection(ammoItems, selectedAmmoIndex);
                    } else if (event.key === "ArrowUp") {
                        event.preventDefault();
                        selectedAmmoIndex = (selectedAmmoIndex - 1 + ammoItems.length) % ammoItems.length;
                        highlightSelection(ammoItems, selectedAmmoIndex);
                    } else if (event.key === "Enter") {
                        event.preventDefault();
                        if (selectedAmmoIndex >= 0 && selectedAmmoIndex < ammoItems.length) {
                            ammoItems[selectedAmmoIndex].click();
                        }
                    }
                } else if (categoryDropdown.style.display === "block" && categoryItems.length > 0) {
                    if (event.key === "ArrowDown") {
                        event.preventDefault();
                        selectedCategoryIndex = (selectedCategoryIndex + 1) % categoryItems.length;
                        highlightSelection(categoryItems, selectedCategoryIndex);
                    } else if (event.key === "ArrowUp") {
                        event.preventDefault();
                        selectedCategoryIndex = (selectedCategoryIndex - 1 + categoryItems.length) % categoryItems.length;
                        highlightSelection(categoryItems, selectedCategoryIndex);
                    } else if (event.key === "Enter") {
                        event.preventDefault();
                        if (selectedCategoryIndex >= 0 && selectedCategoryIndex < categoryItems.length) {
                            categoryItems[selectedCategoryIndex].click();
                        }
                    }
                } else if (weaponDropdown.style.display === "block" && weaponItems.length > 0) {
                    if (event.key === "ArrowDown") {
                        event.preventDefault();
                        selectedWeaponIndex = (selectedWeaponIndex + 1) % weaponItems.length;
                        highlightSelection(weaponItems, selectedWeaponIndex);
                    } else if (event.key === "ArrowUp") {
                        event.preventDefault();
                        selectedWeaponIndex = (selectedWeaponIndex - 1 + weaponItems.length) % weaponItems.length;
                        highlightSelection(weaponItems, selectedWeaponIndex);
                    } else if (event.key === "Enter") {
                        event.preventDefault();
                        if (selectedWeaponIndex >= 0 && selectedWeaponIndex < weaponItems.length) {
                            weaponItems[selectedWeaponIndex].click();
                        }
                    }
                }
            });
        })
        .catch((error) => {
            console.error("Error loading JSON:", error);
        });
});
