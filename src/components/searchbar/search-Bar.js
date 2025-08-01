function extractBodyContent(html) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const bodyElement = tempDiv.querySelector("body");
    return bodyElement ? bodyElement.innerHTML : html;
}

export async function renderSearchBar(targetElement) {
    if (!targetElement) return;
    
    const html = await fetch("src/components/searchbar/search-Bar.html").then(function(res) { 
        return res.text(); 
    });
    
    const bodyContent = extractBodyContent(html);
    targetElement.innerHTML = bodyContent;
    
    const searchForm = targetElement.querySelector(".search-form");
    const searchInput = targetElement.querySelector(".search-form__input");
    const previousSearchList = targetElement.querySelector(".previous-search-list");
    
    if (searchForm) {
        searchForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                console.log("검색어:", searchTerm);
            }
        });
    }
    
    const removeButtons = targetElement.querySelectorAll(".previous-search-item__remove");
    removeButtons.forEach(button => {
        button.addEventListener("click", function() {
            const listItem = this.closest(".previous-search-item");
            if (listItem) {
                listItem.remove();
            }
        });
    });
}
